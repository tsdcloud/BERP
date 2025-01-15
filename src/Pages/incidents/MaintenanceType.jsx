import React, {useEffect, useState} from 'react';
import Header from '../../components/layout/Header';
import Dialogue from '../../components/incidents/Dialogue';
import InitiateForm from '../../components/incidents/MaintenanceType/InitiateForm';
import Tabs from '../../components/incidents/Tabs';
import Datalist from '../../components/incidents/MaintenanceType/Datalist';
import { useFetch } from '../../hooks/useFetch';
import { URLS } from '../../../configUrl';
import Pagination from '../../components/common/Pagination';

const TypeMaintenance = () => {
    const {handleFetch} = useFetch();
    const [maintenanceTypes, setMaintenanceTypes] = useState([]);
    const [isOpenned, setIsOpenned] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(0);
    const [pageList, setPageList] = useState([]);

    const fetchMaintenanceTypes= async () => {
        let url = `${URLS.INCIDENT_API}/maintenance-types`;
        try {
           const response = await handleFetch(url);
           if(response.data){
            setMaintenanceTypes(response.data);
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
                        buttonText={"Nouveau Type de maintenance"}
                        header={<h2 className='text-xl font-semibold'>Nouveau type de maintenance</h2>}
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
                    dataList={maintenanceTypes}
                    fetchData={fetchMaintenanceTypes}
                />
                {/* Pagination */}
                <Pagination 
                    totalPages={totalPages}
                    setList={setMaintenanceTypes}
                    handleNext={()=>{}}
                    handlePrev={()=>{}}
                    link={`${URLS.INCIDENT_API}/maintenance-types`}
                />
            </div>

            
        </div>
    </>
  )
}

export default TypeMaintenance