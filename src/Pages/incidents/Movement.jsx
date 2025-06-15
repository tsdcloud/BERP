import React,{useEffect, useState} from 'react';
import Header from '../../components/layout/Header';
import Dialogue from '../../components/incidents/Dialogue';
import Datalist from '../../components/incidents/Movement/Datalist';
import { useFetch } from '../../hooks/useFetch';
import { URLS } from '../../../configUrl';
import Tabs from '../../components/incidents/Tabs';
import _Pagination from '../../components/common/Pagination';
import { Pagination } from 'antd';
import OperationForm from '../../components/incidents/Movement/MovementForm';



const Movement = () => {
    const {handleFetch} = useFetch();
    const [movements, setMovements] = useState([]);
    const [isOpenned, setIsOpenned] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(0);
    const [pageList, setPageList] = useState([]);
    const [searchValue, setSearchValue] = useState("");

    const fetchMovements= async () => {
        let url = `${URLS.INCIDENT_API}/movements`;
        try {
           const response = await handleFetch(url);
           if(response.data){
            console.log(response)
            setMovements(response.data.data);
            setTotalPages(response.data.totalPages);
            setTotal(response.data.total);
            setPage(response.data.page);
           }
        } catch (error) {
            console.log(error);
        }
    }
    const searchMovements= async (url) => {
        try {
           const response = await handleFetch(url);
           if(response.data){
            setMovements(response.data.data);
            setTotalPages(response.data.totalPages);
            setPage(response.data.page);
           }
        } catch (error) {
            console.log(error);
        }
    }
    
    const handleSubmit=()=>{
        fetchMovements();
        document.getElementById("close-dialog").click();
    }

    useEffect(()=>{
        fetchMovements();
    }, []);
    

  return (
    <>
        <Header />
        <div className='px-6'>
            <div className='flex items-center justify-between'>
                {/* Header */}
                <div className='overflow-x-auto'>
                    <Tabs />
                </div>
            </div>
            {/* Table */}
            <div className='w-full bg-white rounded-lg p-2'>
                <div className='px-2 flex justify-between mx-2'>
                    <div className='flex items-center justify-between w-full'>
                        <input 
                            type="text" 
                            className='p-2 border rounded-lg' 
                            placeholder='Recherche...' 
                            value={searchValue}
                            onChange={(e)=>{
                                setSearchValue(e.target.value);
                                searchMovements(`${URLS.INCIDENT_API}/movements?search=${e.target.value}`)
                            }}
                        />
                        {/* Dialog */}
                        <div className='flex gap-2 items-center'>
                            {/* <Input placeholder="Recherche..." className="outline-primary"/> */}
                            <Dialogue 
                                buttonText={"Nouveau deplacement"}
                                header={<h2 className='text-xl font-semibold'>Nouveau deplacement</h2>}
                                content={<OperationForm onSuccess={handleSubmit}/>}
                                isOpenned={isOpenned}
                            />
                        </div>
                    </div>
                </div>
                <Datalist 
                    dataList={movements}
                    fetchData={fetchMovements}
                    pagination={
                        <div className='flex items-center justify-end px-6 w-full'>
                            <p className='text-sm font-bold'>{total} ligne(s)</p>
                            <Pagination 
                                total={total}
                                pageSize={100}
                                onChange={(page)=>{
                                    totalPages > page && fetchIncidents(`${URLS.INCIDENT_API}/movements?page=${page}`)
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

export default Movement