// import React, {useEffect, useState} from 'react'
// import {useForm} from 'react-hook-form';
// import { useFetch } from '../../../hooks/useFetch';
// import AutoComplete from '../../common/AutoComplete';
// import { Button } from '../../ui/button';
// import { URLS } from '../../../../configUrl';
// import { DatePicker } from 'antd';
// import dayjs from 'dayjs';
// import customParseFormat from 'dayjs/plugin/customParseFormat';
// import Preloader from '../../Preloader';
// import { CheckCircle } from 'lucide-react';
// import toast from 'react-hot-toast';
// dayjs.extend(customParseFormat);

// const dateFormat = 'YYYY-MM-DDThh:mm:ssZ';


// const InitiateForm = ({onSucess}) => {
//   const {register, handleSubmit, formState:{errors}, setValue, watch} = useForm();
//   const {handleFetch, handlePost} = useFetch();

//   const [isLoading, setIsLoading] = useState(true);
//   const [incidents, setIncidents] = useState([]);
//   const [sites, setSites] = useState([]);
//   const [equipements, setEquipements] = useState([]);
//   const [employees, setEmployees] = useState([]);
//   const [isSubmiting, setIsSubmiting] = useState(false);

//   // incidents
//   const handleFetchIncidents = async (link) =>{
//     try {
//       let response = await handleFetch(link);     
//       if(response?.status === 200){
//         let formatedData = response?.data.map(item=>{
//           return {
//             name:item?.numRef,
//             value: item?.id
//           };
//         });
//         setIncidents(formatedData);
//       }
//     } catch (error) {
//       console.error(error);
//     } finally{
//       setIsLoading(false);
//     }
//   };
  

//   // Equipements handlers
//   const handleFetchEquipements = async (link) => {
//     setIsLoading(true);
//     try {
//       let response = await handleFetch(link);     
//       if(response?.status === 200){
//         let formatedData = response?.data.map(item=>{
//           return {
//             name:item?.title,
//             value: item?.id
//           };
//         });
//         setEquipements(formatedData);
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Échec de l'essai de récupération les equipements");
//     }finally{
//       setIsLoading(false);
//     }
//   };

//   const handleSearchEquipements = async(searchInput) => {
//     const siteId = watch("siteId");
//     if (!siteId) {
//         toast.error("Veuillez d'abord sélectionner un site");
//         return;
//     }
//     try{
//         handleFetchEquipements(`${URLS.INCIDENT_API}/equipements/site/${siteId}?search=${searchInput}`);
//     }catch(error){
//         console.error(error);
//         toast.error("Échec de l'essai de récupération les equipements");
//     }
//   };

//   const handleSelectEquipement = (item) => {
//     if(item){
//         setValue("equipementId", item.value);
//     }else{
//         setValue("equipementId", null);
//     }
//   };


//   // Sites
//   const handleFetchSites = async (link) =>{
//     try {
//       let response = await handleFetch(link);     
//       if(response?.status === 200){
//         let formatedData = response?.data.map(item=>{
//           return {
//             name:item?.name,
//             value: item?.id
//           };
//         });
//         setSites(formatedData);
//       }
//     } catch (error) {
//       console.error(error);
//     } finally{
//       setIsLoading(false);
//     }
//   };
//   const handleSearchSites=async(searchInput)=>{
//     try{
//       handleFetchSites(`${import.meta.env.VITE_ENTITY_API}/sites?search=${searchInput}`);
//     }catch(error){
//       console.log(error);
//     }
//   };
//   const handleSelectSites = async (item) => {
//     if(item){
//         setValue("siteId", item.value);
//         // Fetch equipments for selected site
//         await handleFetchEquipements(`${URLS.INCIDENT_API}/equipements/site/${item.value}`);
//         // Clear equipment selection when site changes
//         setValue("equipementId", null);
//     }else{
//         setValue("siteId", null);
//         setEquipements([]); // Clear equipments list
//         setValue("equipementId", null);
//     }
// }


//   const submitForm = async (data) =>{
//     let url = `${URLS.INCIDENT_API}/maintenances`;
//     try {
//       let response = await handlePost(url, data, true);
//       if(response.error){
//         console.log(response.error);
//         response?.error_list?.froEach(error => toast.error(error.msg));
//         return
//       }
//       toast.success("Opération éffectuée avec succès");
//       onSucess();
//     } catch (error) {
//       console.log(error);
//       // toast.error("Une erreur inattendue s'est produite, veuillez réessayer plus tard.");
//     }
//   }


//   useEffect(()=>{
//     handleFetchIncidents(`${import.meta.env.VITE_INCIDENT_API}/incidents`);
//     handleFetchSites(`${import.meta.env.VITE_ENTITY_API}/sites`);
//   }, []);


