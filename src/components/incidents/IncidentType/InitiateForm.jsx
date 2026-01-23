// import React from 'react'
// import {useForm} from 'react-hook-form';
// import { useFetch } from '../../../hooks/useFetch';
// import { Input } from '../../ui/input';
// import { Button } from '../../ui/button';
// import { URLS } from '../../../../configUrl';
// import toast from 'react-hot-toast';
// import { EQUIPMENT_DOMAIN } from '../../../utils/constant.utils';

// const InitiateForm = ({onSucess}) => {
  
//   const { register, handleSubmit, formState:{errors}, reset } = useForm();
//   const { handlePost } = useFetch();

//   const submitForm = async (data) =>{
//     let url = `${URLS.INCIDENT_API}/incident-types`
//     data.createdBy = "user 1";
//     try {
//       let response = await handlePost(url, data, true);
//       if(response.error){
//         // alert("Erreur. Une erreur est survenue lors de la création.");
//         toast.error("Cette enregistrement existe déja dans la base de donnée");
//         console.log(response)
//         return
//       }
//       toast.success("Crée avec succès");
//       reset();
//       onSucess();
//     } catch (error) {
//       console.log(error);
//       // toast.error("La création a échoué, vérifiez votre connexion ou contactez un IT");
//     }
//   }
//   return (
//     <form onSubmit={handleSubmit(submitForm)} className='space-y-2'>
//         <div className='flex flex-col'>
//           <Input {...register("name", {required:"Ce champs est requis"})} className="outline-none" placeholder="Entrer le nom du type"/>
//           {errors.name && <small className='text-xs my-2 text-red-500'>{errors.name.message}</small>}
//         </div>
//         <div className='w-full'>
//             <label htmlFor="domain" className='text-sm font-semibold'>Département tutélaire <span className='text-red-500'>*</span></label>
//             <select 
//               id="domain" 
//               className='w-full border p-2 rounded-lg text-sm' 
//               {...register("domain", {required:"Ce champ est requis"})}
//             >
//                 <option value="">Choisir le département *</option>
//                 {EQUIPMENT_DOMAIN.map((domain, index) => (
//                     <option value={domain.value} key={index}>{domain.label}</option> 
//                 ))}
//             </select>
//             {errors.domain && <small className='text-xs text-red-500'>{errors.domain.message}</small>}
//         </div>
//         <Button className="bg-primary text-white font-normal my-2 py-1 text-xs">Créer</Button>
//     </form>
//   )
// }

// export default InitiateForm

// import React, {useEffect, useState} from 'react'
// import {useForm} from 'react-hook-form';
// import { useFetch } from '../../../hooks/useFetch';
// import { Input } from '../../ui/input';
// import { Button } from '../../ui/button';
// import { URLS } from '../../../../configUrl';
// import toast from 'react-hot-toast';
// import { EQUIPMENT_DOMAIN } from '../../../utils/constant.utils';
// import { CheckCircle, XCircle } from 'lucide-react';
// import Preloader from "../../Preloader";

// const InitiateForm = ({onSucess, editData, onCancelEdit}) => {
  
//   const { register, handleSubmit, formState:{errors}, reset, setValue } = useForm();
//   const { handlePost, handlePatch } = useFetch();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(false);

//   // Remplir le formulaire avec les données d'édition
//   useEffect(() => {
//     if (editData) {
//       setIsEditMode(true);
//       setValue("name", editData.name);
//       setValue("domain", editData.domain);
//     } else {
//       setIsEditMode(false);
//       reset(); // Réinitialiser le formulaire
//     }
//   }, [editData, setValue, reset]);

//   const submitForm = async (data) => {
//     setIsSubmitting(true);
    
//     try {
//       let response;
      
//       if (isEditMode && editData) {
//         // Mode édition - PUT request
//         let url = `${URLS.INCIDENT_API}/incident-types/${editData.id}`;
//         response = await handlePatch(url, data, true);
        
//         if (response.error) {
//           toast.error("Erreur lors de la modification");
//           console.log(response);
//           return;
//         }
//         toast.success("Modifié avec succès");
//       } else {
//         // Mode création - POST request
//         let url = `${URLS.INCIDENT_API}/incident-types`;
//         data.createdBy = "user 1"; // À adapter selon votre authentification
//         response = await handlePost(url, data, true);
        
//         if (response.error) {
//           toast.error("Cet enregistrement existe déjà dans la base de données");
//           console.log(response);
//           return;
//         }
//         toast.success("Créé avec succès");
//       }
      
//       reset();
//       onSucess();
//       if (onCancelEdit) onCancelEdit();
      
