import React, {useState, useEffect} from 'react';
import { Button } from '../../ui/button';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Preloader from "../../Preloader";
import { CheckCircle } from 'lucide-react';
import { URLS } from '../../../../configUrl';
import { useFetch } from '../../../hooks/useFetch';
import AutoComplete from '../../common/AutoComplete';

const MovementForm = ({onSuccess}) => {
    const {handleSubmit, formState:{errors}, register, setValue, watch} = useForm();
    const {handlePost, handleFetch} = useFetch();
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingEquipements, setIsLoadingEquipements] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [sites, setSites] = useState([]);
    const [equipements, setEquipements] = useState([]);

    // Site handlers
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

    const handleSelectOriginSite = async (item) => {
        if(item){
            setValue("originSite", item.value);
            // Fetch equipments for selected origin site
            await handleFetchEquipements(`${URLS.INCIDENT_API}/equipements/site/${item.value}`);
            // Clear equipment selection when site changes
            setValue("equipementId", null);
        }else{
            setValue("originSite", null);
            setEquipements([]); // Clear equipments list
            setValue("equipementId", null);
        }
    }

    const handleSelectDestinationSite = (item) => {
        if(item){
            setValue("destinationSite", item.value);
        }else{
            setValue("destinationSite", null);
        }
    }

    const handleCreateMovement =async (data)=>{
        setIsSubmitting(true);

        if(data.description === ""){
          data.description = null
        }
        let url = `${URLS.INCIDENT_API}/movements`
        try {
            let response = await handlePost(url, {...data}, true);
            if(response.error){
                response?.errors.forEach(error => {
                  toast.error(error?.msg);
                });
                return
            }
            toast.success("Opération éffectuée avec succès");
            onSuccess();
        } catch (error) {
            console.log(error);
            // toast.error("La création a échoué, vérifiez votre connexion");
        }finally{
            setIsSubmitting(false);
        }
    }

    // Equipements handlers
    const handleFetchEquipements = async (link) => {
        setIsLoadingEquipements(true)
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
            setIsLoadingEquipements(false);
        }
    }

    const handleSearchEquipements = async(searchInput) => {
        const originSiteId = watch("originSite");
        if (!originSiteId) {
            toast.error("Veuillez d'abord sélectionner un site de départ");
            return;
        }
        try{
            handleFetchEquipements(`${URLS.INCIDENT_API}/equipements/site/${originSiteId}?search=${searchInput}`);
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
            <form onSubmit={handleSubmit(handleCreateMovement)}>
                <div className='flex flex-col mx-2 mt-2'>
                    <label htmlFor="" className='text-sm px-2 mx-1 font-semibold'>Choisir le site de départ :</label>
                    <AutoComplete
                        placeholder="Choisir le site de départ"
                        isLoading={isLoading}
                        dataList={sites}
                        onSearch={handleSearchSites}
                        onSelect={handleSelectOriginSite}
                        // register={{...register('originSite', {required:'Ce champ est requis'})}}
                        error={errors.originSite}
                    />
                    {errors.originSite && <small className='text-xs my-2 text-red-500 mx-4'>{errors.originSite.message}</small>}
                </div>
                <div className='flex flex-col mx-2 mt-2'>
                    <label htmlFor="" className='text-sm px-2 mx-1 font-semibold'>Choisir l'equipement :</label>
                    <AutoComplete
                        placeholder="Choisir un equipment"
                        isLoading={isLoadingEquipements}
                        dataList={equipements}
                        onSearch={handleSearchEquipements}
                        onSelect={handleSelectEquipement}
                        // register={{...register('equipementId', {required:'Ce champ est requis'})}}
                        error={errors.equipementId}
                    />
                    {errors.equipementId && <small className='text-xs text-red-500 mx-4'>{errors.equipementId.message}</small>}
                </div>
                <div className='flex flex-col mx-2 mt-2'>
                    <label htmlFor="" className='text-sm px-2 mx-1 font-semibold'>Choisir le site de destination :</label>
                    <AutoComplete
                        placeholder="Choisir le site de destination"
                        isLoading={isLoading}
                        dataList={sites}
                        onSearch={handleSearchSites}
                        onSelect={handleSelectDestinationSite}
                        // register={{...register('destinationSite', {required:'Ce champ est requis'})}}
                        error={errors.destinationSite}
                    />
                    {errors.destinationSite && <small className='text-xs my-2 text-red-500 mx-4'>{errors.destinationSite.message}</small>}
                </div>
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

export default MovementForm