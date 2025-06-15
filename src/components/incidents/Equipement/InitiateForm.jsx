import React, {useEffect, useState} from 'react'
import {useForm} from 'react-hook-form';
import { useFetch } from '../../../hooks/useFetch';
import { Button } from '../../ui/button';
import { URLS } from '../../../../configUrl';
import AutoComplete from '../../common/AutoComplete';
import toast from 'react-hot-toast';
import Preloader from "../../Preloader";
import { CheckCircle } from 'lucide-react';

const InitiateForm = ({onSucess}) => {
  
  const { register, handleSubmit, formState:{errors}, setValue } = useForm();
  const { handlePost, handleFetch } = useFetch();

  const [sites, setSites] = useState([]);
  const [groups, setGroups] = useState([]);
  // const [value, setValue] = useState("");
  const [isLoadingSites, setIsLoadingSites] = useState(true);
  const [isLoadingGroups, setIsLoadingGroups] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitForm = async (data) =>{
    let url = `${URLS.INCIDENT_API}/equipements`
    setIsSubmitting(true);
    try {
      let response = await handlePost(url, {...data}, true);
      if(response.error){
        response?.error_list.forEach(error => {
          toast.error(error?.msg);
        });
        return
      }
      onSucess();
    } catch (error) {
      console.log(error);
      toast.error("La création a échoué, vérifiez votre connexion");
    }finally{
      setIsSubmitting(false);
    }
  }

  const handleFetchSites = async (link) =>{
    setIsLoadingSites(true)
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
      toast.error("Échec de l'essai de récupération des sites");
    }finally{
      setIsLoadingSites(false);
    }
  }

  const handleSearchSites=async(searchInput)=>{
    try{
      handleFetchSites(`${import.meta.env.VITE_ENTITY_API}/sites?search=${searchInput}`);
    }catch(error){
      console.error(error);
      toast.error("Échec de l'essai de récupération des sites");
    }
  }

  const handleSelectSites = (item) => {
    if(item){
      setValue("siteId", item.value);
    }else{
      setValue("siteId", null);
    }
  };

  const handleFetchGroups = async (link) =>{
    setIsLoadingGroups(true)
    try {
      let response = await handleFetch(link);     
      if(response?.status === 200){
        let formatedData = response?.data.map(item=>{
          return {
            name:item?.name,
            value: item?.id
          }
        });
        setGroups(formatedData);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to get groups");
    }finally{
      setIsLoadingGroups(false);
    }
  }

  const handleSearchGroups=async(searchInput)=>{
    try{
      handleFetchGroups(`${import.meta.env.VITE_ENTITY_API}/equipment-groups?search=${searchInput}`);
    }catch(error){
      console.error(error);
      toast.error("Failed to get groups");
    }
  }

  const handleSelectGroups = (item) => {
    if(item){
      setValue("equipmentGroupId", item.value);
    }else{
      setValue("equipmentGroupId", null);
    }
  };
  useEffect(()=>{
    handleFetchSites(`${import.meta.env.VITE_ENTITY_API}/sites`);
    handleFetchGroups(`${import.meta.env.VITE_INCIDENT_API}/equipment-groups`);
  },[]);

  return (
    <form onSubmit={handleSubmit(submitForm)} className='flex flex-col space-y-2'>

      <div className='overflow-y-scroll max-h-[300px] space-y-3'>
        {/* Titled */}
        <div className='flex flex-col mx-4 space-y-2'>
          <label htmlFor="" className='text-sm font-semibold'>Intitulé <span className='text-red-500'>*</span>:</label>
          <input {...register("title", {required:"Ce champs est requis"})} className={`${errors.title ? 'outline-red-500 ring-red-500' : 'outline-none'} p-2 border text-sm rounded-lg`} placeholder="Entrer le nom de l'equipement"/>
          {errors.title && <small className='text-xs my-2 text-red-500'>{errors.title.message}</small>}
        </div>
        <div className='flex items-center justify-evenly'>
          {/* operatingMode */}
          <div className='flex flex-col mx-4 space-y-2'>
            <label htmlFor="" className='text-sm font-semibold'>Alimentation <span className='text-red-500'>*</span> :</label>
            <input type='number' {...register("operatingMode", {required:"Ce champs est requis"})} className={`${errors.operatingMode ? 'outline-red-500 ring-red-500' : 'outline-none'} p-2 border text-sm rounded-lg`} placeholder="Alimentation"/>
            {errors.operatingMode && <small className='text-xs my-2 text-red-500'>{errors.operatingMode.message}</small>}
          </div>

          {/* Lifespan in days */}
          <div className='flex flex-col mx-4 space-y-2'>
            <label htmlFor="" className='text-sm font-semibold'>Durée de vie (en jour) <span className='text-red-500'>*</span> :</label>
            <input type='number'{...register("lifeSpan", {required:"Ce champs est requis"})} className={`${errors.lifeSpan ? 'outline-red-500 ring-red-500' : 'outline-none'} p-2 border text-sm rounded-lg`} placeholder="Durée de vie"/>
            {errors.lifeSpan && <small className='text-xs my-2 text-red-500'>{errors.lifeSpan.message}</small>}
          </div>
        </div>
        {/* Maintenance Frequrncy */}
        <div className='flex flex-col mx-4 space-y-2'>
          <label htmlFor="" className='text-sm font-semibold'>périodicité de maintenance (en jour) <span className='text-red-500'>*</span>:</label>
          <input type='number'{...register("periodicity", {required:"Ce champs est requis"})} className={`${errors.periodicity ? 'outline-red-500 ring-red-500' : 'outline-none'} p-2 border text-sm rounded-lg`} placeholder="périodicité de maintenance"/>
          {errors.periodicity && <small className='text-xs my-2 text-red-500'>{errors.periodicity.message}</small>}
        </div>
        {/* equipment status */}
        <div className='flex flex-col mx-4 space-y-2'>
          <label htmlFor="" className='text-sm font-semibold'>Statut d'équipement <span className='text-red-500'>*</span>:</label>
          <select type='number'{...register("status", {required:"Ce champs est requis"})} className={`${errors.status ? 'outline-red-500 ring-red-500' : 'outline-none'} p-2 border text-sm rounded-lg`} placeholder="périodicité de maintenance">
            <option value="">Choisir le status de l'equipement</option>
            <option value="NEW">NOUVEAU</option>
            <option value="SECOND_HAND">SECONDE MAIN</option>
          </select>
          {errors.status && <small className='text-xs my-2 text-red-500'>{errors.status.message}</small>}
        </div>
        {/* Groupe selection */}
        <div className='flex flex-col'>
          <label htmlFor="" className='text-sm px-2 mx-2 font-semibold'>Choisir le group <span className='text-red-500'>*</span> :</label>
          <AutoComplete
            placeholder="Choisir le group"
            isLoading={isLoadingGroups}
            dataList={groups}
            onSearch={handleSearchGroups}
            onSelect={handleSelectGroups}
            register={{...register('equipmentGroupId', {required:'Ce champ est requis'})}}
          />
          {errors.equipmentGroupId && <small className='text-xs mx-2 text-red-500'>{errors.equipmentGroupId.message}</small>}
        </div>
        {/* site selection */}
        <div className='flex flex-col z-40 '>
          <label htmlFor="" className='text-sm px-2 mx-2 font-semibold'>Choisir le site <span className='text-red-500'>*</span> :</label>
          <AutoComplete
            placeholder="Choisir un site"
            isLoading={isLoadingSites}
            dataList={sites}
            onSearch={handleSearchSites}
            onSelect={handleSelectSites}
            register={{...register('siteId', {required:'Ce champ est requis'})}}
          />
          {errors.siteId && <small className='text-xs mx-2 text-red-500'>{errors.siteId.message}</small>}
        </div>
      </div>


        <div className='flex justify-end pt-4 z-10'>
          <Button disabled={isSubmitting} className={`${isSubmitting ? 'bg-blue-300' :'bg-primary hover:bg-secondary'} text-white font-semibold my-2 py-1 text-sm flex`}>
            {isSubmitting ? <Preloader size={20}/> : <CheckCircle />}
            <span>{isSubmitting ? "Création encours..." : "Créer"}</span>
          </Button>
        </div>
    </form>
  )
}

export default InitiateForm