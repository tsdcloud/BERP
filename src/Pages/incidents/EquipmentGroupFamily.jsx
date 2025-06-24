import React, {useEffect, useState} from 'react';
import Header from '../../components/layout/Header';
import Dialogue from '../../components/incidents/Dialogue';
import InitiateForm from '../../components/incidents/EquipmentGroupFamily/InitiateForm';
import Tabs from '../../components/incidents/Tabs';
import Datalist from '../../components/incidents/EquipmentGroupFamily/Datalist';
import { useFetch } from '../../hooks/useFetch';
import { Pagination } from 'antd';
import { URLS } from '../../../configUrl';
import { Toaster } from 'react-hot-toast';


const EquipmentGroupFamily = () => {
    const {handleFetch} = useFetch();
    const [equipmentGroupFamilies, setEquipementGroupFamilies] = useState([]);
    const [isOpenned, setIsOpenned] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [totalPages, setTotalPages] = useState(0);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(0);
    const [pageList, setPageList] = useState([]);

    const fetchEquipmentGroupFamilies= async (url) => {
        setIsLoading(true)
        try {
           const response = await handleFetch(url);
           if(response.data){
            setEquipementGroupFamilies(response.data);
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
        fetchEquipmentGroupFamilies(`${URLS.INCIDENT_API}/equipment-group-families`);
        document.getElementById("close-dialog").click();
    }

    const handleSearch = async(e)=>{
        setSearchValue(e.target.value)
        let url = `${URLS.INCIDENT_API}/equipment-group-families?search=${e.target.value}`;
        try {
           const response = await handleFetch(url);
           if(response.data){
            setEquipementGroupFamilies(response?.data.data);
            setTotalPages(response.totalPages);
            setPage(response.page);
           }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{
        fetchEquipmentGroupFamilies(`${URLS.INCIDENT_API}/equipment-group-families`);
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
                <div className='px-4 w-full justify-between items-center flex'>
                    <input 
                        type="text"
                        className='p-2 text-sm border rounded-lg' 
                        placeholder='Recherche...' 
                        value={searchValue}
                        onChange={handleSearch}
                    />
                    {/* Dialog */}
                    <div className='flex gap-2 items-center'>
                        <Dialogue 
                            buttonText={"Créer une nouvelle famille"}
                            header={<h2 className='text-xl font-semibold'>Créer une nouvelle famille</h2>}
                            content={
                            <InitiateForm 
                                onSucess={handleSubmit}
                            />}
                            isOpenned={isOpenned}
                        />
                    </div>
                </div>
                <Datalist 
                    dataList={equipmentGroupFamilies}
                    fetchData={()=>fetchEquipmentGroupFamilies(`${URLS.INCIDENT_API}/equipment-group-families`)}
                    searchValue={searchValue}
                    loading={isLoading}
                    pagination={
                    <div className='flex items-center px-6 justify-end w-full'>
                        <p className='text-xs text-gray-400'>{total} ligne(s)</p>
                        <Pagination 
                            total={total}
                            pageSize={100}
                            onChange={(page)=>{
                                totalPages > page && fetchEquipmentGroupFamilies(`${URLS.INCIDENT_API}/equipment-group-families?page=${page}`)
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

export default EquipmentGroupFamily