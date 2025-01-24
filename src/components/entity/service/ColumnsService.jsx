import { useMemo, useState } from 'react';
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




// Schéma de validation avec Zod
const serviceSchema = z.object({
    service_name: z.string()
    .nonempty("Ce champs 'Nom' est réquis.")
    .min(2, "le champs doit avoir une valeur de 2 caractères au moins.")
    .max(100)
    .regex(/^[a-zA-Z ,]+$/, "Ce champ doit être un 'nom' conforme."),

    // localisation: z.string()
    // .nonempty("Ce champs 'Localisation' est réquis")
    // .min(4, "le champs doit avoir une valeur de 4 caractères au moins.")
    // .max(100)
    // .regex(/^[a-zA-Z ,]+$/, "Ce champs doit être une 'localisation' conforme"),

    id_department: z.string()
    .nonempty('Ce champs "Nom du service" est réquis')
    .min(4, "La valeur de ce champs doit contenir au moins 4 caractères.")
    .max(100)
    .regex(/^[a-zA-Z0-9_.]+$/, "Ce champs doit être un 'nom de la ville' Conforme.")
    ,
    });

// Fonction principale pour gérer les actions utilisateur
export const ServiceAction = () => {
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isEdited, setIsEdited] = useState(true);
    const [selectedService, setSelectedService] = useState({});

    const { register, handleSubmit, reset, formState:{errors, isSubmitting} } = useForm({
        resolver: zodResolver(serviceSchema),
    });

   const { handlePatch, handleDelete } = useFetch();
   

    const onSubmit = async (data) => {

        console.log("data service", data);

        // const urlToUpdate = `${URLS.API_ROLE}${selectedService?.id}`;
      
        // try {
        //     const response = await handlePatch(urlToUpdate, data);
        //     // console.log("response update", response);
        //     if (response.success) {
        //         // console.log("User updated", response);
        //         setDialogOpen(false);

        //         setTimeout(()=>{
        //             toast.success("department modified successfully", { duration: 900 });
        //         },[100]);
                
        //         setTimeout(()=>{
        //             window.location.reload();
        //         },[900]);
        //     }
        //     else {
        //         setDialogOpen(false);
        //         toast.error(response.error.message, { duration: 5000});
        //     }
            
        //   } catch (error) {
        //     console.error("Error during updated",error);
        //     toast.error("Erreur lors de la modification du service", { duration: 5000 });
        //   }
    };

    const handleShowService = (service) => {
        setSelectedService(service);
        setIsEdited(false);
        setDialogOpen(true);
    };

    const handleEditService = (service) => {
        setSelectedService(service);
        reset(service);
        setIsEdited(true);
        setDialogOpen(true);
    };

    const disabledService = async (id) => {
        const confirmation = window.confirm("Êtes-vous sûr de vouloir désactiver ce service ?");
            if (confirmation) {
                const urlToDisabledService = `${URLS.API_ROLE}${id}/`;

                        try {
                                const response = await handlePatch(urlToDisabledService, {is_active:false});
                                console.log("response for disabled", response);
                                if (response.success) {
                                    // console.log("ROLE disabled", response);
                                    // console.log("La ROLE a été désactivé.", id);
                                    toast.success("department disabled successfully", { duration: 5000});
                                    isDialogOpen && setDialogOpen(false);
                                    window.location.reload();
                                }
                                else {
                                toast.error(response.error, { duration: 5000});
                                }
                                isDialogOpen && setDialogOpen(false);
                        }
                        catch(error){
                            console.error("Erreur lors de la désactivation du service :", error);
                            toast.error("Erreur lors de la désactivation du service", { duration: 5000 });
                        }

                        finally{
                            setIsLoading(false);
                            
                            }

                } 
                else {
                    console.log("La désactivation a été annulée.");
                }
    };

    const enableService = async (id) => {
        const confirmation = window.confirm("Êtes-vous sûr de vouloir désactiver ce service ?");

        const urlToDisabledService = `${URLS.API_ROLE}${id}/`;

        if (confirmation) {
              try{
                    setDialogOpen(false);
                    await handlePatch(urlToDisabledService, {is_active: true});
                    window.location.reload();
                //   navigateToMyEvent(`/events/${eventId}`)
              }
              catch(error){
                  console.error("Erreur lors de la désactivation de ce service :", error);
              }
              finally{
                // setIsLoading(false);
                console.log("okay");
                }

                console.log("Le service a été désactivé.", id);
                } else {
                console.log("La désactivation a été annulée.");
                }
    };
    
    const deletedService = async (id) => {
        const confirmation = window.confirm("Êtes-vous sûr de vouloir supprimer ce service ?");

        if (confirmation) {
            const urlToDeleteService = `${URLS.API_ROLE}${id}/`;
            console.log("url delete service ",urlToDeleteService);
            // const urlToDeleteService = URLS.API_ROLE`${id}/?delete=true`;

                    try {
                            const response = await handleDelete(urlToDeleteService);
                            console.log("response for deleting", response);
                            if (response.success) {
                                toast.success("service disabled successfully", { duration: 5000});
                                isDialogOpen && setDialogOpen(false);
                                window.location.reload();
                            }

                            setDialogOpen(false);
                    }
                    catch(error){
                        console.error("Erreur lors de la suppression de ce service:", error);
                        toast.error("Erreur lors de la suppression du service", { duration: 5000 });
                    }

                    finally{
                        setIsLoading(false);
                        
                        }

            } 
            else {
                console.log("La suppression a été annulée.");
            }
    };


    const showDialogService = () => {
        return (
            <AlertDialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            { isEdited ? "Modifier les informations" : "Détails du service" }
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            { isEdited ? (
                                <form
                                    className='flex flex-col space-y-3 mt-5 text-xs' 
                                     onSubmit={handleSubmit(onSubmit)}>
                                    <div>
                                            <label htmlFor='service_name' className="text-xs mt-2">
                                                Nom du service <sup className='text-red-500'>*</sup>
                                            </label>
                                            <Input
                                                id="service_name"
                                                type="text"
                                                defaultValue={selectedService?.service_name}
                                                {...register("service_name")}
                                                className={`w-[400px] mb-2 text-bold px-2 py-3 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                                                    errors.service_name ? "border-red-500" : "border-gray-300"
                                                }`}
                                                />
                                                {errors.service_name && (
                                                <p className="text-red-500 text-[9px] mt-1">{errors.service_name.message}</p>
                                                )}
                                    </div>
                                    <div>
                                                <label htmlFor='id_department' className="text-xs">
                                                    Nom du departement <sup className='text-red-500'>*</sup>
                                                </label>
                                                <Input
                                                    id="id_department"
                                                    type="text"
                                                    defaultValue={selectedService?.id_department}
                                                    {...register("id_department")}
                                                    className={`w-[400px] mb-2 text-bold px-2 py-3 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                                                        errors.id_department ? "border-red-500" : "border-gray-300"
                                                    }`}
                                                />
                                                {errors.id_department && (
                                                <p className="text-red-500 text-[9px] mt-1">{errors.id_department.message}</p>
                                                )}
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
                                selectedService && (
                                    <div className='flex flex-col text-black space-y-3'>
                                        <div>
                                            <p className="text-xs">Identifiant Unique</p>
                                            <h3 className="font-bold text-sm">{selectedService?.id}</h3>
                                        </div>
                                        <div>
                                            <p className="text-xs">Nom du service</p>
                                            <h3 className="font-bold text-sm">{selectedService?.service_name}</h3>
                                        </div>
                                        <div>
                                            <p className="text-xs">Nom du departement</p>
                                            <h3 className="font-bold text-sm">{selectedService?.id_department}</h3>
                                        </div>
                                        <div>
                                            <p className="text-xs">Statut</p>
                                            <h3 className="font-bold text-sm">
                                                {selectedService?.is_active ? "Actif" : "Désactivé"}
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
                                            { 
                                                selectedService?.is_active == false ? 
                                                    (
                                                            <AlertDialogAction
                                                                className="border-2 border-blue-600 outline-blue-700 text-blue-700 text-xs shadow-md bg-transparent hover:bg-blue-600 hover:text-white transition"
                                                                onClick={() => enableService(selectedService.id)}>
                                                                    Activer
                                                            </AlertDialogAction>

                                                    ):(

                                                            <AlertDialogAction 
                                                                className="border-2 border-gray-600 outline-gray-700 text-gray-700 text-xs shadow-md bg-transparent hover:bg-gray-600 hover:text-white transition"
                                                                onClick={() => disabledService(selectedService.id)}>
                                                                    Désactiver
                                                            </AlertDialogAction>
                                                    )
                                            
                                            }
                                            
                                           </div>
                                            <AlertDialogAction 
                                                className="border-2 border-red-900 outline-red-700 text-red-900 text-xs shadow-md bg-transparent hover:bg-red-600 hover:text-white transition"
                                                onClick={() => deletedService(selectedService.id)}>
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


    const columnsService = useMemo(() => [
        { accessorKey: 'service_name', header: 'Nom du service' },
        { accessorKey: 'id_department', header: 'Nom du departement' },
        { accessorKey: 'is_active', header: 'Statut' },
        {
            accessorKey: "action",
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex justify-center">
                    <EyeIcon className="h-4 w-4 text-green-500" onClick={() => handleShowService(row.original)} />
                    <PencilSquareIcon className="h-4 w-4 text-blue-500" onClick={() => handleEditService(row.original)} />
                    {/* <NoSymbolIcon className="h-4 w-4 text-gray-500" onClick={() => disabledService(row.original.id)} /> */}
                    <TrashIcon className="h-4 w-4 text-red-500" onClick={() => deletedService(row.original.id)} />
                </div>
            )
        },
    ], []);


    return {

                showDialogService,
                columnsService,
                handleShowService,
                handleEditService,
             
    };
};