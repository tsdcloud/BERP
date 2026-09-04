// import React, { useCallback, useEffect, useMemo, useState } from 'react';
// import { useFetch } from '../../../hooks/useFetch';
// import WatchReportForm from '../WatchReport/WatchReportForm';
// import { URLS } from '../../../../configUrl';
// import toast from 'react-hot-toast';
// import {
//   Drawer,
//   DrawerClose,
//   DrawerContent,
//   DrawerDescription,
//   DrawerFooter,
//   DrawerHeader,
//   DrawerTitle,
// } from '../../ui/drawer';
// import {
//   X,
//   FileText,
//   Users,
//   AlertTriangle,
//   Calendar,
//   Printer,
//   FileSpreadsheet,
//   Image as ImageIcon,
//   Paperclip,
//   Weight,
//   ChevronDown,
//   ChevronUp,
//   FileCheck,
//   Package,
//   User,
//   ShieldCheck,
//   MessageSquare,
//   Download,
//   Eye,
// } from 'lucide-react';
// import SecureImage from '../../ui/SecureImage';

// // ✅ Permissions dédiées au Rapport de Quart (Watch Report)
// const WATCH_REPORT_CREATE_PERMISSION = 'incident__create_watch_report';
// const WATCH_REPORT_EDIT_PERMISSION = 'incident__edit_watch_report';

// const ReportingCgDetails = ({
//   open = false,
//   setOpen,
//   reporting = null,
//   references = {},
//   type = 'cg',
//   embedded = false,
//   userPermissions = [],
//   currentUserRoles = [],
// }) => {
//   const { handleFetch } = useFetch();

//   const isWatchReport = type === 'watch';

//   const sites = Array.isArray(references?.sites) ? references.sites : [];
//   const shifts = Array.isArray(references?.shifts) ? references.shifts : [];
//   const employees = Array.isArray(references?.employees)
//     ? references.employees
//     : [];

//   const [expandedSections, setExpandedSections] = useState({
//     weighing: true,
//     amounts: true,
//     incidents: true,
//     operators: false,
//     hse: false,
//     consumables: false,
//   });

//   /*
//    * ✅ Le watchReport lié est désormais inclus directement dans le
//    * reportingCg chargé (relation `watchReport` du service backend).
//    * Plus besoin d'un appel réseau séparé vers /watch-reports?reportingCgId=...
//    * On garde un état local pour pouvoir le rafraîchir après une
//    * création/modification réussie sans recharger toute la liste.
//    */
//   const [watchReportData, setWatchReportData] = useState(
//     type === 'cg' ? reporting?.watchReport ?? null : null
//   );
//   const [watchDrawerOpen, setWatchDrawerOpen] = useState(false);
//   const [watchDrawerMode, setWatchDrawerMode] = useState(null);
//   const [isRefreshingWatchReport, setIsRefreshingWatchReport] = useState(false);

//   // ✅ drawer de consultation/impression du Watch Report existant
//   const [watchViewOpen, setWatchViewOpen] = useState(false);

//   useEffect(() => {
//     setWatchReportData(type === 'cg' ? reporting?.watchReport ?? null : null);
//   }, [reporting, type]);

//   const getSiteName = useCallback(
//     (id) => sites.find((site) => site.id === id)?.name || id || '-',
//     [sites]
//   );

//   const getShiftName = useCallback(
//     (id) => shifts.find((shift) => shift.id === id)?.name || id || '-',
//     [shifts]
//   );

//   const getEmployeeName = useCallback(
//     (id) => employees.find((employee) => employee.id === id)?.name || id || '-',
//     [employees]
//   );

//   const formatDate = useCallback((date) => {
//     if (!date) return '-';

//     const parsedDate = new Date(date);

//     if (Number.isNaN(parsedDate.getTime())) {
//       return '-';
//     }

//     return parsedDate.toLocaleString('fr-FR');
//   }, []);

//   const formatDateShort = useCallback((date) => {
//     if (!date) return '-';

//     const parsedDate = new Date(date);

//     if (Number.isNaN(parsedDate.getTime())) {
//       return '-';
//     }

//     return parsedDate.toLocaleDateString('fr-FR');
//   }, []);

//   const formatNumber = useCallback((value, decimals = 0) => {
//     const number = Number(value);

//     if (!Number.isFinite(number)) {
//       return decimals > 0 ? (0).toFixed(decimals).replace('.', ',') : '0';
//     }

//     return new Intl.NumberFormat('fr-FR', {
//       minimumFractionDigits: decimals,
//       maximumFractionDigits: decimals,
//     }).format(number);
//   }, []);

//   const numberValue = useCallback((value) => {
//     const number = Number(value);
//     return Number.isFinite(number) ? number : 0;
//   }, []);

//   /*
//    * ✅ Rafraîchit uniquement le watchReport lié en re-fetchant le
//    * reportingCg par son id (qui inclut désormais watchReport côté service).
//    * Utilisé après une création/modification réussie du Rapport de Quart.
//    */
//   const refreshWatchReport = useCallback(async () => {
//     if (!reporting?.id || type !== 'cg') return;

//     setIsRefreshingWatchReport(true);

//     try {
//       const response = await handleFetch(
//         `${URLS.INCIDENT_API}/reporting-cgs/${reporting.id}`
//       );

//       const payload = response?.data;
//       const freshReportingCg = payload?.data ?? payload ?? null;

//       setWatchReportData(freshReportingCg?.watchReport ?? null);
//     } catch (error) {
//       console.error('Erreur de rafraîchissement du rapport de quart :', error);
//     } finally {
//       setIsRefreshingWatchReport(false);
//     }
//   }, [handleFetch, reporting?.id, type]);

//   useEffect(() => {
//     if (!open) {
//       setWatchDrawerOpen(false);
//       setWatchDrawerMode(null);
//       setWatchViewOpen(false);
//     }
//   }, [open]);

//   const toggleSection = useCallback((section) => {
//     setExpandedSections((previous) => ({
//       ...previous,
//       [section]: !previous[section],
//     }));
//   }, []);

//   const handleWatchAction = useCallback((mode) => {
//     setWatchDrawerMode(mode);
//     setWatchDrawerOpen(true);
//   }, []);

//   const handleWatchDrawerChange = useCallback((isOpen) => {
//     setWatchDrawerOpen(isOpen);

//     if (!isOpen) {
//       setWatchDrawerMode(null);
//     }
//   }, []);

//   const handleWatchSuccess = useCallback(async () => {
//     await refreshWatchReport();
//     setWatchDrawerOpen(false);
//     setWatchDrawerMode(null);
//   }, [refreshWatchReport]);

//   const getFileIcon = useCallback((filename) => {
//     if (!filename) {
//       return <FileText size={16} />;
//     }

//     const extension = filename.split('.').pop()?.toLowerCase();

//     if (['xlsx', 'xls', 'csv'].includes(extension)) {
//       return <FileSpreadsheet size={16} className="text-green-600" />;
//     }

//     if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
//       return <ImageIcon size={16} className="text-purple-600" />;
//     }

//     if (extension === 'pdf') {
//       return <FileText size={16} className="text-red-600" />;
//     }

//     return <Paperclip size={16} className="text-gray-600" />;
//   }, []);

//   const isImage = useCallback((filenameOrUrl) => {
//     if (!filenameOrUrl) return false;

//     const filename = filenameOrUrl.split('?')[0].split('/').pop();
//     const extension = filename?.split('.').pop()?.toLowerCase();

//     return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension);
//   }, []);

//   const handleSecureDownload = useCallback(async (url, filename) => {
//     if (!url) {
//       toast.error('Aucun fichier disponible');
//       return;
//     }

//     try {
//       const token = localStorage.getItem('token');

//       if (!token) {
//         toast.error('Session expirée. Veuillez vous reconnecter.');
//         return;
//       }

//       const response = await fetch(url, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (!response.ok) {
//         throw new Error('Le téléchargement du fichier a échoué');
//       }

//       const blob = await response.blob();
//       const blobUrl = window.URL.createObjectURL(blob);
//       const anchor = document.createElement('a');

//       anchor.href = blobUrl;
//       anchor.download = filename || 'fichier';
//       document.body.appendChild(anchor);
//       anchor.click();
//       document.body.removeChild(anchor);

//       window.setTimeout(() => {
//         window.URL.revokeObjectURL(blobUrl);
//       }, 1000);
//     } catch (error) {
//       console.error('Erreur de téléchargement :', error);
//       toast.error('Impossible de télécharger le fichier');
//     }
//   }, []);

//   const handleSecureView = useCallback(async (url) => {
//     if (!url) {
//       toast.error('Aucun fichier disponible');
//       return;
//     }

//     try {
//       const token = localStorage.getItem('token');

//       if (!token) {
//         toast.error('Session expirée. Veuillez vous reconnecter.');
//         return;
//       }

//       const response = await fetch(url, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (!response.ok) {
//         throw new Error("L'ouverture du fichier a échoué");
//       }

//       const blob = await response.blob();
//       const blobUrl = window.URL.createObjectURL(blob);

//       window.open(blobUrl, '_blank', 'noopener,noreferrer');

//       window.setTimeout(() => {
//         window.URL.revokeObjectURL(blobUrl);
//       }, 60000);
//     } catch (error) {
//       console.error("Erreur d'ouverture du fichier :", error);
//       toast.error("Impossible d'ouvrir le fichier");
//     }
//   }, []);

//   /*
//    * ✅ L'endpoint d'impression bascule déjà correctement entre
//    * /watch-reports/:id/pdf et /reporting-cgs/:id/pdf selon `type`.
//    * Rien à changer ici : ça fonctionne pour les deux.
//    */
//   const handlePrintPdf = useCallback(async () => {
//     if (!reporting?.id) {
//       toast.error('Aucun rapport sélectionné');
//       return;
//     }

//     try {
//       const endpoint = type === 'watch' ? 'watch-reports' : 'reporting-cgs';
//       const token = localStorage.getItem('token');

