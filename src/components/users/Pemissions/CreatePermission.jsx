import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import CustomingModal from '../../modals/CustomingModal';
import { Button } from "../../ui/button";
import { useFetch } from '../../../hooks/useFetch';
import toast, { Toaster } from 'react-hot-toast';
import PropTypes from 'prop-types';
import { URLS } from '../../../../configUrl';

export default function CreatePermission({ setOpen, onSubmit }) {
    const permissionSchema = z.object({
        display_name: z.string()
            .nonempty("Ce champs 'Nom' est réquis.")
            .min(5, "le champs doit avoir une valeur de 5 caractères au moins.")
            .max(100),
        description: z.string()
            .nonempty("Ce champs 'description' est réquis")
            .min(5, "le champs doit avoir une valeur de 5 caractères au moins.")
            .max(100),
    });

    const { handlePost } = useFetch();
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(permissionSchema),
    });

    // const handleCancel = (e) => {
    //     e.preventDefault();
    //     setOpen(false);
    // };

    const handleSubmitDataFormPermission = async (data) => {
        const urlToCreatePermission = URLS.API_PERMISSION;
        try {
            const response = await handlePost(urlToCreatePermission, data, true);
            if (response && response.status === 201) {
                toast.success("Permission créée avec succès", { duration: 2000 });
                setOpen(false);
                onSubmit(response);
                reset();
            } else {
                toast.error(response.errors.display_name, { duration: 5000 });
            }
        } catch (error) {
            toast.error("Erreur lors de la création de la permission", { duration: 5000 });
        }
    };

    return (
        <CustomingModal
            title="Ajouter une nouvelle permission"
            buttonText="Créer une permission"
        >
            <div className='space-y-0'>
                <p className='text-[12px] mb-2'>Veuillez correctement renseigner les informations de la permission.</p>
                <form onSubmit={handleSubmit(handleSubmitDataFormPermission)} className='sm:bg-blue-200 md:bg-transparent'>
                    <div className='mb-1'>
                        <label htmlFor="display_name" className="block text-xs font-medium mb-0">
                            Nom<sup className='text-red-500'>*</sup>
                        </label>
                        <input
                            id='display_name'
                            type="text"
                            {...register('display_name')}
                            className={`w-2/3 px-2 py-2 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${errors.display_name ? "border-red-500" : "border-gray-300"}`}
                        />
                        {errors.display_name && (
                            <p className="text-red-500 text-[9px] mt-1">{errors.display_name.message}</p>
                        )}
                    </div>

                    <div className='mb-1'>
                        <label htmlFor="description" className="block text-xs font-medium mb-0">
                            Description<sup className='text-red-500'>*</sup>
                        </label>
                        <input
                            id='description'
                            type="text"
                            {...register('description')}
                            className={`w-2/3 px-2 py-2 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 ${errors.description ? "border-red-500" : "border-gray-300"}`}
                        />
                        {errors.description && (
                            <p className="text-red-500 text-[9px] mt-1">{errors.description.message}</p>
                        )}
                    </div>

                    <div className='flex justify-end space-x-2 mt-2'>
                        <Button
                            className="border-2 border-blue-600 outline-blue-700 text-blue-700 text-xs shadow-md bg-transparent hover:bg-primary hover:text-white transition"
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Création en cours..." : "Créer une permission"}
                        </Button>
                    </div>
                </form>
                <Toaster />
            </div>
        </CustomingModal>
    );
}

CreatePermission.propTypes = {
    setOpen: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
};