// import React, {useEffect, useState} from 'react';
// import Header from '../../components/layout/Header';
// import Dialogue from '../../components/incidents/Dialogue';
// import Datalist from '../../components/incidents/Datalist';
// import InitiateForm from '../../components/incidents/InitiateForm';
// import Tabs from '../../components/incidents/Tabs';
// import { useFetch } from '../../hooks/useFetch';
// import { URLS } from '../../../configUrl';
// import { Pagination } from 'antd';
// import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
// import ActionHeaders from '../../components/common/ActionHeaders';

// const Incident = () =>{
//     const {handleFetch} = useFetch();
//     const [incidents, setIncidents] = useState([]);
//     const [isOpenned, setIsOpenned] = useState(false);
//     const [searchValue, setSearchValue] = useState("");
//     const [isLoading, setIsLoading] = useState(true);
//     const [totalPages, setTotalPages] = useState(0);
//     const [total, setTotal] = useState(0);
//     const [page, setPage] = useState(0);
//     let token = localStorage.getItem('token');

//     // Action header states
//     const [selectValue, setSelectValue] = useState('');
//     const [inputValue, setInputValue] = useState('');
    

//     // Action header functions
//     const [incidentCauses, setIncidentCauses] = useState([]);
//     const [incidentTypes, setIncidentTypes] = useState([]);
//     const [sites, setSites] = useState([]);
//     const [externalEntities, setExternalEntities] = useState([]);
//     const [products, setProducts] = useState([])
//     const [employees, setEmployees] = useState([]);
    
//     const [startDate, setStartDate] = useState('');
//     const [endDate, setEndDate] = useState('');

//     /**
//      * Handles selected filter
//      * @param {*} evt 
//      */
//     const handleOnSelectChange=async(evt)=>{
//         setInputValue("");
//         fetchIncidents(`${URLS.INCIDENT_API}/incidents`);
//         setSelectValue(evt.target.value)
//     }


//     const handleDisplayInput=(criteria)=>{
//         return (<div className={`border p-1 rounded-lg w-full md:max-w-[300px] relative flex items-center my-2 focus:outline-blue-300 ${!criteria && 'cursor-not-allowed bg-gray-200'}`}>
//             <MagnifyingGlassIcon className='h-4 text-gray-400 px-2'/>
            
//             {
//                 criteria === "statut" ? 
//                 <select
//                     className={`p-1 text-sm w-full md:max-w-[300px] focus:outline-blue-300 ${!criteria && 'cursor-not-allowed bg-gray-200'}`}
//                     value={inputValue}
//                     onChange={handleInputChange}
//                 >
//                     <option value="PENDING">EN ATTENTE</option>
//                     <option value="UNDER_MAINTENANCE">EN MAINTENANCE</option>
//                     <option value="CLOSED">CLÔTURER</option>
//                 </select>
//                 :
//                 criteria === "date" ?
//                 <div className='flex items-center gap-2'>
//                     <input 
//                         type='date' 
//                         value={startDate}
//                         onChange={(e) => {
//                             setStartDate(e.target.value);
//                             const dateValue = e.target.value ? `${e.target.value},${endDate}` : endDate;
//                             setInputValue(dateValue);
//                             handleInputChange({ target: { value: dateValue } });
//                         }}
//                         className={`p-1 text-sm w-full md:max-w-[300px] focus:outline-blue-300 ${!criteria && 'cursor-not-allowed bg-gray-200'}`}
//                     />
//                     <input 
//                         type='date' 
//                         value={endDate}
//                         onChange={(e) => {
//                             setEndDate(e.target.value);
//                             const dateValue = startDate ? `${startDate},${e.target.value}` : e.target.value;
//                             setInputValue(dateValue);
//                             handleInputChange({ target: { value: dateValue } });
//                         }}
//                         className={`p-1 text-sm w-full md:max-w-[300px] focus:outline-blue-300 ${!criteria && 'cursor-not-allowed bg-gray-200'}`}
//                     />
//                 </div>
//                 :<input 
//                     placeholder={criteria ? 'Recherche' : 'Choisir le filtre'}
//                     className={`p-1 text-sm w-full md:max-w-[300px] focus:outline-blue-300 ${!criteria && 'cursor-not-allowed bg-gray-200'}`}
//                     value={inputValue}
//                     onChange={handleInputChange}
//                     disabled={criteria ==="" ? true : false }
//                 />
//             }
//         </div>)
//     }
//     /**
//      * Handles input search
//      * @param {*} evt 
//      */
//     const handleInputChange=async (evt)=>{
//         setInputValue(evt.target.value);
//         try {
//             fetchIncidents(`${URLS.INCIDENT_API}/incidents?filter=${selectValue}&value=${evt.target.value}`);
//         } catch (error) {
//             console.log(error);
//         }
//     }


