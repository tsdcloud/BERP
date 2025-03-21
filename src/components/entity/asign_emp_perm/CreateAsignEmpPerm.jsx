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

const asignEmpPermSchema = z.object({

    employeeId: z.string()
    .nonempty('Ce champs "Nom de employee" est réquis')
    .min(4, "La valeur de ce champs doit contenir au moins 4 caractères.")
    .max(100)
    .regex(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[4][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/, 
      "Ce champs doit être un 'nom de employee' Conforme."),

    permissionId: z.array(z.string()) // Modification ici pour accepter un tableau de chaînes
    .nonempty('Ce champs "Nom de la permission" est réquis')
    .min(1, "Vous devez sélectionner au moins une permission."),


    createdBy: z.string().nonempty("Le champ 'createdBy' est requis."),

    });


export default function CreateAsignEmpPerm({setOpen, onSubmit}) {

    const [showPermission, setShowPermission] = useState([]);
    const [showEmployee, setShowEmployee] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(); 
    const [tokenUser, setTokenUser] = useState();
    const [checkedPermissions, setCheckedPermissions] = useState([]);

    const { register, handleSubmit, setValue, reset, formState:{errors, isSubmitting} } = useForm({
        resolver: zodResolver(asignEmpPermSchema),
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
        // const urlToShowAllPermission =  `https://entity.bfcgroupsa.com/api/permissions`;
       
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

    const fetchEmployee = async() => {
        const urlToShowAllEmployee =  `${URLS.ENTITY_API}/employees`;
        // const urlToShowAllEmployee =  `https://entity.bfcgroupsa.com/api/employees`;
       
        try {
            setIsLoading(true);
            const response = await handleFetch(urlToShowAllEmployee);
            // console.log("respoRole",response);
            
                if (response && response?.status === 200) {
                        const results = response?.data;
                        const filteredEmployee = results?.map(item => {
                            const { createdBy, updateAt, ...rest } = item;
                            return { ...rest };

                        });
                        setShowEmployee(filteredEmployee);
                }
                else{
                    throw new Error('Erreur lors de la récupération des Employées');
                    
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
        fetchEmployee();
    },[]);

    useEffect(()=>{
        const token = localStorage.getItem("token");
        if(token){
            const decode = jwtDecode(token);
            setTokenUser(decode.user_id);
            // console.log("var", tokenUser);
        }
      }, [tokenUser]);


      const handleSubmitDataFormAsignEmpPerm = async(data) => {
        // console.log("data form",data);
        const urlToCreateAsignEmpPerm =  `${URLS.ENTITY_API}/employee-permissions`;
        // const urlToCreateAsignEmpPerm =  `https://entity.bfcgroupsa.com/api/employee-permissions`;
    
            try {
                    const { employeeId, permissionId, createdBy } = data;
                    for ( const permId of permissionId ) {

                            try {
                                const response = await handlePost(urlToCreateAsignEmpPerm, {employeeId, permissionId: permId, createdBy }, true);
                                // console.log("response crea", response);
                                if (response && response.status === 201) {
                                    //Jai mis cette valeur à la fin de l'instruction car je 
                                    // voulais que le toast s'affiche une fois à la fin de la création
                                    
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
                    toast.error("Erreur lors de la création de l'asignation", { duration: 5000 });
                }
      };

  return (
    <CustomingModal
        title="Ajouter une nouvelle asignation Employées - Permissions"
        buttonText="Créer une asignation Employées - Permissions"
    >

<div className='space-y-0'>
                <p className='text-[12px] mb-2'>Veuillez correctement renseigner les informations de cette asignation.</p>
                <form onSubmit={handleSubmit(handleSubmitDataFormAsignEmpPerm)} className=''>

                    <div className='mb-4'>
                              <label htmlFor="employeeId" className="block text-xs font-medium mb-1">
                                  Nom de l'employée <sup className='text-red-500'>*</sup>
                              </label>

                          
                              <select
                                          onChange={(e) => {
                                              const nameEmployeeSelected = showEmployee.find(item => item.id === e.target.value);
                                              setSelectedEmployee(nameEmployeeSelected);
                                          }}
                                          {...register('employeeId')} 
                                          className={`w-2/3 px-2 py-2 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900
                                          ${
                                              errors.employeeId ? "border-red-500" : "border-gray-300"
                                          }`}
                                      >
                                          <option value="">Selectionner un employée</option>
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
                            <h6 className='text-xs'>Attribuer une ou plusieurs permissions</h6>
                            <div className='flex flex-wrap my-2 overflow-y-auto h-[300px]'>
                                {
                                    showPermission.map(item => (
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
                                    ))
                                }
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
 CreateAsignEmpPerm.propTypes = {
    setOpen: PropTypes.func.isRequired, // Validation de la prop setOpen
  };
