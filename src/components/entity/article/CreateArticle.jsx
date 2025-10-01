// import React, { useState, useEffect } from 'react';
// import { useForm } from 'react-hook-form';
// import { z } from 'zod';
// import { zodResolver } from '@hookform/resolvers/zod';
// import CustomingModal from '../../modals/CustomingModal';
// import { Button } from '../../ui/button';
// import { URLS } from '../../../../configUrl';

// import PropTypes from 'prop-types';
// import { useFetch } from '../../../hooks/useFetch';

// import toast, { Toaster } from 'react-hot-toast';
// import { jwtDecode } from 'jwt-decode';


// export default function CreateTown({setOpen, onSubmit}) {

//     const townSchema = z.object({
//         name: z.string().nonempty("Ce champs 'Nom' est réquis.").max(100),
//         code: z.string().nonempty("Ce champs 'Nom' est réquis.").max(100),
//         idArticleFamily: z.string().nonempty('Ce champs "Nom du district est réquis').max(100),
//         createdBy: z.string().nonempty("Le champ 'createdBy' est requis."),
//     });

//     const [tokenUser, setTokenUser] = useState();
//     const [showArticleFamily, setshowArticleFamily] = useState([]);
//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState();
//     const [selectedFamilyAticles, setSelectedFamilyAticles] = useState([]);

//     const { handlePost, handleFetch } = useFetch();

//     const fetchDistricts = async () => {
//         const getDistrict = `${URLS.ENTITY_API}/districts`;
//         try {
//             setIsLoading(true);
//             const response = await handleFetch(getDistrict);
            
//                 if (response && response?.status === 200) {
//                         const results = response?.data;
//                         // console.log("res", results);

//                         const filteredDistricts = results?.map(item => {
//                         const { updateAt, ...rest } = item;
//                         return rest;
//                     });
//                         // console.log("districts",filteredDistricts);
//                         setshowArticleFamily(filteredDistricts);
//                 }
//                 else{
//                     throw new Error('Erreur lors de la récupération des districts');
//                 }
//         } catch (error) {
//             setError(error.message);
//         }
//         finally {
//             setIsLoading(false);
//         }
//         };

//     useEffect(()=>{
//         fetchDistricts();
//     },[]);

//     useEffect(()=>{
//         const token = localStorage.getItem("token");
//         if(token){
//             const decode = jwtDecode(token);
//             setTokenUser(decode.user_id);
//             // console.log("var", tokenUser);
//         }
//     }, [tokenUser]);
    
//         const { register, handleSubmit, reset, formState: { errors, isSubmitting }} = useForm({
//             resolver: zodResolver(townSchema),
//         });



//     const handleSubmitDataFormTown = async(data) => {
//         const urlToCreateTown = `${URLS.ENTITY_API}/towns`;
//         // console.log(data);
//         try {
//             const response = await handlePost(urlToCreateTown, data, true);
//             // console.log("response crea", response);
//             if (response && response.status === 201) {
//             toast.success("district crée avec succès", { duration:2000 });
//             setOpen(false);
//             onSubmit();
//             reset();

//             }
//             else {
//             if (Array.isArray(response.errors)) {
//                 const errorMessages = response.errors.map(error => error.msg).join(', ');
//                 toast.error(errorMessages, { duration: 5000 });
//             } else {
//                 toast.error(response.errors.msg, { duration: 5000 });
//             }
//             }
            
//         } catch (error) {
//             console.error("Error during creating", error);
//             toast.error("Erreur lors de la création de la ville", { duration: 5000 });
//         }
//     };
//     return (
//         <CustomingModal
//             title="Ajouter une nouvelle ville"
//             buttonText="Créer une ville"
//         >
            

//             <div className='space-y-0'>
//                 <p className='text-[12px] mb-2'>Veuillez correctement renseigner les informations de la ville.</p>
//                 <form onSubmit={handleSubmit(handleSubmitDataFormTown)} className=''>

//                     <div className='mb-1'>
//                         <label htmlFor="name" className="block text-xs font-medium mb-0">
//                             Nom<sup className='text-red-500'>*</sup>
//                         </label>

