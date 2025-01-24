import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../../ui/alert-dialog";
import { Input } from '../../ui/input';
import { Button } from "../../ui/button";
import { Toaster } from 'react-hot-toast';

export const ApplicationDialog = ({ 
    isDialogOpen, 
    setDialogOpen, 
    isEdited, 
    selectedApplication, 
    errors, 
    register, 
    handleSubmit, 
    onSubmit, 
    isSubmitting,
    setSelectedPermission,
    selectedPermission,
    activedApplication,
    disabledApplication,
    deletedApplication

}) => {
    return (
        <AlertDialog open={isDialogOpen} onOpenChange={setDialogOpen}>
            <AlertDialogContent className="w-[90%] sm:w-[80%] md:w-[60%] lg:w-[50%] xl:w-[40%] max-h-[80vh] overflow-y-auto p-4 bg-white rounded-lg shadow-lg">
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        <span className='flex text-left'>{isEdited ? "Modifier les informations" : "Détails de l'application"}</span>
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {isEdited ? (
                            <form
                                className='flex flex-col space-y-3 mt-5 text-xs'
                                onSubmit={handleSubmit(onSubmit)}
                            >
                                <div className="flex flex-col text-left">
                                    <label htmlFor='application_name' className="text-xs mt-2">
                                        Nom de l'application <sup className='text-red-500'>*</sup>
                                    </label>
                                    <Input
                                        id="application_name"
                                        type="text"
                                        defaultValue={selectedApplication?.application_name}
                                        {...register("application_name")}
                                        className={`w-full sm:w-[400px] mb-2 text-bold px-2 py-3 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                                            errors.application_name ? "border-red-500" : "border-gray-300"
                                        }`}
                                    />
                                    {errors.application_name && (
                                        <p className="text-red-500 text-[9px] mt-1">{errors.application_name.message}</p>
                                    )}
                                </div>
                                <div className="flex flex-col text-left">
                                    <label htmlFor='description' className="text-xs">
                                        Description <sup className='text-red-500'>*</sup>
                                    </label>
                                    <Input
                                        id="description"
                                        type="text"
                                        defaultValue={selectedApplication?.description}
                                        {...register("description")}
                                        className={`w-full sm:w-[400px] mb-2 text-bold px-2 py-3 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                                            errors.description ? "border-red-500" : "border-gray-300"
                                        }`}
                                    />
                                    {errors.description && (
                                        <p className="text-red-500 text-[9px] mt-1">{errors.description.message}</p>
                                    )}
                                </div>
                                <div className="flex flex-col text-left">
                                    <label htmlFor='url' className="text-xs">
                                        Lien <sup className='text-red-500'>*</sup>
                                    </label>
                                    <Input
                                        id="url"
                                        type="text"
                                        defaultValue={selectedApplication?.url}
                                        {...register("url")}
                                        className={`w-full sm:w-[400px] mb-2 text-bold px-2 py-3 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                                            errors.url ? "border-red-500" : "border-gray-300"
                                        }`}
                                    />
                                    {errors.url && (
                                        <p className="text-red-500 text-[9px] mt-1">{errors.url.message}</p>
                                    )}
                                </div>
                                <div className="flex flex-wrap justify-end gap-2">
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="border-2 border-green-900 outline-green-900 text-green-900 text-xs shadow-md bg-transparent hover:bg-green-700 hover:text-white transition"
                                    >
                                        {isSubmitting ? "Validation en cours..." : "Valider"}
                                    </Button>
                                    <AlertDialogCancel
                                        className="border-2 border-black outline-black text-black text-xs shadow-md hover:bg-black hover:text-white transition"
                                    >
                                        Retour
                                    </AlertDialogCancel>
                                </div>
                                <Toaster />
                            </form>
                        ) : (
                            selectedApplication && (
                                <div className='flex flex-col text-left text-black space-y-3'>
                                    <div>
                                        <p className="text-xs">Identifiant Unique</p>
                                        <h3 className="font-bold text-sm">{selectedApplication?.id}</h3>
                                    </div>
                                    <div>
                                        <p className="text-xs">Nom de l'application</p>
                                        <h3 className="font-bold text-sm">{selectedApplication?.application_name}</h3>
                                    </div>
                                    <div>
                                        <p className="text-xs">Description</p>
                                        <h3 className="font-bold text-sm">{selectedApplication?.description}</h3>
                                    </div>
                                    <div>
                                        <p className="text-xs">Lien</p>
                                        <h3 className="font-bold text-sm">{selectedApplication?.url}</h3>
                                    </div>
                                    <div>
                                        <p className="text-xs">Statut</p>
                                        <h3 className="font-bold text-sm">
                                            {selectedApplication?.is_active ? "Actif" : "Désactivé"}
                                        </h3>
                                    </div>
                                    <div className=''>
                                        <p className="text-xs mb-2">Permissions</p>
                                        <div className="flex flex-wrap">
                                            {selectedApplication.permissions.length === 0 ? <h3 className="font-bold text-sm">This application does'nt have permissions</h3> : selectedApplication.permissions.map((permission) => (
                                            <div key={permission.id}>
                                                <button
                                                onClick={() => setSelectedPermission((prev) => (prev?.id === permission.id ? null : permission))}
                                                className={`w-auto text-left mt-1 ml-1 px-4 py-2 ${selectedPermission && selectedPermission.id === permission.id ? "bg-green-600" : "bg-green-500"} text-white rounded-lg hover:bg-green-600`}
                                                >
                                                    {permission.display_name}
                                                </button>
                                            </div>
                                            ))}
                                        </div>
                                        {selectedPermission && (
                                            <div className="ml-1 mt-2 p-4 bg-gray-50 rounded-lg">
                                                <h3 className="font-bold text-sm">Détails de la permission</h3>
                                                <p>Nom : {selectedPermission.display_name}</p>
                                                <p>Description : {selectedPermission.description}</p>
                                                <p>Statut : {selectedPermission.is_active ? "Actif" : "Inactif"}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        )}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                        {
                        isEdited === false ? (
                            <div className='flex space-x-2 justify-end'>
                                            <div className='flex space-x-2'>
                                            { 
                                                !selectedApplication?.is_active ? 
                                                    (
                                                            <AlertDialogAction
                                                                className="border-2 border-blue-600 outline-blue-700 text-blue-700 text-xs shadow-md bg-transparent hover:bg-blue-600 hover:text-white transition"
                                                                onClick={() => activedApplication(selectedApplication.id)}>
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
                                            
                                           </div>
                                            <AlertDialogAction 
                                                className="border-2 border-red-900 outline-red-700 text-red-900 text-xs shadow-md bg-transparent hover:bg-red-600 hover:text-white transition"
                                                onClick={() => deletedApplication(selectedApplication.id)}>
                                                    Supprimer
                                            </AlertDialogAction>
                                            <AlertDialogCancel 
                                                className="border-2 border-black outline-black text-black text-xs shadow-md hover:bg-black hover:text-white transition"
                                                onClick={() => {setDialogOpen(false); setSelectedPermission(null)}}>
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
