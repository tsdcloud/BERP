// import React, {useEffect, useState} from 'react';
// import Header from '../../components/layout/Header';
// import Dialogue from '../../components/incidents/Dialogue';
// import HorsPontForm from '../../components/incidents/OffBridge/HorsPontForm'
// import Tabs from '../../components/incidents/Tabs';
// import Datalist from '../../components/incidents/OffBridge/Datalist';
// import { useFetch } from '../../hooks/useFetch';
// import { URLS } from '../../../configUrl';
// import _Pagination from '../../components/common/Pagination';
// import { Pagination } from 'antd';


// const OffBridge = () => {
//     const {handleFetch} = useFetch();
//     const [offBridges, setOffBridges] = useState([]);
//     const [isOpenned, setIsOpenned] = useState(false);
//     const [isLoading, setIsLoading] = useState(true);
//     const [searchValue, setSearchValue] = useState("");
//     const [totalPages, setTotalPages] = useState(0);
//     const [total, setTotal] = useState(0);
//     const [page, setPage] = useState(0);
//     const [pageList, setPageList] = useState([]);

//     const fetchOffBridges= async (url) => {
//         setIsLoading(true)
//         try {
//             const response = await handleFetch(url);
//             if(response.data){
//                 setOffBridges(response.data);
//                 setTotalPages(response.totalPages);
//                 setPage(response.page);
//                 setTotal(response.total)
//             }
//         } catch (error) {
//             console.log(error)
//         }finally{
//             setIsLoading(false)
//         }
//     }

//     const handleSubmit=()=>{
//         fetchOffBridges(`${URLS.INCIDENT_API}/off-bridges`);
//         document.getElementById("close-dialog").click();
//     }

//     const handleSearch=(e)=>{
//         setSearchValue(e.target.value);
//         fetchOffBridges(`${URLS.INCIDENT_API}/off-bridges?search=${e.target.value}`);
//     }
//     useEffect(()=>{
//         fetchOffBridges(`${URLS.INCIDENT_API}/off-bridges`);
//     }, []);

//   return (
//     <>
//         <Header />
//         <div className='px-6 space-y-2'>
//             <div className='flex items-center justify-between'>
//                 {/* Header */}
//                 <div className='max-w-2/3 overflow-x-auto'>
//                     <Tabs />
//                 </div>
//             </div>
//             {/* Table */}
//             <div className='w-full bg-white rounded-lg p-2'>
//                 <div className='px-4 flex flex-col gap-2 sm:flex-row items-center justify-between w-full'>
//                     <input 
//                         type="text" 
//                         className='w-full md:w-auto p-2 text-sm border rounded-lg'
//                         placeholder='Recherche...'
//                         value={searchValue}
//                         onChange={handleSearch} 
//                     />
//                     {/* Dialog */}
//                     <div className='flex gap-2 items-center w-full md:w-auto'>
//                         <Dialogue 
//                             buttonText={"Nouveau hors pont"}
//                             header={<h2 className='text-xl font-semibold'>Nouveau hors pont</h2>}
//                             content={
//                             <HorsPontForm 
//                                 onSucess={handleSubmit}
//                             />}
//                             isOpenned={isOpenned}
//                         />
//                     </div>
//                 </div>
//                 <Datalist 
//                     dataList={offBridges}
//                     fetchData={()=>fetchOffBridges(`${URLS.INCIDENT_API}/off-bridges`)}
//                     // setDataList={setOffBridges}
//                     searchValue={searchValue}
//                     loading={isLoading}
//                     pagination={
//                         <div className='flex flex-col md:flex-row items-center px-6'>
//                             <p className='text-md text-black font-bold'>{total} ligne(s)</p>
//                             <Pagination 
//                                 total={total}
//                                 pageSize={100}
//                                 onChange={(page)=>{
//                                     totalPages > page && fetchOffBridges(`${URLS.INCIDENT_API}/off-bridges?page=${page}`)
//                                 }}
//                             />
//                         </div>
//                     }
//                 />
//             </div>

            
//         </div>
//     </>
//   )
// }

// export default OffBridge

import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Dialogue from '../../components/incidents/Dialogue';
import HorsPontForm from '../../components/incidents/OffBridge/HorsPontForm';
import Tabs from '../../components/incidents/Tabs';
import Datalist from '../../components/incidents/OffBridge/Datalist';
import { useFetch } from '../../hooks/useFetch';
import { URLS } from '../../../configUrl';
import { Pagination } from 'antd';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from '../../components/ui/button';