//     } catch (error) {
//       console.log(error);
//       toast.error("La création/modification a échoué, vérifiez votre connexion");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleCancel = () => {
//     reset();
//     if (onCancelEdit) {
//       onCancelEdit();
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit(submitForm)} className='space-y-4'>
//       <div className='flex flex-col'>
//         <label className='text-sm font-medium mb-1'>Nom du type d'incident</label>
//         <Input 
//           {...register("name", {required:"Ce champ est requis"})} 
//           className="outline-none" 
//           placeholder="Entrer le nom du type"
//         />
//         {errors.name && <small className='text-xs mt-1 text-red-500'>{errors.name.message}</small>}
//       </div>
      
//       <div className='w-full'>
//         <label htmlFor="domain" className='text-sm font-medium mb-1'>
//           Département tutélaire <span className='text-red-500'>*</span>
//         </label>
//         <select 
//           id="domain" 
//           className='w-full border p-2 rounded-lg text-sm' 
//           {...register("domain", {required:"Ce champ est requis"})}
//         >
//           <option value="">Choisir le département *</option>
//           {EQUIPMENT_DOMAIN.map((domain, index) => (
//             <option value={domain.value} key={index}>{domain.label}</option> 
//           ))}
//         </select>
//         {errors.domain && <small className='text-xs mt-1 text-red-500'>{errors.domain.message}</small>}
//       </div>
      
//       <div className="flex justify-end gap-2 mt-4">
//         {isEditMode && (
//           <Button 
//             type="button"
//             onClick={handleCancel}
//             variant="outline"
//             className="text-sm flex gap-2"
//           >
//             <XCircle className="h-4 w-4" />
//             <span>Annuler</span>
//           </Button>
//         )}
        
//         <Button 
//           type="submit"
//           disabled={isSubmitting}
//           className={`${isSubmitting ? 'opacity-50' : ''} text-sm flex gap-2`}
//         >
//           {isSubmitting ? (
//             <>
//               <Preloader size={16} />
//               <span>{isEditMode ? "Modification..." : "Création..."}</span>
//             </>
//           ) : (
//             <>
//               <CheckCircle className="h-4 w-4" />
//               <span>{isEditMode ? "Modifier" : "Créer"}</span>
//             </>
//           )}
//         </Button>
//       </div>
//     </form>
//   )
// }

// export default InitiateForm

import React, {useEffect, useState} from 'react'
import {useForm} from 'react-hook-form';
import { useFetch } from '../../../hooks/useFetch';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { URLS } from '../../../../configUrl';
import toast from 'react-hot-toast';
import { EQUIPMENT_DOMAIN } from '../../../utils/constant.utils';
import { CheckCircle, XCircle } from 'lucide-react';
import Preloader from "../../Preloader";

