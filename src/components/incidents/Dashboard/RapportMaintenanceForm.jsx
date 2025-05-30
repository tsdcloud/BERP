import React, {useEffect, useState} from 'react'
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import Preloader from '../../Preloader';
import { useForm } from 'react-hook-form';
import { URLS } from '../../../../configUrl';
import { useFetch } from '../../../hooks/useFetch';
import AutoComplete from '../../common/AutoComplete';
import { FileIcon } from 'lucide-react';
import { Button } from '../../ui/button';
dayjs.extend(customParseFormat);

const dateFormat = 'YYYY-MM-DDThh:mm:ssZ';



const RapportMaintenanceForm = ({onSubmit}) => {

    const {setValue, handleSubmit, reset} = useForm();
    const {handleFetch, handlePost} = useFetch();
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [error, setError] = useState("");

    // Listing states
    const [maintenanceTypes, setMaintenanceTypes] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [equipements, setEquipements] = useState([]);
    const [sites, setSites] = useState([]);
    const [shifts, setShifts] = useState([]);
    const [employees, setEmployees] = useState([]);

    // Criteria
    const [criteria, setCriteria] = useState("");
    const [condition, setCondition] = useState("EQUAL");
    let token = localStorage.getItem("token");



    // Fetching data from various endpoints

    // Fetch incident types
    const fetchMaintenanceTypes = async()=>{
        let url = `${URLS.INCIDENT_API}/maintenance-types`
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
            setMaintenanceTypes(formatedData);
        } catch (error) {
            console.log(error);
        }
    }
    // Fetch incident causes 
    // const fetchIncidentCauses = async()=>{
    //     let url = `${URLS.INCIDENT_API}/incident-causes`
    //     try {
    //         let response = await handleFetch(url);
    //         if(response.status !== 200){
    //             alert("Echec. Impossible d'obtenir la list des causes d'incidents")
    //             return;
    //         }
    //         setIncidentCauses(response.data);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    // Fetch equipements 
    const fetchEquipements = async()=>{
        let url = `${URLS.INCIDENT_API}/equipements`
        try {
            let response = await handleFetch(url);
            if(response.status !== 200){
                alert("Echec. Impossible d'obtenir la list d'equipement'")
                return;
            }
            let formatedData = response?.data.map(item=>{
                return {
                  name:item?.name,
                  value: item?.id
                }
              });
            setEquipements(formatedData);
        } catch (error) {
            console.log(error);
        }
    }

    // Fetch sites 
    const fetchSites = async()=>{
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
        }
    }

    // Fetch Employees 
    const fetchEmployees = async()=>{
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
        }
    }
    
    // Fetch suppliers 
    const fetchSuppliers = async()=>{
        let url = `${URLS.ENTITY_API}/suppliers`
        try {
            let response = await handleFetch(url);
            if(response.status !== 200){
                alert("Echec. Impossible d'obtenir la list des maintenancier")
                return;
            }
            let formatedData = response?.data.map(item=>{
                return {
                  name:item?.name,
                  value: item?.id
                }
              });
            setSuppliers(formatedData);
        } catch (error) {
            console.log(error);
        }
    }

    // Fetch shifts 
    const fetchShits = async()=>{
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
            if(criteria==="" || condition === "" || !value){
                setError("tous les champs (*) sont requis");
                return;
            }
        }
        let url =`${URLS.INCIDENT_API}/maintenances/file?criteria=${criteria}&condition=${condition}&value=${value}&start=${startDate ? new Date(startDate).toISOString():''}&end=${endDate?new Date(endDate).toISOString():''}`;
        
        let requestOptions ={
            headers:{
                "Content-Type":"application/json",
                'authorization': `Bearer ${token}`
            }
        }
        setIsLoading(true);
        try {
            let response = await fetch(url, requestOptions);
            if(response.status === 200){
                const result = await response.json();
                const link = document.createElement('a');
                link.href = result?.downloadLink;
                link.download = 'maintenances-export.xlsx';
                link.click();
                onSubmit()
                return;
            }
            setError("Echec du telechargement du rapport")
            
        } catch (error) {
            console.log(error)
        }finally{
            setIsLoading(false);
        }
    }

    const handleSearch=async(url)=>{
        try {
            let response = await handleFetch(url);
            if(response?.status === 200){
                let formatedData = response?.data.map(item=>{
                    return {
                      name:item?.name,
                      value: item?.id
                    }
                });
                return formatedData
            }
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Displaying field based on the selected criteria
     */
    const handleDisplayFields=(criteria)=>{
        switch(criteria){
            case "maintenanceId":
                return <AutoComplete 
                            dataList={maintenanceTypes}
                            placeholder="Recherche type de maintenance"
                            onSearch={async (value)=>{
                                let url = `${URLS.INCIDENT_API}/maintenance-types?search=${value}`
                                let result = await handleSearch(url);
                                setMaintenanceTypes(result);
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
                            onSearch={async (value)=>{
                                let url = `${URLS.ENTITY_API}/sites?search=${value}`
                                let result = await handleSearch(url);
                                setSites(result);
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
                            onSearch={async (value)=>{
                                let url = `${URLS.INCIDENT_API}/equipements?search=${value}`
                                let result = await handleSearch(url);
                                setEquipements(result);
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
            case "shiftId":
                return <AutoComplete 
                            dataList={shifts}
                            placeholder="Recherche shift"
                            onSearch={async (value)=>{
                                let url = `${URLS.INCIDENT_API}/shifts?search=${value}`
                                let result = await handleSearch(url);
                                setShifts(result);
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
            case "supplierId":
                return <AutoComplete 
                            dataList={[...employees, ...suppliers]}
                            placeholder="Recherche maintenancier"
                            onSearch={async (value)=>{
                                let url = `${URLS.ENTITY_API}/suppliers?search=${value}`
                                let result = await handleSearch(url);
                                setSuppliers(result);
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
                            onSearch={async (value)=>{
                                let url = `${URLS.ENTITY_API}/employees?search=${value}`
                                let result = await handleSearch(url);
                                setEmployees(result);
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
        fetchMaintenanceTypes()
        fetchSuppliers()
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
                <option value="maintenanceId">Type de maintenance</option>
                <option value="equipementId">Equipements</option>
                <option value="date">Date</option>
                <option value="siteId">Site</option>
                <option value="supplierId">Maintenancier</option>
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
            {criteria != "" && criteria != "date" && <label className="text-xs font-semibold px-4">Valeur :</label>}
            {handleDisplayFields(criteria)}
        </div>
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
        <p className='text-xs text-red-500 px-2'>{error}</p>
        <div className='flex justify-end'>
            <Button className='rounded-lg bg-primary hover:bg-secondary text-white font-semibold gap-2 text-sm shadow-sm flex items-center space-x-1 justify-center' disabled={isLoading}>
                {isLoading ?<Preloader size={20}/>:<FileIcon size={15} />}
                <span>Generer</span>
            </Button>
        </div>
    </form>
  )
}

export default RapportMaintenanceForm