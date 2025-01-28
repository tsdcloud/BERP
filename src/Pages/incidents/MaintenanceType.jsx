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
    const [isLoading, setIsLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(0);
    const [pageList, setPageList] = useState([]);
    const [searchValue, setSearchValue] = useState([]);

    const fetchMaintenanceTypes= async (url) => {
        setIsLoading(true);
        try {
           const response = await handleFetch(url);
           if(response.data){
            setMaintenanceTypes(response.data);
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
        document.getElementById("close-dialog").click();
        fetchMaintenanceTypes(`${URLS.INCIDENT_API}/maintenance-types`);
    }

    const handleSearch = async(e)=>{
        setSearchValue(e.target.value)
        let url = `${URLS.INCIDENT_API}/maintenance-types?search=${e.target.value}`;
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

    useEffect(()=>{
        fetchMaintenanceTypes(`${URLS.INCIDENT_API}/maintenance-types`);
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
                    dataList={maintenanceTypes}
                    fetchData={()=>fetchMaintenanceTypes(`${URLS.INCIDENT_API}/maintenance-types`)}
                    searchValue={searchValue}
                    pagination={{
                        total: totalPages,
                        pageSize: 100,
                        onchange:()=>{
                            totalPages > page && fetchMaintenanceTypes(`${URLS.INCIDENT_API}/maintenance-types?page=${page+1}`)
                        }
                    }}
                    loading={isLoading}
                />
            </div>

            
        </div>
    </>
  )
}

export default TypeMaintenance