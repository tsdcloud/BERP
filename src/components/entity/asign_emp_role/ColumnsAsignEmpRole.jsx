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
import { Button } from "../../ui/button";
import { useFetch } from '../../../hooks/useFetch';
import toast, { Toaster } from 'react-hot-toast';
import { URLS } from '../../../../configUrl';
import { jwtDecode } from 'jwt-decode';






// Schéma de validation avec Zod
const asignEmpRoleSchema = z.object({

    employeeId: z.string()
    .nonempty('Ce champs "Nom de employee" est réquis')
    .min(4, "La valeur de ce champs doit contenir au moins 4 caractères.")
    .max(100)
    .regex(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[4][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/, 
      "Ce champs doit être un 'nom de employee' Conforme."),

    roleId: z.string()
    .nonempty('Ce champs "Nom du role" est réquis')
    .min(4, "La valeur de ce champs doit contenir au moins 4 caractères.")
    .max(100)
    .regex(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[4][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/, 
      "Ce champs doit être un 'nom du role' Conforme."),

    createdBy: z.string().nonempty("Le champ 'createdBy' est requis."),

    });

// Fonction principale pour gérer les actions utilisateur
export const AsignEmpRoleAction = () => {
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isEdited, setIsEdited] = useState(true);
    const [selectedAsignEmpRole, setSelectedAsignEmpRole] = useState({});
    const [selectedEmployee, setSelectedEmployee] = useState([]);
    const [selectedRole, setSelectedRole] = useState([]);
    const [showEmployee, setShowEmployee] = useState([]);
    const [showRole, setShowRole] = useState([]);
    const [tokenUser, setTokenUser] = useState();
    const [error, setError] = useState();

    const { register, handleSubmit, reset, formState:{errors, isSubmitting} } = useForm({
        resolver: zodResolver(asignEmpRoleSchema),
    });

   const { handlePatch, handleDelete, handleFetch } = useFetch();
   

   const fetchEmployee = async () => {
    const getEmployee =  `${URLS.ENTITY_API}/employees`;
    try {
        setIsLoading(true);
        const response = await handleFetch(getEmployee);
        
            if (response && response?.status === 200) {
                    const results = response?.data;
                    // console.log("results", results);

                    const filteredEmployee = results?.map(item => {
                    const { createdBy, updateAt, ...rest } = item;
                    return { 
                        id:rest.id, 
                        ...rest
                    };
                });
                    // console.log("districts - Town",filteredEmployee);
                    setShowEmployee(filteredEmployee);
            }
            else{
                throw new Error('Erreur lors de la récupération des employées');
            }
    } catch (error) {
        setError(error.message);
    }
    finally {
        setIsLoading(false);
      }
     };
     
   const fetchRole = async () => {
    const getRole =  `${URLS.ENTITY_API}/roles`;
    try {
        setIsLoading(true);
        const response = await handleFetch(getRole);
        
            if (response && response?.status === 200) {
                    const results = response?.data;
                    // console.log("results", results);

                    const filteredRole = results?.map(item => {
                    const { createdBy, updateAt, ...rest } = item;
                    return { 
                        id:rest.id, 
                        ...rest
                    };
                });
                    // console.log("districts - Town",filteredRole);
                    setShowRole(filteredRole);
            }
            else{
                throw new Error('Erreur lors de la récupération des rôles');
            }
    } catch (error) {
        setError(error.message);
    }
    finally {
        setIsLoading(false);
      }
     };

  useEffect(()=>{
    fetchEmployee();
    fetchRole();
  },[]);

   useEffect(()=>{
    const token = localStorage.getItem("token");
    if(token){
        const decode = jwtDecode(token);
        setTokenUser(decode.user_id);
        // console.log("var", tokenUser);
    }
  }, [tokenUser]);



    const onSubmit = async (data) => {
        // const urlToUpdate = `${URLS.API_DEPARTMENT}/${selectedAsignEmpRole?.id}`;
        const urlToUpdate = `${URLS.ENTITY_API}/employee-roles/${selectedAsignEmpRole?.id}`;
      
        try {
            const response = await handlePatch(urlToUpdate, data);
            // console.log("response role update", response);
                if (response) {
                    setDialogOpen(false);
                        
                    setTimeout(()=>{
                        toast.success("emp - role modified successfully", { duration: 900 });
                        window.location.reload();
                    },[200]);
                }
                else {
                    setDialogOpen(false);
                    toast.error("Erreur lors de la modification de emp - role", { duration: 5000 });
                }
            
          } catch (error) {
            console.error("Error during updated",error);
          }
    };

    const handleShowAsignEmpRole = (item) => {
        setSelectedAsignEmpRole(item);
        setIsEdited(false);
        setDialogOpen(true);
    };

    const handleEditAsignEmpRole = (item) => {
        setSelectedAsignEmpRole(item);
        reset(item);
        setIsEdited(true);
        setDialogOpen(true);
    };

    const disabledAsignEmpRole = async (id) => {
        const confirmation = window.confirm("Êtes-vous sûr de vouloir désactiver cette asignation ?");
        if (confirmation) {
            // const urlToDisabledAsignEmpRole = `${URLS.API_DEPARTMENT}/${id}`;
            const urlToDisabledAsignEmpRole =  `${URLS.ENTITY_API}/employee-roles/${id}`;

                    try {
                            const response = await handlePatch(urlToDisabledAsignEmpRole, { isActive:false });
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
                                        toast.success("asign emp - role disabled successfully", { duration: 5000 });
                                        // window.location.reload();
                                    },[200]);
                                }
                            isDialogOpen && setDialogOpen(false);
                    }
                    catch(error){
                        console.error("Erreur lors de la désactivation asign emp - role :", error);
                    }

                    finally{
                        setIsLoading(false);
                        }

            } 
            else {
                console.log("La suppression a été annulée.");
            }
    };

    const enableAsignEmpRole = async (id) => {
        const confirmation = window.confirm("Êtes-vous sûr de vouloir désactiver cette asignation ?");

        if (confirmation) {
            // const urlToEnabledAsignEmpRole = `${URLS.API_DEPARTMENT}/${id}`;
            const urlToEnabledAsignEmpRole =  `${URLS.ENTITY_API}/employee-roles/${id}`;

                    try {
                            const response = await handlePatch(urlToEnabledAsignEmpRole, {isActive:true});
                            console.log("response for deleted", response);
                                if (response) {
                                    setTimeout(()=>{
                                        toast.success("asign emp - role enabled successfully", { duration: 5000});
                                        window.location.reload();
                                    },[200]);
                                }
                                else {
                                  toast.error("Erreur lors de la réactivation asign emp - role", { duration: 5000 });
                                }
                            isDialogOpen && setDialogOpen(false);
                    }
                    catch(error){
                        console.error("Erreur lors de la réactivation asign emp - role :", error);
                    }

                    finally{
                        setIsLoading(false);
                        }

            } 
            else {
                console.log("La suppression a été annulée.");
            }
    };
    
    const deletedAsignEmpRole = async (id) => {
        const confirmation = window.confirm("Êtes-vous sûr de vouloir supprimer cette asignation ?");

        if (confirmation) {
            const urlToDeletedAsignEmpRole =  `${URLS.ENTITY_API}/employee-roles/${id}`;

                    try {
                            const response = await handleDelete(urlToDeletedAsignEmpRole, {isActive:false});
                            // console.log("response for deleted", response);
                                if (response) {
                                    setTimeout(()=>{
                                        toast.success("asign emp - role disabled successfully", { duration: 5000});
                                        window.location.reload();
                                    },[200]);
                                }
                                else {
                                  toast.error("Erreur lors de la désactivation asign emp - role", { duration: 5000 });
                                }
                            isDialogOpen && setDialogOpen(false);
                    }
                    catch(error){
                        console.error("Erreur lors de la désactivation asign emp - role :", error);
                    }

                    finally{
                        setIsLoading(false);
                        }

            } 
            else {
                console.log("La suppression a été annulée.");
            }
    };


    const showDialogAsignEmpRole = () => {
        return (
            <AlertDialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            { isEdited ? "Modifier les informations" : "Détails de l'assignation des employées - rôles" }
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            { isEdited ? (
                                <form
                                    className='flex flex-col space-y-3 mt-5 text-xs' 
                                     onSubmit={handleSubmit(onSubmit)}>
                                    {/* <div>
                                            <label htmlFor='name' className="text-xs mt-2">
                                                Nom du departement <sup className='text-red-500'>*</sup>
                                            </label>
                                            <Input
                                                id="name"
                                                type="text"
                                                defaultValue={selectedAsignEmpRole?.name}
                                                {...register("name")}
                                                className={`w-[400px] mb-2 text-bold px-2 py-3 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                                                    errors.name ? "border-red-500" : "border-gray-300"
                                                }`}
                                                />
                                                {errors.name && (
                                                <p className="text-red-500 text-[9px] mt-1">{errors.name.message}</p>
                                                )}
                                    </div> */}
                                    <div className=' flex flex-col'>
                                            <label htmlFor='employeeId' className="text-xs mt-2">
                                                Nom de l'employée <sup className='text-red-500'>*</sup>
                                            </label>
                                                    <select
                                                        onChange={(e) => {
                                                            const nameEmployeeSelected = showEmployee.find(item => item.id === e.target.value);
                                                            setSelectedEmployee(nameEmployeeSelected);
                                                        }}
                                                        defaultValue={selectedAsignEmpRole?.employeeId}
                                                        {...register('employeeId')}
                                                        className={`w-[400px] mb-2 text-bold px-2 py-3 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                                                            errors.employeeId ? "border-red-500" : "border-gray-300"
                                                        }`}
                                                    >
                                                     <option value="">Selectionner un(e) employé(e)</option>
                                                        {
                                                            showEmployee.map((item) => (
                                                                <option key={item.id} value={item.id}>
                                                                    {item.name}
                                                                </option>
                                                            ))
                                                        }
                                                </select>
                                                {errors.employeeId && (
                                                <p className="text-red-500 text-[9px] mt-1">{errors.employeeId.message}</p>
                                                )}
                                    </div>

                                    <div className=' flex flex-col'>
                                            <label htmlFor='roleId' className="text-xs mt-2">
                                                Nom du rôle <sup className='text-red-500'>*</sup>
                                            </label>
                                                    <select
                                                    onChange={(e) => {
                                                        const nameRoleSelected = showRole.find(item => item.id === e.target.value);
                                                        setSelectedRole(nameRoleSelected);
                                                    }}
                                                    defaultValue={selectedAsignEmpRole?.roleId}
                                                    {...register('roleId')}
                                                    className={`w-[400px] mb-2 text-bold px-2 py-3 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                                                        errors.roleId ? "border-red-500" : "border-gray-300"
                                                    }`}
                                                >
                                                    <option value="">Selectionner un rôle</option>
                                                    {showRole.map((item) => (
                                                        <option key={item.id} value={item.id}>
                                                            {item.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.roleId && (
                                                <p className="text-red-500 text-[9px] mt-1">{errors.roleId.message}</p>
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
                                    <div className='flex space-x-2 justify-end'>
                                        <Button 
                                            type="submit"
                                            disabled={isSubmitting}
                                        
                                            className="border-2 px-4 py-3 border-green-900 outline-green-900 text-green-900 text-xs shadow-md bg-transparent hover:bg-green-700 hover:text-white transition"
                                            >
                                            {isSubmitting ? "validation en cours..." : "valider"}
                                        </Button>
                                        
                                        <AlertDialogCancel 
                                            className="border-2 border-black outline-black text-black text-xs shadow-md hover:bg-black hover:text-white transition"
                                            onClick={() => setDialogOpen(false)}>
                                                Retour
                                        </AlertDialogCancel>
                                    </div>
                                <Toaster/>
                                </form>
                            ) : (
                                selectedAsignEmpRole && (
                                    <div className='flex flex-col text-black space-y-3'>
                                        <div>
                                            <p className="text-xs">Identifiant Unique</p>
                                            <h3 className="font-bold text-sm">{selectedAsignEmpRole?.id}</h3>
                                        </div>
                                        <div>
                                            <p className="text-xs">Nom de l'employée</p>
                                            <h3 className="font-bold text-sm">{selectedAsignEmpRole?.employeeId}</h3>
                                        </div>
                                        <div>
                                            <p className="text-xs">Nom du rôle</p>
                                            <h3 className="font-bold text-sm">{selectedAsignEmpRole?.roleId}</h3>
                                        </div>
                                        <div>
                                            <p className="text-xs">Date de création</p>
                                            <h3 className="font-bold text-sm">{selectedAsignEmpRole?.createdAt.split("T")[0]}</h3>
                                        </div>
                                        <div>
                                            <p className="text-xs">Statut</p>
                                            <h3 className="font-bold text-sm">
                                                {selectedAsignEmpRole?.isActive ? "Actif" : "Désactivé"}
                                            </h3>
                                        </div>
                                    </div>
                                )
                            )}
                        </AlertDialogDescription>

                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        {
                        isEdited === false ? (
                            <div className='flex space-x-2'>
                                            <div className='flex space-x-2'>
                                                {/* { 
                                                    selectedAsignEmpRole?.is_active == false ? 
                                                        (
                                                                <AlertDialogAction
                                                                    className="border-2 border-blue-600 outline-blue-700 text-blue-700 text-xs shadow-md bg-transparent hover:bg-blue-600 hover:text-white transition"
                                                                    onClick={() => enableAsignEmpRole(selectedAsignEmpRole.id)}>
                                                                        Activer
                                                                </AlertDialogAction>

                                                        ):(

                                                                <AlertDialogAction 
                                                                    className="border-2 border-gray-600 outline-gray-700 text-gray-700 text-xs shadow-md bg-transparent hover:bg-gray-600 hover:text-white transition"
                                                                    onClick={() => disabledAsignEmpRole(selectedAsignEmpRole.id)}>
                                                                        Désactiver
                                                                </AlertDialogAction>
                                                        )
                                                
                                                } */}
                                            
                                           </div>
                                            <AlertDialogAction 
                                                className="border-2 border-red-900 outline-red-700 text-red-900 text-xs shadow-md bg-transparent hover:bg-red-600 hover:text-white transition"
                                                onClick={() => deletedAsignEmpRole(selectedAsignEmpRole.id)}>
                                                    Supprimer
                                            </AlertDialogAction>
                                            <AlertDialogCancel 
                                                className="border-2 border-black outline-black text-black text-xs shadow-md hover:bg-black hover:text-white transition"
                                                onClick={() => setDialogOpen(false)}>
                                                    Retour
                                            </AlertDialogCancel>
                                            
                            </div>
                        ) : (
                           null
                        )
                        }
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        );
    };


    const ColumnsAsignEmpRole = useMemo(() => [
        { accessorKey: 'employeeId', header: 'Nom de l\'employé(e)' },
        { accessorKey: 'roleId', header: 'Nom du rôle' },
        { accessorKey: 'isActive', header: 'Statut' },
        {
            accessorKey: "action",
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex justify-center">
                    <EyeIcon className="h-4 w-4 text-green-500" onClick={() => handleShowAsignEmpRole(row.original)} />
                    {/* <PencilSquareIcon className="h-4 w-4 text-blue-500" onClick={() => handleEditAsignEmpRole(row.original)} /> */}
                    {/* <NoSymbolIcon className="h-4 w-4 text-gray-500" onClick={() => disabledAsignEmpRole(row.original.id)} /> */}
                    <TrashIcon className="h-4 w-4 text-red-500" onClick={() => deletedAsignEmpRole(row.original.id)} />
                </div>
            )
        },
    ], []);


    return {

                showDialogAsignEmpRole,
                ColumnsAsignEmpRole,
                handleShowAsignEmpRole,
                handleEditAsignEmpRole,
             
    };
};