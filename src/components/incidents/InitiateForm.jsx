import React, {useEffect, useState} from 'react';
import { useForm } from 'react-hook-form';
import { useFetch } from '../../hooks/useFetch';
import AutoComplete from '../common/AutoComplete';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { Button } from '../ui/button';
import { CheckCircle } from 'lucide-react';
import Preloader from '../Preloader';
import toast from 'react-hot-toast';

const InitiateForm = ({onSucess}) => {
    const {register, handleSubmit, formState:{errors}, setValue} = useForm();
    const {handleFetch, handlePost} = useFetch();

    const [isLoading, setIsLoading] = useState(true);
    // const [incidentCauses, setIncidentCauses] = useState([]);
    const [incidentTypes, setIncidentTypes] = useState([]);
    const [consommables, setConsommables] = useState([]);
    const [equipements, setEquipments] = useState([]);
    const [shifts, setShifts] = useState([]);
    const [sites, setSites] = useState([]);
    const [supplierType, setSupplierType] = useState("");
    const [isSubmiting, setIsSubmiting] = useState(false);
    
    const handleSubmitDecleration = async (data) =>{
      setIsSubmiting(true);
      try {
        let url = `${import.meta.env.VITE_INCIDENT_API}/incidents`;
        let response = await handlePost(url, data);
        if(response.error){
          response?.error_list.forEach(error =>toast.error(error.msg));
          return;
        }
        toast.success("Incident déclaré avec succès");
        onSucess();
      } catch (error) {
        console.log(error)
      }finally{
        setIsSubmiting(false);
      }
    }

    // Consommables
    const handleFetchConsommable = async (link) =>{
      try {
        let response = await handleFetch(link);     
        if(response?.status === 200){
          let formatedData = response?.data.map(item=>{
            return {
              name:item?.name,
              value: item?.id
            }
          });
          setConsommables(formatedData);
        }
      } catch (error) {
        console.error(error);
      } finally{
        setIsLoading(false);
      }
    }

    const handleSearchConsommables=async(searchInput)=>{
      try{
        handleFetchConsommable(`${import.meta.env.VITE_INCIDENT_API}/consommables?search=${searchInput}`);
      }catch(error){
        console.log(error);
      }
    }

    const handleSelectConsommable = (item) => {
      setValue("consomableId", item.value);
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
          setEquipments(formatedData);
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
      if(item){
        setValue("equipementId", item.value);
      }else{
        setValue("equipementId", null);
      }
    };

    // Incident causes
    const handleFetchCauses = async (link) =>{
      try {
        let response = await handleFetch(link);     
        if(response?.status === 200){
          let formatedData = response?.data.map(item=>{
            return {
              name:item?.name,
              value: item?.id
            }
          });
          setIncidentCauses(formatedData);
        }
      } catch (error) {
        console.error(error);
      } finally{
        setIsLoading(false);
      }
    }

    const handleSearchCauses=async(searchInput)=>{
      try{
        handleFetchCauses(`${import.meta.env.VITE_INCIDENT_API}/incident-causes?search=${searchInput}`);
      }catch(error){
        console.log(error);
      }
    }

    const handleSelectCause = (item) => {
      setValue("incidentCauseId", item.value);
    };

    // Incident Types
    const handleFetchTypes = async (link) =>{
      try {
        let response = await handleFetch(link);     
        if(response?.status === 200){
          let formatedData = response?.data.map(item=>{
            return {
              name:item?.name,
              value: item?.id
            }
          });
          setIncidentTypes(formatedData);
        }
      } catch (error) {
        console.error(error);
      } finally{
        setIsLoading(false);
      }
    }

    const handleSearchTypes=async(searchInput)=>{
      try{
        handleFetchTypes(`${import.meta.env.VITE_INCIDENT_API}/incident-types?search=${searchInput}`);
      }catch(error){
        console.log(error);
      }
    }

    const handleSelectTypes = (item) => {
      if(item){
        setValue("incidentId", item?.value);
      }else{
          setValue("incidentId",null);
      }
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
      if(item){
        setValue("siteId", item.value);
      }else{
        setValue("siteId", null);
      }
    };

    // shifts
    const handleFetchShifts = async (link) =>{
      try {
        let response = await handleFetch(link);     
        if(response?.status === 200){
          let formatedData = response?.data.map(item=>{
            return {
              name:item?.name,
              value: item?.id
            }
          });
          setShifts(formatedData);
        }
      } catch (error) {
        console.error(error);
      } finally{
        setIsLoading(false);
      }
    }

    const handleSearchShifts=async(searchInput)=>{
      try{
        handleFetchSites(`${import.meta.env.VITE_ENTITY_API}/shifts?search=${searchInput}`);
      }catch(error){
        console.log(error);
      }
    }

    const handleSelectShifts = (item) => {
      if(item){
        setValue("shiftId", item.value);
      }else{
        setValue("shiftId", null);
      }
    }

    useEffect(()=>{
      handleFetchConsommable(`${import.meta.env.VITE_INCIDENT_API}/consommables`);
      handleFetchEquipements(`${import.meta.env.VITE_INCIDENT_API}/equipements`);
      handleFetchTypes(`${import.meta.env.VITE_INCIDENT_API}/incident-types`);
      handleFetchSites(`${import.meta.env.VITE_ENTITY_API}/sites`);
      handleFetchShifts(`${import.meta.env.VITE_ENTITY_API}/shifts`);
    },[]);

  return (
    <form className='h-[350px] p-2' onSubmit={handleSubmit(handleSubmitDecleration)}>
      <div className='h-[300px] overflow-y-scroll overflow-x-hidden'>
        {/* incident type selection */}
        <div className='flex flex-col my-2'>
          <label htmlFor="" className='text-sm px-2 font-semibold'>Choisir le type d'incident <span className='text-red-500'>*</span>:</label>
          <AutoComplete
            placeholder="Choisir un type d'incident"
            isLoading={isLoading}
            dataList={incidentTypes}
            onSearch={handleSearchTypes}
            onSelect={handleSelectTypes}
            register={{...register('incidentId', {required:'Ce champ est requis'})}}
            error={errors.incidentId}
          />
          {errors.incidentId && <small className='text-xs text-red-500 mx-4'>{errors.incidentId.message}</small>}
        </div>

        {/* Equipement selection */}
        <div className='flex flex-col'>
          <label htmlFor="" className='text-sm px-2 font-semibold'>Choisir l'equipement <span className='text-red-500'>*</span>:</label>
          <AutoComplete
            placeholder="Choisir un equipment"
            isLoading={isLoading}
            dataList={equipements}
            onSearch={handleSearchEquipements}
            onSelect={handleSelectEquipement}
            register={{...register('equipementId', {required:'Ce champ est requis'})}}
            error={errors.equipementId}
          />
          {errors.equipementId && <small className='text-xs text-red-500 mx-4'>{errors.equipementId.message}</small>}
        </div>

        {/* site selection */}
        <div className='flex flex-col'>
          <label htmlFor="" className='text-sm px-2 font-semibold'>Choisir le site <span className='text-red-500'>*</span>:</label>
          <AutoComplete
            placeholder="Choisir un site"
            isLoading={isLoading}
            dataList={sites}
            onSearch={handleSearchSites}
            onSelect={handleSelectSites}
            register={{...register('siteId', {required:'Ce champ est requis'})}}
            error={errors.siteId}
          />
          {errors.siteId && <small className='text-xs my-2 text-red-500 mx-4'>{errors.siteId.message}</small>}
        </div>

        {/* Shift selection */}
        <div className='flex flex-col'>
          <label htmlFor="" className='text-sm px-2 font-semibold'>Choisir le quart <span className='text-red-500'>*</span>:</label>
          <AutoComplete
            placeholder="Choisir un shift"
            isLoading={isLoading}
            dataList={shifts}
            onSearch={handleSearchShifts}
            onSelect={handleSelectShifts}
            register={{...register('shiftId', {required:'Ce champ est requis'})}}
            error={errors.shiftId}
          />
          {errors.shiftId && <small className='text-xs my-2 text-red-500 mx-4'>{errors.shiftId.message}</small>}
        </div>

        {/* Description */}
        <div className='flex flex-col px-2'>
          <label htmlFor="" className='text-sm px-2 font-semibold'>Description :</label>
          <textarea {...register("description", {required:false})} className='p-2 rounded-lg tetx-sm w-full border' placeholder='Description'></textarea>
        </div>

      </div>
      <div className='flex justify-end p-2'>
        <Button className="bg-primary text-white my-2 text-sm w-1/3 hover:bg-secondary" disabled={isSubmiting}>
          {isSubmiting ? <Preloader size={20}/> : <CheckCircle className='text-white'/> }
          <span>{isSubmiting ? "En cours..."  :"Déclarer"}</span>
        </Button>
      </div>
    </form>
  )
}

export default InitiateForm