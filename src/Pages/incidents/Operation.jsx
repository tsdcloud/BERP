// import React,{useEffect, useState} from 'react';
// import Header from '../../components/layout/Header';
// import Dialogue from '../../components/incidents/Dialogue';
// import Datalist from '../../components/incidents/Operation/Datalist';
// import { useFetch } from '../../hooks/useFetch';
// import { URLS } from '../../../configUrl';
// import Tabs from '../../components/incidents/Tabs';
// import _Pagination from '../../components/common/Pagination';
// import { Pagination } from 'antd';
// import OperationForm from '../../components/incidents/Operation/OperationForm';



// const Operation = () => {
//     const {handleFetch} = useFetch();
//     const [actionTypes, setActionTypes] = useState([]);
//     const [isOpenned, setIsOpenned] = useState(false);
//     const [totalPages, setTotalPages] = useState(0);
//     const [total, setTotal] = useState(0);
//     const [page, setPage] = useState(0);
//     const [pageList, setPageList] = useState([]);
//     const [searchValue, setSearchValue] = useState("");

//     const fetchOperations= async () => {
//         let url = `${URLS.INCIDENT_API}/operations`;
//         try {
//            const response = await handleFetch(url);
//            if(response.data){
//             console.log(response.data)
//             let generators = await response?.data
//             .filter(item => item?.equipement.title.includes('GROUPE ELECTROGENE'))
//             setActionTypes(generators);
//             setTotalPages(response.totalPages);
//             setTotal(response.total);
//             setPage(response.page);
//            }
//         } catch (error) {
//             console.log(error);
//         }
//     }


//     const searchOperations= async (url) => {
//         try {
//            const response = await handleFetch(url);
//            if(response.data){
//             setActionTypes(response.data);
//             setTotalPages(response.totalPages);
//             setPage(response.page);
//            }
//         } catch (error) {
//             console.log(error);
//         }
//     }
    
//     const handleSubmit=()=>{
//         fetchOperations();
//         document.getElementById("close-dialog").click();
//     }

//     useEffect(()=>{
//         fetchOperations();
//     }, []);
    

//   return (
//     <>
//         <Header />
//         <div className='px-6'>
//             <div className='flex items-center justify-between'>
//                 {/* Header */}
//                 <div className='overflow-x-auto'>
//                     <Tabs />
//                 </div>
                
//             </div>
//             {/* Table */}
//             <div className='w-full bg-white rounded-lg p-2 h-[70vh] flex flex-col'>
//                 <div className='px-2  w-full justify-between mx-2'>
//                     <div className='flex flex-col md:flex-row gap-2 items-center justify-between w-full px-4'>
//                         <input 
//                             type="text" 
//                             className='p-2 border rounded-lg w-full md:w-auto' 
//                             placeholder='Recherche...' 
//                             value={searchValue}
//                             onChange={(e)=>{
//                                 setSearchValue(e.target.value);
//                                 searchOperations(`${URLS.INCIDENT_API}/operations?search=${e.target.value}`)
//                             }}
//                         />
//                         {/* Dialog */}
//                         <div className='flex gap-2 items-center w-full md:w-auto'>
//                             {/* <Input placeholder="Recherche..." className="outline-primary"/> */}
//                             <Dialogue 
//                                 buttonText={"Nouveau suivi de GE"}
//                                 header={<h2 className='text-xl font-semibold'>Nouveau suivi de GE</h2>}
//                                 content={<OperationForm onSuccess={handleSubmit}/>}
//                                 isOpenned={isOpenned}
//                             />
//                         </div>
//                     </div>
//                 </div>
//                 <Datalist 
//                     dataList={actionTypes}
//                     fetchData={fetchOperations}
//                     pagination={
//                         <div className='flex flex-col md:flex-row items-center w-full justify-end px-6'>
//                             <p className='text-md text-black font-bold'>{actionTypes?.length} ligne(s)</p>
//                             <Pagination 
//                                 total={total}
//                                 pageSize={100}
//                                 onChange={(page)=>{
//                                     totalPages > page && fetchIncidents(`${URLS.INCIDENT_API}/operations?page=${page}`)
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

