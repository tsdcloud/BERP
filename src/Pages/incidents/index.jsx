import React, {useEffect, useState} from 'react';
import Header from '../../components/layout/Header';
import Dialogue from '../../components/incidents/Dialogue';
import Datalist from '../../components/incidents/Datalist';
import InitiateForm from '../../components/incidents/InitiateForm';
import Tabs from '../../components/incidents/Tabs';
import { useFetch } from '../../hooks/useFetch';
import { URLS } from '../../../configUrl';
import { Pagination } from 'antd';
import VerifyPermission from '../../utils/verifyPermission';

const Incident = () =>{
    const {handleFetch} = useFetch();
    const [incidents, setIncidents] = useState([]);
    const [isOpenned, setIsOpenned] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(0);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(0);


    const fetchIncidents= async (url) => {
        setIsLoading(true);
        try {
           const response = await handleFetch(url);
           if(response.status === 200){
            setIncidents(response.data);
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
        fetchIncidents(`${URLS.INCIDENT_API}/incidents`);
        document.getElementById("close-dialog").click();
    }

    useEffect(()=>{
        fetchIncidents(`${URLS.INCIDENT_API}/incidents`);
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
                        buttonText={"Declarer un incident"}
                        header={<h2 className='text-xl font-semibold'>Déclarer un incident</h2>}
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
                                fetchIncidents(`${URLS.INCIDENT_API}/incidents?search=${e.target.value}`)
                            }}
                        />
                    </div>
                    <Datalist 
                        dataList={incidents}
                        fetchData={()=>fetchIncidents(`${URLS.INCIDENT_API}/incidents`)}
                        loading={isLoading}
                        searchValue={searchValue}
                        pagination={
                            <div className='flex items-center px-6'>
                                <p className='text-xs text-gray-400'>{total} ligne(s)</p>
                                <Pagination 
                                    total={total}
                                    pageSize={100}
                                    onChange={(page)=>{
                                        totalPages > page && fetchIncidents(`${URLS.INCIDENT_API}/incidents?page=${page}`)
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

export default Incident;