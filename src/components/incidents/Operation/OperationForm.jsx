import React, {useState, useEffect} from 'react';
import { Button } from '../../ui/button';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Preloader from "../../Preloader";
import { CheckCircle } from 'lucide-react';
import { URLS } from '../../../../configUrl';
import { useFetch } from '../../../hooks/useFetch';
import AutoComplete from '../../common/AutoComplete';
import { ACTION_TYPES } from '../../../utils/constant.utils';
const ActionTypeForm = ({onSuccess}) => {
    const {handleSubmit, formState:{errors}, register, setValue, watch} = useForm();
    const {handlePost, handleFetch} = useFetch();
    const [isLoadingSites, setIsLoadingSites] = useState(true);
    const [isLoadingEquipments, setIsLoadingEquipments] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [sites, setSites] = useState([]);
    const [equipements, setEquipements] = useState([]);

    // Site handlers
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

    const handleSelectSites = async (item) => {
        setValue("equipementId", null);
        if(item){
            setValue("siteId", item.value);
            await handleFetchEquipements(`${import.meta.env.VITE_INCIDENT_API}/equipements/site/${item.value}`);
        }else{
            setValue("siteId", null);
            setEquipements([]);
        }
    }

    const handleCreateOperation =async (data)=>{
        setIsSubmitting(true);

        if(data.description === ""){
          data.description = null
        }
        
        let url = `${URLS.INCIDENT_API}/operations`
        try {
            let response = await handlePost(url, data, true);
            if(response.error){
                response?.errors.forEach(error => {
                  toast.error(error?.msg);
                });
                return
            }
            onSuccess();
        } catch (error) {
            console.log(error);
            toast.error("La création a échoué, vérifiez votre connexion");
        }finally{
            setIsSubmitting(false);
        }
    }

    // Equipements handlers
    const handleFetchEquipements = async (link) => {
        setIsLoadingEquipments(true)
        try {
          let response = await handleFetch(link);     
          if(response?.status === 200){
            let formatedData = response?.data.map(item=>{
              return {
                name:item?.title,
                value: item?.id
              }
            });
            setEquipements(formatedData);
          }
        } catch (error) {
          console.error(error);
          toast.error("Échec de l'essai de récupération les equipements");
        }finally{
          setIsLoadingEquipments(false);
        }
    }

    const handleSearchEquipements = async(searchInput) => {
        const siteId = watch("siteId");
        if (!siteId) {
            toast.error("Veuillez d'abord sélectionner un site");
            return;
        }
        try{
            handleFetchEquipements(`${URLS.INCIDENT_API}/equipements/site/${siteId}?search=${searchInput}`);
        }catch(error){
            console.error(error);
            toast.error("Échec de l'essai de récupération les equipements");
        }
    }

    const handleSelectEquipement = (item) => {
        if(item){
            setValue("equipementId", item.value);
        }else{
            setValue("equipementId", null);
        }
    };

    useEffect(()=>{
        handleFetchSites(`${import.meta.env.VITE_ENTITY_API}/sites`);
    }, []);




  return (
    <div>
        <form onSubmit={handleSubmit(handleCreateOperation)}>
            <div className='flex flex-col mx-4 space-y-2'>
                <label htmlFor="" className='text-sm font-semibold mx-1'>Type d'action :</label>
                <select {...register("actionType", {required:"Ce champ est requis"})} className={`${errors.actionType ? 'outline-red-500 ring-red-500' : 'outline-none'} p-2 border text-sm rounded-lg`}>
                    <option value="">Choisir le type d'action</option>
                    {
                      ACTION_TYPES.map((action, index)=><option key={index} value={action.value}>{action.label}</option>)
                    }
                </select>
                {errors.actionType && <small className='text-xs my-2 mx-1 text-red-500'>{errors.actionType.message}</small>}
            </div>
            <div className='flex flex-col mx-2 mt-2'>
                <label htmlFor="" className='text-sm px-2 mx-1 font-semibold'>Choisir le site :</label>
                <AutoComplete
                    placeholder="Choisir un site"
                    isLoading={isLoadingSites}
                    dataList={sites}
                    onSearch={handleSearchSites}
                    onSelect={handleSelectSites}
                    register={{...register('siteId', {required:'Ce champ est requis'})}}
                    error={errors.siteId}
                />
                {errors.siteId && <small className='text-xs my-2 text-red-500 mx-4'>{errors.siteId.message}</small>}
            </div>
            <div className='flex flex-col mx-2 mt-2'>
                <label htmlFor="" className='text-sm px-2 mx-1 font-semibold'>Choisir l'equipement :</label>
                <AutoComplete
                    placeholder="Choisir un equipment"
                    isLoading={isLoadingEquipments}
                    dataList={equipements}
                    onSearch={handleSearchEquipements}
                    onSelect={handleSelectEquipement}
                    register={{...register('equipementId', {required:'Ce champ est requis'})}}
                    error={errors.equipementId}
                />
                {errors.equipementId && <small className='text-xs text-red-500 mx-4'>{errors.equipementId.message}</small>}
            </div>
            {
              watch("actionType") === 'REFUEL' &&
              <div className='flex flex-col mx-2 mt-2'>
                  <label htmlFor="" className='text-sm px-2 mx-1 font-semibold'>Contenu :</label>
                  <input type="text" {...register("content", {required:"Ce champ est requis"})} className={`${errors.content ? 'outline-red-500 ring-red-500' : 'outline-none'} p-2 border text-sm rounded-lg mx-2`} placeholder='Contenu' />
                  {errors.content && <small className='text-xs my-2 text-red-500 mx-4'>{errors.content.message}</small>}
              </div>
            }
            <div className='flex flex-col mx-2 mt-2'>
                <label htmlFor="" className='text-sm px-2 mx-1 font-semibold'>Description :</label>
                <textarea placeholder={"Description"} {...register("description", {required:false})} className={`${errors.description ? 'outline-red-500 ring-red-500' : 'outline-none'} p-2 border text-sm rounded-lg mx-2`}></textarea>
                {errors.description && <small className='text-xs my-2 text-red-500 mx-4'>{errors.description.message}</small>}
            </div>
            <div className='flex justify-end'>
                <Button disabled={isSubmitting} className={`${isSubmitting ? 'bg-blue-300' :'bg-primary hover:bg-secondary'} text-white font-semibold my-2 py-1 text-sm flex`}>
                    {isSubmitting ? <Preloader size={20}/> : <CheckCircle />}
                    <span>{isSubmitting ? "Création encours..." : "Créer"}</span>
                </Button>
            </div>
        </form>
    </div>
  )
}

export default ActionTypeForm