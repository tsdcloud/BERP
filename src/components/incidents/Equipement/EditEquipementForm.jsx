// components/incidents/Equipement/EditEquipementForm.jsx
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useFetch } from '../../../hooks/useFetch';
import { Button } from '../../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import AutoComplete from '../../common/AutoComplete';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';

const EditEquipementForm = ({ isOpen, onClose, equipement, onSuccess }) => {
  const { register, handleSubmit, formState: { errors }, setValue, reset, watch } = useForm();
  const { handlePatch, handleFetch } = useFetch();

  const [sites, setSites] = useState([]);
  const [groups, setGroups] = useState([]);
  const [isLoadingSites, setIsLoadingSites] = useState(false);
  const [isLoadingGroups, setIsLoadingGroups] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState([]);

  // Initialiser le formulaire
  useEffect(() => {
    if (equipement && isOpen) {
      reset({
        title: equipement.title || '',
        operatingMode: equipement.operatingMode || '',
        lifeSpan: equipement.lifeSpan || '',
        periodicity: equipement.periodicity || '',
        status: equipement.status || '',
        equipmentGroupId: equipement.equipmentGroup?.id || '',
        siteId: equipement.siteId || '',
        numRef: equipement.numRef || ''
      });
      setFormErrors([]);
    }
  }, [equipement, isOpen, reset]);

  // Soumettre le formulaire
  const submitForm = async (data) => {
    try {
      setIsSubmitting(true);
      setFormErrors([]);
      
      // Préparer les données pour l'API
      const updateData = {
        title: data.title,
        operatingMode: parseFloat(data.operatingMode) || 0,
        lifeSpan: parseFloat(data.lifeSpan) || 0,
        periodicity: parseFloat(data.periodicity) || 0,
        status: data.status,
        equipmentGroupId: data.equipmentGroupId,
        siteId: data.siteId || null, // Peut être null
        numRef: data.numRef
      };

      console.log("Données envoyées:", updateData);

      const response = await handlePatch(
        `${import.meta.env.VITE_INCIDENT_API}/equipements/${equipement.id}`,
        updateData
      );

      console.log("Réponse API:", response);

      // Gestion des erreurs de l'API
      if (response?.isError) {
        if (Array.isArray(response.error)) {
          setFormErrors(response.error);
          response.error.forEach(error => {
            toast.error(error.msg);
          });
        } else {
          toast.error(response.error || "Erreur lors de la mise à jour");
        }
        return;
      }

      if (response?.error_list) {
        setFormErrors(response.error_list);
        response.error_list.forEach(error => {
          toast.error(error.msg);
        });
        return;
      }

      toast.success("Équipement mis à jour avec succès");
      onSuccess();
      onClose();
      
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("La mise à jour a échoué");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Charger les sites
  const handleFetchSites = async (searchQuery = "") => {
    setIsLoadingSites(true);
    try {
      let url = `${import.meta.env.VITE_ENTITY_API}/sites`;
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
            value: item?.id
          }));
          setSites(formatedData);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingSites(false);
    }
  };

  // Charger les groupes
  const handleFetchGroups = async (searchQuery = "") => {
    setIsLoadingGroups(true);
    try {
      let url = `${import.meta.env.VITE_INCIDENT_API}/equipment-groups`;
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
            domain: item?.equipmentGroupFamily?.domain
          }));
          setGroups(formatedData);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingGroups(false);
    }
  };

  // Gestion des sélections AutoComplete
  const handleSelectSite = (item) => {
    if (item) {
      setValue("siteId", item.value);
    } else {
      setValue("siteId", "");
    }
  };

  const handleSelectGroup = (item) => {
    if (item) {
      setValue("equipmentGroupId", item.value);
    } else {
      setValue("equipmentGroupId", "");
    }
  };

  // Charger les données initiales
  useEffect(() => {
    if (isOpen) {
      handleFetchSites();
      handleFetchGroups();
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Modifier l'équipement</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(submitForm)} className='space-y-4'>
          {/* Numéro de référence */}
          <div>
            <label className='block text-sm font-semibold mb-1'>
              Numéro de référence <span className='text-red-500'>*</span>
            </label>
            <input
              {...register("numRef", { required: "Ce champ est requis" })}
              className={`w-full p-2 border rounded-lg bg-gray-100 text-gray-700 border-gray-300 cursor-not-allowed ${errors.numRef ? 'border-red-500' : ''}`}
              placeholder="Numéro de référence"
              disabled={true}
              readOnly={true}
            />
            {errors.numRef && (
              <small className='text-xs text-red-500'>{errors.numRef.message}</small>
            )}
          </div>

          {/* Titre */}
          <div>
            <label className='block text-sm font-semibold mb-1'>
              Intitulé <span className='text-red-500'>*</span>
            </label>
            <input
              {...register("title", { required: "Ce champ est requis" })}
              className={`w-full p-2 border rounded-lg ${errors.title ? 'border-red-500' : ''}`}
              placeholder="Nom de l'équipement"
            />
            {errors.title && (
              <small className='text-xs text-red-500'>{errors.title.message}</small>
            )}
          </div>

          {/* Informations techniques */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className='block text-sm font-semibold mb-1'>
                Régime Nominal
              </label>
              <input
                type='number'
                step="0.01"
                {...register("operatingMode")}
                className={`w-full p-2 border rounded-lg ${errors.operatingMode ? 'border-red-500' : ''}`}
                placeholder="Régime nominal"
              />
              {errors.operatingMode && (
                <small className='text-xs text-red-500'>{errors.operatingMode.message}</small>
              )}
            </div>

            <div>
              <label className='block text-sm font-semibold mb-1'>
                Durée de vie (jours)
              </label>
              <input
                type='number'
                step="0.01"
                {...register("lifeSpan")}
                className={`w-full p-2 border rounded-lg ${errors.lifeSpan ? 'border-red-500' : ''}`}
                placeholder="Durée de vie"
              />
              {errors.lifeSpan && (
                <small className='text-xs text-red-500'>{errors.lifeSpan.message}</small>
              )}
            </div>

            <div>
              <label className='block text-sm font-semibold mb-1'>
                Périodicité (jours) <span className='text-red-500'>*</span>
              </label>
              <input
                type='number'
                step="0.01"
                {...register("periodicity", { required: "Ce champ est requis" })}
                className={`w-full p-2 border rounded-lg ${errors.periodicity ? 'border-red-500' : ''}`}
                placeholder="Périodicité"
              />
              {errors.periodicity && (
                <small className='text-xs text-red-500'>{errors.periodicity.message}</small>
              )}
            </div>
          </div>

          {/* Statut */}
          <div>
            <label className='block text-sm font-semibold mb-1'>
              Statut d'équipement
            </label>
            <select
              {...register("status")}
              className={`w-full p-2 border rounded-lg ${errors.status ? 'border-red-500' : ''}`}
            >
              <option value="">Sélectionner un statut</option>
              <option value="NEW">NEUF</option>
              <option value="SECOND_HAND">SECONDE MAIN</option>
            </select>
            {errors.status && (
              <small className='text-xs text-red-500'>{errors.status.message}</small>
            )}
          </div>

          {/* Groupe d'équipement */}
          <div>
            <label className='block text-sm font-semibold mb-1'>
              Groupe d'équipement <span className='text-red-500'>*</span>
            </label>
            <AutoComplete
              placeholder="Rechercher un groupe"
              isLoading={isLoadingGroups}
              dataList={groups}
              onSearch={handleFetchGroups}
              onSelect={handleSelectGroup}
              defaultValue={groups.find(g => g.value === watch('equipmentGroupId'))}
            />
            {errors.equipmentGroupId && (
              <small className='text-xs text-red-500'>{errors.equipmentGroupId.message}</small>
            )}
          </div>

          {/* Site */}
          <div>
            <label className='block text-sm font-semibold mb-1'>
              Site
            </label>
            <AutoComplete
              placeholder="Rechercher un site"
              isLoading={isLoadingSites}
              dataList={sites}
              onSearch={handleFetchSites}
              onSelect={handleSelectSite}
              defaultValue={sites.find(s => s.value === watch('siteId'))}
            />
            {errors.siteId && (
              <small className='text-xs text-red-500'>{errors.siteId.message}</small>
            )}
          </div>

          {/* Affichage des erreurs de validation serveur */}
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

export default EditEquipementForm;