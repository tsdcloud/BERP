// components/incidents/EquipmentGroup/EditEquipmentGroupForm.jsx
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useFetch } from '../../../hooks/useFetch';
import { Button } from '../../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import AutoComplete from '../../common/AutoComplete';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';

const EditEquipmentGroupForm = ({ isOpen, onClose, group, onSuccess }) => {
  const { register, handleSubmit, formState: { errors }, setValue, reset, watch } = useForm();
  const { handlePatch, handleFetch } = useFetch();

  const [families, setFamilies] = useState([]);
  const [isLoadingFamilies, setIsLoadingFamilies] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState([]);

  // Initialiser le formulaire
  useEffect(() => {
    if (group && isOpen) {
      reset({
        name: group.name || '',
        equipmentGroupFamilyId: group.equipmentGroupFamily?.id || '',
        description: group.description || ''
      });
      setFormErrors([]);
    }
  }, [group, isOpen, reset]);

  // Soumettre le formulaire
    const submitForm = async (data) => {
        try {
        setIsSubmitting(true);
        setFormErrors([]);
        
        const updateData = {
            name: data.name,
            equipmentGroupFamilyId: data.equipmentGroupFamilyId,
            description: data.description || null
        };
    
        console.log("Données envoyées:", updateData);
    
        const response = await handlePatch(
            `${import.meta.env.VITE_INCIDENT_API}/equipment-groups/${group.id}`,
            updateData
        );
    
        console.log("Réponse API:", response);
    
        // CORRECTION : Votre API renvoie error dans apiResponse
        if (response?.error) {
            if (Array.isArray(response.error)) {
            setFormErrors(response.error);
            response.error.forEach(error => {
                toast.error(error.msg);
            });
            return;
            } else {
            toast.error(response.error || "Erreur lors de la mise à jour");
            return;
            }
        }
    
        // Si pas d'erreur mais pas de données non plus
        if (!response || !response.data) {
            toast.error("Réponse invalide du serveur");
            return;
        }
    
        toast.success("Groupe d'équipement mis à jour avec succès");
        onSuccess();
        onClose();
        
        } catch (error) {
        console.error("Erreur:", error);
        toast.error("La mise à jour a échoué");
        } finally {
        setIsSubmitting(false);
        }
    };

  // Charger les familles
  const handleFetchFamilies = async (searchQuery = "") => {
    setIsLoadingFamilies(true);
    try {
      let url = `${import.meta.env.VITE_INCIDENT_API}/equipment-group-families`;
      if (searchQuery) {
        url += `?search=${searchQuery}`;
      }
      
      let response = await handleFetch(url);
      if (response?.status === 200) {
        let dataArray = response?.data;
        
        if (dataArray && typeof dataArray === 'object' && dataArray.data && Array.isArray(dataArray.data)) {
          dataArray = dataArray.data;
        }
        
        if (Array.isArray(dataArray)) {
          let formatedData = dataArray.map(item => ({
            name: item?.name,
            value: item?.id,
            domain: item?.domain
          }));
          setFamilies(formatedData);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingFamilies(false);
    }
  };

  // Gestion de la sélection
  const handleSelectFamily = (item) => {
    if (item) {
      setValue("equipmentGroupFamilyId", item.value);
    } else {
      setValue("equipmentGroupFamilyId", "");
    }
  };

  // Charger les données initiales
  useEffect(() => {
    if (isOpen) {
      handleFetchFamilies();
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Modifier le groupe d'équipement</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              {/* <X className="h-4 w-4" /> */}
            </Button>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(submitForm)} className='space-y-4'>
          {/* Nom */}
          <div>
            <label className='block text-sm font-semibold mb-1'>
              Nom <span className='text-red-500'>*</span>
            </label>
            <input
              {...register("name", { required: "Ce champ est requis" })}
              className={`w-full p-2 border rounded-lg ${errors.name ? 'border-red-500' : ''}`}
              placeholder="Nom du groupe"
            />
            {errors.name && (
              <small className='text-xs text-red-500'>{errors.name.message}</small>
            )}
          </div>

          {/* Famille (domaine) */}
          <div>
            <label className='block text-sm font-semibold mb-1'>
              Famille/Domaine <span className='text-red-500'>*</span>
            </label>
            <AutoComplete
              placeholder="Rechercher une famille"
              isLoading={isLoadingFamilies}
              dataList={families}
              onSearch={handleFetchFamilies}
              onSelect={handleSelectFamily}
              defaultValue={families.find(f => f.value === watch('equipmentGroupFamilyId'))}
            />
            {errors.equipmentGroupFamilyId && (
              <small className='text-xs text-red-500'>{errors.equipmentGroupFamilyId.message}</small>
            )}
          </div>

          {/* Description */}
          <div>
            <label className='block text-sm font-semibold mb-1'>
              Description
            </label>
            <textarea
              {...register("description")}
              className="w-full p-2 border rounded-lg"
              placeholder="Description du groupe..."
              rows={3}
            />
          </div>

          {/* Affichage des erreurs */}
          {formErrors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-semibold text-red-700 mb-2">Erreurs de validation :</h4>
              <ul className="text-sm text-red-600">
                {formErrors.map((error, index) => (
                  <li key={index}>• {error.msg || error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Boutons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary hover:bg-secondary text-white"
            >
              {isSubmitting ? "Mise à jour..." : "Mettre à jour"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditEquipmentGroupForm;