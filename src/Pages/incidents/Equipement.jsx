import React, {useEffect, useState} from 'react';
import Header from '../../components/layout/Header';
import Dialogue from '../../components/incidents/Dialogue';
import InitiateForm from '../../components/incidents/Equipement/InitiateForm';
import Tabs from '../../components/incidents/Tabs';
import Datalist from '../../components/incidents/Equipement/Datalist';
import { useFetch } from '../../hooks/useFetch';
import { Pagination } from 'antd';
import { URLS } from '../../../configUrl';
import { Toaster } from 'react-hot-toast';


const Equipement = () => {

    const {handleFetch} = useFetch();
    const [equipements, setEquipements] = useState([]);
    const [isOpenned, setIsOpenned] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [totalPages, setTotalPages] = useState(0);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(0);
    const [pageList, setPageList] = useState([]);


    const fetchEquipement= async (url) => {
        setIsLoading(true)
        try {
           const response = await handleFetch(url);
           if(response.data){
            setEquipements(response.data);
            setTotal(response.total);
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
            <div className='flex items-center'>
                {/* Header */}
                <div className='overflow-x-auto'>
                    <Tabs />
                </div>
                
            </div>

            {/* Table */}
            <div className='w-full bg-white rounded-lg p-2 h-[70vh] flex flex-col'>
                <div className='px-4 flex flex-col gap-2 sm:flex-row items-center justify-between w-full'>
                    <input 
                        type="text"
                        className='w-full md:w-auto p-2 text-sm border rounded-lg' 
                        placeholder='Recherche...' 
                        value={searchValue}
                        onChange={handleSearch}
                    />
                    {/* Dialog */}
                    <div className='flex gap-2 items-center w-full md:w-auto'>
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
                <Datalist 
                    dataList={equipements}
                    fetchData={()=>fetchEquipement(`${URLS.INCIDENT_API}/equipements`)}
                    searchValue={searchValue}
                    loading={isLoading}
                    pagination={
                    <div className='flex flex-col md:flex-row w-full justify-end items-center px-6'>
                        <p className='text-md text-black font-bold'>{total} ligne(s)</p>
                        <Pagination 
                            total={total}
                            pageSize={100}
                            onChange={(page)=>{
                                totalPages > page && fetchEquipement(`${URLS.INCIDENT_API}/equipements?page=${page}`)
                            }}
                        />
                    </div>}
                />
            </div>
            <Toaster 
              position="bottom-right"
              reverseOrder={false}
            />
        </div>
    </>
  )
}

export default Equipement