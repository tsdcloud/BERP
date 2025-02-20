import React, {useEffect, useState} from 'react'
import {useForm} from 'react-hook-form';
import { useFetch } from '../../../hooks/useFetch';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { URLS } from '../../../../configUrl';
import AutoComplete from '../../common/AutoComplete';

const InitiateForm = ({onSucess}) => {
  
  const { register, handleSubmit, formState:{errors}, setValue } = useForm();
  const { handlePost, handleFetch } = useFetch();

  const [sites, setSites] = useState([]);
  // const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const submitForm = async (data) =>{
    let url = `${URLS.INCIDENT_API}/equipements`
    try {
      let response = await handlePost(url, data, true);
      if(response.status != 201){
        alert("Erreur. Une erreur est survenue lors de la création.");
        return
      }
      onSucess();
    } catch (error) {
      console.log(error);
      alert("Erreur. Une erreur est survenue lors de la création.");
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
    }finally{
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
  useEffect(()=>{
    handleFetchSites(`${import.meta.env.VITE_ENTITY_API}/sites`);
  },[]);

  return (
    <form onSubmit={handleSubmit(submitForm)} className='space-y-2'>
        <div className='flex flex-col'>
          <Input {...register("name", {required:"Ce champs est requis"})} className="outline-none" placeholder="Entrer le nom de l'equipement"/>
          {errors.name && <small className='text-xs my-2 text-red-500'>{errors.name.message}</small>}
        </div>
        {/* site selection */}
        <div className='flex flex-col'>
          <label htmlFor="" className='text-xs px-2'>Choisir le site :</label>
          <AutoComplete
            placeholder="Choisir un site"
            // isLoading={isLoading}
            dataList={sites}
            onSearch={handleSearchSites}
            onSelect={handleSelectSites}
            // register={register}
          />
          {errors.consomableId && <small className='text-xs my-2 text-red-500'>{errors.consomableId.message}</small>}
        </div>
        <Button className="bg-primary text-white font-normal my-2 py-1 text-xs">Créer</Button>
    </form>
  )
}

export default InitiateForm