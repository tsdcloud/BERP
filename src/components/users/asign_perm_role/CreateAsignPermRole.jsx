import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import CustomingModal from '../../modals/CustomingModal';
import { Button } from "../../ui/button";
import { useNavigate } from 'react-router-dom';
import { URLS } from '../../../../configUrl';
import { useFetch } from '../../../hooks/useFetch';

import { AutoComplete, Select, Tag } from 'antd';
// import 'antd/dist/reset.css';


import PropTypes from 'prop-types';

import toast, { Toaster } from 'react-hot-toast';




export default function CreateAsignPermRole({setOpen, onSubmit}) {
    const [fetchPermission, setFetchPermission] = useState([]);
    const [fetchRole, setFetchRole] = useState([]);
    const [checkedPermissions, setCheckedPermissions] = useState([]);

    const [selectedRole, setSelectedRole] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectedPerm, setSelectedPerm] = useState([]);

    const tagRender = (props) => {
        const { label, value, onClose } = props;
        return (
          <Tag
            color="white"
            closable
            onClose={onClose}
            style={{ marginRight: 3 , backgroundColor: "#22c55e"}}
          >
            {label}
          </Tag>
        );
    };

    const handleSearch = (searchText) => {
        setSelectedRole(
          searchText
            ? fetchRole
                .filter((item) => item.display_name.toLowerCase().includes(searchText.toLowerCase()))
                .map((item) => ({ value: item.display_name}))
            : []
        );
      };
    
      // Fonction pour gérer la sélection d'un item
      const handleSelect = (value) => {
        console.log('Selected:', value);
        const roleSelected = fetchRole.find((item) => item.display_name === value);
        
        console.log("Selected Role id:", roleSelected?.id);

        // Mettre à jour le champ `permission_id` dans le formulaire
        setValue('role_id', roleSelected?.id, { shouldValidate : true });
    
      };
    
      // Fonction pour gérer le select multiple avec recherche
      const handleMultiSearch = (searchText) => {
        const filteredOptions = fetchPermission.filter((item) =>
          item.display_name.toLowerCase().includes(searchText.toLowerCase())
        );
        setSelectedItems(filteredOptions.map((item) => ({ label: item.display_name, value: item.id })));
      };
    
      // Fonction pour gérer la sélection multiple
      const handleMultiSelect = (values) => {
        setSelectedPerm(values);

        console.log(values);

        // Mettre à jour le champ `permission_id` dans le formulaire
        setValue('permission_id', values, { shouldValidate : true });
        
      };

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

                if (response && response?.data?.results) {
                    const filteredPermission = response?.data?.results.map(item => {
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
    const showRole = async () => {
        const urlToGetRole = `${URLS.API_ROLE}`;
        try {
            const response = await handleFetch(urlToGetRole);
            console.log("response show role", response);

                if (response && response?.data?.results) {
                        const results = response?.data?.results;
                        const filteredRole = results?.map(item => {
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
        showPermission();
        showRole();
    },[]);

    const asignPermRoleSchema = z.object({
        role_id: z.string()
          .nonempty("Vous devez sélectionner un rôle."),
      
        permission_id: z.array(z.string()
            .nonempty("vous devez ajouter"))
          .nonempty("Vous devez sélectionner au moins une permission."),
      });


      const { register, handleSubmit, setValue, formState: { errors, isSubmitting }} = useForm({
          resolver: zodResolver(asignPermRoleSchema),
      });




      const onSubmitDataFormAsignPermRole = async (data) => {
        // console.log("Données du formulaire :", data);
        const urlToCreateAsignPermRole = URLS.API_GRANT_PERMISSIONS_ROLE;
      
    //     try {
    //       const { role_id, permission_id } = data;
    //     //   console.log("Role ID:", role_id, "Permission IDs:", permission_id);
    //     //   console.log(" checked Permission IDs:", checkedPermissions);
      
    //       for (const permId of permission_id) {
    //         // console.log(`Envoi de la requête pour permission_id: ${permId}`);
    //         const response = await handlePost(urlToCreateAsignPermRole, { role_id, permission_id: permId }, true);
    //         if (response && response.status === 201) {
    //           toast.success("Assignation créée avec succès", { duration: 2000 });
    //         } else {
    //           toast.error(response.error || "Erreur lors de la création de l'assignation", { duration: 5000 });
    //         }
    //       }
      
    //     //   setOpen(false);
    //       onSubmit();
    //       if(errors){
    //           window.location.reload();
    //       }
    //     } catch (error) {
    //       console.error("Erreur lors de la création", error);
    //       toast.error("Erreur lors de la création de l'assignation", { duration: 5000 });
    //     }
    //   };

    

    try {
        const { role_id, permission_id } = data;
        let allSuccess = true;

        console.log("this is the permissions :", [permission_id])
      
        // for (const permId of permission_id) {
        //   try {
        //     // Envoyer la requête pour chaque `permission_id`
        //     const response = await handlePost(urlToCreateAsignPermRole, { role_id, permission_id: permId }, true);
      
        //     if (!response || response.status !== 201) {
        //       toast.error(`${response.errors.non_field_errors}`, { duration: 3000 });
        //       allSuccess = false;
        //       break; // Stop the loop
        //     }
        //   } catch (error) {
        //     toast.error(`Erreur pour permission ID ${permId}: ${error.message}`, { duration: 5000 });
        //     allSuccess = false;
        //     break; // Stop the loop
        //   }
        // }

        try {
            // Envoyer la requête pour chaque `permission_id`
            const response = await handlePost(urlToCreateAsignPermRole, { role_id, permission_ids: permission_id }, true);
      
            if (response.success) {
              toast.success( "assigntion fais avec succès" , { duration: 2000 });

              setTimeout(() => {
                window.location.reload(); 
              }, 2000);

            }else{
                toast.error(response.errors.non_field_errors, { duration: 3000 });
            }
          } catch (error) {
            toast.error(`Erreur d'assignation`, { duration: 3000 });
          }

      } catch (globalError) {
        // Gestion des erreurs globales
        console.error("Erreur globale:", globalError.message);
        toast.error("Une erreur inattendue s'est produite", { duration: 5000 });
      }
    }
      



  return (
    <CustomingModal
        title="Ajouter une nouvelle asignation permission - rôle"
        buttonText="Faire une asignation permission - rôle"
      >

          <div className='space-y-0'>
                <p className='text-[12px] mb-2'>Veuillez correctement renseigner les informations de l'asignation permission - rôle.</p>
                <form onSubmit={handleSubmit(onSubmitDataFormAsignPermRole)} 
                    className='sm:bg-blue-200 md:bg-transparent'>

                        {/* <div className='mb-4'>
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
                    
                        </div> */}
                        
                        {/* <div className='my-3'>
                            <h6 className='text-xs'>Attribuer une ou plusieurs permissions</h6>
                            <div className='flex flex-wrap  my-2 overflow-y-auto h-60'>
                                {fetchPermission.map(item => (
                                    <div key={item?.id} 
                                    className={`flex font-mono items-center ml-2  mb-2 px-2 py-2 border bg-secondary text-white rounded-sm
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
                        </div> */}

                         {/* Autocomplete simple */}
                         <div className='mb-4 '>
                            <AutoComplete
                                style={{ width: '100%', height: '40px' }}
                                options={selectedRole}
                                onSearch={handleSearch}
                                onSelect={handleSelect}
                                onChange={handleSelect}
                                showSearch
                                placeholder="Rechercher un rôle"
                                className={`${errors.role_id ? "border-red-500 border-2" : "border-blue-300 border-2"} rounded-md`}
                            />
                            {errors.role_id && (
                                <p className="text-red-500 text-[9px] mt-1">{errors.role_id.message}</p>
                            )}
                         </div>

                        {/* Select multiple avec autocomplete */}
                        <div>
                            <Select
                                mode="multiple"
                                allowClear
                                style={{ width: '100%' }}
                                placeholder="Recherchez et sélectionnez des technologies"
                                onSearch={handleMultiSearch}
                                // onSelect={handleMultiSelect}
                                onChange={handleMultiSelect}
                                options={selectedItems}
                                value={selectedPerm}
                                tagRender={tagRender}
                                className={`${errors.permission_id ? "border-red-500 border-2" : "border-blue-300 border-2"} rounded-md`}
                            />
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
 CreateAsignPermRole.propTypes = {
  setOpen: PropTypes.func.isRequired, // Validation de la prop setOpen
};