//   return (
//     <form onSubmit={handleSubmit(submitForm)} className='max-h-[300px]'>
//       <div className='h-[250px] overflow-scroll space-y-'>
//         <div className='flex flex-col mx-4'>
//           <label htmlFor="" className='text-xs font-semibold px-2'>Choisir le type de maintenance <span className='text-red-500'>*</span></label>
//           <select className='border rounded-lg w-full p-2' {...register('maintenance', {required:'Ce champ est requis'})}>
//             <option value="">Choisir le type de maintenance</option>
//             <option value="CORRECTION">CORRECTIF</option>
//             <option value="PALLIATIVE">PALIATIF</option>
//             <option value="CURATIVE">CURATIF</option>
//             <option value="PROGRAMMED">PROGRAMMéE</option>
//           </select>
//           {errors.maintenance && <small className='text-xs my-2 text-red-500 mx-4'>{errors.maintenance.message}</small>}
//         </div>
//         <div className='flex flex-col mx-2 mt-2'>
//             <label htmlFor="" className='text-sm px-2 mx-1 font-semibold'>Choisir le site :</label>
//             <AutoComplete
//                 placeholder="Choisir un site"
//                 isLoading={isLoading}
//                 dataList={sites}
//                 onSearch={handleSearchSites}
//                 onSelect={handleSelectSites}
//                 // register={{...register('siteId', {required:'Ce champ est requis'})}}
//                 error={errors.siteId}
//             />
//             {errors.siteId && <small className='text-xs my-2 text-red-500 mx-4'>{errors.siteId.message}</small>}
//         </div>
//         <div className='flex flex-col mx-2 mt-2'>
//             <label htmlFor="" className='text-sm px-2 mx-1 font-semibold'>Choisir l'equipement :</label>
//             <AutoComplete
//                 placeholder="Choisir un equipment"
//                 isLoading={isLoading}
//                 dataList={equipements}
//                 onSearch={handleSearchEquipements}
//                 onSelect={handleSelectEquipement}
//                 // register={{...register('equipementId', {required:'Ce champ est requis'})}}
//                 error={errors.equipementId}
//             />
//             {errors.equipementId && <small className='text-xs text-red-500 mx-4'>{errors.equipementId.message}</small>}
//         </div>
        
//         <div className='px-2 flex flex-col my-2'>
//           <label htmlFor="" className='text-xs font-semibold px-2'>Description</label>
//           <textarea className='border rounded-lg w-full p-2' placeholder='Description' {...register("description", { required: false })}></textarea>
//         </div>
//       </div>
//       <div className='flex justify-end p-2'>
//         <Button className="bg-primary text-white font-semibold my-2 py-1 text-sm" disable={isSubmiting}>
//           {isSubmiting ? <Preloader size={20}/> : <CheckCircle/>}
//           {isSubmiting ? "Creation en cours .." : "Créer"}
//         </Button>
//       </div>
//     </form>
//   );
// };

// export default InitiateForm

