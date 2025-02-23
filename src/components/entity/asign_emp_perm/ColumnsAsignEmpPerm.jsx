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
const asignEmpPermSchema = z.object({
    employeeId: z.string()
    .nonempty('Ce champs "Nom de employé" est réquis')
    .min(4, "La valeur de ce champs doit contenir au moins 4 caractères.")
    .max(100)
    .regex(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[4][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/, 
        "Ce champs doit être un 'nom de employé' Conforme."),
        
    permissionId: z.string()
    .nonempty('Ce champs "Nom de la permission" est réquis')
    .min(4, "La valeur de ce champs doit contenir au moins 4 caractères.")
    .max(100)
    .regex(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[4][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/, 
        "Ce champs doit être un 'nom de la permission' Conforme."),
    
    createdBy: z.string().nonempty("Le champ 'createdBy' est requis."),

    });

// Fonction principale pour gérer les actions utilisateur
export const AsignEmpPermAction = ({ delAsignEmpPerm, updateData }) => {
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isEdited, setIsEdited] = useState(true);
    const [selectedAsignEmpPerm, setSelectedAsignEmpPerm] = useState({});
    const [selectedPermission, setSelectedPermission] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState([]);
    const [showPermission, setShowPermission] = useState([]);
    const [showEmployee, setShowEmployee] = useState([]);
    const [tokenUser, setTokenUser] = useState();
    const [error, setError] = useState();

    const { register, handleSubmit, reset, formState:{errors, isSubmitting} } = useForm({
        resolver: zodResolver(asignEmpPermSchema),
    });

   const { handlePatch, handleDelete, handleFetch } = useFetch();
   

   const fetchPermission = async () => {
    const getPermission =  `${URLS.ENTITY_API}/permissions`;
    try {
        setIsLoading(true);
        const response = await handleFetch(getPermission);
        
            if (response && response?.status === 200) {
                    const results = response?.data;
                    // console.log("results", results);

                    const filteredPermission = results?.map(item => {
                    const { createdBy, updateAt, ...rest } = item;
                    return { 
                        id:rest.id, 
                        ...rest
                    };
                });
                    // console.log("districts - Town",filteredPermission);
                    setShowPermission(filteredPermission);
            }
            else{
                throw new Error('Erreur lors de la récupération des permission');
            }
    } catch (error) {
        setError(error.message);
    }
    finally {
        setIsLoading(false);
      }
     };
     
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
                throw new Error('Erreur lors de la récupération des employés');
            }
    } catch (error) {
        setError(error.message);
    }
    finally {
        setIsLoading(false);
      }
     };

  useEffect(()=>{
    fetchPermission();
    fetchEmployee();
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
        const urlToUpdate = `${URLS.ENTITY_API}/employee-permissions/${selectedAsignEmpPerm?.id}`;
      
        try {
            const response = await handlePatch(urlToUpdate, data);
            // console.log("response role update", response);
                if (response) {
                    await updateData(response.id, { ...data, id: response.id });
                    toast.success("Employee - Permission modified successfully", { duration: 900 });
                    setDialogOpen(false);
                }
                else {
                    setDialogOpen(false);
                    toast.error("Erreur lors de la modification de Emp - Perm", { duration: 5000 });
                }
            
          } catch (error) {
            console.error("Error during updated",error);
          }
    };

    const handleShowAsignEmpPerm = (item) => {
        setSelectedAsignEmpPerm(item);
        setIsEdited(false);
        setDialogOpen(true);
    };

    const handleEditAsignEmpPerm = (item) => {
        setSelectedAsignEmpPerm(item);
        reset(item);
        setIsEdited(true);
        setDialogOpen(true);
    };

    const disabledAsignEmpPerm = async (id) => {
        const confirmation = window.confirm("Êtes-vous sûr de vouloir désactiver cette asignation ?");
        if (confirmation) {
            const urlToDisabledAsignEmpPerm =  `${URLS.ENTITY_API}/employee-permissions/${id}`;

                    try {
                            const response = await handlePatch(urlToDisabledAsignEmpPerm, { isActive:false });
                            // console.log("response for disabled", response);
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
                                        toast.success("asign Emp - Perm disabled successfully", { duration: 5000 });
                                        // window.location.reload();
                                    },[200]);
                                }
                            isDialogOpen && setDialogOpen(false);
                    }
                    catch(error){
                        console.error("Erreur lors de la désactivation asign Emp - Perm :", error);
                    }

                    finally{
                        setIsLoading(false);
                        }

            } 
            else {
                console.log("La suppression a été annulée.");
            }
    };

    const AsignEmpPerm = async (id) => {
        const confirmation = window.confirm("Êtes-vous sûr de vouloir désactiver cette asignation ?");

        if (confirmation) {
            const urlToEnabledEmpPerm =  `${URLS.ENTITY_API}/employee-permissions/${id}`;

                    try {
                            const response = await handlePatch(urlToEnabledEmpPerm, {isActive:true});
                            // console.log("response for deleted", response);
                                if (response) {
                                    setTimeout(()=>{
                                        toast.success("asign Emp - Perm enabled successfully", { duration: 5000});
                                        window.location.reload();
                                    },[200]);
                                }
                                else {
                                  toast.error("Erreur lors de la réactivation asign Emp - Perm", { duration: 5000 });
                                }
                            isDialogOpen && setDialogOpen(false);
                    }
                    catch(error){
                        console.error("Erreur lors de la réactivation asign Emp - Perm :", error);
                    }

                    finally{
                        setIsLoading(false);
                        }

            } 
            else {
                console.log("La suppression a été annulée.");
            }
    };
    
    const deletedAsignEmpPerm = async (id) => {
        const confirmation = window.confirm("Êtes-vous sûr de vouloir supprimer cette asignation ?");

        if (confirmation) {
            const urlToDeletedAsignEmpPerm =  `${URLS.ENTITY_API}/employee-permissions/${id}`;

                    try {
                            const response = await handleDelete(urlToDeletedAsignEmpPerm, {isActive:false});
                            // console.log("response for deleted", response);
                                if (response) {
                                    await delAsignEmpPerm(id);
                                     toast.success("Asignation Employée - Permission supprimé avec succès", { duration: 5000});
                                }
                                else {
                                  toast.error("Erreur lors de la désactivation asign Emp - Perm", { duration: 5000 });
                                }
                            isDialogOpen && setDialogOpen(false);
                    }
                    catch(error){
                        console.error("Erreur lors de la désactivation asign Emp - Perm :", error);
                    }

                    finally{
                        setIsLoading(false);
                        }

            } 
            else {
                console.log("La suppression a été annulée.");
            }
    };


    const showDialogAsignEmpPerm = () => {
        return (
            <AlertDialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                <AlertDialogContent
                className="w-[90%] sm:w-[80%] md:w-[60%] lg:w-[50%] xl:w-[40%] max-h-[80vh] overflow-y-auto p-4 bg-white rounded-lg shadow-lg"
                >
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            <span className='flex text-left'>
                            { isEdited ? "Modifier les informations" : "Détails de l'assignation des Employé(e)s - permissions" }
                            </span>
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            { isEdited ? (
                                <form
                                    className='flex flex-col space-y-3 mt-5 text-xs' 
                                     onSubmit={handleSubmit(onSubmit)}>
                                    <div className=' flex flex-col text-left'>
                                            <label htmlFor='employeeId' className="text-xs mt-2">
                                                Nom de l'employée <sup className='text-red-500'>*</sup>
                                            </label>
                                                    <select
                                                        onChange={(e) => {
                                                            const nameEmployeeSelected = showEmployee.find(item => item.id === e.target.value);
                                                            setSelectedEmployee(nameEmployeeSelected);
                                                        }}
                                                        defaultValue={selectedAsignEmpPerm?.employeeId}
                                                        {...register('employeeId')}
                                                        className={`w-[320px] sm:w-[400px] mb-2 text-bold px-2 py-3 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                                                            errors.employeeId ? "border-red-500" : "border-gray-300"
                                                        }`}
                                                    >
                                                     <option value="">Selectionner un employée</option>
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

                                    <div className=' flex flex-col text-left'>
                                            <label htmlFor='permissionId' className="text-xs mt-2">
                                                Nom de la permission <sup className='text-red-500'>*</sup>
                                            </label>
                                                    <select
                                                    onChange={(e) => {
                                                        const namePermissionSelected = showPermission.find(item => item.id === e.target.value);
                                                        setSelectedPermission(namePermissionSelected);
                                                    }}
                                                    defaultValue={selectedAsignEmpPerm?.permissionId}
                                                    {...register('permissionId')}
                                                    className={`w-[320px] sm:w-[400px] mb-2 text-bold px-2 py-3 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                                                        errors.permissionId ? "border-red-500" : "border-gray-300"
                                                    }`}
                                                >
                                                    <option value="">Selectionner une permission</option>
                                                    {showPermission.map((item) => (
                                                        <option key={item.id} value={item.id}>
                                                            {item.displayName}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.permissionId && (
                                                <p className="text-red-500 text-[9px] mt-1">{errors.permissionId.message}</p>
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
                                selectedAsignEmpPerm && (
                                    <div className='flex flex-col text-left text-black space-y-3'>
                                        <div>
                                            <p className="text-xs">Identifiant Unique</p>
                                            <h3 className="font-bold text-sm">{selectedAsignEmpPerm?.id}</h3>
                                        </div>
                                        <div>
                                            <p className="text-xs">Nom de l'employé(e)</p>
                                            <h3 className="font-bold text-sm">{selectedAsignEmpPerm?.employeeId}</h3>
                                        </div>
                                        <div>
                                            <p className="text-xs">Nom de la permission</p>
                                            <h3 className="font-bold text-sm">{selectedAsignEmpPerm?.permissionId}</h3>
                                        </div>
                                        <div>
                                            <p className="text-xs">Date de création</p>
                                            <h3 className="font-bold text-sm">{selectedAsignEmpPerm?.createdAt.split("T")[0]}</h3>
                                        </div>
                                        <div>
                                            <p className="text-xs">Statut</p>
                                            <h3 className="font-bold text-sm">
                                                {selectedAsignEmpPerm?.isActive ? "Actif" : "Désactivé"}
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
                                                    selectedAsignEmpPerm?.is_active == false ? 
                                                        (
                                                                <AlertDialogAction
                                                                    className="border-2 border-blue-600 outline-blue-700 text-blue-700 text-xs shadow-md bg-transparent hover:bg-blue-600 hover:text-white transition"
                                                                    onClick={() => AsignEmpPerm(selectedAsignEmpPerm.id)}>
                                                                        Activer
                                                                </AlertDialogAction>

                                                        ):(

                                                                <AlertDialogAction 
                                                                    className="border-2 border-gray-600 outline-gray-700 text-gray-700 text-xs shadow-md bg-transparent hover:bg-gray-600 hover:text-white transition"
                                                                    onClick={() => disabledAsignEmpPerm(selectedAsignEmpPerm.id)}>
                                                                        Désactiver
                                                                </AlertDialogAction>
                                                        )
                                                
                                                } */}
                                            
                                           </div>
                                            <AlertDialogAction 
                                                className="border-2 border-red-900 outline-red-700 text-red-900 text-xs shadow-md bg-transparent hover:bg-red-600 hover:text-white transition"
                                                onClick={() => deletedAsignEmpPerm(selectedAsignEmpPerm.id)}>
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


    const ColumnsAsignEmpPerm = useMemo(() => [
        { accessorKey: 'employeeId', header: 'Nom de l\'employé' },
        { accessorKey: 'permissionId', header: 'Nom de la permission' },
        { accessorKey: 'isActive', header: 'Statut' },
        {
            accessorKey: "action",
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex justify-center">
                    <EyeIcon className="h-4 w-4 text-green-500" onClick={() => handleShowAsignEmpPerm(row.original)} />
                    {/* <PencilSquareIcon className="h-4 w-4 text-blue-500" onClick={() => handleEditAsignEmpPerm(row.original)} /> */}
                    {/* <NoSymbolIcon className="h-4 w-4 text-gray-500" onClick={() => disabledAsignEmpPerm(row.original.id)} /> */}
                    <TrashIcon className="h-4 w-4 text-red-500" onClick={() => deletedAsignEmpPerm(row.original.id)} />
                </div>
            )
        },
    ], []);


    return {

                showDialogAsignEmpPerm,
                ColumnsAsignEmpPerm,
                handleShowAsignEmpPerm,
                handleEditAsignEmpPerm,
             
    };
};