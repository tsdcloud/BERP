import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import CustomingModal from '../../modals/CustomingModal';
import { Button } from "../../ui/button";
import { useNavigate } from 'react-router-dom';
import { URLS } from '../../../../configUrl';
import { useFetch } from '../../../hooks/useFetch';
import { jwtDecode } from 'jwt-decode';
import PropTypes from 'prop-types';
import toast, { Toaster } from 'react-hot-toast';
import { Select } from 'antd';

const asignRolePermSchema = z.object({

    roleId: z.string()
    .nonempty('Ce champs "Nom de employee" est réquis')
    .min(4, "La valeur de ce champs doit contenir au moins 4 caractères.")
    .max(100)
    .regex(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[4][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/, 
      "Ce champs doit être un 'nom de employee' Conforme."),

    // roleId: z.string()
    // .nonempty('Ce champs "Nom du role" est réquis')
    // .min(4, "La valeur de ce champs doit contenir au moins 4 caractères.")
    // .max(100)
    // .regex(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[4][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/, 
    //   "Ce champs doit être un 'nom du role' Conforme."),

    permissionId: z.array(z.string()) // Modification ici pour accepter un tableau de chaînes
    .nonempty('Ce champs "Nom de la permission" est réquis')
    .min(1, "Vous devez sélectionner au moins une permission."),


    createdBy: z.string().nonempty("Le champ 'createdBy' est requis."),

    });


export default function CreateAsignRolePerm({setOpen, onSubmit}) {

    const [showPermission, setShowPermission] = useState([]);
    const [showRole, setShowRole] = useState([]);
    const [selectedRole, setSelectedRole] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(); 
    const [tokenUser, setTokenUser] = useState();
    const [checkedPermissions, setCheckedPermissions] = useState([]);

    const { register, handleSubmit, setValue, reset, formState:{errors, isSubmitting} } = useForm({
        resolver: zodResolver(asignRolePermSchema),
    });

    const {handlePost, handleFetch} = useFetch();

    const handleCheckboxChange = (id) => {
        setCheckedPermissions(prevState => {
          const newCheckedPermissions = prevState.includes(id)
            ? prevState.filter(permissionId => permissionId !== id)
            : [...prevState, id];
    
          // Mettre à jour le champ `permission_id` dans le formulaire
          setValue('permissionId', newCheckedPermissions, { shouldValidate : true });
    
          return newCheckedPermissions;
        });
    };

    const fetchPermission = async () => {
        const urlToShowAllPermission =  `${URLS.ENTITY_API}/permissions`;
       
        try {
            setIsLoading(true);
            const response = await handleFetch(urlToShowAllPermission);
            // console.log("respoShift",response);
            
                if (response && response?.status === 200) {
                    
                        const results = response?.data;
                        const filteredPermission = results?.map(item => {
                            const { createdBy, updateAt, ...rest } = item;
                            return { ...rest };

                        });
                        setShowPermission(filteredPermission);
                }
                else{
                    throw new Error('Erreur lors de la récupération des permission');
                    
                }
        } catch (error) {
            setError(error.message);
        }
        finally {
            setIsLoading(false);
          }
    };

    const fetchRole = async() => {
        const urlToShowAllRole =  `${URLS.ENTITY_API}/roles`;
       
        try {
            setIsLoading(true);
            const response = await handleFetch(urlToShowAllRole);
            // console.log("respoRole",response);
            
                if (response && response?.status === 200) {
                    
                        const results = response?.data;
                        const filteredRole = results?.map(item => {
                            const { createdBy, updateAt, ...rest } = item;
                            return { ...rest };

                        });
                        setShowRole(filteredRole);
                }
                else{
                    throw new Error('Erreur lors de la récupération des Rôles');
                    
                }
        } catch (error) {
            setError(error.message);
        }
        finally {
            setIsLoading(false);
          }
    };

    

    useEffect(()=>{
        fetchPermission();
        fetchRole();
    },[]);

    useEffect(()=>{
        const token = localStorage.getItem("token");
        if(token){
            const decode = jwtDecode(token);
            setTokenUser(decode.user_id);
            // console.log("var", tokenUser);
        }
      }, [tokenUser]);


      const handleSubmitDataFormAsignRolePerm = async(data) => {
        // console.log("data form",data);
        const urlToCreateAsignRolePerm =  `${URLS.ENTITY_API}/permission-roles`;
    
        try {
            const { roleId, permissionId, createdBy } = data;
            let successCount = 0;
            let hasError = false;
    
            for (const permId of permissionId) {
                try {
                    const response = await handlePost(
                        urlToCreateAsignRolePerm, 
                        {roleId, permissionId: permId, createdBy }, 
                        true
                    );
    
                    if (response && response.status === 201) {
                        successCount++;
                    } else {
                        hasError = true;
                        if (Array.isArray(response.errors)) {
                            const errorMessages = response.errors.map(error => error.msg).join(', ');
                            toast.error(errorMessages, { duration: 5000 });
                        } else {
                            toast.error(response.errors.msg, { duration: 5000 });
                        }
                    }
                } catch (error) {
                    hasError = true;
                    console.error("Une erreur est survenue", error);
                    toast.error("Une erreur est survenue lors de la création", { duration: 5000 });
                }
            }
    
            if (successCount === permissionId.length) {
                toast.success("Assignation créée avec succès", { duration: 2000 });
                setOpen(false);
                onSubmit();
                reset();
            } else if (!hasError && successCount > 0) {
                toast.warning(`${successCount} permission(s) sur ${permissionId.length} ont été assignées`, { duration: 3000 });
                setOpen(false);
                onSubmit();
                reset();
            }
        } catch (error) {
            console.error("Error during creating", error);
            toast.error("Erreur lors de la création de l'assignation", { duration: 5000 });
        }
      };

  return (
    <CustomingModal
        title="Ajouter une nouvelle asignation Rôles - Permissions"
        buttonText="Créer une asignation rôles - permissions"
    >

        <div className='space-y-0'>
                <p className='text-[12px] mb-2'>Veuillez correctement renseigner les informations de cette asignation.</p>
                <form onSubmit={handleSubmit(handleSubmitDataFormAsignRolePerm)} className=''>

                    <div className='mb-4'>
                        <label htmlFor="roleId" className="block text-xs font-medium mb-1">
                            Nom du rôle <sup className='text-red-500'>*</sup>
                        </label>

                        <Select
                            showSearch
                            placeholder="Sélectionner un rôle"
                            optionFilterProp="label"
                            onChange={(value) => {
                                const nameRoleSelected = showRole.find(item => item.id === value);
                                setSelectedRole(nameRoleSelected);
                                setValue('roleId', value, { shouldValidate: true });
                            }}
                            options={showRole.map(item => ({
                                value: item.id,
                                label: item.roleName,
                            }))}
                            className={`w-2/3 ${errors.roleId ? "border-red-500" : "border-gray-300"}`}
                        />
                        {errors.roleId && (
                            <p className="text-red-500 text-[9px] mt-1">{errors?.roleId?.message}</p>
                        )}
                </div>

                    <div className='my-3'>
                            <h6 className='text-xs'>Attribuer une ou plusieurs permissions</h6>
                            <div className='flex flex-wrap my-2 overflow-y-auto h-[300px]'>
                                {showPermission.map(item => (
                                    <div key={item?.id} 
                                    className={`flex font-mono items-center ml-2 mb-2 px-2 py-2 border bg-secondary text-white rounded-sm
                                    ${errors.permissionId ? "border-red-500" : "border-gray-300"}`}>
                                    <input
                                      type="checkbox"
                                      id={`checkbox-${item?.id}`}
                                      className='mr-2'
                                      checked={checkedPermissions.includes(item?.id)}
                                      onChange={() => handleCheckboxChange(item?.id)}
                                    />
                                    <label htmlFor={`checkbox-${item?.id}`} className='text-xs '>
                                      {item?.displayName}
                                    </label>
                                  </div>
                                ))}
                            </div>
                            {errors.permissionId && (
                                <p className="text-red-500 text-[9px] mt-1">{errors.permissionId.message}</p>
                            )}
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
                        {isSubmitting ? "Création en cours..." : "Créer une asignation"}
                      </Button>

                    </div>
                   
                </form>
                <Toaster/>
          </div>

    </CustomingModal>
  );
}

 // Ajout de la validation des props
 CreateAsignRolePerm.propTypes = {
    setOpen: PropTypes.func.isRequired, // Validation de la prop setOpen
  };
