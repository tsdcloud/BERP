// // export default InitiateForm
// import React, {useEffect, useState} from 'react'
// import {useForm} from 'react-hook-form';
// import { useFetch } from '../../../hooks/useFetch';
// import { Button } from '../../ui/button';
// import { URLS } from '../../../../configUrl';
// import AutoComplete from '../../common/AutoComplete';
// import toast from 'react-hot-toast';
// import Preloader from "../../Preloader";
// import { CheckCircle } from 'lucide-react';

// const InitiateForm = ({onSucess}) => {
  
//   const { register, handleSubmit, formState:{errors}, setValue, reset, watch } = useForm();
//   const { handlePost, handleFetch } = useFetch();

//   const [sites, setSites] = useState([]);
//   const [groups, setGroups] = useState([]);
//   const [isLoadingSites, setIsLoadingSites] = useState(true);
//   const [isLoadingGroups, setIsLoadingGroups] = useState(true);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Surveiller les valeurs des champs AutoComplete
//   const currentSiteId = watch("siteId");
//   const currentGroupId = watch("equipmentGroupId");

//   const submitForm = async (data) =>{
//     let url = `${URLS.INCIDENT_API}/equipements`
//     setIsSubmitting(true);
//     try {
//       let response = await handlePost(url, {...data}, true);
//       if(response.error){
//         response?.error_list.forEach(error => {
//           toast.error(error?.msg);
//         });
//         return
//       }
//       toast.success("Crée avec succès");
      
//       // Réinitialiser uniquement les champs input et garder les AutoComplete
//       reset({
//         title: "",
//         operatingMode: "",
//         lifeSpan: "",
//         periodicity: "",
//         status: "",
//         // Garder les valeurs des AutoComplete
//         siteId: currentSiteId,
//         equipmentGroupId: currentGroupId
//       });
      
//       onSucess();
//     } catch (error) {
//       console.log(error);
//       toast.error("La création a échoué, vérifiez votre connexion");
//     }finally{
//       setIsSubmitting(false);
//     }
//   }

//   const handleFetchSites = async (link) =>{
//     setIsLoadingSites(true)
//     try {
//       let response = await handleFetch(link);     
//       if(response?.status === 200){
//         let dataArray = response?.data;
        
//         if (dataArray && typeof dataArray === 'object' && dataArray.data && Array.isArray(dataArray.data)) {
//           dataArray = dataArray.data;
//         }
        
//         if (Array.isArray(dataArray)) {
//           let formatedData = dataArray.map(item=>{
//             return {
//               name:item?.name,
//               value: item?.id
//             }
//           });
//           setSites(formatedData);
//         } else {
//           console.error('Expected array for sites but got:', dataArray);
//           setSites([]);
//         }
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Échec de l'essai de récupération des sites");
//     }finally{
//       setIsLoadingSites(false);
//     }
//   }

//   const handleSearchSites=async(searchInput)=>{
//     try{
//       handleFetchSites(`${import.meta.env.VITE_ENTITY_API}/sites?search=${searchInput}`);
//     }catch(error){
//       console.error(error);
//       toast.error("Échec de l'essai de récupération des sites");
//     }
//   }

//   const handleSelectSites = (item) => {
//     if(item){
//       setValue("siteId", item.value);
//     }else{
//       setValue("siteId", null);
//     }
//   };

//   const handleFetchGroups = async (link, searchQuery = "") =>{
//     setIsLoadingGroups(true)
//     try {
//       // S'assurer que l'URL inclut le paramètre de recherche si fourni
//       let url = link;
//       if (searchQuery) {
//         // Vérifier si l'URL a déjà des paramètres
//         const separator = link.includes('?') ? '&' : '?';
//         url = `${link}${separator}search=${searchQuery}`;
//       }
      
//       let response = await handleFetch(url);     
//       if(response?.status === 200){
//         let dataArray = response?.data;
        
//         // Gérer différentes structures de réponse
//         if (dataArray && typeof dataArray === 'object') {
//           // Si c'est un objet avec une propriété data (pagination)
//           if (dataArray.data && Array.isArray(dataArray.data)) {
//             dataArray = dataArray.data;
//           }
//           // Si c'est un objet avec une propriété data qui est un tableau (autre structure)
//           else if (Array.isArray(dataArray)) {
//             // dataArray est déjà un tableau
//           }
//         }
        
//         if (Array.isArray(dataArray)) {
//           let formatedData = dataArray.map(item=>{
//             return {
//               name:item?.name,
//               value: item?.id
//             }
//           });
//           setGroups(formatedData);
//         } else {
//           console.error('Expected array for groups but got:', dataArray);
//           setGroups([]);
//         }
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to get groups");
//     }finally{
//       setIsLoadingGroups(false);
//     }
//   }