//     const handleSearch=async(url, callback)=>{
//         setIsLoading(true);
//         try {
//             const response = await handleFetch(url);
//             if(response.status === 200){
//                 callback(response.data);
//                 setTotalPages(response.totalPages);
//                 setTotal(response.total);
//                 setPage(response.page);
//             }
//         } catch (error) {
//             console.log(error)
//         }finally{
//             setIsLoading(false);
//         }
//     }

//     /**
//      * Handles fetching Incidents
//      * @param {*} url 
//      */
//     const fetchIncidents= async (url) => {
//         setIsLoading(true);
//         try {
//             const response = await handleFetch(url);
//             console.log(response);
//             if(response.status === 200){
//                 // setIncidents(response.data);
//                 // Ajouter une key unique à chaque élément
//                 const dataWithKeys = response.data.map(item => ({
//                     ...item,
//                     key: item.id // Utilisez l'id comme clé unique
//                 }));
//                 setIncidents(dataWithKeys);
//                 setTotalPages(response?.totalPages);
//                 setTotal(response?.total);
//                 setPage(response?.page);
//             }
//         } catch (error) {
//             console.log(error)
//         }finally{
//             setIsLoading(false);
//         }
//     }


//     /**
//      * Handles submitting form
//      */
//     const handleSubmit=()=>{
//         fetchIncidents(`${URLS.INCIDENT_API}/incidents`);
//         document.getElementById("close-dialog").click();
//     }

//     useEffect(()=>{
//         fetchIncidents(`${URLS.INCIDENT_API}/incidents`);
//     }, []);


//     const filterOptions =[
//         {value:"numRef", name:"Numéro de référence"},
//         {value:"incidentId", name:"Type d'incident"},
//         {value:"site", name:"Site"},
//         {value:"shift", name:"Quart"},
//         {value:"createdBy", name:"Initiateur"},
//         {value:"description", name:"Description"},
//         {value:"hasStoppedOperations", name:"Arrêt opération"},
//         {value:"intervener", name:"Intervenant"},
//         {value:"closedBy", name:"Cloturer par"},
//         {value:"equipmentId", name:"Equipement"},
//         {value:"incidentCauseId", name:"Cause incident"},
//         // {value:"date", name:"Date"},
//         {value:"statut", name:"Status"},
//     ];

//     return(
//         <>
//             <Header />
//             <div className='px-4 md:px-6 space-y-4'>
//                 {/* Header */}
//                 {/* Dialog */}
//                 <div className='flex gap-2 items-center justify-between'>
//                     <div className='max-w-2/3 overflow-x-auto'>
//                         <Tabs />
//                     </div>
//                 </div>
//                 {/* Table */}
//                 <div className='w-full bg-white rounded-lg p-2'>
//                     <div className='flex flex-col md:flex-row items-center justify-between'>
//                         <ActionHeaders 
//                             filterOptions={filterOptions}
//                             selectChange={handleOnSelectChange}
//                             selectValue={selectValue}
//                         input={handleDisplayInput(selectValue)}
//                         />
//                         <Dialogue 
//                             buttonText={"Declarer un incident"}
//                             header={<h2 className='text-xl font-semibold'>Déclarer un incident</h2>}
//                             content={<InitiateForm onSucess={handleSubmit}/>}
//                         />
//                     </div>
                    
//                     <Datalist 
//                         dataList={incidents}
//                         fetchData={()=>fetchIncidents(`${URLS.INCIDENT_API}/incidents`)}
//                         loading={isLoading}
//                         searchValue={searchValue}
//                         pagination={
//                             <div className='flex items-center px-6'>
//                                 <p className='text-sm text-black font-bold'>{total} ligne(s)</p>
//                                 <Pagination 
//                                     total={total}
//                                     pageSize={100}
//                                     current={page} // Ajoute ça pour suivre la page active
//                                     onChange={(newPage)=>{
//                                         if (newPage <= totalPages) {
//                                         fetchIncidents(`${URLS.INCIDENT_API}/incidents?page=${newPage}`);
//                                         }
//                                     }}
//                                 />
//                             </div>
//                         }
//                     />
//                 </div>
//             </div>
//         </>
//     )
// }

// export default Incident;

