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
const ArticleSchema = z.object({
    name: z.string().nonempty("Ce champs 'Nom' est réquis.")
    .min(3, "le champs doit avoir une valeur de 5 caractères au moins.")
    .max(100),
    code: z.string().nonempty("Ce champs 'Nom' est réquis.")
    .min(3, "le champs doit avoir une valeur de 5 caractères au moins.")
    .max(100),

    idArticleFamily: z.string()
    .nonempty('Ce champs "Nom de Famile Aticle" est réquis')
    .max(100),
    createdBy: z.string().nonempty("Le champ 'createdBy' est requis."),
  });

// fonction principale pour gérer les actions utilisateur
export const ArticleAction = ({ delArticle, updateData }) => {
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isEdited, setIsEdited] = useState(true);
    const [selectedArticle, setSelectedArticle] = useState({});
    const [showFamilyAticles, setShowFamilyAticles] = useState([]);
    const [error, setError] = useState();
    const [selectedFamilyAticles, setSelectedFamilyAticles] = useState([]);

    const [tokenUser, setTokenUser] = useState();


    const { register, handleSubmit, reset, formState:{errors, isSubmitting} } = useForm({
        resolver: zodResolver(ArticleSchema),
    });

    const { handlePatch, handleDelete, handleFetch } = useFetch();

    const fetchFamilyAticles = async () => {
    const getFamilyAticle = `${URLS.ENTITY_API}/article-families`;
    try {
        setIsLoading(true);
        const response = await handleFetch(getFamilyAticle);
        
            if (response && response?.status === 200) {
                    const results = response?.data;
                    const filteredFamilyAticles = results?.map(item => {
                    const { createdBy, updateAt, ...rest } = item;
                    return { id: item.id, ...rest};
                });
                    setShowFamilyAticles(filteredFamilyAticles);
            }
            else{
                throw new Error('Erreur lors de la récupération des Famiilles Aticles');
            }
    } catch (error) {
        setError(error.message);
    }
    finally {
        setIsLoading(false);
    }
    };

    useEffect(()=>{
        fetchFamilyAticles();
    },[]);


    useEffect(()=>{
        const token = localStorage.getItem("token");
        if(token){
            const decode = jwtDecode(token);
            setTokenUser(decode.user_id);
        }
    }, [tokenUser]);

    const onSubmit = async (data) => {
        const urlToUpdate = `${URLS.ENTITY_API}/articles/${selectedArticle?.id}`;
            try {
                const response = await handlePatch(urlToUpdate, data);
                    if (response) {
                    
                    await updateData(response.id, { ...data, id: response.id });
                    toast.success("Article modified successfully", { duration: 900 });
                    setDialogOpen(false);
                    }
                    else {
                        setDialogOpen(false);
                        toast.error("Erreur lors de la modification de l'article", { duration: 5000 });
                    }
                
            } catch (error) {
                console.error("Error during updated",error);
            }
    };


    const handleShowArticle = (item) => {
        setSelectedArticle(item);
        setIsEdited(false);
        setDialogOpen(true);
    };

    const handleEditedArticle = (item) => {
        setSelectedArticle(item);
        reset(item);
        setIsEdited(true);
        setDialogOpen(true);
    };


    const disabledArticle = async (id) => {
        const confirmation = window.confirm("Êtes-vous sûr de vouloir désactiver cette ville ?");
        if (confirmation) {
            // const urlToDisabledArticle = `${URLS.API_Article}/${id}`;
            const urlToDisabledArticle = `${URLS.ENTITY_API}/articles/${id}`;
            

                    try {
                            const response = await handlePatch(urlToDisabledArticle, { isActive:false });
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
                                        toast.success("Article disabled successfully", { duration: 5000 });
                                        window.location.reload();
                                    },[200]);
                                }
                            isDialogOpen && setDialogOpen(false);
                    }
                    catch(error){
                        console.error("Erreur lors de la désactivation Article :", error);
                    }

                    finally{
                        setIsLoading(false);
                        }

            } 
            else {
                console.log("La suppression a été annulée.");
            }
    };

    const enabledArticle = async (id) => {
        const confirmation = window.confirm("Êtes-vous sûr de vouloir activer cette ville?");

        if (confirmation) {
            // const urlToDisabledArticle = `${URLS.API_Article}/${id}`;
            const urlToDisabledArticle = `${URLS.ENTITY_API}/articles/${id}`;

                    try {
                            const response = await handlePatch(urlToDisabledArticle, {isActive:true});
                            // console.log("response for deleted", response);
                                if (response) {
                                    setTimeout(()=>{
                                        toast.success("Article enabled successfully", { duration: 5000});
                                        window.location.reload();
                                    },[200]);
                                }
                                else {
                                    toast.error("Erreur lors de la réactivation Article", { duration: 5000 });
                                }
                            isDialogOpen && setDialogOpen(false);
                    }
                    catch(error){
                        console.error("Erreur lors de la réactivation Article :", error);
                    }

                    finally{
                        setIsLoading(false);
                        }

            } 
            else {
                console.log("La suppression a été annulée.");
            }
    };
    
    const deletedArticle = async (id) => {
        const confirmation = window.confirm("Êtes-vous sûr de vouloir supprimer cette ville ?");

        if (confirmation) {
            const urlToDisabledArticle = `${URLS.ENTITY_API}/articles/${id}`;

                    try {
                            const response = await handleDelete(urlToDisabledArticle, {isActive:false});
                                if (response) {
                                    await delArticle(id);
                                    toast.success("Article supprimé avec succès", { duration: 5000});
                            
                                }
                                else {
                                    toast.error("Erreur lors de la désactivation Article", { duration: 5000 });
                                }
                            isDialogOpen && setDialogOpen(false);
                    }
                    catch(error){
                        console.error("Erreur lors de la désactivation Article :", error);
                    }

                    finally{
                        setIsLoading(false);
                        }

            } 
            else {
                console.log("La suppression a été annulée.");
            }
    };


    const showDialogArticle = () => {
        
        return (
            <AlertDialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                <AlertDialogContent
                    className="w-[90%] sm:w-[80%] md:w-[60%] lg:w-[50%] xl:w-[40%] max-h-[80vh] overflow-y-auto p-4 bg-white rounded-lg shadow-lg"
                >
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            <span className='flex text-left'>
                                { isEdited ? " Modifier les informations " : " Détails de l'article" }
                            </span>
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            { isEdited ? (
                                <form
                                    className='flex flex-col space-y-3 mt-5 text-xs'
                                    onSubmit={handleSubmit(onSubmit)}>
                                    <div className='flex flex-col text-left'>
                                            <label htmlFor='name' className="text-xs mt-2">
                                                Nom de l'article <sup className='text-red-500'>*</sup>
                                            </label>
                                            <Input
                                                id="name"
                                                type="text"
                                                defaultValue={selectedArticle?.name}
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
                                            <label htmlFor='idArticleFamily' className="text-xs mt-2">
                                                Nom de Famile Aticle <sup className='text-red-500'>*</sup>
                                            </label>
                                                    <select
                                                    onChange={(e) => {
                                                        const nameCountrySelected = showFamilyAticles.find(item => item.id === e.target.value);
                                                        setSelectedFamilyAticles(nameCountrySelected);
                                                    }}
                                                    defaultValue={selectedArticle?.idArticleFamily}
                                                    {...register('idArticleFamily')}
                                                    className={`w-[320px] sm:w-[400px] mb-2 text-bold px-2 py-3 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                                                        errors.idArticleFamily ? "border-red-500" : "border-gray-300"
                                                    }`}
                                                >
                                                    <option value="">Selectionner un FamilyAticle pour cette ville</option>
                                                    {showFamilyAticles.map((item) => (
                                                        <option key={item.id} value={item.id}>
                                                            {item.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.idArticleFamily && (
                                                <p className="text-red-500 text-[9px] mt-1">{errors.idArticleFamily.message}</p>
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
                                selectedArticle && (
                                    <div className='flex flex-col text-black text-left space-y-3'>

                                        <div>
                                            <p className="text-xs">Identifiant Unique</p>
                                            <h3 className="font-bold text-sm">{selectedArticle?.id}</h3>
                                        </div>

                                        <div>
                                            <p className="text-xs">Nom de l'article</p>
                                            <h3 className="font-bold text-sm">{selectedArticle?.name}</h3>
                                        </div>
                                        <div>
                                            <p className="text-xs">Nom de Famile Aticle</p>
                                            <h3 className="font-bold text-sm">{selectedArticle?.idArticleFamily}</h3>
                                        </div>
                                    
                                        <div>
                                            <p className="text-xs">Date de création</p>
                                            <h3 className="font-bold text-sm">{selectedArticle?.createdAt.split("T")[0]}</h3>
                                        </div>
                                        <div>
                                            <p className="text-xs">Statut</p>
                                            <h3 className="font-bold text-sm">
                                                {selectedArticle?.isActive ? "Actif" : "Désactivé"}
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
                                    onClick={() => deletedArticle(selectedArticle.id)}>
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


    // const columnsArticle = useMemo(() => [
    //     { accessorKey: 'name', header: 'Nom article' },
    //     { accessorKey: 'code', header: 'Code article' },
    //     { accessorKey: 'idArticleFamily', header: 'Nom de Famile Aticle' },
    //     { accessorKey: 'isActive', header: 'Statut' },
    //     {
    //         accessorKey: "action",
    //         header: "Actions",
    //         cell: ({ row }) => (
    //             <div className="flex justify-center">
    //                 <EyeIcon className="h-4 w-4 text-green-500" onClick={() => handleShowArticle(row.original)} />
    //                 <PencilSquareIcon className="h-4 w-4 text-blue-500" onClick={() => handleEditedArticle(row.original)} />
    //                 {/* <NoSymbolIcon className="h-4 w-4 text-gray-500" onClick={() => disabledArticle(row.original.id)} /> */}
    //                 <TrashIcon className="h-4 w-4 text-red-500" onClick={() => deletedArticle(row.original.id)} />
    //             </div>
    //         )
    //     },
    // ], []);
    const columnsArticle = useMemo(() => [
        { accessorKey: 'name', header: 'Nom article' },
        { accessorKey: 'code', header: 'Code article' },
        { accessorKey: 'type', header: 'Type' },
        { accessorKey: 'quantity', header: 'Quantité' },
        { accessorKey: 'price', header: 'Prix' },
        { accessorKey: 'hasTVA', header: 'TVA' },
        { accessorKey: 'idArticleFamily', header: 'Famille article' },
        { accessorKey: 'idEntity', header: 'Entité' },
        { accessorKey: 'isActive', header: 'Statut' },
        {
            accessorKey: "action",
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex justify-center space-x-2">
                    <EyeIcon className="h-4 w-4 text-green-500 cursor-pointer" onClick={() => handleShowArticle(row.original)} />
                    <PencilSquareIcon className="h-4 w-4 text-blue-500 cursor-pointer" onClick={() => handleEditedArticle(row.original)} />
                    <TrashIcon className="h-4 w-4 text-red-500 cursor-pointer" onClick={() => deletedArticle(row.original.id)} />
                </div>
            )
        },
    ], []);


    return {

                showDialogArticle,
                columnsArticle,
                handleShowArticle,
                handleEditedArticle,
             
    };
};