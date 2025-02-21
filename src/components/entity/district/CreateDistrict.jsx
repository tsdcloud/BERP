import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import CustomingModal from '../../modals/CustomingModal';
import { Button } from '../../ui/button';
import { URLS } from '../../../../configUrl';

import PropTypes from 'prop-types';
import { useFetch } from '../../../hooks/useFetch';

import toast, { Toaster } from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';




export default function CreateDistrict({setOpen, onSubmit}) {

  const districtSchema = z.object({
    name: z.string()
    .nonempty("Ce champs 'Nom' est réquis.")
    .min(1, "le champs doit avoir une valeur de 1 caractère au moins.")
    .max(100)
    // .regex(/^[a-zA-Z0-9\s]+$/, "Ce champ doit être un 'nom' conforme.")
    ,

    countryId: z.string()
    .nonempty('Ce champs "Nom du pays est réquis')
    .min(4, "La valeur de ce champs doit contenir au moins 4 caractères.")
    .max(100)
    .regex(/^(?:[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[4][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|[a-zA-Z0-9 ,]+)$/, "Ce champs doit être un 'nom du pays Conforme."),

    createdBy: z.string().nonempty("Le champ 'createdBy' est requis."),
  });
  
    const [tokenUser, setTokenUser] = useState();
    const [showCountries, setShowCountries] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [selectedCountries, setSelectedCountries] = useState([]);

  const { handlePost, handleFetch } = useFetch();
  

  const fetchCountries = async () => {
    // const getCountries = URLS.API_COUNTRY;
    const getCountries =  `${URLS.ENTITY_API}/countries`;
    try {
        setIsLoading(true);
        const response = await handleFetch(getCountries);
        
            if (response && response?.status === 200) {
                    const results = response?.data;
                    // console.log("res", results);

                    const filteredCountries = results?.map(item => {
                    const { updateAt, ...rest } = item;
                    return rest;
                });
                    // console.log("perm",filteredCountries);
                    setShowCountries(filteredCountries);
            }
            else{
                throw new Error('Erreur lors de la récupération des pays');
            }
    } catch (error) {
        setError(error.message);
    }
    finally {
        setIsLoading(false);
      }
     };

  useEffect(()=>{
    fetchCountries();
  },[]);

  useEffect(()=>{
    const token = localStorage.getItem("token");
    if(token){
        const decode = jwtDecode(token);
        setTokenUser(decode.user_id);
        // console.log("var", tokenUser);
    }
  }, [tokenUser]);
  
      const { register, handleSubmit, reset, formState: { errors, isSubmitting }} = useForm({
          resolver: zodResolver(districtSchema),
      });



  const handleSubmitDataFormDisctrict = async(data) => {
    // const urlToCreateDistrict = URLS.API_DISTRICT;
    const urlToCreateDistrict =  `${URLS.ENTITY_API}/districts`;
      console.log(data);
      try {
        const response = await handlePost(urlToCreateDistrict, data, true);
        // console.log("response crea", response);
        if (response && response.status === 201) {
          toast.success("district crée avec succès", { duration:2000 });
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
        console.error("Error during creating", error);
        toast.error("Erreur lors de la création du district", { duration: 5000 });
      }
  };
  return (
    <CustomingModal
        title="Ajouter un nouveau district"
        buttonText="Créer un district"
      >
        

          <div className='space-y-0'>
                <p className='text-[12px] mb-2'>Veuillez correctement renseigner les informations du district.</p>
                <form onSubmit={handleSubmit(handleSubmitDataFormDisctrict)} className=''>

                  <div className='mb-1'>
                      <label htmlFor="name" className="block text-xs font-medium mb-0">
                          Nom<sup className='text-red-500'>*</sup>
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
                          <p className="text-red-500 text-[9px] mt-1">{errors?.name?.message}</p>
                        )
                      }
                  </div>

                  <div className='mb-1'>
                                <label htmlFor="countryId" className="block text-xs font-medium mb-1">
                                    Nom du pays<sup className='text-red-500'>*</sup>
                                </label>
                                <select
                                    onChange={(e) => {
                                        const nameCountrySelected = showCountries.find(item => item.id === e.target.value);
                                        setSelectedCountries(nameCountrySelected);
                                      }}
                                    {...register('countryId')}
                                    className={`w-2/3 px-2 py-2 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                                        errors.countryId ? "border-red-500" : "border-gray-300"
                                    }`}
                                >
                                    <option value="">Selectionner un pays pour cet district</option>
                                    {showCountries.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.countryId && (
                                    <p className="text-red-500 text-[9px] mt-1">{errors?.countryId?.message}</p>
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
                      {isSubmitting ? "Création en cours..." : "Créer un district"}
                    </Button>

                  </div>
                </form>
                <Toaster/>
          </div>
      </CustomingModal>
  );
}

 // Ajout de la validation des props
 CreateDistrict.propTypes = {
  setOpen: PropTypes.func.isRequired, // Validation de la prop setOpen
};

