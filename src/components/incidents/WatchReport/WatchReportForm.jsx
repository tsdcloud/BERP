// import React, { useEffect, useMemo, useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { useFetch } from '../../../hooks/useFetch';
// import AutoComplete from '../../common/AutoComplete';
// import { Button } from '../../ui/button';
// import { CheckCircle, X, Trash2, Loader2 } from 'lucide-react';
// import toast from 'react-hot-toast';
// import { URLS } from '../../../../configUrl';

// const EMPTY_FORM_VALUES = {
//   shiftId: '',
//   siteId: '',
//   recipeCardNumber: '',
//   completeNumberWeighingsToBeBilled: '',
//   completeNumberWeighingsBySpecies: '',
//   incompleteNumberWeighingsToBeBilled: '',
//   incompleteNumberWeighingsBySpecies: '',
//   testNumberWeighingsBySpecies: '',
//   offBridgeNumber: '',
//   numberIncidents: '',
//   incidentDescription: '',
//   productionDescription: '',
//   incomingCgId: '',
//   firstWeighNumber: '',
//   lastWeighNumber: '',
//   firstWeighTractorNumber: '',
//   lastWeighTractorNumber: '',
//   firstWeighDate: '',
//   lastWeighDate: '',
// };

// const toDateTimeLocal = (dateValue) => {
//   if (!dateValue) return '';

//   const date = new Date(dateValue);

//   if (Number.isNaN(date.getTime())) {
//     return '';
//   }

//   const pad = (value) => String(value).padStart(2, '0');

//   return [
//     date.getFullYear(),
//     '-',
//     pad(date.getMonth() + 1),
//     '-',
//     pad(date.getDate()),
//     'T',
//     pad(date.getHours()),
//     ':',
//     pad(date.getMinutes()),
//   ].join('');
// };

// const normalizeEmployees = (items = []) =>
//   items
//     .map((item) => ({
//       name:
//         item?.operator?.name ||
//         item?.hse?.name ||
//         item?.employee?.name ||
//         item?.name ||
//         item?.operatorId ||
//         item?.hseId ||
//         item?.employeeId ||
//         item?.id ||
//         '',
//       value:
//         item?.operatorId ||
//         item?.hseId ||
//         item?.employeeId ||
//         item?.id ||
//         item?.value ||
//         '',
//     }))
//     .filter((item) => item.value);

// const normalizeConsumables = (items = []) =>
//   items
//     .map((item) => ({
//       name:
//         item?.consumable?.name ||
//         item?.name ||
//         item?.consumableId ||
//         item?.id ||
//         '',
//       value: item?.consumableId || item?.id || item?.value || '',
//     }))
//     .filter((item) => item.value);

// const getAttachments = (report = {}) => {
//   if (!Array.isArray(report?.attachments)) {
//     return [];
//   }

//   return report.attachments
//     .map((attachment) => ({
//       url: attachment?.url,
//       filename:
//         attachment?.filename ||
//         attachment?.name ||
//         attachment?.url?.split('/').pop() ||
//         'Pièce jointe',
//     }))
//     .filter((attachment) => attachment.url);
// };

// const WatchReportForm = ({
//   reportingCgId,
//   sourceReporting = null,
//   initialData = null,
//   onSuccess,
//   onCancel,
// }) => {
//   const {
//     register,
//     handleSubmit,
//     setValue,
//     reset,
//     formState: { errors },
//   } = useForm({
//     defaultValues: EMPTY_FORM_VALUES,
//   });

//   const { handleFetch, handlePost, handlePatch } = useFetch();

//   const isEditMode = Boolean(initialData?.id);

//   const [sites, setSites] = useState([]);
//   const [shifts, setShifts] = useState([]);
//   const [employees, setEmployees] = useState([]);
//   const [consumablesList, setConsumablesList] = useState([]);

//   const [operatorsList, setOperatorsList] = useState([]);
//   const [hsesList, setHsesList] = useState([]);
//   const [consumablesSelected, setConsumablesSelected] = useState([]);

//   const [extractionFileFile, setExtractionFileFile] = useState(null);
//   const [attachmentFiles, setAttachmentFiles] = useState([]);
//   const [existingAttachments, setExistingAttachments] = useState([]);
//   const [existingExtractionUrl, setExistingExtractionUrl] = useState(null);

//   const [isSiteLoading, setIsSiteLoading] = useState(true);
//   const [isShiftLoading, setIsShiftLoading] = useState(true);
//   const [isEmployeeLoading, setIsEmployeeLoading] = useState(true);
//   const [isConsumableLoading, setIsConsumableLoading] = useState(true);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   /*
//    * En édition : initialData est la source.
//    * En création : sourceReporting est la source.
//    */
//   const dataToPrefill = useMemo(() => {
//     return isEditMode ? initialData : sourceReporting;
//   }, [isEditMode, initialData, sourceReporting]);

//   const fetchSites = async (search = '') => {
//     setIsSiteLoading(true);

//     try {
//       let url = `${URLS.ENTITY_API}/sites?limit=100`;

//       if (search) {
//         url += `&search=${encodeURIComponent(search)}`;
//       }

//       const response = await handleFetch(url);
//       const dataArray = response?.data?.data || response?.data || [];

//       if (Array.isArray(dataArray)) {
//         setSites(
//           dataArray.map((site) => ({
//             name: site.name,
//             value: site.id,
//           }))
//         );
//       }
//     } catch (error) {
//       console.error('Erreur chargement des sites :', error);
//       toast.error('Impossible de charger les sites');
//     } finally {
//       setIsSiteLoading(false);
//     }
//   };

//   const fetchShifts = async (search = '') => {
//     setIsShiftLoading(true);

//     try {
//       let url = `${URLS.ENTITY_API}/shifts?limit=100`;

//       if (search) {
//         url += `&search=${encodeURIComponent(search)}`;
//       }

//       const response = await handleFetch(url);
//       const dataArray = response?.data?.data || response?.data || [];

//       if (Array.isArray(dataArray)) {
//         setShifts(
//           dataArray
//             .filter((shift) => shift.isActive !== false)
//             .map((shift) => ({
//               name: shift.name,
//               value: shift.id,
//             }))
//         );
//       }
//     } catch (error) {
//       console.error('Erreur chargement des quarts :', error);
//       toast.error('Impossible de charger les quarts');
//     } finally {
//       setIsShiftLoading(false);
//     }
//   };

//   const fetchEmployees = async (search = '') => {
//     setIsEmployeeLoading(true);

//     try {
//       let url = `${URLS.ENTITY_API}/employees?limit=100`;

//       if (search) {
//         url += `&search=${encodeURIComponent(search)}`;
//       }

//       const response = await handleFetch(url);
//       const dataArray = response?.data?.data || response?.data || [];

//       if (Array.isArray(dataArray)) {
//         setEmployees(
//           dataArray.map((employee) => ({
//             name: employee.name,
//             value: employee.id,
//           }))
//         );
//       }
//     } catch (error) {
//       console.error('Erreur chargement des employés :', error);
//       toast.error('Impossible de charger les employés');
//     } finally {
//       setIsEmployeeLoading(false);
//     }
//   };

//   const fetchConsumables = async (search = '') => {
//     setIsConsumableLoading(true);

//     try {
//       let url = `${URLS.INCIDENT_API}/consumables?limit=100`;

//       if (search) {
//         url += `&search=${encodeURIComponent(search)}`;
//       }

//       const response = await handleFetch(url);
//       const dataArray = response?.data?.data || response?.data || [];

//       if (Array.isArray(dataArray)) {
//         setConsumablesList(
//           dataArray.map((consumable) => ({
//             name: consumable.name,
//             value: consumable.id,
//           }))
//         );
//       }
//     } catch (error) {
//       console.error('Erreur chargement des consommables :', error);
//       toast.error('Impossible de charger les consommables');
//     } finally {
//       setIsConsumableLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchSites();
//     fetchShifts();
//     fetchEmployees();
//     fetchConsumables();

