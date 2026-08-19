import React, { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useFetch } from '../../../hooks/useFetch';
import AutoComplete from '../../common/AutoComplete';
import { Button } from '../../ui/button';
import { CheckCircle, X, Trash2, Loader2, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { URLS } from '../../../../configUrl';

const InitiateForm = ({ onSuccess, editData, onCancelEdit }) => {
    const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm();
    const { handleFetch, handlePost, handlePatch } = useFetch();

    // États pour les données
    const [sites, setSites] = useState([]);
    const [shifts, setShifts] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [consumablesList, setConsumablesList] = useState([]); // ← NOUVEAU
    const [operatorsList, setOperatorsList] = useState([]);
    const [hsesList, setHsesList] = useState([]);
    const [incomingCg, setIncomingCg] = useState(null);

    // États pour les fichiers
    const [extractionFileFile, setExtractionFileFile] = useState(null);
    const [attachmentFiles, setAttachmentFiles] = useState([]);
    const [existingAttachments, setExistingAttachments] = useState([]);
    const [existingExtractionUrl, setExistingExtractionUrl] = useState(null);

    // États de chargement
    const [isSiteLoading, setIsSiteLoading] = useState(true);
    const [isShiftLoading, setIsShiftLoading] = useState(true);
    const [isEmployeeLoading, setIsEmployeeLoading] = useState(false);
    const [isConsumableLoading, setIsConsumableLoading] = useState(false); // ← NOUVEAU
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isEditMode = !!editData;

    // ===== 1. GESTION DES SITES =====
    const fetchSites = async (search = "") => {
        setIsSiteLoading(true);
        try {
            let url = `${URLS.ENTITY_API}/sites?limit=100`;
            if (search) url += `&search=${search}`;
            const response = await handleFetch(url);
            if (response?.data) {
                let dataArray = response.data.data || response.data;
                if (Array.isArray(dataArray)) {
                    setSites(dataArray.map(s => ({ name: s.name, value: s.id })));
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSiteLoading(false);
        }
    };

    // ===== 2. GESTION DES SHIFTS =====
    const fetchShifts = async (search = "") => {
        setIsShiftLoading(true);
        try {
            let url = `${URLS.ENTITY_API}/shifts?limit=100`;
            if (search) url += `&search=${search}`;
            const response = await handleFetch(url);
            if (response?.data) {
                let dataArray = response.data.data || response.data;
                if (Array.isArray(dataArray)) {
                    const active = dataArray.filter(s => s.isActive === true);
                    setShifts(active.map(s => ({ name: s.name, value: s.id })));
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsShiftLoading(false);
        }
    };

    // ===== 3. GESTION DES EMPLOYÉS =====
    const fetchEmployees = async (search = "") => {
        setIsEmployeeLoading(true);
        try {
            let url = `${URLS.ENTITY_API}/employees?limit=100`;
            if (search) url += `&search=${search}`;
            const response = await handleFetch(url);
            if (response?.data) {
                let dataArray = response.data.data || response.data;
                if (Array.isArray(dataArray)) {
                    setEmployees(dataArray.map(e => ({ name: e.name, value: e.id })));
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsEmployeeLoading(false);
        }
    };

    // ===== 4. GESTION DES CONSOMMABLES (NOUVEAU) =====
    const fetchConsumables = async (search = "") => {
        setIsConsumableLoading(true);
        try {
            let url = `${URLS.INCIDENT_API}/consumables?limit=100`; // ou ENTITY_API selon ton architecture
            if (search) url += `&search=${search}`;
            const response = await handleFetch(url);
            if (response?.data) {
                let dataArray = response.data.data || response.data;
                if (Array.isArray(dataArray)) {
                    setConsumablesList(dataArray.map(c => ({ name: c.name, value: c.id })));
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsConsumableLoading(false);
        }
    };

    // ===== 5. UPLOAD FICHIER =====
    const uploadFileToServer = async (file) => {
        const formData = new FormData();
        formData.append('files', file);
        const response = await fetch(`${URLS.INCIDENT_API}/files/upload`, {
            method: 'POST',
            body: formData,
        });
        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Upload échoué (${response.status}) : ${text.substring(0, 100)}`);
        }
        const result = await response.json();
        if (result.success && result.data && result.data.length > 0) {
            return {
                url: result.data[0].url,
                filename: result.data[0].filename,
            };
        }
        throw new Error('Réponse invalide du serveur');
    };

    // ===== 6. SOUMISSION =====
    const onSubmit = async (data) => {
        if (operatorsList.length === 0) {
            toast.error("Veuillez ajouter au moins un opérateur");
            return;
        }
        if (hsesList.length === 0) {
            toast.error("Veuillez ajouter au moins un HSE");
            return;
        }
        if (!data.siteId) {
            toast.error("Le site est obligatoire");
            return;
        }
        if (!data.shiftId) {
            toast.error("Le quart est obligatoire");
            return;
        }
        if (!data.incomingCgId) {
            toast.error("Le CG entrant est obligatoire");
            return;
        }
        if (!data.recipeCardNumber) {
            toast.error("Le numéro de fiche recette est obligatoire");
            return;
        }

        setIsSubmitting(true);
        try {
            // 1. Fichier d'extraction
            let extractionFileUrl = null;
            if (extractionFileFile) {
                try {
                    const uploaded = await uploadFileToServer(extractionFileFile);
                    extractionFileUrl = uploaded.url;
                } catch (err) {
                    toast.error(err.message);
                    setIsSubmitting(false);
                    return;
                }
            } else if (isEditMode && existingExtractionUrl) {
                extractionFileUrl = existingExtractionUrl;
            }

            // 2. Pièces jointes
            const attachmentsUrls = [];
            if (attachmentFiles.length > 0) {
                for (const file of attachmentFiles) {
                    try {
                        const uploaded = await uploadFileToServer(file);
                        attachmentsUrls.push({ url: uploaded.url, filename: uploaded.filename });
                    } catch (err) {
                        toast.error(err.message);
                        setIsSubmitting(false);
                        return;
                    }
                }
            }
            if (isEditMode && existingAttachments.length > 0) {
                attachmentsUrls.push(...existingAttachments);
            }

            // 3. Payload (champs retirés : testNumberWeighingsToBeBilled, numberPassagesWithoutWeighingToBeBilled, numberPassagesWithoutWeighingBySpecies)
            const payload = {
                shiftId: data.shiftId,
                siteId: data.siteId,
                recipeCardNumber: data.recipeCardNumber,
                operators: operatorsList.map(op => op.value),
                hses: hsesList.map(h => h.value),
                consumables: consumablesListSelected.map(c => c.value), // ← NOUVEAU
                completeNumberWeighingsToBeBilled: parseInt(data.completeNumberWeighingsToBeBilled) || 0,
                completeNumberWeighingsBySpecies: parseInt(data.completeNumberWeighingsBySpecies) || 0,
                incompleteNumberWeighingsToBeBilled: parseInt(data.incompleteNumberWeighingsToBeBilled) || 0,
                incompleteNumberWeighingsBySpecies: parseInt(data.incompleteNumberWeighingsBySpecies) || 0,
                testNumberWeighingsBySpecies: parseInt(data.testNumberWeighingsBySpecies) || 0,
                // ❌ RETIRÉ : testNumberWeighingsToBeBilled
                // ❌ RETIRÉ : numberPassagesWithoutWeighingToBeBilled
                // ❌ RETIRÉ : numberPassagesWithoutWeighingBySpecies
                offBridgeNumber: parseInt(data.offBridgeNumber) || 0, // ← NOUVEAU
                numberIncidents: parseInt(data.numberIncidents) || 0,
                incidentDescription: data.incidentDescription || "",
                productionDescription: data.productionDescription || "",
                incomingCgId: data.incomingCgId,
                extractionFileUrl: extractionFileUrl,
                attachments: attachmentsUrls,
                firstWeighNumber: data.firstWeighNumber || null,       // ← NOUVEAU
                lastWeighNumber: data.lastWeighNumber || null,         // ← NOUVEAU
                firstWeighTractorNumber: data.firstWeighTractorNumber || null, // ← NOUVEAU
                lastWeighTractorNumber: data.lastWeighTractorNumber || null,   // ← NOUVEAU
                firstWeighDate: data.firstWeighDate || null,           // ← NOUVEAU
                lastWeighDate: data.lastWeighDate || null,             // ← NOUVEAU
            };

            let response;
            if (isEditMode) {
                response = await handlePatch(`${URLS.INCIDENT_API}/reporting-cgs/${editData.id}`, payload);
            } else {
                response = await handlePost(`${URLS.INCIDENT_API}/reporting-cgs`, payload);
            }

            if (response?.error) {
                response.error_list?.forEach(err => toast.error(err.msg));
            } else {
                toast.success(isEditMode ? "Rapport modifié" : "Rapport créé");
                onSuccess();
                resetForm();
            }
        } catch (error) {
            console.error(error);
            toast.error("Erreur lors de l'enregistrement");
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        reset({
            shiftId: "",
            siteId: "",
            recipeCardNumber : "",
            completeNumberWeighingsToBeBilled: "",
            completeNumberWeighingsBySpecies: "",
            incompleteNumberWeighingsToBeBilled: "",
            incompleteNumberWeighingsBySpecies: "",
            testNumberWeighingsBySpecies: "",
            offBridgeNumber: "",
            numberIncidents: "",
            incidentDescription: "",
            productionDescription: "",
            incomingCgId: "",
            firstWeighNumber: "",
            lastWeighNumber: "",
            firstWeighTractorNumber: "",
            lastWeighTractorNumber: "",
            firstWeighDate: "",
            lastWeighDate: "",
        });
        setOperatorsList([]);
        setHsesList([]);
        setConsumablesListSelected([]); // ← NOUVEAU
        setExtractionFileFile(null);
        setAttachmentFiles([]);
        setExistingAttachments([]);
        setExistingExtractionUrl(null);
        setIncomingCg(null);
    };

    // ===== 7. GESTION DES FICHIERS =====
    const handleExtractionFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setExtractionFileFile(file);
            if (isEditMode) setExistingExtractionUrl(null);
        }
    };

    const handleAttachmentChange = (e) => {
        const files = Array.from(e.target.files);
        setAttachmentFiles(prev => [...prev, ...files]);
        e.target.value = '';
    };

    const removeAttachmentFile = (index) => {
        setAttachmentFiles(prev => prev.filter((_, i) => i !== index));
    };

    const removeExtractionFile = () => {
        setExtractionFileFile(null);
        if (isEditMode) setExistingExtractionUrl(null);
    };

    const removeExistingAttachment = (index) => {
        setExistingAttachments(prev => prev.filter((_, i) => i !== index));
    };

    // ===== 8. GESTION DES LISTES MULTIPLES =====
    // Opérateurs
    const handleAddOperator = (employee) => {
        if (employee && !operatorsList.some(op => op.value === employee.value)) {
            setOperatorsList(prev => [...prev, employee]);
        }
    };
    const removeOperator = (value) => {
        setOperatorsList(prev => prev.filter(op => op.value !== value));
    };

    // HSE
    const handleAddHse = (employee) => {
        if (employee && !hsesList.some(h => h.value === employee.value)) {
            setHsesList(prev => [...prev, employee]);
        }
    };
    const removeHse = (value) => {
        setHsesList(prev => prev.filter(h => h.value !== value));
    };

    // Consommables (NOUVEAU)
    const [consumablesListSelected, setConsumablesListSelected] = useState([]);
    const handleAddConsumable = (consumable) => {
        if (consumable && !consumablesListSelected.some(c => c.value === consumable.value)) {
            setConsumablesListSelected(prev => [...prev, consumable]);
        }
    };
    const removeConsumable = (value) => {
        setConsumablesListSelected(prev => prev.filter(c => c.value !== value));
    };

    // ===== 9. CHARGEMENT INITIAL & MODE ÉDITION =====
    useEffect(() => {
        fetchSites();
        fetchShifts();
        fetchEmployees();
        fetchConsumables(); // ← NOUVEAU

        if (isEditMode && editData) {
            reset({
                shiftId: editData.shiftId,
                siteId: editData.siteId,
                recipeCardNumber: editData.recipeCardNumber,
                completeNumberWeighingsToBeBilled: editData.completeNumberWeighingsToBeBilled,
                completeNumberWeighingsBySpecies: editData.completeNumberWeighingsBySpecies,
                incompleteNumberWeighingsToBeBilled: editData.incompleteNumberWeighingsToBeBilled,
                incompleteNumberWeighingsBySpecies: editData.incompleteNumberWeighingsBySpecies,
                testNumberWeighingsBySpecies: editData.testNumberWeighingsBySpecies,
                offBridgeNumber: editData.offBridgeNumber,
                numberIncidents: editData.numberIncidents,
                incidentDescription: editData.incidentDescription,
                productionDescription: editData.productionDescription,
                incomingCgId: editData.incomingCgId,
                firstWeighNumber: editData.firstWeighNumber,
                lastWeighNumber: editData.lastWeighNumber,
                firstWeighTractorNumber: editData.firstWeighTractorNumber,
                lastWeighTractorNumber: editData.lastWeighTractorNumber,
                firstWeighDate: editData.firstWeighDate ? new Date(editData.firstWeighDate).toISOString().slice(0, 16) : "",
                lastWeighDate: editData.lastWeighDate ? new Date(editData.lastWeighDate).toISOString().slice(0, 16) : "",
            });
            if (editData.operators) {
                setOperatorsList(editData.operators.map(op => ({ name: op.operator?.name || op.operatorId, value: op.operatorId })));
            }
            if (editData.hses) {
                setHsesList(editData.hses.map(h => ({ name: h.hse?.name || h.hseId, value: h.hseId })));
            }
            if (editData.outOfStockConsumableReportingCgs) { // ← NOUVEAU
                setConsumablesListSelected(editData.outOfStockConsumableReportingCgs.map(c => ({
                    name: c.consumable?.name || c.consumableId,
                    value: c.consumableId
                })));
            }
            if (editData.extractionFileUrl) {
                setExistingExtractionUrl(editData.extractionFileUrl);
            }
            if (editData.attachments && editData.attachments.length > 0) {
                setExistingAttachments(editData.attachments.map(att => ({ url: att.url, filename: att.filename })));
            }
            if (editData.incomingCgId) {
                setIncomingCg({ value: editData.incomingCgId, name: "Employé sélectionné" });
            }
        }
    }, [isEditMode, editData]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto p-4">
            {/* Champs numériques */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-sm font-medium">Pesées complètes à facturer</label>
                    <input type="number" {...register("completeNumberWeighingsToBeBilled")} className="w-full p-2 border rounded" />
                </div>
                <div>
                    <label className="text-sm font-medium">Pesées complètes espèce</label>
                    <input type="number" {...register("completeNumberWeighingsBySpecies")} className="w-full p-2 border rounded" />
                </div>
                <div>
                    <label className="text-sm font-medium">Pesées incomplètes à facturer</label>
                    <input type="number" {...register("incompleteNumberWeighingsToBeBilled")} className="w-full p-2 border rounded" />
                </div>
                <div>
                    <label className="text-sm font-medium">Pesées incomplètes en espèce</label>
                    <input type="number" {...register("incompleteNumberWeighingsBySpecies")} className="w-full p-2 border rounded" />
                </div>
                <div>
                    <label className="text-sm font-medium">Pesées test en espèce</label>
                    <input type="number" {...register("testNumberWeighingsBySpecies")} className="w-full p-2 border rounded" />
                </div>
                <div>
                    <label className="text-sm font-medium">Hors-pont (nombre)</label>
                    <input type="number" {...register("offBridgeNumber")} className="w-full p-2 border rounded" />
                </div>
            </div>

            {/* Site */}
            <div>
                <label className="block text-sm font-medium mb-1">Site <span className="text-red-500">*</span></label>
                <AutoComplete
                    placeholder="Rechercher un site"
                    isLoading={isSiteLoading}
                    dataList={sites}
                    onSearch={fetchSites}
                    onSelect={(item) => setValue("siteId", item?.value || "")}
                    initialValue={sites.find(s => s.value === editData?.siteId)}
                />
            </div>

            {/* Shift */}
            <div>
                <label className="block text-sm font-medium mb-1">Quart <span className="text-red-500">*</span></label>
                <AutoComplete
                    placeholder="Rechercher un quart"
                    isLoading={isShiftLoading}
                    dataList={shifts}
                    onSearch={fetchShifts}
                    onSelect={(item) => setValue("shiftId", item?.value || "")}
                    initialValue={shifts.find(s => s.value === editData?.shiftId)}
                />
            </div>

            {/* Opérateurs */}
            <div>
                <label className="block text-sm font-medium mb-1">Opérateurs <span className="text-red-500">*</span></label>
                <AutoComplete
                    placeholder="Ajouter un opérateur"
                    isLoading={isEmployeeLoading}
                    dataList={employees}
                    onSearch={fetchEmployees}
                    onSelect={handleAddOperator}
                />
                <div className="flex flex-wrap gap-2 mt-2">
                    {operatorsList.map(op => (
                        <span key={op.value} className="bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center gap-1">
                            {op.name}
                            <X size={14} className="cursor-pointer" onClick={() => removeOperator(op.value)} />
                        </span>
                    ))}
                </div>
            </div>

            {/* HSE */}
            <div>
                <label className="block text-sm font-medium mb-1">HSE <span className="text-red-500">*</span></label>
                <AutoComplete
                    placeholder="Ajouter un HSE"
                    isLoading={isEmployeeLoading}
                    dataList={employees}
                    onSearch={fetchEmployees}
                    onSelect={handleAddHse}
                />
                <div className="flex flex-wrap gap-2 mt-2">
                    {hsesList.map(hse => (
                        <span key={hse.value} className="bg-green-100 text-green-800 px-2 py-1 rounded flex items-center gap-1">
                            {hse.name}
                            <X size={14} className="cursor-pointer" onClick={() => removeHse(hse.value)} />
                        </span>
                    ))}
                </div>
            </div>

            {/* Consommables en rupture (NOUVEAU) */}
            <div>
                <label className="block text-sm font-medium mb-1">Consommables en rupture</label>
                <AutoComplete
                    placeholder="Ajouter un consommable"
                    isLoading={isConsumableLoading}
                    dataList={consumablesList}
                    onSearch={fetchConsumables}
                    onSelect={handleAddConsumable}
                />
                <div className="flex flex-wrap gap-2 mt-2">
                    {consumablesListSelected.map(c => (
                        <span key={c.value} className="bg-amber-100 text-amber-800 px-2 py-1 rounded flex items-center gap-1">
                            {c.name}
                            <X size={14} className="cursor-pointer" onClick={() => removeConsumable(c.value)} />
                        </span>
                    ))}
                </div>
            </div>

            {/* Dates de pesée (NOUVEAU) */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-sm font-medium">Date première pesée</label>
                    <input type="datetime-local" {...register("firstWeighDate")} className="w-full p-2 border rounded" />
                </div>
                <div>
                    <label className="text-sm font-medium">Date dernière pesée</label>
                    <input type="datetime-local" {...register("lastWeighDate")} className="w-full p-2 border rounded" />
                </div>
            </div>

            {/* Numéros de pesée et tracteur (NOUVEAU) */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-sm font-medium">Premier n° pesée</label>
                    <input type="text" {...register("firstWeighNumber")} className="w-full p-2 border rounded" />
                </div>
                <div>
                    <label className="text-sm font-medium">Dernier n° pesée</label>
                    <input type="text" {...register("lastWeighNumber")} className="w-full p-2 border rounded" />
                </div>
                <div>
                    <label className="text-sm font-medium">Premier n° tracteur</label>
                    <input type="text" {...register("firstWeighTractorNumber")} className="w-full p-2 border rounded" />
                </div>
                <div>
                    <label className="text-sm font-medium">Dernier n° tracteur</label>
                    <input type="text" {...register("lastWeighTractorNumber")} className="w-full p-2 border rounded" />
                </div>
            </div>

            {/* Description production */}
            <div>
                <label className="text-sm font-medium">Description de la production</label>
                <textarea {...register("productionDescription")} rows="2" className="w-full p-2 border rounded" />
            </div>

            {/* Nombre d'incidents */}
            <div>
                <label className="text-sm font-medium">Nombre d'incidents</label>
                <input type="number" {...register("numberIncidents")} className="w-full p-2 border rounded" />
            </div>
            <div>
                <label className="text-sm font-medium">Description des incidents</label>
                <textarea {...register("incidentDescription")} rows="2" className="w-full p-2 border rounded" />
            </div>

            {/* Fichier d'extraction PW */}
            <div>
                <label className="text-sm font-medium">Fichier d'extraction PW</label>
                <input type="file" onChange={handleExtractionFileChange} accept=".xlsx,.xls,.csv,.pdf,.jpg,.png" />
                {extractionFileFile && (
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-600">{extractionFileFile.name}</span>
                        <button type="button" onClick={removeExtractionFile} className="text-red-500">
                            <X size={14} />
                        </button>
                    </div>
                )}
                {isEditMode && existingExtractionUrl && !extractionFileFile && (
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-blue-500">Fichier actuel : </span>
                        <a href={existingExtractionUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-600 underline">voir</a>
                        <button type="button" onClick={removeExtractionFile} className="text-red-500">
                            <Trash2 size={14} />
                        </button>
                    </div>
                )}
            </div>

            {/* Pièces jointes */}
            <div>
                <label className="text-sm font-medium">Pièces jointes</label>
                <input type="file" multiple onChange={handleAttachmentChange} />
                <div className="mt-2 space-y-1">
                    {attachmentFiles.map((file, idx) => (
                        <div key={file.name + idx} className="flex justify-between items-center bg-gray-100 p-1 rounded">
                            <span className="text-sm truncate">{file.name}</span>
                            <button type="button" onClick={() => removeAttachmentFile(idx)} className="text-red-500">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                    {existingAttachments.map((att, idx) => (
                        <div key={att.url + idx} className="flex justify-between items-center bg-blue-50 p-1 rounded">
                            <a href={att.url} target="_blank" rel="noreferrer" className="text-sm text-blue-600 underline truncate">
                                {att.filename}
                            </a>
                            <button type="button" onClick={() => removeExistingAttachment(idx)} className="text-red-500">
                                <X size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* CG Entrant */}
            <div>
                <label className="block text-sm font-medium mb-1">CG entrant <span className="text-red-500">*</span></label>
                <AutoComplete
                    placeholder="Rechercher un employé"
                    isLoading={isEmployeeLoading}
                    dataList={employees}
                    onSearch={fetchEmployees}
                    onSelect={(item) => {
                        setValue("incomingCgId", item?.value || "");
                        setIncomingCg(item);
                    }}
                    initialValue={incomingCg}
                />
            </div>

            {/* N° Fiche recette */}
            <div>
            <label className="block text-sm font-medium mb-1">
                N° Fiche recette <span className="text-red-500">*</span>
            </label>
            <input
                type="text"
                {...register("recipeCardNumber", { required: "Le numéro de fiche recette est requis" })}
                className="w-full p-2 border rounded"
                placeholder="Ex: F2025-001"
            />
            {errors.recipeCardNumber && (
                <p className="text-red-500 text-xs mt-1">{errors.recipeCardNumber.message}</p>
            )}
            </div>

            {/* Boutons */}
            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onCancelEdit} disabled={isSubmitting}>Annuler</Button>
                <Button type="submit" disabled={isSubmitting} className="bg-primary text-white">
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle size={18} className="mr-2" />}
                    {isSubmitting ? "Enregistrement..." : (isEditMode ? "Modifier" : "Créer")}
                </Button>
            </div>
        </form>
    );
};

export default InitiateForm;