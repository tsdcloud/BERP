import React, {useEffect, useState} from 'react';
import Header from '../../components/layout/Header';
import Dialogue from '../../components/incidents/Dialogue';
import HorsPontForm from '../../components/incidents/OffBridge/HorsPontForm'
import Tabs from '../../components/incidents/Tabs';
import Datalist from '../../components/incidents/OffBridge/Datalist';
import { useFetch } from '../../hooks/useFetch';
import { URLS } from '../../../configUrl';
import Pagination from '../../components/common/Pagination';


const OffBridge = () => {
    const {handleFetch} = useFetch();
    const [offBridges, setOffBridges] = useState([]);
    const [isOpenned, setIsOpenned] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [searchValue, setSearchValue] = useState("");
    const [totalPages, setTotalPages] = useState(0);
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

export default OffBridge