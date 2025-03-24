import React, {useEffect, useState} from 'react'
import {useForm} from 'react-hook-form';
import { useFetch } from '../../../hooks/useFetch';
import { Input } from '../../ui/input';
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
  // const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitForm = async (data) =>{
    let url = `${URLS.INCIDENT_API}/equipements`
    setIsSubmitting(true)
    try {
      let response = await handlePost(url, data, true);
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
    setIsLoading(true)
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
      setIsLoading(false);
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
  useEffect(()=>{
    handleFetchSites(`${import.meta.env.VITE_ENTITY_API}/sites`);
  },[]);

  return (
    <form onSubmit={handleSubmit(submitForm)} className='space-y-2'>
        <div className='flex flex-col mx-4 space-y-2'>
          <label htmlFor="" className='text-sm font-semibold'>Nom de l'équipement :</label>
          <input {...register("name", {required:"Ce champs est requis"})} className={`${errors.name ? 'outline-red-500 ring-red-500' : 'outline-none'} p-2 border text-sm rounded-lg`} placeholder="Entrer le nom de l'equipement"/>
          {errors.name && <small className='text-xs my-2 text-red-500'>{errors.name.message}</small>}
        </div>
        {/* site selection */}
        {/* <div className='flex flex-col'>
          <label htmlFor="" className='text-sm px-2 mx-2 font-semibold'>Choisir le site :</label>
          <AutoComplete
            placeholder="Choisir un site"
            // isLoading={isLoading}
            dataList={sites}
            onSearch={handleSearchSites}
            onSelect={handleSelectSites}
            // register={register}
          />
          {errors.consomableId && <small className='text-xs my-2 text-red-500'>{errors.consomableId.message}</small>}
        </div> */}
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