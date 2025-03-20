import React, {useEffect, useState} from 'react'
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import Preloader from '../../common/Preloader';
import { useForm } from 'react-hook-form';
import { URLS } from '../../../../configUrl';
import { useFetch } from '../../../hooks/useFetch';
import AutoComplete from '../../common/AutoComplete';
import { useStyleRegister } from 'antd/es/theme/internal';
dayjs.extend(customParseFormat);

const dateFormat = 'YYYY-MM-DDThh:mm:ssZ';



const RapportOffBridgeForm = ({onSubmit}) => {

    const {setValue, handleSubmit, reset, register, formState:{errors}} = useForm();
    const {handleFetch, handlePost} = useFetch();
    const [error, setError] = useState("");

    // Listing states
    const [incidentCauses, setIncidentCauses] = useState([])
    const [sites, setSites] = useState([])
    const [externalEntities, setExternalEntities] = useState([])
    const [products, setProducts] = useState([])
    const [employees, setEmployees] = useState([]);

    // Criteria
    const [criteria, setCriteria] = useState("");
    const [condition, setCondition] = useState("EQUAL");
    let token = localStorage.getItem("token");



    // Fetching data from various endpoints
    // Fetch incident causes 
    const fetchIncidentCauses = async()=>{
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

    // Fetch Employes 
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
    
    // Fetch exteranl entities 
    const fetchExternalEntities = async()=>{
        let url = `${URLS.ENTITY_API}/suppliers`
        try {
            let response = await handleFetch(url);
            if(response.status !== 200){
                alert("Echec. Impossible d'obtenir la list des entreprise")
                return;
            }
            let formatedData = response?.data.map(item=>{
                return {
                  name:item?.name,
                  value: item?.id
                }
              });
            setExternalEntities(formatedData);
        } catch (error) {
            console.log(error);
        }
    }
    
    // Fetch products 
    const fetchproducts = async()=>{
        let url = `${URLS.ENTITY_API}/articles`
        try {
            let response = await handleFetch(url);
            if(response.status !== 200){
                alert("Echec. Impossible d'obtenir la list des produit")
                return;
            }
            let formatedData = response?.data.map(item=>{
                return {
                  name:item?.name,
                  value: item?.id
                }
              });
            setProducts(formatedData);
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
            if(criteria === ""|| condition === "" || !value){
                setError("tous les champs (*) sont requis");
                return;
            }
        }
        let url =`${URLS.INCIDENT_API}/off-bridges/file?criteria=${criteria}&condition=${condition}&value=${value}&start=${startDate ? new Date(startDate).toISOString():''}&end=${endDate?new Date(endDate).toISOString():''}`;
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
                link.download = 'hors-pont-export.xlsx';
                link.click();
                onSubmit()
                return;
            }
            setError("Echec du telechargement du rapport")
            
        } catch (error) {
            console.log(error)
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
            case "":
                return <></>
            break;
            case "date":
                return <></>
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
            case "tier":
                return <AutoComplete 
                            dataList={externalEntities}
                            placeholder="Recherche de tier"
                            onSearch={async (value)=>{
                                let url = `${URLS.ENTITY_API}/suppliers?search=${value}`
                                let result = await handleSearch(url);
                                setExternalEntities(result);
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
            case "loader":
                return <AutoComplete 
                            dataList={externalEntities}
                            placeholder="Recherche de chargeur"
                            onSearch={async (value)=>{
                                let url = `${URLS.ENTITY_API}/suppliers?search=${value}`
                                let result = await handleSearch(url);
                                setExternalEntities(result);
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
            case "transporter":
                return <AutoComplete 
                            dataList={externalEntities}
                            placeholder="Recherche de transporteur"
                            onSearch={async (value)=>{
                                let url = `${URLS.ENTITY_API}/suppliers?search=${value}`
                                let result = await handleSearch(url);
                                setExternalEntities(result);
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
            case "product":
                return <AutoComplete 
                            dataList={products}
                            placeholder="Recherche de produit"
                            onSearch={async (value)=>{
                                let url = `${URLS.ENTITY_API}/articles?search=${value}`
                                let result = await handleSearch(url);
                                setProducts(result);
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
            default:
                return <input 
                    className='text-sm p-2 border rounded-lg'
                    placeholder='Recherche...'
                    {...register("value", {required:"Ce champ est requis"})}
                />
            break;

        }
    }

    useEffect(()=>{
        fetchIncidentCauses()
        fetchSites()
        fetchExternalEntities()
        fetchproducts()
        fetchEmployees()
    },[]);

    useEffect(()=>{
        reset();
    }, [criteria]);

    useEffect(()=>{
        setError("");
    }, [criteria, condition])

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
                <option value="incidentCause">Cause de l'incident</option>
                <option value="siteId">Site</option>
                <option value="date">Date</option>
                <option value="tier">Tier</option>
                <option value="container1">Conteneur 1</option>
                <option value="container2">Conteneur 2</option>
                <option value="plomb1">Plomb 1</option>
                <option value="plomb2">Plomb 2</option>
                <option value="loader">Chargeur</option>
                <option value="product">Produit</option>
                <option value="transporter">Transporteur</option>
                <option value="vehicle">Vehicule</option>
                <option value="blNumber">Numéro de BL</option>
                <option value="driver">Chauffeur</option>
                <option value="trailer">Remorque</option>
                <option value="createdBy">Initier par</option>
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
        <div className='flex flex-col px-2'>
            {(criteria != "" && criteria !== "date") && <label className="text-xs font-semibold px-4">Valeur <span className='text-red-500'>*</span>:</label>}
            {handleDisplayFields(criteria)}
            {errors.value && <small className='text-xs text-red-500 px-2'>{errors.value.message}</small>}
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
            <button className='rounded-lg bg-primary hover:bg-blue-600 text-white p-2 text-sm shadow-sm flex items-center space-x-1 justify-center'>
                {/* <Preloader className={"w-8 h-8"} /> */}
                <span>Generer</span>
            </button>
        </div>
    </form>
  )
}

export default RapportOffBridgeForm