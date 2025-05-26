import Tabs from '../../components/budgetLine/Tabs';
import React, {useEffect, useState, useRef} from 'react';
import Header from '../../components/layout/Header';
import Dialogue from '../../components/budgetLine/Dialogue';
import Datalist from '../../components/budgetLine/budgetLIneOf/Datalist';
import InitiateForm from '../../components/budgetLine/budgetLIneOf/InitiateForm';
import { useFetch } from '../../hooks/useFetch';
import { URLS } from '../../../configUrl';
import { Pagination } from 'antd';

const BudgetLIneOf = (props) => {
  const { handleFetch } = useFetch();
  const [budgetLineOf, setBudgetLineOf] = useState([]);
  const [breakDownBugetLineOf, setBreakDownBugetLineOf] = useState([]);
  const [isOpenned, setIsOpenned] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);

  const [filteredData, setFilteredData] = useState("");

  // const budgetLineOfs = useRef(null)
  // const dataProcessed = useRef(null)


  const fetchBudgetLineOf= async (url) => {
      setIsLoading(true);
      try {
          const response = await handleFetch(url);
          if(response.status === 200){
          // budgetLineOfs.current = response.data
          setBudgetLineOf(response.data);
          setTotalPages(response.totalPages);
          setTotal(response.total);
          setPage(response.currentPage);
          }
      } catch (error) {
          console.log(error)
      }finally{
          setIsLoading(false);
      }
  }

  const fetchBreakdownBudgetLineOfs= async (url) => {
    // setIsLoading(true);
    try {
        const response = await handleFetch(url);
        if(response.status === 200){
        setBreakDownBugetLineOf(response.data);
        // dataProcessing(response.data)
        // setTotalPages(response.totalPages);
        // setTotal(response.total);
        // setPage(response.currentPage);
        }
    } catch (error) {
        console.log(error)
    }finally{
        // setIsLoading(false);
    }
}

  const handleSubmit=()=>{
      fetchBudgetLineOf(`${URLS.API_BUDGETLINE}/budget-line-ofs/?isActive=true`);
      fetchBreakdownBudgetLineOfs(`${URLS.API_BUDGETLINE}/breakdown-budget-lineOfs/?isActive=true`);
      document.getElementById("close-dialog").click(); 
  }

  useEffect(()=>{
      fetchBudgetLineOf(`${URLS.API_BUDGETLINE}/budget-line-ofs/?isActive=true`);
      fetchBreakdownBudgetLineOfs(`${URLS.API_BUDGETLINE}/breakdown-budget-lineOfs/?isActive=true`);
  }, []);

  useEffect(()=>{
    dataProcessing()
  }, [breakDownBugetLineOf, budgetLineOf]);

  // console.log(breakDownBugetLineOf)

  const dataProcessing = () => {
    const monthMap = {
      JANVIER: "month1",
      FEVRIER: "month2",
      MARS: "month3",
      AVRIL: "month4",
      MAI: "month5",
      JUIN: "month6",
      JUILLET: "month7",
      AOUT: "month8",
      SEPTEMBRE: "month9",
      OCTOBRE: "month10",
      NOVEMBRE: "month11",
      DECEMBRE: "month12"
    };
  
    const groupedData = {};
  
    let bdLOf = budgetLineOf
    // let bdLOf = budgetLineOfs.current
  
    breakDownBugetLineOf?.forEach((item) => {
      const { budgetLineOfId, budgetLineOf, month, estimatedAmount, realAmount } = item;
  
      bdLOf?.forEach((item) => {
        if (item.id === budgetLineOfId) {
          console.log("true");
          
          if (!groupedData[item.id]) {
            groupedData[item.id] = {
              id: item.id,
              numRef: item.numRef,
              budgetLineOfId,
              budgetLineName: budgetLineOf.budgetLineName.name
            };
          }
  
          const monthKey = monthMap[month?.toUpperCase()];
          if (monthKey) {
            groupedData[item.id][monthKey] = {
              name: month,
              estimatedAmount: item.id === budgetLineOfId ? estimatedAmount : null,
              realAmount: item.id === budgetLineOfId ? realAmount : null,
            };
          }
        }
    
      })
  
      // if (!groupedData[budgetLineOfId]) {
      //   groupedData[budgetLineOfId] = {
      //     id: item.id,
      //     numRef: item.numRef,
      //     budgetLineOfId,
      //     budgetLineName: budgetLineOf.budgetLineName.name,
      //   };
      // }
  
      // const monthKey = monthMap[month.toUpperCase()];
      // if (monthKey) {
      //   groupedData[budgetLineOfId][monthKey] = {
      //     name: month,
      //     estimatedAmount,
      //     realAmount, 
      //   };
      // }
    });
  
    // const filterredData = Object.values(groupedData);

    // dataProcessed.current = Object.values(groupedData);
  
    // console.log("result", filterredData) 

    setFilteredData(Object.values(groupedData))


  }

  console.log("budgetLineOf", budgetLineOf);

  


  return(
      <>
        <Header />
        <div className='px-6 space-y-4'>
            {/* Header */}
            {/* Dialog */}
            <div className='flex gap-2 items-center justify-between'>
                <div className='max-w-2/3 overflow-x-auto'>
                    <Tabs />
                </div>
                <Dialogue 
                    buttonText={"Créer"}
                    header={<h2 className='text-xl font-semibold'>Nouvel exercice budgetaire</h2>}
                    content={<InitiateForm onSucess={handleSubmit}/>}
                />
            </div>
            {/* Table */}
            <div className='w-full bg-white rounded-lg p-2'>
                <div className='px-2'>
                    <input 
                        type="text" 
                        className='p-2 border rounded-lg' 
                        placeholder='Recherche...' 
                        value={searchValue}
                        onChange={(e)=>{
                            setSearchValue(e.target.value);
                            fetchBudgetLineOf(`${URLS.API_BUDGETLINE}/budget-line-ofs/?numRef=${e.target.value}&isActive=true`)
                        }}
                    />
                </div>
                <Datalist 
                    dataList={budgetLineOf}
                    fetchData={()=>fetchBudgetLineOf(`${URLS.API_BUDGETLINE}/budget-line-ofs/?isActive=true`)}
                    loading={isLoading}
                    searchValue={searchValue}
                    pagination={
                      <div className='flex items-center px-6'>
                          <p className='text-xs text-gray-400'>{budgetLineOf?.length} ligne(s)</p>
                          <Pagination 
                            total={total}
                            pageSize={100}
                            onChange={(page)=>{
                                totalPages.length > page && fetchBudgetLineOf(`${URLS.API_BUDGETLINE}/budget-line-ofs/?skip=${page}&isActive=true`)
                            }}
                          />
                      </div>
                    }
                />
            </div>
        </div>
      </>
  )
};

export default BudgetLIneOf;