//   const handleSearchGroups = async (searchInput) => {
//     try{
//       // Utiliser l'URL de base et passer le searchInput à handleFetchGroups
//       await handleFetchGroups(`${import.meta.env.VITE_INCIDENT_API}/equipment-groups`, searchInput);
//     }catch(error){
//       console.error(error);
//       toast.error("Failed to get groups");
//     }
//   }

//   const handleSelectGroups = (item) => {
//     if(item){
//       setValue("equipmentGroupId", item.value);
//     }else{
//       setValue("equipmentGroupId", null);
//     }
//   };

//   useEffect(()=>{
//     handleFetchSites(`${import.meta.env.VITE_ENTITY_API}/sites`);
//     handleFetchGroups(`${import.meta.env.VITE_INCIDENT_API}/equipment-groups`);
//   },[]);

//   return (
//     <form onSubmit={handleSubmit(submitForm)} className='flex flex-col space-y-2'>

//       <div className='space-y-2 max-w-md'>
//         {/* Titled */}
//         <div className='flex flex-col mx-4 space-y-2'>
//           <label htmlFor="" className='text-sm font-semibold'>Intitulé <span className='text-red-500'>*</span>:</label>
//           <input {...register("title", {required:"Ce champs est requis"})} className={`${errors.title ? 'outline-red-500 ring-red-500' : 'outline-none'} p-2 border text-sm rounded-lg`} placeholder="Entrer le nom de l'equipement"/>
//           {errors.title && <small className='text-xs my-2 text-red-500'>{errors.title.message}</small>}
//         </div>
//         <div className='flex flex-col justify-center md:flex-row items-center md:justify-evenly max-w-[300px] mx-auto md:mx-0'>
//           {/* operatingMode */}
//           <div className='flex flex-col mx-4 space-y-2 w-full md:w-auto'>
//             <label htmlFor="" className='text-sm font-semibold'>Régime Nominal <span className='text-red-500'>*</span> :</label>
//             <input type='number' {...register("operatingMode", {required:"Ce champs est requis"})} className={`${errors.operatingMode ? 'outline-red-500 ring-red-500' : 'outline-none'} p-2 border text-sm rounded-lg`} placeholder="Régime Nominal"/>
//             {errors.operatingMode && <small className='text-xs my-2 text-red-500'>{errors.operatingMode.message}</small>}
//           </div>

//           {/* Lifespan in days */}
//           <div className='flex flex-col mx-4 space-y-2 w-full md:w-auto'>
//             <label htmlFor="" className='text-sm font-semibold'>Durée de vie (en jour) <span className='text-red-500'>*</span> :</label>
//             <input type='number'{...register("lifeSpan", {required:"Ce champs est requis"})} className={`${errors.lifeSpan ? 'outline-red-500 ring-red-500' : 'outline-none'} p-2 border text-sm rounded-lg`} placeholder="Durée de vie"/>
//             {errors.lifeSpan && <small className='text-xs my-2 text-red-500'>{errors.lifeSpan.message}</small>}
//         </div>
//         </div>
//         {/* Maintenance Frequrncy */}
//         <div className='flex flex-col mx-4 space-y-2'>
//           <label htmlFor="" className='text-sm font-semibold'>périodicité de maintenance (en jour) <span className='text-red-500'>*</span>:</label>
//           <input type='number'{...register("periodicity", {required:"Ce champs est requis"})} className={`${errors.periodicity ? 'outline-red-500 ring-red-500' : 'outline-none'} p-2 border text-sm rounded-lg`} placeholder="périodicité de maintenance"/>
//           {errors.periodicity && <small className='text-xs my-2 text-red-500'>{errors.periodicity.message}</small>}
//         </div>
//         {/* equipment status */}
//         <div className='flex flex-col mx-4 space-y-2'>
//           <label htmlFor="" className='text-sm font-semibold'>Statut d'équipement <span className='text-red-500'>*</span>:</label>
//           <select {...register("status", {required:"Ce champs est requis"})} className={`${errors.status ? 'outline-red-500 ring-red-500' : 'outline-none'} p-2 border text-sm rounded-lg`}>
//             <option value="">Choisir le status de l'equipement</option>
//             <option value="NEW">NEUF</option>
//             <option value="SECOND_HAND">SECONDE MAIN</option>
//           </select>
//           {errors.status && <small className='text-xs my-2 text-red-500'>{errors.status.message}</small>}
//         </div>
//         {/* Groupe selection */}
//         <div className='flex flex-col'>
//           <label htmlFor="" className='text-sm px-2 mx-2 font-semibold'>Choisir le groupe <span className='text-red-500'>*</span> :</label>
//           <AutoComplete
//             placeholder="Choisir le groupe"
//             isLoading={isLoadingGroups}
//             dataList={groups}
//             onSearch={handleSearchGroups}
//             onSelect={handleSelectGroups}
//             // register={{...register('equipmentGroupId', {required:'Ce champ est requis'})}}
//           />
//           {errors.equipmentGroupId && <small className='text-xs mx-2 text-red-500'>{errors.equipmentGroupId.message}</small>}
//         </div>
//         {/* site selection */}
//         <div className='flex flex-col z-40 '>
//           <label htmlFor="" className='text-sm px-2 mx-2 font-semibold'>Choisir le site <span className='text-red-500'>*</span> :</label>
//           <AutoComplete
//             placeholder="Choisir un site"
//             isLoading={isLoadingSites}
//             dataList={sites}
//             onSearch={handleSearchSites}
//             onSelect={handleSelectSites}
//             // register={{...register('siteId', {required:'Ce champ est requis'})}}
//           />
//           {errors.siteId && <small className='text-xs mx-2 text-red-500'>{errors.siteId.message}</small>}
//         </div>
//       </div>

