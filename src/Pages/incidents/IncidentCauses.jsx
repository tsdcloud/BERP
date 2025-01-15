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
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(0);
    const [pageList, setPageList] = useState([]);

    const fetchIncidentCauses= async () => {
        let url = `${URLS.INCIDENT_API}/incident-causes`;
        try {
           const response = await handleFetch(url);
           if(response.data){
            setIncidentCauses(response.data);
            setTotalPages(response.totalPages);
            setPage(response.page);
           }
        } catch (error) {
            console.log(error)
        }
    }

    const handleSubmit=()=>{
        fetchIncidentCauses();
        document.getElementById("close-dialog").click();
    }

    useEffect(()=>{
        fetchIncidentCauses();
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
                    {/* <Input placeholder="Recherche..." className="outline-primary"/> */}
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
                <Datalist 
                    dataList={incidentCauses}
                    fetchData={fetchIncidentCauses}
                />
                {/* Pagination */}
                <Pagination 
                    totalPages={totalPages}
                    setList={setIncidentCauses}
                    handleNext={()=>{}}
                    handlePrev={()=>{}}
                    link={`${URLS.INCIDENT_API}/incident-causes`}
                />
            </div>

            
        </div>
    </>
  )
}

export default IncidentCauses