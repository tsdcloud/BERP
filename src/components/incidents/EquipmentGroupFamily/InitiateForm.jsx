// // export default InitiateForm
// import React, {useEffect, useState} from 'react'
// import {useForm} from 'react-hook-form';
// import { useFetch } from '../../../hooks/useFetch';
// import { Button } from '../../ui/button';
// import { URLS } from '../../../../configUrl';
// import AutoComplete from '../../common/AutoComplete';
// import toast from 'react-hot-toast';
// import Preloader from "../../Preloader";
// import { CheckCircle, XCircle } from 'lucide-react';
// import { EQUIPMENT_DOMAIN } from '../../../utils/constant.utils';

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
//     }
//   }, [editData, setValue]);

//   const submitForm = async (data) => {
//     setIsSubmitting(true);
    
//     try {
//       let response;
      
//       if (isEditMode && editData) {
//         // Mode édition - PATCH request
//         let url = `${URLS.INCIDENT_API}/equipment-group-families/${editData.id}`;
//         response = await handlePatch(url, data, true);
        
//         if (response.error) {
//           response?.errors.forEach(error => {
//             toast.error(error?.msg);
//           });
//           return;
//         }
//         toast.success("Modifié avec succès");
//       } else {
//         // Mode création - POST request
//         let url = `${URLS.INCIDENT_API}/equipment-group-families`;
//         response = await handlePost(url, data, true);
        
//         if (response.error) {
//           response?.errors.forEach(error => {
//             toast.error(error?.msg);
//           });
//           return;
//         }
//         toast.success("Créé avec succès");
//       }
      
//       reset(); // Réinitialise le formulaire
//       onSucess();
//       if (onCancelEdit) onCancelEdit();
      
//     } catch (error) {
//       console.log(error);
//       // toast.error("Une erreur est survenue, vérifiez votre connexion ou contactez un IT");
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
//     <form onSubmit={handleSubmit(submitForm)} className='space-y-2'>
//         <div className='flex flex-col mx-4 space-y-2'>
//           <label htmlFor="" className='text-sm font-semibold'>Nom du domaine :</label>
//           <input 
//             {...register("name", {required:"Ce champs est requis"})} 
//             className={`${errors.name ? 'outline-red-500 ring-red-500' : 'outline-none'} p-2 border text-sm rounded-lg`} 
//             placeholder="Entrer le nom du domaine"
//           />
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
//         <div className='flex justify-end gap-2'>
//           {isEditMode && (
//             <Button 
//               type="button"
//               onClick={handleCancel}
//               className="bg-gray-500 hover:bg-gray-600 text-white font-semibold my-2 py-1 text-sm flex gap-2"
//             >
//               <XCircle className="h-4 w-4" />
//               <span>Annuler</span>
//             </Button>
//           )}
//           <Button 
//             type="submit"
//             disabled={isSubmitting} 
//             className={`${isSubmitting ? 'bg-blue-300' :'bg-primary hover:bg-secondary'} text-white font-semibold my-2 py-1 text-sm flex gap-2`}
//           >
//             {isSubmitting ? (
//               <Preloader size={20}/>
//             ) : (
//               <CheckCircle className="h-4 w-4" />
//             )}
//             <span>
//               {isSubmitting 
//                 ? (isEditMode ? "Modification en cours..." : "Création en cours...") 
//                 : (isEditMode ? "Modifier" : "Créer")
//               }
//             </span>
//           </Button>
//         </div>
//     </form>
//   )
// }

// export default InitiateForm

// export default InitiateForm
import React, {useEffect, useState} from 'react'
import {useForm} from 'react-hook-form';
import { useFetch } from '../../../hooks/useFetch';
import { Button } from '../../ui/button';
import { URLS } from '../../../../configUrl';
import AutoComplete from '../../common/AutoComplete';
import toast from 'react-hot-toast';
import Preloader from "../../Preloader";
import { CheckCircle, XCircle } from 'lucide-react';
import { EQUIPMENT_DOMAIN } from '../../../utils/constant.utils';

