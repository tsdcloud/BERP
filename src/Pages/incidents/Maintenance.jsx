import React, {useEffect, useState} from 'react';
import Header from '../../components/layout/Header';
import Dialogue from '../../components/incidents/Dialogue';
import InitiateForm from '../../components/incidents/Consommable/InitiateForm';
import Tabs from '../../components/incidents/Tabs';
import Datalist from '../../components/incidents/maintenance/Datalist';
import { useFetch } from '../../hooks/useFetch';
import { URLS } from '../../../configUrl';
import Pagination from '../../components/common/Pagination';


const Maintenance = () => {
    const {handleFetch} = useFetch();
    const [maintenances, setMaintenances] = useState([]);
    const [isOpenned, setIsOpenned] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(0);
    const [pageList, setPageList] = useState([]);

    const fetchMaintenance= async () => {
        let url = `${URLS.INCIDENT_API}/maintenances`;
        try {
           const response = await handleFetch(url);
           if(response.data){
            setMaintenances(response.data);
            setTotalPages(response.totalPages);
            setPage(response.page);
           }
        } catch (error) {
            console.log(error)
        }
    }

    const handleSubmit=()=>{
        fetchMaintenance();
        document.getElementById("close-dialog").click();
    }

    useEffect(()=>{
        fetchMaintenance();
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
                        buttonText={"Nouveau maintenance"}
                        header={<h2 className='text-xl font-semibold'>Nouvelle maintenance</h2>}
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
                    dataList={maintenances}
                    fetchData={fetchMaintenance}
                />
                {/* Pagination */}
                <Pagination 
                    totalPages={totalPages}
                    setList={setMaintenances}
                    handleNext={()=>{}}
                    handlePrev={()=>{}}
                    link={`${URLS.INCIDENT_API}/maintenances`}
                />
            </div>

            
        </div>
    </>
  )
}

export default Maintenance