const OffBridge = () => {
    const { handleFetch } = useFetch();
    const [searchParams] = useSearchParams();

    const [offBridges, setOffBridges] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(0);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(0);
    const [currentFilter, setCurrentFilter] = useState(null);
    const [searchValue, setSearchValue] = useState("");

    /**
     * Récupération des hors‑ponts avec paramètres optionnels (filtre status, page, search)
     */
    const fetchOffBridges = useCallback(async (params = {}) => {
        setIsLoading(true);
        try {
            let url = `${URLS.INCIDENT_API}/off-bridges`;
            const queryParams = new URLSearchParams();

            if (params.page) queryParams.append('page', params.page);
            if (params.status) queryParams.append('status', params.status);
            if (params.search) queryParams.append('search', params.search);

            const queryString = queryParams.toString();
            if (queryString) url += `?${queryString}`;

            const response = await handleFetch(url);
            if (response.data) {
                setOffBridges(response.data);
                setTotalPages(response.totalPages || 0);
                setPage(response.page || 0);
                setTotal(response.total || 0);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }, [handleFetch]);

    /**
     * Recherche textuelle
     */
    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchValue(value);
        const params = { search: value };
        if (currentFilter?.status) params.status = currentFilter.status;
        fetchOffBridges(params);
    };

    /**
     * Réinitialisation du filtre status
     */
    const resetFilter = () => {
        setCurrentFilter(null);
        setSearchValue("");
        fetchOffBridges();
    };

    /**
     * Soumission du formulaire de création
     */
    const handleSubmit = () => {
        fetchOffBridges(currentFilter ? { status: currentFilter.status } : {});
        document.getElementById("close-dialog")?.click();
    };

    /**
     * Gestion du changement de page
     */
    const handlePageChange = (newPage) => {
        if (newPage <= totalPages) {
            const params = { page: newPage };
            if (currentFilter?.status) params.status = currentFilter.status;
            if (searchValue) params.search = searchValue;
            fetchOffBridges(params);
        }
    };

    // Lecture du paramètre `status` dans l’URL au chargement
    useEffect(() => {
        const statusParam = searchParams.get('status');
        if (statusParam && ['PENDING', 'CLOSED', 'IN_PROGRESS'].includes(statusParam)) {
            // Ajustez les statuts selon ce que votre API accepte pour les hors‑ponts
            setCurrentFilter({ status: statusParam });
            fetchOffBridges({ status: statusParam });
        } else {
            fetchOffBridges();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    return (
        <>
            <Header />
            <div className='px-6 space-y-2'>
                <div className='flex items-center justify-between'>
                    <div className='max-w-2/3 overflow-x-auto'>
                        <Tabs />
                    </div>
                </div>
                <div className='w-full bg-white rounded-lg p-2'>
                    <div className='px-4 flex flex-col gap-2 sm:flex-row items-center justify-between w-full'>
                        <div className="flex gap-2 w-full md:w-auto">
                            <input
                                type="text"
                                className='w-full md:w-64 p-2 text-sm border rounded-lg'
                                placeholder='Recherche...'
                                value={searchValue}
                                onChange={handleSearch}
                            />
                            {currentFilter?.status && (
                                <Button
                                    variant="outline"
                                    onClick={resetFilter}
                                    className="flex items-center gap-2 h-10"
                                >
                                    <XMarkIcon className="h-4 w-4" />
                                    Réinitialiser
                                </Button>
                            )}
                        </div>
                        <div className='flex gap-2 items-center w-full md:w-auto'>
                            <Dialogue
                                buttonText={"Nouveau hors pont"}
                                header={<h2 className='text-xl font-semibold'>Nouveau hors pont</h2>}
                                content={<HorsPontForm onSucess={handleSubmit} />}
                            />
                        </div>
                    </div>
                    <Datalist
                        dataList={offBridges}
                        fetchData={() => fetchOffBridges(currentFilter ? { status: currentFilter.status } : {})}
                        searchValue={searchValue}
                        loading={isLoading}
                        pagination={
                            <div className='flex flex-col md:flex-row items-center px-6'>
                                <p className='text-md text-black font-bold'>{total} ligne(s)</p>
                                <Pagination
                                    total={total}
                                    pageSize={100}
                                    current={page}
                                    onChange={handlePageChange}
                                    showSizeChanger={false}
                                />
                            </div>
                        }
                    />
                </div>
            </div>
        </>
    );
};

export default OffBridge;