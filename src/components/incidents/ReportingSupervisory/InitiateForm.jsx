// import React, { useEffect, useState, useCallback } from 'react';
// import { useForm } from 'react-hook-form';
// import { useFetch } from '../../../hooks/useFetch';
// import AutoComplete from '../../common/AutoComplete';
// import { Button } from '../../ui/button';
// import { CheckCircle, X, Trash2, Loader2, Plus, Minus } from 'lucide-react';
// import toast from 'react-hot-toast';
// import { URLS } from '../../../../configUrl';

// const InitiateForm = ({ onSuccess, editData, onCancelEdit, references = {} }) => {
//     const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm();
//     const { handleFetch, handlePost, handlePatch } = useFetch();

//     // Données de référence passées en props
//     const { employees = [], shifts = [], suppliers = [], ships = [], products = [] } = references;

//     // États pour les listes multiples
//     const [chargersList, setChargersList] = useState([]);
//     const [shippersList, setShippersList] = useState([]);
//     const [thirdPartiesList, setThirdPartiesList] = useState([]);
//     const [shipsList, setShipsList] = useState([]);
//     const [productsList, setProductsList] = useState([]);
//     const [incomingSupervisory, setIncomingSupervisory] = useState(null);

//     // États pour les incidents dynamiques
//     const [incidents, setIncidents] = useState([]);

//     // États pour les fichiers
//     const [attachmentFiles, setAttachmentFiles] = useState([]);
//     const [existingAttachments, setExistingAttachments] = useState([]);

//     // États de chargement
//     const [isEmployeeLoading, setIsEmployeeLoading] = useState(false);
//     const [isSupplierLoading, setIsSupplierLoading] = useState(false);
//     const [isShipLoading, setIsShipLoading] = useState(false);
//     const [isProductLoading, setIsProductLoading] = useState(false);
//     const [isSubmitting, setIsSubmitting] = useState(false);

//     const isEditMode = !!editData;

//     // ===== 1. GESTION DES EMPLOYÉS =====
//     const fetchEmployees = async (search = "") => {
//         setIsEmployeeLoading(true);
//         try {
//             let url = `${URLS.ENTITY_API}/employees?limit=100`;
//             if (search) url += `&search=${search}`;
//             const response = await handleFetch(url);
//             if (response?.data) {
//                 let dataArray = response.data.data || response.data;
//                 if (Array.isArray(dataArray)) {
//                     return dataArray.map(e => ({ name: e.name, value: e.id }));
//                 }
//             }
//             return [];
//         } catch (error) {
//             console.error(error);
//             return [];
//         } finally {
//             setIsEmployeeLoading(false);
//         }
//     };

//     // ===== 2. GESTION DES FOURNISSEURS =====
//     const fetchSuppliers = async (search = "") => {
//         setIsSupplierLoading(true);
//         try {
//             let url = `${URLS.ENTITY_API}/suppliers?limit=100`;
//             if (search) url += `&search=${search}`;
//             const response = await handleFetch(url);
//             if (response?.data) {
//                 let dataArray = response.data.data || response.data;
//                 if (Array.isArray(dataArray)) {
//                     return dataArray.map(s => ({ name: s.name, value: s.id }));
//                 }
//             }
//             return [];
//         } catch (error) {
//             console.error(error);
//             return [];
//         } finally {
//             setIsSupplierLoading(false);
//         }
//     };

//     // ===== 3. GESTION DES NAVIRES =====
//     const fetchShips = async (search = "") => {
//         setIsShipLoading(true);
//         try {
//             let url = `${URLS.INCIDENT_API}/ships?limit=100`;
//             if (search) url += `&search=${search}`;
//             const response = await handleFetch(url);
//             if (response?.data) {
//                 let dataArray = response.data.data || response.data;
//                 if (Array.isArray(dataArray)) {
//                     return dataArray.map(s => ({ name: s.name, value: s.id }));
//                 }
//             }
//             return [];
//         } catch (error) {
//             console.error(error);
//             return [];
//         } finally {
//             setIsShipLoading(false);
//         }
//     };

//     // ===== 4. GESTION DES PRODUITS =====
//     const fetchProducts = async (search = "") => {
//         setIsProductLoading(true);
//         try {
//             let url = `${URLS.INCIDENT_API}/products?limit=100`;
//             if (search) url += `&search=${search}`;
//             const response = await handleFetch(url);
//             if (response?.data) {
//                 let dataArray = response.data.data || response.data;
//                 if (Array.isArray(dataArray)) {
//                     return dataArray.map(p => ({ name: p.name, value: p.id }));
//                 }
//             }
//             return [];
//         } catch (error) {
//             console.error(error);
//             return [];
//         } finally {
//             setIsProductLoading(false);
//         }
//     };

//     // ===== 5. UPLOAD FICHIER =====
//     const uploadFileToServer = async (file) => {
//         const formData = new FormData();
//         formData.append('files', file);
//         const response = await fetch(`${URLS.INCIDENT_API}/files/upload`, {
//             method: 'POST',
//             body: formData,
//         });
//         if (!response.ok) {
//             const text = await response.text();
//             throw new Error(`Upload échoué (${response.status}) : ${text.substring(0, 100)}`);
//         }
//         const result = await response.json();
//         if (result.success && result.data && result.data.length > 0) {
//             return {
//                 url: result.data[0].url,
//                 filename: result.data[0].filename,
//             };
//         }
//         throw new Error('Réponse invalide du serveur');
//     };

//     // ===== 6. GESTION DES INCIDENTS =====
//     const addIncident = () => {
//         setIncidents(prev => [...prev, {
//             id: Date.now(),
//             equipment: '',
//             breakdown: '',
//             typeFailure: '',
//             downtime: '',
//             status: '',
//             managerFailure: ''
//         }]);
//     };

//     const removeIncident = (id) => {
//         setIncidents(prev => prev.filter(inc => inc.id !== id));
//     };

//     const updateIncident = (id, field, value) => {
//         setIncidents(prev => prev.map(inc => 
//             inc.id === id ? { ...inc, [field]: value } : inc
//         ));
//     };

//     // ===== 7. SOUMISSION =====
//     const onSubmit = async (data) => {
//         // Validations front
//         if (!data.shiftId) {
//             toast.error("Le quart est obligatoire");
//             return;
//         }
//         if (!data.incomingSupervisoryId) {
//             toast.error("Le superviseur entrant est obligatoire");
//             return;
//         }
//         if (chargersList.length === 0) {
//             toast.error("Veuillez ajouter au moins un chargeur");
//             return;
//         }
//         if (shippersList.length === 0) {
//             toast.error("Veuillez ajouter au moins un expéditeur");
//             return;
//         }

//         setIsSubmitting(true);
//         try {
//             // 1. Pièces jointes
//             const attachmentsUrls = [];
//             if (attachmentFiles.length > 0) {
//                 for (const file of attachmentFiles) {
//                     try {
//                         const uploaded = await uploadFileToServer(file);
//                         attachmentsUrls.push({
//                             url: uploaded.url,
//                             filename: uploaded.filename,
//                         });
//                     } catch (err) {
//                         toast.error(err.message);
//                         setIsSubmitting(false);
//                         return;
//                     }
//                 }
//             }
//             if (isEditMode && existingAttachments.length > 0) {
//                 attachmentsUrls.push(...existingAttachments);
//             }

