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




export default function CreateAsignRoleUser({setOpen, onSubmit}) {

    const [fetchUser, setFetchUser] = useState([]);
    const [fetchRole, setFetchRole] = useState([]);
    const [checkedUser, setCheckedUser] = useState([]);
    const [selectedRole, setSelectedRole] = useState([]);


    const handleCheckboxChange = (id) => {
        setCheckedUser(prevState => {
          const newCheckedUser = prevState.includes(id)
            ? prevState.filter(userId => userId !== id)
            : [...prevState, id];
    
          // Mettre à jour le champ `user_id` dans le formulaire
          setValue('user_id', newCheckedUser, { shouldValidate : true });
    
          return newCheckedUser;
        });
    };


    const { handleFetch, handlePost } = useFetch();



    const showUser = async () => {
        // const urlToGetUser = `${URLS.API_USER}`;
        const urlToGetUser = `${URLS.USER_API}/users/`;
        try {
            const response = await handleFetch(urlToGetUser);
            console.log("response show user", response);

                if (response && response?.data?.results) {
                    const results = response?.data?.results;
                    const filteredUser = results
                    // .filter(item => item.is_active)
                    ?.map(item => {
                    const { is_admin, is_staff, is_superuser, ...rest } = item;
                    return rest;
                    });
                        setFetchUser(filteredUser);
                        console.log("fetchUser", fetchUser);
                
                    }
                else {
                toast.error(response.error || "Erreur lors de la récupération des users", { duration: 2000});
                }
                
        } catch (error) {
            console.error("Error during creating", error);
            toast.error("Erreur lors de la récupération des users", { duration: 2000 });
        }
    };


    const showRole = async () => {
        // const urlToGetRole = `${URLS.API_ROLE}`;
        const urlToGetRole = `${URLS.USER_API}/roles/`;
        try {
            const response = await handleFetch(urlToGetRole);
            console.log("response show role", response);

                if (response && response?.data?.results) {
                        const results = response?.data?.results;
                        const filteredRole = results
                        // ?.filter(item => item.is_active)
                        ?.map(item => {
                        const { role_created_by, role_updated_by, description, ...rest } = item;
                        return rest;
                    });
                        setFetchRole(filteredRole);
                        console.log("fetchRole", fetchRole);
                
                    }
                else {
                toast.error(response.error || "Erreur lors de la récupération des rôles", { duration: 2000});
                }
                
        } catch (error) {
            console.error("Error during creating", error);
            toast.error("Erreur lors de la récupération des rôles", { duration: 2000 });
        }
    };


    useEffect(()=>{
        showUser();
        showRole();
    },[]);

    const asignUserRoleSchema = z.object({
        role_id: z.string()
          .nonempty("Vous devez sélectionner un rôle."),
      
        // description_role: z.string()
        //   .nonempty("Ce champ 'description du rôle' est requis.")
        //   .min(5, "Le champ doit avoir une valeur de 5 caractères au moins.")
        //   .max(100)
        //   .regex(/^[a-zA-Z0-9\sàâäéèêëîïôöùûüçÀÂÄÉÈÊËÎÏÔÖÙÛÜÇ]+$/, "Ce champ doit être une 'description' conforme."),
      
        // description: z.string()
        //   .nonempty("Ce champ 'description' est requis.")
        //   .min(5, "Le champ doit avoir une valeur de 5 caractères au moins.")
        //   .max(100)
        //   .regex(/^[a-zA-Z0-9\sàâäéèêëîïôöùûüçÀÂÄÉÈÊËÎÏÔÖÙÛÜÇ]+$/, "Ce champ doit être une 'description' conforme."),
      
        user_id: z.array(z.string()
            .nonempty("vous devez ajouter"))
          .nonempty("Vous devez sélectionner au moins un utilisateur."),
      });


      const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting }} = useForm({
          resolver: zodResolver(asignUserRoleSchema),
      });


      const getUserName = (id) =>{
        const permName = fetchUser.filter((user)=>(user.id === id))?.[0]?.first_name || ''

        return permName;
      };


      const onSubmitDataFormAsignRoleUser = async (data) => {
        // console.log("Données du formulaire :", data);
        // const urlToCreateAsignRoleUser = URLS.API_ASIGN_ROLE_USER;
        const urlToCreateAsignRoleUser = `${URLS.USER_API}/assign_role_user/`;
        

        try {
            const { role_id, user_id } = data;
            let allSuccess = true;

            const successfullUsers = [];
            const failedUsers = [];
    
            console.log("this is the userId :", [user_id]);
          
            for (const userId of user_id) {
                const userName = getUserName(userId);
              try {
                // Envoyer la requête pour chaque `user_id`
                const response = await handlePost(urlToCreateAsignRoleUser, { role_id, user_id: userId }, true);
          
                if (!response || response.status !== 201) {
                    failedUsers.push(userName);
                    allSuccess = false;
                    // break; // Stop the loop
                  } else {
                    successfullUsers.push(userName);
                }
              } catch (error) {
                toast.error(`Erreur lors de l'assignation a l'utilisateur ${userName}`, { duration: 5000 });
                failedUsers.push(userName);
              }
            }
            
            if (allSuccess) {
                toast.success("Role assigned successfully !", { duration: 2000 });
                onSubmit();
                reset();
                setCheckedUser([]);
                // setTimeout(() => {
                //   window.location.reload();
                // }, 2000);
            } else {
                if (successfullUsers.length > 0) {
                    toast.success(`Le role a été assigné avec succès aux utilisateurs : ${successfullUsers.join(', ')}`, { duration: 2000 });
                    onSubmit();
                    reset();
                    setCheckedUser([]);
                }
                if (failedUsers.length > 0) {
                    if (successfullUsers.length > 0){
                        setTimeout(() => {
                            toast.error(`Les utilisateurs suivants :  ${failedUsers.join(', ')}  ont deja ce role`, { duration: 2000 });
                        }, 2000);
                    } else {
                        toast.error(`Les utilisateurs suivants : ${failedUsers.join(', ')} ont deja ce role`, { duration: 3000 });
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
        title="Ajouter une nouvelle asignation Rôle - Utilisateur"
        buttonText="Faire une asignation Rôle - Utilisateur"
      >

          <div className='space-y-0'>
                <p className='text-[12px] mb-2'>Veuillez correctement renseigner les informations de l'asignation Rôle - Utilisateur.</p>
                <form onSubmit={handleSubmit(onSubmitDataFormAsignRoleUser)} 
                    className='sm:bg-blue-200 md:bg-transparent'>

                        <div className='mb-4'>
                            <label htmlFor="role_id" className="block text-xs font-medium mb-1">
                                Nom du rôle<sup className='text-red-500'>*</sup>
                            </label>

                        
                            <select
                                        // value={fetchRole}
                                        onChange={(e) => {
                                            const roleSelected = fetchRole.find(item => item.id === e.target.value);
                                            setSelectedRole(roleSelected);
                                        }}
                                        {...register('role_id')} 
                                        className={`w-2/3 px-2 py-2 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900
                                        ${
                                            errors.role_id ? "border-red-500" : "border-gray-300"
                                        }`}
                                    >
                                        <option value="">Selectionner un rôle</option>
                                            {fetchRole.map((item) => (
                                                <option key={item.id} value={item.id}>
                                                        {item.display_name}
                                                </option>
                                            ))}
                            </select>
                            {
                                errors.role_id && (
                                <p className="text-red-500 text-[9px] mt-1">{errors?.role_id?.message}</p>
                                )
                            }
                    
                        </div>

                        {/* <div className='mb-4'>
                                <label htmlFor="description_role" className="block text-xs font-medium mb-1">
                                    Description du rôle<sup className='text-red-500'>*</sup>
                                </label>
                                <input 
                                    id='description_role'
                                    type="text"
                                    {...register('description_role')}
                                    className={`w-2/3 px-2 py-2 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900
                                    ${
                                        errors.description_role ? "border-red-500" : "border-gray-300"
                                    }`}
                                />

                                {
                                    errors.description_role && (
                                        <p className="text-red-500 text-[9px] mt-1">{errors.description_role.message}</p>
                                    )
                                }

                        </div> */}
                        
                        <div className='my-3'>
                            <h6 className='text-xs'>Ajouter un ou plusieurs utilisateurs</h6>
                            <div className='flex flex-wrap overflow-y-auto h-60 my-2'>
                                {fetchUser.map(item => (
                                    <div key={item?.id} 
                                    className={`flex font-mono items-center ml-2 mb-2 px-2 py-2 border bg-secondary text-white rounded-sm
                                    ${errors.user_id ? "border-red-500" : "border-gray-300"}`}>
                                    <input
                                      type="checkbox"
                                      id={`checkbox-${item?.id}`}
                                      className='mr-2'
                                      checked={checkedUser.includes(item?.id)}
                                      onChange={() => handleCheckboxChange(item?.id)}
                                    />
                                    <label htmlFor={`checkbox-${item?.id}`} className='text-xs '>
                                      {item?.first_name}
                                    </label>
                                  </div>
                                ))}
                            </div>
                            {errors.user_id && (
                                <p className="text-red-500 text-[9px] mt-1">{errors.user_id.message}</p>
                            )}
                        </div>

                        {/* <div className='mb-4'>
                                <label htmlFor="description" className="block text-xs font-medium mb-1">
                                    Description de la permission<sup className='text-red-500'>*</sup>
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

                        </div> */}

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
 CreateAsignRoleUser.propTypes = {
  setOpen: PropTypes.func.isRequired, // Validation de la prop setOpen
};

