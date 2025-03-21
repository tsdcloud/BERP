import {useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import CustomingModal from '../modals/CustomingModal';
import { Button } from "../ui/button";
import { useNavigate, useParams } from 'react-router-dom';
import { URLS } from '../../../configUrl';

import PropTypes from 'prop-types';
import { useFetch } from '../../hooks/useFetch';

import toast, { Toaster } from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';

// Définition du schéma avec Zod
const entitySchema = z.object({

    name: z.string()
    .nonempty("Ce champs 'Nom' est réquis.")
    // .min(2, "le champs doit avoir une valeur de 2 caractères au moins.")
    .max(100)
    // .regex(/^[a-zA-Z ,]+$/, "Ce champ doit être un 'nom' conforme.")
    ,

    localisation: z.string()
    .nonempty("Ce champs 'Localisation' est réquis")
    // .min(4, "le champs doit avoir une valeur de 4 caractères au moins.")
    .max(100)
    // .regex(/^[a-zA-Z ,]+$/, "Ce champs doit être une 'localisation' conforme")
    ,

    phone: z.string()
    .nonempty("Ce champs 'Téléphone' est réquis.")
    .length(9, "La valeur de ce champs doit contenir 9 caractères.")
    // .regex(/^[0-9]+$/)
    ,

    townId: z.string()
    .nonempty('Ce champs "Nom du district est réquis')
    .min(4, "La valeur de ce champs doit contenir au moins 4 caractères.")
    .max(100)
    .regex(/^(?:[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[4][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|[a-zA-Z0-9 ,]+)$/,
       "Ce champs doit être un 'nom de la ville Conforme."),

    createdBy: z.string().nonempty("Le champ 'createdBy' est requis."),
  
  });

export default function CreateEntity({setOpen, onSubmit}) {


  const [selectedTowns, setSelectedTowns] = useState([]);
  const [showTowns, setShowTowns] = useState([]);
  const [tokenUser, setTokenUser] = useState();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();


    const { handlePost, handleFetch } = useFetch();
    

    const fetchTowns = async () => {
      // const getTown = URLS.API_TOWN;
      const getTown = `${URLS.ENTITY_API}/towns`;
      
      try {
          setIsLoading(true);
          const response = await handleFetch(getTown);
          
              if (response && response?.status === 200) {
                      const results = response?.data;
                      // console.log("results", results);
  
                      const filteredTowns = results?.map(item => {
                      const { createdBy, updateAt, ...rest } = item;
                      return { ...rest };
                  });
                      // console.log("districts - Town",filteredTowns);
                      setShowTowns(filteredTowns);
              }
              else{
                  throw new Error('Erreur lors de la récupération des villes');
              }
      } catch (error) {
          setError(error.message);
      }
      finally {
          setIsLoading(false);
        }
       };

    useEffect(() => {
      fetchTowns();
    }, []);

    useEffect(()=>{
      const token = localStorage.getItem("token");
      if(token){
          const decode = jwtDecode(token);
          setTokenUser(decode.user_id);
          // console.log("var", tokenUser);
      }
    }, [tokenUser]);


    const { register, handleSubmit, reset,  formState: { errors, isSubmitting }} = useForm({
        resolver: zodResolver(entitySchema),
    });


    const handleSubmitDataFormEntity = async(data) => {
      console.log(data);
      // const urlToCreateEntity = URLS.API_ENTITY;
      const urlToCreateEntity = `${URLS.ENTITY_API}/entities`;
        // console.log(data);
        try {
          const response = await handlePost(urlToCreateEntity, data, true);
          console.log("response crea", response);
          if (response && response.status === 201) {
            toast.success("Entité crée avec succès", { duration : 2000 });
            console.log("entity created", response?.success);
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
          toast.error("Erreur lors de la création de l'entité", { duration: 5000 });
        }
    };


    return (
      <CustomingModal
        title="Ajouter une nouvelle entité"
        buttonText="Créer une entité"
      >
        

          <div className='space-y-0'>
                <p className='text-[12px] mb-2'>Veuillez correctement renseigner les informations de l'entité.</p>
                <form onSubmit={handleSubmit(handleSubmitDataFormEntity)} className=''>

                  <div className='mb-1'>
                      <label htmlFor="name" className="block text-xs font-medium mb-0">
                          Nom de l'entité<sup className='text-red-500'>*</sup>
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

                  <div className='mb-1'>
                        <label htmlFor="localisation" className="block text-xs font-medium mb-0">
                            Localisation de l'entité<sup className='text-red-500'>*</sup>
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
                            <label htmlFor="townId" className="block text-xs font-medium mb-1">
                                Nom de la ville<sup className='text-red-500'>*</sup>
                            </label>

                        
                            <select
                                        // value={showCities}
                                        onChange={(e) => {
                                            const nameCitySelected = showTowns.find(item => item.id === e.target.value);
                                            setSelectedTowns(nameCitySelected);
                                        }}
                                        {...register('townId')} 
                                        className={`w-2/3 px-2 py-2 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900
                                        ${
                                            errors.townId ? "border-red-500" : "border-gray-300"
                                        }`}
                                    >
                                        <option value="">Selectionner une ville</option>
                                            {showTowns.map((item) => (
                                                <option key={item.id} value={item.id}>
                                                        {item.name}
                                                </option>
                                            ))}
                            </select>
                            {
                                errors.townId && (
                                <p className="text-red-500 text-[9px] mt-1">{errors?.townId?.message}</p>
                                )
                            }
                    
                        </div>

                  <div className='mb-1'>
                      <label htmlFor="phone" className="block text-xs font-medium mb-0">
                                Téléphone de l'entité<sup className='text-red-500'>*</sup>
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
                      {isSubmitting ? "Création en cours..." : "Créer une entité"}
                    </Button>

                  </div>
                </form>
                <Toaster/>
          </div>
      </CustomingModal>
    );
}
 // Ajout de la validation des props
 CreateEntity.propTypes = {
  setOpen: PropTypes.func.isRequired, // Validation de la prop setOpen
};