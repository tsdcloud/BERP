import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useFetch } from '../../../hooks/useFetch';
import { Button } from '../../ui/button';
import { URLS } from '../../../../configUrl';
import toast from 'react-hot-toast';
import Preloader from "../../Preloader";
import { CheckCircle, XCircle } from 'lucide-react';

const InitiateForm = ({ onSuccess, editData, onCancelEdit }) => {
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();
  const { handlePost, handlePatch } = useFetch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (editData) {
      setIsEditMode(true);
      setValue("name", editData.name);
      setValue("price", editData.price);
    } else {
      setIsEditMode(false);
      reset();
    }
  }, [editData, setValue, reset]);

  const submitForm = async (data) => {
    setIsSubmitting(true);
    try {
      let response;
      if (isEditMode && editData) {
        const url = `${URLS.INCIDENT_API}/weighing-prices/${editData.id}`;
        response = await handlePatch(url, data, true);
        if (response?.error) {
          response?.errors?.forEach(error => toast.error(error?.msg || "Erreur lors de la modification"));
          setIsSubmitting(false);
          return;
        }
        toast.success("Modifié avec succès");
      } else {
        const url = `${URLS.INCIDENT_API}/weighing-prices`;
        response = await handlePost(url, data, true);
        if (response?.error) {
          response?.errors?.forEach(error => toast.error(error?.msg || "Erreur lors de la création"));
          setIsSubmitting(false);
          return;
        }
        toast.success("Créé avec succès");
      }
      reset();
      onSuccess();
      if (onCancelEdit) onCancelEdit();
    } catch (error) {
      console.error("Erreur formulaire:", error);
      toast.error("Une erreur est survenue, vérifiez votre connexion ou contactez un IT");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    reset();
    if (onCancelEdit) onCancelEdit();
  };

  return (
    <form onSubmit={handleSubmit(submitForm)} className='space-y-4'>
      <div className='flex flex-col space-y-2'>
        <label htmlFor="name" className='text-sm font-semibold'>
          Nom du prix de pesée :
        </label>
        <input 
          id="name"
          {...register("name", {
            required: "Ce champ est requis",
            minLength: { value: 2, message: "Le nom doit contenir au moins 2 caractères" }
          })} 
          className={`p-2 border text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.name ? 'border-red-500 ring-red-500' : 'border-gray-300'
          }`} 
          placeholder="Entrer le nom"
          disabled={isSubmitting}
        />
        {errors.name && <small className='text-xs text-red-500'>{errors.name.message}</small>}
      </div>

      <div className='flex flex-col space-y-2'>
        <label htmlFor="price" className='text-sm font-semibold'>
          Prix (en XAF) :
        </label>
        <input 
          id="price"
          type="number"
          step="0.01"
          {...register("price", {
            valueAsNumber: true,
            min: { value: 0, message: "Le prix doit être supérieur ou égal à 0" }
          })} 
          className={`p-2 border text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.price ? 'border-red-500 ring-red-500' : 'border-gray-300'
          }`} 
          placeholder="0.00"
          disabled={isSubmitting}
        />
        {errors.price && <small className='text-xs text-red-500'>{errors.price.message}</small>}
      </div>
      
      <div className='flex justify-end gap-2 pt-2'>
        {isEditMode && (
          <Button 
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 text-sm flex gap-2 items-center"
          >
            <XCircle className="h-4 w-4" />
            <span>Annuler</span>
          </Button>
        )}
        <Button 
          type="submit"
          disabled={isSubmitting} 
          className={`${
            isSubmitting ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          } text-white font-semibold py-2 px-4 text-sm flex gap-2 items-center`}
        >
          {isSubmitting ? <Preloader size={20}/> : <CheckCircle className="h-4 w-4" />}
          <span>
            {isSubmitting 
              ? (isEditMode ? "Modification..." : "Création...") 
              : (isEditMode ? "Modifier le prix" : "Créer le prix")
            }
          </span>
        </Button>
      </div>
    </form>
  );
};

export default InitiateForm;