// export default Operation
import React, {useEffect, useState} from 'react';
import Header from '../../components/layout/Header';
import Dialogue from '../../components/incidents/Dialogue';
import Datalist from '../../components/incidents/Operation/Datalist';
import { useFetch } from '../../hooks/useFetch';
import { URLS } from '../../../configUrl';
import Tabs from '../../components/incidents/Tabs';
import { Pagination } from 'antd';
import OperationForm from '../../components/incidents/Operation/OperationForm';

const Operation = () => {
    const {handleFetch} = useFetch();
    const [actionTypes, setActionTypes] = useState([]);
    const [isOpenned, setIsOpenned] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(0);
    const [searchValue, setSearchValue] = useState("");

    const fetchOperations = async () => {
        let url = `${URLS.INCIDENT_API}/operations`;
        try {
           const response = await handleFetch(url);
           if(response.data){
            console.log(response.data)
            let response_ge = await handleFetch(
                `${import.meta.env.VITE_INCIDENT_API}/equipment-groups?search=GROUPE%20ELECTROGENE`
              );
            const equipmentGroupId = response_ge?.data?.data?.[0]?.id || null;
            console.log("equipmentGroupId :", equipmentGroupId);
            let generators = response?.data.filter(item => 
                item?.equipement?.title?.includes('GROUPE ELECTROGENE') ||
                item?.equipement?.equipmentGroupId === equipmentGroupId
            );
            setActionTypes(generators);
            setTotalPages(response.totalPages);
            setTotal(response.total);
            setPage(response.page);
           }
        } catch (error) {
            console.log(error);
        }
    }

    const searchOperations = async (url) => {
        try {
           const response = await handleFetch(url);
           if(response.data){
            setActionTypes(response.data);
            setTotalPages(response.totalPages);
            setPage(response.page);
           }
        } catch (error) {
            console.log(error);
        }
    }
    
    const handleSubmit = () => {
        fetchOperations();
        setIsOpenned(false); // ← Fermer le dialogue via le state
    }

    useEffect(() => {
        fetchOperations();
    }, []);

    return (
        <>
            <Header />
            <div className='px-6'>
                <div className='flex items-center justify-between'>
                    <div className='overflow-x-auto'>
                        <Tabs />
                    </div>
                </div>
                
                <div className='w-full bg-white rounded-lg p-2 h-[70vh] flex flex-col'>
                    <div className='px-2 w-full justify-between mx-2'>
                        <div className='flex flex-col md:flex-row gap-2 items-center justify-between w-full px-4'>
                            <input 
                                type="text" 
                                className='p-2 border rounded-lg w-full md:w-auto' 
                                placeholder='Recherche...' 
                                value={searchValue}
                                onChange={(e) => {
                                    setSearchValue(e.target.value);
                                    searchOperations(`${URLS.INCIDENT_API}/operations?search=${e.target.value}`)
                                }}
                            />
                            
                            <Dialogue 
                                buttonText={"Nouveau suivi de GE"}
                                header={<h2 className='text-xl font-semibold'>Nouveau suivi de GE</h2>}
                                content={<OperationForm onSuccess={handleSubmit} />}
                                isOpenned={isOpenned}
                                setIsOpenned={setIsOpenned} // ← Passer le setter
                            />
                        </div>
                    </div>
                    
                    <Datalist 
                        dataList={actionTypes}
                        fetchData={fetchOperations}
                        pagination={
                            <div className='flex flex-col md:flex-row items-center w-full justify-end px-6'>
                                <p className='text-md text-black font-bold'>{actionTypes?.length} ligne(s)</p>
                                <Pagination 
                                    total={total}
                                    pageSize={100}
                                    onChange={(page) => {
                                        totalPages > page && fetchOperations(`${URLS.INCIDENT_API}/operations?page=${page}`)
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

export default Operation