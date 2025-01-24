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
const employeeSchema = z.object({

    first_name: z.string()
    .nonempty("Ce champs 'Prénom' est réquis.")
    .min(2, "le champs doit avoir une valeur de 2 caractères au moins.")
    .max(100)
    .regex(/^[a-zA-Z ,]+$/, "Ce champ doit être un 'prénom' conforme."),

    last_name: z.string()
    .nonempty("Ce champs 'Nom' est réquis.")
    .min(4, "le champs doit avoir une valeur de 4 caractères au moins.")
    .max(100)
    .regex(/^[a-zA-Z]+$/, "Ce champ doit être un 'nom' conforme."),

    email: z.string()
    .nonempty("Ce champs 'Email' est réquis.")
    .email("Adresse mail invalide")
    .max(255),

    phone: z.string()
    .nonempty("Ce champs 'Téléphone' est réquis.")
    .length(9, "La valeur de ce champs doit contenir 9 caractères.")
    .regex(/^[0-9]+$/),

    address: z.string()
    .nonempty("Ce champs 'Adresse' est réquis")
    .min(4, "le champs doit avoir une valeur de 4 caractères au moins.")
    .max(100)
    .regex(/^[a-zA-Z ,]+$/, "Ce champs doit être une 'adresse' conforme"),

    date_of_birth : z.string()
    .nonempty("Ce champs 'Date de naissance' est réquis")
    .max(20)
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Le champs doit être une 'date de naissance' conforme"),

    picture : z.string().regex(/^[a-zA-Z0-9_-]+\.(jpg|jpeg|png|gif|bmp|webp)$/i, "Ce champs doit avoir l'extension attendue"),

    id_function: z.string()
    .nonempty('Ce champs "Nom de la fonction" est réquis')
    .min(4, "La valeur de ce champs doit contenir au moins 4 caractères.")
    .max(100)
    .regex(/^[a-zA-Z0-9_.]+$/, "Ce champs doit être un 'nom de la fonction' Conforme."),
    
    id_entity: z.string()
    .nonempty('Ce champs "Nom de l\'entité" est réquis')
    .min(4, "La valeur de ce champs doit contenir au moins 4 caractères.")
    .max(100)
    .regex(/^[a-zA-Z0-9_.]+$/, "Ce champs doit être un 'nom de l\'entité' Conforme."),
    
    id_grade: z.string()
    .nonempty('Ce champs "Nom du grade" est réquis')
    .min(4, "La valeur de ce champs doit contenir au moins 4 caractères.")
    .max(100)
    .regex(/^[a-zA-Z0-9_.]+$/, "Ce champs doit être un 'nom du grade' Conforme."),
    
    id_echelon: z.string()
    .nonempty('Ce champs "Nom de l\'echelon" est réquis')
    .min(4, "La valeur de ce champs doit contenir au moins 4 caractères.")
    .max(100)
    .regex(/^[a-zA-Z0-9_.]+$/, "Ce champs doit être un 'nom de l\'echelon' Conforme."),
    
    id_category: z.string()
    .nonempty('Ce champs "Nom de la catégorie" est réquis')
    .min(4, "La valeur de ce champs doit contenir au moins 4 caractères.")
    .max(100)
    .regex(/^[a-zA-Z0-9_.]+$/, "Ce champs doit être un 'nom de la catégorie' Conforme."),
    
    id_user: z.string()
    .nonempty('Ce champs "Nom de l\'utilisateur" est réquis')
    .min(4, "La valeur de ce champs doit contenir au moins 4 caractères.")
    .max(100)
    .regex(/^[a-zA-Z0-9_.]+$/, "Ce champs doit être un 'nom de l\'utilisateur' Conforme."),

});

