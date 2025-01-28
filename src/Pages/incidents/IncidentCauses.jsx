import React, {useEffect, useState} from 'react';
import Header from '../../components/layout/Header';
import Dialogue from '../../components/incidents/Dialogue';
import InitiateForm from '../../components/incidents/IncidentCauses/InitiateForm';
import Tabs from '../../components/incidents/Tabs';
import Datalist from '../../components/incidents/IncidentCauses/Datalist';
import { useFetch } from '../../hooks/useFetch';
import { URLS } from '../../../configUrl';
import Pagination from '../../components/common/Pagination';

const IncidentCauses = () => {

    const {handleFetch} = useFetch();
    const [incidentCauses, setIncidentCauses] = useState([]);
    const [isOpenned, setIsOpenned] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(0);
    const [searchValue, setSearchValue] = useState("");
    const [pageList, setPageList] = useState([]);

    const fetchIncidentCauses= async (url) => {
        setIsLoading(true);
        try {
           const response = await handleFetch(url);
           if(response.data){
            setIncidentCauses(response.data);
            setTotalPages(response.totalPages);
            setPage(response.page);
           }
        } catch (error) {
            console.log(error)
        }finally{
            setIsLoading(false)
        }
    }

    const handleSubmit=()=>{
        fetchIncidentCauses(`${URLS.INCIDENT_API}/incident-causes`);
        document.getElementById("close-dialog").click();
    }

    const handleSearch =(e)=>{
        setSearchValue(e.target.value)
        try {
            fetchIncidentCauses(`${URLS.INCIDENT_API}/incident-causes?search=${e.target.value}`)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(()=>{
        fetchIncidentCauses(`${URLS.INCIDENT_API}/incident-causes`);
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
                        buttonText={"Créer une cause d'incident"}
                        header={<h2 className='text-xl font-semibold'>Créer une cause d'incident</h2>}
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
                        placeholder='Recherch' 
                        className='p-2 rounded-lg border'
                        value={searchValue}
                        onChange={handleSearch}
                    />
                </div>
                <Datalist 
                    dataList={incidentCauses}
                    fetchData={()=>fetchIncidentCauses(`${URLS.INCIDENT_API}/incident-causes`)}
                    loading={isLoading}
                    searchValue={searchValue}
                    pagination={{
                        pageSize:100,
                        total: totalPages,
                        onChange:()=>{
                            totalPages > pages && fetchIncidentCauses(`${URLS.INCIDENT_API}/incident-causes?page=${page+1}`)
                        }
                    }}
                />
            </div>

            
        </div>
    </>
  )
}

export default IncidentCauses