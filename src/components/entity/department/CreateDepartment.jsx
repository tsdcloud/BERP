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

import mock_data from "../../../helpers/mock_data.json";

import { jwtDecode } from 'jwt-decode';

// Définition du schéma avec Zod
const departmentSchema = z.object({

    name: z.string()
    .nonempty("Ce champs 'Nom' est réquis.")
    .min(2, "le champs doit avoir une valeur de 2 caractères au moins.")
    .max(100)
    // .regex(/^[a-zA-Z ,]+$/, "Ce champ doit être un 'nom' conforme.")
    ,

    entityId: z.string()
    .nonempty('Ce champs "Nom de la ville" est réquis')
    .min(4, "La valeur de ce champs doit contenir au moins 4 caractères.")
    .max(100)
    .regex(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[4][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/, 
      "Ce champs doit être un 'nom de entité' Conforme.")
    ,

    createdBy: z.string().nonempty("Le champ 'createdBy' est requis."),
});

export default function CreateDepartment({setOpen, onSubmit}) {
  const [tokenUser, setTokenUser] = useState();
  const [selectedEntities, setSelectedEntities] = useState([]);
  const [showEntities, setShowEntities] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();


    
    // const navigateToDashboard = useNavigate();
    const { handlePost, handleFetch } = useFetch();
    

    const fetchEntities = async () => {
      // const getEntities = URLS.API_ENTITY;
      const getEntities = `${URLS.ENTITY_API}/entities`;
      try {
          setIsLoading(true);
          const response = await handleFetch(getEntities);
          
              if (response && response?.status === 200) {
                      const results = response?.data;
                      // console.log("results", results);
  
                      const filteredEntities = results?.map(item => {
                      const { createdBy, updateAt, ...rest } = item;
                      return { ...rest };
                  });
                      // console.log("districts - Town",filteredEntities);
                      setShowEntities(filteredEntities);
              }
              else{
                  throw new Error('Erreur lors de la récupération des entités');
              }
      } catch (error) {
          setError(error.message);
      }
      finally {
          setIsLoading(false);
        }
       };

    useEffect(() => {
      fetchEntities();
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
        resolver: zodResolver(departmentSchema),
    });


    const handleSubmitDataFormDepartment = async(data) => {
      // console.log("data form",data);
      // const urlToCreateDepartment = URLS.API_DEPARTMENT;
      const urlToCreateDepartment =  `${URLS.ENTITY_API}/departments`;


        try {
          const response = await handlePost(urlToCreateDepartment, data, true);
          // console.log("response crea", response);
          if (response && response.status === 201) {
            toast.success("departement crée avec succès", { duration : 2000 });
            // console.log("department created", response?.success);
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
          toast.error("Erreur lors de la création du departement", { duration: 5000 });
        }
    };


    return (
      <CustomingModal
        title="Ajouter un nouveau departement"
        buttonText="Créer un departement"
      >
        

          <div className='space-y-0'>
                <p className='text-[12px] mb-2'>Veuillez correctement renseigner les informations du departement.</p>
                <form onSubmit={handleSubmit(handleSubmitDataFormDepartment)} className=''>

                    <div className='mb-1'>
                        <label htmlFor="name" className="block text-xs font-medium mb-0">
                            Nom du departement<sup className='text-red-500'>*</sup>
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
                              <label htmlFor="entityId" className="block text-xs font-medium mb-1">
                                  Nom de l'entité <sup className='text-red-500'>*</sup>
                              </label>

                          
                              <select
                                          onChange={(e) => {
                                              const nameEntitiesSelected = showEntities.find(item => item.id === e.target.value);
                                              setSelectedEntities(nameEntitiesSelected);
                                          }}
                                          {...register('entityId')} 
                                          className={`w-2/3 px-2 py-2 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900
                                          ${
                                              errors.entityId ? "border-red-500" : "border-gray-300"
                                          }`}
                                      >
                                          <option value="">Selectionner une entité</option>
                                              {showEntities.map((item) => (
                                                  <option key={item.id} value={item.id}>
                                                          {item.name}
                                                  </option>
                                              ))}
                              </select>
                              {
                                  errors.entityId && (
                                  <p className="text-red-500 text-[9px] mt-1">{errors?.entityId?.message}</p>
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
                        {isSubmitting ? "Création en cours..." : "Créer un departement"}
                      </Button>

                    </div>
                   
                </form>
                <Toaster/>
          </div>
      </CustomingModal>
    );
}
 // Ajout de la validation des props
 CreateDepartment.propTypes = {
  setOpen: PropTypes.func.isRequired, // Validation de la prop setOpen
};