//       const response = await fetch(
//         `${URLS.INCIDENT_API}/${endpoint}/${reporting.id}/pdf`,
//         {
//           headers: token
//             ? {
//                 Authorization: `Bearer ${token}`,
//               }
//             : {},
//         }
//       );

//       if (!response.ok) {
//         throw new Error('La génération du PDF a échoué');
//       }

//       const blob = await response.blob();
//       const blobUrl = window.URL.createObjectURL(blob);

//       window.open(blobUrl, '_blank', 'noopener,noreferrer');

//       window.setTimeout(() => {
//         window.URL.revokeObjectURL(blobUrl);
//       }, 60000);
//     } catch (error) {
//       console.error('Erreur PDF :', error);
//       toast.error('Impossible de générer le PDF');
//     }
//   }, [reporting?.id, type]);

//   const closeMainDrawer = useCallback(
//     (isOpen) => {
//       if (typeof setOpen === 'function') {
//         setOpen(isOpen);
//       }
//     },
//     [setOpen]
//   );

//   // ✅ Droits d'accès aux actions Rapport de Quart
//   // - Création : rôle ADMIN OU permission incident__create_watch_report
//   // - Modification : rôle ADMIN OU permission incident__edit_watch_report
//   const hasRole = useCallback(
//     (role) => Array.isArray(currentUserRoles) && currentUserRoles.includes(role),
//     [currentUserRoles]
//   );

//   const hasPermission = useCallback(
//     (permission) =>
//       Array.isArray(userPermissions) && userPermissions.includes(permission),
//     [userPermissions]
//   );

//   const canCreateWatchReport = useMemo(
//     () => hasRole('ADMIN') || hasPermission(WATCH_REPORT_CREATE_PERMISSION),
//     [hasRole, hasPermission]
//   );

//   const canEditWatchReport = useMemo(
//     () => hasRole('ADMIN') || hasPermission(WATCH_REPORT_EDIT_PERMISSION),
//     [hasRole, hasPermission]
//   );

//   // ✅ Règle demandée :
//   // - "Créer Rapport de Quart" : visible si watchReport N'EXISTE PAS,
//   //   et si l'utilisateur a le droit de créer.
//   // - "Modifier Rapport de Quart" : visible si watchReport EXISTE,
//   //   et si l'utilisateur a le droit de modifier.
//   // - "Voir / Imprimer le Rapport de Quart" : visible si watchReport EXISTE
//   //   (simple consultation, non soumise à une permission spécifique).
//   const showCreateWatchReportButton =
//     type === 'cg' && !watchReportData && canCreateWatchReport;

//   const showEditWatchReportButton =
//     type === 'cg' && Boolean(watchReportData) && canEditWatchReport;

//   const showViewWatchReportButton =
//     type === 'cg' && Boolean(watchReportData);

//   /*
//    * Protection essentielle :
//    * le composant peut être rendu avant la sélection d'une ligne.
//    * Aucun accès à reporting.xxx ne se produit dans ce cas.
//    */
//   if (!reporting) {
//     return null;
//   }

//   const operators = Array.isArray(reporting.operators)
//     ? reporting.operators
//     : [];

//   const hses = Array.isArray(reporting.hses) ? reporting.hses : [];

//   const consumables = Array.isArray(
//     reporting.outOfStockConsumableReportingCgs
//   )
//     ? reporting.outOfStockConsumableReportingCgs
//     : [];

//   const attachments = Array.isArray(reporting.attachments)
//     ? reporting.attachments
//     : [];

//   const completeToBeBilled = numberValue(
//     reporting.completeNumberWeighingsToBeBilled
//   );

//   const completeBySpecies = numberValue(
//     reporting.completeNumberWeighingsBySpecies
//   );

//   const incompleteToBeBilled = numberValue(
//     reporting.incompleteNumberWeighingsToBeBilled
//   );

//   const incompleteBySpecies = numberValue(
//     reporting.incompleteNumberWeighingsBySpecies
//   );

//   const testsBySpecies = numberValue(
//     reporting.testNumberWeighingsBySpecies
//   );

//   const numberPrepaidWeighDefinitivelyCompleted = numberValue(
//     reporting.numberPrepaidWeighDefinitivelyCompleted
//   );

//   const offBridgeNumber = numberValue(reporting.offBridgeNumber);

//   const totalWeightAmount = numberValue(reporting.totalWeightAmount);
//   const totalTestWeightAmount = numberValue(reporting.totalTestWeightAmount);
//   const totalOffBridgeAmount = numberValue(reporting.totalOffBridgeAmount);
//   const numberIncidents = numberValue(reporting.numberIncidents);

//   const totalWeighingsBySpecies =
//     completeBySpecies +
//     incompleteBySpecies +
//     testsBySpecies;

//   const totalRevenue =
//     totalWeightAmount +
//     totalTestWeightAmount +
//     totalOffBridgeAmount;

//   const billedWeighingsTotal =
//     completeToBeBilled +
//     numberPrepaidWeighDefinitivelyCompleted +
//     incompleteToBeBilled;

//   const speciesWeighingsTotal =
//     completeBySpecies +
//     incompleteBySpecies +
//     testsBySpecies +
//     offBridgeNumber;

//   const allWeighingsTotal =
//     billedWeighingsTotal +
//     speciesWeighingsTotal;

//   const content = (
//     <div className="print-content mx-4 md:mx-8 overflow-y-auto max-h-[75vh] print:mx-0 print:max-h-none pb-4 space-y-3">
//       <div className="hidden print:block p-header">
//         <h1>
//           {type === 'watch'
//             ? 'RAPPORT DE QUART'
//             : 'RAPPORT DE PESÉE CG'}
//         </h1>

//         <div className="p-header-meta">
//           <span>
//             <strong>Ref :</strong> {reporting.numRef || '-'}
//           </span>
//           <span>
//             <strong>Site :</strong> {getSiteName(reporting.siteId)}
//           </span>
//           <span>
//             <strong>Quart :</strong> {getShiftName(reporting.shiftId)}
//           </span>
//           <span>
//             <strong>Date :</strong> {formatDateShort(reporting.createdAt)}
//           </span>
//         </div>
//       </div>

//       <section className="bg-white border rounded-xl p-4 shadow-sm print:p-section print:p-mb-1 print-compact print-break-inside">
//         <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2 border-b pb-2 print:p-section-title">
//           <FileText size={16} className="text-blue-600" />
//           Informations générales
//         </h2>

//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm print:p-info-grid">
//           <div className="flex items-center gap-2 print:p-info-item">
//             <span className="text-gray-600 print:p-info-label">
//               Référence :
//             </span>
//             <span className="font-semibold print:p-info-value">
//               {reporting.numRef || '-'}
//             </span>
//           </div>

//           <div className="flex items-center gap-2 print:p-info-item">
//             <span className="text-gray-600 print:p-info-label">Site :</span>
//             <span className="font-semibold print:p-info-value">
//               {getSiteName(reporting.siteId)}
//             </span>
//           </div>

//           <div className="flex items-center gap-2 print:p-info-item">
//             <span className="text-gray-600 print:p-info-label">Quart :</span>
//             <span className="font-semibold print:p-info-value">
//               {getShiftName(reporting.shiftId)}
//             </span>
//           </div>

//           <div className="flex items-center gap-2 print:p-info-item">
//             <span className="text-gray-600 print:p-info-label">
//               Créé par :
//             </span>
//             <span className="font-semibold print:p-info-value">
//               {getEmployeeName(reporting.createdBy)}
//             </span>
//           </div>

//           <div className="flex items-center gap-2 print:p-info-item">
//             <span className="text-gray-600 print:p-info-label">Date :</span>
//             <span className="font-semibold print:p-info-value">
//               {formatDate(reporting.createdAt)}
//             </span>
//           </div>

//           <div className="flex items-center gap-2 print:p-info-item">
//             <span className="text-gray-600 print:p-info-label">
//               N° recette :
//             </span>
//             <span className="font-semibold print:p-info-value">
//               {reporting.recipeCardNumber || '-'}
//             </span>
//           </div>

//           {/* ✅ champ exclusif au Watch Report */}
//           {isWatchReport && (
//             <div className="flex items-center gap-2 print:p-info-item">
//               <span className="text-gray-600 print:p-info-label">
//                 Chef de guérite en poste :
//               </span>
//               <span className="font-semibold print:p-info-value">
//                 {getEmployeeName(reporting.guardhouseSupervisorId)}
//               </span>
//             </div>
//           )}
//           {/* ✅ champ exclusif au Watch Report */}
//           {isWatchReport && reporting?.reportingCg && (
//             <>
//               <div className="flex items-center gap-2 print:p-info-item">
//                 <span className="text-gray-600 print:p-info-label">
//                   N°Référence RCG :
//                 </span>
//                 <span className="font-semibold print:p-info-value">
//                   {reporting.reportingCg.numRef ?? "—"}
//                 </span>
//               </div>

//               <div className="flex items-center gap-2 print:p-info-item">
//                 <span className="text-gray-600 print:p-info-label">
//                   RCG créé le :
//                 </span>
//                 <span className="font-semibold print:p-info-value">
//                   {reporting.reportingCg.createdAt
//                     ? formatDate(reporting.reportingCg.createdAt)
//                     : "—"}
//                 </span>
//               </div>
//             </>
//           )}
//         </div>
//       </section>

//       <section className="bg-white border rounded-xl p-4 shadow-sm print:p-section print:p-mb-1 print-compact print-break-inside">
//         <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2 border-b pb-2 print:p-section-title">
//           <Calendar size={16} className="text-teal-600" />
//           Suivi des pesées
//         </h2>

//         <div className="overflow-x-auto">
//           <table className="w-full min-w-[620px] table-fixed text-sm print:p-table print-table">
//             <colgroup>
//               <col className="w-[32%]" />
//               <col className="w-[22%]" />
//               <col className="w-[23%]" />
//               <col className="w-[23%]" />
//             </colgroup>

