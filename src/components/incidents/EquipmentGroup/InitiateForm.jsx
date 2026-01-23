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
  
  const { register, handleSubmit, formState:{errors}, setValue, reset } = useForm();
  const { handlePost, handleFetch } = useFetch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingFamilies, setIsLoadingFamilies] = useState(true);
  const [families, setFamilies] = useState([])

  const submitForm = async (data) =>{
    let url = `${URLS.INCIDENT_API}/equipment-groups`
    setIsSubmitting(true)
    try {
      let response = await handlePost(url, data, true);
      if(response.error){
        response?.errors.forEach(error => {
          toast.error(error?.msg);
        });
        return
      }
      toast.success("Crée avec succès");
      // reset({ name: "" });
      reset({
        name: "",
        equipmentGroupFamilyId: data.equipmentGroupFamilyId // Garder la valeur qui vient d'être envoyée
      });
      onSucess();
    } catch (error) {
      console.log(error);
      // toast.error("La création a échoué, vérifiez votre connexion");
    }finally{
      setIsSubmitting(false);
    }
  }
  
  const handleFetchFamilies = async (link) =>{
    setIsLoadingFamilies(true)
    try {
      let response = await handleFetch(link);     
      if(response?.status === 200){
        // Vérifier si response.data est un tableau ou un objet avec data
        let dataArray = response?.data;
        
        // Si c'est un objet avec une propriété data (recherche avec params)
        if (dataArray && typeof dataArray === 'object' && dataArray.data && Array.isArray(dataArray.data)) {
          dataArray = dataArray.data;
        }
        
        // S'assurer que c'est bien un tableau
        if (Array.isArray(dataArray)) {
          let formatedData = dataArray.map(item => {
            return {
              name: item?.name,
              value: item?.id
            }
          });
          setFamilies(formatedData);
        } else {
          console.error('Expected array but got:', dataArray);
          setFamilies([]);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to get groups");
    } finally {
      setIsLoadingFamilies(false);
    }
  }

  const handleSearchGroupFamilies=async(searchInput)=>{
    try{
      handleFetchFamilies(`${import.meta.env.VITE_INCIDENT_API}/equipment-group-families?search=${searchInput}`);
    }catch(error){
      console.error(error);
      toast.error("Failed to get families");
    }
  }

  const handleSelectGroupFamilies = (item) => {
    if(item){
      setValue("equipmentGroupFamilyId", item.value);
    }else{
      setValue("equipmentGroupFamilyId", null);
    }
  };

  useEffect(()=>{
    handleFetchFamilies(`${import.meta.env.VITE_INCIDENT_API}/equipment-group-families`);
  },[]);

  return (
    <form onSubmit={handleSubmit(submitForm)} className='space-y-2'>
        <div className='flex flex-col mx-4 space-y-2'>
          <label htmlFor="" className='text-sm font-semibold'>Nom type équipement <span className='text-red-500'>*</span> :</label>
          <input {...register("name", {required:"Ce champs est requis"})} className={`${errors.name ? 'outline-red-500 ring-red-500' : 'outline-none'} p-2 border text-sm rounded-lg`} placeholder="Entrer le nom type équipement"/>
          {errors.name && <small className='text-xs my-2 text-red-500'>{errors.name.message}</small>}
        </div>
        {/* Groupe selection */}
        <div className='flex flex-col'>
          <label htmlFor="" className='text-sm px-2 mx-2 font-semibold'>Choisir le domaine <span className='text-red-500'>*</span> :</label>
          <AutoComplete
            placeholder="Choisir le domaine"
            isLoading={isLoadingFamilies}
            dataList={families}
            onSearch={handleSearchGroupFamilies}
            onSelect={handleSelectGroupFamilies}
            // register={{...register('equipmentGroupFamilyId', {required:'Ce champ est requis'})}}
            error={errors.equipmentGroupFamilyId}
            errorMessage={errors.equipmentGroupFamilyId && <small className='text-xs mx-2 text-red-500'>{errors.equipmentGroupFamilyId.message}</small>}
          />
          {errors.equipmentGroupFamilyId && <small className='text-xs mx-2 text-red-500'>{errors.equipmentGroupFamilyId.message}</small>}
        </div>
        
        <div className='flex justify-end'>
          <Button disabled={isSubmitting} className={`${isSubmitting ? 'bg-blue-300' :'bg-primary hover:bg-secondary'} text-white font-semibold my-2 py-1 text-sm flex`}>
            {isSubmitting ? <Preloader size={20}/> : <CheckCircle />}
            <span>{isSubmitting ? "Création encours..." : "Créer"}</span>
          </Button>
        </div>
    </form>
  )
}

export default InitiateForm