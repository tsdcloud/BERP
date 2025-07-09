import React, {useEffect, useState} from 'react';
import Header from '../../components/layout/Header';
import Dialogue from '../../components/incidents/Dialogue';
import InitiateForm from '../../components/incidents/Maintenance/InitiateForm';
import Tabs from '../../components/incidents/Tabs';
import Datalist from '../../components/incidents/Maintenance/Datalist';
import { useFetch } from '../../hooks/useFetch';
import { URLS } from '../../../configUrl';
import { Pagination } from 'antd';
import VerifyPermission from '../../utils/verifyPermission';
import ActionHeaders from '../../components/common/ActionHeaders';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';



const Maintenance = () => {
    const {handleFetch} = useFetch();
    const [maintenances, setMaintenances] = useState([]);
    const [isOpenned, setIsOpenned] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [searchValue, setSearchValue] = useState("");
    const [totalPages, setTotalPages] = useState(0);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(0);
    const [pageList, setPageList] = useState([]);

    // Action header states
    const [selectValue, setSelectValue] = useState('');
    const [inputValue, setInputValue] = useState('');

    const fetchMaintenance= async (url) => {
        setIsLoading(true)
        try {
           const response = await handleFetch(url);
           if(response.data){
            setMaintenances(response.data);
            setTotalPages(response.totalPages);
            setTotal(response.total);
            setPage(response.page);
           }
        } catch (error) {
            console.log(error)
        }finally{
            setIsLoading(false)
        }
    }

    const handleSubmit=()=>{
        fetchMaintenance(`${URLS.INCIDENT_API}/maintenances`);
        document.getElementById("close-dialog").click();
    }

    const handleSearch=(e)=>{
        setSearchValue(e.target.value);
        fetchMaintenance(`${URLS.INCIDENT_API}/maintenances?search=${e.target.value}`)
    }

    useEffect(()=>{
        fetchMaintenance(`${URLS.INCIDENT_API}/maintenances`);
    }, []);


     /**
     * Handles selected filter
     * @param {*} evt 
     */
     const handleOnSelectChange=async(evt)=>{
        setInputValue("");
        fetchMaintenance(`${URLS.INCIDENT_API}/maintenances`);
        setSelectValue(evt.target.value)
    }

    const handleDisplayInput=(criteria)=>{
        return (<div className={`border p-1 rounded-lg w-full md:max-w-[300px] relative flex items-center my-2 focus:outline-blue-300 ${!criteria && 'cursor-not-allowed bg-gray-200'}`}>
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
            fetchMaintenance(`${URLS.INCIDENT_API}/maintenances?filter=${selectValue}&value=${evt.target.value}`);
        } catch (error) {
            console.log(error);
        }
    }


    const filterOptions =[
        {value:"numRef", name:"Numéro de référence"},
        {value:"incidentRef", name:"No Réf incident"},
        {value:"equipementId", name:"Equipement"},
        {value:"siteId", name:"Site"},
        {value:"createdBy", name:"Utilisateur"},
        {value:"closedBy", name:"Cloturer par"},
        {value:"intervainer", name:"Maintenancier"},
        {value:"description", name:"Description"},
        {value:"createdAt", name:"Date de création"},
        {value:"closedAt", name:"Date de clôture"},
        {value:"statut", name:"Status"},
    ];

  return (
    <>
        <Header />
        <div className='px-6 space-y-2'>
            <div className='flex items-center justify-between'>
                {/* Header */}
                <div className='max-w-2/3 overflow-x-auto'>
                    <Tabs />
                </div>
            </div>
            {/* Table */}
            <div className='w-full bg-white rounded-lg p-2'>
                <div className='flex flex-col md:flex-row items-center justify-between'>
                    <ActionHeaders 
                        filterOptions={filterOptions}
                        selectChange={handleOnSelectChange}
                        selectValue={selectValue}
                        input={handleDisplayInput(selectValue)}
                    />
                    <Dialogue 
                        buttonText={"Nouvelle maintenance"}
                        header={<h2 className='text-xl font-semibold'>Nouvelle maintenance</h2>}
                        content={
                        <InitiateForm 
                            onSucess={handleSubmit}
                        />}
                        isOpenned={isOpenned}
                    />
                </div>
                <Datalist 
                    dataList={maintenances}
                    fetchData={()=>fetchMaintenance(`${URLS.INCIDENT_API}/maintenances`)}
                    setDataList={setMaintenances}
                    searchValue={searchValue}
                    loading={isLoading}
                    pagination={
                        <div className='flex flex-col md:flex-row items-center px-6'>
                            <p className='text-md text-black font-bold'>{total} ligne(s)</p>
                            <Pagination 
                                total={total}
                                pageSize={100}
                                onChange={(page)=>{
                                    totalPages > page && fetchMaintenance(`${URLS.INCIDENT_API}/maintenances?page=${page}`)
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

export default Maintenance