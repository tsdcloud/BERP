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
const applicationSchema = z.object({
    name: z.string()
    .nonempty("Ce champs 'Nom' est réquis.")
    .min(5, "le champs doit avoir une valeur de 5 caractères au moins.")
    .max(100)
    // .regex(/^[a-zA-Z0-9\s]+$/, "Ce champ doit être un 'nom' conforme.")
    ,
  
    description: z.string()
    .nonempty("Ce champs 'description' est réquis")
    .min(5, "le champs doit avoir une valeur de 5 caractères au moins.")
    .max(100)
    // .regex(/^[a-zA-Z0-9\s]+$/, "Ce champs doit être un 'description' conforme")
    ,

    url: z.string()
    .nonempty("Ce champs 'URL' est réquis")
    .regex(/^https?:\/\/[^\s$.?#].[^\s]*$/, "L'URL doit commencer par 'http://' ou 'https://' et être valide"),

    createdBy: z.string().nonempty("Le champ 'createdBy' est requis."),
  });

// fonction principale pour gérer les actions utilisateur
export const ApplicationAction = ( { delApp, updateData}) => {
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isEdited, setIsEdited] = useState(true);
    const [selectedApplication, setSelectedApplication] = useState({});
    const [tokenUser, setTokenUser] = useState();

    const { register, handleSubmit, reset, formState:{errors, isSubmitting} } = useForm({
        resolver: zodResolver(applicationSchema),
    });

   const { handlePatch, handleDelete } = useFetch();
   

   useEffect(()=>{
    const token = localStorage.getItem("token");
    if(token){
        const decode = jwtDecode(token);
        setTokenUser(decode.user_id);
        // console.log("var", tokenUser);
    }
  }, [tokenUser]);

    const onSubmit = async (data) => {
        const urlToUpdate =  `${URLS.ENTITY_API}/applications/${selectedApplication?.id}`;
      
        try {
            const response = await handlePatch(urlToUpdate, data);
                if (response) {
                    await updateData(response.id, { ...data, id: response.id });
                    toast.success("application modified successfully", { duration: 900 });
                    setDialogOpen(false);
                }
                else {
                    setDialogOpen(false);
                    toast.error("Erreur lors de la modification de l'application", { duration: 5000 });
                }
            
          } catch (error) {
            console.error("Error during updated",error);
          }
    };


    const handleShowApplication = (item) => {
        setSelectedApplication(item);
        setIsEdited(false);
        setDialogOpen(true);
        console.log("item", item);
    };

    const handleEditedApplication = (item) => {
        setSelectedApplication(item);
        reset(item);
        setIsEdited(true);
        setDialogOpen(true);
    };

    const disabledApplication = async (id) => {
        const confirmation = window.confirm("Êtes-vous sûr de vouloir désactiver cette application ?");
        if (confirmation) {
            // const urlToDisabledApp = `${URLS.API_APPLICATION_ENTITY}/${id}`;
            const urlToDisabledApp =  `${URLS.ENTITY_API}/applications/${id}`;
           
           

                    try {
                            const response = await handlePatch(urlToDisabledApp, { isActive:false });
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
                                        toast.success("rôle disabled successfully", { duration: 5000 });
                                        // window.location.reload();
                                    },[200]);
                                }
                            isDialogOpen && setDialogOpen(false);
                    }
                    catch(error){
                        console.error("Erreur lors de la désactivation rôle :", error);
                    }

                    finally{
                        setIsLoading(false);
                        }

            } 
            else {
                console.log("La suppression a été annulée.");
            }
    };

    const enabledApplication = async (id) => {
        const confirmation = window.confirm("Êtes-vous sûr de vouloir désactiver cette application ?");

        if (confirmation) {
            // const urlToDisabledApp = `${URLS.API_APPLICATION_ENTITY}/${id}`;
            const urlToDisabledApp =  `${URLS.ENTITY_API}/applications/${id}`;

                    try {
                            const response = await handlePatch(urlToDisabledApp, {isActive:true});
                            console.log("response for deleted", response);
                                if (response) {
                                    setTimeout(()=>{
                                        toast.success("rôle enabled successfully", { duration: 5000});
                                        window.location.reload();
                                    },[200]);
                                }
                                else {
                                  toast.error("Erreur lors de la réactivation rôle", { duration: 5000 });
                                }
                            isDialogOpen && setDialogOpen(false);
                    }
                    catch(error){
                        console.error("Erreur lors de la réactivation rôle :", error);
                    }

                    finally{
                        setIsLoading(false);
                        }

            } 
            else {
                console.log("La suppression a été annulée.");
            }
    };
    
    const deletedApplication = async (id) => {
        const confirmation = window.confirm("Êtes-vous sûr de vouloir supprimer cette application ?");

        if (confirmation) {
            const urlToDisabledApp =  `${URLS.ENTITY_API}/applications/${id}`;

                    try {
                            const response = await handleDelete(urlToDisabledApp, {isActive:false});
                                if (response) {
                                    await delApp(id);
                                     toast.success("Application supprimé avec succès", { duration: 5000});
                                }
                                else {
                                  toast.error("Erreur lors de la suppression app", { duration: 5000 });
                                }
                            isDialogOpen && setDialogOpen(false);
                    }
                    catch(error){
                        console.error("Erreur lors de la désactivation app :", error);
                    }

                    finally{
                        setIsLoading(false);
                        }

            } 
            else {
                console.log("La suppression a été annulée.");
            }
    };


    const showDialogApplication = () => {
        
        return (
            <AlertDialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                <AlertDialogContent
                className="w-[90%] sm:w-[80%] md:w-[60%] lg:w-[50%] xl:w-[40%] max-h-[80vh] overflow-y-auto p-4 bg-white rounded-lg shadow-lg"
                >
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                        <span className='flex text-left'>
                            { isEdited ? " Modifier les informations " : " Détails de l'application " }
                        </span>
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            { isEdited ? (
                                <form
                                    className='flex flex-col space-y-3 mt-5 text-xs'
                                     onSubmit={handleSubmit(onSubmit)}>
                                    <div className='flex flex-col text-left'>
                                            <label htmlFor='name' className="text-xs mt-2">
                                                Nom de l'application <sup className='text-red-500'>*</sup>
                                            </label>
                                            <Input
                                                id="name"
                                                type="text"
                                                defaultValue={selectedApplication?.name}
                                                {...register("name")}
                                                className={` w-[320px] sm:w-[400px] mb-2 text-bold px-2 py-3 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                                                    errors.name ? "border-red-500" : "border-gray-300"
                                                }`}
                                                />
                                                {errors.name && (
                                                <p className="text-red-500 text-[9px] mt-1">{errors.name.message}</p>
                                                )}
                                    </div>
                                    <div className='flex flex-col text-left'>
                                            <label htmlFor='description' className="text-xs mt-2">
                                                Description <sup className='text-red-500'>*</sup>
                                            </label>
                                            <Input
                                                id="description"
                                                type="text"
                                                defaultValue={selectedApplication?.description}
                                                {...register("description")}
                                                className={`w-[320px] sm:w-[400px] mb-2 text-bold px-2 py-3 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                                                    errors.description ? "border-red-500" : "border-gray-300"
                                                }`}
                                                />
                                                {errors.description && (
                                                <p className="text-red-500 text-[9px] mt-1">{errors.description.message}</p>
                                                )}
                                    </div>
                                    <div className='flex flex-col text-left'>
                                            <label htmlFor='url' className="text-xs mt-2">
                                                Lien de l'application <sup className='text-red-500'>*</sup>
                                            </label>
                                            <Input
                                                id="url"
                                                type="text"
                                                defaultValue={selectedApplication?.url}
                                                {...register("url")}
                                                className={`w-[320px] sm:w-[400px] mb-2 text-bold px-2 py-3 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                                                    errors.url ? "border-red-500" : "border-gray-300"
                                                }`}
                                                />
                                                {errors.url && (
                                                <p className="text-red-500 text-[9px] mt-1">{errors.url.message}</p>
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
                                selectedApplication && (
                                    <div className='flex flex-col text-left text-black space-y-3'>

                                        <div>
                                            <p className="text-xs">Identifiant Unique</p>
                                            <h3 className="font-bold text-sm">{selectedApplication?.id}</h3>
                                        </div>

                                        <div>
                                            <p className="text-xs md:w-[440px] w-[300px]">Nom de l'application</p>
                                            <h3 className="font-bold text-sm break-words">{selectedApplication?.name}</h3>
                                        </div>
                                        <div>
                                            <p className="text-xs md:w-[440px] w-[300px]">Description</p>
                                            <h3 className="font-bold text-sm break-words">{selectedApplication?.description}</h3>
                                        </div>
                                        <div className='md:w-[440px] w-[300px]'>
                                            <p className="text-xs">Lien de l'application</p>
                                            <h3 className="font-bold text-sm break-words">{selectedApplication?.url}</h3>
                                        </div>
                                        <div>
                                            <p className="text-xs">Icône de l'application</p>
                                            <h3 className="font-bold text-sm">{selectedApplication?.image}</h3>
                                        </div>
                                       
                                        <div>
                                            <p className="text-xs">Date de création</p>
                                            <h3 className="font-bold text-sm">{selectedApplication?.createdAt.split("T")[0]}</h3>
                                        </div>
                                        <div>
                                            <p className="text-xs">Statut</p>
                                            <h3 className="font-bold text-sm">
                                                {selectedApplication?.isActive ? "Actif" : "Désactivé"}
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
                                            {/* <div className='flex space-x-2'>
                                                { 
                                                    selectedApplication?.isActive == false ?
                                                        (
                                                                <AlertDialogAction
                                                                    className="border-2 border-blue-600 outline-blue-700 text-blue-700 text-xs shadow-md bg-transparent hover:bg-blue-600 hover:text-white transition"
                                                                    onClick={() => enabledApplication(selectedApplication.id)}>
                                                                        Activer
                                                                </AlertDialogAction>

                                                        ):(

                                                                <AlertDialogAction 
                                                                    className="border-2 border-gray-600 outline-gray-700 text-gray-700 text-xs shadow-md bg-transparent hover:bg-gray-600 hover:text-white transition"
                                                                    onClick={() => disabledApplication(selectedApplication.id)}>
                                                                        Désactiver
                                                                </AlertDialogAction>
                                                        )
                                                
                                                }
                                            
                                           </div> */}
                                            <AlertDialogAction 
                                                className="border-2 border-red-900 outline-red-700 text-red-900 text-xs shadow-md bg-transparent hover:bg-red-600 hover:text-white transition"
                                                onClick={() => deletedApplication(selectedApplication.id)}>
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


    const columnsApplication = useMemo(() => [
        { accessorKey: 'name', header: "Nom de l'application" },
        { accessorKey: 'description', header: 'Description' },
        { accessorKey: 'url', header: 'Lien' },
        { accessorKey: 'image', header: 'Icône' },
        // { accessorKey: 'createdAt', header: 'Date de création' },
        { accessorKey: 'isActive', header: 'Statut' },
        {
            accessorKey: "action",
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex justify-center">
                    <EyeIcon className="h-4 w-4 text-green-500" onClick={() => handleShowApplication(row.original)} />
                    <PencilSquareIcon className="h-4 w-4 text-blue-500" onClick={() => handleEditedApplication(row.original)} />
                    {/* <NoSymbolIcon className="h-4 w-4 text-gray-500" onClick={() => disabledApplication(row.original.id)} /> */}
                    <TrashIcon className="h-4 w-4 text-red-500" onClick={() => deletedApplication(row.original.id)} />
                </div>
            )
        },
    ], []);


    return {

                showDialogApplication,
                columnsApplication,
                handleShowApplication,
                handleEditedApplication,
             
    };
};