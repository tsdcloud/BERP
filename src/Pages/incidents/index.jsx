import React, {useEffect, useState} from 'react';
import Header from '../../components/layout/Header';
import Dialogue from '../../components/incidents/Dialogue';
import Datalist from '../../components/incidents/Datalist';
import InitiateForm from '../../components/incidents/InitiateForm';
import Tabs from '../../components/incidents/Tabs';
import { useFetch } from '../../hooks/useFetch';
import { URLS } from '../../../configUrl';
import { Pagination } from 'antd';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import ActionHeaders from '../../components/common/ActionHeaders';

const Incident = () =>{
    const {handleFetch} = useFetch();
    const [incidents, setIncidents] = useState([]);
    const [isOpenned, setIsOpenned] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(0);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(0);
    let token = localStorage.getItem('token');

    // Action header states
    const [selectValue, setSelectValue] = useState('');
    const [inputValue, setInputValue] = useState('');
    

    // Action header functions
    const [incidentCauses, setIncidentCauses] = useState([]);
    const [incidentTypes, setIncidentTypes] = useState([]);
    const [sites, setSites] = useState([]);
    const [externalEntities, setExternalEntities] = useState([]);
    const [products, setProducts] = useState([])
    const [employees, setEmployees] = useState([]);
    
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    /**
     * Handles selected filter
     * @param {*} evt 
     */
    const handleOnSelectChange=async(evt)=>{
        setInputValue("");
        fetchIncidents(`${URLS.INCIDENT_API}/incidents`);
        setSelectValue(evt.target.value)
    }


    const handleDisplayInput=(criteria)=>{
        return (<div className={`border p-1 rounded-lg relative flex items-center my-2 focus:outline-blue-300 ${!criteria && 'cursor-not-allowed bg-gray-200'}`}>
            <MagnifyingGlassIcon className='h-4 text-gray-400 px-2'/>
            
            {
                criteria === "statut" ? 
                <select
                    className={`p-1 text-sm w-full md:max-w-[300px] focus:outline-blue-300 ${!criteria && 'cursor-not-allowed bg-gray-200'}`}
                    value={inputValue}
                    onChange={handleInputChange}
                >
                    <option value="PENDING">EN ATTENTE</option>
                    <option value="UNDER_MAINTENANCE">EN MAINTENANCE</option>
                    <option value="CLOSED">CLÔTURER</option>
                </select>
                :
                criteria === "date" ?
                <div className='flex items-center gap-2'>
                    <input 
                        type='date' 
                        value={startDate}
                        onChange={(e) => {
                            setStartDate(e.target.value);
                            const dateValue = e.target.value ? `${e.target.value},${endDate}` : endDate;
                            setInputValue(dateValue);
                            handleInputChange({ target: { value: dateValue } });
                        }}
                        className={`p-1 text-sm w-full md:max-w-[300px] focus:outline-blue-300 ${!criteria && 'cursor-not-allowed bg-gray-200'}`}
                    />
                    <input 
                        type='date' 
                        value={endDate}
                        onChange={(e) => {
                            setEndDate(e.target.value);
                            const dateValue = startDate ? `${startDate},${e.target.value}` : e.target.value;
                            setInputValue(dateValue);
                            handleInputChange({ target: { value: dateValue } });
                        }}
                        className={`p-1 text-sm w-full md:max-w-[300px] focus:outline-blue-300 ${!criteria && 'cursor-not-allowed bg-gray-200'}`}
                    />
                </div>
                :<input 
                    placeholder={criteria ? 'Recherche' : 'Choisir le filtre'}
                    className={`p-1 text-sm w-full md:max-w-[300px] focus:outline-blue-300 ${!criteria && 'cursor-not-allowed bg-gray-200'}`}
                    value={inputValue}
                    onChange={handleInputChange}
                    disabled={criteria ==="" ? true : false }
                />
            }
        </div>)
    }
    /**
     * Handles input search
     * @param {*} evt 
     */
    const handleInputChange=async (evt)=>{
        setInputValue(evt.target.value);
        try {
            fetchIncidents(`${URLS.INCIDENT_API}/incidents?filter=${selectValue}&value=${evt.target.value}`);
        } catch (error) {
            console.log(error);
        }
    }


    const handleSearch=async(url, callback)=>{
        setIsLoading(true);
        try {
           const response = await handleFetch(url);
           if(response.status === 200){
            callback(response.data);
            setTotalPages(response.totalPages);
            setTotal(response.total);
            setPage(response.page);
           }
        } catch (error) {
            console.log(error)
        }finally{
            setIsLoading(false);
        }
    }

    /**
     * Handles fetching Incidents
     * @param {*} url 
     */
    const fetchIncidents= async (url) => {
        setIsLoading(true);
        try {
           const response = await handleFetch(url);
           if(response.status === 200){
            setIncidents(response.data);
            setTotalPages(response?.totalPages);
            setTotal(response?.total);
            setPage(response?.page);
           }
        } catch (error) {
            console.log(error)
        }finally{
            setIsLoading(false);
        }
    }


    /**
     * Handles submitting form
     */
    const handleSubmit=()=>{
        fetchIncidents(`${URLS.INCIDENT_API}/incidents`);
        document.getElementById("close-dialog").click();
    }

    useEffect(()=>{
        fetchIncidents(`${URLS.INCIDENT_API}/incidents`);
    }, []);


    const filterOptions =[
        {value:"numRef", name:"Numéro de référence"},
        {value:"incidentId", name:"Type d'incident"},
        {value:"site", name:"Site"},
        {value:"shift", name:"Quart"},
        {value:"createdBy", name:"Initiateur"},
        {value:"description", name:"Description"},
        {value:"intervener", name:"Intervenant"},
        {value:"closedBy", name:"Cloturer par"},
        {value:"equipmentId", name:"Equipement"},
        {value:"incidentCauseId", name:"Cause incident"},
        // {value:"date", name:"Date"},
        {value:"statut", name:"Status"},
    ];

    return(
        <>
            <Header />
            <div className='px-4 md:px-6 space-y-4'>
                {/* Header */}
                {/* Dialog */}
                <div className='flex gap-2 items-center justify-between'>
                    <div className='max-w-2/3 overflow-x-auto'>
                        <Tabs />
                    </div>
                    <Dialogue 
                        buttonText={"Declarer un incident"}
                        header={<h2 className='text-xl font-semibold'>Déclarer un incident</h2>}
                        content={<InitiateForm onSucess={handleSubmit}/>}
                    />
                </div>
                {/* Table */}
                <div className='w-full bg-white rounded-lg p-2'>
                    <ActionHeaders 
                        filterOptions={filterOptions}
                        selectChange={handleOnSelectChange}
                        selectValue={selectValue}
                        input={handleDisplayInput(selectValue)}
                    />
                    <div className='px-2 flex justify-between'>
                        {/* <div className='flex ite    ms-center'>
                            <input 
                                type="text" 
                                className='p-2 border rounded-lg' 
                                placeholder='Recherche...' 
                                value={searchValue}
                                onChange={(e)=>{
                                    setSearchValue(e.target.value);
                                    fetchIncidents(`${URLS.INCIDENT_API}/incidents?search=${e.target.value}`)
                                }}
                            />
                        </div> */}
                    </div>
                    <Datalist 
                        dataList={incidents}
                        fetchData={()=>fetchIncidents(`${URLS.INCIDENT_API}/incidents`)}
                        loading={isLoading}
                        searchValue={searchValue}
                        pagination={
                            <div className='flex items-center px-6'>
                                <p className='text-sm text-black font-bold'>{total} ligne(s)</p>
                                <Pagination 
                                    total={total}
                                    pageSize={100}
                                    onChange={(page)=>{
                                        totalPages > page && fetchIncidents(`${URLS.INCIDENT_API}/incidents?page=${page}`)
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

export default Incident;