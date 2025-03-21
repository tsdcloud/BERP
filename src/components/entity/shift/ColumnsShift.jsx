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
const shiftSchema = z.object({
    name: z.string()
  .nonempty("Ce champs 'Nom' est réquis.")
//   .min(2, "le champs doit avoir une valeur de 2 caractères au moins.")
  .max(100)
//   .regex(/^[a-zA-Z0-9 ,() -]+$/, "Ce champ doit être un 'nom' conforme.")
  ,

  startTime: z.string()
  .nonempty("Ce champs 'Heure de début' est réquis.")
  .regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/, "Ce champ doit être au format HH:MM."),

  endTime: z.string()
  .nonempty("Ce champs 'Heure de fin' est réquis.")
  .regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/, "Ce champ doit être au format HH:MM."),

  entityId: z.string()
  .nonempty('Ce champs "Nom de la ville" est réquis')
  .min(4, "La valeur de ce champs doit contenir au moins 4 caractères.")
  .max(100)
  .regex(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[4][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/, 
    "Ce champs doit être un 'nom de entité' Conforme.")
  ,

  createdBy: z.string().nonempty("Le champ 'createdBy' est requis."),

    });

// Fonction principale pour gérer les actions utilisateur
export const ShiftAction = ({delShift, updateData }) => {
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isEdited, setIsEdited] = useState(true);
    const [selectedShift, setSelectedShift] = useState({});
    const [selectedEntities, setSelectedEntities] = useState([]);
    const [showEntities, setShowEntities] = useState([]);
    const [tokenUser, setTokenUser] = useState();
    const [error, setError] = useState();

    const { register, handleSubmit, reset, formState:{errors, isSubmitting} } = useForm({
        resolver: zodResolver(shiftSchema),
    });

   const { handlePatch, handleDelete, handleFetch } = useFetch();
   

   const fetchEntites = async () => {
    const getTown =  `${URLS.ENTITY_API}/entities`;
    try {
        setIsLoading(true);
        const response = await handleFetch(getTown);
        
            if (response && response?.status === 200) {
                    const results = response?.data;
                    const filteredEntities = results?.map(item => {
                    const { createdBy, updateAt, ...rest } = item;
                    return { 
                        id:rest.id, 
                        ...rest
                    };
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

  useEffect(()=>{
    fetchEntites();
  },[]);

   useEffect(()=>{
    const token = localStorage.getItem("token");
    if(token){
        const decode = jwtDecode(token);
        setTokenUser(decode.user_id);
    }
  }, [tokenUser]);


    const onSubmit = async (data) => {
        const urlToUpdate = `${URLS.ENTITY_API}/shifts/${selectedShift?.id}`;
        try {
            const response = await handlePatch(urlToUpdate, data);
                if (response ) {
                    await updateData(response.id, { ...data, id: response.id });
                    toast.success("shift modified successfully", { duration: 900 });
                    setDialogOpen(false);
                }
                else {
                    setDialogOpen(false);
                    toast.error("Erreur lors de la modification du shift", { duration: 5000 });
                }
            
          } catch (error) {
            console.error("Error during updated",error);
          }
    };

    const handleShowShift = (shift) => {
        setSelectedShift(shift);
        setIsEdited(false);
        setDialogOpen(true);
    };

    const handleEditShift = (shift) => {
        setSelectedShift(shift);
        reset(shift);
        setIsEdited(true);
        setDialogOpen(true);
    };

    const disabledShift = async (id) => {
        const confirmation = window.confirm("Êtes-vous sûr de vouloir désactiver ce shift ?");
        if (confirmation) {
            const urlToDisabledShift =  `${URLS.ENTITY_API}/shifts/${id}`;

                    try {
                            const response = await handlePatch(urlToDisabledShift, { isActive:false });
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
                                        toast.success("department disabled successfully", { duration: 5000 });
                                        window.location.reload();
                                    },[200]);
                                }
                            isDialogOpen && setDialogOpen(false);
                    }
                    catch(error){
                        console.error("Erreur lors de la désactivation shift :", error);
                    }

                    finally{
                        setIsLoading(false);
                        }

            } 
            else {
                console.log("La suppression a été annulée.");
            }
    };

    const enableShift = async (id) => {
        const confirmation = window.confirm("Êtes-vous sûr de vouloir désactiver ce shift ?");

        if (confirmation) {
            const urlToEnabledShift =  `${URLS.ENTITY_API}/shifts/${id}`;

                    try {
                            const response = await handlePatch(urlToEnabledShift, {isActive:true});
                            console.log("response for deleted", response);
                                if (response) {
                                    setTimeout(()=>{
                                        toast.success("shift enabled successfully", { duration: 5000});
                                        window.location.reload();
                                    },[200]);
                                }
                                else {
                                  toast.error("Erreur lors de la réactivation shift", { duration: 5000 });
                                }
                            isDialogOpen && setDialogOpen(false);
                    }
                    catch(error){
                        console.error("Erreur lors de la réactivation shift :", error);
                    }

                    finally{
                        setIsLoading(false);
                        }

            } 
            else {
                console.log("La suppression a été annulée.");
            }
    };
    
    const deletedShift = async (id) => {
        const confirmation = window.confirm("Êtes-vous sûr de vouloir supprimer ce shift ?");

        if (confirmation) {
            const urlToDeletedShift =  `${URLS.ENTITY_API}/shifts/${id}`;

                    try {
                            const response = await handleDelete(urlToDeletedShift, {isActive:false});
                                if (response) {
                                    await delShift(id);
                                    toast.success("Shift supprimé avec succès", { duration: 5000});
                                }
                                else {
                                  toast.error("Erreur lors de la suppression shift", { duration: 5000 });
                                }
                            isDialogOpen && setDialogOpen(false);
                    }
                    catch(error){
                        console.error("Erreur lors de la suppression shift :", error);
                    }

                    finally{
                        setIsLoading(false);
                        }

            } 
            else {
                console.log("La suppression a été annulée.");
            }
    };


    const showDialogShift = () => {
        return (
            <AlertDialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                <AlertDialogContent
                className="w-[90%] sm:w-[80%] md:w-[60%] lg:w-[50%] xl:w-[40%] max-h-[80vh] overflow-y-auto p-4 bg-white rounded-lg shadow-lg"
                >
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                           <span className='flex text-left'>
                                { isEdited ? "Modifier les informations" : "Détails du shift" }
                            </span>
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            { isEdited ? (
                                <form
                                    className='flex flex-col space-y-3 mt-5 text-xs' 
                                     onSubmit={handleSubmit(onSubmit)}>
                                    <div className='flex flex-col text-left'>
                                            <label htmlFor='name' className="text-xs mt-2">
                                                Nom du shift <sup className='text-red-500'>*</sup>
                                            </label>
                                            <Input
                                                id="name"
                                                type="text"
                                                defaultValue={selectedShift?.name}
                                                {...register("name")}
                                                className={`w-[320px] sm:w-[400px] mb-2 text-bold px-2 py-3 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                                                    errors.name ? "border-red-500" : "border-gray-300"
                                                }`}
                                                />
                                                {errors.name && (
                                                <p className="text-red-500 text-[9px] mt-1">{errors.name.message}</p>
                                                )}
                                    </div>
                                    <div className='flex flex-col text-left'>
                                            <label htmlFor='startTime' className="text-xs mt-2">
                                                Date de début du shift <sup className='text-red-500'>*</sup>
                                            </label>
                                            <Input
                                                id="startTime"
                                                type="time"
                                                defaultValue={selectedShift?.startTime}
                                                {...register("startTime")}
                                                className={`w-[320px] sm:w-[400px] mb-2 text-bold px-2 py-3 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                                                    errors.startTime ? "border-red-500" : "border-gray-300"
                                                }`}
                                                />
                                                {errors.startTime && (
                                                <p className="text-red-500 text-[9px] mt-1">{errors.startTime.message}</p>
                                                )}
                                    </div>
                                    <div className='flex flex-col text-left'>
                                            <label htmlFor='endTime' className="text-xs mt-2">
                                                Date de fin du shift <sup className='text-red-500'>*</sup>
                                            </label>
                                            <Input
                                                id="endTime"
                                                type="time"
                                                defaultValue={selectedShift?.endTime}
                                                {...register("endTime")}
                                                className={`w-[320px] sm:w-[400px] mb-2 text-bold px-2 py-3 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                                                    errors.endTime ? "border-red-500" : "border-gray-300"
                                                }`}
                                                />
                                                {errors.endTime && (
                                                <p className="text-red-500 text-[9px] mt-1">{errors.endTime.message}</p>
                                                )}
                                    </div>
                                    <div className='flex flex-col text-left'>
                                            <label htmlFor='entityId' className="text-xs mt-2">
                                                Nom de l'entité <sup className='text-red-500'>*</sup>
                                            </label>
                                                    <select
                                                    onChange={(e) => {
                                                        const nameEntitiesSelected = showEntities.find(item => item.id === e.target.value);
                                                        setSelectedEntities(nameEntitiesSelected);
                                                    }}
                                                    defaultValue={selectedShift?.entityId}
                                                    {...register('entityId')}
                                                    className={`w-[320px] sm:w-[400px] mb-2 text-bold px-2 py-3 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${
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
                                                <p className="text-red-500 text-[9px] mt-1">{errors.entityId.message}</p>
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
                                selectedShift && (
                                    <div className='flex flex-col text-black text-left space-y-3'>
                                        <div>
                                            <p className="text-xs">Identifiant Unique</p>
                                            <h3 className="font-bold text-sm">{selectedShift?.id}</h3>
                                        </div>
                                        <div>
                                            <p className="text-xs">Nom du shift</p>
                                            <h3 className="font-bold text-sm">{selectedShift?.name}</h3>
                                        </div>
                                        <div>
                                            <p className="text-xs">Date de début</p>
                                            <h3 className="font-bold text-sm">{selectedShift?.startTime}H</h3>
                                        </div>
                                        <div>
                                            <p className="text-xs">Date de fin</p>
                                            <h3 className="font-bold text-sm">{selectedShift?.endTime}H</h3>
                                        </div>
                                        <div>
                                            <p className="text-xs">Nom de l'entité</p>
                                            <h3 className="font-bold text-sm">{selectedShift?.entityId}</h3>
                                        </div>
                                        <div>
                                            <p className="text-xs">Date de création</p>
                                            <h3 className="font-bold text-sm">{selectedShift?.createdAt.split("T")[0]}</h3>
                                        </div>
                                        <div>
                                            <p className="text-xs">Statut</p>
                                            <h3 className="font-bold text-sm">
                                                {selectedShift?.isActive ? "Actif" : "Désactivé"}
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
                                                    selectedShift?.is_active == false ? 
                                                        (
                                                                <AlertDialogAction
                                                                    className="border-2 border-blue-600 outline-blue-700 text-blue-700 text-xs shadow-md bg-transparent hover:bg-blue-600 hover:text-white transition"
                                                                    onClick={() => enableShift(selectedShift.id)}>
                                                                        Activer
                                                                </AlertDialogAction>

                                                        ):(

                                                                <AlertDialogAction 
                                                                    className="border-2 border-gray-600 outline-gray-700 text-gray-700 text-xs shadow-md bg-transparent hover:bg-gray-600 hover:text-white transition"
                                                                    onClick={() => disabledShift(selectedShift.id)}>
                                                                        Désactiver
                                                                </AlertDialogAction>
                                                        )
                                                
                                                } */}
                                            
                                           </div>
                                            <AlertDialogAction 
                                                className="border-2 border-red-900 outline-red-700 text-red-900 text-xs shadow-md bg-transparent hover:bg-red-600 hover:text-white transition"
                                                onClick={() => deletedShift(selectedShift.id)}>
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


    const columnsShift = useMemo(() => [
        { accessorKey: 'name', header: 'Nom du shift' },
        { accessorKey: 'startTime', header: 'Date de début' },
        { accessorKey: 'endTime', header: 'Date de fin' },
        { accessorKey: 'entityId', header: 'Nom de l\'entité' },
        { accessorKey: 'isActive', header: 'Statut' },
        {
            accessorKey: "action",
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex justify-center">
                    <EyeIcon className="h-4 w-4 text-green-500" onClick={() => handleShowShift(row.original)} />
                    <PencilSquareIcon className="h-4 w-4 text-blue-500" onClick={() => handleEditShift(row.original)} />
                    {/* <NoSymbolIcon className="h-4 w-4 text-gray-500" onClick={() => disabledShift(row.original.id)} /> */}
                    <TrashIcon className="h-4 w-4 text-red-500" onClick={() => deletedShift(row.original.id)} />
                </div>
            )
        },
    ], []);


    return {

                showDialogShift,
                columnsShift,
                handleShowShift,
                handleEditShift,
             
    };
};