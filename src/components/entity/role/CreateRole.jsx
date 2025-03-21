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
const roleSchema = z.object({

    roleName: z.string()
    .nonempty("Ce champs 'Nom' est réquis.")
    .min(2, "le champs doit avoir une valeur de 2 caractères au moins.")
    .max(100)
    // .regex(/^[a-zA-Z0-9 ,]+$/, "Ce champ doit être un 'nom' conforme.")
    ,

    displayName: z.string()
    .nonempty("Ce champs 'Nom' est réquis.")
    .min(2, "le champs doit avoir une valeur de 2 caractères au moins.")
    .max(100)
    // .regex(/^[a-zA-Z0-9 ',]+$/, "Ce champ doit être une 'description' conforme.")
    ,

    createdBy: z.string().nonempty("Le champ 'createdBy' est requis."),
});

export default function CreateRole({setOpen, onSubmit}) {

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
        resolver: zodResolver(roleSchema),
    });


    const handleSubmitDataFormRole = async (data) => {
      console.log(data);
      // const urlToCreateRole = URLS.API_ROLE_ENTITY;
      const urlToCreateRole = `${URLS.ENTITY_API}/roles`;
      try {
        const response = await handlePost(urlToCreateRole, data, true);
        // console.log("response crea", response);
        if (response && response.status === 201) {
          toast.success("rôle crée avec succès", { duration:2000 });
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
        toast.error("Erreur lors de la création du rôle", { duration: 5000 });
      }
    };


    return (
      <CustomingModal
        title="Ajouter un nouveau rôle"
        buttonText="Créer un rôle"
      >
        

          <div className='space-y-0'>
                <p className='text-[12px] mb-2'>Veuillez correctement renseigner les informations du rôle.</p>
                <form onSubmit={handleSubmit(handleSubmitDataFormRole)} className=''>

                  <div className='mb-1'>
                      <label htmlFor="name" className="block text-xs font-medium mb-0">
                          Nom du rôle <sup className='text-red-500'>*</sup>
                      </label>

                      <input 
                        id='roleName'
                        type="text"
                        {...register('roleName')} 
                        className={`w-2/3 px-2 py-2 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900
                        ${
                            errors.roleName ? "border-red-500" : "border-gray-300"
                          }`}
                      />
                      {
                        errors.roleName && (
                          <p className="text-red-500 text-[9px] mt-1">{errors.roleName.message}</p>
                        )
                      }
                  </div>

                  <div className='mb-1 mt-2'>
                      <label htmlFor="displayName" className="block text-xs font-medium mb-0">
                          Description <sup className='text-red-500'>*</sup>
                      </label>

                      <textarea 
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
                          <p className="text-red-500 text-[9px] mt-1">{errors.displayName.message}</p>
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
                      {isSubmitting ? "Création en cours..." : "Créer un rôle"}
                    </Button>

                  </div>
                </form>
                <Toaster/>
          </div>
      </CustomingModal>
    );
}
 // Ajout de la validation des props
 CreateRole.propTypes = {
  setOpen: PropTypes.func.isRequired, // Validation de la prop setOpen
};