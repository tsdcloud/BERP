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

// Définition du schéma avec Zod
const departmentSchema = z.object({

    department_name: z.string()
    .nonempty("Ce champs 'Nom' est réquis.")
    .min(2, "le champs doit avoir une valeur de 2 caractères au moins.")
    .max(100)
    .regex(/^[a-zA-Z ,]+$/, "Ce champ doit être un 'nom' conforme."),

    localisation: z.string()
    .nonempty("Ce champs 'Localisation' est réquis")
    .min(4, "le champs doit avoir une valeur de 4 caractères au moins.")
    .max(100)
    .regex(/^[a-zA-Z ,]+$/, "Ce champs doit être une 'localisation' conforme"),

    // phone: z.string()
    // .nonempty("Ce champs 'Téléphone' est réquis.")
    // .length(9, "La valeur de ce champs doit contenir 9 caractères.")
    // .regex(/^[0-9]+$/)
    // ,

    id_entity: z.string()
    .nonempty('Ce champs "Nom de la ville" est réquis')
    .min(4, "La valeur de ce champs doit contenir au moins 4 caractères.")
    .max(100)
    .regex(/^[a-zA-Z0-9_.]+$/, "Ce champs doit être un 'nom de la ville' Conforme.")
    ,

    // email: z.string()
    // .nonempty("Ce champs 'Email' est réquis.")
    // .email("Adresse mail invalide")
    // .max(255)
    // ,


    // password: z.string()
    // .nonempty("Ce champs 'Mot de passe' est réquis.")
    // .regex(/(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[@]).{8,}/, 
    //   "Le mot de passe saisie doit avoir au moins une lettre majuscule, une minuscule, un caractère spécial (@), un chiffre et doit contenir au moins 8 caractères."),
});

export default function CreateDepartment({setOpen, onSubmit}) {


  const [selectedEntity, setSelectedEntity] = useState([]);
  const [fetchEntity, setFetchEntity] = useState([]);
    
    // const navigateToDashboard = useNavigate();
    const { handlePost, handleFetch } = useFetch();
    

    const showEntity = async () => {

      setFetchEntity(mock_data);

        // const urlToCreateDepartment = "";
        // try {
        //     const response = await handleFetch(urlToCreateDepartment);
        //     // console.log("response crea", response);
        //     if (response && response?.success) {
        //       toast.success("departement crée avec succès", {duration:2000});
        //       console.log("entity created", response?.success);
  
        //     }
        //     else {
        //       toast.error(response.error, { duration: 5000});
        //     }
            
        //   } catch (error) {
        //     console.error("Error during creating",error);
        //     toast.error("Erreur lors de la récupération des villes", { duration: 5000 });
        //   }
    };

    useEffect(() => {
        showEntity();
    }, []);


    const { register, handleSubmit, formState: { errors, isSubmitting }} = useForm({
        resolver: zodResolver(departmentSchema),
    });


    const handleSubmitDataFormDepartment = async(data) => {
      console.log(data);
      // const urlToCreateDepartment = "http://127.0.0.1:8000/api_gateway/api/user/";
      // const urlToCreateDepartment = URLS.API_USER;
      //   // console.log(data);
      //   try {
      //     const response = await handlePost(urlToCreateDepartment, data, true);
      //     // console.log("response crea", response);
      //     if (response && response?.success && response.status === 201) {
      //       toast.success("departement crée avec succès", {duration:2000});
      //       console.log("entity created", response?.success);
      //       setOpen(false);
      //       onSubmit();

      //     }
      //     else {
      //       toast.error(response.error, { duration: 5000});
      //     }
          
      //   } catch (error) {
      //     console.error("Error during creating",error);
      //     toast.error("Erreur lors de la création de l'departement", { duration: 5000 });
      //   }
    };


    return (
      <CustomingModal
        title="Ajouter un nouveau departement"
        buttonText="Créer un departement"
      >
        

          <div className='space-y-0'>
                <p className='text-[12px] mb-2'>Veuillez correctement renseigner les informations du departement.</p>
                <form onSubmit={handleSubmit(handleSubmitDataFormDepartment)} className='sm:bg-blue-200 md:bg-transparent'>

                  <div className='mb-1'>
                      <label htmlFor="department_name" className="block text-xs font-medium mb-0">
                          Nom du departement<sup className='text-red-500'>*</sup>
                      </label>

                      <input 
                        id='department_name'
                        type="text"
                        {...register('department_name')} 
                        className={`w-2/3 px-2 py-2 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900
                        ${
                            errors.department_name ? "border-red-500" : "border-gray-300"
                          }`}
                      />
                      {
                        errors.department_name && (
                          <p className="text-red-500 text-[9px] mt-1">{errors.department_name.message}</p>
                        )
                      }
                  </div>

                  <div className='mb-1'>
                        <label htmlFor="localisation" className="block text-xs font-medium mb-0">
                            Localisation du departement<sup className='text-red-500'>*</sup>
                        </label>
                        <input 
                            id='localisation'
                            type="text"
                            {...register('localisation')}
                            className={`w-2/3 px-2 py-2 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900
                              ${
                                errors.localisation ? "border-red-500" : "border-gray-300"
                              }`}
                        />

                        {
                          errors.localisation && (
                            <p className="text-red-500 text-[9px] mt-1">{errors.localisation.message}</p>
                          )
                        }

                  </div>

                  <div className='mb-4'>
                            <label htmlFor="id_entity" className="block text-xs font-medium mb-1">
                                Nom de l'entité<sup className='text-red-500'>*</sup>
                            </label>

                        
                            <select
                                        // value={showEntity}
                                        onChange={(e) => {
                                            const nameEntitySelected = fetchEntity.find(item => item.id === e.target.value);
                                            setSelectedEntity(nameEntitySelected);
                                        }}
                                        {...register('id_entity')} 
                                        className={`w-2/3 px-2 py-2 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900
                                        ${
                                            errors.id_entity ? "border-red-500" : "border-gray-300"
                                        }`}
                                    >
                                        <option value="">Selectionner une ville</option>
                                            {fetchEntity.map((item) => (
                                                <option key={item.id} value={item.id}>
                                                        {item.name}
                                                </option>
                                            ))}
                            </select>
                            {
                                errors.id_entity && (
                                <p className="text-red-500 text-[9px] mt-1">{errors?.id_entity?.message}</p>
                                )
                            }
                    
                  </div>

                  {/* <div className='mb-1'>
                      <label htmlFor="phone" className="block text-xs font-medium mb-0">
                                Téléphone du departement<sup className='text-red-500'>*</sup>
                            </label>
                            <input 
                                id='phone'
                                type="phone"
                                defaultValue={6}
                                {...register('phone')}
                                className={`w-2/3 px-2 py-2 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900
                                  ${
                                    errors.phone ? "border-red-500" : "border-gray-300"
                                  }`}
                            />

                            {
                              errors.phone && (
                                <p className="text-red-500 text-[9px] mt-1">{errors.phone.message}</p>
                              )
                            }
                  </div> */}

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