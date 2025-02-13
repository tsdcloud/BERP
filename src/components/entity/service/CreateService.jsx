import {useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import CustomingModal from '../../modals/CustomingModal'; 
import { Button } from '../../ui/button';
import { useNavigate } from 'react-router-dom';
import { URLS } from '../../../../configUrl'; 

import PropTypes from 'prop-types';
import { useFetch } from '../../../hooks/useFetch'; 

import toast, { Toaster } from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';

// Définition du schéma avec Zod
const serviceSchema = z.object({

    name: z.string()
    .nonempty("Ce champs 'Nom' est réquis.")
    .min(2, "le champs doit avoir une valeur de 2 caractères au moins.")
    .max(100)
    .regex(/^[a-zA-Z ,]+$/, "Ce champ doit être un 'nom' conforme."),

    departmentId: z.string()
    .nonempty('Ce champs "Nom du departement" est réquis')
    .min(4, "La valeur de ce champs doit contenir au moins 4 caractères.")
    .max(100)
    .regex(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[4][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/, 
      "Ce champs doit être un 'nom du département' Conforme.")
    ,

    createdBy: z.string().nonempty("Le champ 'createdBy' est requis."),
});

export default function CreateService({setOpen, onSubmit}) {

  const [showDepartments, setShowDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState([]);
  const [tokenUser, setTokenUser] = useState();
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
    
    // const navigateToDashboard = useNavigate();
    const { handlePost, handleFetch } = useFetch();
    

    const fetchDepartment = async () => {
      // const urlToShowAllDepartments = URLS.API_DEPARTMENT;
      const urlToShowAllDepartments =  `${URLS.ENTITY_API}/departments`;
      try {
        setIsLoading(true);
        const response = await handleFetch(urlToShowAllDepartments);
        
            if (response && response?.status === 200) {
                    const results = response?.data;
                    // console.log("results", results);

                    const filteredDepartments = results?.map(item => {
                    const { createdBy, updateAt, ...rest } = item;
                    return { ...rest };
                });
                    // console.log("districts - Town",filteredEntities);
                    setShowDepartments(filteredDepartments);
            }
            else{
                throw new Error('Erreur lors de la récupération des départements');
            }
    } catch (error) {
        setError(error.message);
    }
    finally {
        setIsLoading(false);
      }
  };

    useEffect(() => {
        fetchDepartment();
    }, []);

    useEffect(()=>{
      const token = localStorage.getItem("token");
      if(token){
          const decode = jwtDecode(token);
          setTokenUser(decode.user_id);
          // console.log("var", tokenUser);
      }
    }, [tokenUser]);


    const { register, handleSubmit, reset, formState: { errors, isSubmitting }} = useForm({
        resolver: zodResolver(serviceSchema),
    });


    const handleSubmitDataFormService = async(data) => {
      // console.log("data form",data);
      // const urlToCreateService = URLS.API_SERVICE;
      const urlToCreateService =  `${URLS.ENTITY_API}/services`;

        try {
          const response = await handlePost(urlToCreateService, data, true);
          // console.log("response crea", response);
          if (response && response.status === 201) {
            toast.success("service crée avec succès", { duration : 2000 });
            // console.log("service created", response?.success);
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
          console.error("Error during creating",error);
          toast.error("Erreur lors de la création du service", { duration: 5000 });
        }
    };


    return (
      <CustomingModal
        title="Ajouter un nouveau service"
        buttonText="Créer un service"
      >
        

          <div className='space-y-0'>
                <p className='text-[12px] mb-2'>Veuillez correctement renseigner les informations du service.</p>
                <form onSubmit={handleSubmit(handleSubmitDataFormService)} className='sm:bg-blue-200 md:bg-transparent'>

                  <div className='mb-1'>
                      <label htmlFor="name" className="block text-xs font-medium mb-0">
                          Nom du service<sup className='text-red-500'>*</sup>
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
                          <p className="text-red-500 text-[9px] mt-1">{errors.name.message}</p>
                        )
                      }
                  </div>

                  <div className='mb-4'>
                            <label htmlFor="departmentId" className="block text-xs font-medium mb-1">
                                Nom du département<sup className='text-red-500'>*</sup>
                            </label>

                        
                            <select
                                        // value={showDepartment}
                                        onChange={(e) => {
                                            const nameDepartmentSelected = showDepartments.find(item => item.id === e.target.value);
                                            setSelectedDepartment(nameDepartmentSelected);
                                        }}
                                        {...register('departmentId')} 
                                        className={`w-2/3 px-2 py-2 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900
                                        ${
                                            errors.departmentId ? "border-red-500" : "border-gray-300"
                                        }`}
                                    >
                                        <option value="">Selectionner un departement</option>
                                            {showDepartments.map((item) => (
                                                <option key={item.id} value={item.id}>
                                                        {item.name}
                                                </option>
                                            ))}
                            </select>
                            {
                                errors.departmentId && (
                                <p className="text-red-500 text-[9px] mt-1">{errors?.departmentId?.message}</p>
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
                      {isSubmitting ? "Création en cours..." : "Créer un service"}
                    </Button>

                  </div>
                </form>
                <Toaster/>
          </div>
      </CustomingModal>
    );
}
 // Ajout de la validation des props
 CreateService.propTypes = {
  setOpen: PropTypes.func.isRequired, // Validation de la prop setOpen
};