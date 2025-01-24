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
const categorySchema = z.object({

    category_name: z.string()
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

export default function CreateCategory({setOpen, onSubmit}) {


  const [selectedCategory, setSelectedCategory] = useState([]);
  const [fetchCategory, setFetchCategory] = useState([]);
    
    // const navigateToDashboard = useNavigate();
    const { handlePost, handleFetch } = useFetch();
    

    const showCategory = async () => {

      setFetchCategory(mock_data);

        // const urlToCreateCategory = "";
        // try {
        //     const response = await handleFetch(urlToCreateCategory);
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
        showCategory();
    }, []);


    const { register, handleSubmit, formState: { errors, isSubmitting }} = useForm({
        resolver: zodResolver(categorySchema),
    });


    const handleSubmitDataFormCategory = async (data) => {
      console.log(data);
      // const urlToCreateCategory = "http://127.0.0.1:8000/api_gateway/api/user/";
      // const urlToCreateCategory = URLS.API_USER;
      //   // console.log(data);
      //   try {
      //     const response = await handlePost(urlToCreateCategory, data, true);
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
        title="Ajouter une nouvelle catégorie"
        buttonText="Créer une catégorie"
      >
        

          <div className='space-y-0'>
                <p className='text-[12px] mb-2'>Veuillez correctement renseigner les informations de la catégorie.</p>
                <form onSubmit={handleSubmit(handleSubmitDataFormCategory)} className='sm:bg-blue-200 md:bg-transparent'>

                  <div className='mb-1'>
                      <label htmlFor="category_name" className="block text-xs font-medium mb-0">
                          Nom de la catégorie <sup className='text-red-500'>*</sup>
                      </label>

                      <input 
                        id='category_name'
                        type="text"
                        {...register('category_name')} 
                        className={`w-2/3 px-2 py-2 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900
                        ${
                            errors.category_name ? "border-red-500" : "border-gray-300"
                          }`}
                      />
                      {
                        errors.category_name && (
                          <p className="text-red-500 text-[9px] mt-1">{errors.category_name.message}</p>
                        )
                      }
                  </div>

                  {/* <div className='mb-4'>
                            <label htmlFor="id_department" className="block text-xs font-medium mb-1">
                                Nom de la ville<sup className='text-red-500'>*</sup>
                            </label>

                        
                            <select
                                        // value={showCategory}
                                        onChange={(e) => {
                                            const nameCitySelected = fetchCategory.find(item => item.id === e.target.value);
                                            setSelectedCategory(nameCitySelected);
                                        }}
                                        {...register('id_department')} 
                                        className={`w-2/3 px-2 py-2 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900
                                        ${
                                            errors.id_department ? "border-red-500" : "border-gray-300"
                                        }`}
                                    >
                                        <option value="">Selectionner un departement</option>
                                            {fetchCategory.map((item) => (
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
                      {isSubmitting ? "Création en cours..." : "Créer une catégorie"}
                    </Button>

                  </div>
                </form>
                <Toaster/>
          </div>
      </CustomingModal>
    );
}
 // Ajout de la validation des props
 CreateCategory.propTypes = {
  setOpen: PropTypes.func.isRequired, // Validation de la prop setOpen
};