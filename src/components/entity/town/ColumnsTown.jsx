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
const townSchema = z.object({
    name: z.string()
    .nonempty("Ce champs 'Nom' est réquis.")
    .min(5, "le champs doit avoir une valeur de 5 caractères au moins.")
    .max(100)
    // .regex(/^[a-zA-Z0-9\s]+$/, "Ce champ doit être un 'nom' conforme.")
    ,

    districtId: z.string()
    .nonempty('Ce champs "Nom du district" est réquis')
    .min(4, "La valeur de ce champs doit contenir au moins 4 caractères.")
    .max(100)
    .regex(/^(?:[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[4][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|[a-zA-Z0-9 ,]+)$/, "Ce champs doit être un 'nom du pays Conforme."),

    createdBy: z.string().nonempty("Le champ 'createdBy' est requis."),
  });

// fonction principale pour gérer les actions utilisateur
export const TownAction = ({ delTown, updateData }) => {
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isEdited, setIsEdited] = useState(true);
    const [selectedTown, setSelectedTown] = useState({});
    const [showDistricts, setShowDistricts] = useState([]);
    const [error, setError] = useState();
    const [selectedDistricts, setSelectedDistricts] = useState([]);

    const [tokenUser, setTokenUser] = useState();


    const { register, handleSubmit, reset, formState:{errors, isSubmitting} } = useForm({
        resolver: zodResolver(townSchema),
    });

   const { handlePatch, handleDelete, handleFetch } = useFetch();
   

   const fetchDistricts = async () => {
    const getDistrict = `${URLS.ENTITY_API}/districts`;
    try {
        setIsLoading(true);
        const response = await handleFetch(getDistrict);
        
            if (response && response?.status === 200) {
                    const results = response?.data;
                    const filteredDistricts = results?.map(item => {
                    const { createdBy, updateAt, ...rest } = item;
                    return { id: item.id, ...rest};
                });
                    setShowDistricts(filteredDistricts);
            }
            else{
                throw new Error('Erreur lors de la récupération des districts');
            }
    } catch (error) {
        setError(error.message);
    }
    finally {
        setIsLoading(false);
      }
     };

  useEffect(()=>{
    fetchDistricts();
  },[]);


   useEffect(()=>{
    const token = localStorage.getItem("token");
    if(token){
        const decode = jwtDecode(token);
        setTokenUser(decode.user_id);
    }
  }, [tokenUser]);

    const onSubmit = async (data) => {
        const urlToUpdate = `${URLS.ENTITY_API}/towns/${selectedTown?.id}`;
            try {
                const response = await handlePatch(urlToUpdate, data);
                    if (response) {
                    
                    await updateData(response.id, { ...data, id: response.id });
                    toast.success("town modified successfully", { duration: 900 });
                    setDialogOpen(false);
                    }
                    else {
                        setDialogOpen(false);
                        toast.error("Erreur lors de la modification de la ville", { duration: 5000 });
                    }
                
            } catch (error) {
                console.error("Error during updated",error);
            }
    };


    const handleShowTown = (item) => {
        setSelectedTown(item);
        setIsEdited(false);
        setDialogOpen(true);
    };

    const handleEditedTown = (item) => {
        setSelectedTown(item);
        reset(item);
        setIsEdited(true);
        setDialogOpen(true);
    };


    const disabledTown = async (id) => {
        const confirmation = window.confirm("Êtes-vous sûr de vouloir désactiver cette ville ?");
        if (confirmation) {
            // const urlToDisabledTown = `${URLS.API_TOWN}/${id}`;
            const urlToDisabledTown = `${URLS.ENTITY_API}/towns/${id}`;
            

                    try {
                            const response = await handlePatch(urlToDisabledTown, { isActive:false });
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
                                        toast.success("town disabled successfully", { duration: 5000 });
                                        window.location.reload();
                                    },[200]);
                                }
                            isDialogOpen && setDialogOpen(false);
                    }
                    catch(error){
                        console.error("Erreur lors de la désactivation town :", error);
                    }

                    finally{
                        setIsLoading(false);
                        }

            } 
            else {
                console.log("La suppression a été annulée.");
            }
    };

    const enabledTown = async (id) => {
        const confirmation = window.confirm("Êtes-vous sûr de vouloir désactiver cette ville?");

        if (confirmation) {
            // const urlToDisabledTown = `${URLS.API_TOWN}/${id}`;
            const urlToDisabledTown = `${URLS.ENTITY_API}/towns/${id}`;

                    try {
                            const response = await handlePatch(urlToDisabledTown, {isActive:true});
                            // console.log("response for deleted", response);
                                if (response) {
                                    setTimeout(()=>{
                                        toast.success("town enabled successfully", { duration: 5000});
                                        window.location.reload();
                                    },[200]);
                                }
                                else {
                                  toast.error("Erreur lors de la réactivation town", { duration: 5000 });
                                }
                            isDialogOpen && setDialogOpen(false);
                    }
                    catch(error){
                        console.error("Erreur lors de la réactivation town :", error);
                    }

                    finally{
                        setIsLoading(false);
                        }

            } 
            else {
                console.log("La suppression a été annulée.");
            }
    };
    
    const deletedTown = async (id) => {
        const confirmation = window.confirm("Êtes-vous sûr de vouloir supprimer cette ville ?");

        if (confirmation) {
            const urlToDisabledTown = `${URLS.ENTITY_API}/towns/${id}`;

                    try {
                            const response = await handleDelete(urlToDisabledTown, {isActive:false});
                                if (response) {
                                    await delTown(id);
                                    toast.success("town supprimé avec succès", { duration: 5000});
                             
                                }
                                else {
                                  toast.error("Erreur lors de la désactivation town", { duration: 5000 });
                                }
                            isDialogOpen && setDialogOpen(false);
                    }
                    catch(error){
                        console.error("Erreur lors de la désactivation town :", error);
                    }

                    finally{
                        setIsLoading(false);
                        }

            } 
            else {
                console.log("La suppression a été annulée.");
            }
    };


    const showDialogTown = () => {
        
        return (
            <AlertDialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                <AlertDialogContent
                 className="w-[90%] sm:w-[80%] md:w-[60%] lg:w-[50%] xl:w-[40%] max-h-[80vh] overflow-y-auto p-4 bg-white rounded-lg shadow-lg"
                >
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                           <span className='flex text-left'>
                                { isEdited ? " Modifier les informations " : " Détails de la ville" }
                            </span>
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            { isEdited ? (
                                <form
                                    className='flex flex-col space-y-3 mt-5 text-xs'
                                     onSubmit={handleSubmit(onSubmit)}>
                                    <div className='flex flex-col text-left'>
                                            <label htmlFor='name' className="text-xs mt-2">
                                                Nom de la ville <sup className='text-red-500'>*</sup>
                                            </label>
                                            <Input
                                                id="name"
                                                type="text"
                                                defaultValue={selectedTown?.name}
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
                                            <label htmlFor='districtId' className="text-xs mt-2">
                                                Nom du district <sup className='text-red-500'>*</sup>
                                            </label>
                                                    <select
                                                    onChange={(e) => {
                                                        const nameCountrySelected = showDistricts.find(item => item.id === e.target.value);
                                                        setSelectedDistricts(nameCountrySelected);
                                                    }}
                                                    defaultValue={selectedTown?.districtId}
                                                    {...register('districtId')}
                                                    className={`w-[320px] sm:w-[400px] mb-2 text-bold px-2 py-3 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                                                        errors.districtId ? "border-red-500" : "border-gray-300"
                                                    }`}
                                                >
                                                    <option value="">Selectionner un district pour cette ville</option>
                                                    {showDistricts.map((item) => (
                                                        <option key={item.id} value={item.id}>
                                                            {item.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.districtId && (
                                                <p className="text-red-500 text-[9px] mt-1">{errors.districtId.message}</p>
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
                                selectedTown && (
                                    <div className='flex flex-col text-black text-left space-y-3'>

                                        <div>
                                            <p className="text-xs">Identifiant Unique</p>
                                            <h3 className="font-bold text-sm">{selectedTown?.id}</h3>
                                        </div>

                                        <div>
                                            <p className="text-xs">Nom de la ville</p>
                                            <h3 className="font-bold text-sm">{selectedTown?.name}</h3>
                                        </div>
                                        <div>
                                            <p className="text-xs">Nom du district</p>
                                            <h3 className="font-bold text-sm">{selectedTown?.districtId}</h3>
                                        </div>
                                       
                                        <div>
                                            <p className="text-xs">Date de création</p>
                                            <h3 className="font-bold text-sm">{selectedTown?.createdAt.split("T")[0]}</h3>
                                        </div>
                                        <div>
                                            <p className="text-xs">Statut</p>
                                            <h3 className="font-bold text-sm">
                                                {selectedTown?.isActive ? "Actif" : "Désactivé"}
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
                                                    selectedTown?.isActive == false ?
                                                        (
                                                                <AlertDialogAction
                                                                    className="border-2 border-blue-600 outline-blue-700 text-blue-700 text-xs shadow-md bg-transparent hover:bg-blue-600 hover:text-white transition"
                                                                    onClick={() => enabledTown(selectedTown.id)}>
                                                                        Activer
                                                                </AlertDialogAction>

                                                        ):(

                                                                <AlertDialogAction 
                                                                    className="border-2 border-gray-600 outline-gray-700 text-gray-700 text-xs shadow-md bg-transparent hover:bg-gray-600 hover:text-white transition"
                                                                    onClick={() => disabledTown(selectedTown.id)}>
                                                                        Désactiver
                                                                </AlertDialogAction>
                                                        )
                                                
                                                }
                                            
                                           </div> */}
                                            <AlertDialogAction 
                                                className="border-2 border-red-900 outline-red-700 text-red-900 text-xs shadow-md bg-transparent hover:bg-red-600 hover:text-white transition"
                                                onClick={() => deletedTown(selectedTown.id)}>
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


    const columnsTown = useMemo(() => [
        { accessorKey: 'name', header: 'Nom de la ville' },
        { accessorKey: 'districtId', header: 'Nom du district' },
        { accessorKey: 'isActive', header: 'Statut' },
        {
            accessorKey: "action",
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex justify-center">
                    <EyeIcon className="h-4 w-4 text-green-500" onClick={() => handleShowTown(row.original)} />
                    <PencilSquareIcon className="h-4 w-4 text-blue-500" onClick={() => handleEditedTown(row.original)} />
                    {/* <NoSymbolIcon className="h-4 w-4 text-gray-500" onClick={() => disabledTown(row.original.id)} /> */}
                    <TrashIcon className="h-4 w-4 text-red-500" onClick={() => deletedTown(row.original.id)} />
                </div>
            )
        },
    ], []);


    return {

                showDialogTown,
                columnsTown,
                handleShowTown,
                handleEditedTown,
             
    };
};