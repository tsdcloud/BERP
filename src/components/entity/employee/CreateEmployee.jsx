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
const employeeSchema = z.object({

    // first_name: z.string()
    // .nonempty("Ce champs 'Prénom' est réquis.")
    // .min(2, "le champs doit avoir une valeur de 2 caractères au moins.")
    // .max(100)
    // .regex(/^[a-zA-Z ,]+$/, "Ce champ doit être un 'prénom' conforme."),

    name: z.string()
    .nonempty("Ce champs 'Nom' est réquis.")
    .min(4, "le champs doit avoir une valeur de 4 caractères au moins.")
    .max(100)
    // .regex(/^[a-zA-Z]+$/, "Ce champ doit être un 'nom' conforme.")
    ,

    email: z.string()
    .nonempty("Ce champs 'Email' est réquis.")
    .email("Adresse mail invalide")
    .max(255),

    phone: z.string()
    .nonempty("Ce champs 'Téléphone' est réquis.")
    .length(9, "La valeur de ce champs doit contenir 9 caractères.")
    .regex(/^[0-9]+$/),

    // address: z.string()
    // .nonempty("Ce champs 'Adresse' est réquis")
    // .min(4, "le champs doit avoir une valeur de 4 caractères au moins.")
    // .max(100)
    // .regex(/^[a-zA-Z ,]+$/, "Ce champs doit être une 'adresse' conforme"),

    // date_of_birth : z.string()
    // .nonempty("Ce champs 'Date de naissance' est réquis")
    // .max(20)
    // .regex(/^\d{4}-\d{2}-\d{2}$/, "Le champs doit être une 'date de naissance' conforme"),

    // picture : z.string().regex(/^[a-zA-Z0-9_-]+\.(jpg|jpeg|png|gif|bmp|webp)$/i, 
    // "Ce champs doit avoir l'extension attendue"),

    functionId: z.string()
    .nonempty('Ce champs "Nom de la fonction" est réquis')
    .min(4, "La valeur de ce champs doit contenir au moins 4 caractères.")
    .max(100)
    .regex(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[4][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/, 
    "Ce champs doit être un 'nom de fonction' Conforme."),
    
    entityId: z.string()
    .nonempty('Ce champs "Nom de l\'entité" est réquis')
    .min(4, "La valeur de ce champs doit contenir au moins 4 caractères.")
    .max(100)
    .regex(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[4][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/,
    "Ce champs doit être un 'nom de l\'entité' Conforme."),
    
    gradeId: z.string()
    .nonempty('Ce champs "Nom du grade" est réquis')
    .min(4, "La valeur de ce champs doit contenir au moins 4 caractères.")
    .max(100)
    .regex(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[4][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/,
    "Ce champs doit être un 'nom du grade' Conforme."),
    
    echelonId: z.string()
    .nonempty('Ce champs "Nom de l\'echelon" est réquis')
    .min(4, "La valeur de ce champs doit contenir au moins 4 caractères.")
    .max(100)
    .regex(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[4][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/,
    "Ce champs doit être un 'nom de l\'echelon' Conforme."),
    
    categoryId: z.string()
    .nonempty('Ce champs "Nom de la catégorie" est réquis')
    .min(4, "La valeur de ce champs doit contenir au moins 4 caractères.")
    .max(100)
    .regex(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[4][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/, 
    "Ce champs doit être un 'nom de la catégorie' Conforme."),
    
    userId: z.string()
    .nonempty('Ce champs "Nom de l\'utilisateur" est réquis')
    .min(4, "La valeur de ce champs doit contenir au moins 4 caractères.")
    .max(100)
    .regex(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[4][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/,
    "Ce champs doit être un 'nom de l\'utilisateur' Conforme."),

    createdBy: z.string().nonempty("Le champ 'createdBy' est requis."),

});

export default function CreateEmployee({setOpen, onSubmit}) {

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [tokenUser, setTokenUser] = useState();

    const [step, setStep] = useState(0);
    
    // States of functions
    const [showFunction, setShowFunction] = useState([]);
    const [selectedFunction, setSelectedFunction] = useState([]);
    
    // States of grades
    const [showGrade, setShowGrade] = useState([]);
    const [selectedGrade, setSelectedGrade] = useState([]);
    
    // States of echelons
    const [showEchelon, setShowEchelon] = useState([]);
    const [selectedEchelon, setSelectedEchelon] = useState([]);
    
    // States of Categories
    const [showCategories, setShowCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    
    // States of Users
    const [showUsers, setShowUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    
    // States of Entities
    const [showEntities, setShowEntities] = useState([]);
    const [selectedEntities, setSelectedEntities] = useState([]);



    const handleNextStep = () => {
         (step < 2) && setStep(step + 1);
    };

    const handlePrevStep = () => {
         (step > 0) && setStep(step - 1);
    };
    
    // const navigateToDashboard = useNavigate();
    const { handlePost, handleFetch } = useFetch();



    const fetchGrade = async () => {
        const getGrade = `${URLS.ENTITY_API}/grades`;
        try {
            setIsLoading(true);
            const response = await handleFetch(getGrade);
            
                if (response && response?.status === 200) {
                        const results = response?.data;
                        // console.log("results", results);
    
                        const filteredGrade = results?.map(item => {
                        const { createdBy, updateAt, ...rest } = item;
                        return { ...rest };
                    });
                    setShowGrade(filteredGrade);
                }
                else{
                    throw new Error('Erreur lors de la récupération des grades');
                }
        } catch (error) {
            setError(error.message);
        }
        finally {
            setIsLoading(false);
          }
        };

    const fetchFunction = async () => {
        const getFunction = `${URLS.ENTITY_API}/functions`;
        try {
            setIsLoading(true);
            const response = await handleFetch(getFunction);
            
                if (response && response?.status === 200) {
                        const results = response?.data;
                        // console.log("results", results);
    
                        const filteredFunctions = results?.map(item => {
                        const { createdBy, updateAt, ...rest } = item;
                        return { ...rest };
                    });
                        setShowFunction(filteredFunctions);
                }
                else{
                    throw new Error('Erreur lors de la récupération des fonctions');
                }
        } catch (error) {
            setError(error.message);
        }
        finally {
            setIsLoading(false);
          }
        };


    const fetchEchelon = async () => {
        const getEchelon = `${URLS.ENTITY_API}/echelons`;
        try {
            setIsLoading(true);
            const response = await handleFetch(getEchelon);
            
                if (response && response?.status === 200) {
                        const results = response?.data;
                        // console.log("results", results);
    
                        const filteredEchelons = results?.map(item => {
                        const { createdBy, updateAt, ...rest } = item;
                        return { ...rest };
                    });
                    setShowEchelon(filteredEchelons);
                }
                else{
                    throw new Error('Erreur lors de la récupération des échelons');
                }
        } catch (error) {
            setError(error.message);
        }
        finally {
            setIsLoading(false);
          }
        };


    const fetchCategories = async () => {
        const getCategories = `${URLS.ENTITY_API}/categories`;
        try {
            setIsLoading(true);
            const response = await handleFetch(getCategories);
            
                if (response && response?.status === 200) {
                        const results = response?.data;
                        // console.log("results", results);
    
                        const filteredCategories = results?.map(item => {
                        const { createdBy, updateAt, ...rest } = item;
                        return { ...rest };
                    });
                    setShowCategories(filteredCategories);
                }
                else{
                    throw new Error('Erreur lors de la récupération des catégories');
                }
        } catch (error) {
            setError(error.message);
        }
        finally {
            setIsLoading(false);
          }
        };

    const fetchUsers = async () => {
        const getUsers = `${URLS.USER_API}/users/`;
        try {
            setIsLoading(true);
            const response = await handleFetch(getUsers);
            
                if (response && response?.status === 200) {
                        const results = response?.data?.results;
                        // console.log("results user", results);
    
                        const filteredUsers = results?.map(item => {
                        const { createdBy, updateAt, ...rest } = item;
                        return { 
                                // id:rest.id, 
                                // name:rest.name,
                                ...rest
                                 };
                    });
                    setShowUsers(filteredUsers);
                    // console.log("user", filteredUsers);
                }
                else{
                    throw new Error('Erreur lors de la récupération des utilisateurs');
                }
        } catch (error) {
            setError(error.message);
        }
        finally {
            setIsLoading(false);
          }
        };


    const fetchEntities = async () => {
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
        fetchFunction();
        fetchGrade();
        fetchEchelon();
        fetchCategories();
        fetchUsers();
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
        resolver: zodResolver(employeeSchema),
    });


    const handleSubmitDataFormEmployee = async (data) => {
        // console.log("data form",data);
        // const urlToCreateEmployee = URLS.API_EMPLOYEE;
        const urlToCreateEmployee = `${URLS.ENTITY_API}/employees`;
  
          try {
            const response = await handlePost(urlToCreateEmployee, data, true);
            // console.log("response crea", response);
            if (response && response.status === 201) {
              toast.success("employee crée avec succès", { duration : 2000 });
            //   console.log("employee created", response?.success);
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
            toast.error("Erreur lors de la création de l'employée", { duration: 5000 });
          }
    };


    return (
        
      <CustomingModal
        title="Ajouter un(e) nouvel(le) employé(e)"
        buttonText="Créer un(e) nouvel(le) employé(e)"
      >
        

      <div className='space-y-0'>
       <p className='text-[12px] mb-2'>Veuillez correctement renseigner les informations de l'employé(e).</p>
          <form onSubmit={handleSubmit(handleSubmitDataFormEmployee)} className=''>

                {/* Step 1 */}
                {
                    step === 0 && (
                    <>
                        {/* <div className='mb-1'>
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
                        </div> */}

                        <div className='mb-1'>
                            <label htmlFor="name" className="block text-xs font-medium mb-0">
                                Nom de l'employée <sup className='text-red-500'>*</sup>
                            </label>
                            <input
                                id='name'
                                type="text"
                                {...register('name', { required: "Le nom de famille est obligatoire." })}
                                className={`w-2/3 px-2 py-2 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                                errors.name ? "border-red-500" : "border-gray-300"
                                }`}
                            />
                            {errors.name && (
                                <p className="text-red-500 text-[9px] mt-1">{errors.name.message}</p>
                            )}
                        </div>

                        
                        <div className='mb-1'>
                                <label htmlFor="userId" className="block text-xs font-medium mb-1">
                                    Nom de l'utilisateur <sup className='text-red-500'>*</sup>
                                </label>
                                <select
                                    onChange={(e) => {
                                        const nameUserSelected = showUsers.find(item => item.id === e.target.value);
                                        setSelectedUsers(nameUserSelected);
                                    }}
                                    {...register('userId')}
                                    className={`w-2/3 px-2 py-2 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                                        errors.userId ? "border-red-500" : "border-gray-300"
                                    }`}
                                >
                                    <option value="">Désigner un utilisateur </option>
                                    {showUsers.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.last_name}
                                        </option>
                                    ))}
                                </select>
                                {errors.userId && (
                                    <p className="text-red-500 text-[9px] mt-1">{errors?.userId?.message}</p>
                                )}
                            </div>

                      

                        <div className='mb-1'>
                                <label htmlFor="entityId" className="block text-xs font-medium mb-1">
                                    Attribuer une entité<sup className='text-red-500'>*</sup>
                                </label>
                                <select
                                    onChange={(e) => {
                                        const nameEntitiesSelected = showEntities.find(item => item.id === e.target.value);
                                        setSelectedEntities(nameEntitiesSelected);
                                    }}
                                    {...register('entityId')}
                                    className={`w-2/3 px-2 py-2 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${
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
                                {errors.entityId && (
                                    <p className="text-red-500 text-[9px] mt-1">{errors?.entityId?.message}</p>
                                )}
                            </div>
                    </>
                    )
                }

                {/* Step 2 */}
                {
                    step === 1 && (
                    <>
                        {/* <div className='mb-1'>
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
                        </div> */}

                           

                            <div className='mb-1'>
                            <label htmlFor="email" className="block text-xs font-medium mb-0">
                                Adresse Email Professionnelle <sup className='text-red-500'>*</sup>
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
                                Numéro de téléphone professionnel <sup className='text-red-500'>*</sup>
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

                            <div className='mb-1'>
                                <label htmlFor="gradeId" className="block text-xs font-medium mb-1">
                                    Nom du grade <sup className='text-red-500'>*</sup>
                                </label>
                                <select
                                    onChange={(e) => {
                                        const nameGradeSelected = showGrade.find(item => item.id === e.target.value);
                                        setSelectedGrade(nameGradeSelected);
                                    }}
                                    {...register('gradeId')}
                                    className={`w-2/3 px-2 py-2 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                                        errors.gradeId ? "border-red-500" : "border-gray-300"
                                    }`}
                                >
                                    <option value="">Selectionner un grade </option>
                                    {showGrade.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.gradeId && (
                                    <p className="text-red-500 text-[9px] mt-1">{errors?.gradeId?.message}</p>
                                )}
                            </div>

                            <div className='mb-1'>
                                <label htmlFor="echelonId" className="block text-xs font-medium mb-1">
                                    Nom de l'échelon <sup className='text-red-500'>*</sup>
                                </label>
                                <select
                                    onChange={(e) => {
                                        const nameEchelonSelected = showEchelon.find(item => item.id === e.target.value);
                                        setSelectedEchelon(nameEchelonSelected);
                                    }}
                                    {...register('echelonId')}
                                    className={`w-2/3 px-2 py-2 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                                        errors.echelonId ? "border-red-500" : "border-gray-300"
                                    }`}
                                >
                                    <option value="">Selectionner un échelon </option>
                                    {showEchelon.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.echelonId && (
                                    <p className="text-red-500 text-[9px] mt-1">{errors?.echelonId?.message}</p>
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
                                <label htmlFor="categoryId" className="block text-xs font-medium mb-1">
                                    Nom de la catégorie <sup className='text-red-500'>*</sup>
                                </label>
                                <select
                                    onChange={(e) => {
                                        const nameCategoriesSelected = showCategories.find(item => item.id === e.target.value);
                                        setSelectedCategories(nameCategoriesSelected);
                                    }}
                                    {...register('categoryId')}
                                    className={`w-2/3 px-2 py-2 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                                        errors.categoryId ? "border-red-500" : "border-gray-300"
                                    }`}
                                >
                                    <option value="">Selectionner une catégorie</option>
                                    {showCategories.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.categoryId && (
                                    <p className="text-red-500 text-[9px] mt-1">{errors?.categoryId?.message}</p>
                                )}
                            </div>

                            <div className='mb-1'>
                                <label htmlFor="functionId" className="block text-xs font-medium mb-1">
                                    Nom de la fonction<sup className='text-red-500'>*</sup>
                                </label>
                                <select
                                    onChange={(e) => {
                                        const nameFunctionSelected = showFunction.find(item => item.id === e.target.value);
                                        setSelectedFunction(nameFunctionSelected);
                                    }}
                                    {...register('functionId')}
                                    className={`w-2/3 px-2 py-2 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                                        errors.functionId ? "border-red-500" : "border-gray-300"
                                    }`}
                                >
                                    <option value="">Selectionner une fonction</option>
                                    {showFunction.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.functionId && (
                                    <p className="text-red-500 text-[9px] mt-1">{errors?.functionId?.message}</p>
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