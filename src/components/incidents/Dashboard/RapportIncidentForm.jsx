import React, {useEffect, useState} from 'react'
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import Preloader from '../../common/Preloader';
import { useForm } from 'react-hook-form';
import { URLS } from '../../../../configUrl';
import { useFetch } from '../../../hooks/useFetch';
import AutoComplete from '../../common/AutoComplete';
import { Button } from '../../ui/button';
dayjs.extend(customParseFormat);

const dateFormat = 'YYYY-MM-DDThh:mm:ssZ';



const RapportIncidentForm = ({onSubmit}) => {

    const {setValue, handleSubmit, reset, formState:{errors}, register} = useForm();
    const {handleFetch, handlePost} = useFetch();
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [error, setError] = useState("");

    // Listing states
    const [incidentTypes, setIncidentTypes] = useState([])
    const [incidentCauses, setIncidentCauses] = useState([])
    const [equipements, setEquipements] = useState([])
    const [sites, setSites] = useState([])
    const [shifts, setShifts] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [suppliers, setSuppliers] = useState([]);

    const [isLoadingEquipment, setIsLoadingEquipments] = useState(true);
    const [isLoadingTypes, setIsLoadingTypes] = useState(true);
    const [isLoadingSupport, setIsLoadingSupport] = useState(true);
    const [isLoadingSite, setIsLoadingSite] = useState(true);
    const [isLoadingShift, setIsLoadingShift] = useState(true);
    const [isLoadingCauses, setIsLoadingCauses] = useState(true);
    const [isLoadingEmployees, setIsLoadingEmployees] = useState(true);

    // Criteria
    const [criteria, setCriteria] = useState("");
    const [condition, setCondition] = useState("EQUAL");
    let token = localStorage.getItem("token");



    // Fetching data from various endpoints

    // Fetch incident types
    const fetchIncidentTypes = async()=>{
        setIsLoadingTypes(true);
        let url = `${URLS.INCIDENT_API}/incident-types`
        try {
            let response = await handleFetch(url);
            if(response.status !== 200){
                alert("Echec. Impossible d'obtenir la list de type d'incidents")
                return;
            }
            let formatedData = response?.data.map(item=>{
                return {
                  name:item?.name,
                  value: item?.id
                }
              });
            setIncidentTypes(formatedData);
        } catch (error) {
            console.log(error);
        }finally{
            setIsLoadingTypes(false);
        }
    }
    // Fetch incident causes 
    const fetchIncidentCauses = async()=>{
        setIsLoadingCauses(true);
        let url = `${URLS.INCIDENT_API}/incident-causes`
        try {
            let response = await handleFetch(url);
            if(response.status !== 200){
                alert("Echec. Impossible d'obtenir la list des causes d'incidents")
                return;
            }
            let formatedData = response?.data.map(item=>{
                return {
                  name:item?.name,
                  value: item?.id
                }
            });
            setIncidentCauses(formatedData);
        } catch (error) {
            console.log(error);
        }finally{
            setIsLoadingCauses(false);
        }
    }
    // Fetch equipements 
    const fetchEquipements = async()=>{
        setIsLoadingEquipments(true)
        let url = `${URLS.INCIDENT_API}/equipements`
        try {
            let response = await handleFetch(url);
            if(response.status !== 200){
                alert("Echec. Impossible d'obtenir la list d'equipement'")
                return;
            }
            let formatedData = response?.data.map(item=>{
                return {
                  name:item?.title,
                  value: item?.id
                }
            });
            setEquipements(formatedData);
        } catch (error) {
            console.log(error);
        }finally{
            setIsLoadingEquipments(false);
        }
    }
    // Fetch sites 
    const fetchSites = async()=>{
        setIsLoadingSite(true);
        let url = `${URLS.ENTITY_API}/sites`
        try {
            let response = await handleFetch(url);
            if(response.status !== 200){
                alert("Echec. Impossible d'obtenir la list de soite")
                return;
            }
            let formatedData = response?.data.map(item=>{
                return {
                  name:item?.name,
                  value: item?.id
                }
            });
            setSites(formatedData);
        } catch (error) {
            console.log(error);
        }finally{
            setIsLoadingSite(false);
        }
    }
    // Fetch Employees 
    const fetchEmployees = async()=>{
        setIsLoadingEmployees(true);
        let url = `${URLS.ENTITY_API}/employees`
        try {
            let response = await handleFetch(url);
            if(response.status !== 200){
                alert("Echec. Impossible d'obtenir la list des employes")
                return;
            }
            let formatedData = response?.data.map(item=>{
                return {
                  name:item?.name,
                  value: item?.id
                }
            });
            setEmployees(formatedData);
        } catch (error) {
            console.log(error);
        }finally{
            setIsLoadingEmployees(false);
        }
    }
    // Fetch shifts 
    const fetchShits = async()=>{
        setIsLoadingShift(true);
        let url = `${URLS.ENTITY_API}/shifts`
        try {
            let response = await handleFetch(url);
            if(response.status !== 200){
                alert("Echec. Impossible d'obtenir la list des shifts")
                return;
            }
            let formatedData = response?.data.map(item=>{
                return {
                  name:item?.name,
                  value: item?.id
                }
            });
            setShifts(formatedData);
        } catch (error) {
            console.log(error);
        }finally{
            setIsLoadingShift(false);
        }
    }

    const handleStartDate = (date) =>{
        const formattedDate = date.format(dateFormat);
        setValue("startDate", formattedDate);
        setError("");
    }
    const handleEndDate = (date) =>{
        const formattedDate = date.format(dateFormat);
        setValue("endDate",formattedDate);
        setError("");
    }

    const generateReport=async(data)=>{
        setError("");
        let {startDate, endDate, value} = data;
        if(criteria === "date"){
            if(startDate === "" || endDate === ""){
                setError("La date de début et la date de fin sont requises");
                return
            }
        }
        else{
            if(criteria === ""|| condition === "" || !value){
                setError("tous les champs (*) sont requis");
                return;
            }
        }
        setIsLoading(true);
        let url =`${URLS.INCIDENT_API}/incidents/file?criteria=${criteria}&condition=${condition}&value=${value}&start=${startDate ? new Date(startDate).toISOString():''}&end=${endDate?new Date(endDate).toISOString():''}`;
        let requestOptions ={
            headers:{
                "Content-Type":"application/json",
                'authorization': `Bearer ${token}`
            }
        }
        try {
            let response = await fetch(url, requestOptions);
            if(response.status === 200){
                const result = await response.json();
                const link = document.createElement('a');
                link.href = result?.downloadLink;
                link.download = 'incidents-export.xlsx';
                link.click();
                onSubmit()
                return; 
            }
            setError("Echec du telechargement du rapport");            
        } catch (error) {
            console.log(error);
        }finally{
            setIsLoading(false);
        }
    }

    const handleSearch=async(url)=>{
        setIsLoading(true);
        try {
            let response = await handleFetch(url);
            if(response?.status === 200){
                let formatedData = response?.data.map(item=>{
                    return {
                      name:item?.title || item?.name,
                      value: item?.id
                    }
                });
                return formatedData
            }
        } catch (error) {
            console.log(error);
        }finally{
            setIsLoading(false);
        }
    }

    /**
     * Displaying field based on the selected criteria
     */
    const handleDisplayFields=(criteria)=>{
        switch(criteria){
            case "incidentId":
                return <AutoComplete 
                            dataList={incidentTypes}
                            placeholder="Recherche type d'incident"
                            isLoading={isLoadingTypes}
                            onSearch={async (value)=>{
                                try {
                                    setIsLoadingTypes(true);
                                    let url = `${URLS.INCIDENT_API}/incident-types?search=${value}`
                                    let result = await handleSearch(url);
                                    setIncidentTypes(result);
                                } catch (error) {
                                    console.error(error)
                                }finally{
                                    setIsLoadingTypes(false);
                                }
                            }}
                            onSelect={(value)=>{
                                if(value){
                                    setValue('value', value?.value)
                                }else{
                                    setValue('value', null)
                                }
                            }}
                        />
            break;
            case "incidentCauseId":
                return <AutoComplete 
                            dataList={incidentCauses}
                            placeholder="Recherche cause d'incident"
                            isLoading={isLoadingCauses}
                            clearDependency={criteria}
                            onSearch={async (value)=>{
                                try {
                                    setIsLoadingCauses(true);
                                    let url = `${URLS.INCIDENT_API}/incident-causes?search=${value}`
                                    let result = await handleSearch(url);
                                    setIncidentCauses(result);
                                } catch (error) {
                                    console.log(error);
                                }finally{
                                    setIsLoadingCauses(false);
                                }
                            }}
                            onSelect={(value)=>{
                                if(value){
                                    setValue('value', value?.value)
                                }else{
                                    setValue('value', null)
                                }
                            }}
                        />
            break;
            case "siteId":
                return <AutoComplete 
                            dataList={sites}
                            placeholder="Recherche site"
                            isLoading={isLoadingSite}
                            onSearch={async (value)=>{
                                try {
                                    setIsLoadingSite(true);
                                    let url = `${URLS.ENTITY_API}/sites?search=${value}`
                                    let result = await handleSearch(url);
                                    setSites(result);
                                } catch (error) {
                                    console.log(error);
                                }finally{
                                    setIsLoadingSite(false);
                                }
                            }}
                            onSelect={(value)=>{
                                if(value){
                                    setValue('value', value?.value)
                                }else{
                                    setValue('value', null)
                                }
                            }}
                        />
            break;
            case "equipementId":
                return <AutoComplete 
                            dataList={equipements}
                            placeholder="Recherche equipement"
                            isLoading={isLoadingEquipment}
                            onSearch={async (value)=>{
                                try {
                                    setIsLoadingEquipments(true);
                                    let url = `${URLS.INCIDENT_API}/equipements?search=${value}`
                                    let result = await handleSearch(url);
                                    setEquipements(result);
                                } catch (error) {
                                    console.log(error)
                                }finally{
                                    setIsLoadingEquipments(false)
                                }
                            }}
                            onSelect={(value)=>{
                                if(value){
                                    setValue('value', value?.value)
                                }else{
                                    setValue('value', null)
                                }
                            }}
                        />
            break;
            case "technician":
                return <AutoComplete 
                            dataList={[...employees, ...suppliers]}
                            placeholder="Recherche intervenant"
                            isLoading={isLoadingSupport && isLoadingEmployees}
                            onSearch={async (value)=>{
                                try {
                                    setIsLoadingEmployees(true);
                                    setIsLoadingSupport(true);
                                    let url_employee = `${URLS.ENTITY_API}/employees?search=${value}`;
                                    let result_employee = await handleSearch(url_employee);
                                    setEmployees(result_employee);
                                    
                                    let url_suppliers = `${URLS.ENTITY_API}/suppliers?search=${value}`;
                                    let result_suppliers = await handleSearch(url_suppliers);
                                    setSuppliers(result_suppliers);
                                } catch (error) {
                                    console.log(error)
                                }finally{
                                    setIsLoadingEmployees(false);
                                    setIsLoadingSupport(false);
                                }
                                
                            }}
                            onSelect={(value)=>{
                                if(value){
                                    setValue('value', value?.value);
                                }else{
                                    setValue('value', null);
                                }
                            }}
                            register={{...register('value', {required:'Ce champs est requis'})}}
                            error={errors.technician}
                            errorMessage={<p className='text-sm text-red-500'>{errors.technician && errors.technician?.message}</p>}
                        />
            break;
            case "shiftId":
                return <AutoComplete 
                            dataList={shifts}
                            placeholder="Recherche shift"
                            isLoading={isLoadingShift}
                            onSearch={async (value)=>{
                                try {
                                    setIsLoadingShift(true);
                                    let url = `${URLS.INCIDENT_API}/shifts?search=${value}`
                                    let result = await handleSearch(url);
                                    setShifts(result);
                                } catch (error) {
                                    console.log(error);
                                }finally{
                                    setIsLoadingShift(false);
                                }
                            }}
                            onSelect={(value)=>{
                                if(value){
                                    setValue('value', value?.value)
                                }else{
                                    setValue('value', null)
                                }
                            }}
                        />
            break;
            case "createdBy":
                return <AutoComplete 
                            dataList={employees}
                            placeholder="Recherche Employee"
                            isLoading={isLoadingEmployees}
                            onSearch={async (value)=>{
                                try {
                                    setIsLoadingEmployees(true);
                                    let url = `${URLS.ENTITY_API}/employees?search=${value}`
                                    let result = await handleSearch(url);
                                    setEmployees(result);
                                } catch (error) {
                                    console.log(error);
                                }finally{
                                    setIsLoadingEmployees(false);
                                }
                            }}
                            onSelect={(value)=>{
                                if(value){
                                    setValue('value', value?.value)
                                }else{
                                    setValue('value', null)
                                }
                            }}
                        />
            break;

        }
    }
    useEffect(()=>{
        fetchIncidentTypes()
        fetchIncidentCauses()
        fetchEquipements()
        fetchSites()
        fetchShits()
        fetchEmployees()
    },[]);

    useEffect(()=>{
        reset();
    }, [criteria]);

    useEffect(()=>{
        setError("");
    }, [criteria, condition, startDate, endDate])

  return (
    <form className="space-y-2" onSubmit={handleSubmit(generateReport)}>
        <div className='w-full flex flex-col px-2'>
            <label htmlFor="" className='text-xs font-semibold px-2 mb-1'>Trier par <span className='text-red-500'>*</span>:</label>
            <select 
                className='w-full p-2 outline-[1px] text-xs outline-blue-200 border rounded-lg'
                value={criteria}
                onChange={(event)=>{
                    setCriteria(event.target.value);
                }}
            >
                <option value=""></option>
                <option value="incidentId">Type d'incident</option>
                <option value="date">Date</option>
                <option value="equipementId">Type d'equipement</option>
                <option value="technician">Intervenant</option>
                <option value="siteId">Site</option>
                <option value="shiftId">Shift</option>
                <option value="incidentCauseId">Cause d'incident</option>
                <option value="createdBy">Employee initiateur</option>
                {/* <option value="date">Date</option> */}
            </select>
        </div>

        <div className='w-full flex flex-col px-2'>
            <label htmlFor="" className='text-xs font-semibold px-2 mb-1'>Condition <span className='text-red-500'>*</span>:</label>
            <select 
                className='w-full p-2 outline-[1px] text-xs outline-blue-200 border rounded-lg'
                value={condition}
                onChange={(event)=>{
                    setCondition(event.target.value);
                }}
            >
                <option value="EQUAL">Egal à</option>
                <option value="NOT">Different de</option>
            </select>
        </div>
        <div>
            {(criteria != "" && criteria !== "date") && <label className="text-xs font-semibold px-4">Valeur <span className='text-red-500'>*</span>:</label>}
            {handleDisplayFields(criteria)}
        </div>
        {
            criteria === "date" &&
            <div className='flex items-center space-x-2 px-2'>
                <div className='flex flex-col w-1/2'>
                    <label className="text-xs font-semibold px-2">Du <span className='text-red-500'>*</span></label>
                    <DatePicker 
                        onChange={handleStartDate} 
                        // maxDate={dayjs()}
                        className='text-sm'
                        placement={"bottomRight"}
                    />
                </div>
                <div className='flex flex-col w-1/2'>
                    <label className="text-xs font-semibold px-2">Au  <span className='text-red-500'>*</span></label>
                    <DatePicker 
                        onChange={handleEndDate} 
                        // minDate={dayjs()}
                        className='text-sm'
                        placement={"topRight"}
                    />
                </div>
            </div>
        }

        {
            criteria !== "date" &&
            <div className='flex items-center space-x-2 px-2'>
                <div className='flex flex-col w-1/2'>
                    <label className="text-xs font-semibold px-2">Du</label>
                    <DatePicker 
                        onChange={handleStartDate} 
                        // maxDate={dayjs()}
                        className='text-sm'
                        placement={"bottomRight"}
                    />
                </div>
                <div className='flex flex-col w-1/2'>
                    <label className="text-xs font-semibold px-2">Au</label>
                    <DatePicker 
                        onChange={handleEndDate} 
                        // minDate={dayjs()}
                        className='text-sm'
                        placement={"topRight"}
                    />
                </div>
            </div>
        }
        <p className='text-xs text-red-500 px-2'>{error}</p>
        <div className='flex justify-end'>
            <Button  disabled={isLoading} className='rounded-lg bg-primary hover:bg-blue-600 text-white p-2 text-sm shadow-sm flex items-center space-x-1 justify-center'>
                {/* <Preloader className={"w-8 h-8"} /> */}
                <span>Generer</span>
            </Button>
        </div>
    </form>
  )
}

export default RapportIncidentForm