//                         <input 
//                         id='name'
//                         type="text"
//                         {...register('name')} 
//                         className={`w-2/3 px-2 py-2 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900
//                         ${
//                             errors.name ? "border-red-500" : "border-gray-300"
//                             }`}
//                         />
//                         {
//                         errors.name && (
//                             <p className="text-red-500 text-[9px] mt-1">{errors?.name?.message}</p>
//                         )
//                         }
//                     </div>

//                     <div className='mb-1'>
//                         <label htmlFor="idArticleFamily" className="block text-xs font-medium mb-1">
//                             Nom du district<sup className='text-red-500'>*</sup>
//                         </label>
//                         <select
//                             onChange={(e) => {
//                                 const nameArticleFamily = showArticleFamily.find(item => item.id === e.target.value);
//                                 setSelectedFamilyAticles(nameArticleFamily);
//                                 }}
//                             {...register('idArticleFamily')}
//                             className={`w-2/3 px-2 py-2 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${
//                                 errors.idArticleFamily ? "border-red-500" : "border-gray-300"
//                             }`}
//                         >
//                             <option value="">Selectionner un district pour cette ville</option>
//                             {showArticleFamily.map((item) => (
//                                 <option key={item.id} value={item.id}>
//                                     {item.name}
//                                 </option>
//                             ))}
//                         </select>
//                         {errors.idArticleFamily && (
//                             <p className="text-red-500 text-[9px] mt-1">{errors?.idArticleFamily?.message}</p>
//                         )}
//                     </div>

//                     <div className='mb-1 hidden'>
//                         <label htmlFor="createdBy" className="block text-xs font-medium mb-0">
//                             créer par<sup className='text-red-500'>*</sup>
//                         </label>
//                         <input 
//                             id='createdBy'
//                             type="text"
//                             defaultValue={tokenUser}
//                             {...register('createdBy')}
//                             className={`w-2/3 px-2 py-2 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900
//                             ${
//                                 errors.createdBy ? "border-red-500" : "border-gray-300"
//                             }`}
//                         />

//                         {
//                         errors.createdBy && (
//                             <p className="text-red-500 text-[9px] mt-1">{errors.createdBy.message}</p>
//                         )
//                         }
//                     </div>


//                     <div className='flex justify-end space-x-2 mt-2'>
//                         <Button 
//                         className="border-2 border-blue-600 outline-blue-700 text-blue-700 text-xs shadow-md bg-transparent hover:bg-primary hover:text-white transition" 
//                         type="submit"
//                         disabled={isSubmitting}
                    
//                         >
//                         {isSubmitting ? "Création en cours..." : "Créer une ville"}
//                         </Button>

//                     </div>
//                     </form>
//                     <Toaster/>
//             </div>
//         </CustomingModal>
//     );
// }

//  // Ajout de la validation des props
//  CreateTown.propTypes = {
//   setOpen: PropTypes.func.isRequired, // Validation de la prop setOpen
// };


import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import CustomingModal from '../../modals/CustomingModal';
import { Button } from '../../ui/button';
import { URLS } from '../../../../configUrl';
import AutoComplete from '../../common/AutoComplete';
import { useFetch } from '../../../hooks/useFetch';
import toast from 'react-hot-toast';
import Preloader from "../../Preloader";
import { CheckCircle } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';

// Schéma de validation avec Zod
const articleSchema = z.object({
  name: z.string()
    .nonempty("Le nom de l'article est requis")
    .min(3, "Le nom doit avoir au moins 3 caractères")
    .max(100),
  code: z.string()
    .nonempty("Le code de l'article est requis")
    .min(3, "Le code doit avoir au moins 3 caractères")
    .max(100),
  type: z.string().nonempty("Le type d'article est requis"),
  price: z.number().min(0, "Le prix doit être supérieur ou égal à 0"),
  quantity: z.number().min(0, "La quantité doit être supérieure ou égale à 0"),
  hasTVA: z.boolean().default(false),
  idArticleFamily: z.string().nonempty("La famille d'article est requise"),
  idEntity: z.string().nonempty("L'entité est requise"),
  createdBy: z.string().nonempty("L'utilisateur créateur est requis"),
});

