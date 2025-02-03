import React, {useEffect, useState} from 'react';
import Header from '../../components/layout/Header';
import Dialogue from '../../components/incidents/Dialogue';
import Datalist from '../../components/incidents/Datalist';
import InitiateForm from '../../components/incidents/InitiateForm';
import Tabs from '../../components/incidents/Tabs';
import { useFetch } from '../../hooks/useFetch';
import { URLS } from '../../../configUrl';

const Incident = () =>{
    const {handleFetch} = useFetch();
    const [incidents, setIncidents] = useState([]);
    const [isOpenned, setIsOpenned] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(0);
    const [pageList, setPageList] = useState([]);


    const fetchIncidents= async (url) => {
        setIsLoading(true);
        try {
           const response = await handleFetch(url);
           if(response.data){
            setIncidents(response.data);
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
        fetchIncidents();
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
                        fetchData={fetchIncidents}
                        loading={isLoading}
                        searchValue={searchValue}
                    />
                </div>
            </div>
        </>
    )
}

export default Incident;