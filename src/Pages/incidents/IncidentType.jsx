import React, {useEffect, useState} from 'react';
import Header from '../../components/layout/Header';
import Dialogue from '../../components/incidents/Dialogue';
import InitiateForm from '../../components/incidents/IncidentType/InitiateForm';
import Tabs from '../../components/incidents/Tabs';
import Datalist from '../../components/incidents/IncidentType/Datalist';
import { useFetch } from '../../hooks/useFetch';
import { URLS } from '../../../configUrl';
import Pagination from '../../components/common/Pagination';

const IncidentType = () => {
    const {handleFetch} = useFetch();
    const [incidentTypes, setIncidentTypes] = useState([]);
    const [isOpenned, setIsOpenned] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(0);
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
                <div>
                    <Tabs />
                </div>
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
            {/* Table */}
            <div className='w-full bg-white rounded-lg p-2'>
                <div className='px-4'>
                    <input 
                        type="text"
                        className='p-2 text-sm border rounded-lg' 
                        placeholder='Recherche...' 
                        value={searchValue}
                        onChange={handleSearch}
                    />
                </div>
                <Datalist 
                    dataList={incidentTypes}
                    fetchData={()=>fetchMaintenanceTypes(`${URLS.INCIDENT_API}/incident-types`)}
                    loading={isLoading}
                    pagination={{
                        pageSize:100,
                        total: totalPages,
                        onchange:()=>{

                        }
                    }}
                />
            </div>

            
        </div>
    </>
  )
}

export default IncidentType