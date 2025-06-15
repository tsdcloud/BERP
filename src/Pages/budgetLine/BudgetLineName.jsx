import Tabs from '../../components/budgetLine/Tabs';
import React, {useEffect, useState} from 'react';
import Header from '../../components/layout/Header';
import Dialogue from '../../components/budgetLine/Dialogue';
import Datalist from '../../components/budgetLine/budgetLineName/Datalist';
import InitiateForm from '../../components/budgetLine/budgetLineName/InitiateForm';
import { useFetch } from '../../hooks/useFetch';
import { URLS } from '../../../configUrl';
import { Pagination } from 'antd';

const BudgetLineName = (props) => {

  const {handleFetch} = useFetch();
  const [majorBudgetLine, setMajorBudgetLine] = useState([]);
  const [isOpenned, setIsOpenned] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);


  const fetchBudgetLineName= async (url) => {
      setIsLoading(true);
      try {
          const response = await handleFetch(url);
          if(response.status === 200){
          setMajorBudgetLine(response.data);
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

  const handleSubmit=()=>{
      fetchBudgetLineName(`${URLS.API_BUDGETLINE}/budget-line-names/?isActive=true`);
      document.getElementById("close-dialog").click();
  }

  useEffect(()=>{
      fetchBudgetLineName(`${URLS.API_BUDGETLINE}/budget-line-names/?isActive=true`);
  }, []);


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
                    header={<h2 className='text-xl font-semibold'>Nouvelle ligne - libellé</h2>}
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
                            fetchBudgetLineName(`${URLS.API_BUDGETLINE}/budget-line-names/?numRef=${e.target.value}&isActive=true`)
                        }}
                    />
                </div>
                <Datalist 
                    dataList={majorBudgetLine}
                    fetchData={()=>fetchBudgetLineName(`${URLS.API_BUDGETLINE}/budget-line-names/?isActive=true`)}
                    loading={isLoading}
                    searchValue={searchValue}
                    pagination={
                      <div className='flex items-center px-6'>
                          <p className='text-xs text-gray-400'>{total} ligne(s)</p>
                          <Pagination 
                            total={total}
                            pageSize={100}
                            onChange={(page)=>{
                                totalPages > page && fetchBudgetLineName(`${URLS.API_BUDGETLINE}/budget-line-names/?skip=${page}&isActive=true`)
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

export default BudgetLineName;