import React, {useEffect, useState} from 'react'
import {useForm} from 'react-hook-form';
import { useFetch } from '../../../hooks/useFetch';
import AutoComplete from '../../common/AutoComplete';
import { Button } from '../../ui/button';
import { URLS } from '../../../../configUrl';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import Preloader from '../../Preloader';
import { CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
dayjs.extend(customParseFormat);

const dateFormat = 'YYYY-MM-DDThh:mm:ssZ';

const InitiateForm = ({onSucess}) => {
  const {register, handleSubmit, formState:{errors}, setValue, watch, getValues} = useForm();
  const {handleFetch, handlePost} = useFetch();

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingEquipments, setIsLoadingEquipments] = useState(false);
  const [incidents, setIncidents] = useState([]);
  const [sites, setSites] = useState([]);
  const [equipements, setEquipements] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [isSubmiting, setIsSubmiting] = useState(false);

  // incidents
  const handleFetchIncidents = async (link) =>{
    try {
      let response = await handleFetch(link);     
      if(response?.status === 200){
        let formatedData = response?.data.map(item=>{
          return {
            name:item?.numRef,
            value: item?.id
          };
        });
        setIncidents(formatedData);
      }
    } catch (error) {
      console.error(error);
    }
  };
  

  // Equipements handlers
  const handleFetchEquipements = async (link, showLoader = true) => {
    if (showLoader) setIsLoadingEquipments(true);
    try {
      let response = await handleFetch(link);     
      if(response?.status === 200){
        let formatedData = response?.data.map(item=>{
          return {
            name:item?.title,
            value: item?.id,
            // Ajoutez d'autres informations si besoin
            numRef: item?.numRef
          };
        });
        setEquipements(formatedData);
      }
    } catch (error) {
      console.error(error);
      toast.error("Échec de l'essai de récupération des équipements");
    } finally {
      if (showLoader) setIsLoadingEquipments(false);
    }
  };

  const handleSearchEquipements = async(searchInput) => {
    const siteId = getValues("siteId");
    if (!siteId) {
        toast.error("Veuillez d'abord sélectionner un site");
        return;
    }
    
    // Construction de l'URL avec query params
    const baseUrl = `${URLS.INCIDENT_API}/equipements/site/${siteId}`;
    const url = searchInput 
      ? `${baseUrl}?search=${encodeURIComponent(searchInput)}`
      : baseUrl;
    
    try {
        await handleFetchEquipements(url);
    } catch(error) {
        console.error(error);
        toast.error("Échec de la récupération des équipements");
    }
  };

  const handleSelectEquipement = (item) => {
    if(item){
        setValue("equipementId", item.value, { shouldValidate: true });
    } else {
        setValue("equipementId", null, { shouldValidate: true });
    }
  };

  // Sites
  const handleFetchSites = async (link) =>{
    setIsLoading(true);
    try {
      let response = await handleFetch(link);     
      if(response?.status === 200){
        let formatedData = response?.data.map(item=>{
          return {
            name:item?.name,
            value: item?.id
          };
        });
        setSites(formatedData);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSearchSites = async(searchInput) => {
    try {
      const url = searchInput 
        ? `${import.meta.env.VITE_ENTITY_API}/sites?search=${encodeURIComponent(searchInput)}`
        : `${import.meta.env.VITE_ENTITY_API}/sites`;
      await handleFetchSites(url);
    } catch(error) {
      console.log(error);
    }
  };
  
  const handleSelectSites = async (item) => {
    if(item){
        setValue("siteId", item.value, { shouldValidate: true });
        // Fetch equipment for selected site (sans terme de recherche initial)
        await handleFetchEquipements(`${URLS.INCIDENT_API}/equipements/site/${item.value}`);
        // Clear equipment selection when site changes
        setValue("equipementId", null, { shouldValidate: true });
    } else {
        setValue("siteId", null, { shouldValidate: true });
        setEquipements([]); // Clear equipments list
        setValue("equipementId", null, { shouldValidate: true });
    }
  }

  const submitForm = async (data) =>{
    let url = `${URLS.INCIDENT_API}/maintenances`;
    setIsSubmiting(true);
    try {
      let response = await handlePost(url, data, true);
      if(response.error){
        console.log(response.error);
        response?.error_list?.forEach(error => toast.error(error.msg));
        return;
      }
      toast.success("Opération effectuée avec succès");
      onSucess();
    } catch (error) {
      console.log(error);
      toast.error("Une erreur inattendue s'est produite");
    } finally {
      setIsSubmiting(false);
    }
  }

  useEffect(()=>{
    handleFetchIncidents(`${import.meta.env.VITE_INCIDENT_API}/incidents`);
    handleFetchSites(`${import.meta.env.VITE_ENTITY_API}/sites`);
  }, []);

  return (
    <form onSubmit={handleSubmit(submitForm)} className='max-h-[300px]'>
      <div className='h-[250px] overflow-scroll space-y-'>
        <div className='flex flex-col mx-4'>
          <label htmlFor="" className='text-xs font-semibold px-2'>Choisir le type de maintenance <span className='text-red-500'>*</span></label>
          <select className='border rounded-lg w-full p-2' {...register('maintenance', {required:'Ce champ est requis'})}>
            <option value="">Choisir le type de maintenance</option>
            <option value="CORRECTION">CORRECTIF</option>
            <option value="PALLIATIVE">PALIATIF</option>
            <option value="CURATIVE">CURATIF</option>
            <option value="PROGRAMMED">PROGRAMMÉE</option>
          </select>
          {errors.maintenance && <small className='text-xs my-2 text-red-500 mx-4'>{errors.maintenance.message}</small>}
        </div>
        <div className='flex flex-col mx-2 mt-2'>
            <label htmlFor="" className='text-sm px-2 mx-1 font-semibold'>Choisir le site :</label>
            <AutoComplete
                placeholder="Choisir un site"
                isLoading={isLoading}
                dataList={sites}
                onSearch={handleSearchSites}
                onSelect={handleSelectSites}
                error={errors.siteId}
            />
            {errors.siteId && <small className='text-xs my-2 text-red-500 mx-4'>{errors.siteId.message}</small>}
        </div>
        <div className='flex flex-col mx-2 mt-2'>
            <label htmlFor="" className='text-sm px-2 mx-1 font-semibold'>Choisir l'équipement :</label>
            <AutoComplete
                placeholder="Choisir un équipement"
                isLoading={isLoadingEquipments}  // Utilisez l'état spécifique
                dataList={equipements}
                onSearch={handleSearchEquipements}
                onSelect={handleSelectEquipement}
                error={errors.equipementId}
                disabled={!watch("siteId")}  // Désactiver si pas de site sélectionné
            />
            {errors.equipementId && <small className='text-xs text-red-500 mx-4'>{errors.equipementId.message}</small>}
        </div>
        
        <div className='px-2 flex flex-col my-2'>
          <label htmlFor="" className='text-xs font-semibold px-2'>Description</label>
          <textarea className='border rounded-lg w-full p-2' placeholder='Description' {...register("description", { required: false })}></textarea>
        </div>
      </div>
      <div className='flex justify-end p-2'>
        <Button 
          type="submit"
          className="bg-primary text-white font-semibold my-2 py-1 text-sm" 
          disabled={isSubmiting}
        >
          {isSubmiting ? <Preloader size={20}/> : <CheckCircle/>}
          {isSubmiting ? "Création en cours..." : "Créer"}
        </Button>
      </div>
    </form>
  );
};

export default InitiateForm;