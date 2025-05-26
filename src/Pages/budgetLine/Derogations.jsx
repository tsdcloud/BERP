import Tabs from '../../components/budgetLine/Tabs';
import React, {useEffect, useState, useRef} from 'react';
import Header from '../../components/layout/Header';
import Dialogue from '../../components/budgetLine/Dialogue';
import Datalist from '../../components/budgetLine/Derogations/Datalist';
import InitiateForm from '../../components/budgetLine/Derogations/InitiateForm';
import { useFetch } from '../../hooks/useFetch';
import { URLS } from '../../../configUrl';
import { Pagination } from 'antd';

const Derogations = (props) => {
    const { handleFetch } = useFetch();
    const [derogation, setDerogation] = useState([]);
    const [breakDownBugetLineOf, setBreakDownBugetLineOf] = useState([]);
    const [isOpenned, setIsOpenned] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(0);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(0);

    const currentMonth = new Date().toLocaleString('fr-FR', { month: 'long' }).toLocaleUpperCase()

    const [filteredData, setFilteredData] = useState("");


    const fetchDerogations= async (url) => {
        setIsLoading(true);
        try {
            const response = await handleFetch(url);
            if(response.status === 200){
            setDerogation(response.data);
            setTotalPages(response.totalPages);
            setTotal(response.total);
            setPage(response.currentPage);
            }
        } catch (error) {
            console.log(error)
        }finally{
            setIsLoading(false);
        }
    }

    const handleSubmit=()=>{
        fetchDerogations(`${URLS.API_BUDGETLINE}/derogations/`);
        document.getElementById("close-dialog").click(); 
    }

    useEffect(()=>{
        fetchDerogations(`${URLS.API_BUDGETLINE}/derogations/`);
    }, []);

    console.log("derogations", derogation);

    return(
      <>
        <Header />
        <div className='px-6 space-y-4'>
            {/* Header */}
            {/* Dialog */}
            <div className='flex gap-2 items-center justify-between'>
                <div className='max-w-2/3 overflow-x-auto'>
                    <Tabs />
                </div>
                <Dialogue 
                    buttonText={"Créer"}
                    header={<h2 className='text-xl font-semibold'>Nouvelle Derogations</h2>}
                    content={<InitiateForm onSucess={handleSubmit}/>}
                />
            </div>
            {/* Table */}
            <div className='w-full bg-white rounded-lg p-2'>
                <div className='px-2'>
                    <input 
                        type="text" 
                        className='p-2 border rounded-lg' 
                        placeholder='Recherche...' 
                        value={searchValue}
                        onChange={(e)=>{
                            setSearchValue(e.target.value);
                            fetchDerogations(`${URLS.API_BUDGETLINE}/derogations/?numRef=${e.target.value}&isActive=true`)
                        }}
                    />
                </div>
                <Datalist 
                    dataList={derogation}
                    fetchData={()=>fetchDerogations(`${URLS.API_BUDGETLINE}/derogations/?isActive=true`)}
                    loading={isLoading}
                    searchValue={searchValue}
                    pagination={
                      <div className='flex items-center px-6'>
                          <p className='text-xs text-gray-400'>{derogation?.length} ligne(s)</p>
                          <Pagination 
                            total={total}
                            pageSize={100}
                            onChange={(page)=>{
                                totalPages.length > page && fetchDerogations(`${URLS.API_BUDGETLINE}/derogations/?skip=${page}&isActive=true`)
                            }}
                          />
                      </div>
                    }
                />
            </div>
        </div>
      </>
    )
};

export default Derogations;