//             <thead>
//               <tr>
//                 <th className="bg-gray-50 px-3 py-2 text-left align-middle" />
//                 <th className="bg-gray-50 px-3 py-2 text-center align-middle">
//                   DATE
//                 </th>
//                 <th className="bg-gray-50 px-3 py-2 text-center align-middle">
//                   N° PESÉE
//                 </th>
//                 <th className="bg-gray-50 px-3 py-2 text-center align-middle">
//                   N° TRACTEUR
//                 </th>
//               </tr>
//             </thead>

//             <tbody>
//               <tr>
//                 <td className="px-3 py-2 font-semibold align-middle">
//                   PREMIÈRE PESÉE
//                 </td>
//                 <td className="px-3 py-2 text-center align-middle whitespace-nowrap">
//                   {formatDateShort(reporting.firstWeighDate)}
//                 </td>
//                 <td className="px-3 py-2 text-center align-middle">
//                   {reporting.firstWeighNumber || '-'}
//                 </td>
//                 <td className="px-3 py-2 text-center align-middle">
//                   {reporting.firstWeighTractorNumber || '-'}
//                 </td>
//               </tr>

//               <tr>
//                 <td className="px-3 py-2 font-semibold align-middle">
//                   DERNIÈRE PESÉE
//                 </td>
//                 <td className="px-3 py-2 text-center align-middle whitespace-nowrap">
//                   {formatDateShort(reporting.lastWeighDate)}
//                 </td>
//                 <td className="px-3 py-2 text-center align-middle">
//                   {reporting.lastWeighNumber || '-'}
//                 </td>
//                 <td className="px-3 py-2 text-center align-middle">
//                   {reporting.lastWeighTractorNumber || '-'}
//                 </td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       </section>

//       <section className="bg-white border rounded-xl p-4 shadow-sm print:p-section print:p-mb-1 print-compact print-break-inside">
//         <button
//           type="button"
//           onClick={() => toggleSection('weighing')}
//           className="w-full flex items-center justify-between text-left no-print"
//         >
//           <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
//             <Weight size={16} className="text-indigo-600" />
//             Récapitulatif des pesées

//             <span className="ml-2 px-2 py-0.5 bg-indigo-100 text-indigo-800 text-xs font-bold rounded-full">
//               Espèces : {formatNumber(totalWeighingsBySpecies)}
//             </span>
//           </h2>

//           {expandedSections.weighing ? (
//             <ChevronUp size={16} />
//           ) : (
//             <ChevronDown size={16} />
//           )}
//         </button>

//         <div
//           className={`mt-3 ${
//             expandedSections.weighing ? 'block' : 'hidden'
//           } print:!block`}
//         >
//           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mb-3 print:p-stats">
//             <div className="bg-green-50 border border-green-200 rounded-lg p-2 text-center print:p-stat">
//               <p className="text-lg font-bold text-green-700 print:p-stat-value">
//                 {formatNumber(completeToBeBilled)}
//               </p>
//               <p className="text-[10px] text-green-600 print:p-stat-label">
//                 Compl. facturer
//               </p>
//             </div>

//             <div className="bg-green-50 border border-green-200 rounded-lg p-2 text-center print:p-stat">
//               <p className="text-lg font-bold text-green-700 print:p-stat-value">
//                 {formatNumber(completeBySpecies)}
//               </p>
//               <p className="text-[10px] text-green-600 print:p-stat-label">
//                 Compl. espèce
//               </p>
//             </div>

//             <div className="bg-orange-50 border border-orange-200 rounded-lg p-2 text-center print:p-stat">
//               <p className="text-lg font-bold text-orange-700 print:p-stat-value">
//                 {formatNumber(incompleteToBeBilled)}
//               </p>
//               <p className="text-[10px] text-orange-600 print:p-stat-label">
//                 Incompl. facturer
//               </p>
//             </div>

//             <div className="bg-orange-50 border border-orange-200 rounded-lg p-2 text-center print:p-stat">
//               <p className="text-lg font-bold text-orange-700 print:p-stat-value">
//                 {formatNumber(incompleteBySpecies)}
//               </p>
//               <p className="text-[10px] text-orange-600 print:p-stat-label">
//                 Incompl. espèce
//               </p>
//             </div>

//             <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 text-center print:p-stat">
//               <p className="text-lg font-bold text-blue-700 print:p-stat-value">
//                 {formatNumber(testsBySpecies)}
//               </p>
//               <p className="text-[10px] text-blue-600 print:p-stat-label">
//                 Tests espèce
//               </p>
//             </div>

//             <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 text-center print:p-stat">
//               <p className="text-lg font-bold text-gray-700 print:p-stat-value">
//                 {formatNumber(offBridgeNumber)}
//               </p>
//               <p className="text-[10px] text-gray-600 print:p-stat-label">
//                 Hors-pont
//               </p>
//             </div>
//           </div>

//           <div className="overflow-x-auto">
//             <table className="w-full min-w-[620px] text-sm print:p-table">
//               <thead>
//                 <tr>
//                   <th>Type de pesée</th>
//                   <th className="p-num">À facturer</th>
//                   <th className="p-left">Par espèce</th>
//                   <th className="p-right">Total</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 <tr>
//                   <td className="font-medium">Pesées complètes</td>
//                   <td className="p-num text-green-700">
//                     {formatNumber(completeToBeBilled)}
//                   </td>
//                   <td className="p-num">
//                     {formatNumber(completeBySpecies)}
//                   </td>
//                   <td className="p-right">
//                     {formatNumber(completeToBeBilled + completeBySpecies)}
//                   </td>
//                 </tr>

//                 <tr>
//                   <td className="font-medium">Pesées incomplètes</td>
//                   <td className="p-num text-orange-700">
//                     {formatNumber(incompleteToBeBilled)}
//                   </td>
//                   <td className="p-num">
//                     {formatNumber(incompleteBySpecies)}
//                   </td>
//                   <td className="p-right">
//                     {formatNumber(
//                       incompleteToBeBilled + incompleteBySpecies
//                     )}
//                   </td>
//                 </tr>

//                 <tr>
//                   <td className="font-medium">Pesées test</td>
//                   <td className="p-num text-gray-400">-</td>
//                   <td className="p-num text-blue-700">
//                     {formatNumber(testsBySpecies)}
//                   </td>
//                   <td className="p-right text-blue-700">
//                     {formatNumber(testsBySpecies)}
//                   </td>
//                 </tr>

//                 <tr>
//                   <td className="font-medium">Pesée prépayée effectuée définitivement</td>
//                   <td className="p-num text-blue-700">
//                     {formatNumber(numberPrepaidWeighDefinitivelyCompleted)}
//                   </td>
//                   <td className="p-num text-gray-400">-</td>
//                   <td className="p-right text-blue-700">
//                     {formatNumber(testsBySpecies)}
//                   </td>
//                 </tr>

//                 <tr>
//                   <td className="font-medium">Hors-pont</td>
//                   <td className="p-num text-gray-400">-</td>
//                   <td className="p-num text-blue-700">
//                     {formatNumber(offBridgeNumber)}
//                   </td>
//                   <td className="p-right text-blue-700">
//                     {formatNumber(offBridgeNumber)}
//                   </td>
//                 </tr>

//                 <tr className="bg-gray-100 font-bold">
//                   <td>TOTAL</td>
//                   <td className="p-num">
//                     {formatNumber(billedWeighingsTotal)}
//                   </td>
//                   <td className="p-num">
//                     {formatNumber(speciesWeighingsTotal)}
//                   </td>
//                   <td className="p-num">
//                     {formatNumber(allWeighingsTotal)}
//                   </td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>

//           {reporting.productionDescription && (
//             <div className="mt-2 bg-green-50 border-l-4 border-green-500 p-2 rounded-r-lg print:p-desc print:p-desc-green">
//               <strong className="text-green-900 text-xs">
//                 Production :
//               </strong>
//               <span className="text-green-800 text-xs ml-1">
//                 {reporting.productionDescription}
//               </span>
//             </div>
//           )}
//         </div>
//       </section>

//       <section className="bg-white border rounded-xl p-4 shadow-sm print:p-section print:p-mb-1 print-compact print-break-inside">
//         <button
//           type="button"
//           onClick={() => toggleSection('amounts')}
//           className="w-full flex items-center justify-between text-left no-print"
//         >
//           <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
//             <FileSpreadsheet size={18} className="text-emerald-600" />
//             Montants calculés
//           </h2>

//           {expandedSections.amounts ? (
//             <ChevronUp size={18} />
//           ) : (
//             <ChevronDown size={18} />
//           )}
//         </button>

//         <div
//           className={`mt-3 ${
//             expandedSections.amounts ? 'block' : 'hidden'
//           } print:!block`}
//         >
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 print:p-amounts print-grid-4">
//             <div className="bg-emerald-50 border border-emerald-200 p-2 rounded-lg text-center print:p-amount">
//               <p className="text-xs text-emerald-600 print:p-amount-label">
//                 Total pesée en espèce
//               </p>
//               <p className="text-lg font-bold text-emerald-700 print:p-amount-value">
//                 {formatNumber(totalWeightAmount, 2)}
//               </p>
//               <p className="text-[10px] text-emerald-500 print:p-amount-unit">
//                 CFA
//               </p>
//             </div>

//             <div className="bg-blue-50 border border-blue-200 p-2 rounded-lg text-center print:p-amount">
//               <p className="text-xs text-blue-600 print:p-amount-label">
//                 Total tests
//               </p>
//               <p className="text-lg font-bold text-blue-700 print:p-amount-value">
//                 {formatNumber(totalTestWeightAmount, 2)}
//               </p>
//               <p className="text-[10px] text-blue-500 print:p-amount-unit">
//                 CFA
//               </p>
//             </div>

