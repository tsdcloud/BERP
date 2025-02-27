import React, {useEffect, useState} from 'react';
import Header from '../../components/layout/Header';
import Dialogue from '../../components/incidents/Dialogue';
import HorsPontForm from '../../components/incidents/OffBridge/HorsPontForm'
import Tabs from '../../components/incidents/Tabs';
import Datalist from '../../components/incidents/OffBridge/Datalist';
import { useFetch } from '../../hooks/useFetch';
import { URLS } from '../../../configUrl';
import _Pagination from '../../components/common/Pagination';
import { Pagination } from 'antd';


const OffBridge = () => {
    const {handleFetch} = useFetch();
    const [offBridges, setOffBridges] = useState([]);
    const [isOpenned, setIsOpenned] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [searchValue, setSearchValue] = useState("");
    const [totalPages, setTotalPages] = useState(0);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(0);
    const [pageList, setPageList] = useState([]);

    const fetchOffBridges= async (url) => {
        setIsLoading(true)
        try {
           const response = await handleFetch(url);
           if(response.data){
            setOffBridges(response.data);
            setTotalPages(response.totalPages);
            setPage(response.page);
            setTotal(response.total)
           }
        } catch (error) {
            console.log(error)
        }finally{
          setIsLoading(false)
        }
    }

    const handleSubmit=()=>{
        fetchOffBridges(`${URLS.INCIDENT_API}/off-bridges`);
        document.getElementById("close-dialog").click();
    }

    const handleSearch=(e)=>{
        setSearchValue(e.target.value);
        fetchOffBridges(`${URLS.INCIDENT_API}/off-bridges?search=${e.target.value}`);
    }
    useEffect(()=>{
        fetchOffBridges(`${URLS.INCIDENT_API}/off-bridges`);
    }, []);

  return (
    <>
        <Header />
        <div className='px-6 space-y-2'>
            <div className='flex items-center justify-between'>
                {/* Header */}
                <div className='max-w-2/3 overflow-x-auto'>
                    <Tabs />
                </div>
                {/* Dialog */}
                <div className='flex gap-2 items-center'>
                    <Dialogue 
                        buttonText={"Nouveau hors pont"}
                        header={<h2 className='text-xl font-semibold'>Nouveau hors pont</h2>}
                        content={
                        <HorsPontForm 
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
                        value={searchValue}
                        onChange={handleSearch} 
                    />
                </div>
                <Datalist 
                    dataList={offBridges}
                    fetchData={()=>fetchOffBridges(`${URLS.INCIDENT_API}/off-bridges`)}
                    // setDataList={setOffBridges}
                    searchValue={searchValue}
                    loading={isLoading}
                    pagination={
                        <div className='flex items-center px-6'>
                            <p className='text-xs text-gray-400'>{total} ligne(s)</p>
                            <Pagination 
                                total={total}
                                pageSize={100}
                                onChange={(page)=>{
                                    totalPages > page && fetchOffBridges(`${URLS.INCIDENT_API}/off-bridges?page=${page}`)
                                }}
                            />
                        </div>
                    }
                />
            </div>

            
        </div>
    </>
  )
}

export default OffBridge