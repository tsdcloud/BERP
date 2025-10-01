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
const ArticleFamilySchema = z.object({
    name: z.string().nonempty("Ce champs 'Nom' est réquis.").max(100),
    code: z.string().nonempty("Ce champs 'Nom' est réquis.").max(100),

    createdBy: z.string().nonempty("Le champ 'createdBy' est requis."),
    });

// fonction principale pour gérer les actions utilisateur
export const ArticleFamilyAction = ({ enableArticleFamily, disArticleFamily, delArticleFamily, updateData }) => {
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isEdited, setIsEdited] = useState(true);
    const [selectedArticleFamily, setSelectedArticleFamily] = useState({});
    const [tokenUser, setTokenUser] = useState();

    const { register, handleSubmit, reset, formState:{errors, isSubmitting} } = useForm({
        resolver: zodResolver(ArticleFamilySchema),
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
        const urlToUpdate = `${URLS.ENTITY_API}/article-families/${selectedArticleFamily?.id}`;
      
        try {
            const response = await handlePatch(urlToUpdate, data);
                if (response) {
                    await updateData(response.id, { ...data, id: response.id });
                    toast.success("ArticleFamily modified successfully", { duration: 900 });
                    setDialogOpen(false);
                        
                }
                else {
                    setDialogOpen(false);
                    toast.error("Erreur lors de la modification de la Famille d'article", { duration: 5000 });
                }
            
          } catch (error) {
            console.error("Error during updated",error);
          }
    };

    const handleShowArticleFamily = (item) => {
        setSelectedArticleFamily(item);
        setIsEdited(false);
        setDialogOpen(true);
    };

    const handleEditedArticleFamily = (item) => {
        setSelectedArticleFamily(item);
        reset(item);
        setIsEdited(true);
        setDialogOpen(true);
    };

    const disabledArticleFamily = async (id) => {
        const confirmation = window.confirm("Êtes-vous sûr de vouloir désactiver la Famille d'article ?");
        if (confirmation) {
            const urlToDisabledArticleFamily = `${URLS.ENTITY_API}/article-families/${id}`;

                    try {
                            const response = await handlePatch(urlToDisabledArticleFamily, { isActive:false });
                            // console.log("response for deleted", response);
                                if (response) {
                                    setTimeout(()=>{
                                        toast.success("Famille d'article disabled successfully", { duration: 5000 });
                                        disArticleFamily(id);
                                    },[200]);
                                }
                                else {
                                    toast.error("Erreur lors de la désactivation Famille d'article", { duration: 5000 });
                                }
                            isDialogOpen && setDialogOpen(false);
                    }
                    catch(error){
                        console.error("Erreur lors de la désactivation Famille d'article :", error);
                    }

                    finally{
                        setIsLoading(false);
                        }

            } 
            else {
                console.log("La suppression a été annulée.");
            }
    };

    const enabledArticleFamily = async (id) => {
        const confirmation = window.confirm("Êtes-vous sûr de vouloir désactiver la Famille d'article ?");

        if (confirmation) {
            const urlToDisabledArticleFamily = `${URLS.ENTITY_API}/article-families/${id}`;

                    try {
                            const response = await handlePatch(urlToDisabledArticleFamily, {isActive:true});
                            console.log("response for deleted", response);
                                if (response) {
                                    setTimeout(()=>{
                                        toast.success("Famille d'article enabled successfully", { duration: 5000});
                                        enableArticleFamily(id);
                                    },[200]);
                                }
                                else {
                                    toast.error("Erreur lors de la réactivation Famille d'article", { duration: 5000 });
                                }
                            isDialogOpen && setDialogOpen(false);
                    }
                    catch(error){
                        console.error("Erreur lors de la réactivation Famille d'article :", error);
                    }

                    finally{
                        setIsLoading(false);
                        }

            } 
            else {
                console.log("La suppression a été annulée.");
            }
    };
    
    const deletedArticleFamily = async (id) => {
        const confirmation = window.confirm("Êtes-vous sûr de vouloir supprimer la Famille d'article ?");

        if (confirmation) {
            const urlToDisabledArticleFamily = `${URLS.ENTITY_API}/article-families/${id}`;

                    try {
                            const response = await handleDelete(urlToDisabledArticleFamily, {isActive:false});
                            if (response) {
                                    await delArticleFamily(id);
                                    toast.success("Famille d'article supprimé avec succès", { duration: 5000});
                                }
                                else {
                                    toast.error("Erreur lors de la désactivation ArticleFamily", { duration: 5000 });
                                }
                            isDialogOpen && setDialogOpen(false);
                    }
                    catch(error){
                        console.error("Erreur lors de la désactivation ArticleFamily :", error);
                    }

                    finally{
                        setIsLoading(false);
                        }

            } 
            else {
                console.log("La suppression a été annulée.");
            }
    };


    const showDialogArticleFamily = () => {

        return (
            <AlertDialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                <AlertDialogContent
                className="w-[90%] sm:w-[80%] md:w-[60%] lg:w-[50%] xl:w-[40%] max-h-[80vh] overflow-y-auto p-4 bg-white rounded-lg shadow-lg"
                >
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            <span className='flex text-left'>
                                { isEdited ? " Modifier les informations " : " Détails du Famille d'article " }
                            </span>
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            { isEdited ? (
                                <form
                                    className='flex flex-col space-y-3 mt-5 text-xs'
                                    onSubmit={handleSubmit(onSubmit)}>
                                    <div className='flex flex-col text-left'>
                                            <label htmlFor='name' className="text-xs mt-2">
                                                Nom du Famille d'article <sup className='text-red-500'>*</sup>
                                            </label>
                                            <Input
                                                id="name"
                                                type="text"
                                                defaultValue={selectedArticleFamily?.code}
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
                                            <label htmlFor='code' className="text-xs mt-2">
                                                Code du Famille d'article <sup className='text-red-500'>*</sup>
                                            </label>
                                            <Input
                                                id="code"
                                                type="text"
                                                defaultValue={selectedArticleFamily?.name}
                                                {...register("code")}
                                                className={`w-[320px] sm:w-[400px] mb-2 text-bold px-2 py-3 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                                                    errors.code ? "border-red-500" : "border-gray-300"
                                                }`}
                                                />
                                                {errors.code && (
                                                <p className="text-red-500 text-[9px] mt-1">{errors.code.message}</p>
                                                )}
                                    </div>
                                    <div className='flex flex-col text-left'>
                                            <label htmlFor='description' className="text-xs mt-2">
                                                Description Famille d'article <sup className='text-red-500'>*</sup>
                                            </label>
                                            <Input
                                                id="description"
                                                type="text"
                                                defaultValue={selectedArticleFamily?.description}
                                                {...register("description")}
                                                className={`w-[320px] sm:w-[400px] mb-2 text-bold px-2 py-3 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                                                    errors.description ? "border-red-500" : "border-gray-300"
                                                }`}
                                                />
                                                {errors.description && (
                                                <p className="text-red-500 text-[9px] mt-1">{errors.description.message}</p>
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
                                selectedArticleFamily && (
                                    <div className='flex flex-col text-left text-black space-y-3'>

                                        <div>
                                            <p className="text-xs">Identifiant Unique</p>
                                            <h3 className="font-bold text-sm">{selectedArticleFamily?.id}</h3>
                                        </div>

                                        <div>
                                            <p className="text-xs">Nom du Famille d'article</p>
                                            <h3 className="font-bold text-sm">{selectedArticleFamily?.name}</h3>
                                        </div>

                                        <div>
                                            <p className="text-xs">Code du Famille d'article</p>
                                            <h3 className="font-bold text-sm">{selectedArticleFamily?.code}</h3>
                                        </div>

                                        <div>
                                            <p className="text-xs">Description Famille d'article</p>
                                            <h3 className="font-bold text-sm">{selectedArticleFamily?.description}</h3>
                                        </div>
                                    
                                        <div>
                                            <p className="text-xs">Date de création</p>
                                            <h3 className="font-bold text-sm">{selectedArticleFamily?.createdAt.split("T")[0]}</h3>
                                        </div>
                                        <div>
                                            <p className="text-xs">Statut</p>
                                            <h3 className="font-bold text-sm">
                                                {selectedArticleFamily?.isActive ? "Actif" : "Désactivé"}
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
                                            <AlertDialogAction 
                                                className="border-2 border-red-900 outline-red-700 text-red-900 text-xs shadow-md bg-transparent hover:bg-red-600 hover:text-white transition"
                                                onClick={() => deletedArticleFamily(selectedArticleFamily.id)}>
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


    const columnsArticleFamily = useMemo(() => [
        { accessorKey: 'name', header: 'Nom Famille article' },
        { accessorKey: 'code', header: 'Code Famille article' },
        { accessorKey: 'description', header: 'Description Famille article' },
        { accessorKey: 'isActive', header: 'Statut' },
        {
            accessorKey: "action",
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex justify-center">
                    <EyeIcon className="h-4 w-4 text-green-500" onClick={() => handleShowArticleFamily(row.original)} />
                    <PencilSquareIcon className="h-4 w-4 text-blue-500" onClick={() => handleEditedArticleFamily(row.original)} />
                    {/* <NoSymbolIcon className="h-4 w-4 text-gray-500" onClick={() => disabledArticleFamily(row.original.id)} /> */}
                    <TrashIcon className="h-4 w-4 text-red-500" onClick={() => deletedArticleFamily(row.original.id)} />
                </div>
            )
        },
    ], []);


    return {

                showDialogArticleFamily,
                columnsArticleFamily,
                handleShowArticleFamily,
                handleEditedArticleFamily,
             
    };
};