//             // 2. Construire le payload
//             const payload = {
//                 shiftId: data.shiftId,
//                 incomingSupervisoryId: data.incomingSupervisoryId,
//                 chargers: chargersList.map(c => c.value),
//                 shippers: shippersList.map(s => s.value),
//                 thirdParties: thirdPartiesList.map(t => t.value),
//                 ships: shipsList.map(s => s.value),
//                 products: productsList.map(p => p.value),
//                 completeNumberWeighingsToBeBilled: parseInt(data.completeNumberWeighingsToBeBilled) || 0,
//                 completeNumberWeighingsBySpecies: parseInt(data.completeNumberWeighingsBySpecies) || 0,
//                 incompleteNumberWeighingsToBeBilled: parseInt(data.incompleteNumberWeighingsToBeBilled) || 0,
//                 incompleteNumberWeighingsBySpecies: parseInt(data.incompleteNumberWeighingsBySpecies) || 0,
//                 testNumberWeighingsToBeBilled: parseInt(data.testNumberWeighingsToBeBilled) || 0,
//                 testNumberWeighingsBySpecies: parseInt(data.testNumberWeighingsBySpecies) || 0,
//                 numberPassagesWithoutWeighingToBeBilled: parseInt(data.numberPassagesWithoutWeighingToBeBilled) || 0,
//                 numberPassagesWithoutWeighingBySpecies: parseInt(data.numberPassagesWithoutWeighingBySpecies) || 0,
//                 grossTonnage: parseFloat(data.grossTonnage) || 0,
//                 productionNote: data.productionNote || "",
//                 expectedNumberResources: parseInt(data.expectedNumberResources) || 0,
//                 availableNumberResources: parseInt(data.availableNumberResources) || 0,
//                 overdueNumberResources: parseInt(data.overdueNumberResources) || 0,
//                 missingNumberResources: parseInt(data.missingNumberResources) || 0,
//                 teamManagementFeedback: data.teamManagementFeedback || "",
//                 titleWorkProgress: data.titleWorkProgress || "",
//                 commentWorkProgress: data.commentWorkProgress || "",
//                 numberIncidents: incidents.length,
//                 incidentNote: data.incidentNote || "",
//                 incidents: incidents.map(inc => ({
//                     equipment: inc.equipment,
//                     breakdown: inc.breakdown,
//                     typeFailure: inc.typeFailure,
//                     downtime: inc.downtime,
//                     status: inc.status,
//                     managerFailure: inc.managerFailure
//                 })),
//                 attachments: attachmentsUrls,
//             };

//             let response;
//             if (isEditMode) {
//                 response = await handlePatch(`${URLS.INCIDENT_API}/reporting-supervisories/${editData.id}`, payload);
//             } else {
//                 response = await handlePost(`${URLS.INCIDENT_API}/reporting-supervisories`, payload);
//             }

