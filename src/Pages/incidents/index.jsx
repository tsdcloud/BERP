import React, {useEffect, useState} from 'react';
import Header from '../../components/layout/Header';
import Dialogue from '../../components/incidents/Dialogue';
import Datalist from '../../components/incidents/Datalist';
import InitiateForm from '../../components/incidents/InitiateForm';
import Tabs from '../../components/incidents/Tabs';
import { useFetch } from '../../hooks/useFetch';
import { URLS } from '../../../configUrl';
import Pagination from '../../components/common/Pagination';

const Incident = () =>{
    const {handleFetch} = useFetch();
    const [incidents, setIncidents] = useState([]);
    const [isOpenned, setIsOpenned] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(0);
    const [pageList, setPageList] = useState([]);


    const fetchIncidents= async () => {
        let url = `${URLS.INCIDENT_API}/incidents`;
        try {
           const response = await handleFetch(url);
           if(response.data){
            setIncidents(response.data);
            setTotalPages(response.totalPages);
            setPage(response.page);
           }
        } catch (error) {
            console.log(error)
        }
    }

    const handleSubmit=()=>{
        fetchIncidents();
        document.getElementById("close-dialog").click();
    }

    useEffect(()=>{
        fetchIncidents();
    }, []);


    return(
        <>
            <Header />
            <div className='px-6 '>
                {/* Header */}
                <div className='overflow-x-auto'>
                    <Tabs />
                </div>
                {/* Dialog */}
                <div className='flex gap-2 items-center'>
                    <Dialogue 
                        buttonText={"Declarer un incident"}
                        header={<h2 className='text-xl font-semibold'>Déclarer un incident</h2>}
                        content={<InitiateForm onSucess={handleSubmit}/>}
                    />
                </div>
                {/* Table */}
                <div className='w-full bg-white rounded-lg p-2'>
                    <Datalist 
                        dataList={incidents}
                        fetchData={fetchIncidents}
                    />
                    {/* Pagination */}
                    <Pagination 
                     totalPages={totalPages}
                     setList={setIncidents}
                     handleNext={()=>{}}
                     handlePrev={()=>{}}
                     link={`${URLS.INCIDENT_API}/incidents`}
                    />
                </div>
            </div>
        </>
    )
}

export default Incident;