const InitiateForm = ({onSucess, editData, onCancelEdit, userDomain = "PRIVILEGED"}) => {
  
  const { register, handleSubmit, formState:{errors}, reset, setValue } = useForm();
  const { handlePost, handlePatch } = useFetch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Déterminer les options de domaine disponibles
  const getDomainOptions = () => {
    if (userDomain === "PRIVILEGED") {
      // Utilisateur privilégié : accès à tous les domaines
      return EQUIPMENT_DOMAIN;
    } else {
      // Utilisateur normal : seulement son domaine
      return EQUIPMENT_DOMAIN.filter(domain => 
        domain.value === userDomain || !domain.value
      );
    }
  };

  const domainOptions = getDomainOptions();

  // Remplir le formulaire avec les données d'édition
  useEffect(() => {
    if (editData) {
      setIsEditMode(true);
      setValue("name", editData.name);
      setValue("domain", editData.domain);
      
      // En mode édition, vérifier si l'utilisateur peut modifier ce domaine
      if (userDomain !== "PRIVILEGED" && editData.domain !== userDomain) {
        toast.error("Vous n'avez pas la permission de modifier ce type d'incident");
        if (onCancelEdit) onCancelEdit();
      }
    } else {
      setIsEditMode(false);
      reset();
      // En mode création, définir le domaine par défaut si l'utilisateur n'est pas privilégié
      if (userDomain !== "PRIVILEGED" && domainOptions.length === 1) {
        setValue("domain", domainOptions[0].value);
      }
    }
  }, [editData, setValue, reset, userDomain, domainOptions, onCancelEdit]);

  const submitForm = async (data) => {
    setIsSubmitting(true);
    
    try {
      // Vérification supplémentaire du domaine
      if (userDomain !== "PRIVILEGED" && data.domain !== userDomain) {
        toast.error("Vous ne pouvez créer que pour votre propre domaine");
        setIsSubmitting(false);
        return;
      }

      let response;
      
      if (isEditMode && editData) {
        // Mode édition
        let url = `${URLS.INCIDENT_API}/incident-types/${editData.id}`;
        response = await handlePatch(url, data, true);
        
        if (response.error) {
          toast.error("Erreur lors de la modification");
          console.log(response);
          return;
        }
        toast.success("Modifié avec succès");
      } else {
        // Mode création
        let url = `${URLS.INCIDENT_API}/incident-types`;
        data.createdBy = "user 1"; // À adapter selon votre authentification
        response = await handlePost(url, data, true);
        
        if (response.error) {
          toast.error("Cet enregistrement existe déjà dans la base de données");
          console.log(response);
          return;
        }
        toast.success("Créé avec succès");
      }
      
      reset();
      onSucess();
      if (onCancelEdit) onCancelEdit();
      
    } catch (error) {
      console.log(error);
      toast.error("La création/modification a échoué, vérifiez votre connexion");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    reset();
    if (onCancelEdit) {
      onCancelEdit();
    }
  };

  return (
    <form onSubmit={handleSubmit(submitForm)} className='space-y-4'>
      <div className='flex flex-col'>
        <label className='text-sm font-medium mb-1'>Nom du type d'incident</label>
        <Input 
          {...register("name", {required:"Ce champ est requis"})} 
          className="outline-none" 
          placeholder="Entrer le nom du type"
          disabled={isEditMode && userDomain !== "PRIVILEGED" && editData?.domain !== userDomain}
        />
        {errors.name && <small className='text-xs mt-1 text-red-500'>{errors.name.message}</small>}
      </div>
      
      <div className='w-full'>
        <label htmlFor="domain" className='text-sm font-medium mb-1'>
          Département tutélaire <span className='text-red-500'>*</span>
        </label>
        <select 
          id="domain" 
          className={`w-full border p-2 rounded-lg text-sm ${
            (userDomain !== "PRIVILEGED" && domainOptions.length === 1) || 
            (isEditMode && userDomain !== "PRIVILEGED")
              ? 'bg-gray-100 cursor-not-allowed' 
              : ''
          }`}
          {...register("domain", {required:"Ce champ est requis"})}
          disabled={
            (userDomain !== "PRIVILEGED" && domainOptions.length === 1) || 
            (isEditMode && userDomain !== "PRIVILEGED" && editData?.domain !== userDomain)
          }
        >
          <option value="">Choisir le département *</option>
          {domainOptions.map((domain, index) => (
            <option value={domain.value} key={index}>
              {domain.label}
              {userDomain !== "PRIVILEGED" && domain.value === userDomain && " (Votre domaine)"}
            </option> 
          ))}
        </select>
        
        {/* Message d'information sur les permissions */}
        {userDomain !== "PRIVILEGED" && domainOptions.length === 1 && (
          <small className="text-xs text-gray-500 mt-1 block">
            Vous ne pouvez créer que pour votre domaine ({domainOptions[0].label})
          </small>
        )}
        
        {errors.domain && <small className='text-xs mt-1 text-red-500'>{errors.domain.message}</small>}
      </div>
      
      {/* Indicateur de domaine utilisateur */}
      <div className="p-2 bg-gray-50 rounded border text-sm">
        <span className="font-medium">Domaine utilisateur : </span>
        <span className={userDomain === "PRIVILEGED" ? "text-purple-600" : "text-blue-600"}>
          {userDomain === "PRIVILEGED" ? "Privilégié (tous domaines)" : userDomain}
        </span>
      </div>
      
      <div className="flex justify-end gap-2 mt-4">
        {isEditMode && (
          <Button 
            type="button"
            onClick={handleCancel}
            variant="outline"
            className="text-sm flex gap-2"
          >
            <XCircle className="h-4 w-4" />
            <span>Annuler</span>
          </Button>
        )}
        
        <Button 
          type="submit"
          disabled={isSubmitting || (isEditMode && userDomain !== "PRIVILEGED" && editData?.domain !== userDomain)}
          className={`${
            (isSubmitting || (isEditMode && userDomain !== "PRIVILEGED" && editData?.domain !== userDomain)) 
              ? 'opacity-50 cursor-not-allowed' 
              : ''
          } text-sm flex gap-2`}
        >
          {isSubmitting ? (
            <>
              <Preloader size={16} />
              <span>{isEditMode ? "Modification..." : "Création..."}</span>
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4" />
              <span>{isEditMode ? "Modifier" : "Créer"}</span>
            </>
          )}
        </Button>
      </div>
    </form>
  )
}

export default InitiateForm;