//             if (response?.error) {
//                 response.error_list?.forEach(err => toast.error(err.msg));
//             } else {
//                 toast.success(isEditMode ? "Rapport modifié" : "Rapport créé");
//                 onSuccess();
//                 resetForm();
//             }
//         } catch (error) {
//             console.error(error);
//             toast.error("Erreur lors de l'enregistrement");
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     const resetForm = () => {
//         reset({
//             shiftId: "",
//             incomingSupervisoryId: "",
//             completeNumberWeighingsToBeBilled: "",
//             completeNumberWeighingsBySpecies: "",
//             incompleteNumberWeighingsToBeBilled: "",
//             incompleteNumberWeighingsBySpecies: "",
//             testNumberWeighingsToBeBilled: "",
//             testNumberWeighingsBySpecies: "",
//             numberPassagesWithoutWeighingToBeBilled: "",
//             numberPassagesWithoutWeighingBySpecies: "",
//             grossTonnage: "",
//             productionNote: "",
//             expectedNumberResources: "",
//             availableNumberResources: "",
//             overdueNumberResources: "",
//             missingNumberResources: "",
//             teamManagementFeedback: "",
//             titleWorkProgress: "",
//             commentWorkProgress: "",
//             incidentNote: "",
//         });
//         setChargersList([]);
//         setShippersList([]);
//         setThirdPartiesList([]);
//         setShipsList([]);
//         setProductsList([]);
//         setIncidents([]);
//         setAttachmentFiles([]);
//         setExistingAttachments([]);
//         setIncomingSupervisory(null);
//     };

//     // ===== 8. GESTION DES FICHIERS =====
//     const handleAttachmentChange = (e) => {
//         const files = Array.from(e.target.files);
//         setAttachmentFiles(prev => [...prev, ...files]);
//         e.target.value = '';
//     };

//     const removeAttachmentFile = (index) => {
//         setAttachmentFiles(prev => prev.filter((_, i) => i !== index));
//     };

//     const removeExistingAttachment = (index) => {
//         setExistingAttachments(prev => prev.filter((_, i) => i !== index));
//     };

//     // ===== 9. GESTION DES LISTES MULTIPLES =====
//     const handleAddCharger = (supplier) => {
//         if (supplier && !chargersList.some(c => c.value === supplier.value)) {
//             setChargersList(prev => [...prev, supplier]);
//         }
//     };
//     const removeCharger = (value) => {
//         setChargersList(prev => prev.filter(c => c.value !== value));
//     };

//     const handleAddShipper = (supplier) => {
//         if (supplier && !shippersList.some(s => s.value === supplier.value)) {
//             setShippersList(prev => [...prev, supplier]);
//         }
//     };
//     const removeShipper = (value) => {
//         setShippersList(prev => prev.filter(s => s.value !== value));
//     };

//     const handleAddThirdParty = (supplier) => {
//         if (supplier && !thirdPartiesList.some(t => t.value === supplier.value)) {
//             setThirdPartiesList(prev => [...prev, supplier]);
//         }
//     };
//     const removeThirdParty = (value) => {
//         setThirdPartiesList(prev => prev.filter(t => t.value !== value));
//     };

//     const handleAddShip = (ship) => {
//         if (ship && !shipsList.some(s => s.value === ship.value)) {
//             setShipsList(prev => [...prev, ship]);
//         }
//     };
//     const removeShip = (value) => {
//         setShipsList(prev => prev.filter(s => s.value !== value));
//     };

//     const handleAddProduct = (product) => {
//         if (product && !productsList.some(p => p.value === product.value)) {
//             setProductsList(prev => [...prev, product]);
//         }
//     };
//     const removeProduct = (value) => {
//         setProductsList(prev => prev.filter(p => p.value !== value));
//     };

//     // ===== 10. CHARGEMENT INITIAL & MODE ÉDITION =====
//     useEffect(() => {
//         if (isEditMode && editData) {
//             reset({
//                 shiftId: editData.shiftId,
//                 incomingSupervisoryId: editData.incomingSupervisoryId,
//                 completeNumberWeighingsToBeBilled: editData.completeNumberWeighingsToBeBilled,
//                 completeNumberWeighingsBySpecies: editData.completeNumberWeighingsBySpecies,
//                 incompleteNumberWeighingsToBeBilled: editData.incompleteNumberWeighingsToBeBilled,
//                 incompleteNumberWeighingsBySpecies: editData.incompleteNumberWeighingsBySpecies,
//                 testNumberWeighingsToBeBilled: editData.testNumberWeighingsToBeBilled,
//                 testNumberWeighingsBySpecies: editData.testNumberWeighingsBySpecies,
//                 numberPassagesWithoutWeighingToBeBilled: editData.numberPassagesWithoutWeighingToBeBilled,
//                 numberPassagesWithoutWeighingBySpecies: editData.numberPassagesWithoutWeighingBySpecies,
//                 grossTonnage: editData.grossTonnage,
//                 productionNote: editData.productionNote,
//                 expectedNumberResources: editData.expectedNumberResources,
//                 availableNumberResources: editData.availableNumberResources,
//                 overdueNumberResources: editData.overdueNumberResources,
//                 missingNumberResources: editData.missingNumberResources,
//                 teamManagementFeedback: editData.teamManagementFeedback,
//                 titleWorkProgress: editData.titleWorkProgress,
//                 commentWorkProgress: editData.commentWorkProgress,
//                 incidentNote: editData.incidentNote,
//             });

//             if (editData.chargers) {
//                 setChargersList(editData.chargers.map(c => ({ 
//                     name: c.charger?.name || c.chargerId, 
//                     value: c.chargerId 
//                 })));
//             }
//             if (editData.shippers) {
//                 setShippersList(editData.shippers.map(s => ({ 
//                     name: s.shipper?.name || s.shipperId, 
//                     value: s.shipperId 
//                 })));
//             }
//             if (editData.thirdParties) {
//                 setThirdPartiesList(editData.thirdParties.map(t => ({ 
//                     name: t.thirdParty?.name || t.thirdPartyId, 
//                     value: t.thirdPartyId 
//                 })));
//             }
//             if (editData.ships) {
//                 setShipsList(editData.ships.map(s => ({ 
//                     name: s.ship?.name || s.shipId, 
//                     value: s.shipId 
//                 })));
//             }
//             if (editData.products) {
//                 setProductsList(editData.products.map(p => ({ 
//                     name: p.product?.name || p.productId, 
//                     value: p.productId 
//                 })));
//             }
//             if (editData.incidents) {
//                 setIncidents(editData.incidents.map((inc, idx) => ({
//                     id: inc.id || `${Date.now()}_${idx}`,
//                     equipment: inc.equipment,
//                     breakdown: inc.breakdown,
//                     typeFailure: inc.typeFailure,
//                     downtime: inc.downtime,
//                     status: inc.status,
//                     managerFailure: inc.managerFailure
//                 })));
//             }
//             if (editData.attachments && editData.attachments.length > 0) {
//                 setExistingAttachments(editData.attachments.map(att => ({ 
//                     url: att.url, 
//                     filename: att.filename 
//                 })));
//             }
//             if (editData.incomingSupervisoryId) {
//                 setIncomingSupervisory({ 
//                     value: editData.incomingSupervisoryId, 
//                     name: editData.incomingSupervisory?.name || "Employé sélectionné" 
//                 });
//             }
//         }
//     }, [isEditMode, editData]);

//     return (
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto p-4">
            
//             {/* Quart (obligatoire) */}
//             <div>
//                 <label className="block text-sm font-medium mb-1">Quart <span className="text-red-500">*</span></label>
//                 <AutoComplete
//                     placeholder="Rechercher un quart"
//                     dataList={shifts.map(s => ({ name: s.name, value: s.id }))}
//                     onSearch={() => {}}
//                     onSelect={(item) => setValue("shiftId", item?.value || "")}
//                     initialValue={shifts.find(s => s.id === editData?.shiftId) ? { 
//                         name: shifts.find(s => s.id === editData?.shiftId).name, 
//                         value: editData?.shiftId 
//                     } : null}
//                 />
//             </div>

//             {/* Superviseur entrant (obligatoire) */}
//             <div>
//                 <label className="block text-sm font-medium mb-1">Superviseur entrant <span className="text-red-500">*</span></label>
//                 <AutoComplete
//                     placeholder="Rechercher un employé"
//                     isLoading={isEmployeeLoading}
//                     dataList={employees}
//                     onSearch={fetchEmployees}
//                     onSelect={(item) => {
//                         setValue("incomingSupervisoryId", item?.value || "");
//                         setIncomingSupervisory(item);
//                     }}
//                     initialValue={incomingSupervisory}
//                 />
//             </div>

//             {/* Chargeurs (obligatoire) */}
//             <div>
//                 <label className="block text-sm font-medium mb-1">Chargeurs <span className="text-red-500">*</span></label>
//                 <AutoComplete
//                     placeholder="Ajouter un chargeur"
//                     isLoading={isSupplierLoading}
//                     dataList={suppliers}
//                     onSearch={fetchSuppliers}
//                     onSelect={handleAddCharger}
//                 />
//                 <div className="flex flex-wrap gap-2 mt-2">
//                     {chargersList.map(c => (
//                         <span key={c.value} className="bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center gap-1">
//                             {c.name}
//                             <X size={14} className="cursor-pointer" onClick={() => removeCharger(c.value)} />
//                         </span>
//                     ))}
//                 </div>
//                 {chargersList.length === 0 && <p className="text-xs text-red-500 mt-1">Au moins un chargeur requis</p>}
//             </div>

//             {/* Acconiers (obligatoire) */}
//             <div>
//                 <label className="block text-sm font-medium mb-1">Acconiers <span className="text-red-500">*</span></label>
//                 <AutoComplete
//                     placeholder="Ajouter un expéditeur"
//                     isLoading={isSupplierLoading}
//                     dataList={suppliers}
//                     onSearch={fetchSuppliers}
//                     onSelect={handleAddShipper}
//                 />
//                 <div className="flex flex-wrap gap-2 mt-2">
//                     {shippersList.map(s => (
//                         <span key={s.value} className="bg-green-100 text-green-800 px-2 py-1 rounded flex items-center gap-1">
//                             {s.name}
//                             <X size={14} className="cursor-pointer" onClick={() => removeShipper(s.value)} />
//                         </span>
//                     ))}
//                 </div>
//                 {shippersList.length === 0 && <p className="text-xs text-red-500 mt-1">Au moins un expéditeur requis</p>}
//             </div>

//             {/* Tiers */}
//             <div>
//                 <label className="block text-sm font-medium mb-1">Tiers</label>
//                 <AutoComplete
//                     placeholder="Ajouter un tiers"
//                     isLoading={isSupplierLoading}
//                     dataList={suppliers}
//                     onSearch={fetchSuppliers}
//                     onSelect={handleAddThirdParty}
//                 />
//                 <div className="flex flex-wrap gap-2 mt-2">
//                     {thirdPartiesList.map(t => (
//                         <span key={t.value} className="bg-purple-100 text-purple-800 px-2 py-1 rounded flex items-center gap-1">
//                             {t.name}
//                             <X size={14} className="cursor-pointer" onClick={() => removeThirdParty(t.value)} />
//                         </span>
//                     ))}
//                 </div>
//             </div>

//             {/* Navires */}
//             <div>
//                 <label className="block text-sm font-medium mb-1">Navires</label>
//                 <AutoComplete
//                     placeholder="Ajouter un navire"
//                     isLoading={isShipLoading}
//                     dataList={ships}
//                     onSearch={fetchShips}
//                     onSelect={handleAddShip}
//                 />
//                 <div className="flex flex-wrap gap-2 mt-2">
//                     {shipsList.map(s => (
//                         <span key={s.value} className="bg-cyan-100 text-cyan-800 px-2 py-1 rounded flex items-center gap-1">
//                             {s.name}
//                             <X size={14} className="cursor-pointer" onClick={() => removeShip(s.value)} />
//                         </span>
//                     ))}
//                 </div>
//             </div>

//             {/* Produits */}
//             <div>
//                 <label className="block text-sm font-medium mb-1">Produits</label>
//                 <AutoComplete
//                     placeholder="Ajouter un produit"
//                     isLoading={isProductLoading}
//                     dataList={products}
//                     onSearch={fetchProducts}
//                     onSelect={handleAddProduct}
//                 />
//                 <div className="flex flex-wrap gap-2 mt-2">
//                     {productsList.map(p => (
//                         <span key={p.value} className="bg-orange-100 text-orange-800 px-2 py-1 rounded flex items-center gap-1">
//                             {p.name}
//                             <X size={14} className="cursor-pointer" onClick={() => removeProduct(p.value)} />
//                         </span>
//                     ))}
//                 </div>
//             </div>

//             {/* Champs numériques - Pesées */}
//             <div className="grid grid-cols-2 gap-4">
//                 <div>
//                     <label className="text-sm font-medium">Pesées complètes à facturer</label>
//                     <input type="number" {...register("completeNumberWeighingsToBeBilled")} className="w-full p-2 border rounded" />
//                 </div>
//                 <div>
//                     <label className="text-sm font-medium">Pesées complètes espèce</label>
//                     <input type="number" {...register("completeNumberWeighingsBySpecies")} className="w-full p-2 border rounded" />
//                 </div>
//                 <div>
//                     <label className="text-sm font-medium">Pesées incomplètes à facturer</label>
//                     <input type="number" {...register("incompleteNumberWeighingsToBeBilled")} className="w-full p-2 border rounded" />
//                 </div>
//                 <div>
//                     <label className="text-sm font-medium">Pesées incomplètes espèce</label>
//                     <input type="number" {...register("incompleteNumberWeighingsBySpecies")} className="w-full p-2 border rounded" />
//                 </div>
//                 <div>
//                     <label className="text-sm font-medium">Pesées test à facturer</label>
//                     <input type="number" {...register("testNumberWeighingsToBeBilled")} className="w-full p-2 border rounded" />
//                 </div>
//                 <div>
//                     <label className="text-sm font-medium">Pesées test espèce</label>
//                     <input type="number" {...register("testNumberWeighingsBySpecies")} className="w-full p-2 border rounded" />
//                 </div>
//                 <div>
//                     <label className="text-sm font-medium">Passages sans pesée à facturer</label>
//                     <input type="number" {...register("numberPassagesWithoutWeighingToBeBilled")} className="w-full p-2 border rounded" />
//                 </div>
//                 <div>
//                     <label className="text-sm font-medium">Passages sans pesée espèce</label>
//                     <input type="number" {...register("numberPassagesWithoutWeighingBySpecies")} className="w-full p-2 border rounded" />
//                 </div>
//             </div>

//             {/* Tonnage brut */}
//             <div>
//                 <label className="text-sm font-medium">Tonnage brut</label>
//                 <input type="number" step="0.01" {...register("grossTonnage")} className="w-full p-2 border rounded" />
//             </div>

//             {/* Note production */}
//             <div>
//                 <label className="text-sm font-medium">Note production</label>
//                 <textarea {...register("productionNote")} rows="2" className="w-full p-2 border rounded" />
//             </div>

//             {/* Ressources */}
//             <div className="grid grid-cols-2 gap-4">
//                 <div>
//                     <label className="text-sm font-medium">Ressources attendues</label>
//                     <input type="number" {...register("expectedNumberResources")} className="w-full p-2 border rounded" />
//                 </div>
//                 <div>
//                     <label className="text-sm font-medium">Ressources disponibles</label>
//                     <input type="number" {...register("availableNumberResources")} className="w-full p-2 border rounded" />
//                 </div>
//                 <div>
//                     <label className="text-sm font-medium">Ressources en retard</label>
//                     <input type="number" {...register("overdueNumberResources")} className="w-full p-2 border rounded" />
//                 </div>
//                 <div>
//                     <label className="text-sm font-medium">Ressources manquantes</label>
//                     <input type="number" {...register("missingNumberResources")} className="w-full p-2 border rounded" />
//                 </div>
//             </div>

//             {/* Feedback gestion équipe */}
//             <div>
//                 <label className="text-sm font-medium">Feedback gestion équipe</label>
//                 <textarea {...register("teamManagementFeedback")} rows="2" className="w-full p-2 border rounded" />
//             </div>

//             {/* Avancement travaux */}
//             <div>
//                 <label className="text-sm font-medium">Titre avancement travaux</label>
//                 <input type="text" {...register("titleWorkProgress")} className="w-full p-2 border rounded" />
//             </div>
//             <div>
//                 <label className="text-sm font-medium">Commentaire avancement travaux</label>
//                 <textarea {...register("commentWorkProgress")} rows="2" className="w-full p-2 border rounded" />
//             </div>

//             {/* Incidents dynamiques */}
//             <div>
//                 <div className="flex items-center justify-between mb-2">
//                     <label className="text-sm font-medium">Incidents ({incidents.length})</label>
//                     <Button type="button" variant="outline" size="sm" onClick={addIncident} className="flex items-center gap-1">
//                         <Plus size={14} /> Ajouter un incident
//                     </Button>
//                 </div>
                
//                 {incidents.map((incident, idx) => (
//                     <div key={incident.id} className="border rounded p-3 mb-2 bg-gray-50">
//                         <div className="flex justify-between items-center mb-2">
//                             <span className="text-sm font-medium">Incident #{idx + 1}</span>
//                             <Button type="button" variant="ghost" size="sm" onClick={() => removeIncident(incident.id)} className="text-red-500">
//                                 <Minus size={14} />
//                             </Button>
//                         </div>
//                         <div className="grid grid-cols-2 gap-2">
//                             <input 
//                                 placeholder="Équipement" 
//                                 value={incident.equipment}
//                                 onChange={(e) => updateIncident(incident.id, 'equipment', e.target.value)}
//                                 className="w-full p-2 border rounded text-sm" 
//                             />
//                             <input 
//                                 placeholder="Panne" 
//                                 value={incident.breakdown}
//                                 onChange={(e) => updateIncident(incident.id, 'breakdown', e.target.value)}
//                                 className="w-full p-2 border rounded text-sm" 
//                             />
//                             <input 
//                                 placeholder="Type de panne" 
//                                 value={incident.typeFailure}
//                                 onChange={(e) => updateIncident(incident.id, 'typeFailure', e.target.value)}
//                                 className="w-full p-2 border rounded text-sm" 
//                             />
//                             <input 
//                                 placeholder="Temps d'arrêt" 
//                                 value={incident.downtime}
//                                 onChange={(e) => updateIncident(incident.id, 'downtime', e.target.value)}
//                                 className="w-full p-2 border rounded text-sm" 
//                             />
//                             <input 
//                                 placeholder="Statut" 
//                                 value={incident.status}
//                                 onChange={(e) => updateIncident(incident.id, 'status', e.target.value)}
//                                 className="w-full p-2 border rounded text-sm" 
//                             />
//                             <input 
//                                 placeholder="Gestionnaire" 
//                                 value={incident.managerFailure}
//                                 onChange={(e) => updateIncident(incident.id, 'managerFailure', e.target.value)}
//                                 className="w-full p-2 border rounded text-sm" 
//                             />
//                         </div>
//                     </div>
//                 ))}
//             </div>

//             {/* Note incidents */}
//             <div>
//                 <label className="text-sm font-medium">Note des incidents</label>
//                 <textarea {...register("incidentNote")} rows="2" className="w-full p-2 border rounded" />
//             </div>

//             {/* Pièces jointes multiples */}
//             <div>
//                 <label className="text-sm font-medium">Pièces jointes</label>
//                 <input type="file" multiple onChange={handleAttachmentChange} />
//                 <div className="mt-2 space-y-1">
//                     {attachmentFiles.map((file, idx) => (
//                         <div key={file.name + idx} className="flex justify-between items-center bg-gray-100 p-1 rounded">
//                             <span className="text-sm truncate">{file.name}</span>
//                             <button type="button" onClick={() => removeAttachmentFile(idx)} className="text-red-500">
//                                 <Trash2 size={16} />
//                             </button>
//                         </div>
//                     ))}
//                     {existingAttachments.map((att, idx) => (
//                         <div key={att.url + idx} className="flex justify-between items-center bg-blue-50 p-1 rounded">
//                             <a href={att.url} target="_blank" rel="noreferrer" className="text-sm text-blue-600 underline truncate">
//                                 {att.filename}
//                             </a>
//                             <button type="button" onClick={() => removeExistingAttachment(idx)} className="text-red-500">
//                                 <X size={14} />
//                             </button>
//                         </div>
//                     ))}
//                 </div>
//             </div>

//             {/* Boutons */}
//             <div className="flex justify-end gap-2 pt-4">
//                 <Button type="button" variant="outline" onClick={onCancelEdit} disabled={isSubmitting}>Annuler</Button>
//                 <Button type="submit" disabled={isSubmitting} className="bg-primary text-white">
//                     {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle size={18} className="mr-2" />}
//                     {isSubmitting ? "Enregistrement..." : (isEditMode ? "Modifier" : "Créer")}
//                 </Button>
//             </div>
//         </form>
//     );
// };

// export default InitiateForm;

import React, { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useFetch } from '../../../hooks/useFetch';
import AutoComplete from '../../common/AutoComplete';
import { Button } from '../../ui/button';
import { CheckCircle, X, Trash2, Loader2, Plus, Minus } from 'lucide-react';
import toast from 'react-hot-toast';
import { URLS } from '../../../../configUrl';

const InitiateForm = ({ onSuccess, editData, onCancelEdit, references = {} }) => {
    const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm();
    const { handleFetch, handlePost, handlePatch } = useFetch();

    // Données de référence passées en props (pour les shifts qui sont statiques)
    const { shifts = [] } = references;

    // États pour les listes multiples (pattern identique au Rapport CG)
    const [chargersList, setChargersList] = useState([]);
    const [shippersList, setShippersList] = useState([]);
    const [thirdPartiesList, setThirdPartiesList] = useState([]);
    const [shipsList, setShipsList] = useState([]);
    const [productsList, setProductsList] = useState([]);
    const [incomingSupervisory, setIncomingSupervisory] = useState(null);

    // États pour les données dynamiques (comme employees dans CG)
    const [suppliersData, setSuppliersData] = useState([]);
    const [shipsData, setShipsData] = useState([]);
    const [productsData, setProductsData] = useState([]);
    const [employeesData, setEmployeesData] = useState([]);

    // États pour les incidents dynamiques
    const [incidents, setIncidents] = useState([]);

    // États pour les fichiers
    const [attachmentFiles, setAttachmentFiles] = useState([]);
    const [existingAttachments, setExistingAttachments] = useState([]);

    // États de chargement
    const [isEmployeeLoading, setIsEmployeeLoading] = useState(false);
    const [isSupplierLoading, setIsSupplierLoading] = useState(false);
    const [isShipLoading, setIsShipLoading] = useState(false);
    const [isProductLoading, setIsProductLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isEditMode = !!editData;

    // ===== 1. GESTION DES EMPLOYÉS (comme dans CG) =====
    const fetchEmployees = async (search = "") => {
        setIsEmployeeLoading(true);
        try {
            let url = `${URLS.ENTITY_API}/employees?limit=100`;
            if (search) url += `&search=${search}`;
            const response = await handleFetch(url);
            if (response?.data) {
                let dataArray = response.data.data || response.data;
                if (Array.isArray(dataArray)) {
                    const formatted = dataArray.map(e => ({ name: e.name, value: e.id }));
                    setEmployeesData(formatted);
                    return formatted;
                }
            }
            return [];
        } catch (error) {
            console.error(error);
            return [];
        } finally {
            setIsEmployeeLoading(false);
        }
    };

    // ===== 2. GESTION DES FOURNISSEURS (pour Chargeurs, Acconiers, Tiers) =====
    const fetchSuppliers = async (search = "") => {
        setIsSupplierLoading(true);
        try {
            let url = `${URLS.ENTITY_API}/suppliers?limit=100`;
            if (search) url += `&search=${search}`;
            const response = await handleFetch(url);
            if (response?.data) {
                let dataArray = response.data.data || response.data;
                if (Array.isArray(dataArray)) {
                    const formatted = dataArray.map(s => ({ name: s.name, value: s.id }));
                    setSuppliersData(formatted);
                    return formatted;
                }
            }
            return [];
        } catch (error) {
            console.error(error);
            return [];
        } finally {
            setIsSupplierLoading(false);
        }
    };

    // ===== 3. GESTION DES NAVIRES =====
    const fetchShips = async (search = "") => {
        setIsShipLoading(true);
        try {
            let url = `${URLS.INCIDENT_API}/ships?limit=100`;
            if (search) url += `&search=${search}`;
            const response = await handleFetch(url);
            if (response?.data) {
                let dataArray = response.data.data || response.data;
                if (Array.isArray(dataArray)) {
                    const formatted = dataArray.map(s => ({ name: s.name, value: s.id }));
                    setShipsData(formatted);
                    return formatted;
                }
            }
            return [];
        } catch (error) {
            console.error(error);
            return [];
        } finally {
            setIsShipLoading(false);
        }
    };

    // ===== 4. GESTION DES PRODUITS =====
    const fetchProducts = async (search = "") => {
        setIsProductLoading(true);
        try {
            let url = `${URLS.INCIDENT_API}/products?limit=100`;
            if (search) url += `&search=${search}`;
            const response = await handleFetch(url);
            if (response?.data) {
                let dataArray = response.data.data || response.data;
                if (Array.isArray(dataArray)) {
                    const formatted = dataArray.map(p => ({ name: p.name, value: p.id }));
                    setProductsData(formatted);
                    return formatted;
                }
            }
            return [];
        } catch (error) {
            console.error(error);
            return [];
        } finally {
            setIsProductLoading(false);
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

    // ===== 6. GESTION DES INCIDENTS =====
    const addIncident = () => {
        setIncidents(prev => [...prev, {
            id: Date.now(),
            equipment: '',
            breakdown: '',
            typeFailure: '',
            downtime: '',
            status: '',
            managerFailure: ''
        }]);
    };

    const removeIncident = (id) => {
        setIncidents(prev => prev.filter(inc => inc.id !== id));
    };

    const updateIncident = (id, field, value) => {
        setIncidents(prev => prev.map(inc => 
            inc.id === id ? { ...inc, [field]: value } : inc
        ));
    };

    // ===== 7. SOUMISSION =====
    const onSubmit = async (data) => {
        if (!data.shiftId) {
            toast.error("Le quart est obligatoire");
            return;
        }
        if (!data.incomingSupervisoryId) {
            toast.error("Le superviseur entrant est obligatoire");
            return;
        }
        if (chargersList.length === 0) {
            toast.error("Veuillez ajouter au moins un chargeur");
            return;
        }
        if (shippersList.length === 0) {
            toast.error("Veuillez ajouter au moins un expéditeur");
            return;
        }

        setIsSubmitting(true);
        try {
            const attachmentsUrls = [];
            if (attachmentFiles.length > 0) {
                for (const file of attachmentFiles) {
                    try {
                        const uploaded = await uploadFileToServer(file);
                        attachmentsUrls.push({
                            url: uploaded.url,
                            filename: uploaded.filename,
                        });
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

            const payload = {
                shiftId: data.shiftId,
                incomingSupervisoryId: data.incomingSupervisoryId,
                chargers: chargersList.map(c => c.value),
                shippers: shippersList.map(s => s.value),
                thirdParties: thirdPartiesList.map(t => t.value),
                ships: shipsList.map(s => s.value),
                products: productsList.map(p => p.value),
                completeNumberWeighingsToBeBilled: parseInt(data.completeNumberWeighingsToBeBilled) || 0,
                completeNumberWeighingsBySpecies: parseInt(data.completeNumberWeighingsBySpecies) || 0,
                incompleteNumberWeighingsToBeBilled: parseInt(data.incompleteNumberWeighingsToBeBilled) || 0,
                incompleteNumberWeighingsBySpecies: parseInt(data.incompleteNumberWeighingsBySpecies) || 0,
                testNumberWeighingsToBeBilled: parseInt(data.testNumberWeighingsToBeBilled) || 0,
                testNumberWeighingsBySpecies: parseInt(data.testNumberWeighingsBySpecies) || 0,
                numberPassagesWithoutWeighingToBeBilled: parseInt(data.numberPassagesWithoutWeighingToBeBilled) || 0,
                numberPassagesWithoutWeighingBySpecies: parseInt(data.numberPassagesWithoutWeighingBySpecies) || 0,
                grossTonnage: parseFloat(data.grossTonnage) || 0,
                productionNote: data.productionNote || "",
                expectedNumberResources: parseInt(data.expectedNumberResources) || 0,
                availableNumberResources: parseInt(data.availableNumberResources) || 0,
                overdueNumberResources: parseInt(data.overdueNumberResources) || 0,
                missingNumberResources: parseInt(data.missingNumberResources) || 0,
                teamManagementFeedback: data.teamManagementFeedback || "",
                titleWorkProgress: data.titleWorkProgress || "",
                commentWorkProgress: data.commentWorkProgress || "",
                numberIncidents: incidents.length,
                incidentNote: data.incidentNote || "",
                incidents: incidents.map(inc => ({
                    equipment: inc.equipment,
                    breakdown: inc.breakdown,
                    typeFailure: inc.typeFailure,
                    downtime: inc.downtime,
                    status: inc.status,
                    managerFailure: inc.managerFailure
                })),
                attachments: attachmentsUrls,
            };

            let response;
            if (isEditMode) {
                response = await handlePatch(`${URLS.INCIDENT_API}/reporting-supervisories/${editData.id}`, payload);
            } else {
                response = await handlePost(`${URLS.INCIDENT_API}/reporting-supervisories`, payload);
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
            incomingSupervisoryId: "",
            completeNumberWeighingsToBeBilled: "",
            completeNumberWeighingsBySpecies: "",
            incompleteNumberWeighingsToBeBilled: "",
            incompleteNumberWeighingsBySpecies: "",
            testNumberWeighingsToBeBilled: "",
            testNumberWeighingsBySpecies: "",
            numberPassagesWithoutWeighingToBeBilled: "",
            numberPassagesWithoutWeighingBySpecies: "",
            grossTonnage: "",
            productionNote: "",
            expectedNumberResources: "",
            availableNumberResources: "",
            overdueNumberResources: "",
            missingNumberResources: "",
            teamManagementFeedback: "",
            titleWorkProgress: "",
            commentWorkProgress: "",
            incidentNote: "",
        });
        setChargersList([]);
        setShippersList([]);
        setThirdPartiesList([]);
        setShipsList([]);
        setProductsList([]);
        setIncidents([]);
        setAttachmentFiles([]);
        setExistingAttachments([]);
        setIncomingSupervisory(null);
    };

    // ===== 8. GESTION DES FICHIERS =====
    const handleAttachmentChange = (e) => {
        const files = Array.from(e.target.files);
        setAttachmentFiles(prev => [...prev, ...files]);
        e.target.value = '';
    };

    const removeAttachmentFile = (index) => {
        setAttachmentFiles(prev => prev.filter((_, i) => i !== index));
    };

    const removeExistingAttachment = (index) => {
        setExistingAttachments(prev => prev.filter((_, i) => i !== index));
    };

    // ===== 9. GESTION DES LISTES MULTIPLES (pattern CG) =====
    const handleAddCharger = (supplier) => {
        if (supplier && !chargersList.some(c => c.value === supplier.value)) {
            setChargersList(prev => [...prev, supplier]);
        }
    };
    const removeCharger = (value) => {
        setChargersList(prev => prev.filter(c => c.value !== value));
    };

    const handleAddShipper = (supplier) => {
        if (supplier && !shippersList.some(s => s.value === supplier.value)) {
            setShippersList(prev => [...prev, supplier]);
        }
    };
    const removeShipper = (value) => {
        setShippersList(prev => prev.filter(s => s.value !== value));
    };

    const handleAddThirdParty = (supplier) => {
        if (supplier && !thirdPartiesList.some(t => t.value === supplier.value)) {
            setThirdPartiesList(prev => [...prev, supplier]);
        }
    };
    const removeThirdParty = (value) => {
        setThirdPartiesList(prev => prev.filter(t => t.value !== value));
    };

    const handleAddShip = (ship) => {
        if (ship && !shipsList.some(s => s.value === ship.value)) {
            setShipsList(prev => [...prev, ship]);
        }
    };
    const removeShip = (value) => {
        setShipsList(prev => prev.filter(s => s.value !== value));
    };

    const handleAddProduct = (product) => {
        if (product && !productsList.some(p => p.value === product.value)) {
            setProductsList(prev => [...prev, product]);
        }
    };
    const removeProduct = (value) => {
        setProductsList(prev => prev.filter(p => p.value !== value));
    };

    // ===== 10. CHARGEMENT INITIAL & MODE ÉDITION =====
    useEffect(() => {
        // Chargement initial des données pour les AutoComplete
        fetchEmployees();
        fetchSuppliers();
        fetchShips();
        fetchProducts();

        if (isEditMode && editData) {
            reset({
                shiftId: editData.shiftId,
                incomingSupervisoryId: editData.incomingSupervisoryId,
                completeNumberWeighingsToBeBilled: editData.completeNumberWeighingsToBeBilled,
                completeNumberWeighingsBySpecies: editData.completeNumberWeighingsBySpecies,
                incompleteNumberWeighingsToBeBilled: editData.incompleteNumberWeighingsToBeBilled,
                incompleteNumberWeighingsBySpecies: editData.incompleteNumberWeighingsBySpecies,
                testNumberWeighingsToBeBilled: editData.testNumberWeighingsToBeBilled,
                testNumberWeighingsBySpecies: editData.testNumberWeighingsBySpecies,
                numberPassagesWithoutWeighingToBeBilled: editData.numberPassagesWithoutWeighingToBeBilled,
                numberPassagesWithoutWeighingBySpecies: editData.numberPassagesWithoutWeighingBySpecies,
                grossTonnage: editData.grossTonnage,
                productionNote: editData.productionNote,
                expectedNumberResources: editData.expectedNumberResources,
                availableNumberResources: editData.availableNumberResources,
                overdueNumberResources: editData.overdueNumberResources,
                missingNumberResources: editData.missingNumberResources,
                teamManagementFeedback: editData.teamManagementFeedback,
                titleWorkProgress: editData.titleWorkProgress,
                commentWorkProgress: editData.commentWorkProgress,
                incidentNote: editData.incidentNote,
            });

            if (editData.chargers) {
                setChargersList(editData.chargers.map(c => ({ 
                    name: c.charger?.name || c.chargerId, 
                    value: c.chargerId 
                })));
            }
            if (editData.shippers) {
                setShippersList(editData.shippers.map(s => ({ 
                    name: s.shipper?.name || s.shipperId, 
                    value: s.shipperId 
                })));
            }
            if (editData.thirdParties) {
                setThirdPartiesList(editData.thirdParties.map(t => ({ 
                    name: t.thirdParty?.name || t.thirdPartyId, 
                    value: t.thirdPartyId 
                })));
            }
            if (editData.ships) {
                setShipsList(editData.ships.map(s => ({ 
                    name: s.ship?.name || s.shipId, 
                    value: s.shipId 
                })));
            }
            if (editData.products) {
                setProductsList(editData.products.map(p => ({ 
                    name: p.product?.name || p.productId, 
                    value: p.productId 
                })));
            }
            if (editData.incidents) {
                setIncidents(editData.incidents.map((inc, idx) => ({
                    id: inc.id || `${Date.now()}_${idx}`,
                    equipment: inc.equipment,
                    breakdown: inc.breakdown,
                    typeFailure: inc.typeFailure,
                    downtime: inc.downtime,
                    status: inc.status,
                    managerFailure: inc.managerFailure
                })));
            }
            if (editData.attachments && editData.attachments.length > 0) {
                setExistingAttachments(editData.attachments.map(att => ({ 
                    url: att.url, 
                    filename: att.filename 
                })));
            }
            if (editData.incomingSupervisoryId) {
                setIncomingSupervisory({ 
                    value: editData.incomingSupervisoryId, 
                    name: editData.incomingSupervisory?.name || "Employé sélectionné" 
                });
            }
        }
    }, [isEditMode, editData]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto p-4">
            
            {/* Quart (obligatoire) */}
            <div>
                <label className="block text-sm font-medium mb-1">Quart <span className="text-red-500">*</span></label>
                <AutoComplete
                    placeholder="Rechercher un quart"
                    dataList={shifts.map(s => ({ name: s.name, value: s.id }))}
                    onSearch={() => {}}
                    onSelect={(item) => setValue("shiftId", item?.value || "")}
                    initialValue={shifts.find(s => s.id === editData?.shiftId) ? { 
                        name: shifts.find(s => s.id === editData?.shiftId).name, 
                        value: editData?.shiftId 
                    } : null}
                />
            </div>

            {/* Superviseur entrant (obligatoire) */}
            <div>
                <label className="block text-sm font-medium mb-1">Superviseur entrant <span className="text-red-500">*</span></label>
                <AutoComplete
                    placeholder="Rechercher un employé"
                    isLoading={isEmployeeLoading}
                    dataList={employeesData}
                    onSearch={fetchEmployees}
                    onSelect={(item) => {
                        setValue("incomingSupervisoryId", item?.value || "");
                        setIncomingSupervisory(item);
                    }}
                    initialValue={incomingSupervisory}
                />
            </div>

            {/* Chargeurs (obligatoire) - PATTERN CG */}
            <div>
                <label className="block text-sm font-medium mb-1">Chargeurs <span className="text-red-500">*</span></label>
                <AutoComplete
                    placeholder="Ajouter un chargeur"
                    isLoading={isSupplierLoading}
                    dataList={suppliersData}
                    onSearch={fetchSuppliers}
                    onSelect={handleAddCharger}
                />
                <div className="flex flex-wrap gap-2 mt-2">
                    {chargersList.map(c => (
                        <span key={c.value} className="bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center gap-1">
                            {c.name}
                            <X size={14} className="cursor-pointer" onClick={() => removeCharger(c.value)} />
                        </span>
                    ))}
                </div>
                {chargersList.length === 0 && <p className="text-xs text-red-500 mt-1">Au moins un chargeur requis</p>}
            </div>

            {/* Acconiers (obligatoire) - PATTERN CG */}
            <div>
                <label className="block text-sm font-medium mb-1">Acconiers <span className="text-red-500">*</span></label>
                <AutoComplete
                    placeholder="Ajouter un expéditeur"
                    isLoading={isSupplierLoading}
                    dataList={suppliersData}
                    onSearch={fetchSuppliers}
                    onSelect={handleAddShipper}
                />
                <div className="flex flex-wrap gap-2 mt-2">
                    {shippersList.map(s => (
                        <span key={s.value} className="bg-green-100 text-green-800 px-2 py-1 rounded flex items-center gap-1">
                            {s.name}
                            <X size={14} className="cursor-pointer" onClick={() => removeShipper(s.value)} />
                        </span>
                    ))}
                </div>
                {shippersList.length === 0 && <p className="text-xs text-red-500 mt-1">Au moins un expéditeur requis</p>}
            </div>

            {/* Tiers - PATTERN CG */}
            <div>
                <label className="block text-sm font-medium mb-1">Tiers</label>
                <AutoComplete
                    placeholder="Ajouter un tiers"
                    isLoading={isSupplierLoading}
                    dataList={suppliersData}
                    onSearch={fetchSuppliers}
                    onSelect={handleAddThirdParty}
                />
                <div className="flex flex-wrap gap-2 mt-2">
                    {thirdPartiesList.map(t => (
                        <span key={t.value} className="bg-purple-100 text-purple-800 px-2 py-1 rounded flex items-center gap-1">
                            {t.name}
                            <X size={14} className="cursor-pointer" onClick={() => removeThirdParty(t.value)} />
                        </span>
                    ))}
                </div>
            </div>

            {/* Navires - PATTERN CG */}
            <div>
                <label className="block text-sm font-medium mb-1">Navires</label>
                <AutoComplete
                    placeholder="Ajouter un navire"
                    isLoading={isShipLoading}
                    dataList={shipsData}
                    onSearch={fetchShips}
                    onSelect={handleAddShip}
                />
                <div className="flex flex-wrap gap-2 mt-2">
                    {shipsList.map(s => (
                        <span key={s.value} className="bg-cyan-100 text-cyan-800 px-2 py-1 rounded flex items-center gap-1">
                            {s.name}
                            <X size={14} className="cursor-pointer" onClick={() => removeShip(s.value)} />
                        </span>
                    ))}
                </div>
            </div>

            {/* Produits - PATTERN CG */}
            <div>
                <label className="block text-sm font-medium mb-1">Produits</label>
                <AutoComplete
                    placeholder="Ajouter un produit"
                    isLoading={isProductLoading}
                    dataList={productsData}
                    onSearch={fetchProducts}
                    onSelect={handleAddProduct}
                />
                <div className="flex flex-wrap gap-2 mt-2">
                    {productsList.map(p => (
                        <span key={p.value} className="bg-orange-100 text-orange-800 px-2 py-1 rounded flex items-center gap-1">
                            {p.name}
                            <X size={14} className="cursor-pointer" onClick={() => removeProduct(p.value)} />
                        </span>
                    ))}
                </div>
            </div>

            {/* Champs numériques - Pesées */}
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
                    <label className="text-sm font-medium">Pesées incomplètes espèce</label>
                    <input type="number" {...register("incompleteNumberWeighingsBySpecies")} className="w-full p-2 border rounded" />
                </div>
                <div>
                    <label className="text-sm font-medium">Pesées test à facturer</label>
                    <input type="number" {...register("testNumberWeighingsToBeBilled")} className="w-full p-2 border rounded" />
                </div>
                <div>
                    <label className="text-sm font-medium">Pesées test espèce</label>
                    <input type="number" {...register("testNumberWeighingsBySpecies")} className="w-full p-2 border rounded" />
                </div>
                <div>
                    <label className="text-sm font-medium">Passages sans pesée à facturer</label>
                    <input type="number" {...register("numberPassagesWithoutWeighingToBeBilled")} className="w-full p-2 border rounded" />
                </div>
                <div>
                    <label className="text-sm font-medium">Passages sans pesée espèce</label>
                    <input type="number" {...register("numberPassagesWithoutWeighingBySpecies")} className="w-full p-2 border rounded" />
                </div>
            </div>

            {/* Tonnage brut */}
            <div>
                <label className="text-sm font-medium">Tonnage brut</label>
                <input type="number" step="0.01" {...register("grossTonnage")} className="w-full p-2 border rounded" />
            </div>

            {/* Note production */}
            <div>
                <label className="text-sm font-medium">Note production</label>
                <textarea {...register("productionNote")} rows="2" className="w-full p-2 border rounded" />
            </div>

            {/* Ressources */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-sm font-medium">Ressources attendues</label>
                    <input type="number" {...register("expectedNumberResources")} className="w-full p-2 border rounded" />
                </div>
                <div>
                    <label className="text-sm font-medium">Ressources disponibles</label>
                    <input type="number" {...register("availableNumberResources")} className="w-full p-2 border rounded" />
                </div>
                <div>
                    <label className="text-sm font-medium">Ressources en retard</label>
                    <input type="number" {...register("overdueNumberResources")} className="w-full p-2 border rounded" />
                </div>
                <div>
                    <label className="text-sm font-medium">Ressources manquantes</label>
                    <input type="number" {...register("missingNumberResources")} className="w-full p-2 border rounded" />
                </div>
            </div>

            {/* Feedback gestion équipe */}
            <div>
                <label className="text-sm font-medium">Feedback gestion équipe</label>
                <textarea {...register("teamManagementFeedback")} rows="2" className="w-full p-2 border rounded" />
            </div>

            {/* Avancement travaux */}
            <div>
                <label className="text-sm font-medium">Titre avancement travaux</label>
                <input type="text" {...register("titleWorkProgress")} className="w-full p-2 border rounded" />
            </div>
            <div>
                <label className="text-sm font-medium">Commentaire avancement travaux</label>
                <textarea {...register("commentWorkProgress")} rows="2" className="w-full p-2 border rounded" />
            </div>

            {/* Incidents dynamiques */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium">Incidents ({incidents.length})</label>
                    <Button type="button" variant="outline" size="sm" onClick={addIncident} className="flex items-center gap-1">
                        <Plus size={14} /> Ajouter un incident
                    </Button>
                </div>
                
                {incidents.map((incident, idx) => (
                    <div key={incident.id} className="border rounded p-3 mb-2 bg-gray-50">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">Incident #{idx + 1}</span>
                            <Button type="button" variant="ghost" size="sm" onClick={() => removeIncident(incident.id)} className="text-red-500">
                                <Minus size={14} />
                            </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <input 
                                placeholder="Équipement" 
                                value={incident.equipment}
                                onChange={(e) => updateIncident(incident.id, 'equipment', e.target.value)}
                                className="w-full p-2 border rounded text-sm" 
                            />
                            <input 
                                placeholder="Panne" 
                                value={incident.breakdown}
                                onChange={(e) => updateIncident(incident.id, 'breakdown', e.target.value)}
                                className="w-full p-2 border rounded text-sm" 
                            />
                            <input 
                                placeholder="Type de panne" 
                                value={incident.typeFailure}
                                onChange={(e) => updateIncident(incident.id, 'typeFailure', e.target.value)}
                                className="w-full p-2 border rounded text-sm" 
                            />
                            <input 
                                placeholder="Temps d'arrêt" 
                                value={incident.downtime}
                                onChange={(e) => updateIncident(incident.id, 'downtime', e.target.value)}
                                className="w-full p-2 border rounded text-sm" 
                            />
                            <input 
                                placeholder="Statut" 
                                value={incident.status}
                                onChange={(e) => updateIncident(incident.id, 'status', e.target.value)}
                                className="w-full p-2 border rounded text-sm" 
                            />
                            <input 
                                placeholder="Gestionnaire" 
                                value={incident.managerFailure}
                                onChange={(e) => updateIncident(incident.id, 'managerFailure', e.target.value)}
                                className="w-full p-2 border rounded text-sm" 
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Note incidents */}
            <div>
                <label className="text-sm font-medium">Note des incidents</label>
                <textarea {...register("incidentNote")} rows="2" className="w-full p-2 border rounded" />
            </div>

            {/* Pièces jointes multiples */}
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