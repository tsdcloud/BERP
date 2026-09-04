// RapportWatchReportForm.jsx
import React, { useEffect, useState } from 'react'
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

const RapportWatchReportForm = ({ onSubmit }) => {
    const { setValue, handleSubmit, reset } = useForm();
    const { handleFetch } = useFetch();
    const [error, setError] = useState("");

    // États pour les données
    const [employees, setEmployees] = useState([]);
    const [isLoadingEmployees, setIsLoadingEmployees] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // États pour les filtres
    const [criteria, setCriteria] = useState("createdAt");  // ✅ champ réel du modèle
    const [condition, setCondition] = useState("EQUAL");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const token = localStorage.getItem("token");

    // ── Fetch employés (initiateurs) ──────────────────────────────────────────
    const fetchEmployees = async () => {
        setIsLoadingEmployees(true);
        try {
            const response = await handleFetch(`${URLS.ENTITY_API}/employees`);
            if (response?.status !== 200) {
                console.error("Impossible d'obtenir la liste des employés");
                return;
            }
            // ✅ Gestion des deux formats de réponse possibles
            const raw = response?.data?.data ?? response?.data ?? [];
            const formatted = raw.map(item => ({
                name: item?.name,
                value: item?.id,
            }));
            setEmployees(formatted);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoadingEmployees(false);
        }
    };

    // ── Handlers dates ─────────────────────────────────────────────────────────
    const handleStartDate = (date) => {
        if (date) {
            const formatted = date.format('YYYY-MM-DD') + 'T00:00:00.000Z';
            setStartDate(formatted);
            setValue('start', formatted);
            setError("");
        } else {
            setStartDate("");
            setValue('start', "");
        }
    };

    const handleEndDate = (date) => {
        if (date) {
            const formatted = date.format('YYYY-MM-DD') + 'T23:59:59.999Z';
            setEndDate(formatted);
            setValue('end', formatted);
            setError("");
        } else {
            setEndDate("");
            setValue('end', "");
        }
    };

    // ── Handler sélection initiateur ───────────────────────────────────────────
    const handleEmployeeSelect = (value) => {
        if (value) {
            setSelectedEmployee(value.value);
            setValue('value', value.value);
            setError("");
        } else {
            setSelectedEmployee(null);
            setValue('value', "");
        }
    };

    // ── Recherche employé (autocomplete) ──────────────────────────────────────
    const handleSearchEmployee = async (value) => {
        setIsLoadingEmployees(true);
        try {
            // ✅ URL corrigée : ENTITY_API et non INCIDENT_API
            const response = await handleFetch(`${URLS.ENTITY_API}/employees?search=${value}`);
            if (response?.status === 200) {
                const raw = response?.data?.data ?? response?.data ?? [];
                const formatted = raw.map(item => ({
                    name: item?.name,
                    value: item?.id,
                }));
                setEmployees(formatted);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoadingEmployees(false);
        }
    };

    // ── Génération du rapport ──────────────────────────────────────────────────
    const generateReport = async () => {
        setError("");

        // Validation
        if (criteria === "createdAt" || criteria === "updatedAt") {
            if (!startDate || !endDate) {
                setError("La date de début et la date de fin sont requises");
                return;
            }
        } else if (criteria === "createdBy" || criteria === "updatedBy") {
            if (!selectedEmployee) {
                setError("L'initiateur est requis");
                return;
            }
        }

        setIsLoading(true);

        try {
            // ✅ Construction des query params selon le service backend
            const params = new URLSearchParams();
            params.append('condition', condition);

            if (criteria === "createdAt" || criteria === "updatedAt") {
                // Filtre date : on envoie filter + start + end
                params.append('filter', criteria);
                // Le service attend "start,end" via le param value
                // OU start/end séparés — on envoie les deux pour compatibilité
                params.append('start', startDate);
                params.append('end', endDate);
                // Initiateur optionnel en plus
                if (selectedEmployee) {
                    params.append('filter2', 'createdBy');
                    params.append('value2', selectedEmployee);
                }
            } else if (criteria === "createdBy" || criteria === "updatedBy") {
                // Filtre initiateur : filter + value
                params.append('filter', criteria);
                params.append('value', selectedEmployee);
                // Dates optionnelles en plus
                if (startDate) params.append('start', startDate);
                if (endDate)   params.append('end',   endDate);
            }

            // ✅ URL vers la route d'export du Watch Report
            const url = `${URLS.INCIDENT_API}/watch-reports/export?${params.toString()}`;

            const response = await fetch(url, {
                headers: {
                    "Content-Type": "application/json",
                    'authorization': `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                const result = await response.json();
                const link = document.createElement('a');
                link.href = result?.downloadLink;
                link.download = 'watch-report-export.xlsx';  // ✅ nom de fichier corrigé
                link.click();
                if (onSubmit) onSubmit();

            } else if (response.status === 404) {
                setError("Aucun rapport de quart trouvé avec ces critères");
            } else {
                const errorData = await response.json();
                setError(errorData.message || "Échec du téléchargement du rapport");
            }
        } catch (error) {
            console.error(error);
            setError("Erreur lors de la génération du rapport");
        } finally {
            setIsLoading(false);
        }
    };

    // Réinitialiser les valeurs quand le critère change
    useEffect(() => {
        reset();
        setStartDate("");
        setEndDate("");
        setSelectedEmployee(null);
        setError("");
        setCondition("EQUAL");
    }, [criteria, reset]);

    useEffect(() => {
        fetchEmployees();
    }, []);

    return (
        <form className="space-y-4" onSubmit={handleSubmit(generateReport)}>

            {/* ── Critère ── */}
            <div className='w-full flex flex-col px-2'>
                <label htmlFor="criteria" className='text-xs font-semibold px-2 mb-1'>
                    Filtrer par <span className='text-red-500'>*</span> :
                </label>
                <select
                    id="criteria"
                    className='w-full p-2 outline-[1px] text-xs outline-blue-200 border rounded-lg'
                    value={criteria}
                    onChange={(e) => { setCriteria(e.target.value); setError(""); }}
                >
                    <option value="createdAt">Date de création</option>
                    <option value="updatedAt">Date de modification</option>
                    <option value="createdBy">Initiateur (créé par)</option>
                    <option value="updatedBy">Modifié par</option>
                </select>
            </div>

            {/* ── Condition ── */}
            <div className='w-full flex flex-col px-2'>
                <label htmlFor="condition" className='text-xs font-semibold px-2 mb-1'>
                    Condition <span className='text-red-500'>*</span> :
                </label>
                <select
                    id="condition"
                    className='w-full p-2 outline-[1px] text-xs outline-blue-200 border rounded-lg'
                    value={condition}
                    onChange={(e) => { setCondition(e.target.value); setError(""); }}
                >
                    <option value="EQUAL">Égal à</option>
                    <option value="NOT">Différent de</option>
                </select>
            </div>

            {/* ── Initiateur requis si critère = createdBy / updatedBy ── */}
            {(criteria === "createdBy" || criteria === "updatedBy") && (
                <div className='w-full flex flex-col px-2'>
                    <label className='text-xs font-semibold px-2 mb-1'>
                        {criteria === "createdBy" ? "Initiateur" : "Modifié par"}
                        <span className='text-red-500'> *</span>
                    </label>
                    <AutoComplete
                        dataList={employees}
                        placeholder="Rechercher un employé"
                        isLoading={isLoadingEmployees}
                        onSearch={handleSearchEmployee}
                        onSelect={handleEmployeeSelect}
                    />
                </div>
            )}

            {/* ── Initiateur optionnel si critère = date ── */}
            {(criteria === "createdAt" || criteria === "updatedAt") && (
                <div className='w-full flex flex-col px-2'>
                    <label className='text-xs font-semibold px-2 mb-1'>
                        Initiateur <span className='text-gray-400'>(optionnel)</span>
                    </label>
                    <AutoComplete
                        dataList={employees}
                        placeholder="Filtrer aussi par initiateur"
                        isLoading={isLoadingEmployees}
                        onSearch={handleSearchEmployee}
                        onSelect={handleEmployeeSelect}
                    />
                </div>
            )}

            {/* ── Plage de dates ── */}
            <div className='flex items-center space-x-2 px-2'>
                <div className='flex flex-col w-1/2'>
                    <label className="text-xs font-semibold px-2">
                        Date début
                        {(criteria === "createdAt" || criteria === "updatedAt") && (
                            <span className='text-red-500'> *</span>
                        )}
                    </label>
                    <DatePicker
                        onChange={handleStartDate}
                        className='w-full text-sm'
                        format="DD/MM/YYYY"
                        placeholder="Sélectionner une date"
                        disabledDate={(current) => current && current > dayjs().endOf('day')}
                    />
                </div>
                <div className='flex flex-col w-1/2'>
                    <label className="text-xs font-semibold px-2">
                        Date fin
                        {(criteria === "createdAt" || criteria === "updatedAt") && (
                            <span className='text-red-500'> *</span>
                        )}
                    </label>
                    <DatePicker
                        onChange={handleEndDate}
                        className='w-full text-sm'
                        format="DD/MM/YYYY"
                        placeholder="Sélectionner une date"
                        disabledDate={(current) => current && current > dayjs().endOf('day')}
                    />
                </div>
            </div>

            {/* ── Erreur ── */}
            {error && (
                <div className='px-2'>
                    <p className='text-xs text-red-500'>{error}</p>
                </div>
            )}

            {/* ── Bouton ── */}
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

export default RapportWatchReportForm;