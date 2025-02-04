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
const districtSchema = z.object({
    name: z.string()
    .nonempty("Ce champs 'Nom' est réquis.")
    .min(5, "le champs doit avoir une valeur de 5 caractères au moins.")
    .max(100)
    .regex(/^[a-zA-Z0-9\s]+$/, "Ce champ doit être un 'nom' conforme."),

    countryId: z.string()
    .nonempty('Ce champs "Nom du pays" est réquis')
    .min(4, "La valeur de ce champs doit contenir au moins 4 caractères.")
    .max(100)
    .regex(/^(?:[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[4][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|[a-zA-Z0-9 ,]+)$/, "Ce champs doit être un 'nom du pays Conforme."),

    createdBy: z.string().nonempty("Le champ 'createdBy' est requis."),
  });

// fonction principale pour gérer les actions utilisateur
export const DistrictAction = () => {
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isEdited, setIsEdited] = useState(true);
    const [selectedDistrict, setSelectedDistrict] = useState({});
    const [showCountries, setShowCountries] = useState([]);
    const [error, setError] = useState();
    const [selectedCountries, setSelectedCountries] = useState([]);

    const [tokenUser, setTokenUser] = useState();


    const { register, handleSubmit, reset, formState:{errors, isSubmitting} } = useForm({
        resolver: zodResolver(districtSchema),
    });

   const { handlePatch, handleDelete, handleFetch } = useFetch();
   

   const fetchCountries = async () => {
    const getCountries = URLS.API_COUNTRY;
    try {
        setIsLoading(true);
        const response = await handleFetch(getCountries);
        
            if (response && response?.status === 200) {
                    const results = response?.data;
                    // console.log("results", results);

                    const filteredCountries = results?.map(item => {
                    const { createdBy, updateAt, ...rest } = item;
                    return { id: item.id, ...rest};
                });
                    // console.log("countries",filteredCountries);
                    setShowCountries(filteredCountries);
            }
            else{
                throw new Error('Erreur lors de la récupération des pays');
            }
    } catch (error) {
        setError(error.message);
    }
    finally {
        setIsLoading(false);
      }
     };

  useEffect(()=>{
    fetchCountries();
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
        // console.log("data role", data);

        const urlToUpdate = `${URLS.API_DISTRICT}/${selectedDistrict?.id}`;
      
        try {
            const response = await handlePatch(urlToUpdate, data);
            // console.log("response role update", response);
                if (response) {
                    setDialogOpen(false);
                        
                    setTimeout(()=>{
                        toast.success("district modified successfully", { duration: 900 });
                        window.location.reload();
                    },[200]);
                }
                else {
                    setDialogOpen(false);
                    toast.error("Erreur lors de la modification de la permission", { duration: 5000 });
                }
            
          } catch (error) {
            console.error("Error during updated",error);
          }
    };


    const handleShowDistrict = (item) => {
        setSelectedDistrict(item);
        setIsEdited(false);
        setDialogOpen(true);
        console.log("item", item);
    };

    const handleEditedDistrict = (item) => {
        setSelectedDistrict(item);
        reset(item);
        setIsEdited(true);
        setDialogOpen(true);
    };


    const disabledDistrict = async (id) => {
        const confirmation = window.confirm("Êtes-vous sûr de vouloir désactiver ce district ?");
        if (confirmation) {
            const urlToDisabledDistrict = `${URLS.API_DISTRICT}/${id}`;

                    try {
                            const response = await handlePatch(urlToDisabledDistrict, { isActive:false });
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
                                        toast.success("district disabled successfully", { duration: 5000 });
                                        // window.location.reload();
                                    },[200]);
                                }
                            isDialogOpen && setDialogOpen(false);
                    }
                    catch(error){
                        console.error("Erreur lors de la désactivation district :", error);
                    }

                    finally{
                        setIsLoading(false);
                        }

            } 
            else {
                console.log("La suppression a été annulée.");
            }
    };

    const enabledDistrict = async (id) => {
        const confirmation = window.confirm("Êtes-vous sûr de vouloir désactiver ce district?");

        if (confirmation) {
            const urlToDisabledDistrict = `${URLS.API_DISTRICT}/${id}`;

                    try {
                            const response = await handlePatch(urlToDisabledDistrict, {isActive:true});
                            console.log("response for deleted", response);
                                if (response) {
                                    setTimeout(()=>{
                                        toast.success("district enabled successfully", { duration: 5000});
                                        window.location.reload();
                                    },[200]);
                                }
                                else {
                                  toast.error("Erreur lors de la réactivation district", { duration: 5000 });
                                }
                            isDialogOpen && setDialogOpen(false);
                    }
                    catch(error){
                        console.error("Erreur lors de la réactivation district :", error);
                    }

                    finally{
                        setIsLoading(false);
                        }

            } 
            else {
                console.log("La suppression a été annulée.");
            }
    };
    
    const deletedDistrict = async (id) => {
        const confirmation = window.confirm("Êtes-vous sûr de vouloir supprimer ce district ?");

        if (confirmation) {
            const urlToDisabledDistrict = `${URLS.API_DISTRICT}/${id}`;

                    try {
                            const response = await handleDelete(urlToDisabledDistrict, {isActive:false});
                            // console.log("response for deleted", response);
                                if (response) {
                                    setTimeout(()=>{
                                        toast.success("district disabled successfully", { duration: 5000});
                                        window.location.reload();
                                    },[200]);
                                }
                                else {
                                  toast.error("Erreur lors de la désactivation district", { duration: 5000 });
                                }
                            isDialogOpen && setDialogOpen(false);
                    }
                    catch(error){
                        console.error("Erreur lors de la désactivation district :", error);
                    }

                    finally{
                        setIsLoading(false);
                        }

            } 
            else {
                console.log("La suppression a été annulée.");
            }
    };


    const showDialogDistrict = () => {
        
        return (
            <AlertDialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            { isEdited ? " Modifier les informations " : " Détails du district" }
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            { isEdited ? (
                                <form
                                    className='flex flex-col space-y-3 mt-5 text-xs'
                                     onSubmit={handleSubmit(onSubmit)}>
                                    <div>
                                            <label htmlFor='name' className="text-xs mt-2">
                                                Nom du district <sup className='text-red-500'>*</sup>
                                            </label>
                                            <Input
                                                id="name"
                                                type="text"
                                                defaultValue={selectedDistrict?.name}
                                                {...register("name")}
                                                className={`w-[400px] mb-2 text-bold px-2 py-3 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                                                    errors.name ? "border-red-500" : "border-gray-300"
                                                }`}
                                                />
                                                {errors.name && (
                                                <p className="text-red-500 text-[9px] mt-1">{errors.name.message}</p>
                                                )}
                                    </div>
                                    <div className=' flex flex-col'>
                                            <label htmlFor='countryId' className="text-xs mt-2">
                                                Nom du pays <sup className='text-red-500'>*</sup>
                                            </label>
                                                    <select
                                                    onChange={(e) => {
                                                        const nameCountrySelected = showCountries.find(item => item.id === e.target.value);
                                                        setSelectedCountries(nameCountrySelected);
                                                    }}
                                                    defaultValue={selectedDistrict?.countryId}
                                                    {...register('countryId')}
                                                    className={`w-[400px] mb-2 text-bold px-2 py-3 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                                                        errors.countryId ? "border-red-500" : "border-gray-300"
                                                    }`}
                                                >
                                                    <option value="">Selectionner un pays pour ce district</option>
                                                    {showCountries.map((item) => (
                                                        <option key={item.id} value={item.id}>
                                                            {item.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.countryId && (
                                                <p className="text-red-500 text-[9px] mt-1">{errors.countryId.message}</p>
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
                                selectedDistrict && (
                                    <div className='flex flex-col text-black space-y-3'>

                                        <div>
                                            <p className="text-xs">Identifiant Unique</p>
                                            <h3 className="font-bold text-sm">{selectedDistrict?.id}</h3>
                                        </div>

                                        <div>
                                            <p className="text-xs">Nom du district</p>
                                            <h3 className="font-bold text-sm">{selectedDistrict?.name}</h3>
                                        </div>
                                        <div>
                                            <p className="text-xs">Nom du pays</p>
                                            <h3 className="font-bold text-sm">{selectedDistrict?.countryId}</h3>
                                        </div>
                                       
                                        <div>
                                            <p className="text-xs">Date de création</p>
                                            <h3 className="font-bold text-sm">{selectedDistrict?.createdAt.split("T")[0]}</h3>
                                        </div>
                                        <div>
                                            <p className="text-xs">Statut</p>
                                            <h3 className="font-bold text-sm">
                                                {selectedDistrict?.isActive ? "Actif" : "Désactivé"}
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
                                                    selectedDistrict?.isActive == false ?
                                                        (
                                                                <AlertDialogAction
                                                                    className="border-2 border-blue-600 outline-blue-700 text-blue-700 text-xs shadow-md bg-transparent hover:bg-blue-600 hover:text-white transition"
                                                                    onClick={() => enabledDistrict(selectedDistrict.id)}>
                                                                        Activer
                                                                </AlertDialogAction>

                                                        ):(

                                                                <AlertDialogAction 
                                                                    className="border-2 border-gray-600 outline-gray-700 text-gray-700 text-xs shadow-md bg-transparent hover:bg-gray-600 hover:text-white transition"
                                                                    onClick={() => disabledDistrict(selectedDistrict.id)}>
                                                                        Désactiver
                                                                </AlertDialogAction>
                                                        )
                                                
                                                }
                                            
                                           </div> */}
                                            <AlertDialogAction 
                                                className="border-2 border-red-900 outline-red-700 text-red-900 text-xs shadow-md bg-transparent hover:bg-red-600 hover:text-white transition"
                                                onClick={() => deletedDistrict(selectedDistrict.id)}>
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


    const columnsDistrict = useMemo(() => [
        { accessorKey: 'name', header: 'Nom du district' },
        { accessorKey: 'countryId', header: 'Nom du pays' },
        // { accessorKey: 'phone', header: 'Téléphone' },
        // { accessorKey: 'createdAt', header: 'Date de création' },
        { accessorKey: 'isActive', header: 'Statut' },
        {
            accessorKey: "action",
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex justify-center">
                    <EyeIcon className="h-4 w-4 text-green-500" onClick={() => handleShowDistrict(row.original)} />
                    <PencilSquareIcon className="h-4 w-4 text-blue-500" onClick={() => handleEditedDistrict(row.original)} />
                    {/* <NoSymbolIcon className="h-4 w-4 text-gray-500" onClick={() => disabledDistrict(row.original.id)} /> */}
                    <TrashIcon className="h-4 w-4 text-red-500" onClick={() => deletedDistrict(row.original.id)} />
                </div>
            )
        },
    ], []);


    return {

                showDialogDistrict,
                columnsDistrict,
                handleShowDistrict,
                handleEditedDistrict,
             
    };
};