//       <div className='flex justify-end pt-4 z-10'>
//         <Button disabled={isSubmitting} className={`${isSubmitting ? 'bg-blue-300' :'bg-primary hover:bg-secondary'} text-white font-semibold my-2 py-1 text-sm flex`}>
//           {isSubmitting ? <Preloader size={20}/> : <CheckCircle />}
//           <span>{isSubmitting ? "Création encours..." : "Créer"}</span>
//         </Button>
//       </div>
//     </form>
//   )
// }

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useFetch } from '../../../hooks/useFetch';
import { Button } from '../../ui/button';
import { URLS } from '../../../../configUrl';
import AutoComplete from '../../common/AutoComplete';
import toast from 'react-hot-toast';
import Preloader from "../../Preloader";
import { CheckCircle, X, AlertTriangle } from 'lucide-react';

const InitiateForm = ({ onSucess }) => {
  
  // 1. Initialisation de React Hook Form
  const { register, handleSubmit, formState: { errors }, setValue, reset, watch } = useForm();
  const { handlePost, handleFetch } = useFetch();

  // 2. États pour les données et le chargement
  const [sites, setSites] = useState([]);
  const [groups, setGroups] = useState([]);
  const [isLoadingSites, setIsLoadingSites] = useState(true);
  const [isLoadingGroups, setIsLoadingGroups] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // État pour suivre la progression (évite le crash ReferenceError)
  const [currentProgress, setCurrentProgress] = useState(0);
  const [selectedSites, setSelectedSites] = useState([]);

  /**
   * SOUMISSION DU FORMULAIRE
   * Gestion sécurisée de la création multiple
   */
  const submitForm = async (data) => {
    if (selectedSites.length === 0) {
      toast.error("Veuillez sélectionner au moins un site");
      return;
    }

    setIsSubmitting(true);
    setCurrentProgress(0);
    let successfulCreations = 0;

    try {
      // Utilisation d'une boucle for...of pour un contrôle asynchrone strict
      for (const site of selectedSites) {
        try {
          const equipmentData = {
            ...data,
            siteId: site.value
          };

          const response = await handlePost(`${URLS.INCIDENT_API}/equipements`, equipmentData, true);

          // Vérification de la réponse (s'adapte selon la structure de votre backend)
          if (response && !response.error) {
            successfulCreations++;
          } else {
            const errorMsg = response?.error_list?.[0]?.msg || "Erreur de contrainte";
            toast.error(`Échec sur ${site.name}: ${errorMsg}`);
          }
        } catch (siteError) {
          console.error(`Erreur sur le site ${site.name}:`, siteError);
        } finally {
          // Mise à jour du state de progression pour l'UI
          setCurrentProgress(prev => prev + 1);
        }
      }

      // Résultat final
      if (successfulCreations > 0) {
        toast.success(`${successfulCreations} équipement(s) créé(s) avec succès`);
        
        // Petit délai pour laisser les notifications s'afficher avant de fermer
        setTimeout(() => {
          reset();
          setSelectedSites([]);
          onSucess(); // Déclenche handleSubmit du parent (Equipement.jsx)
        }, 500);
      }
    } catch (globalError) {
      console.error("Erreur critique boucle:", globalError);
      toast.error("Une erreur imprévue est survenue");
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * RÉCUPÉRATION DES DONNÉES (Sites et Groupes)
   */
  const handleFetchSites = async (link) => {
    setIsLoadingSites(true);
    try {
      let response = await handleFetch(link);     
      if(response?.status === 200 || response?.data){
        let dataArray = response?.data?.data || response?.data || [];
        if (Array.isArray(dataArray)) {
          setSites(dataArray.map(item => ({ name: item.name, value: item.id })));
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingSites(false);
    }
  }

  const handleFetchGroups = async (link, searchQuery = "") => {
    setIsLoadingGroups(true);
    let url = searchQuery ? `${link}${link.includes('?') ? '&' : '?'}search=${searchQuery}` : link;
    try {
      let response = await handleFetch(url);     
      if(response?.status === 200 || response?.data){
        let dataArray = response?.data?.data || response?.data || [];
        if (Array.isArray(dataArray)) {
          setGroups(dataArray.map(item => ({ name: item.name, value: item.id })));
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingGroups(false);
    }
  }

  // Sélection/Suppression des sites
  const handleSelectSites = (item) => {
    if (item && !selectedSites.some(site => site.value === item.value)) {
      setSelectedSites(prev => [...prev, item]);
    } else if (item) {
      toast.error("Site déjà ajouté");
    }
  };

  const handleRemoveSite = (siteValue) => {
    setSelectedSites(prev => prev.filter(site => site.value !== siteValue));
  };

  useEffect(() => {
    handleFetchSites(`${URLS.ENTITY_API}/sites`);
    handleFetchGroups(`${URLS.INCIDENT_API}/equipment-groups`);
  }, []);

  return (
    <form onSubmit={handleSubmit(submitForm)} className='flex flex-col h-full'>
      
      {/* Zone scrollable */}
      <div className='space-y-4 max-w-md overflow-y-auto max-h-[60vh] px-4 pr-2'>
        
        <div className='flex flex-col space-y-1'>
          <label className='text-sm font-semibold'>Intitulé <span className='text-red-500'>*</span></label>
          <input 
            {...register("title", {required: "L'intitulé est obligatoire"})} 
            className={`p-2 border rounded-lg text-sm ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Ex: Groupe Électrogène"
          />
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <div className='flex flex-col space-y-1'>
            <label className='text-sm font-semibold'>Régime (Nominal)</label>
            <input type='number' {...register("operatingMode")} className='p-2 border rounded-lg text-sm' />
          </div>
          <div className='flex flex-col space-y-1'>
            <label className='text-sm font-semibold'>Vie (jours)</label>
            <input type='number' {...register("lifeSpan")} className='p-2 border rounded-lg text-sm' />
          </div>
        </div>

        <div className='flex flex-col space-y-1'>
          <label className='text-sm font-semibold'>Périodicité Maintenance (jours)</label>
          <input type='number' {...register("periodicity")} className='p-2 border rounded-lg text-sm' />
        </div>

        <div className='flex flex-col space-y-1'>
          <label className='text-sm font-semibold'>Statut</label>
          <select {...register("status")} className='p-2 border rounded-lg text-sm'>
            <option value="NEW">NEUF</option>
            <option value="SECOND_HAND">SECONDE MAIN</option>
          </select>
        </div>

        <div className='flex flex-col space-y-1'>
          <label className='text-sm font-semibold'>Groupe d'équipement <span className='text-red-500'>*</span></label>
          <AutoComplete
            placeholder="Rechercher un groupe..."
            isLoading={isLoadingGroups}
            dataList={groups}
            onSearch={(val) => handleFetchGroups(`${URLS.INCIDENT_API}/equipment-groups`, val)}
            onSelect={(item) => setValue("equipmentGroupId", item?.value)}
          />
        </div>

        <div className='flex flex-col space-y-1 border-t pt-4'>
          <label className='text-sm font-semibold flex justify-between'>
            Sites cibles <span className='text-blue-600'>{selectedSites.length} sélectionnés</span>
          </label>
          <AutoComplete
            placeholder="Ajouter un site..."
            isLoading={isLoadingSites}
            dataList={sites}
            onSearch={(val) => handleFetchSites(`${URLS.ENTITY_API}/sites?search=${val}`)}
            onSelect={handleSelectSites}
          />

          <div className='flex flex-wrap gap-2 mt-2'>
            {selectedSites.map((site) => (
              <span key={site.value} className='flex items-center bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs font-medium'>
                {site.name}
                <X size={14} className='ml-1 cursor-pointer hover:text-red-500' onClick={() => handleRemoveSite(site.value)} />
              </span>
            ))}
          </div>
          {selectedSites.length === 0 && (
            <span className='text-[10px] text-orange-500 flex items-center gap-1'>
              <AlertTriangle size={12}/> Sélection obligatoire.
            </span>
          )}
        </div>
      </div>

      <div className='mt-auto p-4 border-t bg-gray-50 flex justify-end'>
        <Button 
          type="submit"
          disabled={isSubmitting || selectedSites.length === 0} 
          className='bg-primary hover:bg-secondary text-white shadow-md'
        >
          {isSubmitting ? <Preloader size={20}/> : <CheckCircle size={18} className="mr-2" />}
          {isSubmitting 
            ? `Traitement (${currentProgress}/${selectedSites.length})...` 
            : `Enregistrer sur ${selectedSites.length} site(s)`}
        </Button>
      </div>
    </form>
  )
}

export default InitiateForm;