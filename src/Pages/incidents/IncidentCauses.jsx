import React, {useEffect, useState} from 'react';
import Header from '../../components/layout/Header';
import Dialogue from '../../components/incidents/Dialogue';
import InitiateForm from '../../components/incidents/IncidentCauses/InitiateForm';
import Tabs from '../../components/incidents/Tabs';
import Datalist from '../../components/incidents/IncidentCauses/Datalist';
import { useFetch } from '../../hooks/useFetch';
import { URLS } from '../../../configUrl';
import { Pagination } from 'antd';

const IncidentCauses = () => {

    const {handleFetch} = useFetch();
    const [incidentCauses, setIncidentCauses] = useState([]);
    const [isOpenned, setIsOpenned] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(0);
    const [total, setTotal] = useState(0);
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
                <div className='overflow-x-auto'>
                    <Tabs />
                </div>
            </div>
            {/* Table */}
            <div className='w-full bg-white rounded-lg p-2'>
                <div className='px-4 flex items-center justify-between'>
                    <input 
                        type="text" 
                        placeholder='Recherch' 
                        className='p-2 rounded-lg border'
                        value={searchValue}
                        onChange={handleSearch}
                    />
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
                <Datalist 
                    dataList={incidentCauses}
                    fetchData={()=>fetchIncidentCauses(`${URLS.INCIDENT_API}/incident-causes`)}
                    loading={isLoading}
                    searchValue={searchValue}
                    pagination={
                        <div className='flex items-center px-6'>
                                <p className='text-sm font-bold'>{total} ligne(s)</p>
                                <Pagination 
                                    total={total}
                                    pageSize={100}
                                    onChange={(page)=>{
                                        totalPages > page && fetchIncidentCauses(`${URLS.INCIDENT_API}/incident-causes?page=${page}`)
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

export default IncidentCauses