const InitiateForm = ({onSucess, editData, onCancelEdit, userDomain}) => {
  
  const { register, handleSubmit, formState:{errors}, reset, setValue, watch } = useForm();
  const { handlePost, handlePatch } = useFetch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [filteredDomains, setFilteredDomains] = useState(EQUIPMENT_DOMAIN);

  // Remplir le formulaire avec les données d'édition
  useEffect(() => {
    if (editData) {
      setIsEditMode(true);
      setValue("name", editData.name);
      setValue("domain", editData.domain);
    } else {
      setIsEditMode(false);
      reset(); // S'assurer que le formulaire est réinitialisé
    }
  }, [editData, setValue, reset]);

  // Filtrer les domaines disponibles selon l'utilisateur
  useEffect(() => {
    if (userDomain) {
      // Si l'utilisateur est privilégié, il voit tous les domaines
      if (userDomain === "PRIVILEGED") {
        setFilteredDomains(EQUIPMENT_DOMAIN);
      } else {
        // Sinon, il ne voit que son propre domaine
        const userDomainValue = userDomain.toLowerCase();
        const availableDomains = EQUIPMENT_DOMAIN.filter(domain => 
          domain.value.toLowerCase() === userDomainValue
        );
        
        // Si aucun domaine ne correspond exactement, utiliser tous les domaines
        setFilteredDomains(availableDomains.length > 0 ? availableDomains : EQUIPMENT_DOMAIN);
      }
    } else {
      setFilteredDomains(EQUIPMENT_DOMAIN);
    }
    
    // Si en mode création (pas d'édition), pré-remplir avec le domaine utilisateur
    if (!editData && userDomain && userDomain !== "PRIVILEGED") {
      const userDomainValue = userDomain.toUpperCase();
      const matchingDomain = EQUIPMENT_DOMAIN.find(d => d.value === userDomainValue);
      if (matchingDomain) {
        setValue("domain", matchingDomain.value);
      }
    }
  }, [userDomain, editData, setValue]);

  const submitForm = async (data) => {
    setIsSubmitting(true);
    
    try {
      let response;
      
      if (isEditMode && editData) {
        // Mode édition - PATCH request
        let url = `${URLS.INCIDENT_API}/equipment-group-families/${editData.id}`;
        response = await handlePatch(url, data, true);
        
        if (response?.error) {
          response?.errors?.forEach(error => {
            toast.error(error?.msg || "Erreur lors de la modification");
          });
          return;
        }
        toast.success("Modifié avec succès");
      } else {
        // Mode création - POST request
        let url = `${URLS.INCIDENT_API}/equipment-group-families`;
        response = await handlePost(url, data, true);
        
        if (response?.error) {
          response?.errors?.forEach(error => {
            toast.error(error?.msg || "Erreur lors de la création");
          });
          return;
        }
        toast.success("Créé avec succès");
      }
      
      reset(); // Réinitialise le formulaire
      onSucess();
      if (onCancelEdit) onCancelEdit();
      
    } catch (error) {
      console.error("Erreur formulaire:", error);
      toast.error("Une erreur est survenue, vérifiez votre connexion ou contactez un IT");
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

  // Vérifier si le champ domaine est désactivé (en lecture seule)
  const isDomainDisabled = () => {
    // En mode édition, on peut changer de domaine si privilégié
    if (isEditMode) {
      return userDomain !== "PRIVILEGED";
    }
    // En mode création, si non privilégié, le domaine est présélectionné
    return userDomain && userDomain !== "PRIVILEGED";
  };

  return (
    <form onSubmit={handleSubmit(submitForm)} className='space-y-4'>
        <div className='flex flex-col space-y-2'>
          <label htmlFor="name" className='text-sm font-semibold'>
            Nom de la famille :
          </label>
          <input 
            id="name"
            {...register("name", {
              required: "Ce champ est requis",
              minLength: {
                value: 2,
                message: "Le nom doit contenir au moins 2 caractères"
              }
            })} 
            className={`p-2 border text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.name ? 'border-red-500 ring-red-500' : 'border-gray-300'
            }`} 
            placeholder="Entrer le nom de la famille"
            disabled={isSubmitting}
          />
          {errors.name && (
            <small className='text-xs text-red-500'>{errors.name.message}</small>
          )}
        </div>
        
        <div className='flex flex-col space-y-2'>
          <label htmlFor="domain" className='text-sm font-semibold'>
            Département tutélaire <span className='text-red-500'>*</span>
          </label>
          <select 
            id="domain" 
            className={`w-full border p-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.domain ? 'border-red-500 ring-red-500' : 'border-gray-300'
            } ${isDomainDisabled() ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`} 
            {...register("domain", {
              required: "Ce champ est requis",
              validate: value => value !== "" || "Veuillez choisir un département"
            })}
            disabled={isSubmitting || isDomainDisabled()}
          >
            <option value="">Choisir le département *</option>
            {filteredDomains.map((domain, index) => (
              <option value={domain.value} key={index}>
                {domain.label}
              </option> 
            ))}
          </select>
          
          {/* Info sur le domaine si lecture seule */}
          {isDomainDisabled() && userDomain && userDomain !== "PRIVILEGED" && (
            <small className='text-xs text-blue-600'>
              Le département est automatiquement défini sur votre domaine ({userDomain})
            </small>
          )}
          
          {errors.domain && !isDomainDisabled() && (
            <small className='text-xs text-red-500'>{errors.domain.message}</small>
          )}
        </div>
        
        <div className='flex justify-end gap-2 pt-2'>
          {isEditMode && (
            <Button 
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 text-sm flex gap-2 items-center"
            >
              <XCircle className="h-4 w-4" />
              <span>Annuler</span>
            </Button>
          )}
          <Button 
            type="submit"
            disabled={isSubmitting} 
            className={`${
              isSubmitting 
                ? 'bg-blue-300 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white font-semibold py-2 px-4 text-sm flex gap-2 items-center`}
          >
            {isSubmitting ? (
              <Preloader size={20}/>
            ) : (
              <CheckCircle className="h-4 w-4" />
            )}
            <span>
              {isSubmitting 
                ? (isEditMode ? "Modification..." : "Création...") 
                : (isEditMode ? "Modifier la famille" : "Créer la famille")
              }
            </span>
          </Button>
        </div>
    </form>
  )
}

export default InitiateForm