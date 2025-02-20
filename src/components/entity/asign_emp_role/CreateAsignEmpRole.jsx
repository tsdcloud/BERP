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

const asignEmpRoleSchema = z.object({

    employeeId: z.string()
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

    roleId: z.array(z.string()) // Modification ici pour accepter un tableau de chaînes
    .nonempty('Ce champs "Nom du role" est réquis')
    .min(1, "Vous devez sélectionner au moins un rôle."),


    createdBy: z.string().nonempty("Le champ 'createdBy' est requis."),

    });


export default function CreateAsignEmpRole({setOpen, onSubmit}) {

    const [showEmployee, setShowEmployee] = useState([]);
    const [showRole, setShowRole] = useState([]);
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(); 
    const [tokenUser, setTokenUser] = useState();
    const [checkedRoles, setCheckedRoles] = useState([]);

    const { register, handleSubmit, setValue, reset, formState:{errors, isSubmitting} } = useForm({
        resolver: zodResolver(asignEmpRoleSchema),
    });

    const {handlePost, handleFetch} = useFetch();

    const handleCheckboxChange = (id) => {
        setCheckedRoles(prevState => {
          const newCheckedRoles = prevState.includes(id)
            ? prevState.filter(roleId => roleId !== id)
            : [...prevState, id];
    
          // Mettre à jour le champ `permission_id` dans le formulaire
          setValue('roleId', newCheckedRoles, { shouldValidate : true });
    
          return newCheckedRoles;
        });
    };

    const fetchEmployee = async () => {
        const urlToShowAllEmployee =  `${URLS.ENTITY_API}/employees`;
       
        try {
            setIsLoading(true);
            const response = await handleFetch(urlToShowAllEmployee);
            // console.log("respoShift",response);
            
                if (response && response?.status === 200) {
                    
                        const results = response?.data;
                        const filteredEmployee = results?.map(item => {
                            const { createdBy, updateAt, ...rest } = item;
                            return { ...rest };

                        });
                        setShowEmployee(filteredEmployee);
                }
                else{
                    throw new Error('Erreur lors de la récupération des employees');
                    
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
        fetchEmployee();
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


      const handleSubmitDataFormAsignEmpRole = async(data) => {
        // console.log("data form",data);
        // const urlToCreateAsignEmpRole = URLS.API_DEPARTMENT;
        const urlToCreateAsignEmpRole =  `${URLS.ENTITY_API}/employee-roles`;
        
    
    try {
              const { employeeId, roleId, createdBy } = data;
             for( const rolId of roleId) {

                    try {
                        const response = await handlePost(urlToCreateAsignEmpRole, {employeeId, roleId: rolId, createdBy }, true);
                        // console.log("response crea", response);
                        if (response && response.status === 201) {
                            // toast.success("Asignation crée avec succès", { duration : 2000 });
                            // // console.log("department created", response?.success);
                            // setOpen(false);
                            // onSubmit();
                            // reset();
                
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
                        console.error("Une erreur est survenue", error);
                    } 
              }

              toast.success("Asignation crée avec succès", { duration : 2000 });
              setOpen(false);
              onSubmit();
              reset();
            
          } catch (error) {
            console.error("Error during creating",error);
            toast.error("Erreur lors de la création du departement", { duration: 5000 });
          }
      };

  return (
    <CustomingModal
        title="Ajouter une nouvelle asignation Employées - Rôles"
        buttonText="Créer une asignation employées - rôles"
    >

<div className='space-y-0'>
                <p className='text-[12px] mb-2'>Veuillez correctement renseigner les informations de cette asignation.</p>
                <form onSubmit={handleSubmit(handleSubmitDataFormAsignEmpRole)} className=''>

                    <div className='mb-4'>
                              <label htmlFor="employeeId" className="block text-xs font-medium mb-1">
                                  Nom de l'employé(e) <sup className='text-red-500'>*</sup>
                              </label>

                          
                              <select
                                          onChange={(e) => {
                                              const nameEmployeeSelected = showEmployee.find(item => item.id === e.target.value);
                                              setSelectedEmployees(nameEmployeeSelected);
                                          }}
                                          {...register('employeeId')} 
                                          className={`w-2/3 px-2 py-2 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900
                                          ${
                                              errors.employeeId ? "border-red-500" : "border-gray-300"
                                          }`}
                                      >
                                          <option value="">Selectionner un employé(e)</option>
                                              {showEmployee.map((item) => (
                                                  <option key={item.id} value={item.id}>
                                                          {item.name}
                                                  </option>
                                              ))}
                              </select>
                              {
                                  errors.employeeId && (
                                  <p className="text-red-500 text-[9px] mt-1">{errors?.employeeId?.message}</p>
                                  )
                              }
                      
                    </div>

                    <div className='my-3'>
                            <h6 className='text-xs'>Attribuer un ou plusieurs rôles</h6>
                            <div className='flex flex-wrap my-2 overflow-y-auto h-15'>
                                {showRole.map(item => (
                                    <div key={item?.id} 
                                    className={`flex font-mono items-center ml-2 mb-2 px-2 py-2 border bg-secondary text-white rounded-sm
                                    ${errors.roleId ? "border-red-500" : "border-gray-300"}`}>
                                    <input
                                      type="checkbox"
                                      id={`checkbox-${item?.id}`}
                                      className='mr-2'
                                      checked={checkedRoles.includes(item?.id)}
                                      onChange={() => handleCheckboxChange(item?.id)}
                                    />
                                    <label htmlFor={`checkbox-${item?.id}`} className='text-xs '>
                                      {item?.roleName}
                                    </label>
                                  </div>
                                ))}
                            </div>
                            {errors.roleId && (
                                <p className="text-red-500 text-[9px] mt-1">{errors.roleId.message}</p>
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
 CreateAsignEmpRole.propTypes = {
    setOpen: PropTypes.func.isRequired, // Validation de la prop setOpen
  };
