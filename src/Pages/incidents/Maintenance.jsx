import React, {useEffect, useState} from 'react';
import Header from '../../components/layout/Header';
import Dialogue from '../../components/incidents/Dialogue';
import InitiateForm from '../../components/incidents/Maintenance/InitiateForm';
import Tabs from '../../components/incidents/Tabs';
import Datalist from '../../components/incidents/Maintenance/Datalist';
import { useFetch } from '../../hooks/useFetch';
import { URLS } from '../../../configUrl';
import { Pagination } from 'antd';



const Maintenance = () => {
    const {handleFetch} = useFetch();
    const [maintenances, setMaintenances] = useState([]);
    const [isOpenned, setIsOpenned] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [searchValue, setSearchValue] = useState("");
    const [totalPages, setTotalPages] = useState(0);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(0);
    const [pageList, setPageList] = useState([]);

    const fetchMaintenance= async (url) => {
        setIsLoading(true)
        try {
           const response = await handleFetch(url);
           if(response.data){
            setMaintenances(response.data);
            setTotalPages(response.totalPages);
            setTotal(response.total);
            setPage(response.page);
           }
        } catch (error) {
            console.log(error)
        }finally{
            setIsLoading(false)
        }
    }

    const handleSubmit=()=>{
        fetchMaintenance(`${URLS.INCIDENT_API}/maintenances`);
        document.getElementById("close-dialog").click();
    }

    const handleSearch=(e)=>{
        setSearchValue(e.target.value);
        fetchMaintenance(`${URLS.INCIDENT_API}/maintenances?search=${e.target.value}`)
    }
    useEffect(()=>{
        fetchMaintenance(`${URLS.INCIDENT_API}/maintenances`);
    }, []);

  return (
    <>
        <Header />
        <div className='px-6 space-y-2'>
            <div className='flex items-center justify-between'>
                {/* Header */}
                <div className='max-w-2/3 overflow-x-auto'>
                    <Tabs />
                </div>
                {/* Dialog */}
                <div className='flex gap-2 items-center'>
                    <Dialogue 
                        buttonText={"Nouvelle maintenance"}
                        header={<h2 className='text-xl font-semibold'>Nouvelle maintenance</h2>}
                        content={
                        <InitiateForm 
                            onSucess={handleSubmit}
                        />}
                        isOpenned={isOpenned}
                    />
                </div>
            </div>
            {/* Table */}
            <div className='w-full bg-white rounded-lg p-2'>
                <div className='px-4'>
                    <input 
                        type="text" 
                        className='p-2 rounded-lg border'
                        placeholder='Recherche...'
                        onChange={handleSearch} 
                    />
                </div>
                <Datalist 
                    dataList={maintenances}
                    fetchData={()=>fetchMaintenance(`${URLS.INCIDENT_API}/maintenances`)}
                    setDataList={setMaintenances}
                    searchValue={searchValue}
                    loading={isLoading}
                    pagination={
                        <div className='flex items-center px-6'>
                            <p className='text-xs text-gray-400'>{total} ligne(s)</p>
                            <Pagination 
                                total={total}
                                pageSize={100}
                                onChange={(page)=>{
                                    totalPages > page && fetchMaintenance(`${URLS.INCIDENT_API}/maintenances?page=${page}`)
                                }}
                            />
                        </div>
                    }
                />
            </div>

            
        </div>
    </>
  )
}

export default Maintenance