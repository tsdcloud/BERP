// RapportOperationGeForm.jsx
import React, {useEffect, useState} from 'react'
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useForm } from 'react-hook-form';
import { URLS } from '../../../../configUrl';
import { useFetch } from '../../../hooks/useFetch';
import AutoComplete from '../../common/AutoComplete';
import { Button } from '../../ui/button';
import Preloader from '../../common/Preloader';
dayjs.extend(customParseFormat);

const RapportOperationGeForm = ({onSubmit}) => {
    const {setValue, handleSubmit, reset} = useForm();
    const {handleFetch} = useFetch();
    const [error, setError] = useState("");
    
    // États pour les données
    const [equipements, setEquipements] = useState([]);
    const [isLoadingEquipment, setIsLoadingEquipments] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    // États pour les filtres
    const [criteria, setCriteria] = useState("date");
    const [condition, setCondition] = useState("EQUAL");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [selectedEquipement, setSelectedEquipement] = useState(null);
    
    const token = localStorage.getItem("token");

    // Fetch equipements 
    const fetchEquipements = async() => {
        setIsLoadingEquipments(true);
        let url = `${URLS.INCIDENT_API}/equipements`;
        try {
            let response = await handleFetch(url);
            if(response.status !== 200){
                console.error("Echec. Impossible d'obtenir la list d'equipement");
                return;
            }
            let formatedData = response?.data.map(item => ({
                name: item?.title,
                value: item?.id
            }));
            setEquipements(formatedData);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoadingEquipments(false);
        }
    }

    const handleStartDate = (date) => {
        if (date) {
            const formattedDate = date.format('YYYY-MM-DD') + 'T00:00:00.000Z';
            setStartDate(formattedDate);
            setValue('start', formattedDate);
            setError("");
        } else {
            setStartDate("");
            setValue('start', "");
        }
    }

    const handleEndDate = (date) => {
        if (date) {
            const formattedDate = date.format('YYYY-MM-DD') + 'T23:59:59.999Z';
            setEndDate(formattedDate);
            setValue('end', formattedDate);
            setError("");
        } else {
            setEndDate("");
            setValue('end', "");
        }
    }

    const handleEquipementSelect = (value) => {
        if(value){
            setSelectedEquipement(value.value);
            setValue('value', value.value); // Pour le critère equipementId
            setValue('equipementId', value.value); // Paramètre supplémentaire
        } else {
            setSelectedEquipement(null);
            setValue('value', "");
            setValue('equipementId', "");
        }
    }

    const generateReport = async(data) => {
        setError("");
        
        // Validation selon le critère
        if (criteria === "date") {
            if (!startDate || !endDate) {
                setError("La date de début et la date de fin sont requises");
                return;
            }
        } else if (criteria === "equipementId") {
            if (!selectedEquipement) {
                setError("L'équipement est requis");
                return;
            }
        }
        
        setIsLoading(true);
        
        // Construction de l'URL
        let url = `${URLS.INCIDENT_API}/operations/file?`;
        const params = new URLSearchParams();
        
        // Paramètres principaux
        params.append('criteria', criteria);
        params.append('condition', condition);
        
        // Gestion des valeurs selon le critère
        if (criteria === "date") {
            if (startDate) params.append('start', startDate);
            if (endDate) params.append('end', endDate);
            // Si équipement est sélectionné en plus de la date
            if (selectedEquipement) {
                params.append('equipementId', selectedEquipement);
            }
        } else if (criteria === "equipementId") {
            if (selectedEquipement) params.append('value', selectedEquipement);
            // Si dates sont sélectionnées en plus de l'équipement
            if (startDate) params.append('start', startDate);
            if (endDate) params.append('end', endDate);
        }
        
        url += params.toString();
        
        let requestOptions = {
            headers: {
                "Content-Type": "application/json",
                'authorization': `Bearer ${token}`
            }
        }
        
        try {
            let response = await fetch(url, requestOptions);
            if(response.status === 200){
                const result = await response.json();
                const link = document.createElement('a');
                link.href = result?.downloadLink;
                link.download = 'operations_ge-export.xlsx';
                link.click();
                if(onSubmit) onSubmit();
                return; 
            } else if (response.status === 404) {
                setError("Aucune opération GE trouvée avec ces critères");
            } else {
                const errorData = await response.json();
                setError(errorData.message || "Échec du téléchargement du rapport");
            }
        } catch (error) {
            console.log(error);
            setError("Erreur lors de la génération du rapport");
        } finally {
            setIsLoading(false);
        }
    }

    const handleSearchEquipement = async (value) => {
        try {
            setIsLoadingEquipments(true);
            let url = `${URLS.INCIDENT_API}/equipements?search=${value}`;
            let response = await handleFetch(url);
            if(response?.status === 200){
                let formatedData = response?.data.map(item => ({
                    name: item?.title,
                    value: item?.id
                }));
                setEquipements(formatedData);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoadingEquipments(false);
        }
    }

    // Effet pour réinitialiser quand le critère change
    useEffect(() => {
        reset();
        if (criteria === "date") {
            setCondition("EQUAL"); // Par défaut pour les dates
        } else if (criteria === "equipementId") {
            setCondition("EQUAL"); // Par défaut pour l'équipement
        }
    }, [criteria, reset]);

    useEffect(() => {
        fetchEquipements();
    }, []);

    return (
        <form className="space-y-4" onSubmit={handleSubmit(generateReport)}>
            <div className='w-full flex flex-col px-2'>
                <label htmlFor="criteria" className='text-xs font-semibold px-2 mb-1'>
                    Filtrer par <span className='text-red-500'>*</span>:
                </label>
                <select 
                    id="criteria"
                    className='w-full p-2 outline-[1px] text-xs outline-blue-200 border rounded-lg'
                    value={criteria}
                    onChange={(event) => {
                        setCriteria(event.target.value);
                        setError("");
                    }}
                >
                    <option value="date">Date</option>
                    <option value="equipementId">Équipement</option>
                </select>
            </div>

            <div className='w-full flex flex-col px-2'>
                <label htmlFor="condition" className='text-xs font-semibold px-2 mb-1'>
                    Condition <span className='text-red-500'>*</span>:
                </label>
                <select 
                    id="condition"
                    className='w-full p-2 outline-[1px] text-xs outline-blue-200 border rounded-lg'
                    value={condition}
                    onChange={(event) => {
                        setCondition(event.target.value);
                        setError("");
                    }}
                >
                    <option value="EQUAL">Égal à</option>
                    <option value="NOT">Différent de</option>
                </select>
            </div>

            {/* Champ de valeur selon le critère */}
            {criteria === "equipementId" && (
                <div className='w-full flex flex-col px-2'>
                    <label htmlFor="equipement" className='text-xs font-semibold px-2 mb-1'>
                        Équipement <span className='text-red-500'>*</span>:
                    </label>
                    <AutoComplete 
                        dataList={equipements}
                        placeholder="Rechercher un équipement"
                        isLoading={isLoadingEquipment}
                        onSearch={handleSearchEquipement}
                        onSelect={handleEquipementSelect}
                    />
                </div>
            )}

            {/* Équipement optionnel pour le filtre par date */}
            {criteria === "date" && (
                <div className='w-full flex flex-col px-2'>
                    <label htmlFor="equipement" className='text-xs font-semibold px-2 mb-1'>
                        Équipement (optionnel):
                    </label>
                    <AutoComplete 
                        dataList={equipements}
                        placeholder="Rechercher un équipement (optionnel)"
                        isLoading={isLoadingEquipment}
                        onSearch={handleSearchEquipement}
                        onSelect={handleEquipementSelect}
                    />
                </div>
            )}

            {/* Dates - toujours visibles mais optionnelles selon le critère */}
            <div className='flex items-center space-x-2 px-2'>
                <div className='flex flex-col w-1/2'>
                    <label className="text-xs font-semibold px-2">
                        Date début {criteria === "date" && <span className='text-red-500'>*</span>}
                    </label>
                    <DatePicker 
                        onChange={handleStartDate}
                        className='w-full text-sm'
                        format="DD/MM/YYYY"
                        placeholder="Sélectionner une date"
                        disabledDate={(current) => {
                            return current && current > dayjs().endOf('day');
                        }}
                    />
                </div>
                <div className='flex flex-col w-1/2'>
                    <label className="text-xs font-semibold px-2">
                        Date fin {criteria === "date" && <span className='text-red-500'>*</span>}
                    </label>
                    <DatePicker 
                        onChange={handleEndDate}
                        className='w-full text-sm'
                        format="DD/MM/YYYY"
                        placeholder="Sélectionner une date"
                        disabledDate={(current) => {
                            return current && current > dayjs().endOf('day');
                        }}
                    />
                </div>
            </div>

            {error && (
                <div className='px-2'>
                    <p className='text-xs text-red-500'>{error}</p>
                </div>
            )}

            <div className='flex justify-end px-2 pt-4'>
                <Button 
                    type="submit"
                    disabled={isLoading}
                    className='rounded-lg bg-primary hover:bg-blue-600 text-white p-2 text-sm shadow-sm flex items-center space-x-2 justify-center min-w-[120px]'
                >
                    {isLoading ? (
                        <>
                            <Preloader className="w-4 h-4" />
                            <span>Génération...</span>
                        </>
                    ) : (
                        <span>Générer le rapport</span>
                    )}
                </Button>
            </div>
        </form>
    );
};

export default RapportOperationGeForm;