export default function CreateArticle({ setOpen, onSubmit }) {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      hasTVA: false,
      quantity: 0,
      price: 0
    }
  });

  const { handlePost, handleFetch } = useFetch();

  const [entities, setEntities] = useState([]);
  const [articleFamilies, setArticleFamilies] = useState([]);
  const [isLoadingEntities, setIsLoadingEntities] = useState(true);
  const [isLoadingFamilies, setIsLoadingFamilies] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tokenUser, setTokenUser] = useState('');

  // Récupérer l'utilisateur connecté
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decode = jwtDecode(token);
      setTokenUser(decode.user_id);
      setValue('createdBy', decode.user_id);
    }
  }, []);

  // Fetch des entités
  const handleFetchEntities = async (link) => {
    setIsLoadingEntities(true);
    try {
      const response = await handleFetch(link);
      if (response?.status === 200) {
        const formattedData = response.data.map(item => ({
          name: item.name,
          value: item.id
        }));
        setEntities(formattedData);
      }
    } catch (error) {
      console.error(error);
      toast.error("Échec de la récupération des entités");
    } finally {
      setIsLoadingEntities(false);
    }
  };

  const handleSearchEntities = async (searchInput) => {
    try {
      handleFetchEntities(`${URLS.ENTITY_API}/entities?search=${searchInput}`);
    } catch (error) {
      console.error(error);
      toast.error("Échec de la recherche des entités");
    }
  };

  const handleSelectEntity = (item) => {
    if (item) {
      setValue("idEntity", item.value);
    } else {
      setValue("idEntity", null);
    }
  };

  // Fetch des familles d'articles
  const handleFetchArticleFamilies = async (link) => {
    setIsLoadingFamilies(true);
    try {
      const response = await handleFetch(link);
      if (response?.status === 200) {
        const formattedData = response.data.map(item => ({
          name: item.name,
          value: item.id
        }));
        setArticleFamilies(formattedData);
      }
    } catch (error) {
      console.error(error);
      toast.error("Échec de la récupération des familles d'articles");
    } finally {
      setIsLoadingFamilies(false);
    }
  };

  const handleSearchArticleFamilies = async (searchInput) => {
    try {
      handleFetchArticleFamilies(`${URLS.ENTITY_API}/article-families?search=${searchInput}`);
    } catch (error) {
      console.error(error);
      toast.error("Échec de la recherche des familles d'articles");
    }
  };

  const handleSelectArticleFamily = (item) => {
    if (item) {
      setValue("idArticleFamily", item.value);
    } else {
      setValue("idArticleFamily", null);
    }
  };

  // Chargement initial
  useEffect(() => {
    handleFetchEntities(`${URLS.ENTITY_API}/entities`);
    handleFetchArticleFamilies(`${URLS.ENTITY_API}/article-families`);
  }, []);

  // Soumission du formulaire
  const submitForm = async (data) => {
    const url = `${URLS.ENTITY_API}/articles`;
    setIsSubmitting(true);

    try {
      // Convertir les nombres
      const formData = {
        ...data,
        price: parseFloat(data.price),
        quantity: parseFloat(data.quantity),
        hasTVA: Boolean(data.hasTVA)
      };

      const response = await handlePost(url, formData, true);

      if (response && response.status === 201) {
        toast.success("Article créé avec succès", { duration: 2000 });
        setOpen(false);
        onSubmit();
      } else {
        if (response?.errors) {
          if (Array.isArray(response.errors)) {
            const errorMessages = response.errors.map(error => error.msg).join(', ');
            toast.error(errorMessages, { duration: 5000 });
          } else {
            toast.error(response.errors.msg, { duration: 5000 });
          }
        } else {
          toast.error("Erreur lors de la création de l'article", { duration: 5000 });
        }
      }
    } catch (error) {
      console.error("Error during creation", error);
      toast.error("Erreur lors de la création de l'article", { duration: 5000 });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CustomingModal
      title="Ajouter un nouvel article"
      buttonText="Créer un article"
    >
      <div className='space-y-4'>
        <p className='text-[12px] mb-2'>Veuillez correctement renseigner les informations de l'article.</p>
        
        <form onSubmit={handleSubmit(submitForm)} className='flex flex-col space-y-4'>

          {/* Nom de l'article */}
          <div className='flex flex-col'>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Nom de l'article <sup className='text-red-500'>*</sup>
            </label>
            <input 
              id='name'
              type="text"
              {...register('name')}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Entrez le nom de l'article"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Code de l'article */}
          <div className='flex flex-col'>
            <label htmlFor="code" className="block text-sm font-medium mb-1">
              Code de l'article <sup className='text-red-500'>*</sup>
            </label>
            <input 
              id='code'
              type="text"
              {...register('code')}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.code ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Entrez le code de l'article"
            />
            {errors.code && (
              <p className="text-red-500 text-xs mt-1">{errors.code.message}</p>
            )}
          </div>

          {/* Type d'article */}
          <div className='flex flex-col'>
            <label htmlFor="type" className="block text-sm font-medium mb-1">
              Type d'article <sup className='text-red-500'>*</sup>
            </label>
            <select
              {...register('type')}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.type ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Sélectionnez un type</option>
              <option value="PRODUCT">PRODUIT</option>
              <option value="EQUIPEMENT">ÉQUIPEMENT</option>
            </select>
            {errors.type && (
              <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>
            )}
          </div>

          {/* Prix et Quantité */}
          <div className='grid grid-cols-2 gap-4'>
            <div className='flex flex-col'>
              <label htmlFor="price" className="block text-sm font-medium mb-1">
                Prix <sup className='text-red-500'>*</sup>
              </label>
              <input 
                id='price'
                type="number"
                step="0.01"
                {...register('price', { valueAsNumber: true })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.price ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="0.00"
              />
              {errors.price && (
                <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>
              )}
            </div>

            <div className='flex flex-col'>
              <label htmlFor="quantity" className="block text-sm font-medium mb-1">
                Quantité
              </label>
              <input 
                id='quantity'
                type="number"
                step="0.01"
                {...register('quantity', { valueAsNumber: true })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.quantity ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="0"
              />
              {errors.quantity && (
                <p className="text-red-500 text-xs mt-1">{errors.quantity.message}</p>
              )}
            </div>
          </div>

          {/* TVA */}
          <div className='flex items-center'>
            <input 
              id='hasTVA'
              type="checkbox"
              {...register('hasTVA')}
              className="mr-2"
            />
            <label htmlFor="hasTVA" className="text-sm font-medium">
              Soumis à la TVA
            </label>
          </div>

          {/* Sélection de l'entité avec AutoComplete */}
          <div className='flex flex-col'>
            <label htmlFor="idEntity" className="block text-sm font-medium mb-1">
              Entité <sup className='text-red-500'>*</sup>
            </label>
            <AutoComplete
              placeholder="Sélectionnez une entité"
              isLoading={isLoadingEntities}
              dataList={entities}
              onSearch={handleSearchEntities}
              onSelect={handleSelectEntity}
              register={{...register('idEntity', { required: 'Ce champ est requis' })}}
            />
            {errors.idEntity && (
              <p className="text-red-500 text-xs mt-1">{errors.idEntity.message}</p>
            )}
          </div>

          {/* Sélection de la famille d'article avec AutoComplete */}
          <div className='flex flex-col'>
            <label htmlFor="idArticleFamily" className="block text-sm font-medium mb-1">
              Famille d'article <sup className='text-red-500'>*</sup>
            </label>
            <AutoComplete
              placeholder="Sélectionnez une famille d'article"
              isLoading={isLoadingFamilies}
              dataList={articleFamilies}
              onSearch={handleSearchArticleFamilies}
              onSelect={handleSelectArticleFamily}
              register={{...register('idArticleFamily', { required: 'Ce champ est requis' })}}
            />
            {errors.idArticleFamily && (
              <p className="text-red-500 text-xs mt-1">{errors.idArticleFamily.message}</p>
            )}
          </div>

          {/* Champ caché pour createdBy */}
          <input type="hidden" {...register('createdBy')} />

          {/* Boutons */}
          <div className='flex justify-end space-x-2 pt-4'>
            <Button 
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-gray-300 text-gray-700"
            >
              Annuler
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting}
              className={`${
                isSubmitting ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'
              } text-white font-semibold flex items-center space-x-2`}
            >
              {isSubmitting ? <Preloader size={20} /> : <CheckCircle size={16} />}
              <span>{isSubmitting ? "Création en cours..." : "Créer l'article"}</span>
            </Button>
          </div>
        </form>
      </div>
    </CustomingModal>
  );
}