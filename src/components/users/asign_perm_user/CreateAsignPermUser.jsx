import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import CustomingModal from '../../modals/CustomingModal';
import { Button } from "../../ui/button";
import { useNavigate } from 'react-router-dom';
import { URLS } from '../../../../configUrl';
import { useFetch } from '../../../hooks/useFetch';

import PropTypes from 'prop-types';

import toast, { Toaster } from 'react-hot-toast';




export default function CreateAsignPermUser({setOpen, onSubmit}) {
    const [fetchPermission, setFetchPermission] = useState([]);
    const [fetchUser, setFetchUser] = useState([]);
    const [checkedPermissions, setCheckedPermissions] = useState([]);
    const [selectedUser, setSelectedUser] = useState([]);

    const handleCheckboxChange = (id) => {
        setCheckedPermissions(prevState => {
          const newCheckedPermissions = prevState.includes(id)
            ? prevState.filter(permissionId => permissionId !== id)
            : [...prevState, id];
    
          // Mettre à jour le champ `permission_id` dans le formulaire
          setValue('permission_id', newCheckedPermissions, { shouldValidate : true });
    
          return newCheckedPermissions;
        });
    };


    const { handleFetch, handlePost } = useFetch();



    const showPermission = async () => {
        const urlToGetPermission = `${URLS.API_PERMISSION}`;
        try {
            const response = await handleFetch(urlToGetPermission);
            console.log("response show permission", response);

<<<<<<< HEAD
                if (response && response?.data?.results) {
                    const filteredPermission = response?.data?.results.map(item => {
=======
                if (response && response.results) {
                    const filteredPermission = response.results
                    // .filter(item => item.is_active)
                    .map(item => {
>>>>>>> 31873a823b069693726b6474af191cfc684d13f1
                    const { perm_created_by, perm_updated_by, description, ...rest } = item;
                    return rest;
                    });
                        setFetchPermission(filteredPermission);
                        console.log("fetchPermission", fetchPermission);
                
                    }
                else {
                toast.error(response.error || "Erreur lors de la récupération des permissions", { duration: 2000});
                }
                
        } catch (error) {
            console.error("Error during creating", error);
            toast.error("Erreur lors de la récupération des permissions", { duration: 2000 });
        }
    };
    const showUser = async () => {
        const urlToGetUser = `${URLS.API_USER}`;
        try {
            const response = await handleFetch(urlToGetUser);
            console.log("response show user", response);

                if (response && response?.data?.results) {
                        const results = response?.data?.results;
                        const filteredUsers = results?.map(item => {
                        const { user_created_by, user_updated_by, is_staff, is_superuser, ...rest } = item;
                        return rest;
                    });
                        setFetchUser(filteredUsers);
                        console.log("fetchUser", fetchUser);
                
                    }
                else {
                toast.error(response.error || "Erreur lors de la récupération des users", { duration: 2000});
                }
                
        } catch (error) {
            console.error("Error during creating", error);
<<<<<<< HEAD
            toast.error("Erreur lors de la récupération des users", { duration: 2000 });
=======
            toast.error("Erreur lors de la récupération des users", { duration: 5000 });
>>>>>>> 31873a823b069693726b6474af191cfc684d13f1
        }
    };


    useEffect(()=>{
        showPermission();
        showUser();
    },[]);

    const asignPermUserSchema = z.object({
        user_id: z.string()
          .nonempty("Vous devez sélectionner un nom."),
      
        // description_user: z.string()
        //   .nonempty("Ce champ 'description du rôle' est requis.")
        //   .min(5, "Le champ doit avoir une valeur de 5 caractères au moins.")
        //   .max(100)
        //   .regex(/^[a-zA-Z0-9\sàâäéèêëîïôöùûüçÀÂÄÉÈÊËÎÏÔÖÙÛÜÇ]+$/, "Ce champ doit être une 'description' conforme."),
      
        // description: z.string()
        //   .nonempty("Ce champ 'description' est requis.")
        //   .min(5, "Le champ doit avoir une valeur de 5 caractères au moins.")
        //   .max(100)
        //   .regex(/^[a-zA-Z0-9\sàâäéèêëîïôöùûüçÀÂÄÉÈÊËÎÏÔÖÙÛÜÇ]+$/, "Ce champ doit être une 'description' conforme."),
      
        permission_id: z.array(z.string()
            .nonempty("vous devez ajouter"))
          .nonempty("Vous devez sélectionner au moins une permission."),
      });


      const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting }} = useForm({
          resolver: zodResolver(asignPermUserSchema),
      });


      const getPermName = (id) =>{
        const permName = fetchPermission.filter((perm)=>(perm.id === id))?.[0]?.display_name || ''

        return permName
      }

      const onSubmitDataFormAsignPermUser = async (data) => {
        // console.log("Données du formulaire :", data);
        const urlToCreateAsignPermUser = URLS.API_ASIGN_PERM_USER;
      
        try {
          const { user_id, permission_id } = data;
          let allSuccess = true;

          const successfulPermissions = [];
          const failedPermissions = [];
  
          console.log("this is the permissions :", [permission_id])
        
          for (const permId of permission_id) {

            const permName = getPermName(permId)

            try {
              // Envoyer la requête pour chaque `permission_id`
              const response = await handlePost(urlToCreateAsignPermUser, { user_id, permission_id: permId }, true);
        
              if (!response || response.status !== 201) {
                // toast.error(`${response.errors.non_field_errors}`, { duration: 3000 });
                failedPermissions.push(permName)
                allSuccess = false;
                // break; // Stop the loop
              } else {
                successfulPermissions.push(permName);
            }
            } catch (error) {
              toast.error(`Erreur pour permission ${permName}`, { duration: 5000 });
              failedPermissions.push(permName);
              // break; // Stop the loop
            }
          }

          if (allSuccess) {
            toast.success("Permissions assigned successfully !", { duration: 2000 });
            onSubmit();
            reset();
            setCheckedPermissions([])
            // setTimeout(() => {
            //   window.location.reload();
            // }, 2000);
          } else {
              if (successfulPermissions.length > 0) {
                toast.success(`Les permissions suivantes ont été assignées avec succès : ${successfulPermissions.join(', ')}`, { duration: 2000 });
                onSubmit();
                reset();
                setCheckedPermissions([])
              }
              if (failedPermissions.length > 0) {
                if (successfulPermissions.length > 0){
                    setTimeout(() => {
                        toast.error(`Les permissions suivantes sont deja assignées a l'application : ${failedPermissions.join(', ')}`, { duration: 2000 });
                    }, 2000);
                } else {
                    toast.error(`Les permissions suivantes sont deja assignées a l'application : ${failedPermissions.join(', ')}`, { duration: 3000 });
                }
              }
          }
  
        } catch (globalError) {
          // Gestion des erreurs globales
          console.error("Erreur globale:", globalError.message);
          toast.error("Une erreur inattendue s'est produite", { duration: 5000 });
        }
      };



  return (
    <CustomingModal
        title="Ajouter une nouvelle asignation permission - utilisateur"
        buttonText="Faire une asignation permission - utilisateur"
      >

          <div className='space-y-0'>
                <p className='text-[12px] mb-2'>Veuillez correctement renseigner les informations de l'asignation permission - utilisateur.</p>
                <form onSubmit={handleSubmit(onSubmitDataFormAsignPermUser)} 
                    className='sm:bg-blue-200 md:bg-transparent'>

                        <div className='mb-4'>
                            <label htmlFor="user_id" className="block text-xs font-medium mb-1">
                                Nom de l'utilisateur<sup className='text-red-500'>*</sup>
                            </label>

                        
                            <select
                                        // value={fetchUser}
                                        onChange={(e) => {
                                            const userSelected = fetchUser.find(item => item.id === e.target.value);
                                            setSelectedUser(userSelected);
                                        }}
                                        {...register('user_id')} 
                                        className={`w-2/3 px-2 py-2 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900
                                        ${
                                            errors.user_id ? "border-red-500" : "border-gray-300"
                                        }`}
                                    >
                                        <option value="">Selectionner un utilisateur</option>
                                            {fetchUser.map((item) => (
                                                <option key={item.id} value={item.id}>
                                                        {item.first_name}
                                                </option>
                                            ))}
                            </select>
                            {
                                errors.user_id && (
                                <p className="text-red-500 text-[9px] mt-1">{errors?.user_id?.message}</p>
                                )
                            }
                    
                        </div>
<<<<<<< HEAD
=======

                        {/* <div className='mb-4'>
                                <label htmlFor="description_user" className="block text-xs font-medium mb-1">
                                    Description du rôle<sup className='text-red-500'>*</sup>
                                </label>
                                <input 
                                    id='description_user'
                                    type="text"
                                    {...register('description_user')}
                                    className={`w-2/3 px-2 py-2 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900
                                    ${
                                        errors.description_user ? "border-red-500" : "border-gray-300"
                                    }`}
                                />

                                {
                                    errors.description_user && (
                                        <p className="text-red-500 text-[9px] mt-1">{errors.description_user.message}</p>
                                    )
                                }

                        </div> */}
>>>>>>> 31873a823b069693726b6474af191cfc684d13f1
                        
                        <div className='my-3'>
                            <h6 className='text-xs'>Attribuer une ou plusieurs permissions</h6> 
                            <div className='flex flex-wrap my-2 overflow-y-auto h-60'>
                                {fetchPermission.map(item => (
                                    <div key={item?.id} 
                                    className={`flex font-mono items-center ml-2 mb-2 px-2 py-2 border bg-secondary text-white rounded-sm
                                    ${errors.permission_id ? "border-red-500" : "border-gray-300"}`}>
                                    <input
                                      type="checkbox"
                                      id={`checkbox-${item?.id}`}
                                      className='mr-2'
                                      checked={checkedPermissions.includes(item?.id)}
                                      onChange={() => handleCheckboxChange(item?.id)}
                                    />
                                    <label htmlFor={`checkbox-${item?.id}`} className='text-xs '>
                                      {item?.display_name}
                                    </label>
                                  </div>
                                ))}
                            </div>
                            {errors.permission_id && (
                                <p className="text-red-500 text-[9px] mt-1">{errors.permission_id.message}</p>
                            )}
                        </div>

                        <div className='flex justify-end space-x-2 mt-2'>
                            <Button 
                              className="border-2 border-blue-600 outline-blue-700 text-blue-700 text-xs shadow-md bg-transparent hover:bg-primary hover:text-white transition" 
                                type="submit"
                                disabled={isSubmitting}
                             >
                                {isSubmitting ? "Validation en cours..." : "Valider cette asignation"}
                            </Button>
                        </div>

                </form>
                <Toaster/>
          </div>

      </CustomingModal>
  );
}

 // Ajout de la validation des props
 CreateAsignPermUser.propTypes = {
  setOpen: PropTypes.func.isRequired, // Validation de la prop setOpen
};