import {useEffect, useState, useCallback} from 'react';
import Header from '../../components/layout/Header';
import Dialogue from '../../components/incidents/Dialogue';
import Datalist from '../../components/incidents/Datalist';
import InitiateForm from '../../components/incidents/InitiateForm';
import Tabs from '../../components/incidents/Tabs';
import { useFetch } from '../../hooks/useFetch';
import { URLS } from '../../../configUrl';
import { Pagination } from 'antd';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'; // Ajoutez XMarkIcon ici
import ActionHeaders from '../../components/common/ActionHeaders';
import { Button } from '../../components/ui/button'; // IMPORTANT: Ajoutez cette importation

const Incident = () =>{
    const {handleFetch} = useFetch();
    const [incidents, setIncidents] = useState([]);
    // const [isOpenned, setIsOpenned] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(0);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(0);
    const [currentFilter, setCurrentFilter] = useState(null);

    // Action header states
    const [selectValue, setSelectValue] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    /**
     * Fonction principale pour récupérer les incidents
     */
    const fetchIncidents = useCallback(async (params = {}) => {
        setIsLoading(true);
        try {
            let url = `${URLS.INCIDENT_API}/incidents`;
            const queryParams = new URLSearchParams();
            
            // Ajouter la pagination
            if (params.page) {
                queryParams.append('page', params.page);
            }
            
            // Ajouter le filtre si présent
            if (params.filter && params.value) {
                queryParams.append('filter', params.filter);
                queryParams.append('value', params.value);
            }
            
            // Construire l'URL finale
            const queryString = queryParams.toString();
            if (queryString) {
                url += `?${queryString}`;
            }
            
            const response = await handleFetch(url);
            console.log("Réponse API:", response);
            
            if(response.status === 200){
                const dataWithKeys = response.data.map(item => ({
                    ...item,
                    key: item.id
                }));
                setIncidents(dataWithKeys);
                setTotalPages(response?.totalPages || 0);
                setTotal(response?.total || 0);
                setPage(response?.page || 0);
            }
        } catch (error) {
            console.error("Erreur fetch incidents:", error);
        } finally {
            setIsLoading(false);
        }
    }, [handleFetch]);

    /**
     * Gestion changement filtre
     */
    const handleOnSelectChange = (evt) => {
        const value = evt.target.value;
        setSelectValue(value);
        setInputValue("");
        setStartDate("");
        setEndDate("");
        setCurrentFilter(null);
        
        // Réinitialiser à la liste complète si on supprime le filtre
        if (!value) {
            fetchIncidents();
        }
    };

    /**
     * Gestion changement valeur de recherche
     */
    const handleInputChange = useCallback(async (evt) => {
        const value = evt.target.value;
        setInputValue(value);
        
        if (selectValue && value) {
            setCurrentFilter({
                filter: selectValue,
                value: value
            });
            fetchIncidents({ filter: selectValue, value: value });
        } else if (!value) {
            // Si la valeur est vide, réinitialiser
            setCurrentFilter(null);
            fetchIncidents();
        }
    }, [selectValue, fetchIncidents]);

    /**
     * Gestion date de début
     */
    const handleStartDateChange = (e) => {
        const value = e.target.value;
        setStartDate(value);
        
        // Si les deux dates sont définies, appliquer le filtre
        if (value && endDate) {
            const dateValue = `${value},${endDate}`;
            setInputValue(dateValue);
            setCurrentFilter({
                filter: 'date',
                value: dateValue
            });
            fetchIncidents({ filter: 'date', value: dateValue });
        } else if (!value && endDate) {
            // Si début vide mais fin remplie, réinitialiser
            setCurrentFilter(null);
            fetchIncidents();
        }
    };

    /**
     * Gestion date de fin
     */
    const handleEndDateChange = (e) => {
        const value = e.target.value;
        setEndDate(value);
        
        // Si les deux dates sont définies, appliquer le filtre
        if (startDate && value) {
            const dateValue = `${startDate},${value}`;
            setInputValue(dateValue);
            setCurrentFilter({
                filter: 'date',
                value: dateValue
            });
            fetchIncidents({ filter: 'date', value: dateValue });
        } else if (startDate && !value) {
            // Si début rempli mais fin vide, réinitialiser
            setCurrentFilter(null);
            fetchIncidents();
        }
    };

    /**
     * Gestion changement de page
     */
    const handlePageChange = (newPage) => {
        if (newPage <= totalPages) {
            const params = { page: newPage };
            if (currentFilter) {
                params.filter = currentFilter.filter;
                params.value = currentFilter.value;
            }
            fetchIncidents(params);
        }
    };

    /**
     * Rendu du champ d'input selon le filtre sélectionné
     */
    const handleDisplayInput = (criteria) => {
        return (
            <div className={`border p-1 rounded-lg w-full md:max-w-[300px] relative flex items-center my-2 focus:outline-blue-300 ${!criteria && 'cursor-not-allowed bg-gray-200'}`}>
                <MagnifyingGlassIcon className='h-4 text-gray-400 px-2'/>
                
                {criteria === "statut" ? (
                    <select
                        className={`p-1 text-sm w-full md:max-w-[300px] focus:outline-blue-300 ${!criteria && 'cursor-not-allowed bg-gray-200'}`}
                        value={inputValue}
                        onChange={handleInputChange}
                    >
                        <option value="">Sélectionner un statut</option>
                        <option value="PENDING">EN ATTENTE</option>
                        <option value="UNDER_MAINTENANCE">EN MAINTENANCE</option>
                        <option value="CLOSED">CLÔTURER</option>
                    </select>
                ) : criteria === "date" ? (
                    <div className='flex items-center gap-2 w-full'>
                        <input 
                            type='date' 
                            value={startDate}
                            onChange={handleStartDateChange}
                            className={`p-1 text-sm w-full focus:outline-blue-300 ${!criteria && 'cursor-not-allowed bg-gray-200'}`}
                        />
                        <span className='text-gray-400'>à</span>
                        <input 
                            type='date' 
                            value={endDate}
                            onChange={handleEndDateChange}
                            className={`p-1 text-sm w-full focus:outline-blue-300 ${!criteria && 'cursor-not-allowed bg-gray-200'}`}
                        />
                    </div>
                ) : (
                    <input 
                        placeholder={criteria ? `Rechercher par ${filterOptions.find(f => f.value === criteria)?.name?.toLowerCase() || criteria}` : 'Choisir le filtre'}
                        className={`p-1 text-sm w-full md:max-w-[300px] focus:outline-blue-300 ${!criteria && 'cursor-not-allowed bg-gray-200'}`}
                        value={inputValue}
                        onChange={handleInputChange}
                        disabled={!criteria}
                    />
                )}
            </div>
        );
    };

    /**
     * Réinitialiser tous les filtres
     */
    const resetFilters = () => {
        setSelectValue('');
        setInputValue('');
        setStartDate('');
        setEndDate('');
        setCurrentFilter(null);
        fetchIncidents();
    };

    useEffect(() => {
        fetchIncidents();
    }, []);

    const filterOptions = [
        {value:"numRef", name:"Numéro de référence"},
        {value:"incidentId", name:"Type d'incident"},
        {value:"site", name:"Site"},
        {value:"shift", name:"Quart"},
        {value:"createdBy", name:"Initiateur"},
        {value:"description", name:"Description"},
        {value:"hasStoppedOperations", name:"Arrêt opération"},
        {value:"intervener", name:"Intervenant"},
        {value:"closedBy", name:"Cloturer par"},
        {value:"equipmentId", name:"Equipement"},
        {value:"incidentCauseId", name:"Cause incident"},
        {value:"date", name:"Date"},
        {value:"statut", name:"Status"},
    ];

    return(
        <>
            <Header />
            <div className='px-4 md:px-6 space-y-4'>
                <div className='flex gap-2 items-center justify-between'>
                    <div className='max-w-2/3 overflow-x-auto'>
                        <Tabs />
                    </div>
                </div>
                
                <div className='w-full bg-white rounded-lg p-2'>
                    <div className='flex flex-col md:flex-row items-center justify-between mb-4'>
                        <div className="flex flex-col md:flex-row items-center gap-4 w-full">
                            <ActionHeaders 
                                filterOptions={filterOptions}
                                selectChange={handleOnSelectChange}
                                selectValue={selectValue}
                                input={handleDisplayInput(selectValue)}
                            />
                            
                            {(selectValue || inputValue || startDate || endDate) && (
                                <Button
                                    variant="outline"
                                    onClick={resetFilters}
                                    className="flex items-center gap-2 h-10"
                                >
                                    <XMarkIcon className="h-4 w-4" />
                                    Réinitialiser
                                </Button>
                            )}
                        </div>
                        
                        <Dialogue 
                            buttonText={"Declarer un incident"}
                            header={<h2 className='text-xl font-semibold'>Déclarer un incident</h2>}
                            content={<InitiateForm onSucess={() => {
                                fetchIncidents();
                                document.getElementById("close-dialog").click();
                            }}/>}
                        />
                    </div>
                    
                    <Datalist 
                        dataList={incidents}
                        fetchData={() => fetchIncidents(currentFilter || {})}
                        loading={isLoading}
                        searchValue={inputValue} // Passe la valeur de recherche au Datalist
                        pagination={
                            <div className='flex items-center justify-between px-6 py-4'>
                                <p className='text-sm text-black font-bold'>{total} ligne(s)</p>
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

export default Incident;