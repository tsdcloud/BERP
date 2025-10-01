import {useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import CustomingModal from '../../modals/CustomingModal'; 
import { Button } from '../../ui/button';
import { URLS } from '../../../../configUrl';  

import PropTypes from 'prop-types';
import { useFetch } from '../../../hooks/useFetch'; 

import toast, { Toaster } from 'react-hot-toast';

import { jwtDecode } from 'jwt-decode';

// Définition du schéma avec Zod
const articleFamilySchema = z.object({

    name: z.string()
    .nonempty("Ce champs 'Nom' est réquis.")
    // .min(2, "le champs doit avoir une valeur de 2 caractères au moins.")
    .max(100)
    // .regex(/^[a-zA-Z0-9 ,]+$/, "Ce champ doit être un 'nom' conforme.")
    ,
    code: z.string().nonempty("Ce champs 'Nom' est réquis.").max(256),
    description: z.string().optional(),

    createdBy: z.string().nonempty("Le champ 'createdBy' est requis."),
});

export default function CreateArticleFamily({setOpen, onSubmit}) {

  const [tokenUser, setTokenUser] = useState();
    
    const { handlePost } = useFetch();
    

    useEffect(()=>{
      const token = localStorage.getItem("token");
      if(token){
          const decode = jwtDecode(token);
          setTokenUser(decode.user_id);
          // console.log("var", tokenUser);
      }
    }, [tokenUser]);


    const { register, handleSubmit, reset,  formState: { errors, isSubmitting }} = useForm({
        resolver: zodResolver(articleFamilySchema),
    });


    const handleSubmitDataFormArticleFamily = async (data) => {
      const urlToCreateArticleFamily =  `${URLS.ENTITY_API}/article-families`;
      console.log(data);
      const cleanedData = {
        ...data,
        // description: data.description === '' ? null : data.description
        };
        if (cleanedData.description === '') {
          delete cleanedData.description;
        }
      try {
        const response = await handlePost(urlToCreateArticleFamily, cleanedData, true);
        // console.log("response crea", response);
        if (response && response.status === 201) {
          toast.success("Famille Article crée avec succès", { duration:2000 });
          setOpen(false);
          onSubmit();
          reset();

        }
        else {
          if (Array.isArray(response.errors)) {
            const errorMessages = response.errors.map(error => error.msg).join(', ');
            toast.error(errorMessages, { duration: 5000 });
          } else {
            toast.error(response.errors.msg, { duration: 5000 });
          }
        }
        
      } catch (error) {
        console.error("Error during creating", error);
        toast.error("Erreur lors de la création du Famille Article", { duration: 5000 });
      }
    };


    return (
      <CustomingModal
        title="Ajouter un nouveau Famille Article"
        buttonText="Créer une Famille Article"
      >
        

            <div className='space-y-0'>
                <p className='text-[12px] mb-2'>Veuillez correctement renseigner les informations du Famille Article.</p>
                <form onSubmit={handleSubmit(handleSubmitDataFormArticleFamily)} className=''>

                    <div className='mb-1'>
                        <label htmlFor="name" className="block text-xs font-medium mb-0">
                            Nom du Famille Article <sup className='text-red-500'>*</sup>
                        </label>

                        <input 
                            id='name'
                            type="text"
                            {...register('name')} 
                            className={`w-2/3 px-2 py-2 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900
                            ${
                                errors.name ? "border-red-500" : "border-gray-300"
                            }`}
                        />
                        {
                            errors.name && (
                            <p className="text-red-500 text-[9px] mt-1">{errors.name.message}</p>
                            )
                        }
                    </div>
                    <div className='mb-1'>
                        <label htmlFor="code" className="block text-xs font-medium mb-0">
                            Code Famille Article <sup className='text-red-500'>*</sup>
                        </label>

                        <input 
                            id='code'
                            type="text"
                            {...register('code')} 
                            className={`w-2/3 px-2 py-2 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900
                            ${
                                errors.code ? "border-red-500" : "border-gray-300"
                            }`}
                        />
                        {
                            errors.code && (
                            <p className="text-red-500 text-[9px] mt-1">{errors.code.message}</p>
                            )
                        }
                    </div>

                    <div className='mb-1'>
                      <label htmlFor="description" className="block text-xs font-medium mb-0">
                        Description
                      </label>
                      <textarea 
                        id='description'
                        rows={3}
                        {...register('description')} 
                        className={`w-2/3 px-2 py-2 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900
                        ${errors.description ? "border-red-500" : "border-gray-300"}`}
                      />
                      {errors.description && <p className="text-red-500 text-[9px] mt-1">{errors.description.message}</p>}
                    </div>

                    <div className='mb-1 hidden'>
                        <label htmlFor="createdBy" className="block text-xs font-medium mb-0">
                            créer par<sup className='text-red-500'>*</sup>
                        </label>
                              <input 
                                  id='createdBy'
                                  type="text"
                                  defaultValue={tokenUser}
                                  {...register('createdBy')}
                                  className={`w-2/3 px-2 py-2 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900
                                    ${
                                      errors.createdBy ? "border-red-500" : "border-gray-300"
                                    }`}
                              />

                              {
                                errors.createdBy && (
                                  <p className="text-red-500 text-[9px] mt-1">{errors.createdBy.message}</p>
                                )
                              }
                  </div>

                  <div className='flex justify-end space-x-2 mt-2'>
                    <Button 
                    className="border-2 border-blue-600 outline-blue-700 text-blue-700 text-xs shadow-md bg-transparent hover:bg-primary hover:text-white transition" 
                    type="submit"
                    disabled={isSubmitting}
                    >
                        {isSubmitting ? "Création en cours..." : "Créer une Famille Article"}
                    </Button>

                  </div>
                </form>
                <Toaster/>
          </div>
      </CustomingModal>
    );
}
 // Ajout de la validation des props
 CreateArticleFamily.propTypes = {
  setOpen: PropTypes.func.isRequired, // Validation de la prop setOpen
};