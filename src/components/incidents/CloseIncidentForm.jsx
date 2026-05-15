import React, { useEffect, useState, useCallback, useRef } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { useForm } from 'react-hook-form';
import { useFetch } from '../../hooks/useFetch';
import { URLS } from '../../../configUrl';
import AutoComplete from '../common/AutoComplete';
import { Button } from '../ui/button';
import { CheckCircle } from 'lucide-react';
import Preloader from '../Preloader';
import { getEquipmentDomain } from '../../utils/equipment.utils';
import toast from 'react-hot-toast';

const CloseIncidentForm = ({isOpen, setIsOpen, fetchData, selectedRow}) => {
    const {register, handleSubmit, formState:{errors}, setValue, watch, reset} = useForm({
        defaultValues: {
            hasStoppedOperations: false,
            technician: "",
            incidentId: "",
            incidentCauseId: "",
            closedManuDate: ""
        }
    });
    
    const {handleFetch, handlePatch} = useFetch();

    const [employees, setEmployees] = useState([]);
    const [entities, setEntities] = useState([]);
    const [incidentCauses, setIncidentCauses] = useState([]);
    const [incidentTypes, setIncidentTypes] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const [isLoadingEmployees, setIsLoadingEmployees] = useState(false);
    const [isLoadingSuppliers, setIsLoadingSuppliers] = useState(false);
    const [isLoadingCauses, setIsLoadingCauses] = useState(false);
    const [isLoadingTypes, setIsLoadingTypes] = useState(false);
    
    const hasStoppedOperationsValue = watch("hasStoppedOperations");
    const selectedIncidentTypeId = watch("incidentId");
    
    // Références pour les AutoComplete
    const technicianRef = useRef(null);
    const incidentTypeRef = useRef(null);
    const incidentCauseRef = useRef(null);
    
    // Flag pour éviter les chargements multiples - CRITIQUE
    const isInitializedRef = useRef(false);
    const previousIncidentTypeRef = useRef(null);

    // Enregistrer manuellement les champs pour react-hook-form
    useEffect(() => {
        register("technician");
        register("incidentId", { required: "Le type d'incident est requis" });
        register("incidentCauseId", { required: "La cause est requise" });
    }, [register]);

    // ====================================================================
    // FONCTIONS DE CHARGEMENT - STABILISÉES
    // ====================================================================
    
    const handleEmployees = useCallback(async (searchInput = "") => {
        setIsLoadingEmployees(true);
        try {
            let url = `${URLS.ENTITY_API}/employees`;
            const params = new URLSearchParams();
            if (searchInput) params.append('search', searchInput);
            params.append('limit', '50');
            
            const fullUrl = `${url}?${params.toString()}`;
            
            let response = await handleFetch(fullUrl);
            if(response?.status === 200) {
                let formattedData = response.data.map(employee => ({
                    name: employee?.name || "",
                    value: employee?.id
                }));
                setEmployees(formattedData);
                return formattedData;
            }
            return [];
        } catch (error) {
            console.error("Erreur chargement employés:", error);
            return [];
        } finally {
            setIsLoadingEmployees(false);
        }
    }, [handleFetch]);

    const handleEntities = useCallback(async (searchInput = "") => {
        setIsLoadingSuppliers(true);
        try {
            let url = `${URLS.ENTITY_API}/suppliers`;
            const params = new URLSearchParams();
            if (searchInput) params.append('search', searchInput);
            params.append('limit', '50');
            
            const fullUrl = `${url}?${params.toString()}`;
            
            let response = await handleFetch(fullUrl);
            if(response?.status === 200) {
                let formattedData = response.data.map(entity => ({
                    name: entity?.name || "",
                    value: entity?.id
                }));
                setEntities(formattedData);
                return formattedData;
            }
            return [];
        } catch (error) {
            console.error("Erreur chargement entités:", error);
            return [];
        } finally {
            setIsLoadingSuppliers(false);
        }
    }, [handleFetch]);

    const handleIncidentTypes = useCallback(async (searchInput = "", equipmentDomain = null) => {
        setIsLoadingTypes(true);
        try {
            let url = `${URLS.INCIDENT_API}/incident-types`;
            const params = new URLSearchParams();
            
            if (searchInput) params.append('search', searchInput);
            if (equipmentDomain) params.append('domain', equipmentDomain);
            params.append('limit', '50');
            
            const fullUrl = `${url}?${params.toString()}`;
            
            let response = await handleFetch(fullUrl);
            if(response?.status === 200) {
                let formattedData = response.data.map(entity => ({
                    name: entity?.name || "",
                    value: entity?.id
                }));
                setIncidentTypes(formattedData);
                return formattedData;
            }
            return [];
        } catch (error) {
            console.error("Erreur chargement types:", error);
            return [];
        } finally {
            setIsLoadingTypes(false);
        }
    }, [handleFetch]);

    const handleIncidentCauses = useCallback(async (searchInput = "", incidentTypeId = null) => {
        setIsLoadingCauses(true);
        try {
            let url = `${URLS.INCIDENT_API}/incident-causes`;
            const params = new URLSearchParams();
            
            if (searchInput) params.append('search', searchInput);
            if (incidentTypeId) params.append('incidentTypeId', incidentTypeId);
            params.append('limit', '50');
            
            const fullUrl = `${url}?${params.toString()}`;
            
            let response = await handleFetch(fullUrl);
            if(response?.status === 200) {
                let formattedData = response.data.map(entity => ({
                    name: entity?.name || "",
                    value: entity?.id
                }));
                setIncidentCauses(formattedData);
                return formattedData;
            }
            return [];
        } catch (error) {
            console.error("Erreur chargement causes:", error);
            return [];
        } finally {
            setIsLoadingCauses(false);
        }
    }, [handleFetch]);

    // ====================================================================
    // HANDLERS DE SÉLECTION
    // ====================================================================
    
    const handleIncidentTypeSelect = useCallback((item) => {
        const value = item ? item.value : "";
        setValue("incidentId", value, { shouldValidate: true });
        
        // Réinitialiser la cause quand on change le type
        setValue("incidentCauseId", "", { shouldValidate: false });
        if (incidentCauseRef.current) {
            incidentCauseRef.current.clear();
        }
        
        // Mettre à jour la référence pour déclencher le rechargement des causes
        previousIncidentTypeRef.current = value;
    }, [setValue]);

    const handleIntervenantSelect = useCallback((item) => {
        setValue("technician", item ? item.value : "", { shouldValidate: false });
    }, [setValue]);

    const handleCauseSelect = useCallback((item) => {
        setValue("incidentCauseId", item ? item.value : "", { shouldValidate: true });
    }, [setValue]);

    // Recherche combinée employés/suppliers
    const handleSearchIntervenant = useCallback(async (searchInput) => {
        const [employeesData, entitiesData] = await Promise.all([
            handleEmployees(searchInput),
            handleEntities(searchInput)
        ]);
        return [...employeesData, ...entitiesData];
    }, [handleEmployees, handleEntities]);

    // ====================================================================
    // EFFET PRINCIPAL - CHARGEMENT INITIAL
    // ====================================================================
    
    useEffect(() => {
        if (!isOpen) {
            // Réinitialiser quand le modal se ferme
            isInitializedRef.current = false;
            previousIncidentTypeRef.current = null;
            return;
        }

        // Éviter les chargements multiples
        if (isInitializedRef.current) return;
        isInitializedRef.current = true;

        const equipmentDomain = selectedRow?.equipement ? 
            getEquipmentDomain(selectedRow.equipement) : null;

        console.log("🔄 Chargement initial des données...");

        // Charger toutes les données en parallèle
        const loadData = async () => {
            try {
                const [employeesData, entitiesData, typesData, causesData] = await Promise.all([
                    handleEmployees(),
                    handleEntities(),
                    handleIncidentTypes("", equipmentDomain),
                    selectedRow?.incidentId 
                        ? handleIncidentCauses("", selectedRow.incidentId)
                        : handleIncidentCauses()
                ]);

                // Sauvegarder le type d'incident actuel
                if (selectedRow?.incidentId) {
                    previousIncidentTypeRef.current = selectedRow.incidentId;
                }

                // Pré-remplir les valeurs après chargement
                if (selectedRow) {
                    // Valeurs simples
                    if (selectedRow.hasStoppedOperations !== undefined) {
                        setValue("hasStoppedOperations", selectedRow.hasStoppedOperations);
                    }

                    // AutoComplete - avec un délai pour s'assurer que les refs sont prêts
                    setTimeout(() => {
                        // Intervenant
                        if (selectedRow.technician) {
                            setValue("technician", selectedRow.technician);
                            const allIntervenants = [...employeesData, ...entitiesData];
                            const technicianItem = allIntervenants.find(
                                item => item.value === selectedRow.technician
                            );
                            if (technicianItem && technicianRef.current) {
                                technicianRef.current.setValue(technicianItem);
                            }
                        }
                        
                        // Type d'incident
                        if (selectedRow.incidentId) {
                            setValue("incidentId", selectedRow.incidentId);
                            const incidentTypeItem = typesData.find(
                                item => item.value === selectedRow.incidentId
                            );
                            if (incidentTypeItem && incidentTypeRef.current) {
                                incidentTypeRef.current.setValue(incidentTypeItem);
                            }
                        }
                        
                        // Cause
                        if (selectedRow.incidentCauseId) {
                            setValue("incidentCauseId", selectedRow.incidentCauseId);
                            const causeItem = causesData.find(
                                item => item.value === selectedRow.incidentCauseId
                            );
                            if (causeItem && incidentCauseRef.current) {
                                incidentCauseRef.current.setValue(causeItem);
                            }
                        }
                    }, 150);
                }

                console.log("✅ Données chargées avec succès");
            } catch (error) {
                console.error("❌ Erreur chargement données:", error);
                toast.error("Erreur lors du chargement des données");
            }
        };

        loadData();
    }, [isOpen]); // ⚠️ SEULEMENT isOpen - pas selectedRow ni les fonctions

    // ====================================================================
    // EFFET POUR RECHARGER LES CAUSES QUAND LE TYPE CHANGE
    // ====================================================================
    
    useEffect(() => {
        // Ne rien faire si le modal n'est pas ouvert
        if (!isOpen) return;
        
        // Ne rien faire si pas encore initialisé
        if (!isInitializedRef.current) return;

        // Ne rien faire si le type n'a pas changé
        if (selectedIncidentTypeId === previousIncidentTypeRef.current) return;

        // Mettre à jour la référence
        previousIncidentTypeRef.current = selectedIncidentTypeId;

        console.log("🔄 Rechargement des causes pour le type:", selectedIncidentTypeId);

        // Recharger les causes avec le nouveau filtre
        if (selectedIncidentTypeId) {
            handleIncidentCauses("", selectedIncidentTypeId);
        } else {
            handleIncidentCauses();
        }
    }, [selectedIncidentTypeId, isOpen, handleIncidentCauses]);

    // ====================================================================
    // SOUMISSION DU FORMULAIRE
    // ====================================================================
    
    const onSubmit = async (data) => {
        if (!selectedRow?.id) {
            toast.error("Aucun incident sélectionné");
            return;
        }

        setIsSubmitting(true);
        setError("");

        try {
            const payload = {
                status: "CLOSED",
                technician: data.technician || null,
                incidentId: data.incidentId,
                incidentCauseId: data.incidentCauseId,
                hasStoppedOperations: Boolean(data.hasStoppedOperations),
            };

            if (data.closedManuDate) {
                const date = new Date(data.closedManuDate);
                if (!isNaN(date.getTime())) {
                    payload.closedManuDate = date.toISOString();
                }
            }

            console.log("📤 Envoi du payload:", payload);

            const response = await handlePatch(
                `${URLS.INCIDENT_API}/incidents/${selectedRow.id}`,
                payload
            );

            if (response?.error) {
                toast.error("Erreur: " + response.error);
                return;
            }

            toast.success("Incident clôturé avec succès");
            fetchData();
            handleClose();
            
        } catch (error) {
            console.error("❌ Erreur clôture:", error);
            toast.error("Erreur lors de la clôture de l'incident");
            setError(error.message || "Une erreur est survenue");
        } finally {
            setIsSubmitting(false);
        }
    };

    // ====================================================================
    // FERMETURE DU MODAL
    // ====================================================================
    
    const handleClose = useCallback(() => {
        setIsOpen(false);
        
        // Nettoyer les AutoComplete
        if (technicianRef.current) technicianRef.current.clear();
        if (incidentTypeRef.current) incidentTypeRef.current.clear();
        if (incidentCauseRef.current) incidentCauseRef.current.clear();
        
        // Reset du formulaire
        reset({
            hasStoppedOperations: false,
            technician: "",
            incidentId: "",
            incidentCauseId: "",
            closedManuDate: ""
        });
        
        // Réinitialiser les états
        setEmployees([]);
        setEntities([]);
        setIncidentTypes([]);
        setIncidentCauses([]);
        setError("");
        isInitializedRef.current = false;
        previousIncidentTypeRef.current = null;
    }, [setIsOpen, reset]);

    return ( 
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold">
                        Clôturer l'incident #{selectedRow?.numRef || ""}
                    </DialogTitle>
                    <DialogDescription>
                        Finalisez la résolution de cet incident
                    </DialogDescription>
                </DialogHeader>
                
                {error && (
                    <div className="p-3 mb-4 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Intervenant */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Intervenant (optionnel)
                        </label>
                        <AutoComplete 
                            ref={technicianRef}
                            dataList={[...employees, ...entities]}
                            placeholder="Sélectionner un intervenant..."
                            isLoading={isLoadingSuppliers || isLoadingEmployees}
                            onSearch={handleSearchIntervenant}
                            onSelect={handleIntervenantSelect}
                        />
                    </div>

                    {/* Type d'incident */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Type d'incident <span className="text-red-500">*</span>
                        </label>
                        <AutoComplete 
                            ref={incidentTypeRef}
                            dataList={incidentTypes}
                            placeholder="Sélectionner un type d'incident..."
                            isLoading={isLoadingTypes}
                            onSearch={(input) => {
                                const equipmentDomain = selectedRow?.equipement ? 
                                    getEquipmentDomain(selectedRow.equipement) : null;
                                handleIncidentTypes(input, equipmentDomain);
                            }}
                            onSelect={handleIncidentTypeSelect}
                        />
                        {errors.incidentId && (
                            <p className="text-xs text-red-500 mt-1">{errors.incidentId.message}</p>
                        )}
                    </div>

                    {/* Cause d'incident */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Cause d'incident <span className="text-red-500">*</span>
                        </label>
                        <AutoComplete 
                            ref={incidentCauseRef}
                            dataList={incidentCauses}
                            placeholder="Sélectionner une cause..."
                            isLoading={isLoadingCauses}
                            onSearch={(input) => {
                                handleIncidentCauses(input, selectedIncidentTypeId);
                            }}
                            onSelect={handleCauseSelect}
                        />
                        {errors.incidentCauseId && (
                            <p className="text-xs text-red-500 mt-1">{errors.incidentCauseId.message}</p>
                        )}
                    </div>

                    {/* Arrêt opération */}
                    <div className="p-3 bg-gray-50 rounded-lg">
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                {...register("hasStoppedOperations")}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="font-medium text-sm">
                                L'incident a causé un arrêt des opérations
                            </span>
                        </label>
                        <p className="text-xs text-gray-500 mt-1">
                            {hasStoppedOperationsValue ? 
                                "✓ Arrêt opération enregistré" : 
                                "Aucun arrêt opération"}
                        </p>
                    </div>

                    {/* Date de clôture optionnelle */}
                    <div>
                        <label htmlFor="closedManuDate" className="block text-sm font-medium mb-1">
                            Date de clôture (optionnel)
                        </label>
                        <input
                            type="datetime-local"
                            id="closedManuDate"
                            {...register("closedManuDate")}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                        />
                    </div>

                    {/* Boutons */}
                    <div className="flex justify-end pt-4 space-x-2">
                        <Button 
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={isSubmitting}
                        >
                            Annuler
                        </Button>
                        <Button 
                            type="submit"
                            disabled={isSubmitting} 
                            className="flex items-center gap-2 bg-primary text-white hover:bg-secondary"
                        >
                            {isSubmitting ? (
                                <>
                                    <Preloader size={16} />
                                    <span>Clôture en cours...</span>
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="h-4 w-4" />
                                    <span>Clôturer</span>
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default CloseIncidentForm;