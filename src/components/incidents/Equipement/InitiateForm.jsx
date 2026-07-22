import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useFetch } from '../../../hooks/useFetch';
import { Button } from '../../ui/button';
import { URLS } from '../../../../configUrl';
import AutoComplete from '../../common/AutoComplete';
import toast from 'react-hot-toast';
import Preloader from "../../Preloader";
import { CheckCircle, X, AlertTriangle } from 'lucide-react';

const InitiateForm = ({ onSucess }) => {
  
  // 1. Initialisation de React Hook Form
  const { register, handleSubmit, formState: { errors }, setValue, reset, watch } = useForm();
  const { handlePost, handleFetch } = useFetch();

  // 2. États pour les données et le chargement
  const [sites, setSites] = useState([]);
  const [groups, setGroups] = useState([]);
  const [isLoadingSites, setIsLoadingSites] = useState(true);
  const [isLoadingGroups, setIsLoadingGroups] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // État pour suivre la progression (évite le crash ReferenceError)
  const [currentProgress, setCurrentProgress] = useState(0);
  const [selectedSites, setSelectedSites] = useState([]);

  /**
   * SOUMISSION DU FORMULAIRE
   * Gestion sécurisée de la création multiple
   */
  const submitForm = async (data) => {
    if (selectedSites.length === 0) {
      toast.error("Veuillez sélectionner au moins un site");
      return;
    }

    setIsSubmitting(true);
    setCurrentProgress(0);
    let successfulCreations = 0;

    try {
      // Utilisation d'une boucle for...of pour un contrôle asynchrone strict
      for (const site of selectedSites) {
        try {
          const equipmentData = {
            ...data,
            title: `${data.title}_${site.name}`,
            siteId: site.value
          };

          const response = await handlePost(`${URLS.INCIDENT_API}/equipements`, equipmentData, true);

          // Vérification de la réponse (s'adapte selon la structure de votre backend)
          if (response && !response.error) {
            successfulCreations++;
          } else {
            const errorMsg = response?.error_list?.[0]?.msg || "Erreur de contrainte";
            toast.error(`Échec sur ${site.name}: ${errorMsg}`);
          }
        } catch (siteError) {
          console.error(`Erreur sur le site ${site.name}:`, siteError);
        } finally {
          // Mise à jour du state de progression pour l'UI
          setCurrentProgress(prev => prev + 1);
        }
      }

      // Résultat final
      if (successfulCreations > 0) {
        toast.success(`${successfulCreations} équipement(s) créé(s) avec succès`);
        
        // Petit délai pour laisser les notifications s'afficher avant de fermer
        setTimeout(() => {
          reset();
          setSelectedSites([]);
          onSucess(); // Déclenche handleSubmit du parent (Equipement.jsx)
        }, 500);
      }
    } catch (globalError) {
      console.error("Erreur critique boucle:", globalError);
      toast.error("Une erreur imprévue est survenue");
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * RÉCUPÉRATION DES DONNÉES (Sites et Groupes)
   */
  const handleFetchSites = async (link) => {
    setIsLoadingSites(true);
    try {
      let response = await handleFetch(link);     
      if(response?.status === 200 || response?.data){
        let dataArray = response?.data?.data || response?.data || [];
        if (Array.isArray(dataArray)) {
          setSites(dataArray.map(item => ({ name: item.name, value: item.id })));
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingSites(false);
    }
  }

  const handleFetchGroups = async (link, searchQuery = "") => {
    setIsLoadingGroups(true);
    let url = searchQuery ? `${link}${link.includes('?') ? '&' : '?'}search=${searchQuery}` : link;
    try {
      let response = await handleFetch(url);     
      if(response?.status === 200 || response?.data){
        let dataArray = response?.data?.data || response?.data || [];
        if (Array.isArray(dataArray)) {
          setGroups(dataArray.map(item => ({ name: item.name, value: item.id })));
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingGroups(false);
    }
  }

  // Sélection/Suppression des sites
  const handleSelectSites = (item) => {
    if (item && !selectedSites.some(site => site.value === item.value)) {
      setSelectedSites(prev => [...prev, item]);
    } else if (item) {
      toast.error("Site déjà ajouté");
    }
  };

  const handleRemoveSite = (siteValue) => {
    setSelectedSites(prev => prev.filter(site => site.value !== siteValue));
  };

  useEffect(() => {
    handleFetchSites(`${URLS.ENTITY_API}/sites`);
    handleFetchGroups(`${URLS.INCIDENT_API}/equipment-groups`);
  }, []);

  return (
    <form onSubmit={handleSubmit(submitForm)} className='flex flex-col h-full'>
      
      {/* Zone scrollable */}
      <div className='space-y-4 max-w-md overflow-y-auto max-h-[60vh] px-4 pr-2'>
        
        <div className='flex flex-col space-y-1'>
          <label className='text-sm font-semibold'>Intitulé <span className='text-red-500'>*</span></label>
          <input 
            {...register("title", {required: "L'intitulé est obligatoire"})} 
            className={`p-2 border rounded-lg text-sm ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Ex: Groupe Électrogène"
          />
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <div className='flex flex-col space-y-1'>
            <label className='text-sm font-semibold'>Régime (Nominal)</label>
            <input type='number' {...register("operatingMode")} className='p-2 border rounded-lg text-sm' />
          </div>
          <div className='flex flex-col space-y-1'>
            <label className='text-sm font-semibold'>Vie (jours)</label>
            <input type='number' {...register("lifeSpan")} className='p-2 border rounded-lg text-sm' />
          </div>
        </div>

        <div className='flex flex-col space-y-1'>
          <label className='text-sm font-semibold'>Périodicité Maintenance (jours)</label>
          <input type='number' {...register("periodicity")} className='p-2 border rounded-lg text-sm' />
        </div>

        <div className='flex flex-col space-y-1'>
          <label className='text-sm font-semibold'>Statut</label>
          <select {...register("status")} className='p-2 border rounded-lg text-sm'>
            <option value="NEW">NEUF</option>
            <option value="SECOND_HAND">SECONDE MAIN</option>
          </select>
        </div>

        <div className='flex flex-col space-y-1'>
          <label className='text-sm font-semibold'>Groupe d'équipement <span className='text-red-500'>*</span></label>
          <AutoComplete
            placeholder="Rechercher un groupe..."
            isLoading={isLoadingGroups}
            dataList={groups}
            onSearch={(val) => handleFetchGroups(`${URLS.INCIDENT_API}/equipment-groups`, val)}
            onSelect={(item) => setValue("equipmentGroupId", item?.value)}
          />
        </div>

        <div className='flex flex-col space-y-1 border-t pt-4'>
          <label className='text-sm font-semibold flex justify-between'>
            Sites cibles <span className='text-blue-600'>{selectedSites.length} sélectionnés</span>
          </label>
          <AutoComplete
            placeholder="Ajouter un site..."
            isLoading={isLoadingSites}
            dataList={sites}
            onSearch={(val) => handleFetchSites(`${URLS.ENTITY_API}/sites?search=${val}`)}
            onSelect={handleSelectSites}
          />

          <div className='flex flex-wrap gap-2 mt-2'>
            {selectedSites.map((site) => (
              <span key={site.value} className='flex items-center bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs font-medium'>
                {site.name}
                <X size={14} className='ml-1 cursor-pointer hover:text-red-500' onClick={() => handleRemoveSite(site.value)} />
              </span>
            ))}
          </div>
          {selectedSites.length === 0 && (
            <span className='text-[10px] text-orange-500 flex items-center gap-1'>
              <AlertTriangle size={12}/> Sélection obligatoire.
            </span>
          )}
        </div>
      </div>

      <div className='mt-auto p-4 border-t bg-gray-50 flex justify-end'>
        <Button 
          type="submit"
          disabled={isSubmitting || selectedSites.length === 0} 
          className='bg-primary hover:bg-secondary text-white shadow-md'
        >
          {isSubmitting ? <Preloader size={20}/> : <CheckCircle size={18} className="mr-2" />}
          {isSubmitting 
            ? `Traitement (${currentProgress}/${selectedSites.length})...` 
            : `Enregistrer sur ${selectedSites.length} site(s)`}
        </Button>
      </div>
    </form>
  )
}

export default InitiateForm;