//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   /*
//    * Ce useEffect s'exécute :
//    * - quand le formulaire passe en création / édition ;
//    * - quand le reporting parent change ;
//    * - quand le Watch Report sélectionné change.
//    */
//   useEffect(() => {
//     const report = dataToPrefill;

//     if (!report) {
//       reset(EMPTY_FORM_VALUES);
//       setOperatorsList([]);
//       setHsesList([]);
//       setConsumablesSelected([]);
//       setExistingExtractionUrl(null);
//       setExistingAttachments([]);
//       setExtractionFileFile(null);
//       setAttachmentFiles([]);
//       return;
//     }

//     reset({
//       shiftId: report.shiftId || '',
//       siteId: report.siteId || '',
//       recipeCardNumber: report.recipeCardNumber || '',
//       completeNumberWeighingsToBeBilled:
//         report.completeNumberWeighingsToBeBilled ?? '',
//       completeNumberWeighingsBySpecies:
//         report.completeNumberWeighingsBySpecies ?? '',
//       incompleteNumberWeighingsToBeBilled:
//         report.incompleteNumberWeighingsToBeBilled ?? '',
//       incompleteNumberWeighingsBySpecies:
//         report.incompleteNumberWeighingsBySpecies ?? '',
//       testNumberWeighingsBySpecies:
//         report.testNumberWeighingsBySpecies ?? '',
//       offBridgeNumber: report.offBridgeNumber ?? '',
//       numberIncidents: report.numberIncidents ?? '',
//       incidentDescription: report.incidentDescription || '',
//       productionDescription: report.productionDescription || '',
//       incomingCgId: report.incomingCgId || '',
//       firstWeighNumber: report.firstWeighNumber || '',
//       lastWeighNumber: report.lastWeighNumber || '',
//       firstWeighTractorNumber: report.firstWeighTractorNumber || '',
//       lastWeighTractorNumber: report.lastWeighTractorNumber || '',
//       firstWeighDate: toDateTimeLocal(report.firstWeighDate),
//       lastWeighDate: toDateTimeLocal(report.lastWeighDate),
//     });

//     setOperatorsList(normalizeEmployees(report.operators));
//     setHsesList(normalizeEmployees(report.hses));

//     setConsumablesSelected(
//       normalizeConsumables(
//         report.outOfStockConsumableReportingCgs || report.consumables
//       )
//     );

//     setExistingExtractionUrl(report.extractionFileUrl || null);
//     setExistingAttachments(getAttachments(report));

//     setExtractionFileFile(null);
//     setAttachmentFiles([]);
//   }, [dataToPrefill, reset]);

//   const selectedSite = useMemo(() => {
//     const siteId = dataToPrefill?.siteId;
//     if (!siteId) return null;

//     return (
//       sites.find((site) => site.value === siteId) || {
//         value: siteId,
//         name: dataToPrefill?.site?.name || dataToPrefill?.siteName || siteId,
//       }
//     );
//   }, [dataToPrefill, sites]);

//   const selectedShift = useMemo(() => {
//     const shiftId = dataToPrefill?.shiftId;
//     if (!shiftId) return null;

//     return (
//       shifts.find((shift) => shift.value === shiftId) || {
//         value: shiftId,
//         name:
//           dataToPrefill?.shift?.name || dataToPrefill?.shiftName || shiftId,
//       }
//     );
//   }, [dataToPrefill, shifts]);

//   const selectedIncomingCg = useMemo(() => {
//     const incomingCgId = dataToPrefill?.incomingCgId;
//     if (!incomingCgId) return null;

//     return (
//       employees.find((employee) => employee.value === incomingCgId) || {
//         value: incomingCgId,
//         name:
//           dataToPrefill?.incomingCg?.name ||
//           dataToPrefill?.incomingCgName ||
//           incomingCgId,
//       }
//     );
//   }, [dataToPrefill, employees]);

//   const uploadFileToServer = async (file) => {
//     const formData = new FormData();
//     formData.append('files', file);

//     const token = localStorage.getItem('token');

//     const response = await fetch(`${URLS.INCIDENT_API}/files/upload`, {
//       method: 'POST',
//       headers: token
//         ? {
//             Authorization: `Bearer ${token}`,
//           }
//         : {},
//       body: formData,
//     });

//     if (!response.ok) {
//       const text = await response.text();

//       throw new Error(
//         `Upload échoué (${response.status}) : ${text.substring(0, 150)}`
//       );
//     }

//     const result = await response.json();

//     if (result?.success && Array.isArray(result?.data) && result.data.length) {
//       return {
//         url: result.data[0].url,
//         filename: result.data[0].filename,
//       };
//     }

//     throw new Error('Réponse invalide après upload du fichier');
//   };

//   const handleAddOperator = (employee) => {
//     if (!employee?.value) return;

//     setOperatorsList((previous) => {
//       if (previous.some((operator) => operator.value === employee.value)) {
//         return previous;
//       }

//       return [...previous, employee];
//     });
//   };

//   const removeOperator = (value) => {
//     setOperatorsList((previous) =>
//       previous.filter((operator) => operator.value !== value)
//     );
//   };

//   const handleAddHse = (employee) => {
//     if (!employee?.value) return;

//     setHsesList((previous) => {
//       if (previous.some((hse) => hse.value === employee.value)) {
//         return previous;
//       }

//       return [...previous, employee];
//     });
//   };

//   const removeHse = (value) => {
//     setHsesList((previous) =>
//       previous.filter((hse) => hse.value !== value)
//     );
//   };

//   const handleAddConsumable = (consumable) => {
//     if (!consumable?.value) return;

//     setConsumablesSelected((previous) => {
//       if (previous.some((item) => item.value === consumable.value)) {
//         return previous;
//       }

//       return [...previous, consumable];
//     });
//   };

//   const removeConsumable = (value) => {
//     setConsumablesSelected((previous) =>
//       previous.filter((consumable) => consumable.value !== value)
//     );
//   };

//   const handleExtractionFileChange = (event) => {
//     const file = event.target.files?.[0];

//     if (!file) return;

//     setExtractionFileFile(file);
//     setExistingExtractionUrl(null);

//     event.target.value = '';
//   };

//   const removeExtractionFile = () => {
//     setExtractionFileFile(null);
//     setExistingExtractionUrl(null);
//   };

//   const handleAttachmentChange = (event) => {
//     const files = Array.from(event.target.files || []);

//     if (!files.length) return;

//     setAttachmentFiles((previous) => [...previous, ...files]);
//     event.target.value = '';
//   };

//   const removeAttachmentFile = (index) => {
//     setAttachmentFiles((previous) =>
//       previous.filter((_, itemIndex) => itemIndex !== index)
//     );
//   };

//   const removeExistingAttachment = (index) => {
//     setExistingAttachments((previous) =>
//       previous.filter((_, itemIndex) => itemIndex !== index)
//     );
//   };

//   const resetForm = () => {
//     reset(EMPTY_FORM_VALUES);
//     setOperatorsList([]);
//     setHsesList([]);
//     setConsumablesSelected([]);
//     setExtractionFileFile(null);
//     setAttachmentFiles([]);
//     setExistingAttachments([]);
//     setExistingExtractionUrl(null);
//   };

//   const onSubmit = async (data) => {
//     if (!data.siteId) {
//       toast.error('Le site est obligatoire');
//       return;
//     }

//     if (!data.shiftId) {
//       toast.error('Le quart est obligatoire');
//       return;
//     }

//     if (!data.incomingCgId) {
//       toast.error('Le CG entrant est obligatoire');
//       return;
//     }

//     if (!data.recipeCardNumber?.trim()) {
//       toast.error('Le numéro de fiche recette est obligatoire');
//       return;
//     }

//     if (operatorsList.length === 0) {
//       toast.error('Veuillez ajouter au moins un opérateur');
//       return;
//     }

//     if (hsesList.length === 0) {
//       toast.error('Veuillez ajouter au moins un HSE');
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       let extractionFileUrl = existingExtractionUrl;

