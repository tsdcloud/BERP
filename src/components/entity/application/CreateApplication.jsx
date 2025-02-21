import React, { useState, useEffect } from 'react';
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




export default function CreateApplication({setOpen, onSubmit}) {

  const applicationSchema = z.object({
    name: z.string()
    .nonempty("Ce champs 'Nom' est réquis.")
    // .min(5, "le champs doit avoir une valeur de 5 caractères au moins.")
    .max(100)
    // .regex(/^[a-zA-Z0-9\s]+$/, "Ce champ doit être un 'nom' conforme.")
    ,
  
    description: z.string()
    .nonempty("Ce champs 'description' est réquis")
    // .min(5, "le champs doit avoir une valeur de 5 caractères au moins.")
    .max(100)
    // .regex(/^[a-zA-Z0-9\s]+$/, "Ce champs doit être un 'description' conforme")
    ,

    url: z.string()
    .nonempty("Ce champs 'URL' est réquis")
    .regex(/^https?:\/\/[^\s$.?#].[^\s]*$/, "L'URL doit commencer par 'http://' ou 'https://' et être valide"),

    createdBy: z.string().nonempty("Le champ 'createdBy' est requis."),
  });
  
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
  
      const { register, handleSubmit, reset, formState: { errors, isSubmitting }} = useForm({
          resolver: zodResolver(applicationSchema),
      });



  const handleSubmitDataFormApplication = async(data) => {
    // const urlToCreateApplication = URLS.API_APPLICATION_ENTITY;
    const urlToCreateApplication =  `${URLS.ENTITY_API}/applications`;
      // console.log(data);
      try {
        const response = await handlePost(urlToCreateApplication, data, true);
        // console.log("response crea", response);
        if (response && response.status === 201) {
          toast.success("Application crée avec succès", { duration:2000 });
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
        toast.error("Erreur lors de la création de la APPLICATION", { duration: 5000 });
      }
  };
  return (
    <CustomingModal
        title="Ajouter une nouvelle application"
        buttonText="Créer une application"
      >
        

          <div className='space-y-0'>
                <p className='text-[12px] mb-2'>Veuillez correctement renseigner les informations de l'application.</p>
                <form onSubmit={handleSubmit(handleSubmitDataFormApplication)} className='sm:bg-blue-200 md:bg-transparent'>

                  <div className='mb-1'>
                      <label htmlFor="name" className="block text-xs font-medium mb-0">
                          Nom<sup className='text-red-500'>*</sup>
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
                          <p className="text-red-500 text-[9px] mt-1">{errors?.name?.message}</p>
                        )
                      }
                  </div>

                  <div className='mb-1'>
                        <label htmlFor="description" className="block text-xs font-medium mb-0">
                            Description<sup className='text-red-500'>*</sup>
                        </label>
                        <textarea 
                            id='description'
                            type="text"
                            {...register('description')}
                            className={`w-2/3 px-2 py-2 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900
                              ${
                                errors.description ? "border-red-500" : "border-gray-300"
                              }`}
                        />

                        {
                          errors.description && (
                            <p className="text-red-500 text-[9px] mt-1">{errors.description.message}</p>
                          )
                        }

                  </div>
                  <div className='mb-1'>
                        <label htmlFor="url" className="block text-xs font-medium mb-0">
                            Lien <sup className='text-red-500'>*</sup>
                        </label>
                        <input 
                            id='url'
                            type="text"
                            {...register('url')}
                            className={`w-2/3 px-2 py-2 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900
                              ${
                                errors.url ? "border-red-500" : "border-gray-300"
                              }`}
                        />

                        {
                          errors.url && (
                            <p className="text-red-500 text-[9px] mt-1">{errors.url.message}</p>
                          )
                        }

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
                      {isSubmitting ? "Création en cours..." : "Créer une application"}
                    </Button>
                    {/* <Button 
                    className="border-2 border-gray-600 outline-gray-700 text-gray-700 text-xs shadow-md bg-transparent hover:bg-gray-600 hover:text-white transition" 
                    onClick={ setOpen() }
                    >
                      Annuler
                    </Button> */}

                  </div>
                </form>
                <Toaster/>
          </div>
      </CustomingModal>
  );
}

 // Ajout de la validation des props
 CreateApplication.propTypes = {
  setOpen: PropTypes.func.isRequired, // Validation de la prop setOpen
};