//             <div className="bg-gray-50 border border-gray-200 p-2 rounded-lg text-center print:p-amount">
//               <p className="text-xs text-gray-600 print:p-amount-label">
//                 Total hors-pont
//               </p>
//               <p className="text-lg font-bold text-gray-700 print:p-amount-value">
//                 {formatNumber(totalOffBridgeAmount, 2)}
//               </p>
//               <p className="text-[10px] text-gray-500 print:p-amount-unit">
//                 CFA
//               </p>
//             </div>

//             <div className="bg-emerald-50 border border-emerald-300 p-2 rounded-lg text-center shadow-sm print:p-amount">
//               <p className="text-xs text-emerald-700 font-semibold uppercase print:p-amount-label">
//                 CA TTC
//               </p>
//               <p className="text-lg font-bold text-emerald-800 print:p-amount-value">
//                 {formatNumber(totalRevenue, 2)}
//               </p>
//               <p className="text-[10px] text-emerald-500 print:p-amount-unit">
//                 CFA
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-3 print:p-two-col print:p-mb-1">
//         <section className="bg-white border rounded-xl p-4 shadow-sm print:p-section print-compact print-break-inside">
//           <button
//             type="button"
//             onClick={() => toggleSection('incidents')}
//             className="w-full flex items-center justify-between text-left no-print"
//           >
//             <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
//               <AlertTriangle size={16} className="text-red-600" />
//               Incidents

//               {numberIncidents > 0 && (
//                 <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-800 text-xs font-bold rounded-full">
//                   {formatNumber(numberIncidents)}
//                 </span>
//               )}
//             </h2>

//             {expandedSections.incidents ? (
//               <ChevronUp size={16} />
//             ) : (
//               <ChevronDown size={16} />
//             )}
//           </button>

//           <div
//             className={`mt-2 ${
//               expandedSections.incidents ? 'block' : 'hidden'
//             } print:!block`}
//           >
//             {numberIncidents > 0 ? (
//               <div>
//                 <div className="flex items-center gap-2 mb-1">
//                   <span className="text-sm text-red-600 font-medium">
//                     Nombre :
//                   </span>
//                   <span className="text-xl font-bold text-red-700">
//                     {formatNumber(numberIncidents)}
//                   </span>
//                 </div>

//                 {reporting.incidentDescription && (
//                   <div className="bg-red-50 border-l-4 border-red-500 p-2 rounded-r-lg print:p-desc print:p-desc-red text-xs">
//                     {reporting.incidentDescription}
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <div className="flex items-center gap-2 text-gray-500 text-sm">
//                 <FileCheck size={14} />
//                 <span>Aucun incident</span>
//               </div>
//             )}
//           </div>
//         </section>

//         <section className="bg-white border rounded-xl p-4 shadow-sm print:p-section print-compact print-break-inside">
//           <h2 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2 border-b pb-1 print:p-section-title">
//             <Users size={16} className="text-blue-600" />
//             Équipe
//           </h2>

//           {operators.length === 0 && hses.length === 0 ? (
//             <p className="text-sm text-gray-500">
//               Aucun membre d’équipe renseigné.
//             </p>
//           ) : (
//             <div className="space-y-2">
//               {operators.length > 0 && (
//                 <div>
//                   <p className="text-xs text-gray-500 mb-1 font-medium">
//                     Opérateurs ({operators.length})
//                   </p>

//                   <div className="flex flex-wrap gap-1 print:p-tags">
//                     {operators.map((operator, index) => (
//                       <span
//                         key={
//                           operator?.id ||
//                           operator?.operatorId ||
//                           `operator-${index}`
//                         }
//                         className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs print:p-tag print:p-tag-blue"
//                       >
//                         {getEmployeeName(operator?.operatorId)}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {hses.length > 0 && (
//                 <div>
//                   <p className="text-xs text-gray-500 mb-1 font-medium">
//                     HSE ({hses.length})
//                   </p>

//                   <div className="flex flex-wrap gap-1 print:p-tags">
//                     {hses.map((hse, index) => (
//                       <span
//                         key={hse?.id || hse?.hseId || `hse-${index}`}
//                         className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs print:p-tag print:p-tag-green"
//                       >
//                         {getEmployeeName(hse?.hseId)}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </section>
//       </div>

//       {/* ✅ Commentaire support client — exclusif au Watch Report */}
//       {isWatchReport && (
//         <section className="bg-white border rounded-xl p-4 shadow-sm print:p-section print:p-mb-1 print-compact print-break-inside">
//           <h2 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2 border-b pb-1 print:p-section-title">
//             <MessageSquare size={16} className="text-sky-600" />
//             Commentaire support client
//           </h2>

//           <div className="bg-sky-50 border-l-4 border-sky-500 p-2 rounded-r-lg print:p-desc text-sm text-sky-900">
//             {reporting.customerSupportComment || 'RAS'}
//           </div>
//         </section>
//       )}

//       {consumables.length > 0 && (
//         <section className="bg-white border rounded-xl p-4 shadow-sm print:p-section print:p-mb-1 print-compact print-break-inside">
//           <button
//             type="button"
//             onClick={() => toggleSection('consumables')}
//             className="w-full flex items-center justify-between text-left no-print"
//           >
//             <h2 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2 border-b pb-1 print:p-section-title">
//               <Package size={16} className="text-amber-600" />
//               Consommables en rupture

//               <span className="ml-1 text-xs text-gray-500">
//                 ({consumables.length})
//               </span>
//             </h2>

//             {expandedSections.consumables ? (
//               <ChevronUp size={16} />
//             ) : (
//               <ChevronDown size={16} />
//             )}
//           </button>

//           <div
//             className={`mt-2 ${
//               expandedSections.consumables ? 'block' : 'hidden'
//             } print:!block`}
//           >
//             <p className="text-xs text-gray-500 mb-1 font-medium">
//               {consumables.length} consommable(s) en rupture
//             </p>

//             <div className="flex flex-wrap gap-1 print:p-tags">
//               {consumables.map((consumable, index) => (
//                 <span
//                   key={
//                     consumable?.id ||
//                     consumable?.consumableId ||
//                     `consumable-${index}`
//                   }
//                   className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-xs print:p-tag print:p-tag-amber"
//                 >
//                   {consumable?.consumable?.name ||
//                     consumable?.consumableId ||
//                     '-'}
//                 </span>
//               ))}
//             </div>
//           </div>
//         </section>
//       )}

//       <section className="bg-white border rounded-xl p-4 shadow-sm no-print">
//         <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2 border-b pb-2">
//           <Paperclip size={18} className="text-purple-600" />
//           Documents joints
//         </h2>

//         {!reporting.extractionFileUrl && attachments.length === 0 ? (
//           <p className="text-sm text-gray-500">
//             Aucun document joint à ce rapport.
//           </p>
//         ) : (
//           <div className="space-y-3">
//             {reporting.extractionFileUrl && (
//               <div className="print-break-inside">
//                 <h3 className="font-semibold text-gray-700 mb-1 flex items-center gap-2 text-sm">
//                   <FileSpreadsheet size={14} className="text-green-600" />
//                   Fichier d’extraction PW
//                 </h3>

//                 <div className="border rounded-lg p-3 bg-gray-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//                   <div className="flex items-center gap-2">
//                     <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
//                       <FileSpreadsheet
//                         size={16}
//                         className="text-green-600"
//                       />
//                     </div>

//                     <p className="font-medium text-sm text-gray-900">
//                       Extraction_PW
//                     </p>
//                   </div>

//                   <div className="flex items-center gap-1">
//                     <button
//                       type="button"
//                       onClick={() =>
//                         handleSecureView(reporting.extractionFileUrl)
//                       }
//                       className="flex items-center gap-1 px-2 py-1 text-xs bg-white border rounded-md hover:bg-gray-50"
//                     >
//                       <Eye size={12} />
//                       Voir
//                     </button>