//       if (extractionFileFile) {
//         const uploadedFile = await uploadFileToServer(extractionFileFile);
//         extractionFileUrl = uploadedFile.url;
//       }

//       const attachments = [...existingAttachments];

//       for (const file of attachmentFiles) {
//         const uploadedFile = await uploadFileToServer(file);

//         attachments.push({
//           url: uploadedFile.url,
//           filename: uploadedFile.filename,
//         });
//       }

//       const payload = {
//         reportingCgId,
//         shiftId: data.shiftId,
//         siteId: data.siteId,
//         recipeCardNumber: data.recipeCardNumber.trim(),

//         operators: operatorsList.map((operator) => operator.value),
//         hses: hsesList.map((hse) => hse.value),
//         consumables: consumablesSelected.map((consumable) => consumable.value),

//         completeNumberWeighingsToBeBilled:
//           Number.parseInt(data.completeNumberWeighingsToBeBilled, 10) || 0,

//         completeNumberWeighingsBySpecies:
//           Number.parseInt(data.completeNumberWeighingsBySpecies, 10) || 0,

//         incompleteNumberWeighingsToBeBilled:
//           Number.parseInt(data.incompleteNumberWeighingsToBeBilled, 10) || 0,

//         incompleteNumberWeighingsBySpecies:
//           Number.parseInt(data.incompleteNumberWeighingsBySpecies, 10) || 0,

//         testNumberWeighingsBySpecies:
//           Number.parseInt(data.testNumberWeighingsBySpecies, 10) || 0,

//         offBridgeNumber: Number.parseInt(data.offBridgeNumber, 10) || 0,

//         numberIncidents: Number.parseInt(data.numberIncidents, 10) || 0,

//         incidentDescription: data.incidentDescription?.trim() || '',
//         productionDescription: data.productionDescription?.trim() || '',
//         incomingCgId: data.incomingCgId,

//         extractionFileUrl: extractionFileUrl || null,
//         attachments,

//         firstWeighNumber: data.firstWeighNumber?.trim() || null,
//         lastWeighNumber: data.lastWeighNumber?.trim() || null,
//         firstWeighTractorNumber:
//           data.firstWeighTractorNumber?.trim() || null,
//         lastWeighTractorNumber:
//           data.lastWeighTractorNumber?.trim() || null,

//         firstWeighDate: data.firstWeighDate
//           ? new Date(data.firstWeighDate).toISOString()
//           : null,

//         lastWeighDate: data.lastWeighDate
//           ? new Date(data.lastWeighDate).toISOString()
//           : null,
//       };

//       const response = isEditMode
//         ? await handlePatch(
//             `${URLS.INCIDENT_API}/watch-reports/${initialData.id}`,
//             payload
//           )
//         : await handlePost(`${URLS.INCIDENT_API}/watch-reports`, payload);

//       if (response?.error) {
//         const errorsList = response?.error_list || [];

//         if (errorsList.length > 0) {
//           errorsList.forEach((error) => {
//             toast.error(error?.msg || 'Erreur de validation');
//           });
//         } else {
//           toast.error(response?.message || 'Erreur lors de l’enregistrement');
//         }

//         return;
//       }

//       toast.success(
//         isEditMode
//           ? 'Watch Report modifié avec succès'
//           : 'Watch Report créé avec succès'
//       );

//       resetForm();

//       if (typeof onSuccess === 'function') {
//         await onSuccess(response?.data);
//       }
//     } catch (error) {
//       console.error('Erreur enregistrement Watch Report :', error);
//       toast.error(error?.message || 'Erreur lors de l’enregistrement');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <form
//       onSubmit={handleSubmit(onSubmit)}
//       className="space-y-5 max-h-[70vh] overflow-y-auto p-4"
//     >
//       <div className="rounded-lg border border-blue-100 bg-blue-50 p-3 text-sm text-blue-800">
//         <p className="font-semibold">
//           {isEditMode
//             ? 'Modification du Watch Report'
//             : 'Création du Watch Report'}
//         </p>

//         {!isEditMode && sourceReporting && (
//           <p className="mt-1 text-xs">
//             Les informations ci-dessous sont préremplies depuis le rapport CG
//             sélectionné. Vous pouvez les ajuster avant l’enregistrement.
//           </p>
//         )}
//       </div>

//       <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//         <div>
//           <label className="text-sm font-medium">
//             Pesées complètes à facturer
//           </label>
//           <input
//             type="number"
//             min="0"
//             {...register('completeNumberWeighingsToBeBilled')}
//             className="w-full rounded border p-2"
//           />
//         </div>

//         <div>
//           <label className="text-sm font-medium">
//             Pesées complètes espèce
//           </label>
//           <input
//             type="number"
//             min="0"
//             {...register('completeNumberWeighingsBySpecies')}
//             className="w-full rounded border p-2"
//           />
//         </div>

//         <div>
//           <label className="text-sm font-medium">
//             Pesées incomplètes à facturer
//           </label>
//           <input
//             type="number"
//             min="0"
//             {...register('incompleteNumberWeighingsToBeBilled')}
//             className="w-full rounded border p-2"
//           />
//         </div>

//         <div>
//           <label className="text-sm font-medium">
//             Pesées incomplètes en espèce
//           </label>
//           <input
//             type="number"
//             min="0"
//             {...register('incompleteNumberWeighingsBySpecies')}
//             className="w-full rounded border p-2"
//           />
//         </div>

//         <div>
//           <label className="text-sm font-medium">
//             Pesées test en espèce
//           </label>
//           <input
//             type="number"
//             min="0"
//             {...register('testNumberWeighingsBySpecies')}
//             className="w-full rounded border p-2"
//           />
//         </div>

//         <div>
//           <label className="text-sm font-medium">Hors-pont (nombre)</label>
//           <input
//             type="number"
//             min="0"
//             {...register('offBridgeNumber')}
//             className="w-full rounded border p-2"
//           />
//         </div>
//       </div>

//       <div>
//         <label className="mb-1 block text-sm font-medium">
//           Site <span className="text-red-500">*</span>
//         </label>

//         <AutoComplete
//           placeholder="Rechercher un site"
//           isLoading={isSiteLoading}
//           dataList={sites}
//           onSearch={fetchSites}
//           onSelect={(item) => setValue('siteId', item?.value || '')}
//           initialValue={selectedSite}
//         />
//       </div>

//       <div>
//         <label className="mb-1 block text-sm font-medium">
//           Quart <span className="text-red-500">*</span>
//         </label>

//         <AutoComplete
//           placeholder="Rechercher un quart"
//           isLoading={isShiftLoading}
//           dataList={shifts}
//           onSearch={fetchShifts}
//           onSelect={(item) => setValue('shiftId', item?.value || '')}
//           initialValue={selectedShift}
//         />
//       </div>

//       <div>
//         <label className="mb-1 block text-sm font-medium">
//           Opérateurs <span className="text-red-500">*</span>
//         </label>

//         <AutoComplete
//           placeholder="Ajouter un opérateur"
//           isLoading={isEmployeeLoading}
//           dataList={employees}
//           onSearch={fetchEmployees}
//           onSelect={handleAddOperator}
//         />

//         <div className="mt-2 flex flex-wrap gap-2">
//           {operatorsList.map((operator) => (
//             <span
//               key={operator.value}
//               className="flex items-center gap-1 rounded bg-blue-100 px-2 py-1 text-sm text-blue-800"
//             >
//               {operator.name}
//               <button
//                 type="button"
//                 onClick={() => removeOperator(operator.value)}
//                 className="text-blue-700 hover:text-red-600"
//                 aria-label={`Retirer ${operator.name}`}
//               >
//                 <X size={14} />
//               </button>
//             </span>
//           ))}
//         </div>
//       </div>

//       <div>
//         <label className="mb-1 block text-sm font-medium">
//           HSE <span className="text-red-500">*</span>
//         </label>

