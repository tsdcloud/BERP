import React, {useEffect, useState} from 'react';
import Header from '../../components/layout/Header';
import Dialogue from '../../components/incidents/Dialogue';
import InitiateForm from '../../components/incidents/Equipement/InitiateForm';
import Tabs from '../../components/incidents/Tabs';
import Datalist from '../../components/incidents/Equipement/Datalist';
import { useFetch } from '../../hooks/useFetch';
import { URLS } from '../../../configUrl';


const Equipement = () => {

    const {handleFetch} = useFetch();
    const [equipements, setEquipements] = useState([]);
    const [isOpenned, setIsOpenned] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(0);
    const [pageList, setPageList] = useState([]);


    const fetchEquipement= async (url) => {
        setIsLoading(true)
        try {
           const response = await handleFetch(url);
           if(response.data){
            setEquipements(response.data);
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
        fetchEquipement(`${URLS.INCIDENT_API}/equipements`);
        document.getElementById("close-dialog").click();
    }

    const handleSearch = async(e)=>{
        setSearchValue(e.target.value)
        let url = `${URLS.INCIDENT_API}/equipements?search=${e.target.value}`;
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

    useEffect(()=>{
        fetchEquipement(`${URLS.INCIDENT_API}/equipements`);
    }, []);
  return (
    <>
        <Header />
        <div className='px-6 space-y-4'>
            <div className='flex items-center justify-between'>
                {/* Header */}
                <div className='sm:w-full'>
                    <Tabs />
                </div>
                {/* Dialog */}
                <div className='flex gap-2 items-center'>
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
            <div className='w-full bg-white rounded-lg p-2 h-[70vh] flex flex-col justify-between'>
                <div className='px-4'>
                    <input 
                        type="text"
                        className='p-2 text-sm border rounded-lg' 
                        placeholder='Recherche...' 
                        value={searchValue}
                        onChange={handleSearch}
                    />
                </div>
                <Datalist 
                    dataList={equipements}
                    fetchData={()=>fetchEquipement(`${URLS.INCIDENT_API}/equipements`)}
                    searchValue={searchValue}
                    loading={isLoading}
                    pagination={{
                        total: totalPages,
                        pageSize:100,
                        onChange:()=>{
                            totalPages > page && fetchEquipement(`${URLS.INCIDENT_API}/equipements?page=${page+1}`)
                        }
                    }}
                />
            </div>
        </div>
    </>
  )
}

export default Equipement