export default function CreateEmployee({setOpen, onSubmit}) {


  const [selectedEmployee, setSelectedEmployee] = useState([]);
  const [fetchEmployee, setFetchEmployee] = useState([]);

  const [step, setStep] = useState(0);

  const handleNextStep = () => {
    if (step < 2) setStep(step + 1);
  };

  const handlePrevStep = () => {
    if (step > 0) setStep(step - 1);
  };
    
    // const navigateToDashboard = useNavigate();
    const { handlePost, handleFetch } = useFetch();
    

    const showEmployee = async () => {

      setFetchEmployee(mock_data);

        // const urlToCreateEmployee = "";
        // try {
        //     const response = await handleFetch(urlToCreateEmployee);
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
        showEmployee();
    }, []);


    const { register, handleSubmit, formState: { errors, isSubmitting }} = useForm({
        resolver: zodResolver(employeeSchema),
    });


    const handleSubmitDataFormEmployee = async (data) => {
      console.log(data);
      // const urlToCreateEmployee = "http://127.0.0.1:8000/api_gateway/api/user/";
      // const urlToCreateEmployee = URLS.API_USER;
      //   // console.log(data);
      //   try {
      //     const response = await handlePost(urlToCreateEmployee, data, true);
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
        title="Ajouter un(e) nouvel(le) employé(e)"
        buttonText="Créer un(e) nouvel(le) employé(e)"
      >
        

      <div className='space-y-0'>
       <p className='text-[12px] mb-2'>Veuillez correctement renseigner les informations de l'employé(e).</p>
          <form onSubmit={handleSubmit(handleSubmitDataFormEmployee)} className='sm:bg-blue-200 md:bg-transparent'>

                {/* Step 1 */}
                {
                    step === 0 && (
                    <>
                        <div className='mb-1'>
                        <label htmlFor="first_name" className="block text-xs font-medium mb-0">
                            Prénom <sup className='text-red-500'>*</sup>
                        </label>
                        <input
                            id='first_name'
                            type="text"
                            {...register('first_name', { required: "Le prénom est obligatoire." })}
                            className={`w-2/3 px-2 py-2 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                            errors.first_name ? "border-red-500" : "border-gray-300"
                            }`}
                        />
                        {errors.first_name && (
                            <p className="text-red-500 text-[9px] mt-1">{errors.first_name.message}</p>
                        )}
                        </div>

                        <div className='mb-1'>
                        <label htmlFor="last_name" className="block text-xs font-medium mb-0">
                            Nom de famille <sup className='text-red-500'>*</sup>
                        </label>
                        <input
                            id='last_name'
                            type="text"
                            {...register('last_name', { required: "Le nom de famille est obligatoire." })}
                            className={`w-2/3 px-2 py-2 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                            errors.last_name ? "border-red-500" : "border-gray-300"
                            }`}
                        />
                        {errors.last_name && (
                            <p className="text-red-500 text-[9px] mt-1">{errors.last_name.message}</p>
                        )}
                        </div>

                        <div className='mb-1'>
                        <label htmlFor="email" className="block text-xs font-medium mb-0">
                            Adresse mail <sup className='text-red-500'>*</sup>
                        </label>
                        <input
                            id='email'
                            type="text"
                            {...register('email', {
                            required: "L'adresse email est obligatoire.",
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "Adresse email invalide.",
                            },
                            })}
                            className={`w-2/3 px-2 py-2 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                            errors.email ? "border-red-500" : "border-gray-300"
                            }`}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-[9px] mt-1">{errors.email.message}</p>
                        )}
                        </div>

                        <div className='mb-1'>
                        <label htmlFor="phone" className="block text-xs font-medium mb-0">
                            Téléphone <sup className='text-red-500'>*</sup>
                        </label>
                        <input
                            id='phone'
                            type="text"
                            {...register('phone', { required: "Le numéro de téléphone est obligatoire." })}
                            className={`w-2/3 px-2 py-2 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                            errors.phone ? "border-red-500" : "border-gray-300"
                            }`}
                        />
                        {errors.phone && (
                            <p className="text-red-500 text-[9px] mt-1">{errors.phone.message}</p>
                        )}
                        </div>
                    </>
                    )
                }

                {/* Step 2 */}
                {
                    step === 1 && (
                    <>
                        <div className='mb-1'>
                        <label htmlFor="address" className="block text-xs font-medium mb-0">
                            Adresse ou localisation <sup className='text-red-500'>*</sup>
                        </label>
                        <input
                            id='address'
                            type="text"
                            {...register('address', { required: "L'adresse est obligatoire." })}
                            className={`w-2/3 px-2 py-2 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                            errors.address ? "border-red-500" : "border-gray-300"
                            }`}
                        />
                        {errors.address && (
                            <p className="text-red-500 text-[9px] mt-1">{errors.address.message}</p>
                        )}
                        </div>

                        <div className='mb-1'>
                            <label htmlFor="date_of_birth" className="block text-xs font-medium mb-0">
                                Date de naissance <sup className='text-red-500'>*</sup>
                            </label>
                            <input
                                id='date_of_birth'
                                type="date"
                                {...register('date_of_birth', {
                                required: "La date de naissance est obligatoire.",
                                pattern: {
                                    value: /^\d{4}-\d{2}-\d{2}$/,
                                    message: "Le format doit être YYYY-MM-DD (ex : 1990-05-15).",
                                },
                                })}
                                className={`w-2/3 px-2 py-2 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                                errors.date_of_birth ? "border-red-500" : "border-gray-300"
                                }`}
                            />
                            {errors.date_of_birth && (
                                <p className="text-red-500 text-[9px] mt-1">{errors.date_of_birth.message}</p>
                            )}
                        </div>

                        <div className='mb-1'>
                            <label htmlFor="picture" className="block text-xs font-medium mb-0">
                                Photo de profil <sup className='text-red-500'>*</sup>
                            </label>
                            <input
                                id='picture'
                                type="file"
                                {...register('picture', { required: "La photo est obligatoire." })}
                                className={`w-2/3 px-2 py-2 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                                errors.picture ? "border-red-500" : "border-gray-300"
                                }`}
                            />
                            {errors.picture && (
                                <p className="text-red-500 text-[9px] mt-1">{errors.picture.message}</p>
                            )}
                        </div>
                    </>
                    )
                }

                {/* Step 3 */}
                {
                    step === 2 && (
                        <>
                            <div className='mb-1'>
                                <label htmlFor="id_function" className="block text-xs font-medium mb-1">
                                    Nom de la fonction<sup className='text-red-500'>*</sup>
                                </label>
                                <select
                                    onChange={(e) => {
                                        const nameCitySelected = fetchEmployee.find(item => item.id === e.target.value);
                                        setSelectedEmployee(nameCitySelected);
                                    }}
                                    {...register('id_function')}
                                    className={`w-2/3 px-2 py-2 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                                        errors.id_function ? "border-red-500" : "border-gray-300"
                                    }`}
                                >
                                    <option value="">Selectionner une fonction pour cet(te) employé(e)</option>
                                    {fetchEmployee.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.id_function && (
                                    <p className="text-red-500 text-[9px] mt-1">{errors?.id_function?.message}</p>
                                )}
                            </div>

                            <div className='mb-1'>
                                <label htmlFor="id_grade" className="block text-xs font-medium mb-1">
                                    Nom du grade <sup className='text-red-500'>*</sup>
                                </label>
                                <select
                                    onChange={(e) => {
                                        const nameCitySelected = fetchEmployee.find(item => item.id === e.target.value);
                                        setSelectedEmployee(nameCitySelected);
                                    }}
                                    {...register('id_grade')}
                                    className={`w-2/3 px-2 py-2 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                                        errors.id_grade ? "border-red-500" : "border-gray-300"
                                    }`}
                                >
                                    <option value="">Selectionner un grade pour cet(te) employé(e)</option>
                                    {fetchEmployee.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.id_grade && (
                                    <p className="text-red-500 text-[9px] mt-1">{errors?.id_grade?.message}</p>
                                )}
                            </div>

                            <div className='mb-1'>
                                <label htmlFor="id_echelon" className="block text-xs font-medium mb-1">
                                    Nom de l'échelon <sup className='text-red-500'>*</sup>
                                </label>
                                <select
                                    onChange={(e) => {
                                        const nameCitySelected = fetchEmployee.find(item => item.id === e.target.value);
                                        setSelectedEmployee(nameCitySelected);
                                    }}
                                    {...register('id_echelon')}
                                    className={`w-2/3 px-2 py-2 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                                        errors.id_echelon ? "border-red-500" : "border-gray-300"
                                    }`}
                                >
                                    <option value="">Selectionner un échelon pour cet(te) employé(e)</option>
                                    {fetchEmployee.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.id_echelon && (
                                    <p className="text-red-500 text-[9px] mt-1">{errors?.id_echelon?.message}</p>
                                )}
                            </div>

                            <div className='mb-1'>
                                <label htmlFor="id_category" className="block text-xs font-medium mb-1">
                                    Nom de la catégorie <sup className='text-red-500'>*</sup>
                                </label>
                                <select
                                    onChange={(e) => {
                                        const nameCitySelected = fetchEmployee.find(item => item.id === e.target.value);
                                        setSelectedEmployee(nameCitySelected);
                                    }}
                                    {...register('id_category')}
                                    className={`w-2/3 px-2 py-2 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                                        errors.id_category ? "border-red-500" : "border-gray-300"
                                    }`}
                                >
                                    <option value="">Selectionner une catégorie pour cet(te) employé(e)</option>
                                    {fetchEmployee.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.id_category && (
                                    <p className="text-red-500 text-[9px] mt-1">{errors?.id_category?.message}</p>
                                )}
                            </div>

                            <div className='mb-1'>
                                <label htmlFor="id_user" className="block text-xs font-medium mb-1">
                                    Nom de l'utilisateur <sup className='text-red-500'>*</sup>
                                </label>
                                <select
                                    onChange={(e) => {
                                        const nameCitySelected = fetchEmployee.find(item => item.id === e.target.value);
                                        setSelectedEmployee(nameCitySelected);
                                    }}
                                    {...register('id_user')}
                                    className={`w-2/3 px-2 py-2 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                                        errors.id_user ? "border-red-500" : "border-gray-300"
                                    }`}
                                >
                                    <option value="">Désigner un utilisateur pour cet(te) employé(e)</option>
                                    {fetchEmployee.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.id_user && (
                                    <p className="text-red-500 text-[9px] mt-1">{errors?.id_user?.message}</p>
                                )}
                            </div>
                        </>
                    )
                }

                {/* Button */}
                <div className='flex justify-end space-x-2 mt-4'>
                {
                    step > 0 && (
                        <Button
                        type="button"
                        onClick={handlePrevStep}
                        className="border-2 border-gray-600 outline-gray-700 text-gray-700 text-xs shadow-md bg-transparent hover:bg-gray-700 hover:text-white transition"
                        >
                        Précédent
                        </Button>
                    )
                }
                {
                    step < 2 ? (
                        <Button
                        type="button"
                        onClick={handleNextStep}
                        className="border-2 border-green-600 outline-green-700 text-green-700 text-xs shadow-md bg-transparent hover:bg-secondary hover:text-white transition"
                        >
                        Suivant
                        </Button>
                    ) : (
                        <Button 
                        className="border-2 border-blue-600 outline-blue-700 text-blue-700 text-xs shadow-md bg-transparent hover:bg-primary hover:text-white transition" 
                        type="submit"
                        disabled={isSubmitting}
                    
                        >
                        {isSubmitting ? "Création en cours..." : "Créer un(e) employé(e)"}
                        </Button>
                    )
                }
                </div>
          </form>
        </div>


      </CustomingModal>
    );
}
 // Ajout de la validation des props
 CreateEmployee.propTypes = {
  setOpen: PropTypes.func.isRequired,
};