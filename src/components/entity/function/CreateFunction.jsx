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
const functionSchema = z.object({

    function_name: z.string()
    .nonempty("Ce champs 'Nom' est réquis.")
    .min(2, "le champs doit avoir une valeur de 2 caractères au moins.")
    .max(100)
    .regex(/^[a-zA-Z ,]+$/, "Ce champ doit être un 'nom' conforme."),

    // id_department: z.string()
    // .nonempty('Ce champs "Nom du service" est réquis')
    // .min(4, "La valeur de ce champs doit contenir au moins 4 caractères.")
    // .max(100)
    // .regex(/^[a-zA-Z0-9_.]+$/, "Ce champs doit être un 'nom du service' Conforme.")
    // ,
});

export default function CreateFunction({setOpen, onSubmit}) {


  const [selectedFunction, setSelectedFunction] = useState([]);
  const [fetchFunction, setFetchFunction] = useState([]);
    
    // const navigateToDashboard = useNavigate();
    const { handlePost, handleFetch } = useFetch();
    

    const showFunction = async () => {

      setFetchFunction(mock_data);

        // const urlToCreateFunction = "";
        // try {
        //     const response = await handleFetch(urlToCreateFunction);
        //     // console.log("response crea", response);
        //     if (response && response?.success) {
        //       toast.success("service crée avec succès", {duration:2000});
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
        showFunction();
    }, []);


    const { register, handleSubmit, formState: { errors, isSubmitting }} = useForm({
        resolver: zodResolver(functionSchema),
    });


    const handleSubmitDataFormFunction = async(data) => {
      console.log(data);
      // const urlToCreateFunction = "http://127.0.0.1:8000/api_gateway/api/user/";
      // const urlToCreateFunction = URLS.API_USER;
      //   // console.log(data);
      //   try {
      //     const response = await handlePost(urlToCreateFunction, data, true);
      //     // console.log("response crea", response);
      //     if (response && response?.success && response.status === 201) {
      //       toast.success("service crée avec succès", {duration:2000});
      //       console.log("entity created", response?.success);
      //       setOpen(false);
      //       onSubmit();

      //     }
      //     else {
      //       toast.error(response.error, { duration: 5000});
      //     }
          
      //   } catch (error) {
      //     console.error("Error during creating",error);
      //     toast.error("Erreur lors de la création du service", { duration: 5000 });
      //   }
    };


    return (
      <CustomingModal
        title="Ajouter une nouvelle fonction"
        buttonText="Créer une fonction"
      >
        

          <div className='space-y-0'>
                <p className='text-[12px] mb-2'>Veuillez correctement renseigner les informations de la fonction.</p>
                <form onSubmit={handleSubmit(handleSubmitDataFormFunction)} className='sm:bg-blue-200 md:bg-transparent'>

                  <div className='mb-1'>
                      <label htmlFor="function_name" className="block text-xs font-medium mb-0">
                          Nom de la fonction<sup className='text-red-500'>*</sup>
                      </label>

                      <input 
                        id='function_name'
                        type="text"
                        {...register('function_name')} 
                        className={`w-2/3 px-2 py-2 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900
                        ${
                            errors.function_name ? "border-red-500" : "border-gray-300"
                          }`}
                      />
                      {
                        errors.function_name && (
                          <p className="text-red-500 text-[9px] mt-1">{errors.function_name.message}</p>
                        )
                      }
                  </div>

                  {/* <div className='mb-4'>
                            <label htmlFor="id_department" className="block text-xs font-medium mb-1">
                                Nom de la ville<sup className='text-red-500'>*</sup>
                            </label>

                        
                            <select
                                        // value={showFunction}
                                        onChange={(e) => {
                                            const nameCitySelected = fetchFunction.find(item => item.id === e.target.value);
                                            setSelectedFunction(nameCitySelected);
                                        }}
                                        {...register('id_department')} 
                                        className={`w-2/3 px-2 py-2 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900
                                        ${
                                            errors.id_department ? "border-red-500" : "border-gray-300"
                                        }`}
                                    >
                                        <option value="">Selectionner un departement</option>
                                            {fetchFunction.map((item) => (
                                                <option key={item.id} value={item.id}>
                                                        {item.name}
                                                </option>
                                            ))}
                            </select>
                            {
                                errors.id_department && (
                                <p className="text-red-500 text-[9px] mt-1">{errors?.id_department?.message}</p>
                                )
                            }
                    
                  </div> */}

                  <div className='flex justify-end space-x-2 mt-2'>
                    <Button 
                    className="border-2 border-blue-600 outline-blue-700 text-blue-700 text-xs shadow-md bg-transparent hover:bg-primary hover:text-white transition" 
                    type="submit"
                    disabled={isSubmitting}
                   
                    >
                      {isSubmitting ? "Création en cours..." : "Créer une fonction"}
                    </Button>

                  </div>
                </form>
                <Toaster/>
          </div>
      </CustomingModal>
    );
}
 // Ajout de la validation des props
 CreateFunction.propTypes = {
  setOpen: PropTypes.func.isRequired, // Validation de la prop setOpen
};