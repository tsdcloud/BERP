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
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(0);
    const [pageList, setPageList] = useState([]);

    const fetchMaintenanceTypes= async () => {
        let url = `${URLS.INCIDENT_API}/incident-types`;
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

    const handleSubmit=()=>{
        fetchMaintenanceTypes();
        document.getElementById("close-dialog").click();
    }

    useEffect(()=>{
        fetchMaintenanceTypes();
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
                        buttonText={"Nouveau Type d'incident"}
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
                <Datalist 
                    dataList={incidentTypes}
                    fetchData={fetchMaintenanceTypes}
                />
                {/* Pagination */}
                <Pagination 
                    totalPages={totalPages}
                    setList={setIncidentTypes}
                    handleNext={()=>{}}
                    handlePrev={()=>{}}
                    link={`${URLS.INCIDENT_API}/incident-types`}
                />
            </div>

            
        </div>
    </>
  )
}

export default IncidentType