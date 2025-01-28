import React, {useEffect, useState} from 'react';
import Header from '../../components/layout/Header';
import Dialogue from '../../components/incidents/Dialogue';
import InitiateForm from '../../components/incidents/Maintenance/InitiateForm';
import Tabs from '../../components/incidents/Tabs';
import Datalist from '../../components/incidents/maintenance/Datalist';
import { useFetch } from '../../hooks/useFetch';
import { URLS } from '../../../configUrl';
import Pagination from '../../components/common/Pagination';


const Maintenance = () => {
    const {handleFetch} = useFetch();
    const [maintenances, setMaintenances] = useState([]);
    const [isOpenned, setIsOpenned] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [searchValue, setSearchValue] = useState("");
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(0);
    const [pageList, setPageList] = useState([]);

    const fetchMaintenance= async (url) => {
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
        fetchMaintenance(`${URLS.INCIDENT_API}/maintenances`);
        document.getElementById("close-dialog").click();
    }

    const handleSearch=(e)=>{
        setSearchValue(e.target.value);
        fetchMaintenance(`${URLS.INCIDENT_API}/maintenances?page=${e.target.value}`)
    }
    useEffect(()=>{
        fetchMaintenance(`${URLS.INCIDENT_API}/maintenances`);
    }, []);

  return (
    <>
        <Header />
        <div className='px-6 space-y-2'>
            <div className='flex items-center justify-between'>
                {/* Header */}
                <div>
                    <Tabs />
                </div>
                {/* Dialog */}
                <div className='flex gap-2 items-center'>
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
                <div className='px-4'>
                    <input 
                        type="text" 
                        className='p-2 rounded-lg border'
                        placeholder='Recherche...'
                        onChange={handleSearch} 
                    />
                </div>
                <Datalist 
                    dataList={maintenances}
                    fetchData={()=>fetchMaintenance(`${URLS.INCIDENT_API}/maintenances`)}
                    setDataList={setMaintenances}
                    searchValue={searchValue}
                    pagination={{
                        pageSize:100,
                        total:totalPages,
                        onChange:()=>{

                        }
                    }}
                />
            </div>

            
        </div>
    </>
  )
}

export default Maintenance