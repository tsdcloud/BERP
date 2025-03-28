import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import CustomingModal from '../../modals/CustomingModal';
import { Button } from "../../ui/button";
import { useNavigate } from 'react-router-dom';
import { URLS } from '../../../../configUrl';

import PropTypes from 'prop-types';
import { useFetch } from '../../../hooks/useFetch';

import toast, { Toaster } from 'react-hot-toast';




export default function CreateRole({setOpen, onSubmit}) {

  const roleSchema = z.object({
    display_name: z.string()
    .nonempty("Ce champs 'Nom' est réquis.")
    .min(2, "le champs doit avoir une valeur de 5 caractères au moins.")
    .max(100),
    // .regex(/^[a-zA-Z0-9\s]+$/, "Ce champ doit être un 'nom' conforme."),
  
    description: z.string()
    .nonempty("Ce champs 'description' est réquis")
    .min(5, "le champs doit avoir une valeur de 5 caractères au moins.")
    .max(100)
    // .regex(/^[a-zA-Z0-9\s]+$/, "Ce champs doit être un 'description' conforme"),
  });
  
  const { handlePost } = useFetch();
  
      const { register, handleSubmit, reset, formState: { errors, isSubmitting }} = useForm({
          resolver: zodResolver(roleSchema),
      });


  // const handleCancel = (e) =>{
  //   e.preventDefault();
  //   setOpen(false);
  //   console.log("Children modal is false");
  // };

  const handleSubmitDataFormRole = async(data) => {
    // const urlToCreateUser = "http://127.0.0.1:8000/api_gateway/api/user/";
    // const urlToCreateRole = URLS.API_ROLE;
    const urlToCreateRole = `${URLS.USER_API}/roles/`;
      // console.log(data);
      try {
        const response = await handlePost(urlToCreateRole, data, true);
        console.log("response crea", response);
        if (response && response.status === 201) {
          toast.success("Rôle crée avec succès", {duration:2000});
          // console.log("ROLE created", response?.success);
          setOpen(false);
          onSubmit(response.data);
          reset();
          // navigateToDashboard("/");
          // window.location.reload();
          return;
        }
        else {
          toast.error(response.errors.display_name, { duration: 5000});
        }
        
      } catch (error) {
        console.error("Error during creating",error);
        toast.error("Erreur lors de la création du role", { duration: 5000 });
      }
  };
  return (
    <CustomingModal
        title="Ajouter un nouveau rôle"
        buttonText="Créer un rôle"
      >
        

          <div className='space-y-0'>
                <p className='text-[12px] mb-2'>Veuillez correctement renseigner les informations du rôle.</p>
                <form onSubmit={handleSubmit(handleSubmitDataFormRole)} className='sm:bg-blue-200 md:bg-transparent'>

                  <div className='mb-1'>
                      <label htmlFor="display_name" className="block text-xs font-medium mb-0">
                          Nom<sup className='text-red-500'>*</sup>
                      </label>

                      <input 
                        id='display_name'
                        type="text"
                        {...register('display_name')} 
                        className={`w-2/3 px-2 py-2 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900
                        ${
                            errors.display_name ? "border-red-500" : "border-gray-300"
                          }`}
                      />
                      {
                        errors.display_name && (
                          <p className="text-red-500 text-[9px] mt-1">{errors?.display_name?.message}</p>
                        )
                      }
                  </div>

                  <div className='mb-1'>
                        <label htmlFor="description" className="block text-xs font-medium mb-0">
                            Description<sup className='text-red-500'>*</sup>
                        </label>
                        <input 
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

                  <div className='flex justify-end space-x-2 mt-2'>
                    <Button 
                    className="border-2 border-blue-600 outline-blue-700 text-blue-700 text-xs shadow-md bg-transparent hover:bg-primary hover:text-white transition" 
                    type="submit"
                    disabled={isSubmitting}
                   
                    >
                      {isSubmitting ? "Création en cours..." : "Créer un rôle"}
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
 CreateRole.propTypes = {
  setOpen: PropTypes.func.isRequired, // Validation de la prop setOpen
};