//         <AutoComplete
//           placeholder="Ajouter un HSE"
//           isLoading={isEmployeeLoading}
//           dataList={employees}
//           onSearch={fetchEmployees}
//           onSelect={handleAddHse}
//         />

//         <div className="mt-2 flex flex-wrap gap-2">
//           {hsesList.map((hse) => (
//             <span
//               key={hse.value}
//               className="flex items-center gap-1 rounded bg-green-100 px-2 py-1 text-sm text-green-800"
//             >
//               {hse.name}
//               <button
//                 type="button"
//                 onClick={() => removeHse(hse.value)}
//                 className="text-green-700 hover:text-red-600"
//                 aria-label={`Retirer ${hse.name}`}
//               >
//                 <X size={14} />
//               </button>
//             </span>
//           ))}
//         </div>
//       </div>

//       <div>
//         <label className="mb-1 block text-sm font-medium">
//           Consommables en rupture
//         </label>

//         <AutoComplete
//           placeholder="Ajouter un consommable"
//           isLoading={isConsumableLoading}
//           dataList={consumablesList}
//           onSearch={fetchConsumables}
//           onSelect={handleAddConsumable}
//         />

//         <div className="mt-2 flex flex-wrap gap-2">
//           {consumablesSelected.map((consumable) => (
//             <span
//               key={consumable.value}
//               className="flex items-center gap-1 rounded bg-amber-100 px-2 py-1 text-sm text-amber-800"
//             >
//               {consumable.name}
//               <button
//                 type="button"
//                 onClick={() => removeConsumable(consumable.value)}
//                 className="text-amber-700 hover:text-red-600"
//                 aria-label={`Retirer ${consumable.name}`}
//               >
//                 <X size={14} />
//               </button>
//             </span>
//           ))}
//         </div>
//       </div>

//       <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//         <div>
//           <label className="text-sm font-medium">Date première pesée</label>
//           <input
//             type="datetime-local"
//             {...register('firstWeighDate')}
//             className="w-full rounded border p-2"
//           />
//         </div>

//         <div>
//           <label className="text-sm font-medium">Date dernière pesée</label>
//           <input
//             type="datetime-local"
//             {...register('lastWeighDate')}
//             className="w-full rounded border p-2"
//           />
//         </div>
//       </div>

//       <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//         <div>
//           <label className="text-sm font-medium">Premier n° pesée</label>
//           <input
//             type="text"
//             {...register('firstWeighNumber')}
//             className="w-full rounded border p-2"
//           />
//         </div>

//         <div>
//           <label className="text-sm font-medium">Dernier n° pesée</label>
//           <input
//             type="text"
//             {...register('lastWeighNumber')}
//             className="w-full rounded border p-2"
//           />
//         </div>

//         <div>
//           <label className="text-sm font-medium">Premier n° tracteur</label>
//           <input
//             type="text"
//             {...register('firstWeighTractorNumber')}
//             className="w-full rounded border p-2"
//           />
//         </div>

//         <div>
//           <label className="text-sm font-medium">Dernier n° tracteur</label>
//           <input
//             type="text"
//             {...register('lastWeighTractorNumber')}
//             className="w-full rounded border p-2"
//           />
//         </div>
//       </div>

//       <div>
//         <label className="text-sm font-medium">
//           Description de la production
//         </label>
//         <textarea
//           {...register('productionDescription')}
//           rows="3"
//           className="w-full rounded border p-2"
//         />
//       </div>

//       <div>
//         <label className="text-sm font-medium">Nombre d’incidents</label>
//         <input
//           type="number"
//           min="0"
//           {...register('numberIncidents')}
//           className="w-full rounded border p-2"
//         />
//       </div>

//       <div>
//         <label className="text-sm font-medium">
//           Description des incidents
//         </label>
//         <textarea
//           {...register('incidentDescription')}
//           rows="3"
//           className="w-full rounded border p-2"
//         />
//       </div>

//       <div>
//         <label className="text-sm font-medium">Fichier d’extraction PW</label>

//         <input
//           type="file"
//           onChange={handleExtractionFileChange}
//           accept=".xlsx,.xls,.csv,.pdf,.jpg,.jpeg,.png"
//           className="mt-1 block w-full text-sm"
//         />

//         {extractionFileFile && (
//           <div className="mt-2 flex items-center gap-2">
//             <span className="text-xs text-gray-700">
//               Nouveau fichier : {extractionFileFile.name}
//             </span>

//             <button
//               type="button"
//               onClick={removeExtractionFile}
//               className="text-red-500 hover:text-red-700"
//               title="Retirer le fichier"
//             >
//               <X size={15} />
//             </button>
//           </div>
//         )}

//         {!extractionFileFile && existingExtractionUrl && (
//           <div className="mt-2 flex items-center gap-2">
//             <a
//               href={existingExtractionUrl}
//               target="_blank"
//               rel="noreferrer"
//               className="text-xs text-blue-600 underline"
//             >
//               Voir le fichier actuel
//             </a>

//             <button
//               type="button"
//               onClick={removeExtractionFile}
//               className="text-red-500 hover:text-red-700"
//               title="Supprimer le fichier actuel"
//             >
//               <Trash2 size={15} />
//             </button>
//           </div>
//         )}
//       </div>

//       <div>
//         <label className="text-sm font-medium">Pièces jointes</label>

//         <input
//           type="file"
//           multiple
//           onChange={handleAttachmentChange}
//           className="mt-1 block w-full text-sm"
//         />

//         <div className="mt-2 space-y-2">
//           {attachmentFiles.map((file, index) => (
//             <div
//               key={`${file.name}-${index}`}
//               className="flex items-center justify-between rounded bg-gray-100 p-2"
//             >
//               <span className="truncate text-sm">{file.name}</span>

//               <button
//                 type="button"
//                 onClick={() => removeAttachmentFile(index)}
//                 className="text-red-500 hover:text-red-700"
//                 title="Supprimer le fichier"
//               >
//                 <Trash2 size={16} />
//               </button>
//             </div>
//           ))}

//           {existingAttachments.map((attachment, index) => (
//             <div
//               key={`${attachment.url}-${index}`}
//               className="flex items-center justify-between rounded bg-blue-50 p-2"
//             >
//               <a
//                 href={attachment.url}
//                 target="_blank"
//                 rel="noreferrer"
//                 className="truncate text-sm text-blue-600 underline"
//               >
//                 {attachment.filename}
//               </a>

//               <button
//                 type="button"
//                 onClick={() => removeExistingAttachment(index)}
//                 className="text-red-500 hover:text-red-700"
//                 title="Supprimer la pièce jointe"
//               >
//                 <Trash2 size={16} />
//               </button>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div>
//         <label className="mb-1 block text-sm font-medium">
//           CG entrant <span className="text-red-500">*</span>
//         </label>

//         <AutoComplete
//           placeholder="Rechercher un employé"
//           isLoading={isEmployeeLoading}
//           dataList={employees}
//           onSearch={fetchEmployees}
//           onSelect={(item) => setValue('incomingCgId', item?.value || '')}
//           initialValue={selectedIncomingCg}
//         />
//       </div>

//       <div>
//         <label className="mb-1 block text-sm font-medium">
//           N° fiche recette <span className="text-red-500">*</span>
//         </label>

//         <input
//           type="text"
//           {...register('recipeCardNumber', {
//             required: 'Le numéro de fiche recette est requis',
//           })}
//           className="w-full rounded border p-2"
//           placeholder="Ex. F2025-001"
//         />

//         {errors.recipeCardNumber && (
//           <p className="mt-1 text-xs text-red-500">
//             {errors.recipeCardNumber.message}
//           </p>
//         )}
//       </div>

//       <div className="flex justify-end gap-2 border-t pt-4">
//         <Button
//           type="button"
//           variant="outline"
//           onClick={onCancel}
//           disabled={isSubmitting}
//         >
//           Annuler
//         </Button>

