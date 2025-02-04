import React, {useEffect, useState} from 'react';
import { useForm } from 'react-hook-form';
import { useFetch } from '../../hooks/useFetch';
import AutoComplete from '../common/AutoComplete';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { Button } from '../ui/button';

const InitiateForm = ({onSucess}) => {
    const {register, handleSubmit, formState:{errors}, setValue} = useForm();
    const {handleFetch, handlePost} = useFetch();

    const [isLoading, setIsLoading] = useState(true);
    const [incidentCauses, setIncidentCauses] = useState([]);
    const [incidentTypes, setIncidentTypes] = useState([]);
    const [consommables, setConsommables] = useState([]);
    const [equipements, setEquipments] = useState([]);
    const [shifts, setShifts] = useState([]);
    const [sites, setSites] = useState([]);
    const [supplierType, setSupplierType] = useState("");

    const handleSubmitDecleration = async (data) =>{
      try {
        let url = `${import.meta.env.VITE_INCIDENT_API}/incidents`;
        // console.log(data)
        let response = await handlePost(url, data);
        if(response?.status !== 201){
          alert("Echec. Echec lors de la création");
          return
        }
        onSucess();
      } catch (error) {
        console.log(error)
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
      setValue("equipementId", item.value);
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
      setValue("incidentId", item.value);
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
      setValue("shiftId", item.value);
    }

    useEffect(()=>{
      handleFetchConsommable(`${import.meta.env.VITE_INCIDENT_API}/consommables`);
      handleFetchEquipements(`${import.meta.env.VITE_INCIDENT_API}/equipements`);
      handleFetchCauses(`${import.meta.env.VITE_INCIDENT_API}/incident-causes`);
      handleFetchTypes(`${import.meta.env.VITE_INCIDENT_API}/incident-types`);
      handleFetchSites(`${import.meta.env.VITE_ENTITY_API}/sites`);
      handleFetchShifts(`${import.meta.env.VITE_ENTITY_API}/shifts`);
    },[]);

  return (
    <form className='h-[350px]' onSubmit={handleSubmit(handleSubmitDecleration)}>
      <div className='h-[300px] overflow-y-scroll overflow-x-hidden'>
        {/* incident type selection */}
        <div className='flex flex-col'>
          <label htmlFor="" className='text-xs px-2'>Choisir le type d'incident :</label>
          <AutoComplete
            placeholder="Choisir un type d'incident"
            isLoading={isLoading}
            dataList={incidentTypes}
            onSearch={handleSearchTypes}
            onSelect={handleSelectTypes}
            // register={register}
          />
          {errors.incidentId && <small className='text-xs my-2 text-red-500'>{errors.incidentId.message}</small>}
        </div>

        {/* incident cause selection */}
        <div className='flex flex-col'>
          <label htmlFor="" className='text-xs px-2'>Choisir la cause de l'incident :</label>
          <AutoComplete
            placeholder="Choisir une cause d'incident"
            isLoading={isLoading}
            dataList={incidentCauses}
            onSearch={handleSearchCauses}
            onSelect={handleSelectCause}
            // register={register}
          />
          {errors.consomableId && <small className='text-xs my-2 text-red-500'>{errors.consomableId.message}</small>}
        </div>


        {/* Consommable selection */}
        {/* <div className='flex flex-col'>
          <label htmlFor="" className='text-xs px-2'>Choisir le consommable :</label>
          <AutoComplete
            placeholder="Choisir un consommable"
            isLoading={isLoading}
            dataList={consommables}
            onSearch={handleSearchConsommables}
            onSelect={handleSelectConsommable}
            // register={register}
          />
          {errors.consomableId && <small className='text-xs my-2 text-red-500'>{errors.consomableId.message}</small>}
        </div> */}

        {/* Equipement selection */}
        <div className='flex flex-col'>
          <label htmlFor="" className='text-xs px-2'>Choisir l'equipement :</label>
          <AutoComplete
            placeholder="Choisir un equipment"
            isLoading={isLoading}
            dataList={equipements}
            onSearch={handleSearchEquipements}
            onSelect={handleSelectEquipement}
            // register={register}
          />
          {errors.equipementId && <small className='text-xs my-2 text-red-500'>{errors.equipementId.message}</small>}
        </div>

        {/* site selection */}
        <div className='flex flex-col'>
          <label htmlFor="" className='text-xs px-2'>Choisir le site :</label>
          <AutoComplete
            placeholder="Choisir un site"
            isLoading={isLoading}
            dataList={sites}
            onSearch={handleSearchSites}
            onSelect={handleSelectSites}
            // register={register}
          />
          {errors.consomableId && <small className='text-xs my-2 text-red-500'>{errors.consomableId.message}</small>}
        </div>

        {/* Shift selection */}
        <div className='flex flex-col'>
          <label htmlFor="" className='text-xs px-2'>Choisir le Shift :</label>
          <AutoComplete
            placeholder="Choisir un shift"
            isLoading={isLoading}
            dataList={shifts}
            onSearch={handleSearchShifts}
            onSelect={handleSelectShifts}
            // register={register}
          />
          {errors.consomableId && <small className='text-xs my-2 text-red-500'>{errors.consomableId.message}</small>}
        </div>

        {/* Description */}
        <div className='flex flex-col px-2'>
          <textarea {...register("description", {required:false})} className='p-2 rounded-lg tetx-sm w-full border' placeholder='Description'></textarea>
        </div>

      </div>
      <Button className="bg-primary text-white font-normal my-2 py-1 text-xs">Déclarer</Button>
    </form>
  )
}

export default InitiateForm