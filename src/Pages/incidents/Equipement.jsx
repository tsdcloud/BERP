import React, {useEffect, useState} from 'react';
import Header from '../../components/layout/Header';
import Dialogue from '../../components/incidents/Dialogue';
import InitiateForm from '../../components/incidents/Equipement/InitiateForm';
import Tabs from '../../components/incidents/Tabs';
import Datalist from '../../components/incidents/Equipement/Datalist';
import { useFetch } from '../../hooks/useFetch';
import { URLS } from '../../../configUrl';
import Pagination from '../../components/common/Pagination';


const Equipement = () => {
    const {handleFetch} = useFetch();
    const [equipements, setEquipements] = useState([]);
    const [isOpenned, setIsOpenned] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(0);
    const [pageList, setPageList] = useState([]);


    const fetchEquipement= async () => {
        let url = `${URLS.INCIDENT_API}/equipements`;
        try {
           const response = await handleFetch(url);
           if(response.data){
            setEquipements(response.data);
            setTotalPages(response.totalPages);
            setPage(response.page);
           }
        } catch (error) {
            console.log(error)
        }
    }

    const handleSubmit=()=>{
        fetchEquipement();
        document.getElementById("close-dialog").click();
    }

    useEffect(()=>{
        fetchEquipement();
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
                        buttonText={"Créer equipement"}
                        header={<h2 className='text-xl font-semibold'>Créer equipement</h2>}
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
                    dataList={equipements}
                    fetchData={fetchEquipement}
                />
                {/* Pagination */}
                <Pagination 
                    totalPages={totalPages}
                    setList={setEquipements}
                    handleNext={()=>{}}
                    handlePrev={()=>{}}
                    link={`${URLS.INCIDENT_API}/equipements`}
                />
            </div>

            
        </div>
    </>
  )
}

export default Equipement