//         <Button
//           type="submit"
//           disabled={isSubmitting}
//           className="bg-primary text-white"
//         >
//           {isSubmitting ? (
//             <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//           ) : (
//             <CheckCircle size={18} className="mr-2" />
//           )}

//           {isSubmitting
//             ? 'Enregistrement...'
//             : isEditMode
//               ? 'Modifier'
//               : 'Créer'}
//         </Button>
//       </div>
//     </form>
//   );
// };

// export default WatchReportForm;

import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useFetch } from '../../../hooks/useFetch';
import AutoComplete from '../../common/AutoComplete';
import { Button } from '../../ui/button';
import { CheckCircle, X, Trash2, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { URLS } from '../../../../configUrl';

const EMPTY_FORM_VALUES = {
  shiftId: '',
  siteId: '',
  recipeCardNumber: '',
  completeNumberWeighingsToBeBilled: '',
  completeNumberWeighingsBySpecies: '',
  incompleteNumberWeighingsToBeBilled: '',
  incompleteNumberWeighingsBySpecies: '',
  testNumberWeighingsBySpecies: '',
  // ✅ NOUVEAU : champ obligatoire, oublié précédemment
  numberPrepaidWeighDefinitivelyCompleted: '',
  offBridgeNumber: '',
  numberIncidents: '',
  incidentDescription: '',
  productionDescription: '',
  incomingCgId: '',
  firstWeighNumber: '',
  lastWeighNumber: '',
  firstWeighTractorNumber: '',
  lastWeighTractorNumber: '',
  firstWeighDate: '',
  lastWeighDate: '',
  // ✅ NOUVEAU : commentaire support client, valeur par défaut "RAS"
  customerSupportComment: 'RAS',
};

const toDateTimeLocal = (dateValue) => {
  if (!dateValue) return '';

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const pad = (value) => String(value).padStart(2, '0');

  return [
    date.getFullYear(),
    '-',
    pad(date.getMonth() + 1),
    '-',
    pad(date.getDate()),
    'T',
    pad(date.getHours()),
    ':',
    pad(date.getMinutes()),
  ].join('');
};

const normalizeEmployees = (items = []) =>
  items
    .map((item) => ({
      name:
        item?.operator?.name ||
        item?.hse?.name ||
        item?.employee?.name ||
        item?.name ||
        item?.operatorId ||
        item?.hseId ||
        item?.employeeId ||
        item?.id ||
        '',
      value:
        item?.operatorId ||
        item?.hseId ||
        item?.employeeId ||
        item?.id ||
        item?.value ||
        '',
    }))
    .filter((item) => item.value);

const normalizeConsumables = (items = []) =>
  items
    .map((item) => ({
      name:
        item?.consumable?.name ||
        item?.name ||
        item?.consumableId ||
        item?.id ||
        '',
      value: item?.consumableId || item?.id || item?.value || '',
    }))
    .filter((item) => item.value);

const getAttachments = (report = {}) => {
  if (!Array.isArray(report?.attachments)) {
    return [];
  }

  return report.attachments
    .map((attachment) => ({
      url: attachment?.url,
      filename:
        attachment?.filename ||
        attachment?.name ||
        attachment?.url?.split('/').pop() ||
        'Pièce jointe',
    }))
    .filter((attachment) => attachment.url);
};

const WatchReportForm = ({
  reportingCgId,
  sourceReporting = null,
  initialData = null,
  onSuccess,
  onCancel,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: EMPTY_FORM_VALUES,
  });

  const { handleFetch, handlePost, handlePatch } = useFetch();

  const isEditMode = Boolean(initialData?.id);

  const [sites, setSites] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [consumablesList, setConsumablesList] = useState([]);

  const [operatorsList, setOperatorsList] = useState([]);
  const [hsesList, setHsesList] = useState([]);
  const [consumablesSelected, setConsumablesSelected] = useState([]);

  // ✅ NOUVEAU : superviseur du poste de garde, hérité de reportingCg.createdBy
  const [guardhouseSupervisorId, setGuardhouseSupervisorId] = useState('');

  const [extractionFileFile, setExtractionFileFile] = useState(null);
  const [attachmentFiles, setAttachmentFiles] = useState([]);
  const [existingAttachments, setExistingAttachments] = useState([]);
  const [existingExtractionUrl, setExistingExtractionUrl] = useState(null);

  const [isSiteLoading, setIsSiteLoading] = useState(true);
  const [isShiftLoading, setIsShiftLoading] = useState(true);
  const [isEmployeeLoading, setIsEmployeeLoading] = useState(true);
  const [isConsumableLoading, setIsConsumableLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /*
   * En édition : initialData est la source.
   * En création : sourceReporting est la source.
   */
  const dataToPrefill = useMemo(() => {
    return isEditMode ? initialData : sourceReporting;
  }, [isEditMode, initialData, sourceReporting]);

  // ✅ Fonction de résolution de nom, identique dans l'esprit à celle de ReportingCgDetails :
  // elle cherche l'ID dans le tableau `employees` (source de vérité) au moment du rendu.
  const getEmployeeName = useCallback(
    (id) => employees.find((employee) => employee.value === id)?.name || id || '-',
    [employees]
  );

  const fetchSites = async (search = '') => {
    setIsSiteLoading(true);

    try {
      let url = `${URLS.ENTITY_API}/sites?limit=100`;

      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }

      const response = await handleFetch(url);
      const dataArray = response?.data?.data || response?.data || [];

      if (Array.isArray(dataArray)) {
        setSites(
          dataArray.map((site) => ({
            name: site.name,
            value: site.id,
          }))
        );
      }
    } catch (error) {
      console.error('Erreur chargement des sites :', error);
      toast.error('Impossible de charger les sites');
    } finally {
      setIsSiteLoading(false);
    }
  };

  const fetchShifts = async (search = '') => {
    setIsShiftLoading(true);

    try {
      let url = `${URLS.ENTITY_API}/shifts?limit=100`;

      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }

      const response = await handleFetch(url);
      const dataArray = response?.data?.data || response?.data || [];

      if (Array.isArray(dataArray)) {
        setShifts(
          dataArray
            .filter((shift) => shift.isActive !== false)
            .map((shift) => ({
              name: shift.name,
              value: shift.id,
            }))
        );
      }
    } catch (error) {
      console.error('Erreur chargement des quarts :', error);
      toast.error('Impossible de charger les quarts');
    } finally {
      setIsShiftLoading(false);
    }
  };

  const fetchEmployees = async (search = '') => {
    setIsEmployeeLoading(true);

    try {
      let url = `${URLS.ENTITY_API}/employees?limit=100`;

      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }

      const response = await handleFetch(url);
      const dataArray = response?.data?.data || response?.data || [];

      if (Array.isArray(dataArray)) {
        setEmployees(
          dataArray.map((employee) => ({
            name: employee.name,
            value: employee.id,
          }))
        );
      }
    } catch (error) {
      console.error('Erreur chargement des employés :', error);
      toast.error('Impossible de charger les employés');
    } finally {
      setIsEmployeeLoading(false);
    }
  };

  const fetchConsumables = async (search = '') => {
    setIsConsumableLoading(true);

    try {
      let url = `${URLS.INCIDENT_API}/consumables?limit=100`;

      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }

      const response = await handleFetch(url);
      const dataArray = response?.data?.data || response?.data || [];

      if (Array.isArray(dataArray)) {
        setConsumablesList(
          dataArray.map((consumable) => ({
            name: consumable.name,
            value: consumable.id,
          }))
        );
      }
    } catch (error) {
      console.error('Erreur chargement des consommables :', error);
      toast.error('Impossible de charger les consommables');
    } finally {
      setIsConsumableLoading(false);
    }
  };

  useEffect(() => {
    fetchSites();
    fetchShifts();
    fetchEmployees();
    fetchConsumables();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /*
   * Ce useEffect s'exécute :
   * - quand le formulaire passe en création / édition ;
   * - quand le reporting parent change ;
   * - quand le Watch Report sélectionné change.
   */
  useEffect(() => {
    const report = dataToPrefill;

    if (!report) {
      reset(EMPTY_FORM_VALUES);
      setOperatorsList([]);
      setHsesList([]);
      setConsumablesSelected([]);
      setExistingExtractionUrl(null);
      setExistingAttachments([]);
      setExtractionFileFile(null);
      setAttachmentFiles([]);
      setGuardhouseSupervisorId('');
      return;
    }

    reset({
      shiftId: report.shiftId || '',
      siteId: report.siteId || '',
      recipeCardNumber: report.recipeCardNumber || '',
      completeNumberWeighingsToBeBilled:
        report.completeNumberWeighingsToBeBilled ?? '',
      completeNumberWeighingsBySpecies:
        report.completeNumberWeighingsBySpecies ?? '',
      incompleteNumberWeighingsToBeBilled:
        report.incompleteNumberWeighingsToBeBilled ?? '',
      incompleteNumberWeighingsBySpecies:
        report.incompleteNumberWeighingsBySpecies ?? '',
      testNumberWeighingsBySpecies:
        report.testNumberWeighingsBySpecies ?? '',
      numberPrepaidWeighDefinitivelyCompleted:
        report.numberPrepaidWeighDefinitivelyCompleted ?? '',
      offBridgeNumber: report.offBridgeNumber ?? '',
      numberIncidents: report.numberIncidents ?? '',
      incidentDescription: report.incidentDescription || '',
      productionDescription: report.productionDescription || '',
      incomingCgId: report.incomingCgId || '',
      firstWeighNumber: report.firstWeighNumber || '',
      lastWeighNumber: report.lastWeighNumber || '',
      firstWeighTractorNumber: report.firstWeighTractorNumber || '',
      lastWeighTractorNumber: report.lastWeighTractorNumber || '',
      firstWeighDate: toDateTimeLocal(report.firstWeighDate),
      lastWeighDate: toDateTimeLocal(report.lastWeighDate),
      // ✅ En édition : garde la valeur existante si présente.
      // En création : "RAS" par défaut.
      customerSupportComment: report.customerSupportComment ?? '',
    });

    setOperatorsList(normalizeEmployees(report.operators));
    setHsesList(normalizeEmployees(report.hses));

    setConsumablesSelected(
      normalizeConsumables(
        report.outOfStockConsumableReportingCgs || report.consumables
      )
    );

    setExistingExtractionUrl(report.extractionFileUrl || null);
    setExistingAttachments(getAttachments(report));

    setExtractionFileFile(null);
    setAttachmentFiles([]);

    // ✅ NOUVEAU : guardhouseSupervisorId
    // En édition, on garde celui déjà enregistré sur le Watch Report s'il existe,
    // sinon (et toujours en création) on hérite de reportingCg.createdBy.
    setGuardhouseSupervisorId(
      report.guardhouseSupervisorId || report.createdBy || ''
    );
  }, [dataToPrefill, reset]);

  /*
   * ✅ CORRECTIF affichage des noms :
   * Les listes operators/hses/consommables sont normalisées dès que
   * `dataToPrefill` change, mais à ce moment-là `employees`/`consumablesList`
   * peuvent ne pas encore être chargés (fetch encore en cours), ou le back-end
   * peut ne pas avoir inclus la relation imbriquée (operator.name / hse.name).
   * On recalcule donc les noms dès que les référentiels arrivent ou changent,
   * exactement comme `selectedIncomingCg` le fait déjà via son useMemo.
   */
  useEffect(() => {
    if (!employees.length) return;

    setOperatorsList((previous) =>
      previous.map((operator) => {
        const match = employees.find(
          (employee) => employee.value === operator.value
        );
        return match ? { ...operator, name: match.name } : operator;
      })
    );

    setHsesList((previous) =>
      previous.map((hse) => {
        const match = employees.find(
          (employee) => employee.value === hse.value
        );
        return match ? { ...hse, name: match.name } : hse;
      })
    );
  }, [employees]);

  useEffect(() => {
    if (!consumablesList.length) return;

    setConsumablesSelected((previous) =>
      previous.map((consumable) => {
        const match = consumablesList.find(
          (item) => item.value === consumable.value
        );
        return match ? { ...consumable, name: match.name } : consumable;
      })
    );
  }, [consumablesList]);

  const selectedSite = useMemo(() => {
    const siteId = dataToPrefill?.siteId;
    if (!siteId) return null;

    return (
      sites.find((site) => site.value === siteId) || {
        value: siteId,
        name: dataToPrefill?.site?.name || dataToPrefill?.siteName || siteId,
      }
    );
  }, [dataToPrefill, sites]);

  const selectedShift = useMemo(() => {
    const shiftId = dataToPrefill?.shiftId;
    if (!shiftId) return null;

    return (
      shifts.find((shift) => shift.value === shiftId) || {
        value: shiftId,
        name:
          dataToPrefill?.shift?.name || dataToPrefill?.shiftName || shiftId,
      }
    );
  }, [dataToPrefill, shifts]);

  const selectedIncomingCg = useMemo(() => {
    const incomingCgId = dataToPrefill?.incomingCgId;
    if (!incomingCgId) return null;

    return (
      employees.find((employee) => employee.value === incomingCgId) || {
        value: incomingCgId,
        name:
          dataToPrefill?.incomingCg?.name ||
          dataToPrefill?.incomingCgName ||
          incomingCgId,
      }
    );
  }, [dataToPrefill, employees]);

  const uploadFileToServer = async (file) => {
    const formData = new FormData();
    formData.append('files', file);

    const token = localStorage.getItem('token');

    const response = await fetch(`${URLS.INCIDENT_API}/files/upload`, {
      method: 'POST',
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {},
      body: formData,
    });

    if (!response.ok) {
      const text = await response.text();

      throw new Error(
        `Upload échoué (${response.status}) : ${text.substring(0, 150)}`
      );
    }

    const result = await response.json();

    if (result?.success && Array.isArray(result?.data) && result.data.length) {
      return {
        url: result.data[0].url,
        filename: result.data[0].filename,
      };
    }

    throw new Error('Réponse invalide après upload du fichier');
  };

  const handleAddOperator = (employee) => {
    if (!employee?.value) return;

    setOperatorsList((previous) => {
      if (previous.some((operator) => operator.value === employee.value)) {
        return previous;
      }

      return [...previous, employee];
    });
  };

  const removeOperator = (value) => {
    setOperatorsList((previous) =>
      previous.filter((operator) => operator.value !== value)
    );
  };

  const handleAddHse = (employee) => {
    if (!employee?.value) return;

    setHsesList((previous) => {
      if (previous.some((hse) => hse.value === employee.value)) {
        return previous;
      }

      return [...previous, employee];
    });
  };

  const removeHse = (value) => {
    setHsesList((previous) =>
      previous.filter((hse) => hse.value !== value)
    );
  };

  const handleAddConsumable = (consumable) => {
    if (!consumable?.value) return;

    setConsumablesSelected((previous) => {
      if (previous.some((item) => item.value === consumable.value)) {
        return previous;
      }

      return [...previous, consumable];
    });
  };

  const removeConsumable = (value) => {
    setConsumablesSelected((previous) =>
      previous.filter((consumable) => consumable.value !== value)
    );
  };

  const handleExtractionFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setExtractionFileFile(file);
    setExistingExtractionUrl(null);

    event.target.value = '';
  };

  const removeExtractionFile = () => {
    setExtractionFileFile(null);
    setExistingExtractionUrl(null);
  };

  const handleAttachmentChange = (event) => {
    const files = Array.from(event.target.files || []);

    if (!files.length) return;

    setAttachmentFiles((previous) => [...previous, ...files]);
    event.target.value = '';
  };

  const removeAttachmentFile = (index) => {
    setAttachmentFiles((previous) =>
      previous.filter((_, itemIndex) => itemIndex !== index)
    );
  };

  const removeExistingAttachment = (index) => {
    setExistingAttachments((previous) =>
      previous.filter((_, itemIndex) => itemIndex !== index)
    );
  };

  const resetForm = () => {
    reset(EMPTY_FORM_VALUES);
    setOperatorsList([]);
    setHsesList([]);
    setConsumablesSelected([]);
    setExtractionFileFile(null);
    setAttachmentFiles([]);
    setExistingAttachments([]);
    setExistingExtractionUrl(null);
    setGuardhouseSupervisorId('');
  };

  const onSubmit = async (data) => {
    if (!data.siteId) {
      toast.error('Le site est obligatoire');
      return;
    }

    if (!data.shiftId) {
      toast.error('Le quart est obligatoire');
      return;
    }

    if (!data.incomingCgId) {
      toast.error('Le CG entrant est obligatoire');
      return;
    }

    if (!data.recipeCardNumber?.trim()) {
      toast.error('Le numéro de fiche recette est obligatoire');
      return;
    }

    if (operatorsList.length === 0) {
      toast.error('Veuillez ajouter au moins un opérateur');
      return;
    }

    if (hsesList.length === 0) {
      toast.error('Veuillez ajouter au moins un HSE');
      return;
    }

    if (
      data.numberPrepaidWeighDefinitivelyCompleted === '' ||
      data.numberPrepaidWeighDefinitivelyCompleted === undefined
    ) {
      toast.error(
        'Le nombre de pesées prépayées définitivement réalisées est obligatoire'
      );
      return;
    }

    if (!guardhouseSupervisorId) {
      toast.error('Le superviseur du poste de garde est introuvable');
      return;
    }

    setIsSubmitting(true);

    try {
      let extractionFileUrl = existingExtractionUrl;

      if (extractionFileFile) {
        const uploadedFile = await uploadFileToServer(extractionFileFile);
        extractionFileUrl = uploadedFile.url;
      }

      const attachments = [...existingAttachments];

      for (const file of attachmentFiles) {
        const uploadedFile = await uploadFileToServer(file);

        attachments.push({
          url: uploadedFile.url,
          filename: uploadedFile.filename,
        });
      }

      const payload = {
        // ✅ reportingCgId = data.ID (l'ID du reportingCg parent, passé en prop)
        reportingCgId,
        // ✅ NOUVEAU
        guardhouseSupervisorId,
        customerSupportComment: data.customerSupportComment?.trim() || 'RAS',

        shiftId: data.shiftId,
        siteId: data.siteId,
        recipeCardNumber: data.recipeCardNumber.trim(),

        operators: operatorsList.map((operator) => operator.value),
        hses: hsesList.map((hse) => hse.value),
        consumables: consumablesSelected.map((consumable) => consumable.value),

        completeNumberWeighingsToBeBilled:
          Number.parseInt(data.completeNumberWeighingsToBeBilled, 10) || 0,

        completeNumberWeighingsBySpecies:
          Number.parseInt(data.completeNumberWeighingsBySpecies, 10) || 0,

        incompleteNumberWeighingsToBeBilled:
          Number.parseInt(data.incompleteNumberWeighingsToBeBilled, 10) || 0,

        incompleteNumberWeighingsBySpecies:
          Number.parseInt(data.incompleteNumberWeighingsBySpecies, 10) || 0,

        testNumberWeighingsBySpecies:
          Number.parseInt(data.testNumberWeighingsBySpecies, 10) || 0,

        numberPrepaidWeighDefinitivelyCompleted:
          Number.parseInt(data.numberPrepaidWeighDefinitivelyCompleted, 10) ||
          0,

        offBridgeNumber: Number.parseInt(data.offBridgeNumber, 10) || 0,

        numberIncidents: Number.parseInt(data.numberIncidents, 10) || 0,

        incidentDescription: data.incidentDescription?.trim() || '',
        productionDescription: data.productionDescription?.trim() || '',
        incomingCgId: data.incomingCgId,

        extractionFileUrl: extractionFileUrl || null,
        attachments,

        firstWeighNumber: data.firstWeighNumber?.trim() || null,
        lastWeighNumber: data.lastWeighNumber?.trim() || null,
        firstWeighTractorNumber:
          data.firstWeighTractorNumber?.trim() || null,
        lastWeighTractorNumber:
          data.lastWeighTractorNumber?.trim() || null,

        firstWeighDate: data.firstWeighDate
          ? new Date(data.firstWeighDate).toISOString()
          : null,

        lastWeighDate: data.lastWeighDate
          ? new Date(data.lastWeighDate).toISOString()
          : null,
      };

      const response = isEditMode
        ? await handlePatch(
            `${URLS.INCIDENT_API}/watch-reports/${initialData.id}`,
            payload
          )
        : await handlePost(`${URLS.INCIDENT_API}/watch-reports`, payload);

      if (response?.error) {
        const errorsList = response?.error_list || [];

        if (errorsList.length > 0) {
          errorsList.forEach((error) => {
            toast.error(error?.msg || 'Erreur de validation');
          });
        } else {
          toast.error(response?.message || 'Erreur lors de l’enregistrement');
        }

        return;
      }

      toast.success(
        isEditMode
          ? 'Watch Report modifié avec succès'
          : 'Watch Report créé avec succès'
      );

      resetForm();

      if (typeof onSuccess === 'function') {
        await onSuccess(response?.data);
      }
    } catch (error) {
      console.error('Erreur enregistrement Watch Report :', error);
      toast.error(error?.message || 'Erreur lors de l’enregistrement');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5 max-h-[70vh] overflow-y-auto p-4"
    >
      <div className="rounded-lg border border-blue-100 bg-blue-50 p-3 text-sm text-blue-800">
        <p className="font-semibold">
          {isEditMode
            ? 'Modification du Watch Report'
            : 'Création du Watch Report'}
        </p>

        {!isEditMode && sourceReporting && (
          <p className="mt-1 text-xs">
            Les informations ci-dessous sont préremplies depuis le rapport CG
            sélectionné. Vous pouvez les ajuster avant l’enregistrement.
          </p>
        )}
      </div>

      {/* ✅ NOUVEAU : Superviseur du poste de garde (lecture seule, hérité de reportingCg) */}
      <div>
        <label className="mb-1 block text-sm font-medium">
          Superviseur du poste de garde
        </label>

        <input
          type="text"
          readOnly
          disabled
          value={getEmployeeName(guardhouseSupervisorId)}
          className="w-full rounded border bg-gray-100 p-2 text-gray-700 cursor-not-allowed"
        />

        <p className="mt-1 text-xs text-gray-500">
          Hérité automatiquement du créateur du rapport CG.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium">
            Pesées complètes à facturer
          </label>
          <input
            type="number"
            min="0"
            {...register('completeNumberWeighingsToBeBilled')}
            className="w-full rounded border p-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium">
            Pesées complètes espèce
          </label>
          <input
            type="number"
            min="0"
            {...register('completeNumberWeighingsBySpecies')}
            className="w-full rounded border p-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium">
            Pesées incomplètes à facturer
          </label>
          <input
            type="number"
            min="0"
            {...register('incompleteNumberWeighingsToBeBilled')}
            className="w-full rounded border p-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium">
            Pesées incomplètes en espèce
          </label>
          <input
            type="number"
            min="0"
            {...register('incompleteNumberWeighingsBySpecies')}
            className="w-full rounded border p-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium">
            Pesées test en espèce
          </label>
          <input
            type="number"
            min="0"
            {...register('testNumberWeighingsBySpecies')}
            className="w-full rounded border p-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Hors-pont (nombre)</label>
          <input
            type="number"
            min="0"
            {...register('offBridgeNumber')}
            className="w-full rounded border p-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium">
            Pesées prépayées effectuées définitivement{' '}
            <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min="0"
            {...register('numberPrepaidWeighDefinitivelyCompleted', {
              required: 'Ce champ est obligatoire',
              min: { value: 0, message: 'Doit être un entier positif ou nul' },
            })}
            className="w-full rounded border p-2"
          />
          {errors.numberPrepaidWeighDefinitivelyCompleted && (
            <p className="mt-1 text-xs text-red-500">
              {errors.numberPrepaidWeighDefinitivelyCompleted.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Site <span className="text-red-500">*</span>
        </label>

        <AutoComplete
          placeholder="Rechercher un site"
          isLoading={isSiteLoading}
          dataList={sites}
          onSearch={fetchSites}
          onSelect={(item) => setValue('siteId', item?.value || '')}
          initialValue={selectedSite}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Quart <span className="text-red-500">*</span>
        </label>

        <AutoComplete
          placeholder="Rechercher un quart"
          isLoading={isShiftLoading}
          dataList={shifts}
          onSearch={fetchShifts}
          onSelect={(item) => setValue('shiftId', item?.value || '')}
          initialValue={selectedShift}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Opérateurs <span className="text-red-500">*</span>
        </label>

        <AutoComplete
          placeholder="Ajouter un opérateur"
          isLoading={isEmployeeLoading}
          dataList={employees}
          onSearch={fetchEmployees}
          onSelect={handleAddOperator}
        />

        <div className="mt-2 flex flex-wrap gap-2">
          {operatorsList.map((operator) => (
            <span
              key={operator.value}
              className="flex items-center gap-1 rounded bg-blue-100 px-2 py-1 text-sm text-blue-800"
            >
              {operator.name}
              <button
                type="button"
                onClick={() => removeOperator(operator.value)}
                className="text-blue-700 hover:text-red-600"
                aria-label={`Retirer ${operator.name}`}
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          HSE <span className="text-red-500">*</span>
        </label>

        <AutoComplete
          placeholder="Ajouter un HSE"
          isLoading={isEmployeeLoading}
          dataList={employees}
          onSearch={fetchEmployees}
          onSelect={handleAddHse}
        />

        <div className="mt-2 flex flex-wrap gap-2">
          {hsesList.map((hse) => (
            <span
              key={hse.value}
              className="flex items-center gap-1 rounded bg-green-100 px-2 py-1 text-sm text-green-800"
            >
              {hse.name}
              <button
                type="button"
                onClick={() => removeHse(hse.value)}
                className="text-green-700 hover:text-red-600"
                aria-label={`Retirer ${hse.name}`}
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Consommables en rupture
        </label>

        <AutoComplete
          placeholder="Ajouter un consommable"
          isLoading={isConsumableLoading}
          dataList={consumablesList}
          onSearch={fetchConsumables}
          onSelect={handleAddConsumable}
        />

        <div className="mt-2 flex flex-wrap gap-2">
          {consumablesSelected.map((consumable) => (
            <span
              key={consumable.value}
              className="flex items-center gap-1 rounded bg-amber-100 px-2 py-1 text-sm text-amber-800"
            >
              {consumable.name}
              <button
                type="button"
                onClick={() => removeConsumable(consumable.value)}
                className="text-amber-700 hover:text-red-600"
                aria-label={`Retirer ${consumable.name}`}
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium">Date première pesée</label>
          <input
            type="datetime-local"
            {...register('firstWeighDate')}
            className="w-full rounded border p-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Date dernière pesée</label>
          <input
            type="datetime-local"
            {...register('lastWeighDate')}
            className="w-full rounded border p-2"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium">Premier n° pesée</label>
          <input
            type="text"
            {...register('firstWeighNumber')}
            className="w-full rounded border p-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Dernier n° pesée</label>
          <input
            type="text"
            {...register('lastWeighNumber')}
            className="w-full rounded border p-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Premier n° tracteur</label>
          <input
            type="text"
            {...register('firstWeighTractorNumber')}
            className="w-full rounded border p-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Dernier n° tracteur</label>
          <input
            type="text"
            {...register('lastWeighTractorNumber')}
            className="w-full rounded border p-2"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">
          Description de la production
        </label>
        <textarea
          {...register('productionDescription')}
          rows="3"
          className="w-full rounded border p-2"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Nombre d’incidents</label>
        <input
          type="number"
          min="0"
          {...register('numberIncidents')}
          className="w-full rounded border p-2"
        />
      </div>

      <div>
        <label className="text-sm font-medium">
          Description des incidents
        </label>
        <textarea
          {...register('incidentDescription')}
          rows="3"
          className="w-full rounded border p-2"
        />
      </div>


      <div>
        <label className="text-sm font-medium">Fichier d’extraction PW</label>

        <input
          type="file"
          onChange={handleExtractionFileChange}
          accept=".xlsx,.xls,.csv,.pdf,.jpg,.jpeg,.png"
          className="mt-1 block w-full text-sm"
        />

        {extractionFileFile && (
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs text-gray-700">
              Nouveau fichier : {extractionFileFile.name}
            </span>

            <button
              type="button"
              onClick={removeExtractionFile}
              className="text-red-500 hover:text-red-700"
              title="Retirer le fichier"
            >
              <X size={15} />
            </button>
          </div>
        )}

        {!extractionFileFile && existingExtractionUrl && (
          <div className="mt-2 flex items-center gap-2">
            <a
              href={existingExtractionUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-blue-600 underline"
            >
              Voir le fichier actuel
            </a>

            <button
              type="button"
              onClick={removeExtractionFile}
              className="text-red-500 hover:text-red-700"
              title="Supprimer le fichier actuel"
            >
              <Trash2 size={15} />
            </button>
          </div>
        )}
      </div>

      <div>
        <label className="text-sm font-medium">Pièces jointes</label>

        <input
          type="file"
          multiple
          onChange={handleAttachmentChange}
          className="mt-1 block w-full text-sm"
        />

        <div className="mt-2 space-y-2">
          {attachmentFiles.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center justify-between rounded bg-gray-100 p-2"
            >
              <span className="truncate text-sm">{file.name}</span>

              <button
                type="button"
                onClick={() => removeAttachmentFile(index)}
                className="text-red-500 hover:text-red-700"
                title="Supprimer le fichier"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}

          {existingAttachments.map((attachment, index) => (
            <div
              key={`${attachment.url}-${index}`}
              className="flex items-center justify-between rounded bg-blue-50 p-2"
            >
              <a
                href={attachment.url}
                target="_blank"
                rel="noreferrer"
                className="truncate text-sm text-blue-600 underline"
              >
                {attachment.filename}
              </a>

              <button
                type="button"
                onClick={() => removeExistingAttachment(index)}
                className="text-red-500 hover:text-red-700"
                title="Supprimer la pièce jointe"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          CG entrant <span className="text-red-500">*</span>
        </label>

        <AutoComplete
          placeholder="Rechercher un employé"
          isLoading={isEmployeeLoading}
          dataList={employees}
          onSearch={fetchEmployees}
          onSelect={(item) => setValue('incomingCgId', item?.value || '')}
          initialValue={selectedIncomingCg}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          N° fiche recette <span className="text-red-500">*</span>
        </label>

        <input
          type="text"
          {...register('recipeCardNumber', {
            required: 'Le numéro de fiche recette est requis',
          })}
          className="w-full rounded border p-2"
          placeholder="Ex. F2025-001"
        />

        {errors.recipeCardNumber && (
          <p className="mt-1 text-xs text-red-500">
            {errors.recipeCardNumber.message}
          </p>
        )}
      </div>

      {/* ✅ NOUVEAU : Commentaire support client */}
      <div>
        <label className="text-sm font-medium">
          Commentaire support client
        </label>
        <textarea
          {...register('customerSupportComment')}
          rows="2"
          className="w-full rounded border p-2"
          placeholder="RAS"
        />
      </div>

      <div className="flex justify-end gap-2 border-t pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Annuler
        </Button>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-primary text-white"
        >
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <CheckCircle size={18} className="mr-2" />
          )}

          {isSubmitting
            ? 'Enregistrement...'
            : isEditMode
              ? 'Modifier'
              : 'Créer'}
        </Button>
      </div>
    </form>
  );
};

export default WatchReportForm;