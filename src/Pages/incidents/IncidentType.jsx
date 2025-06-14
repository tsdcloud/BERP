import React, {useEffect, useState} from 'react';
import Header from '../../components/layout/Header';
import Dialogue from '../../components/incidents/Dialogue';
import InitiateForm from '../../components/incidents/IncidentType/InitiateForm';
import Tabs from '../../components/incidents/Tabs';
import Datalist from '../../components/incidents/IncidentType/Datalist';
import { useFetch } from '../../hooks/useFetch';
import { URLS } from '../../../configUrl';
import { Pagination } from 'antd';

const IncidentType = () => {
    const {handleFetch} = useFetch();
    const [incidentTypes, setIncidentTypes] = useState([]);
    const [isOpenned, setIsOpenned] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(0);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(0);
    const [searchValue, setSearchValue] = useState("");
    const [pageList, setPageList] = useState([]);

    const fetchMaintenanceTypes= async (url) => {
        setIsLoading(true)
        try {
           const response = await handleFetch(url);
           if(response.data){
            setIncidentTypes(response.data);
            setTotalPages(response.totalPages);
            setTotal(response.total);
            setPage(response.page);
           }
        } catch (error) {
            console.log(error)
        }finally{
            setIsLoading(false);
        }
    }

    const handleSubmit=()=>{
        fetchMaintenanceTypes(`${URLS.INCIDENT_API}/incident-types`);
        document.getElementById("close-dialog").click();
    }

    const handleSearch = async(e)=>{
        setSearchValue(e.target.value)
        let url = `${URLS.INCIDENT_API}/incident-types?search=${e.target.value}`;
        try {
           const response = await handleFetch(url);
           if(response.data){
            setIncidentTypes(response.data);
            setTotalPages(response.totalPages);
            setPage(response.page);
           }
        } catch (error) {
            console.log(error)
        }
    }


    useEffect(()=>{
        fetchMaintenanceTypes(`${URLS.INCIDENT_API}/incident-types`);
    }, []);

  return (
    <>
        <Header />
        <div className='px-6'>
            <div className='flex items-center justify-between'>
                {/* Header */}
                <div className='max-w-2/3 overflow-x-auto'>
                    <Tabs />
                </div>
                
            </div>
            {/* Table */}
            <div className='w-full bg-white rounded-lg p-2'>
                <div className='px-4 flex items-center justify-between'>
                    <input 
                        type="text"
                        className='p-2 text-sm border rounded-lg' 
                        placeholder='Recherche...' 
                        value={searchValue}
                        onChange={handleSearch}
                    />
                    {/* Dialog */}
                <div className='flex gap-2 items-center'>
                    
                    <Dialogue 
                        buttonText={"Nouveau type d'incident"}
                        header={<h2 className='text-xl font-semibold'>Nouveau type d'incident</h2>}
                        content={
                        <InitiateForm 
                            onSucess={handleSubmit}
                        />}
                        isOpenned={isOpenned}
                    />
                </div>
                </div>
                <Datalist 
                    dataList={incidentTypes}
                    fetchData={()=>fetchMaintenanceTypes(`${URLS.INCIDENT_API}/incident-types`)}
                    loading={isLoading}
                    pagination={
                        <div className='flex items-center px-6'>
                            <p className='text-sm font-bold'>{total} ligne(s)</p>
                            <Pagination 
                                total={total}
                                pageSize={totalPages}
                                onChange={(page)=>{
                                    totalPages > page && fetchIncidents(`${URLS.INCIDENT_API}/incident-types?page=${page}`)
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

export default IncidentType