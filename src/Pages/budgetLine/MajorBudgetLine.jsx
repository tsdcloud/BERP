import React, {useEffect, useState} from 'react';
import Header from '../../components/layout/Header';
import Dialogue from '../../components/budgetLine/Dialogue';
import Datalist from '../../components/budgetLine/Datalist';
import InitiateForm from '../../components/budgetLine/InitiateForm';
import Tabs from '../../components/budgetLine/Tabs';
import { useFetch } from '../../hooks/useFetch';
import { URLS } from '../../../configUrl';
import { Pagination } from 'antd';
import VerifyPermission from '../../utils/verifyPermission';


const MajorBudgetLine = (props) => {
  const {handleFetch} = useFetch();
  const [majorBudgetLine, setMajorBudgetLine] = useState([]);
  const [majorBudgetLineFiltered, setMajorBudgetLineFiltered] = useState([]);
  const [isOpenned, setIsOpenned] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);

  const [services, setServices] = useState([]);

  const fetchServices = async () => {

    let url = `${URLS.ENTITY_API}/services/`

    setIsLoading(true);
    try {
        const response = await handleFetch(url);
        if(response.status === 200){
        setServices(response.data);
        }
    } catch (error) {
        console.log(error)
    }finally{
        setIsLoading(false);
    }
  }
  
  const fetchMajorBudgetLine= async (url) => {
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
    fetchMajorBudgetLine(`${URLS.API_BUDGETLINE}/major-budget-lines/?isActive=true`);
    document.getElementById("close-dialog").click();
  }

  useEffect(()=>{
    fetchMajorBudgetLine(`${URLS.API_BUDGETLINE}/major-budget-lines/?isActive=true`);
  }, []);

  useEffect(()=>{
    fetchServices()
  }, [majorBudgetLine]);

  useEffect(()=>{

    const filteredData = majorBudgetLine.map(e => {
      const service = services.find(se => se.id === e.serviceId);
  
      return {
        ...e,
        serviceName: service ? service.name : '--'
      };
    });

    setMajorBudgetLineFiltered(filteredData)

    // console.log("filteredData", filteredData);
    
  }, [services]);


  // console.log(majorBudgetLine);
  


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
                  header={<h2 className='text-xl font-semibold'>Nouvelle grande ligne</h2>}
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
                          fetchMajorBudgetLine(`${URLS.API_BUDGETLINE}/major-budget-lines/?numRef=${e.target.value}&isActive=true`)
                      }}
                  />
              </div>
              <Datalist 
                  dataList={majorBudgetLineFiltered}
                  fetchData={()=>fetchMajorBudgetLine(`${URLS.API_BUDGETLINE}/major-budget-lines/?isActive=true`)}
                  loading={isLoading}
                  searchValue={searchValue}
                  pagination={
                    <div className='flex items-center px-6'>
                        <p className='text-xs text-gray-400'>{total} ligne(s)</p>
                        <Pagination 
                          total={total}
                          pageSize={100}
                          onChange={(page)=>{
                              totalPages > page && fetchMajorBudgetLine(`${URLS.API_BUDGETLINE}/major-budget-lines/?skip=${page}&isActive=true`)
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
//   return (
//     <div>
//       <Tabs />
//       MajorBudgetLine
//     </div>
//   )
// };

export default MajorBudgetLine;