//                     <button
//                       type="button"
//                       onClick={() =>
//                         handleSecureDownload(
//                           reporting.extractionFileUrl,
//                           'extraction_pw'
//                         )
//                       }
//                       className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700"
//                     >
//                       <Download size={12} />
//                       Télécharger
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {attachments.length > 0 && (
//               <div className="print-break-inside">
//                 <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2 text-sm">
//                   <FileText size={14} />
//                   Pièces jointes ({attachments.length})
//                 </h3>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//                   {attachments.map((attachment, index) => {
//                     const filename =
//                       attachment?.filename ||
//                       attachment?.name ||
//                       `Pièce jointe ${index + 1}`;

//                     const fileUrl = attachment?.url;

//                     return (
//                       <div
//                         key={attachment?.id || `${filename}-${index}`}
//                         className="border rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow"
//                       >
//                         {isImage(filename) && fileUrl ? (
//                           <div className="relative group">
//                             <SecureImage
//                               src={fileUrl}
//                               alt={filename}
//                               className="w-full h-32 object-cover"
//                             />

//                             <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
//                               <button
//                                 type="button"
//                                 onClick={() => handleSecureView(fileUrl)}
//                                 className="p-2 bg-white rounded-full hover:bg-gray-100"
//                                 title="Voir le document"
//                               >
//                                 <Eye size={14} />
//                               </button>
//                             </div>
//                           </div>
//                         ) : (
//                           <div className="h-32 bg-gray-100 flex items-center justify-center">
//                             {getFileIcon(filename)}
//                           </div>
//                         )}

//                         <div className="p-2">
//                           <div className="flex items-start justify-between gap-2">
//                             <div className="min-w-0">
//                               <p
//                                 className="font-medium text-xs text-gray-900 truncate"
//                                 title={filename}
//                               >
//                                 {filename}
//                               </p>
//                             </div>

//                             <button
//                               type="button"
//                               onClick={() =>
//                                 handleSecureDownload(fileUrl, filename)
//                               }
//                               disabled={!fileUrl}
//                               className="flex-shrink-0 p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded disabled:opacity-40 disabled:cursor-not-allowed"
//                               title="Télécharger"
//                             >
//                               <Download size={12} />
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </section>

//       <section className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-3 text-white print:p-banner print:p-mb-1 print-compact print-break-inside">
//         <h3 className="text-base font-bold flex items-center justify-center gap-2">
//           <User size={18} className="text-yellow-400" />
//           CG entrant : {getEmployeeName(reporting.incomingCgId)}
//         </h3>
//       </section>

//       <div className="hidden print:block p-footer">
//         {type === 'watch' ? 'Rapport de Quart' : 'Rapport CG'} —{' '}
//         {reporting.numRef || '-'} | Site{' '}
//         {getSiteName(reporting.siteId)} | Imprimé le{' '}
//         {new Date().toLocaleString('fr-FR')}
//       </div>
//     </div>
//   );

//   if (embedded) {
//     return <div className="print-area">{content}</div>;
//   }

//   return (
//     <>
//       <Drawer open={Boolean(open)} onOpenChange={closeMainDrawer}>
//         <DrawerContent className="max-h-[95vh] print-area">
//           <DrawerHeader className="text-left border-b pb-4 no-print">
//             <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
//               <div>
//                 <DrawerTitle className="text-2xl font-bold text-gray-900">
//                   {type === 'watch'
//                     ? 'Rapport de Quart'
//                     : 'Rapport du CG'}{' '}
//                   : {getEmployeeName(reporting.createdBy)}
//                 </DrawerTitle>

//                 <DrawerDescription className="text-gray-500 mt-1">
//                   {type === 'watch'
//                     ? 'Détails du Rapport de Quart'
//                     : 'Détails du rapport'}{' '}
//                   — {reporting.numRef || '-'}
//                 </DrawerDescription>
//               </div>

//               <div className="flex flex-wrap items-center gap-2">
//                 <button
//                   type="button"
//                   onClick={handlePrintPdf}
//                   className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
//                 >
//                   <Printer size={16} />
//                   Imprimer
//                 </button>

//                 {/* ✅ "Créer Rapport de Quart" : watchReport n'existe pas
//                     + droit de création (ADMIN ou incident__create_watch_report) */}
//                 {showCreateWatchReportButton && (
//                   <button
//                     type="button"
//                     onClick={() => handleWatchAction('create')}
//                     disabled={isRefreshingWatchReport}
//                     className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
//                   >
//                     <FileText size={16} />
//                     Créer Rapport de Quart
//                   </button>
//                 )}

//                 {/* ✅ "Modifier Rapport de Quart" : watchReport existe
//                     + droit de modification (ADMIN ou incident__edit_watch_report) */}
//                 {showEditWatchReportButton && (
//                   <button
//                     type="button"
//                     onClick={() => handleWatchAction('edit')}
//                     disabled={isRefreshingWatchReport}
//                     className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
//                   >
//                     <FileText size={16} />
//                     Modifier Rapport de Quart
//                   </button>
//                 )}

//                 {/* ✅ "Voir / Imprimer le Rapport de Quart" : watchReport existe
//                     (simple consultation, aucune permission spécifique requise) */}
//                 {showViewWatchReportButton && (
//                   <button
//                     type="button"
//                     onClick={() => setWatchViewOpen(true)}
//                     className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
//                   >
//                     <Eye size={16} />
//                     Voir / Imprimer le Rapport de Quart
//                   </button>
//                 )}
//               </div>
//             </div>
//           </DrawerHeader>

//           {content}

//           <DrawerFooter className="border-t no-print">
//             <DrawerClose asChild>
//               <button
//                 type="button"
//                 className="px-6 py-2.5 bg-gray-100 hover:bg-secondary rounded-lg transition-colors flex items-center justify-center gap-2 font-medium"
//               >
//                 <X size={16} />
//                 Fermer
//               </button>
//             </DrawerClose>
//           </DrawerFooter>
//         </DrawerContent>
//       </Drawer>

//       <Drawer
//         open={watchDrawerOpen}
//         onOpenChange={handleWatchDrawerChange}
//       >
//         <DrawerContent className="max-h-[95vh]">
//           <div className="p-4">
//             <DrawerHeader className="px-0">
//               <DrawerTitle>
//                 {watchReportData
//                   ? 'Modifier le Rapport de Quart'
//                   : 'Créer un Rapport de Quart'}
//               </DrawerTitle>

//               <DrawerDescription>
//                 {watchReportData
//                   ? 'Modifiez les informations du Rapport de Quart sélectionné.'
//                   : 'Les données du rapport CG sont préremplies automatiquement.'}
//               </DrawerDescription>
//             </DrawerHeader>

//             <WatchReportForm
//               reportingCgId={reporting.id}
//               sourceReporting={reporting}
//               initialData={watchReportData}
//               onSuccess={handleWatchSuccess}
//               onCancel={() => handleWatchDrawerChange(false)}
//             />
//           </div>
//         </DrawerContent>
//       </Drawer>

//       {/*
//         ✅ Consultation/impression du Watch Report existant.
//         On réutilise ReportingCgDetails elle-même en mode type="watch" :
//         elle affiche alors le récapitulatif du Watch Report (dont
//         guardhouseSupervisorId / customerSupportComment) et son propre
//         bouton "Imprimer" appelle /watch-reports/:id/pdf.
//       */}
//       {showViewWatchReportButton && (
//         <ReportingCgDetails
//           open={watchViewOpen}
//           setOpen={setWatchViewOpen}
//           reporting={watchReportData}
//           references={references}
//           type="watch"
//           userPermissions={userPermissions}
//           currentUserRoles={currentUserRoles}
//         />
//       )}
//     </>
//   );
// };

// export default ReportingCgDetails;

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useFetch } from '../../../hooks/useFetch';
import WatchReportForm from '../WatchReport/WatchReportForm';
import { URLS } from '../../../../configUrl';
import toast from 'react-hot-toast';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '../../ui/drawer';
import {
  X,
  FileText,
  Users,
  AlertTriangle,
  Calendar,
  Printer,
  FileSpreadsheet,
  Image as ImageIcon,
  Paperclip,
  Weight,
  ChevronDown,
  ChevronUp,
  FileCheck,
  Package,
  User,
  MessageSquare,
  Download,
  Eye,
} from 'lucide-react';
import SecureImage from '../../ui/SecureImage';

const WATCH_REPORT_CREATE_PERMISSION = 'incident__create_watch_report';
const WATCH_REPORT_EDIT_PERMISSION = 'incident__edit_watch_report';

const ReportingCgDetails = ({
  open = false,
  setOpen,
  reporting = null,
  references = {},
  type = 'cg',
  embedded = false,
  userPermissions = [],
  currentUserRoles = [],
  onWatchReportChange, // ✅ callback pour recharger la liste principale
}) => {
  const { handleFetch } = useFetch();

  const isWatchReport = type === 'watch';

  const sites = Array.isArray(references?.sites) ? references.sites : [];
  const shifts = Array.isArray(references?.shifts) ? references.shifts : [];
  const employees = Array.isArray(references?.employees)
    ? references.employees
    : [];

  const [expandedSections, setExpandedSections] = useState({
    weighing: true,
    amounts: true,
    incidents: true,
    operators: false,
    hse: false,
    consumables: false,
  });

  const [watchReportData, setWatchReportData] = useState(
    type === 'cg' ? reporting?.watchReport ?? null : null
  );
  const [watchDrawerOpen, setWatchDrawerOpen] = useState(false);
  const [watchDrawerMode, setWatchDrawerMode] = useState(null);
  const [isRefreshingWatchReport, setIsRefreshingWatchReport] = useState(false);
  const [watchViewOpen, setWatchViewOpen] = useState(false);

  useEffect(() => {
    setWatchReportData(type === 'cg' ? reporting?.watchReport ?? null : null);
  }, [reporting, type]);

  const getSiteName = useCallback(
    (id) => sites.find((site) => site.id === id)?.name || id || '-',
    [sites]
  );

  const getShiftName = useCallback(
    (id) => shifts.find((shift) => shift.id === id)?.name || id || '-',
    [shifts]
  );

  const getEmployeeName = useCallback(
    (id) => employees.find((employee) => employee.id === id)?.name || id || '-',
    [employees]
  );

  const formatDate = useCallback((date) => {
    if (!date) return '-';
    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) return '-';
    return parsedDate.toLocaleString('fr-FR');
  }, []);

  const formatDateShort = useCallback((date) => {
    if (!date) return '-';
    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) return '-';
    return parsedDate.toLocaleDateString('fr-FR');
  }, []);

  const formatNumber = useCallback((value, decimals = 0) => {
    const number = Number(value);
    if (!Number.isFinite(number)) {
      return decimals > 0 ? (0).toFixed(decimals).replace('.', ',') : '0';
    }
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(number);
  }, []);

  const numberValue = useCallback((value) => {
    const number = Number(value);
    return Number.isFinite(number) ? number : 0;
  }, []);

  const refreshWatchReport = useCallback(async () => {
    if (!reporting?.id || type !== 'cg') return;

    setIsRefreshingWatchReport(true);
    try {
      const response = await handleFetch(
        `${URLS.INCIDENT_API}/reporting-cgs/${reporting.id}`
      );
      const payload = response?.data;
      const freshReportingCg = payload?.data ?? payload ?? null;
      setWatchReportData(freshReportingCg?.watchReport ?? null);
    } catch (error) {
      console.error('Erreur de rafraîchissement du rapport de quart :', error);
    } finally {
      setIsRefreshingWatchReport(false);
    }
  }, [handleFetch, reporting?.id, type]);

  useEffect(() => {
    if (!open) {
      setWatchDrawerOpen(false);
      setWatchDrawerMode(null);
      setWatchViewOpen(false);
    }
  }, [open]);

  const toggleSection = useCallback((section) => {
    setExpandedSections((previous) => ({
      ...previous,
      [section]: !previous[section],
    }));
  }, []);

  const handleWatchAction = useCallback((mode) => {
    setWatchDrawerMode(mode);
    setWatchDrawerOpen(true);
  }, []);

  const handleWatchDrawerChange = useCallback((isOpen) => {
    setWatchDrawerOpen(isOpen);
    if (!isOpen) {
      setWatchDrawerMode(null);
    }
  }, []);

  // ✅ Après succès Watch Report → refresh local + notifie le parent (liste)
  const handleWatchSuccess = useCallback(async () => {
    await refreshWatchReport();
    setWatchDrawerOpen(false);
    setWatchDrawerMode(null);

    if (typeof onWatchReportChange === 'function') {
      onWatchReportChange();
    }
  }, [refreshWatchReport, onWatchReportChange]);

  const getFileIcon = useCallback((filename) => {
    if (!filename) return <FileText size={16} />;
    const extension = filename.split('.').pop()?.toLowerCase();
    if (['xlsx', 'xls', 'csv'].includes(extension)) {
      return <FileSpreadsheet size={16} className="text-green-600" />;
    }
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
      return <ImageIcon size={16} className="text-purple-600" />;
    }
    if (extension === 'pdf') {
      return <FileText size={16} className="text-red-600" />;
    }
    return <Paperclip size={16} className="text-gray-600" />;
  }, []);

  const isImage = useCallback((filenameOrUrl) => {
    if (!filenameOrUrl) return false;
    const filename = filenameOrUrl.split('?')[0].split('/').pop();
    const extension = filename?.split('.').pop()?.toLowerCase();
    return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension);
  }, []);

  const handleSecureDownload = useCallback(async (url, filename) => {
    if (!url) {
      toast.error('Aucun fichier disponible');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Session expirée. Veuillez vous reconnecter.');
        return;
      }
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Le téléchargement du fichier a échoué');
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = blobUrl;
      anchor.download = filename || 'fichier';
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      window.setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1000);
    } catch (error) {
      console.error('Erreur de téléchargement :', error);
      toast.error('Impossible de télécharger le fichier');
    }
  }, []);

  const handleSecureView = useCallback(async (url) => {
    if (!url) {
      toast.error('Aucun fichier disponible');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Session expirée. Veuillez vous reconnecter.');
        return;
      }
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("L'ouverture du fichier a échoué");
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      window.open(blobUrl, '_blank', 'noopener,noreferrer');
      window.setTimeout(() => window.URL.revokeObjectURL(blobUrl), 60000);
    } catch (error) {
      console.error("Erreur d'ouverture du fichier :", error);
      toast.error("Impossible d'ouvrir le fichier");
    }
  }, []);

  const handlePrintPdf = useCallback(async () => {
    if (!reporting?.id) {
      toast.error('Aucun rapport sélectionné');
      return;
    }
    try {
      const endpoint = type === 'watch' ? 'watch-reports' : 'reporting-cgs';
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${URLS.INCIDENT_API}/${endpoint}/${reporting.id}/pdf`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      if (!response.ok) throw new Error('La génération du PDF a échoué');
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      window.open(blobUrl, '_blank', 'noopener,noreferrer');
      window.setTimeout(() => window.URL.revokeObjectURL(blobUrl), 60000);
    } catch (error) {
      console.error('Erreur PDF :', error);
      toast.error('Impossible de générer le PDF');
    }
  }, [reporting?.id, type]);

  const closeMainDrawer = useCallback(
    (isOpen) => {
      if (typeof setOpen === 'function') setOpen(isOpen);
    },
    [setOpen]
  );

  const hasRole = useCallback(
    (role) => Array.isArray(currentUserRoles) && currentUserRoles.includes(role),
    [currentUserRoles]
  );

  const hasPermission = useCallback(
    (permission) =>
      Array.isArray(userPermissions) && userPermissions.includes(permission),
    [userPermissions]
  );

  const canCreateWatchReport = useMemo(
    () => hasRole('ADMIN') || hasPermission(WATCH_REPORT_CREATE_PERMISSION),
    [hasRole, hasPermission]
  );

  const canEditWatchReport = useMemo(
    () => hasRole('ADMIN') || hasPermission(WATCH_REPORT_EDIT_PERMISSION),
    [hasRole, hasPermission]
  );

  const showCreateWatchReportButton =
    type === 'cg' && !watchReportData && canCreateWatchReport;

  const showEditWatchReportButton =
    type === 'cg' && Boolean(watchReportData) && canEditWatchReport;

  const showViewWatchReportButton =
    type === 'cg' && Boolean(watchReportData);

  if (!reporting) return null;

  const operators = Array.isArray(reporting.operators) ? reporting.operators : [];
  const hses = Array.isArray(reporting.hses) ? reporting.hses : [];
  const consumables = Array.isArray(reporting.outOfStockConsumableReportingCgs)
    ? reporting.outOfStockConsumableReportingCgs
    : [];
  const attachments = Array.isArray(reporting.attachments)
    ? reporting.attachments
    : [];

  const completeToBeBilled = numberValue(reporting.completeNumberWeighingsToBeBilled);
  const completeBySpecies = numberValue(reporting.completeNumberWeighingsBySpecies);
  const incompleteToBeBilled = numberValue(reporting.incompleteNumberWeighingsToBeBilled);
  const incompleteBySpecies = numberValue(reporting.incompleteNumberWeighingsBySpecies);
  const testsBySpecies = numberValue(reporting.testNumberWeighingsBySpecies);
  const numberPrepaidWeighDefinitivelyCompleted = numberValue(
    reporting.numberPrepaidWeighDefinitivelyCompleted
  );
  const offBridgeNumber = numberValue(reporting.offBridgeNumber);
  const totalWeightAmount = numberValue(reporting.totalWeightAmount);
  const totalTestWeightAmount = numberValue(reporting.totalTestWeightAmount);
  const totalOffBridgeAmount = numberValue(reporting.totalOffBridgeAmount);
  const numberIncidents = numberValue(reporting.numberIncidents);

  const totalWeighingsBySpecies =
    completeBySpecies + incompleteBySpecies + testsBySpecies;

  const totalRevenue =
    totalWeightAmount + totalTestWeightAmount + totalOffBridgeAmount;

  const billedWeighingsTotal =
    completeToBeBilled +
    numberPrepaidWeighDefinitivelyCompleted +
    incompleteToBeBilled;

  const speciesWeighingsTotal =
    completeBySpecies + incompleteBySpecies + testsBySpecies + offBridgeNumber;

  const allWeighingsTotal = billedWeighingsTotal + speciesWeighingsTotal;

  const content = (
    <div className="print-content mx-4 md:mx-8 overflow-y-auto max-h-[75vh] print:mx-0 print:max-h-none pb-4 space-y-3">
      <div className="hidden print:block p-header">
        <h1>
          {type === 'watch' ? 'RAPPORT DE QUART' : 'RAPPORT DE PESÉE CG'}
        </h1>
        <div className="p-header-meta">
          <span>
            <strong>Ref :</strong> {reporting.numRef || '-'}
          </span>
          <span>
            <strong>Site :</strong> {getSiteName(reporting.siteId)}
          </span>
          <span>
            <strong>Quart :</strong> {getShiftName(reporting.shiftId)}
          </span>
          <span>
            <strong>Date :</strong> {formatDateShort(reporting.createdAt)}
          </span>
        </div>
      </div>

      <section className="bg-white border rounded-xl p-4 shadow-sm print:p-section print:p-mb-1 print-compact print-break-inside">
        <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2 border-b pb-2 print:p-section-title">
          <FileText size={16} className="text-blue-600" />
          Informations générales
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm print:p-info-grid">
          <div className="flex items-center gap-2 print:p-info-item">
            <span className="text-gray-600 print:p-info-label">Référence :</span>
            <span className="font-semibold print:p-info-value">
              {reporting.numRef || '-'}
            </span>
          </div>
          <div className="flex items-center gap-2 print:p-info-item">
            <span className="text-gray-600 print:p-info-label">Site :</span>
            <span className="font-semibold print:p-info-value">
              {getSiteName(reporting.siteId)}
            </span>
          </div>
          <div className="flex items-center gap-2 print:p-info-item">
            <span className="text-gray-600 print:p-info-label">Quart :</span>
            <span className="font-semibold print:p-info-value">
              {getShiftName(reporting.shiftId)}
            </span>
          </div>
          <div className="flex items-center gap-2 print:p-info-item">
            <span className="text-gray-600 print:p-info-label">Créé par :</span>
            <span className="font-semibold print:p-info-value">
              {getEmployeeName(reporting.createdBy)}
            </span>
          </div>
          <div className="flex items-center gap-2 print:p-info-item">
            <span className="text-gray-600 print:p-info-label">Date :</span>
            <span className="font-semibold print:p-info-value">
              {formatDate(reporting.createdAt)}
            </span>
          </div>
          <div className="flex items-center gap-2 print:p-info-item">
            <span className="text-gray-600 print:p-info-label">N° recette :</span>
            <span className="font-semibold print:p-info-value">
              {reporting.recipeCardNumber || '-'}
            </span>
          </div>
          {isWatchReport && (
            <div className="flex items-center gap-2 print:p-info-item">
              <span className="text-gray-600 print:p-info-label">
                Chef de guérite en poste :
              </span>
              <span className="font-semibold print:p-info-value">
                {getEmployeeName(reporting.guardhouseSupervisorId)}
              </span>
            </div>
          )}
          {isWatchReport && reporting?.reportingCg && (
            <>
              <div className="flex items-center gap-2 print:p-info-item">
                <span className="text-gray-600 print:p-info-label">
                  N°Référence RCG :
                </span>
                <span className="font-semibold print:p-info-value">
                  {reporting.reportingCg.numRef ?? '—'}
                </span>
              </div>
              <div className="flex items-center gap-2 print:p-info-item">
                <span className="text-gray-600 print:p-info-label">
                  RCG créé le :
                </span>
                <span className="font-semibold print:p-info-value">
                  {reporting.reportingCg.createdAt
                    ? formatDate(reporting.reportingCg.createdAt)
                    : '—'}
                </span>
              </div>
            </>
          )}
        </div>
      </section>

      <section className="bg-white border rounded-xl p-4 shadow-sm print:p-section print:p-mb-1 print-compact print-break-inside">
        <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2 border-b pb-2 print:p-section-title">
          <Calendar size={16} className="text-teal-600" />
          Suivi des pesées
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] table-fixed text-sm print:p-table print-table">
            <colgroup>
              <col className="w-[32%]" />
              <col className="w-[22%]" />
              <col className="w-[23%]" />
              <col className="w-[23%]" />
            </colgroup>
            <thead>
              <tr>
                <th className="bg-gray-50 px-3 py-2 text-left align-middle" />
                <th className="bg-gray-50 px-3 py-2 text-center align-middle">DATE</th>
                <th className="bg-gray-50 px-3 py-2 text-center align-middle">N° PESÉE</th>
                <th className="bg-gray-50 px-3 py-2 text-center align-middle">N° TRACTEUR</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-2 font-semibold align-middle">PREMIÈRE PESÉE</td>
                <td className="px-3 py-2 text-center align-middle whitespace-nowrap">
                  {formatDateShort(reporting.firstWeighDate)}
                </td>
                <td className="px-3 py-2 text-center align-middle">
                  {reporting.firstWeighNumber || '-'}
                </td>
                <td className="px-3 py-2 text-center align-middle">
                  {reporting.firstWeighTractorNumber || '-'}
                </td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-semibold align-middle">DERNIÈRE PESÉE</td>
                <td className="px-3 py-2 text-center align-middle whitespace-nowrap">
                  {formatDateShort(reporting.lastWeighDate)}
                </td>
                <td className="px-3 py-2 text-center align-middle">
                  {reporting.lastWeighNumber || '-'}
                </td>
                <td className="px-3 py-2 text-center align-middle">
                  {reporting.lastWeighTractorNumber || '-'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-white border rounded-xl p-4 shadow-sm print:p-section print:p-mb-1 print-compact print-break-inside">
        <button
          type="button"
          onClick={() => toggleSection('weighing')}
          className="w-full flex items-center justify-between text-left no-print"
        >
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Weight size={16} className="text-indigo-600" />
            Récapitulatif des pesées
            <span className="ml-2 px-2 py-0.5 bg-indigo-100 text-indigo-800 text-xs font-bold rounded-full">
              Espèces : {formatNumber(totalWeighingsBySpecies)}
            </span>
          </h2>
          {expandedSections.weighing ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        <div className={`mt-3 ${expandedSections.weighing ? 'block' : 'hidden'} print:!block`}>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mb-3 print:p-stats">
            <div className="bg-green-50 border border-green-200 rounded-lg p-2 text-center print:p-stat">
              <p className="text-lg font-bold text-green-700 print:p-stat-value">
                {formatNumber(completeToBeBilled)}
              </p>
              <p className="text-[10px] text-green-600 print:p-stat-label">Compl. facturer</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-2 text-center print:p-stat">
              <p className="text-lg font-bold text-green-700 print:p-stat-value">
                {formatNumber(completeBySpecies)}
              </p>
              <p className="text-[10px] text-green-600 print:p-stat-label">Compl. espèce</p>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-2 text-center print:p-stat">
              <p className="text-lg font-bold text-orange-700 print:p-stat-value">
                {formatNumber(incompleteToBeBilled)}
              </p>
              <p className="text-[10px] text-orange-600 print:p-stat-label">Incompl. facturer</p>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-2 text-center print:p-stat">
              <p className="text-lg font-bold text-orange-700 print:p-stat-value">
                {formatNumber(incompleteBySpecies)}
              </p>
              <p className="text-[10px] text-orange-600 print:p-stat-label">Incompl. espèce</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 text-center print:p-stat">
              <p className="text-lg font-bold text-blue-700 print:p-stat-value">
                {formatNumber(testsBySpecies)}
              </p>
              <p className="text-[10px] text-blue-600 print:p-stat-label">Tests espèce</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 text-center print:p-stat">
              <p className="text-lg font-bold text-gray-700 print:p-stat-value">
                {formatNumber(offBridgeNumber)}
              </p>
              <p className="text-[10px] text-gray-600 print:p-stat-label">Hors-pont</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] text-sm print:p-table">
              <thead>
                <tr>
                  <th>Type de pesée</th>
                  <th className="p-num">À facturer</th>
                  <th className="p-left">Par espèce</th>
                  <th className="p-right">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-medium">Pesées complètes</td>
                  <td className="p-num text-green-700">{formatNumber(completeToBeBilled)}</td>
                  <td className="p-num">{formatNumber(completeBySpecies)}</td>
                  <td className="p-right">{formatNumber(completeToBeBilled + completeBySpecies)}</td>
                </tr>
                <tr>
                  <td className="font-medium">Pesées incomplètes</td>
                  <td className="p-num text-orange-700">{formatNumber(incompleteToBeBilled)}</td>
                  <td className="p-num">{formatNumber(incompleteBySpecies)}</td>
                  <td className="p-right">{formatNumber(incompleteToBeBilled + incompleteBySpecies)}</td>
                </tr>
                <tr>
                  <td className="font-medium">Pesées test</td>
                  <td className="p-num text-gray-400">-</td>
                  <td className="p-num text-blue-700">{formatNumber(testsBySpecies)}</td>
                  <td className="p-right text-blue-700">{formatNumber(testsBySpecies)}</td>
                </tr>
                <tr>
                  <td className="font-medium">Pesée prépayée effectuée définitivement</td>
                  <td className="p-num text-blue-700">{formatNumber(numberPrepaidWeighDefinitivelyCompleted)}</td>
                  <td className="p-num text-gray-400">-</td>
                  <td className="p-right text-blue-700">{formatNumber(numberPrepaidWeighDefinitivelyCompleted)}</td>
                </tr>
                <tr>
                  <td className="font-medium">Hors-pont</td>
                  <td className="p-num text-gray-400">-</td>
                  <td className="p-num text-blue-700">{formatNumber(offBridgeNumber)}</td>
                  <td className="p-right text-blue-700">{formatNumber(offBridgeNumber)}</td>
                </tr>
                <tr className="bg-gray-100 font-bold">
                  <td>TOTAL</td>
                  <td className="p-num">{formatNumber(billedWeighingsTotal)}</td>
                  <td className="p-num">{formatNumber(speciesWeighingsTotal)}</td>
                  <td className="p-num">{formatNumber(allWeighingsTotal)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {reporting.productionDescription && (
            <div className="mt-2 bg-green-50 border-l-4 border-green-500 p-2 rounded-r-lg print:p-desc print:p-desc-green">
              <strong className="text-green-900 text-xs">Production :</strong>
              <span className="text-green-800 text-xs ml-1">{reporting.productionDescription}</span>
            </div>
          )}
        </div>
      </section>

      <section className="bg-white border rounded-xl p-4 shadow-sm print:p-section print:p-mb-1 print-compact print-break-inside">
        <button
          type="button"
          onClick={() => toggleSection('amounts')}
          className="w-full flex items-center justify-between text-left no-print"
        >
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <FileSpreadsheet size={18} className="text-emerald-600" />
            Montants calculés
          </h2>
          {expandedSections.amounts ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        <div className={`mt-3 ${expandedSections.amounts ? 'block' : 'hidden'} print:!block`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 print:p-amounts print-grid-4">
            <div className="bg-emerald-50 border border-emerald-200 p-2 rounded-lg text-center print:p-amount">
              <p className="text-xs text-emerald-600 print:p-amount-label">Total pesée en espèce</p>
              <p className="text-lg font-bold text-emerald-700 print:p-amount-value">
                {formatNumber(totalWeightAmount, 2)}
              </p>
              <p className="text-[10px] text-emerald-500 print:p-amount-unit">CFA</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 p-2 rounded-lg text-center print:p-amount">
              <p className="text-xs text-blue-600 print:p-amount-label">Total tests</p>
              <p className="text-lg font-bold text-blue-700 print:p-amount-value">
                {formatNumber(totalTestWeightAmount, 2)}
              </p>
              <p className="text-[10px] text-blue-500 print:p-amount-unit">CFA</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 p-2 rounded-lg text-center print:p-amount">
              <p className="text-xs text-gray-600 print:p-amount-label">Total hors-pont</p>
              <p className="text-lg font-bold text-gray-700 print:p-amount-value">
                {formatNumber(totalOffBridgeAmount, 2)}
              </p>
              <p className="text-[10px] text-gray-500 print:p-amount-unit">CFA</p>
            </div>
            <div className="bg-emerald-50 border border-emerald-300 p-2 rounded-lg text-center shadow-sm print:p-amount">
              <p className="text-xs text-emerald-700 font-semibold uppercase print:p-amount-label">CA TTC</p>
              <p className="text-lg font-bold text-emerald-800 print:p-amount-value">
                {formatNumber(totalRevenue, 2)}
              </p>
              <p className="text-[10px] text-emerald-500 print:p-amount-unit">CFA</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 print:p-two-col print:p-mb-1">
        <section className="bg-white border rounded-xl p-4 shadow-sm print:p-section print-compact print-break-inside">
          <button
            type="button"
            onClick={() => toggleSection('incidents')}
            className="w-full flex items-center justify-between text-left no-print"
          >
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <AlertTriangle size={16} className="text-red-600" />
              Incidents
              {numberIncidents > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-800 text-xs font-bold rounded-full">
                  {formatNumber(numberIncidents)}
                </span>
              )}
            </h2>
            {expandedSections.incidents ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          <div className={`mt-2 ${expandedSections.incidents ? 'block' : 'hidden'} print:!block`}>
            {numberIncidents > 0 ? (
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm text-red-600 font-medium">Nombre :</span>
                  <span className="text-xl font-bold text-red-700">{formatNumber(numberIncidents)}</span>
                </div>
                {reporting.incidentDescription && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-2 rounded-r-lg print:p-desc print:p-desc-red text-xs">
                    {reporting.incidentDescription}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <FileCheck size={14} />
                <span>Aucun incident</span>
              </div>
            )}
          </div>
        </section>

        <section className="bg-white border rounded-xl p-4 shadow-sm print:p-section print-compact print-break-inside">
          <h2 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2 border-b pb-1 print:p-section-title">
            <Users size={16} className="text-blue-600" />
            Équipe
          </h2>
          {operators.length === 0 && hses.length === 0 ? (
            <p className="text-sm text-gray-500">Aucun membre d’équipe renseigné.</p>
          ) : (
            <div className="space-y-2">
              {operators.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 mb-1 font-medium">
                    Opérateurs ({operators.length})
                  </p>
                  <div className="flex flex-wrap gap-1 print:p-tags">
                    {operators.map((operator, index) => (
                      <span
                        key={operator?.id || operator?.operatorId || `operator-${index}`}
                        className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs print:p-tag print:p-tag-blue"
                      >
                        {getEmployeeName(operator?.operatorId)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {hses.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 mb-1 font-medium">HSE ({hses.length})</p>
                  <div className="flex flex-wrap gap-1 print:p-tags">
                    {hses.map((hse, index) => (
                      <span
                        key={hse?.id || hse?.hseId || `hse-${index}`}
                        className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs print:p-tag print:p-tag-green"
                      >
                        {getEmployeeName(hse?.hseId)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </div>

      {isWatchReport && (
        <section className="bg-white border rounded-xl p-4 shadow-sm print:p-section print:p-mb-1 print-compact print-break-inside">
          <h2 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2 border-b pb-1 print:p-section-title">
            <MessageSquare size={16} className="text-sky-600" />
            Commentaire support client
          </h2>
          <div className="bg-sky-50 border-l-4 border-sky-500 p-2 rounded-r-lg print:p-desc text-sm text-sky-900">
            {reporting.customerSupportComment || 'RAS'}
          </div>
        </section>
      )}

      {consumables.length > 0 && (
        <section className="bg-white border rounded-xl p-4 shadow-sm print:p-section print:p-mb-1 print-compact print-break-inside">
          <button
            type="button"
            onClick={() => toggleSection('consumables')}
            className="w-full flex items-center justify-between text-left no-print"
          >
            <h2 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2 border-b pb-1 print:p-section-title">
              <Package size={16} className="text-amber-600" />
              Consommables en rupture
              <span className="ml-1 text-xs text-gray-500">({consumables.length})</span>
            </h2>
            {expandedSections.consumables ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          <div className={`mt-2 ${expandedSections.consumables ? 'block' : 'hidden'} print:!block`}>
            <p className="text-xs text-gray-500 mb-1 font-medium">
              {consumables.length} consommable(s) en rupture
            </p>
            <div className="flex flex-wrap gap-1 print:p-tags">
              {consumables.map((consumable, index) => (
                <span
                  key={consumable?.id || consumable?.consumableId || `consumable-${index}`}
                  className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-xs print:p-tag print:p-tag-amber"
                >
                  {consumable?.consumable?.name || consumable?.consumableId || '-'}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-white border rounded-xl p-4 shadow-sm no-print">
        <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2 border-b pb-2">
          <Paperclip size={18} className="text-purple-600" />
          Documents joints
        </h2>
        {!reporting.extractionFileUrl && attachments.length === 0 ? (
          <p className="text-sm text-gray-500">Aucun document joint à ce rapport.</p>
        ) : (
          <div className="space-y-3">
            {reporting.extractionFileUrl && (
              <div className="print-break-inside">
                <h3 className="font-semibold text-gray-700 mb-1 flex items-center gap-2 text-sm">
                  <FileSpreadsheet size={14} className="text-green-600" />
                  Fichier d’extraction PW
                </h3>
                <div className="border rounded-lg p-3 bg-gray-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <FileSpreadsheet size={16} className="text-green-600" />
                    </div>
                    <p className="font-medium text-sm text-gray-900">Extraction_PW</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleSecureView(reporting.extractionFileUrl)}
                      className="flex items-center gap-1 px-2 py-1 text-xs bg-white border rounded-md hover:bg-gray-50"
                    >
                      <Eye size={12} /> Voir
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleSecureDownload(reporting.extractionFileUrl, 'extraction_pw')
                      }
                      className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      <Download size={12} /> Télécharger
                    </button>
                  </div>
                </div>
              </div>
            )}
            {attachments.length > 0 && (
              <div className="print-break-inside">
                <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2 text-sm">
                  <FileText size={14} />
                  Pièces jointes ({attachments.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {attachments.map((attachment, index) => {
                    const filename =
                      attachment?.filename ||
                      attachment?.name ||
                      `Pièce jointe ${index + 1}`;
                    const fileUrl = attachment?.url;
                    return (
                      <div
                        key={attachment?.id || `${filename}-${index}`}
                        className="border rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow"
                      >
                        {isImage(filename) && fileUrl ? (
                          <div className="relative group">
                            <SecureImage
                              src={fileUrl}
                              alt={filename}
                              className="w-full h-32 object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleSecureView(fileUrl)}
                                className="p-2 bg-white rounded-full hover:bg-gray-100"
                                title="Voir le document"
                              >
                                <Eye size={14} />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="h-32 bg-gray-100 flex items-center justify-center">
                            {getFileIcon(filename)}
                          </div>
                        )}
                        <div className="p-2">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p
                                className="font-medium text-xs text-gray-900 truncate"
                                title={filename}
                              >
                                {filename}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleSecureDownload(fileUrl, filename)}
                              disabled={!fileUrl}
                              className="flex-shrink-0 p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded disabled:opacity-40 disabled:cursor-not-allowed"
                              title="Télécharger"
                            >
                              <Download size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      <section className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-3 text-white print:p-banner print:p-mb-1 print-compact print-break-inside">
        <h3 className="text-base font-bold flex items-center justify-center gap-2">
          <User size={18} className="text-yellow-400" />
          CG entrant : {getEmployeeName(reporting.incomingCgId)}
        </h3>
      </section>

      <div className="hidden print:block p-footer">
        {type === 'watch' ? 'Rapport de Quart' : 'Rapport CG'} — {reporting.numRef || '-'} | Site{' '}
        {getSiteName(reporting.siteId)} | Imprimé le {new Date().toLocaleString('fr-FR')}
      </div>
    </div>
  );

  if (embedded) {
    return <div className="print-area">{content}</div>;
  }

  return (
    <>
      <Drawer open={Boolean(open)} onOpenChange={closeMainDrawer}>
        <DrawerContent className="max-h-[95vh] print-area">
          <DrawerHeader className="text-left border-b pb-4 no-print">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
              <div>
                <DrawerTitle className="text-2xl font-bold text-gray-900">
                  {type === 'watch' ? 'Rapport de Quart' : 'Rapport du CG'} :{' '}
                  {getEmployeeName(reporting.createdBy)}
                </DrawerTitle>
                <DrawerDescription className="text-gray-500 mt-1">
                  {type === 'watch' ? 'Détails du Rapport de Quart' : 'Détails du rapport'} —{' '}
                  {reporting.numRef || '-'}
                </DrawerDescription>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrintPdf}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <Printer size={16} />
                  Imprimer
                </button>
                {showCreateWatchReportButton && (
                  <button
                    type="button"
                    onClick={() => handleWatchAction('create')}
                    disabled={isRefreshingWatchReport}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <FileText size={16} />
                    Créer Rapport de Quart
                  </button>
                )}
                {showEditWatchReportButton && (
                  <button
                    type="button"
                    onClick={() => handleWatchAction('edit')}
                    disabled={isRefreshingWatchReport}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <FileText size={16} />
                    Modifier Rapport de Quart
                  </button>
                )}
                {showViewWatchReportButton && (
                  <button
                    type="button"
                    onClick={() => setWatchViewOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    <Eye size={16} />
                    Voir / Imprimer le Rapport de Quart
                  </button>
                )}
              </div>
            </div>
          </DrawerHeader>

          {content}

          <DrawerFooter className="border-t no-print">
            <DrawerClose asChild>
              <button
                type="button"
                className="px-6 py-2.5 bg-gray-100 hover:bg-secondary rounded-lg transition-colors flex items-center justify-center gap-2 font-medium"
              >
                <X size={16} />
                Fermer
              </button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <Drawer open={watchDrawerOpen} onOpenChange={handleWatchDrawerChange}>
        <DrawerContent className="max-h-[95vh]">
          <div className="p-4">
            <DrawerHeader className="px-0">
              <DrawerTitle>
                {watchReportData
                  ? 'Modifier le Rapport de Quart'
                  : 'Créer un Rapport de Quart'}
              </DrawerTitle>
              <DrawerDescription>
                {watchReportData
                  ? 'Modifiez les informations du Rapport de Quart sélectionné.'
                  : 'Les données du rapport CG sont préremplies automatiquement.'}
              </DrawerDescription>
            </DrawerHeader>
            <WatchReportForm
              reportingCgId={reporting.id}
              sourceReporting={reporting}
              initialData={watchReportData}
              onSuccess={handleWatchSuccess}
              onCancel={() => handleWatchDrawerChange(false)}
            />
          </div>
        </DrawerContent>
      </Drawer>

      {showViewWatchReportButton && (
        <ReportingCgDetails
          open={watchViewOpen}
          setOpen={setWatchViewOpen}
          reporting={watchReportData}
          references={references}
          type="watch"
          userPermissions={userPermissions}
          currentUserRoles={currentUserRoles}
        />
      )}
    </>
  );
};

export default ReportingCgDetails;