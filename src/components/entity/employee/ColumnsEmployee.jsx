import { useMemo, useState, useEffect } from 'react';
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { EyeIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { AlertDialog,
         AlertDialogAction,
         AlertDialogCancel,
         AlertDialogContent,
         AlertDialogDescription,
         AlertDialogFooter,
         AlertDialogHeader,
         AlertDialogTitle } from "../../ui/alert-dialog";

import { Input } from '../../ui/input'; 
import { Button } from '../../ui/button';
import { useFetch } from '../../../hooks/useFetch'; 
import toast, { Toaster } from 'react-hot-toast';
import { URLS } from '../../../../configUrl'; 
import { jwtDecode } from 'jwt-decode';




// Schéma de validation avec Zod
const employeeSchema = z.object({

    name: z.string()
    .nonempty("Ce champs 'Nom' est réquis.")
    .min(2, "le champs doit avoir une valeur de 4 caractères au moins.")
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
    // .regex(/^[0-9]+$/)
    ,


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

// fonction principale pour gérer les actions utilisateur
export const EmployeeAction = ({ delEmployee, updateData }) => {
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [tokenUser, setTokenUser] = useState();
    const [isEdited, setIsEdited] = useState(true);
    const [step, setStep] = useState(0);
    const [selectedEmployee, setSelectedEmployee] = useState({});


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

    const { register, handleSubmit, reset, formState:{errors, isSubmitting} } = useForm({
        resolver: zodResolver(employeeSchema),
    });

   const { handlePatch, handleDelete, handleFetch } = useFetch();
   

        const fetchGrade = async () => {
            const getGrade = `${URLS.ENTITY_API}/grades`;
            try {
                setIsLoading(true);
                const response = await handleFetch(getGrade);
                
                    if (response && response?.status === 200) {
                            const results = response?.data;
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
            const getUsers =`${URLS.USER_API}/users/`;
            try {
                setIsLoading(true);
                const response = await handleFetch(getUsers);
                
                    if (response && response?.status === 200) {
                            const results = response?.data?.results;
                            const filteredUsers = results?.map(item => {
                            const { createdBy, updateAt, ...rest } = item;
                            return { ...rest };
                        });
                        setShowUsers(filteredUsers);
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
            const getEntities =`${URLS.ENTITY_API}/entities`;
            try {
                setIsLoading(true);
                const response = await handleFetch(getEntities);
                
                    if (response && response?.status === 200) {
                            const results = response?.data;
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


    const onSubmit = async (data) => {
        const urlToUpdate =  `${URLS.ENTITY_API}/employees/${selectedEmployee?.id}`;
      
        try {
            const response = await handlePatch(urlToUpdate, data);
                if (response) {
                    await updateData(response.id, { ...data, id: response.id });
                    toast.success("employee modified successfully", { duration: 900 });
                    setDialogOpen(false);
                }
                else {
                    setDialogOpen(false);
                    toast.error("Erreur lors de la modification de l'employée", { duration: 5000 });
                }
            
          } catch (error) {
            console.error("Error during updated",error);
          }
    };

    const handleShowEmployee = (item) => {
        setSelectedEmployee(item);
        setIsEdited(false);
        setDialogOpen(true);
    };

    const handleEditedEmployee = (item) => {
        setSelectedEmployee(item);
        reset(item);
        setIsEdited(true);
        setDialogOpen(true);
    };

    const disabledEmployee = async (id) => {
        const confirmation = window.confirm("Êtes-vous sûr de vouloir désactiver cet(te) employé(e) ?");
        if (confirmation) {
            // const urlToDisabledEmployee = `${URLS.API_EMPLOYEE}/${id}`;
            const urlToDisabledEmployee =  `${URLS.ENTITY_API}/employees/${id}`;

                    try {
                            const response = await handlePatch(urlToDisabledEmployee, { isActive:false });
                            console.log("response for disabled", response);
                                if (response.errors) {
                                    if (Array.isArray(response.errors)) {
                                        const errorMessages = response.errors.map(error => error.msg).join(', ');
                                        toast.error(errorMessages, { duration: 5000 });
                                      } else {
                                        toast.error(response.errors.msg, { duration: 5000 });
                                      }
                                }
                                else {
                                    setTimeout(()=>{
                                        toast.success("employee disabled successfully", { duration: 5000 });
                                        // window.location.reload();
                                    },[200]);
                                }
                            isDialogOpen && setDialogOpen(false);
                    }
                    catch(error){
                        console.error("Erreur lors de la désactivation employee :", error);
                    }

                    finally{
                        setIsLoading(false);
                        }

            } 
            else {
                console.log("La suppression a été annulée.");
            }
    };

    const enabledEmployee = async (id) => {
        const confirmation = window.confirm("Êtes-vous sûr de vouloir réactiver cet(te) employé(e) ?");

        if (confirmation) {
            // const urlToEnabledEmployee = `${URLS.API_EMPLOYEE}/${id}`;
            const urlToEnabledEmployee =  `${URLS.ENTITY_API}/employees/${id}`;

                    try {
                            const response = await handlePatch(urlToEnabledEmployee, {isActive:true});
                            console.log("response for enable", response);
                                if (response) {
                                    setTimeout(()=>{
                                        toast.success("employee enabled successfully", { duration: 5000});
                                        window.location.reload();
                                    },[200]);
                                }
                                else {
                                  toast.error("Erreur lors de la réactivation employee", { duration: 5000 });
                                }
                            isDialogOpen && setDialogOpen(false);
                    }
                    catch(error){
                        console.error("Erreur lors de la réactivation employee :", error);
                    }

                    finally{
                        setIsLoading(false);
                        }

            } 
            else {
                console.log("La suppression a été annulée.");
            }
    };
    
    const deletedEmployee = async (id) => {
        const confirmation = window.confirm("Êtes-vous sûr de vouloir supprimer cet(te) employé(e) ?");

        if (confirmation) {
            const urlToDeletedEmployee = `${URLS.ENTITY_API}/employees/${id}`;

                    try {
                            const response = await handleDelete(urlToDeletedEmployee, {isActive:false});
                                if (response) {
                                    await delEmployee(id);
                                    toast.success("Employee supprimé avec succès", { duration: 5000});
                                }
                                else {
                                  toast.error("Erreur lors de la suppression employee", { duration: 5000 });
                                }
                            isDialogOpen && setDialogOpen(false);
                    }
                    catch(error){
                        console.error("Erreur lors de la suppression employee :", error);
                    }

                    finally{
                        setIsLoading(false);
                        }

            } 
            else {
                console.log("La suppression a été annulée.");
            }
    };


    const showDialogEmployee = () => {
        return (
            <AlertDialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                <AlertDialogContent
                     className="w-[90%] sm:w-[80%] md:w-[60%] lg:w-[50%] xl:w-[40%] max-h-[80vh] overflow-y-auto p-4 bg-white rounded-lg shadow-lg"
                >
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                           <span className='flex text-left'>
                            { isEdited ? " Modifier les informations " : " Détails de l'employé(e) " }
                            </span>
                        </AlertDialogTitle>

                        <AlertDialogDescription>
                            { 
                                isEdited ? 
                                    (
                                        <form
                                            className='flex flex-col space-y-3 mt-5 text-xs' 
                                            onSubmit={handleSubmit(onSubmit)}>
                                       
                                              {/* Step 1 */}
                                                {
                                                    step === 0 && (
                                                    <>
                                                    

                                                        <div className='flex flex-col text-left'>
                                                            <label htmlFor="name" className="block text-xs font-medium mb-0">
                                                                Nom de l'employée <sup className='text-red-500'>*</sup>
                                                            </label>
                                                            <input
                                                                id='name'
                                                                type="text"
                                                                defaultValue={selectedEmployee?.name}
                                                                {...register('name', { required: "Le nom de l'employée est obligatoire." })}
                                                                className={`w-[320px] sm:w-[400px] px-2 py-2 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                                                                errors.name ? "border-red-500" : "border-gray-300"
                                                                }`}
                                                            />
                                                            {errors.name && (
                                                                <p className="text-red-500 text-[9px] mt-1">{errors.name.message}</p>
                                                            )}
                                                        </div>

                                                        <div className='flex flex-col text-left'>
                                                            <label htmlFor="email" className="block text-xs font-medium mb-0">
                                                                Adresse Email Professionnelle <sup className='text-red-500'>*</sup>
                                                            </label>
                                                            <input
                                                                id='email'
                                                                type="text"
                                                                defaultValue={selectedEmployee?.email}
                                                                {...register('email', {
                                                                required: "L'adresse email professionnelle est obligatoire.",
                                                                pattern: {
                                                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                                    message: "Adresse email invalide.",
                                                                },
                                                                })}
                                                                className={`w-[320px] sm:w-[400px] px-2 py-2 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                                                                errors.email ? "border-red-500" : "border-gray-300"
                                                                }`}
                                                            />
                                                            {errors.email && (
                                                                <p className="text-red-500 text-[9px] mt-1">{errors.email.message}</p>
                                                            )}
                                                        </div>

                                                        <div className='flex flex-col text-left'>
                                                            <label htmlFor="phone" className="block text-xs font-medium mb-0">
                                                                Numéro de téléphone professionnel <sup className='text-red-500'>*</sup>
                                                            </label>
                                                            <input
                                                                id='phone'
                                                                type="text"
                                                                defaultValue={selectedEmployee?.phone}
                                                                {...register('phone', { required: "Le numéro de téléphone est obligatoire." })}
                                                                className={`w-[320px] sm:w-[400px] px-2 py-2 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                                                                errors.phone ? "border-red-500" : "border-gray-300"
                                                                }`}
                                                            />
                                                            {errors.phone && (
                                                                <p className="text-red-500 text-[9px] mt-1">{errors.phone.message}</p>
                                                            )}
                                                        </div>

                                                        <div className='flex flex-col text-left'>
                                                                <label htmlFor="entityId" className="block text-xs font-medium flex flex-col text-left">
                                                                    Attribuer une entité<sup className='text-red-500'>*</sup>
                                                                </label>
                                                                <select
                                                                    defaultValue={selectedEmployee?.entityId}
                                                                    onChange={(e) => {
                                                                        const nameEntitiesSelected = showEntities.find(item => item.id === e.target.value);
                                                                        setSelectedEntities(nameEntitiesSelected);
                                                                    }}
                                                                    {...register('entityId')}
                                                                    className={`w-[320px] sm:w-[400px] px-2 py-2 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${
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
                                                        

                                                                <div className='flex flex-col text-left'>
                                                                    <label htmlFor="functionId" className="block text-xs font-medium mb-1">
                                                                        Nom de la fonction<sup className='text-red-500'>*</sup>
                                                                    </label>
                                                                    <select
                                                                        defaultValue={selectedEmployee?.functionId}
                                                                        onChange={(e) => {
                                                                            const nameFunctionSelected = showFunction.find(item => item.id === e.target.value);
                                                                            setSelectedFunction(nameFunctionSelected);
                                                                        }}
                                                                        {...register('functionId')}
                                                                        className={`w-[320px] sm:w-[400px] px-2 py-2 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${
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

                                                                <div className='flex flex-col text-left'>
                                                                    <label htmlFor="gradeId" className="block text-xs font-medium mb-1">
                                                                        Nom du grade <sup className='text-red-500'>*</sup>
                                                                    </label>
                                                                    <select
                                                                        defaultValue={selectedEmployee?.gradeId}
                                                                        onChange={(e) => {
                                                                            const nameGradeSelected = showGrade.find(item => item.id === e.target.value);
                                                                            setSelectedGrade(nameGradeSelected);
                                                                        }}
                                                                        {...register('gradeId')}
                                                                        className={`w-[320px] sm:w-[400px] px-2 py-2 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${
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

                                                                <div className='flex flex-col text-left'>
                                                                    <label htmlFor="echelonId" className="block text-xs font-medium mb-1">
                                                                        Nom de l'échelon <sup className='text-red-500'>*</sup>
                                                                    </label>
                                                                    <select
                                                                        defaultValue={selectedEmployee?.echelonId}
                                                                        onChange={(e) => {
                                                                            const nameEchelonSelected = showEchelon.find(item => item.id === e.target.value);
                                                                            setSelectedEchelon(nameEchelonSelected);
                                                                        }}
                                                                        {...register('echelonId')}
                                                                        className={`w-[320px] sm:w-[400px] px-2 py-2 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${
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
                                                                

                                                                    <div className='flex flex-col text-left'>
                                                                        <label htmlFor="categoryId" className="block text-xs font-medium mb-1">
                                                                            Nom de la catégorie <sup className='text-red-500'>*</sup>
                                                                        </label>
                                                                        <select
                                                                            defaultValue={selectedEmployee?.categoryId}
                                                                            onChange={(e) => {
                                                                                const nameCategoriesSelected = showCategories.find(item => item.id === e.target.value);
                                                                                setSelectedCategories(nameCategoriesSelected);
                                                                            }}
                                                                            {...register('categoryId')}
                                                                            className={`w-[320px] sm:w-[400px] px-2 py-2 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${
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

                                                                    <div className='flex flex-col text-left'>
                                                                        <label htmlFor="userId" className="block text-xs font-medium mb-1">
                                                                            Nom de l'utilisateur <sup className='text-red-500'>*</sup>
                                                                        </label>
                                                                        <select
                                                                            defaultValue={selectedEmployee?.userId}
                                                                            onChange={(e) => {
                                                                                const nameUserSelected = showUsers.find(item => item.id === e.target.value);
                                                                                setSelectedUsers(nameUserSelected);
                                                                            }}
                                                                            {...register('userId')}
                                                                            className={`w-[320px] sm:w-[400px] px-2 py-2 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${
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

                                                                    <div className='mb-1 hidden'>
                                                                        <label htmlFor="createdBy" className="block text-xs font-medium mb-0">
                                                                                créer par<sup className='text-red-500'>*</sup>
                                                                            </label>
                                                                            <input 
                                                                                id='createdBy'
                                                                                type="text"
                                                                                defaultValue={tokenUser}
                                                                                {...register('createdBy')}
                                                                                className={`w-[320px] sm:w-[400px] px-2 py-2 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900
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
                                                <div className='flex space-x-2 justify-end'>
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
                                                                    type="submit"
                                                                    disabled={isSubmitting}
                                                                
                                                                    className="border-2 px-4 py-3 border-green-900 outline-green-900 text-green-900 text-xs shadow-md bg-transparent hover:bg-green-700 hover:text-white transition"
                                                                    >
                                                                    {isSubmitting ? "validation en cours..." : "valider"}
                                                                </Button>
                                                            )
                                                        }
                                                    
                                                    
                                                    <AlertDialogCancel 
                                                        className="border-2 border-black outline-black text-black text-xs shadow-md hover:bg-black hover:text-white transition"
                                                        onClick={() => setDialogOpen(false)}>
                                                            Retour
                                                    </AlertDialogCancel>
                                                </div>
                                              <Toaster/>
                                        </form>
                                    ) : 
                                    (
                                        selectedEmployee && (
                                            <div className='flex flex-col text-black text-left space-y-3'>
                                                <div>
                                                    <p className="text-xs">Identifiant Unique</p>
                                                    <h3 className="font-bold text-sm">{selectedEmployee?.id}</h3>
                                                </div>
                                                <div>
                                                    <p className="text-xs">Nom de l'employé(e)</p>
                                                    <h3 className="font-bold text-sm">{selectedEmployee?.name}</h3>
                                                </div>
                                                <div>
                                                    <p className="text-xs">Adresse Email Professionnelle</p>
                                                    <h3 className="font-bold text-sm">{selectedEmployee?.email}</h3>
                                                </div>
                                                <div>
                                                    <p className="text-xs">Numéro de téléphone professionnel</p>
                                                    <h3 className="font-bold text-sm">{selectedEmployee?.phone}</h3>
                                                </div>
                                                <div>
                                                    <p className="text-xs">Nom de l'entité</p>
                                                    <h3 className="font-bold text-sm">{selectedEmployee?.entityId}</h3>
                                                </div>
                                                <div>
                                                    <p className="text-xs">Non de la fonction</p>
                                                    <h3 className="font-bold text-sm">{selectedEmployee?.functionId}</h3>
                                                </div>
                                                <div>
                                                    <p className="text-xs">Non du grade</p>
                                                    <h3 className="font-bold text-sm">{selectedEmployee?.gradeId}</h3>
                                                </div>
                                                <div>
                                                    <p className="text-xs">Non de l'échelon</p>
                                                    <h3 className="font-bold text-sm">{selectedEmployee?.echelonId}</h3>
                                                </div>
                                                <div>
                                                    <p className="text-xs">Non de la catégorie</p>
                                                    <h3 className="font-bold text-sm">{selectedEmployee?.categoryId}</h3>
                                                </div>
                                                <div>
                                                    <p className="text-xs">Non de l'utilisateur</p>
                                                    <h3 className="font-bold text-sm">{selectedEmployee?.name}</h3>
                                                </div>
                                                <div>
                                                    <p className="text-xs">Date de création</p>
                                                    <h3 className="font-bold text-sm">{selectedEmployee?.createdAt.split("T")[0]}</h3>
                                                </div>
                                                <div>
                                                    <p className="text-xs">Statut</p>
                                                    <h3 className="font-bold text-sm">
                                                        { selectedEmployee?.isActive ? "Actif" : "Désactivé" }
                                                    </h3>
                                                </div>
                                            </div>
                                        )
                                    )
                            }
                        </AlertDialogDescription>

                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        {
                        isEdited === false &&
                            (
                                <div className='flex space-x-2'>
                                                <div className='flex space-x-2'>
                                                    {/* { 
                                                        selectedEmployee?.isActive == false ? 
                                                            (
                                                                    <AlertDialogAction
                                                                        className="border-2 border-blue-600 outline-blue-700 text-blue-700 text-xs shadow-md bg-transparent hover:bg-blue-600 hover:text-white transition"
                                                                        onClick={() => enabledEmployee(selectedEmployee.id)}>
                                                                            Activer
                                                                    </AlertDialogAction>

                                                            ):(

                                                                    <AlertDialogAction 
                                                                        className="border-2 border-gray-600 outline-gray-700 text-gray-700 text-xs shadow-md bg-transparent hover:bg-gray-600 hover:text-white transition"
                                                                        onClick={() => disabledEmployee(selectedEmployee.id)}>
                                                                            Désactiver
                                                                    </AlertDialogAction>
                                                            )
                                                    
                                                    } */}
                                                
                                            </div>
                                                <AlertDialogAction 
                                                    className="border-2 border-red-900 outline-red-700 text-red-900 text-xs shadow-md bg-transparent hover:bg-red-600 hover:text-white transition"
                                                    onClick={() => deletedEmployee(selectedEmployee.id)}>
                                                        Supprimer
                                                </AlertDialogAction>
                                                <AlertDialogCancel
                                                    className="border-2 border-black outline-black text-black text-xs shadow-md hover:bg-black hover:text-white transition"
                                                    onClick={() => setDialogOpen(false)}>
                                                        Retour
                                                </AlertDialogCancel>
                                                
                                </div>
                            )
                        }
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        );
    };


    const columnsEmployee = useMemo(() => [
        { accessorKey: 'name', header: 'Nom de l\'employé(e)' },
        // { accessorKey: 'first_name', header: 'Prénom' },
        { accessorKey: 'email', header: 'Adresse mail' },
        { accessorKey: 'phone', header: 'Téléphone' },
        // { accessorKey: 'address', header: 'Localisation' },
        // { accessorKey: 'date_of_birth', header: 'Date de naissance' },
        // { accessorKey: 'picture', header: 'Photo de profil' },
        { accessorKey: 'entityId', header: 'Nom de l\'entité' },
        { accessorKey: 'functionId', header: 'Nom de la fonction' },
        { accessorKey: 'gradeId', header: 'Nom du grade' },
        { accessorKey: 'echelonId', header: 'Nom de l\'échelon' },
        { accessorKey: 'categoryId', header: 'Nom de la catégorie' },
        { accessorKey: 'userId', header: 'Nom de l\'utilisateur' },
        { accessorKey: 'isActive', header: 'Statut' },
        {
            accessorKey: "action",
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex justify-center">
                    <EyeIcon className="h-4 w-4 text-green-500" onClick={() => handleShowEmployee(row.original)} />
                    <PencilSquareIcon className="h-4 w-4 text-blue-500" onClick={() => handleEditedEmployee(row.original)} />
                    {/* <NoSymbolIcon className="h-4 w-4 text-gray-500" onClick={() => disabledEmployee(row.original.id)} /> */}
                    <TrashIcon className="h-4 w-4 text-red-500" onClick={() => deletedEmployee(row.original.id)} />
                </div>
            )
        },
    ], []);


    return {

                showDialogEmployee,
                columnsEmployee,
                handleShowEmployee,
                handleEditedEmployee,
             
    };
};