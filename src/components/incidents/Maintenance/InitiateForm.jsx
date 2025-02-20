import React, {useEffect, useState} from 'react'
import {useForm} from 'react-hook-form';
import { useFetch } from '../../../hooks/useFetch';
import AutoComplete from '../../common/AutoComplete';
import { Button } from '../../ui/button';
import { URLS } from '../../../../configUrl';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

const dateFormat = 'YYYY-MM-DDThh:mm:ssZ';


const InitiateForm = ({onSucess}) => {
  const {register, handleSubmit, formState:{errors}, setValue} = useForm();
  const {handleFetch, handlePost} = useFetch();

  const [isLoading, setIsLoading] = useState(true);
  const [maintenanceTypes, setMaintenanceTypes] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [sites, setSites] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [equipements, setEquipements] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [supplierType, setSupplierType] = useState("");

  // maintenance types
  const handleFetchMaintenanceTypes = async (link) =>{
    try {
      let response = await handleFetch(link);     
      if(response?.status === 200){
        let formatedData = response?.data.map(item=>{
          return {
            name:item?.name,
            value: item?.id
          }
        });
        setMaintenanceTypes(formatedData); 
      }
    } catch (error) {
      console.error(error);
    } finally{
      setIsLoading(false);
    }
  }
  const handleSearchMaintenanceTypes=async(searchInput)=>{
    try{
      handleFetchMaintenanceTypes(`${import.meta.env.VITE_ENTITY_API}/maintenance-types?search=${searchInput}`);
    }catch(error){
      console.log(error);
    }
  }
  const handleSelectMaintenanceTypes = (item) => {
    setValue("maintenanceId", item.value);
  };

  // incidents
  const handleFetchIncidents = async (link) =>{
    try {
      let response = await handleFetch(link);     
      if(response?.status === 200){
        let formatedData = response?.data.map(item=>{
          return {
            name:item?.numRef,
            value: item?.id
          }
        });
        setIncidents(formatedData);
      }
    } catch (error) {
      console.error(error);
    } finally{
      setIsLoading(false);
    }
  };
  const handleSearchIncidents=async(searchInput)=>{
    try{
      handleFetchIncidents(`${import.meta.env.VITE_ENTITY_API}/incidents?search=${searchInput}`);
    }catch(error){
      console.log(error);
    }
  };
  const handleSelectIncidents = (item) => {
    setValue("incidentId", item.value);
  };

  // Equipements
  const handleFetchEquipements = async (link) =>{
    try {
      let response = await handleFetch(link);     
      if(response?.status === 200){
        let formatedData = response?.data.map(item=>{
          return {
            name:item?.name,
            value: item?.id
          }
        });
        setEquipements(formatedData);
      }
    } catch (error) {
      console.error(error);
    } finally{
      setIsLoading(false);
    }
  }

  const handleSearchEquipements=async(searchInput)=>{
    try{
      handleFetchEquipements(`${import.meta.env.VITE_INCIDENT_API}/equipements?search=${searchInput}`);
    }catch(error){
      console.log(error);
    }
  }

  const handleSelectEquipement = (item) => {
    setValue("equipement", item.value);
  };


  // Sites
  const handleFetchSites = async (link) =>{
    try {
      let response = await handleFetch(link);     
      if(response?.status === 200){
        let formatedData = response?.data.map(item=>{
          return {
            name:item?.name,
            value: item?.id
          }
        });
        setSites(formatedData);
      }
    } catch (error) {
      console.error(error);
    } finally{
      setIsLoading(false);
    }
  }
  const handleSearchSites=async(searchInput)=>{
    try{
      handleFetchSites(`${import.meta.env.VITE_ENTITY_API}/sites?search=${searchInput}`);
    }catch(error){
      console.log(error);
    }
  }
  const handleSelectSites = (item) => {
    setValue("siteId", item.value);
  };

  // employees
  const handleFetchEmployees = async (link) =>{
    try {
      let response = await handleFetch(link);     
      if(response?.status === 200){
        let formatedData = response?.data.map(item=>{
          return {
            name:item?.name,
            value: item?.id
          }
        });
        setEmployees(formatedData);
      }
    } catch (error) {
      console.error(error);
    } finally{
      setIsLoading(false);
    }
  };
  const handleSearchEmployees=async(searchInput)=>{
    try{
      handleFetchEmployees(`${import.meta.env.VITE_ENTITY_API}/employees?search=${searchInput}`);
    }catch(error){
      console.log(error);
    }
  };
  const handleSelectEmployees = (item) => {
    setValue("userId", item.value);
  };

  // suppliers
  const handleFetchSuppliers = async (link) =>{
    try {
      let response = await handleFetch(link);     
      if(response?.status === 200){
        let formatedData = response?.data.map(item=>{
          return {
            name:item?.name,
            value: item?.id
          }
        });
        setSuppliers(formatedData);
      }
    } catch (error) {
      console.error(error);
    } finally{
      setIsLoading(false);
    }
  };
  const handleSearchSuppliers=async(searchInput)=>{
    try{
      handleFetchSuppliers(`${import.meta.env.VITE_ENTITY_API}/suppliers?search=${searchInput}`);
    }catch(error){
      console.log(error);
    }
  };
  const handleSelectSuppliers = (item) => {
    setValue("supplierId", item.value);
  };


  const handleChangeProjectionDate=(date, dateString)=>{
    const formattedDate = date.format(dateFormat);
    setValue("projectedDate",formattedDate);
  }

  const handleChangeNextDate=(date, dateString)=>{
    const formattedDate = date.format(dateFormat);
    setValue("nextMaintenance",formattedDate);
  }
  
  const handleChangeEffectiveDate=(date, dateString)=>{
    const formattedDate = date.format(dateFormat);
    setValue("effectifDate",formattedDate);
  }


  const submitForm = async (data) =>{
    let url = `${URLS.INCIDENT_API}/maintenances`
    data.createdBy = "878c6bae-b754-4577-b614-69e15821dac8";
    try {
      let response = await handlePost(url, data, true);
      if(response.error){
        alert("Erreur. Une erreur est survenue lors de la création.");
        return
      }
      onSucess();
    } catch (error) {
      console.log(error);
      alert("Erreur. Une erreur est survenue lors de la création.");
    }
  }


  useEffect(()=>{
    handleFetchIncidents(`${import.meta.env.VITE_INCIDENT_API}/incidents`);
    handleFetchEquipements(`${import.meta.env.VITE_INCIDENT_API}/equipements`);
    handleFetchMaintenanceTypes(`${import.meta.env.VITE_INCIDENT_API}/maintenance-types?hasIncident=${false}`);
    handleFetchSites(`${import.meta.env.VITE_ENTITY_API}/sites`);
    handleFetchEmployees(`${import.meta.env.VITE_ENTITY_API}/employees`);
    handleFetchSuppliers(`${import.meta.env.VITE_ENTITY_API}/suppliers`);
  }, []);


  return (
    <form onSubmit={handleSubmit(submitForm)} className='max-h-[300px]'>
      <div className='h-[250px] overflow-scroll'>
        <div className='flex flex-col'>
          <label htmlFor="" className='text-xs font-semibold px-2'>Choisir le type de maintenance <span className='text-red-500'>*</span></label>
          <AutoComplete
            placeholder="Choisir un type de maintenance *"
            isLoading={isLoading}
            dataList={maintenanceTypes}
            onSearch={handleSearchMaintenanceTypes}
            onSelect={handleSelectMaintenanceTypes}
            // register={register}
          />
        </div>
        {/* <div className='flex flex-col'>
          <AutoComplete
            placeholder="Choisir l'incident"
            isLoading={isLoading}
            dataList={incidents}
            onSearch={handleSearchIncidents}
            onSelect={(item) => {
              if (item) {
                handleSelectIncidents(item);
              } else {
                setValue("incidentId", null);
              }
            }}
            // register={register}
          />
        </div> */}
        <div className='flex flex-col'>
        <label htmlFor="" className='text-xs font-semibold px-2'>Choisir l'equipement <span className='text-red-500'>*</span></label>
        <AutoComplete
            placeholder="Choisir l'equipement *"
            isLoading={isLoading}
            dataList={equipements}
            onSearch={handleSearchEquipements}
            onSelect={(item) => {
              if (item) {
                handleSelectEquipement(item);
              } else {
                setValue("equipement", null);
              }
            }}
            // register={register}
          />
        </div>
        <div className='flex flex-col'>
        <label htmlFor="" className='text-xs font-semibold px-2'>Choisir le site <span className='text-red-500'>*</span></label>
        <AutoComplete
            placeholder="Choisir le site *"
            isLoading={isLoading}
            dataList={sites}
            onSearch={handleSearchSites}
            onSelect={handleSelectSites}
            // register={register}
          />
        </div>
        <div 
          className='flex flex-col mx-2'
          onChange={(e)=>setSupplierType(e.target.value)}
        >
          <label htmlFor="" className='text-xs font-semibold'>Choisir le type d'intervenant' <span className='text-red-500'>*</span></label>
          <select name="" id="" className='border rounded-lg p-2' placeholder="Choisir le type d'intervenant">
            <option value="">Choisir le type d'intervenant</option>
            <option value="EMPLOYEE">Employer</option>
            <option value="SUPPLIER">Prestataire</option>
          </select>
          {/* {errors.equipementId && <small className='text-xs my-2 text-red-500'>{errors.equipementId.message}</small>} */}
        </div>
        {
          supplierType === "SUPPLIER" &&
          <div className='flex flex-col'>
          <label htmlFor="" className='text-xs font-semibold px-2'>Choisir le prestataire <span className='text-red-500'>*</span></label>
          <AutoComplete
            placeholder="Choisir le prestataire"
            isLoading={isLoading}
            dataList={suppliers}
            onSearch={handleSearchSuppliers}
            onSelect={handleSelectSuppliers}
            // register={register}
          />
          </div>
        }
        {
          supplierType === "EMPLOYEE" &&
          <div className='flex flex-col'>
          <label htmlFor="" className='text-xs font-semibold px-2'>Choisir l'employe <span className='text-red-500'>*</span></label>
          <AutoComplete
            placeholder="Choisir l'employe *"
            isLoading={isLoading}
            dataList={employees}
            onSearch={handleSearchEmployees}
            onSelect={handleSelectEmployees}
            // register={register}
          />
          </div>
        }
        <div className='flex items-center space-x-2 p-2'>
          <div className='flex flex-col'>
            <label htmlFor="" className='text-xs font-semibold px-2'>Date provisionelle <span className='text-red-500'>*</span></label>
            <DatePicker 
              onChange={handleChangeProjectionDate} 
              minDate={dayjs()}
            />
          </div>
          <div className='flex flex-col'>
            <label htmlFor="" className='text-xs font-semibold px-2'>Date prochaine <span className='text-red-500'>*</span></label>
            <DatePicker 
              onChange={handleChangeNextDate} 
              minDate={dayjs()}
            />
          </div>
          <div className='flex flex-col'>
            <label htmlFor="" className='text-xs font-semibold px-2'>Date effective <span className='text-red-500'>*</span></label>
            <DatePicker 
              onChange={handleChangeEffectiveDate} 
              minDate={dayjs()}
            />
          </div>
        </div>
        
        <div className='px-2 flex flex-col my-2'>
          <label htmlFor="" className='text-xs font-semibold px-2'>Description</label>
          <textarea className='border rounded-lg w-full p-2' placeholder='Description' {...register("description", { required: false })}></textarea>
        </div>
      </div>
        <Button className="bg-primary text-white font-normal my-2 py-1 text-xs">Créer</Button>
    </form>
  )
}

export default InitiateForm