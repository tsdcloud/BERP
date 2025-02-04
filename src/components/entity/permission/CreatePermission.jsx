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




export default function CreatePermission({setOpen, onSubmit}) {

  const permissionSchema = z.object({
    displayName: z.string()
    .nonempty("Ce champs 'Nom' est réquis.")
    .min(5, "le champs doit avoir une valeur de 5 caractères au moins.")
    .max(100)
    .regex(/^[a-zA-Z0-9\s]+$/, "Ce champ doit être un 'nom' conforme."),

    permissionName: z.string()
    .nonempty("Ce champs 'Nom' est réquis.")
    .min(5, "le champs doit avoir une valeur de 5 caractères au moins.")
    .max(100)
    .regex(/^[a-zA-Z0-9]+(_[a-zA-Z0-9]+)*$/, "Ce champ doit être un 'permissionName' conforme."),
  
    description: z.string()
    .nonempty("Ce champs 'description' est réquis")
    .min(5, "le champs doit avoir une valeur de 5 caractères au moins.")
    .max(100)
    .regex(/^[a-zA-Z0-9\s]+$/, "Ce champs doit être un 'description' conforme"),

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
          resolver: zodResolver(permissionSchema),
      });



  const handleSubmitDataFormPermission = async(data) => {
    const urlToCreatePermission = URLS.API_PERMISSION_ENTITY;
      console.log(data);
      try {
        const response = await handlePost(urlToCreatePermission, data, true);
        console.log("response crea", response);
        if (response && response.status === 201) {
          toast.success("permission crée avec succès", { duration:2000 });
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
        toast.error("Erreur lors de la création de la permission", { duration: 5000 });
      }
  };
  return (
    <CustomingModal
        title="Ajouter une nouvelle permission"
        buttonText="Créer une permission"
      >
        

          <div className='space-y-0'>
                <p className='text-[12px] mb-2'>Veuillez correctement renseigner les informations de la permission.</p>
                <form onSubmit={handleSubmit(handleSubmitDataFormPermission)} className=''>

                  <div className='mb-1'>
                      <label htmlFor="displayName" className="block text-xs font-medium mb-0">
                          Nom<sup className='text-red-500'>*</sup>
                      </label>

                      <input 
                        id='displayName'
                        type="text"
                        {...register('displayName')} 
                        className={`w-2/3 px-2 py-2 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900
                        ${
                            errors.displayName ? "border-red-500" : "border-gray-300"
                          }`}
                      />
                      {
                        errors.displayName && (
                          <p className="text-red-500 text-[9px] mt-1">{errors?.displayName?.message}</p>
                        )
                      }
                  </div>
                  <div className='mb-1'>
                      <label htmlFor="permissionName" className="block text-xs font-medium mb-0">
                          Nom attribué<sup className='text-red-500'>*</sup>
                      </label>

                      <input 
                        id='permissionName'
                        type="text"
                        {...register('permissionName')} 
                        className={`w-2/3 px-2 py-2 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900
                        ${
                            errors.permissionName ? "border-red-500" : "border-gray-300"
                          }`}
                      />
                      {
                        errors.permissionName && (
                          <p className="text-red-500 text-[9px] mt-1">{errors?.permissionName?.message}</p>
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
                      {isSubmitting ? "Création en cours..." : "Créer une permission"}
                    </Button>

                  </div>
                </form>
                <Toaster/>
          </div>
      </CustomingModal>
  );
}

 // Ajout de la validation des props
 CreatePermission.propTypes = {
  setOpen: PropTypes.func.isRequired, // Validation de la prop setOpen
};

