// import React, { useState } from 'react';
// import {
//     Drawer,
//     DrawerClose,
//     DrawerContent,
//     DrawerDescription,
//     DrawerFooter,
//     DrawerHeader,
//     DrawerTitle,
// } from "../../ui/drawer";
// import { 
//     X, FileText, Users, HardDrive, AlertTriangle, 
//     MapPin, Clock, User, Calendar, Printer, Download, 
//     Eye, FileSpreadsheet, Image as ImageIcon, Paperclip,
//     Weight, ChevronDown, ChevronUp, FileCheck, Edit3, History
// } from 'lucide-react';
// import SecureImage from "../../ui/SecureImage";

// const ReportingCgDetails = ({ open, setOpen, reporting, references = {} }) => {
//     const { sites = [], shifts = [], employees = [] } = references;
//     const [expandedSections, setExpandedSections] = useState({
//         weighing: true,
//         incidents: true,
//         operators: false,
//         hse: false
//     });

//     const toggleSection = (section) => {
//         setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
//     };

//     const getSiteName = (id) => sites.find(s => s.id === id)?.name || id;
//     const getShiftName = (id) => shifts.find(s => s.id === id)?.name || id;
//     const getEmployeeName = (id) => employees.find(e => e.id === id)?.name || id;

//     const formatDate = (date) => date ? new Date(date).toLocaleString('fr-FR') : 'N/A';

//     if (!reporting) return null;

//     // ─── Totaux ───────────────────────────────────────────────────────
//     const totalWeighings = 
//         (reporting.completeNumberWeighingsToBeBilled || 0) +
//         (reporting.incompleteNumberWeighingsToBeBilled || 0) +
//         (reporting.testNumberWeighingsToBeBilled || 0) +
//         (reporting.numberPassagesWithoutWeighingToBeBilled || 0);

//     const totalWeighingsBySpecies = 
//         (reporting.completeNumberWeighingsBySpecies || 0) +
//         (reporting.incompleteNumberWeighingsBySpecies || 0) +
//         (reporting.testNumberWeighingsBySpecies || 0) +
//         (reporting.numberPassagesWithoutWeighingBySpecies || 0);

//     // ─── Fichiers ──────────────────────────────────────────────────────
//     const getFileIcon = (filename) => {
//         if (!filename) return <FileText size={16} />;
//         const ext = filename.split('.').pop().toLowerCase();
//         if (['xlsx', 'xls', 'csv'].includes(ext)) return <FileSpreadsheet size={16} className="text-green-600" />;
//         if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return <ImageIcon size={16} className="text-purple-600" />;
//         if (['pdf'].includes(ext)) return <FileText size={16} className="text-red-600" />;
//         return <Paperclip size={16} className="text-gray-600" />;
//     };

//     // CORRECTION: Fonction isImage améliorée pour gérer les URLs complètes
//     const isImage = (filenameOrUrl) => {
//         if (!filenameOrUrl) return false;
//         // Extraire le nom de fichier de l'URL (sans query params)
//         const filename = filenameOrUrl.split('?')[0].split('/').pop();
//         const ext = filename.split('.').pop().toLowerCase();
//         return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);
//     };

//     // NOUVEAU: Fonction de téléchargement sécurisé avec token
//     const handleSecureDownload = async (url, filename) => {
//         try {
//             const token = localStorage.getItem('token');
//             if (!token) {
//                 alert('Session expirée. Veuillez vous reconnecter.');
//                 return;
//             }

//             const response = await fetch(url, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });

//             if (!response.ok) {
//                 throw new Error('Erreur lors du téléchargement');
//             }

//             const blob = await response.blob();
//             const blobUrl = window.URL.createObjectURL(blob);
//             const a = document.createElement('a');
//             a.href = blobUrl;
//             a.download = filename || 'fichier';
//             document.body.appendChild(a);
//             a.click();
//             document.body.removeChild(a);
//             window.URL.revokeObjectURL(blobUrl);
//         } catch (error) {
//             console.error('Erreur téléchargement:', error);
//             alert('Impossible de télécharger le fichier. Veuillez réessayer.');
//         }
//     };

//     // NOUVEAU: Fonction pour voir le fichier dans un nouvel onglet (avec token)
//     const handleSecureView = async (url) => {
//         try {
//             const token = localStorage.getItem('token');
//             if (!token) {
//                 alert('Session expirée. Veuillez vous reconnecter.');
//                 return;
//             }

//             const response = await fetch(url, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });

//             if (!response.ok) {
//                 throw new Error('Erreur lors de la visualisation');
//             }

//             const blob = await response.blob();
//             const blobUrl = window.URL.createObjectURL(blob);
//             window.open(blobUrl, '_blank');
//         } catch (error) {
//             console.error('Erreur visualisation:', error);
//             alert('Impossible d\'ouvrir le fichier. Veuillez réessayer.');
//         }
//     };

//     const handlePrint = () => {
//         window.print();
//     };

//     return (
//         <>
//             {/* ═══════════════════════════════════════════════════════════
//                 STYLES D'IMPRESSION A4 – UNE SEULE PAGE
//                 ═══════════════════════════════════════════════════════════ */}
//             <style>{`
//                 @media print {
//                     @page { size: A4 portrait; margin: 8mm; }

//                     html, body {
//                         height: 297mm;
//                         width: 210mm;
//                         overflow: hidden;
//                         background: white;
//                         font-size: 9pt;
//                         line-height: 1.3;
//                     }

//                     body * { visibility: hidden; }

//                     .print-area, .print-area * { visibility: visible; }

//                     .print-area {
//                         position: absolute;
//                         left: 0;
//                         top: 0;
//                         width: 210mm;
//                         height: 297mm;
//                         padding: 0;
//                         margin: 0;
//                         overflow: hidden;
//                         background: white;
//                         box-sizing: border-box;
//                     }

//                     .print-scroll {
//                         overflow: visible !important;
//                         max-height: none !important;
//                         height: auto !important;
//                     }

//                     .no-print { display: none !important; }

//                     /* Réductions agressives pour tenir sur une page */
//                     .print-section {
//                         padding: 6px 10px !important;
//                         margin-bottom: 6px !important;
//                         border-radius: 6px !important;
//                         box-shadow: none !important;
//                         border: 1px solid #e5e7eb !important;
//                     }

//                     .print-section h2 {
//                         font-size: 11pt !important;
//                         margin-bottom: 4px !important;
//                         padding-bottom: 3px !important;
//                     }

//                     .print-section h3 {
//                         font-size: 9.5pt !important;
//                         margin-bottom: 3px !important;
//                     }

//                     .print-section h4 {
//                         font-size: 9pt !important;
//                         margin-bottom: 2px !important;
//                     }

//                     .print-section p, .print-section span, .print-section td, .print-section th, .print-section li {
//                         font-size: 8.5pt !important;
//                         line-height: 1.25 !important;
//                     }

//                     .print-cards {
//                         gap: 4px !important;
//                         margin-bottom: 6px !important;
//                     }

//                     .print-cards > div {
//                         padding: 4px 2px !important;
//                         border-radius: 4px !important;
//                     }

//                     .print-cards p.text-2xl {
//                         font-size: 14pt !important;
//                     }

//                     .print-cards p.text-xs {
//                         font-size: 7pt !important;
//                     }

//                     .print-table {
//                         margin-bottom: 4px !important;
//                     }

//                     .print-table th, .print-table td {
//                         padding: 3px 6px !important;
//                         font-size: 8pt !important;
//                     }

//                     .print-desc {
//                         padding: 6px !important;
//                         margin-top: 4px !important;
//                         border-left-width: 3px !important;
//                     }

//                     .print-desc p {
//                         font-size: 8pt !important;
//                         white-space: pre-wrap !important;
//                     }

//                     .print-attachments {
//                         gap: 4px !important;
//                     }

//                     .print-attachments > div {
//                         border-radius: 4px !important;
//                     }

//                     .print-attachments img {
//                         max-height: 60px !important;
//                         object-fit: cover !important;
//                     }

//                     .print-attachments .h-32 {
//                         height: 50px !important;
//                     }

//                     .print-operators {
//                         gap: 2px !important;
//                     }

//                     .print-operators li {
//                         padding: 2px 6px !important;
//                         border-radius: 3px !important;
//                     }

//                     .print-cg {
//                         padding: 8px 10px !important;
//                         border-radius: 6px !important;
//                     }

//                     .print-cg .w-14 {
//                         width: 32px !important;
//                         height: 32px !important;
//                     }

//                     .print-cg .text-2xl {
//                         font-size: 12pt !important;
//                     }

//                     .print-footer {
//                         margin-top: 4px !important;
//                         padding-top: 3px !important;
//                         font-size: 7pt !important;
//                     }

//                     .print-header-print {
//                         margin-bottom: 6px !important;
//                         padding-bottom: 4px !important;
//                     }

//                     .print-header-print h1 {
//                         font-size: 14pt !important;
//                     }

//                     .print-header-print p {
//                         font-size: 8.5pt !important;
//                     }

//                     .print-grid-3 {
//                         gap: 6px !important;
//                     }

//                     .print-grid-3 > div {
//                         gap: 2px !important;
//                     }

//                     .print-history {
//                         padding: 4px 8px !important;
//                         margin-bottom: 6px !important;
//                         border-radius: 4px !important;
//                     }

//                     .print-history p {
//                         font-size: 8pt !important;
//                     }
//                 }
//             `}</style>

//             <Drawer open={open} onOpenChange={setOpen}>
//                 <DrawerContent className="max-h-[95vh] print-area">

//                     {/* ═══════════════════════════════════════════════════
//                         HEADER (no-print)
//                         ═══════════════════════════════════════════════════ */}
//                     <DrawerHeader className="text-left border-b pb-4 no-print">
//                         <div className="flex justify-between items-start">
//                             <div>
//                                 <DrawerTitle className="text-2xl font-bold text-gray-900">
//                                     Rapport du CG – {getEmployeeName(reporting.createdBy)}
//                                 </DrawerTitle>
//                                 <DrawerDescription className="text-gray-500 mt-1">
//                                     Détails du rapport – {reporting.numRef}
//                                 </DrawerDescription>
//                             </div>
//                             <button 
//                                 onClick={handlePrint}
//                                 className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
//                             >
//                                 <Printer size={16} />
//                                 Imprimer
//                             </button>
//                         </div>
//                     </DrawerHeader>

//                     {/* En-tête pour impression */}
//                     <div className="hidden print:block print-header-print mb-2 border-b-2 border-gray-900 pb-2">
//                         <h1 className="text-2xl font-bold text-gray-900">Rapport CG – {reporting.numRef}</h1>
//                         <p className="text-gray-600">Site : {getSiteName(reporting.siteId)} | Quart : {getShiftName(reporting.shiftId)}</p>
//                     </div>

//                     <div className="mx-4 md:mx-8 overflow-y-auto max-h-[75vh] print-scroll print:mx-0 print:max-h-none space-y-4 pb-4">

//                         {/* ═══════════════════════════════════════════════
//                             SECTION 1: INFORMATIONS GÉNÉRALES
//                             ═══════════════════════════════════════════════ */}
//                         <section className="print-section print-break-inside bg-white border rounded-xl p-4 shadow-sm">
//                             <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2 border-b pb-2">
//                                 <FileText size={18} className="text-blue-600" />
//                                 Informations générales
//                             </h2>
//                             <div className="print-grid-3 grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
//                                 <div className="flex items-center gap-2">
//                                     <User size={14} className="text-gray-400" />
//                                     <span className="text-gray-600">Créé par :</span>
//                                     <span className="font-semibold">{getEmployeeName(reporting.createdBy)}</span>
//                                 </div>
//                                 <div className="flex items-center gap-2">
//                                     <MapPin size={14} className="text-gray-400" />
//                                     <span className="text-gray-600">Site :</span>
//                                     <span className="font-semibold">{getSiteName(reporting.siteId)}</span>
//                                 </div>
//                                 <div className="flex items-center gap-2">
//                                     <User size={14} className="text-gray-400" />
//                                     <span className="text-gray-600">Modifié par :</span>
//                                     <span className="font-semibold">{getEmployeeName(reporting.updatedBy)}</span>
//                                 </div>
                                
//                                 <div className="flex items-center gap-2">
//                                     <Calendar size={14} className="text-gray-400" />
//                                     <span className="text-gray-600">Date :</span>
//                                     <span className="font-semibold">{formatDate(reporting.createdAt)}</span>
//                                 </div>
//                                 <div className="flex items-center gap-2">
//                                     <Clock size={14} className="text-gray-400" />
//                                     <span className="text-gray-600">Quart :</span>
//                                     <span className="font-semibold">{getShiftName(reporting.shiftId)}</span>
//                                 </div>
                                
//                                 <div className="flex items-center gap-2">
//                                     <Clock size={14} className="text-gray-400" />
//                                     <span className="text-gray-600">Dernière modif :</span>
//                                     {reporting.updatedBy && (
//                                         <span className="font-semibold">{formatDate(reporting.updatedAt)}</span>
//                                     )}
//                                 </div>
//                             </div>
//                         </section>

//                         {/* ═══════════════════════════════════════════════
//                             SECTION 2: PESÉES (Prioritaire)
//                             ═══════════════════════════════════════════════ */}
//                         <section className="print-section print-break-inside bg-white border rounded-xl p-4 shadow-sm">
//                             <button 
//                                 onClick={() => toggleSection('weighing')}
//                                 className="w-full flex items-center justify-between text-left no-print"
//                             >
//                                 <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
//                                     <Weight size={18} className="text-indigo-600" />
//                                     Informations de pesée
//                                     <span className="ml-2 px-2 py-0.5 bg-indigo-100 text-indigo-800 text-xs font-bold rounded-full">
//                                         Total : {totalWeighings}
//                                     </span>
//                                     <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
//                                         Espèces : {totalWeighingsBySpecies}
//                                     </span>
//                                 </h2>
//                                 {expandedSections.weighing ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
//                             </button>

//                             <div className={`mt-3 ${expandedSections.weighing ? 'block' : 'hidden'} print:!block`}>
//                                 {/* Résumé visuel */}
//                                 <div className="print-cards grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
//                                     <div className="bg-green-50 border border-green-200 rounded-lg p-2 text-center">
//                                         <p className="text-xl font-bold text-green-700">
//                                             {reporting.completeNumberWeighingsToBeBilled || 0}
//                                         </p>
//                                         <p className="text-[10px] text-green-600 font-medium mt-0.5">Complètes à facturer</p>
//                                     </div>
//                                     <div className="bg-orange-50 border border-orange-200 rounded-lg p-2 text-center">
//                                         <p className="text-xl font-bold text-orange-700">
//                                             {reporting.incompleteNumberWeighingsToBeBilled || 0}
//                                         </p>
//                                         <p className="text-[10px] text-orange-600 font-medium mt-0.5">Incomplètes à facturer</p>
//                                     </div>
//                                     <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 text-center">
//                                         <p className="text-xl font-bold text-blue-700">
//                                             {reporting.testNumberWeighingsToBeBilled || 0}
//                                         </p>
//                                         <p className="text-[10px] text-blue-600 font-medium mt-0.5">Tests à facturer</p>
//                                     </div>
//                                     <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 text-center">
//                                         <p className="text-xl font-bold text-gray-700">
//                                             {reporting.numberPassagesWithoutWeighingToBeBilled || 0}
//                                         </p>
//                                         <p className="text-[10px] text-gray-600 font-medium mt-0.5">Sans pesée</p>
//                                     </div>
//                                 </div>

//                                 {/* Tableau détaillé */}
//                                 <div className="print-table overflow-hidden rounded-lg border border-gray-200">
//                                     <table className="w-full text-sm">
//                                         <thead className="bg-gray-50">
//                                             <tr>
//                                                 <th className="px-3 py-2 text-left font-semibold text-gray-700">Type de pesée</th>
//                                                 <th className="px-3 py-2 text-center font-semibold text-gray-700">À facturer</th>
//                                                 <th className="px-3 py-2 text-center font-semibold text-gray-700">Par espèce</th>
//                                             </tr>
//                                         </thead>
//                                         <tbody className="divide-y divide-gray-200">
//                                             <tr className="hover:bg-gray-50">
//                                                 <td className="px-3 py-2 font-medium text-gray-900">Pesées complètes</td>
//                                                 <td className="px-3 py-2 text-center font-bold text-green-600">
//                                                     {reporting.completeNumberWeighingsToBeBilled || 0}
//                                                 </td>
//                                                 <td className="px-3 py-2 text-center text-gray-600">
//                                                     {reporting.completeNumberWeighingsBySpecies || 0}
//                                                 </td>
//                                             </tr>
//                                             <tr className="hover:bg-gray-50">
//                                                 <td className="px-3 py-2 font-medium text-gray-900">Pesées incomplètes</td>
//                                                 <td className="px-3 py-2 text-center font-bold text-orange-600">
//                                                     {reporting.incompleteNumberWeighingsToBeBilled || 0}
//                                                 </td>
//                                                 <td className="px-3 py-2 text-center text-gray-600">
//                                                     {reporting.incompleteNumberWeighingsBySpecies || 0}
//                                                 </td>
//                                             </tr>
//                                             <tr className="hover:bg-gray-50">
//                                                 <td className="px-3 py-2 font-medium text-gray-900">Pesées test</td>
//                                                 <td className="px-3 py-2 text-center font-bold text-blue-600">
//                                                     {reporting.testNumberWeighingsToBeBilled || 0}
//                                                 </td>
//                                                 <td className="px-3 py-2 text-center text-gray-600">
//                                                     {reporting.testNumberWeighingsBySpecies || 0}
//                                                 </td>
//                                             </tr>
//                                             <tr className="hover:bg-gray-50">
//                                                 <td className="px-3 py-2 font-medium text-gray-900">Passages sans pesée</td>
//                                                 <td className="px-3 py-2 text-center font-bold text-gray-600">
//                                                     {reporting.numberPassagesWithoutWeighingToBeBilled || 0}
//                                                 </td>
//                                                 <td className="px-3 py-2 text-center text-gray-600">
//                                                     {reporting.numberPassagesWithoutWeighingBySpecies || 0}
//                                                 </td>
//                                             </tr>
//                                         </tbody>
//                                         <tfoot className="bg-gray-100 font-semibold">
//                                             <tr>
//                                                 <td className="px-3 py-2 text-gray-900">TOTAL</td>
//                                                 <td className="px-3 py-2 text-center text-gray-900">{totalWeighings}</td>
//                                                 <td className="px-3 py-2 text-center text-gray-900">{totalWeighingsBySpecies}</td>
//                                             </tr>
//                                         </tfoot>
//                                     </table>
//                                 </div>

//                                 {/* Description de la production */}
//                                 {reporting.productionDescription && (
//                                     <div className="print-desc mt-3 bg-green-50 border-l-4 border-green-500 p-3 rounded-r-lg">
//                                         <h4 className="font-semibold text-green-900 mb-1 flex items-center gap-2 text-sm">
//                                             <HardDrive size={14} />
//                                             Description de la production
//                                         </h4>
//                                         <p className="text-green-800 whitespace-pre-wrap text-sm leading-relaxed">
//                                             {reporting.productionDescription}
//                                         </p>
//                                     </div>
//                                 )}
//                             </div>
//                         </section>

//                         {/* ═══════════════════════════════════════════════
//                             SECTION 3: INCIDENTS
//                             ═══════════════════════════════════════════════ */}
//                         <section className="print-section print-break-inside bg-white border rounded-xl p-4 shadow-sm">
//                             <button 
//                                 onClick={() => toggleSection('incidents')}
//                                 className="w-full flex items-center justify-between text-left no-print"
//                             >
//                                 <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
//                                     <AlertTriangle size={18} className="text-red-600" />
//                                     Incidents
//                                     {(reporting.numberIncidents > 0) && (
//                                         <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-800 text-xs font-bold rounded-full">
//                                             {reporting.numberIncidents} incident{reporting.numberIncidents > 1 ? 's' : ''}
//                                         </span>
//                                     )}
//                                 </h2>
//                                 {expandedSections.incidents ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
//                             </button>

//                             <div className={`mt-3 ${expandedSections.incidents ? 'block' : 'hidden'} print:!block`}>
//                                 {reporting.numberIncidents > 0 ? (
//                                     <div className="space-y-3">
//                                         <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
//                                             <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
//                                                 <AlertTriangle size={20} className="text-red-600" />
//                                             </div>
//                                             <div>
//                                                 <p className="text-sm text-red-600 font-medium">Nombre d'incidents déclarés</p>
//                                                 <p className="text-2xl font-bold text-red-700">{reporting.numberIncidents}</p>
//                                             </div>
//                                         </div>

//                                         {reporting.incidentDescription && (
//                                             <div className="bg-red-50 border border-red-200 rounded-lg p-3">
//                                                 <h4 className="font-semibold text-red-900 mb-1 text-sm">Description détaillée</h4>
//                                                 <p className="text-red-800 whitespace-pre-wrap text-sm leading-relaxed">
//                                                     {reporting.incidentDescription}
//                                                 </p>
//                                             </div>
//                                         )}
//                                     </div>
//                                 ) : (
//                                     <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg text-gray-500">
//                                         <FileCheck size={18} />
//                                         <span className="text-sm">Aucun incident déclaré pour ce rapport</span>
//                                     </div>
//                                 )}
//                             </div>
//                         </section>

//                         {/* ═══════════════════════════════════════════════
//                             SECTION 4: PIÈCES JOINTES & EXTRACTION
//                             ═══════════════════════════════════════════════ */}
//                         {(reporting.extractionFileUrl || reporting.attachments?.length > 0) && (
//                             <section className="print-section print-break-inside bg-white border rounded-xl p-4 shadow-sm">
//                                 <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2 border-b pb-2">
//                                     <Paperclip size={18} className="text-purple-600" />
//                                     Documents joints
//                                 </h2>

//                                 <div className="space-y-3">
//                                     {/* Fichier d'extraction PW */}
//                                     {reporting.extractionFileUrl && (
//                                         <div className="print-break-inside">
//                                             <h3 className="font-semibold text-gray-700 mb-1 flex items-center gap-2 text-sm">
//                                                 <FileSpreadsheet size={14} className="text-green-600" />
//                                                 Fichier d'extraction PW
//                                             </h3>

//                                             {isImage(reporting.extractionFileUrl) ? (
//                                                 <div className="border rounded-lg overflow-hidden bg-gray-50">
//                                                     <SecureImage 
//                                                         src={reporting.extractionFileUrl} 
//                                                         alt="Extraction PW" 
//                                                         className="max-h-48 w-full object-contain cursor-pointer"
//                                                     />
//                                                     <div className="p-2 bg-white border-t flex items-center justify-between">
//                                                         <span className="text-xs text-gray-600 truncate max-w-[60%]">
//                                                             {reporting.extractionFileUrl.split('?')[0].split('/').pop()}
//                                                         </span>
//                                                         <button 
//                                                             onClick={() => handleSecureDownload(
//                                                                 reporting.extractionFileUrl,
//                                                                 reporting.extractionFileUrl.split('?')[0].split('/').pop()
//                                                             )}
//                                                             className="flex items-center gap-1 text-xs text-blue-600 hover:underline no-print"
//                                                         >
//                                                             <Download size={12} /> Télécharger
//                                                         </button>
//                                                     </div>
//                                                 </div>
//                                             ) : (
//                                                 <div className="border rounded-lg p-3 bg-gray-50 flex items-center justify-between">
//                                                     <div className="flex items-center gap-2">
//                                                         <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
//                                                             <FileSpreadsheet size={16} className="text-green-600" />
//                                                         </div>
//                                                         <div>
//                                                             <p className="font-medium text-sm text-gray-900">Extraction_PW</p>
//                                                             <p className="text-[10px] text-gray-500">{reporting.extractionFileUrl.split('?')[0].split('.').pop()?.toUpperCase()}</p>
//                                                         </div>
//                                                     </div>
//                                                     <div className="flex items-center gap-1 no-print">
//                                                         <button 
//                                                             onClick={() => handleSecureView(reporting.extractionFileUrl)}
//                                                             className="flex items-center gap-1 px-2 py-1 text-xs bg-white border rounded-md hover:bg-gray-50"
//                                                         >
//                                                             <Eye size={12} /> Voir
//                                                         </button>
//                                                         <button 
//                                                             onClick={() => handleSecureDownload(
//                                                                 reporting.extractionFileUrl,
//                                                                 reporting.extractionFileUrl.split('?')[0].split('/').pop()
//                                                             )}
//                                                             className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700"
//                                                         >
//                                                             <Download size={12} /> Télécharger
//                                                         </button>
//                                                     </div>
//                                                 </div>
//                                             )}
//                                         </div>
//                                     )}

//                                     {/* Pièces jointes */}
//                                     {reporting.attachments?.length > 0 && (
//                                         <div className="print-break-inside">
//                                             <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2 text-sm">
//                                                 <FileText size={14} />
//                                                 Pièces jointes ({reporting.attachments.length})
//                                             </h3>
//                                             <div className="print-attachments grid grid-cols-1 md:grid-cols-2 gap-2">
//                                                 {reporting.attachments.map((att, idx) => (
//                                                     <div key={att.id || idx} className="border rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow">
//                                                         {isImage(att.filename) && att.url ? (
//                                                             <div className="relative group">
//                                                                 <SecureImage 
//                                                                     src={att.url} 
//                                                                     alt={att.filename}
//                                                                     className="w-full h-32 object-cover cursor-pointer"
//                                                                 />
//                                                                 <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 no-print">
//                                                                     <button 
//                                                                         onClick={() => handleSecureView(att.url)}
//                                                                         className="p-2 bg-white rounded-full hover:bg-gray-100"
//                                                                     >
//                                                                         <Eye size={14} />
//                                                                     </button>
//                                                                 </div>
//                                                             </div>
//                                                         ) : (
//                                                             <div className="h-32 bg-gray-100 flex items-center justify-center">
//                                                                 {getFileIcon(att.filename)}
//                                                             </div>
//                                                         )}

//                                                         <div className="p-2">
//                                                             <div className="flex items-start justify-between gap-2">
//                                                                 <div className="min-w-0">
//                                                                     <p className="font-medium text-xs text-gray-900 truncate" title={att.filename}>
//                                                                         {att.filename}
//                                                                     </p>
//                                                                     <p className="text-[10px] text-gray-500 mt-0.5">
//                                                                         {att.filename?.split('.').pop()?.toUpperCase()}
//                                                                     </p>
//                                                                 </div>
//                                                                 <button 
//                                                                     onClick={() => handleSecureDownload(att.url, att.filename)}
//                                                                     className="flex-shrink-0 p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded no-print"
//                                                                     title="Télécharger"
//                                                                 >
//                                                                     <Download size={12} />
//                                                                 </button>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 ))}
//                                             </div>
//                                         </div>
//                                     )}
//                                 </div>
//                             </section>
//                         )}

//                         {/* ═══════════════════════════════════════════════
//                             SECTION 5: OPÉRATEURS & HSE
//                             ═══════════════════════════════════════════════ */}
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                             {reporting.operators?.length > 0 && (
//                                 <section className="print-section print-break-inside bg-white border rounded-xl p-4 shadow-sm">
//                                     <button 
//                                         onClick={() => toggleSection('operators')}
//                                         className="w-full flex items-center justify-between text-left no-print"
//                                     >
//                                         <h3 className="font-bold text-gray-900 flex items-center gap-2 text-sm">
//                                             <Users size={16} className="text-blue-600" />
//                                             Opérateurs
//                                             <span className="ml-1 text-xs text-gray-500">({reporting.operators.length})</span>
//                                         </h3>
//                                         {expandedSections.operators ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//                                     </button>
//                                     <div className={`mt-2 ${expandedSections.operators ? 'block' : 'hidden'} print:!block`}>
//                                         <ul className="print-operators space-y-1">
//                                             {reporting.operators.map(op => (
//                                                 <li key={op.id} className="flex items-center gap-2 p-1.5 bg-blue-50 rounded-lg">
//                                                     <User size={12} className="text-blue-500" />
//                                                     <span className="font-medium text-xs">{getEmployeeName(op.operatorId)}</span>
//                                                 </li>
//                                             ))}
//                                         </ul>
//                                     </div>
//                                 </section>
//                             )}

//                             {reporting.hses?.length > 0 && (
//                                 <section className="print-section print-break-inside bg-white border rounded-xl p-4 shadow-sm">
//                                     <button 
//                                         onClick={() => toggleSection('hse')}
//                                         className="w-full flex items-center justify-between text-left no-print"
//                                     >
//                                         <h3 className="font-bold text-gray-900 flex items-center gap-2 text-sm">
//                                             <Users size={16} className="text-green-600" />
//                                             HSE
//                                             <span className="ml-1 text-xs text-gray-500">({reporting.hses.length})</span>
//                                         </h3>
//                                         {expandedSections.hse ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//                                     </button>
//                                     <div className={`mt-2 ${expandedSections.hse ? 'block' : 'hidden'} print:!block`}>
//                                         <ul className="print-operators space-y-1">
//                                             {reporting.hses.map(h => (
//                                                 <li key={h.id} className="flex items-center gap-2 p-1.5 bg-green-50 rounded-lg">
//                                                     <User size={12} className="text-green-500" />
//                                                     <span className="font-medium text-xs">{getEmployeeName(h.hseId)}</span>
//                                                 </li>
//                                             ))}
//                                         </ul>
//                                     </div>
//                                 </section>
//                             )}
//                         </div>

//                         {/* ═══════════════════════════════════════════════
//                             SECTION 6: CG ENTRANT (En bas de fiche)
//                             ═══════════════════════════════════════════════ */}
//                         <section className="print-cg print-break-inside bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-4 text-white">
//                             <User size={20} className="text-yellow-400" />
//                             <h2 className="text-base font-bold mb-2 flex items-center gap-2">
//                                 CG Entrant : {getEmployeeName(reporting.incomingCgId)}
//                             </h2>
//                         </section>

//                         {/* Footer impression */}
//                         <div className="hidden print:block print-footer mt-2 pt-2 border-t text-[10px] text-gray-400 text-center">
//                             Rapport CG – {reporting.numRef} | Imprimé le {new Date().toLocaleString('fr-FR')}
//                         </div>
//                     </div>

//                     {/* ═══════════════════════════════════════════════════
//                         FOOTER DRAWER (no-print)
//                         ═══════════════════════════════════════════════════ */}
//                     <DrawerFooter className="border-t no-print">
//                         <DrawerClose asChild>
//                             <button className="px-6 py-2.5 bg-gray-100 hover:bg-secondary rounded-lg transition-colors flex items-center justify-center gap-2 font-medium">
//                                 <X size={16} /> Fermer
//                             </button>
//                         </DrawerClose>
//                     </DrawerFooter>
//                 </DrawerContent>
//             </Drawer>
//         </>
//     );
// };

// export default ReportingCgDetails;

// import React, { useState } from 'react';
// import {
//     Drawer,
//     DrawerClose,
//     DrawerContent,
//     DrawerDescription,
//     DrawerFooter,
//     DrawerHeader,
//     DrawerTitle,
// } from "../../ui/drawer";
// import {
//     X, FileText, Users, HardDrive, AlertTriangle,
//     MapPin, Clock, User, Calendar, Printer, Download,
//     Eye, FileSpreadsheet, Image as ImageIcon, Paperclip,
//     Weight, ChevronDown, ChevronUp, FileCheck, Package
// } from 'lucide-react';
// import SecureImage from "../../ui/SecureImage";

// const ReportingCgDetails = ({ open, setOpen, reporting, references = {} }) => {
//     const { sites = [], shifts = [], employees = [] } = references;
//     const [expandedSections, setExpandedSections] = useState({
//         weighing: true,
//         amounts: true,
//         incidents: true,
//         operators: false,
//         hse: false,
//         consumables: false
//     });

//     const toggleSection = (section) => {
//         setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
//     };

//     const getSiteName = (id) => sites.find(s => s.id === id)?.name || id || '-';
//     const getShiftName = (id) => shifts.find(s => s.id === id)?.name || id || '-';
//     const getEmployeeName = (id) => employees.find(e => e.id === id)?.name || id || '-';

//     const formatDate = (date) => date ? new Date(date).toLocaleString('fr-FR') : '-';
//     const formatDateShort = (date) => date ? new Date(date).toLocaleDateString('fr-FR') : '-';

//     if (!reporting) return null;

//     const totalWeighingsBySpecies =
//         (reporting.completeNumberWeighingsBySpecies || 0) +
//         (reporting.incompleteNumberWeighingsBySpecies || 0) +
//         (reporting.testNumberWeighingsBySpecies || 0);

//     const getFileIcon = (filename) => {
//         if (!filename) return <FileText size={16} />;
//         const ext = filename.split('.').pop().toLowerCase();
//         if (['xlsx', 'xls', 'csv'].includes(ext)) return <FileSpreadsheet size={16} className="text-green-600" />;
//         if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return <ImageIcon size={16} className="text-purple-600" />;
//         if (ext === 'pdf') return <FileText size={16} className="text-red-600" />;
//         return <Paperclip size={16} className="text-gray-600" />;
//     };

//     const isImage = (filenameOrUrl) => {
//         if (!filenameOrUrl) return false;
//         const filename = filenameOrUrl.split('?')[0].split('/').pop();
//         const ext = filename.split('.').pop().toLowerCase();
//         return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);
//     };

//     const handleSecureDownload = async (url, filename) => {
//         try {
//             const token = localStorage.getItem('token');
//             if (!token) {
//                 alert("Session expirée. Veuillez vous reconnecter.");
//                 return;
//             }
//             const response = await fetch(url, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             if (!response.ok) throw new Error('Erreur');
//             const blob = await response.blob();
//             const blobUrl = window.URL.createObjectURL(blob);
//             const a = document.createElement('a');
//             a.href = blobUrl;
//             a.download = filename || 'fichier';
//             document.body.appendChild(a);
//             a.click();
//             document.body.removeChild(a);
//             window.URL.revokeObjectURL(blobUrl);
//         } catch (error) {
//             console.error(error);
//             alert("Impossible de telecharger le fichier.");
//         }
//     };

//     const handleSecureView = async (url) => {
//         try {
//             const token = localStorage.getItem('token');
//             if (!token) {
//                 alert("Session expirée. Veuillez vous reconnecter.");
//                 return;
//             }
//             const response = await fetch(url, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             if (!response.ok) throw new Error('Erreur');
//             const blob = await response.blob();
//             const blobUrl = window.URL.createObjectURL(blob);
//             window.open(blobUrl, '_blank');
//         } catch (error) {
//             console.error(error);
//             alert("Impossible d'ouvrir le fichier.");
//         }
//     };

//     const handlePrint = () => window.print();

//     return (
//         <>
//             <style>{`
//                 @media print {
//                     @page {
//                         size: A4 portrait;
//                         margin: 6mm;
//                     }

//                     html, body {
//                         width: 210mm;
//                         height: auto;
//                         margin: 0;
//                         padding: 0;
//                         background: white !important;
//                         font-size: 8.5pt;
//                         line-height: 1.2;
//                         -webkit-print-color-adjust: exact;
//                         print-color-adjust: exact;
//                     }

//                     body * {
//                         visibility: hidden;
//                     }

//                     .print-area, .print-area * {
//                         visibility: visible;
//                     }

//                     .print-area {
//                         position: absolute;
//                         left: 0;
//                         top: 0;
//                         width: 210mm;
//                         min-height: 297mm;
//                         margin: 0;
//                         padding: 0;
//                         overflow: visible;
//                         background: white !important;
//                         box-sizing: border-box;
//                     }

//                     .no-print {
//                         display: none !important;
//                     }

//                     .print-compact {
//                         padding: 8px !important;
//                         margin-bottom: 8px !important;
//                         border-radius: 6px !important;
//                     }

//                     .print-grid-2 {
//                         grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
//                         gap: 6px !important;
//                     }

//                     .print-grid-4 {
//                         grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
//                         gap: 6px !important;
//                     }

//                     .print-break-inside {
//                         break-inside: avoid;
//                         page-break-inside: avoid;
//                     }

//                     .print-table {
//                         width: 100%;
//                         border-collapse: collapse;
//                         font-size: 8pt;
//                     }

//                     .print-table td,
//                     .print-table th {
//                         border: 1px solid #d1d5db;
//                         padding: 4px 6px;
//                         vertical-align: top;
//                     }
//                 }
//             `}</style>

//             <Drawer open={open} onOpenChange={setOpen}>
//                 <DrawerContent className="max-h-[95vh] print-area">
//                     <DrawerHeader className="text-left border-b pb-4 no-print">
//                         <div className="flex justify-between items-start gap-4">
//                             <div>
//                                 <DrawerTitle className="text-2xl font-bold text-gray-900">
//                                     Rapport du CG - {getEmployeeName(reporting.createdBy)}
//                                 </DrawerTitle>
//                                 <DrawerDescription className="text-gray-500 mt-1">
//                                     Details du rapport - {reporting.numRef}
//                                 </DrawerDescription>
//                             </div>
//                             <button
//                                 onClick={handlePrint}
//                                 className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
//                             >
//                                 <Printer size={16} />
//                                 Imprimer
//                             </button>
//                         </div>
//                     </DrawerHeader>

//                     <div className="hidden print:block mb-2 border-b-2 border-gray-900 pb-2">
//                         <h1 className="text-2xl font-bold text-gray-900">Rapport CG - {reporting.numRef}</h1>
//                         <p className="text-gray-600">
//                             Site : {getSiteName(reporting.siteId)} | Quart : {getShiftName(reporting.shiftId)}
//                         </p>
//                     </div>

//                     <div className="mx-4 md:mx-8 overflow-y-auto max-h-[75vh] print:mx-0 print:max-h-none space-y-4 pb-4">
//                         <section className="bg-white border rounded-xl p-4 shadow-sm print-compact print-break-inside">
//                             <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2 border-b pb-2">
//                                 <FileText size={18} className="text-blue-600" />
//                                 Informations generales
//                             </h2>
//                             <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
//                                 <div className="flex items-center gap-2">
//                                     <User size={14} className="text-gray-400" />
//                                     <span className="text-gray-600">Cree par :</span>
//                                     <span className="font-semibold">{getEmployeeName(reporting.createdBy)}</span>
//                                 </div>
//                                 <div className="flex items-center gap-2">
//                                     <MapPin size={14} className="text-gray-400" />
//                                     <span className="text-gray-600">Site :</span>
//                                     <span className="font-semibold">{getSiteName(reporting.siteId)}</span>
//                                 </div>
//                                 <div className="flex items-center gap-2">
//                                     <User size={14} className="text-gray-400" />
//                                     <span className="text-gray-600">Modifie par :</span>
//                                     <span className="font-semibold">{getEmployeeName(reporting.updatedBy)}</span>
//                                 </div>
//                                 <div className="flex items-center gap-2">
//                                     <Calendar size={14} className="text-gray-400" />
//                                     <span className="text-gray-600">Date :</span>
//                                     <span className="font-semibold">{formatDate(reporting.createdAt)}</span>
//                                 </div>
//                                 <div className="flex items-center gap-2">
//                                     <Clock size={14} className="text-gray-400" />
//                                     <span className="text-gray-600">Quart :</span>
//                                     <span className="font-semibold">{getShiftName(reporting.shiftId)}</span>
//                                 </div>
//                                 <div className="flex items-center gap-2">
//                                     <Clock size={14} className="text-gray-400" />
//                                     <span className="text-gray-600">Derniere modif :</span>
//                                     <span className="font-semibold">{formatDate(reporting.updatedAt)}</span>
//                                 </div>
//                             </div>
//                         </section>

//                         <section className="bg-white border rounded-xl p-4 shadow-sm print-compact print-break-inside">
//                             <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2 border-b pb-2">
//                                 <Calendar size={18} className="text-teal-600" />
//                                 Suivi des pesees
//                             </h2>

//                             <table className="print-table w-full">
//                                 <tbody>
//                                     <tr>
//                                         <th className="w-1/4 text-left bg-gray-50"> </th>
//                                         <th className="w-1/4 text-left bg-gray-50">DATE </th>
//                                         <th className="w-1/4 text-left bg-gray-50">N°PESEE </th>
//                                         <th className="w-1/4 text-left bg-gray-50">N° TRACTEUR</th>
//                                     </tr>
//                                     <tr>
//                                         <th className="w-1/4 text-left bg-gray-50">PREMIERE PESEE</th>
//                                         <td>{formatDateShort(reporting.firstWeighDate)}</td>
//                                         <td>{reporting.firstWeighNumber || '-'}</td>
//                                         <td>{reporting.firstWeighTractorNumber || '-'}</td>
//                                     </tr>
//                                     <tr>
//                                         <th className="w-1/4 text-left bg-gray-50">DERNIERE pesee</th>
//                                         <td>{formatDateShort(reporting.lastWeighDate)}</td>
//                                         <td>{reporting.lastWeighNumber || '-'}</td>
//                                         <td>{reporting.lastWeighTractorNumber || '-'}</td>
//                                     </tr>
//                                 </tbody>
//                             </table>
//                         </section>

//                         <section className="bg-white border rounded-xl p-4 shadow-sm print-compact print-break-inside">
//                             <button
//                                 onClick={() => toggleSection('weighing')}
//                                 className="w-full flex items-center justify-between text-left no-print"
//                             >
//                                 <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
//                                     <Weight size={18} className="text-indigo-600" />
//                                     Informations de pesee
//                                     <span className="ml-2 px-2 py-0.5 bg-indigo-100 text-indigo-800 text-xs font-bold rounded-full">
//                                         Especes : {totalWeighingsBySpecies}
//                                     </span>
//                                 </h2>
//                                 {expandedSections.weighing ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
//                             </button>

//                             <div className={`mt-3 ${expandedSections.weighing ? 'block' : 'hidden'} print:!block`}>
//                                 <div className="grid grid-cols-2 print-grid-4 gap-2 mb-4">
//                                     <div className="bg-green-50 border border-green-200 rounded-lg p-2 text-center">
//                                         <p className="text-xl font-bold text-green-700">{reporting.completeNumberWeighingsToBeBilled || 0}</p>
//                                         <p className="text-[10px] text-green-600 font-medium mt-0.5">Completes a facturer</p>
//                                     </div>
//                                     <div className="bg-green-50 border border-green-200 rounded-lg p-2 text-center">
//                                         <p className="text-xl font-bold text-green-700">{reporting.completeNumberWeighingsBySpecies || 0}</p>
//                                         <p className="text-[10px] text-green-600 font-medium mt-0.5">Completes espece</p>
//                                     </div>
//                                     <div className="bg-orange-50 border border-orange-200 rounded-lg p-2 text-center">
//                                         <p className="text-xl font-bold text-orange-700">{reporting.incompleteNumberWeighingsToBeBilled || 0}</p>
//                                         <p className="text-[10px] text-orange-600 font-medium mt-0.5">Incompletes a facturer</p>
//                                     </div>
//                                     <div className="bg-orange-50 border border-orange-200 rounded-lg p-2 text-center">
//                                         <p className="text-xl font-bold text-orange-700">{reporting.incompleteNumberWeighingsBySpecies || 0}</p>
//                                         <p className="text-[10px] text-orange-600 font-medium mt-0.5">Incompletes espece</p>
//                                     </div>
//                                     <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 text-center">
//                                         <p className="text-xl font-bold text-blue-700">{reporting.testNumberWeighingsBySpecies || 0}</p>
//                                         <p className="text-[10px] text-blue-600 font-medium mt-0.5">Tests espece</p>
//                                     </div>
//                                     <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 text-center">
//                                         <p className="text-xl font-bold text-gray-700">{reporting.offBridgeNumber || 0}</p>
//                                         <p className="text-[10px] text-gray-600 font-medium mt-0.5">Hors-pont</p>
//                                     </div>
//                                 </div>

//                                 <div className="overflow-hidden rounded-lg border border-gray-200">
//                                     <table className="w-full text-sm">
//                                         <thead className="bg-gray-50">
//                                             <tr>
//                                                 <th className="px-3 py-2 text-left font-semibold text-gray-700">Type de pesee</th>
//                                                 <th className="px-3 py-2 text-center font-semibold text-gray-700">A facturer</th>
//                                                 <th className="px-3 py-2 text-center font-semibold text-gray-700">Par espece</th>
//                                             </tr>
//                                         </thead>
//                                         <tbody className="divide-y divide-gray-200">
//                                             <tr className="hover:bg-gray-50">
//                                                 <td className="px-3 py-2 font-medium text-gray-900">Pesees completes</td>
//                                                 <td className="px-3 py-2 text-center font-bold text-green-600">{reporting.completeNumberWeighingsToBeBilled || 0}</td>
//                                                 <td className="px-3 py-2 text-center text-gray-600">{reporting.completeNumberWeighingsBySpecies || 0}</td>
//                                             </tr>
//                                             <tr className="hover:bg-gray-50">
//                                                 <td className="px-3 py-2 font-medium text-gray-900">Pesees incompletes</td>
//                                                 <td className="px-3 py-2 text-center font-bold text-orange-600">{reporting.incompleteNumberWeighingsToBeBilled || 0}</td>
//                                                 <td className="px-3 py-2 text-center text-gray-600">{reporting.incompleteNumberWeighingsBySpecies || 0}</td>
//                                             </tr>
//                                             <tr className="hover:bg-gray-50">
//                                                 <td className="px-3 py-2 font-medium text-gray-900">Pesees test</td>
//                                                 <td className="px-3 py-2 text-center text-gray-400">-</td>
//                                                 <td className="px-3 py-2 text-center text-gray-600">{reporting.testNumberWeighingsBySpecies || 0}</td>
//                                             </tr>
//                                         </tbody>
//                                     </table>
//                                 </div>

//                                 {reporting.productionDescription && (
//                                     <div className="mt-3 bg-green-50 border-l-4 border-green-500 p-3 rounded-r-lg">
//                                         <h4 className="font-semibold text-green-900 mb-1 flex items-center gap-2 text-sm">
//                                             <HardDrive size={14} />
//                                             Description de la production
//                                         </h4>
//                                         <p className="text-green-800 whitespace-pre-wrap text-sm leading-relaxed">
//                                             {reporting.productionDescription}
//                                         </p>
//                                     </div>
//                                 )}
//                             </div>
//                         </section>

//                         <section className="bg-white border rounded-xl p-4 shadow-sm print-compact print-break-inside">
//                             <button
//                                 onClick={() => toggleSection('amounts')}
//                                 className="w-full flex items-center justify-between text-left no-print"
//                             >
//                                 <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
//                                     <FileSpreadsheet size={18} className="text-emerald-600" />
//                                     Montants calcules
//                                 </h2>
//                                 {expandedSections.amounts ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
//                             </button>

//                             <div className={`mt-3 ${expandedSections.amounts ? 'block' : 'hidden'} print:!block`}>
//                                 <div className="grid grid-cols-2 print-grid-4 gap-3">
//                                     <div className="bg-emerald-50 p-2 rounded-lg text-center">
//                                         <p className="text-xs text-emerald-600">Total pesee</p>
//                                         <p className="text-lg font-bold text-emerald-700">{reporting.totalWeightAmount?.toFixed(2) || '0.00'}</p>
//                                     </div>
//                                     <div className="bg-emerald-50 p-2 rounded-lg text-center">
//                                         <p className="text-xs text-emerald-600">Total pesee a facturer</p>
//                                         <p className="text-lg font-bold text-emerald-700">{reporting.totalWeightAmountToBeBilled?.toFixed(2) || '0.00'}</p>
//                                     </div>
//                                     <div className="bg-blue-50 p-2 rounded-lg text-center">
//                                         <p className="text-xs text-blue-600">Total tests</p>
//                                         <p className="text-lg font-bold text-blue-700">{reporting.totalTestWeightAmount?.toFixed(2) || '0.00'}</p>
//                                     </div>
//                                     <div className="bg-gray-50 p-2 rounded-lg text-center">
//                                         <p className="text-xs text-gray-600">Total hors-pont</p>
//                                         <p className="text-lg font-bold text-gray-700">{reporting.totalTestWeightAmount?.toFixed(2) || '0.00'}</p>
//                                     </div>
//                                 </div>
//                                 <div className="mt-3 grid grid-cols-1 gap-3">
//                                     <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg text-center">
//                                         <p className="text-xs text-emerald-600 font-semibold">CHIFFRE D'AFFAIRES TTC</p>
//                                         <p className="text-xl font-bold text-emerald-700">
//                                         {(
//                                             (reporting.totalWeightAmount || 0) +
//                                             (reporting.totalWeightAmountToBeBilled || 0) +
//                                             (reporting.totalTestWeightAmount || 0)
//                                         ).toFixed(2)}
//                                         </p>
//                                     </div>
//                                 </div>
//                             </div>
//                         </section>

//                         <section className="bg-white border rounded-xl p-4 shadow-sm print-compact print-break-inside">
//                             <button
//                                 onClick={() => toggleSection('incidents')}
//                                 className="w-full flex items-center justify-between text-left no-print"
//                             >
//                                 <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
//                                     <AlertTriangle size={18} className="text-red-600" />
//                                     Incidents
//                                     {(reporting.numberIncidents > 0) && (
//                                         <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-800 text-xs font-bold rounded-full">
//                                             {reporting.numberIncidents} incident{reporting.numberIncidents > 1 ? 's' : ''}
//                                         </span>
//                                     )}
//                                 </h2>
//                                 {expandedSections.incidents ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
//                             </button>

//                             <div className={`mt-3 ${expandedSections.incidents ? 'block' : 'hidden'} print:!block`}>
//                                 {reporting.numberIncidents > 0 ? (
//                                     <div className="space-y-3">
//                                         <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
//                                             <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
//                                                 <AlertTriangle size={20} className="text-red-600" />
//                                             </div>
//                                             <div>
//                                                 <p className="text-sm text-red-600 font-medium">Nombre d'incidents declares</p>
//                                                 <p className="text-2xl font-bold text-red-700">{reporting.numberIncidents}</p>
//                                             </div>
//                                         </div>

//                                         {reporting.incidentDescription && (
//                                             <div className="bg-red-50 border border-red-200 rounded-lg p-3">
//                                                 <h4 className="font-semibold text-red-900 mb-1 text-sm">Description detaillee</h4>
//                                                 <p className="text-red-800 whitespace-pre-wrap text-sm leading-relaxed">
//                                                     {reporting.incidentDescription}
//                                                 </p>
//                                             </div>
//                                         )}
//                                     </div>
//                                 ) : (
//                                     <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg text-gray-500">
//                                         <FileCheck size={18} />
//                                         <span className="text-sm">Aucun incident declare pour ce rapport</span>
//                                     </div>
//                                 )}
//                             </div>
//                         </section>

//                         <section className="bg-white border rounded-xl p-4 shadow-sm no-print">
//                             <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2 border-b pb-2">
//                                 <Paperclip size={18} className="text-purple-600" />
//                                 Documents joints
//                             </h2>

//                             <div className="space-y-3">
//                                 {reporting.extractionFileUrl && (
//                                     <div className="print-break-inside">
//                                         <h3 className="font-semibold text-gray-700 mb-1 flex items-center gap-2 text-sm">
//                                             <FileSpreadsheet size={14} className="text-green-600" />
//                                             Fichier d'extraction PW
//                                         </h3>
//                                         <div className="border rounded-lg p-3 bg-gray-50 flex items-center justify-between">
//                                             <div className="flex items-center gap-2">
//                                                 <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
//                                                     <FileSpreadsheet size={16} className="text-green-600" />
//                                                 </div>
//                                                 <div>
//                                                     <p className="font-medium text-sm text-gray-900">Extraction_PW</p>
//                                                 </div>
//                                             </div>
//                                             <div className="flex items-center gap-1 no-print">
//                                                 <button
//                                                     onClick={() => handleSecureView(reporting.extractionFileUrl)}
//                                                     className="flex items-center gap-1 px-2 py-1 text-xs bg-white border rounded-md hover:bg-gray-50"
//                                                 >
//                                                     <Eye size={12} /> Voir
//                                                 </button>
//                                                 <button
//                                                     onClick={() => handleSecureDownload(reporting.extractionFileUrl, 'extraction_pw')}
//                                                     className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700"
//                                                 >
//                                                     <Download size={12} /> Telecharger
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 )}

//                                 {reporting.attachments?.length > 0 && (
//                                     <div className="print-break-inside">
//                                         <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2 text-sm">
//                                             <FileText size={14} />
//                                             Pieces jointes ({reporting.attachments.length})
//                                         </h3>
//                                         <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//                                             {reporting.attachments.map((att, idx) => (
//                                                 <div key={att.id || idx} className="border rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow">
//                                                     {isImage(att.filename) && att.url ? (
//                                                         <div className="relative group">
//                                                             <SecureImage
//                                                                 src={att.url}
//                                                                 alt={att.filename}
//                                                                 className="w-full h-32 object-cover"
//                                                             />
//                                                             <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 no-print">
//                                                                 <button
//                                                                     onClick={() => handleSecureView(att.url)}
//                                                                     className="p-2 bg-white rounded-full hover:bg-gray-100"
//                                                                 >
//                                                                     <Eye size={14} />
//                                                                 </button>
//                                                             </div>
//                                                         </div>
//                                                     ) : (
//                                                         <div className="h-32 bg-gray-100 flex items-center justify-center">
//                                                             {getFileIcon(att.filename)}
//                                                         </div>
//                                                     )}

//                                                     <div className="p-2">
//                                                         <div className="flex items-start justify-between gap-2">
//                                                             <div className="min-w-0">
//                                                                 <p className="font-medium text-xs text-gray-900 truncate" title={att.filename}>
//                                                                     {att.filename}
//                                                                 </p>
//                                                             </div>
//                                                             <button
//                                                                 onClick={() => handleSecureDownload(att.url, att.filename)}
//                                                                 className="flex-shrink-0 p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded no-print"
//                                                                 title="Telecharger"
//                                                             >
//                                                                 <Download size={12} />
//                                                             </button>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>
//                         </section>

//                         {reporting.outOfStockConsumableReportingCgs?.length > 0 && (
//                             <section className="bg-white border rounded-xl p-4 shadow-sm print-compact print-break-inside">
//                                 <button
//                                     onClick={() => toggleSection('consumables')}
//                                     className="w-full flex items-center justify-between text-left no-print"
//                                 >
//                                     <h3 className="font-bold text-gray-900 flex items-center gap-2 text-sm">
//                                         <Package size={16} className="text-amber-600" />
//                                         Consommables en rupture
//                                         <span className="ml-1 text-xs text-gray-500">
//                                             ({reporting.outOfStockConsumableReportingCgs.length})
//                                         </span>
//                                     </h3>
//                                     {expandedSections.consumables ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//                                 </button>
//                                 <div className={`mt-2 ${expandedSections.consumables ? 'block' : 'hidden'} print:!block`}>
//                                     <div className="flex flex-wrap gap-2">
//                                         {reporting.outOfStockConsumableReportingCgs.map(c => (
//                                             <span key={c.id} className="bg-amber-100 text-amber-800 px-3 py-1.5 rounded-lg text-sm font-medium">
//                                                 {c.consumable?.name || c.consumableId}
//                                             </span>
//                                         ))}
//                                     </div>
//                                 </div>
//                             </section>
//                         )}

//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                             {reporting.operators?.length > 0 && (
//                                 <section className="bg-white border rounded-xl p-4 shadow-sm print-compact print-break-inside">
//                                     <button
//                                         onClick={() => toggleSection('operators')}
//                                         className="w-full flex items-center justify-between text-left no-print"
//                                     >
//                                         <h3 className="font-bold text-gray-900 flex items-center gap-2 text-sm">
//                                             <Users size={16} className="text-blue-600" />
//                                             Operateurs
//                                             <span className="ml-1 text-xs text-gray-500">({reporting.operators.length})</span>
//                                         </h3>
//                                         {expandedSections.operators ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//                                     </button>
//                                     <div className={`mt-2 ${expandedSections.operators ? 'block' : 'hidden'} print:!block`}>
//                                         <ul className="space-y-1">
//                                             {reporting.operators.map(op => (
//                                                 <li key={op.id} className="flex items-center gap-2 p-1.5 bg-blue-50 rounded-lg">
//                                                     <User size={12} className="text-blue-500" />
//                                                     <span className="font-medium text-xs">{getEmployeeName(op.operatorId)}</span>
//                                                 </li>
//                                             ))}
//                                         </ul>
//                                     </div>
//                                 </section>
//                             )}

//                             {reporting.hses?.length > 0 && (
//                                 <section className="bg-white border rounded-xl p-4 shadow-sm print-compact print-break-inside">
//                                     <button
//                                         onClick={() => toggleSection('hse')}
//                                         className="w-full flex items-center justify-between text-left no-print"
//                                     >
//                                         <h3 className="font-bold text-gray-900 flex items-center gap-2 text-sm">
//                                             <Users size={16} className="text-green-600" />
//                                             HSE
//                                             <span className="ml-1 text-xs text-gray-500">({reporting.hses.length})</span>
//                                         </h3>
//                                         {expandedSections.hse ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//                                     </button>
//                                     <div className={`mt-2 ${expandedSections.hse ? 'block' : 'hidden'} print:!block`}>
//                                         <ul className="space-y-1">
//                                             {reporting.hses.map(h => (
//                                                 <li key={h.id} className="flex items-center gap-2 p-1.5 bg-green-50 rounded-lg">
//                                                     <User size={12} className="text-green-500" />
//                                                     <span className="font-medium text-xs">{getEmployeeName(h.hseId)}</span>
//                                                 </li>
//                                             ))}
//                                         </ul>
//                                     </div>
//                                 </section>
//                             )}
//                         </div>

//                         <section className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-4 text-white print-break-inside">
//                             <h2 className="text-base font-bold mb-1 flex items-center gap-2">
//                                 <User size={20} className="text-yellow-400" />
//                                 CG Entrant : {getEmployeeName(reporting.incomingCgId)}
//                             </h2>
//                         </section>

//                         <div className="hidden print:block mt-2 pt-2 border-t text-[10px] text-gray-400 text-center">
//                             Rapport CG - {reporting.numRef} | Imprime le {new Date().toLocaleString('fr-FR')}
//                         </div>
//                     </div>

//                     <DrawerFooter className="border-t no-print">
//                         <DrawerClose asChild>
//                             <button className="px-6 py-2.5 bg-gray-100 hover:bg-secondary rounded-lg transition-colors flex items-center justify-center gap-2 font-medium">
//                                 <X size={16} /> Fermer
//                             </button>
//                         </DrawerClose>
//                     </DrawerFooter>
//                 </DrawerContent>
//             </Drawer>
//         </>
//     );
// };

// export default ReportingCgDetails;

import React, { useState } from 'react';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "../../ui/drawer";
import {
    X, FileText, Users, AlertTriangle,
    Calendar, Printer, FileSpreadsheet, Image as ImageIcon, Paperclip,
    Weight, ChevronDown, ChevronUp, FileCheck, Package, User,
    HardDrive, MapPin, Clock, Download, Eye
} from 'lucide-react';
import SecureImage from "../../ui/SecureImage";

const ReportingCgDetails = ({ open, setOpen, reporting, references = {} }) => {
    const { sites = [], shifts = [], employees = [] } = references;
    const [expandedSections, setExpandedSections] = useState({
        weighing: true,
        amounts: true,
        incidents: true,
        operators: false,
        hse: false,
        consumables: false
    });

    const toggleSection = (section) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const getSiteName = (id) => sites.find(s => s.id === id)?.name || id || '-';
    const getShiftName = (id) => shifts.find(s => s.id === id)?.name || id || '-';
    const getEmployeeName = (id) => employees.find(e => e.id === id)?.name || id || '-';

    const formatDate = (date) => date ? new Date(date).toLocaleString('fr-FR') : '-';
    const formatDateShort = (date) => date ? new Date(date).toLocaleDateString('fr-FR') : '-';

    // ✅ Séparateur de milliers — convention française (espace + virgule décimale)
    const formatNumber = (value, decimals = 0) => {
        if (value === null || value === undefined) return '-';
        return new Intl.NumberFormat('fr-FR', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        }).format(value);
    };

    if (!reporting) return null;

    // Totaux pesées
    const totalWeighingsBySpecies =
        (reporting.completeNumberWeighingsBySpecies || 0) +
        (reporting.incompleteNumberWeighingsBySpecies || 0) +
        (reporting.testNumberWeighingsBySpecies || 0);

    // Total Chiffre d'Affaires TTC (inclut totalOffBridgeAmount)
    const totalRevenue =
        (reporting.totalWeightAmount || 0) +
        (reporting.totalWeightAmountToBeBilled || 0) +
        (reporting.totalTestWeightAmount || 0) +
        (reporting.totalOffBridgeAmount || 0);

    const getFileIcon = (filename) => {
        if (!filename) return <FileText size={16} />;
        const ext = filename.split('.').pop().toLowerCase();
        if (['xlsx', 'xls', 'csv'].includes(ext)) return <FileSpreadsheet size={16} className="text-green-600" />;
        if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return <ImageIcon size={16} className="text-purple-600" />;
        if (ext === 'pdf') return <FileText size={16} className="text-red-600" />;
        return <Paperclip size={16} className="text-gray-600" />;
    };

    const isImage = (filenameOrUrl) => {
        if (!filenameOrUrl) return false;
        const filename = filenameOrUrl.split('?')[0].split('/').pop();
        const ext = filename.split('.').pop().toLowerCase();
        return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);
    };

    const handleSecureDownload = async (url, filename) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert("Session expiree. Veuillez vous reconnecter.");
                return;
            }
            const response = await fetch(url, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) throw new Error('Erreur');
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = filename || 'fichier';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error(error);
            alert("Impossible de telecharger le fichier.");
        }
    };

    const handleSecureView = async (url) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert("Session expiree. Veuillez vous reconnecter.");
                return;
            }
            const response = await fetch(url, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) throw new Error('Erreur');
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            window.open(blobUrl, '_blank');
        } catch (error) {
            console.error(error);
            alert("Impossible d'ouvrir le fichier.");
        }
    };

    const handlePrint = () => window.print();

    return (
        <>
            <style>{`
                @media print {
                    @page {
                        size: A4 portrait;
                        margin: 1.5mm;
                    }

                    * {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                        box-sizing: border-box;
                    }

                    html, body {
                        width: 207mm;
                        height: 294mm;
                        margin: 0 auto;
                        padding: 0;
                        background: white !important;
                        overflow: hidden;
                        font-family: 'Segoe UI', Arial, sans-serif;
                    }

                    body * {
                        visibility: hidden;
                    }

                    .print-area, .print-area * {
                        visibility: visible;
                    }

                    .print-area {
                        position: absolute;
                        left: 50%;
                        top: 0;
                        transform: translateX(-50%);
                        width: 207mm;
                        height: 294mm;
                        margin: 0;
                        padding: 2mm 3mm;
                        overflow: hidden;
                        background: white !important;
                        display: flex;
                        flex-direction: column;
                    }

                    .print-content {
                        flex: 1;
                        display: flex;
                        flex-direction: column;
                        gap: 2mm;
                        overflow: hidden;
                    }

                    .no-print {
                        display: none !important;
                    }

                    .print-compact {
                        padding: 8px !important;
                        margin-bottom: 8px !important;
                        border-radius: 6px !important;
                    }

                    .print-break-inside {
                        break-inside: avoid;
                        page-break-inside: avoid;
                    }

                    .print-grid-4 {
                        grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
                        gap: 6px !important;
                    }

                    .print-table {
                        width: 100%;
                        border-collapse: collapse;
                        font-size: 8pt;
                    }

                    .print-table td,
                    .print-table th {
                        border: 1px solid #d1d5db;
                        padding: 4px 6px;
                        vertical-align: top;
                    }

                    /* ===== PRINT HEADER ===== */
                    .p-header {
                        text-align: center;
                        border-bottom: 1.5pt solid #1a1a1a;
                        padding-bottom: 2mm;
                        margin-bottom: 1mm;
                    }
                    .p-header h1 {
                        font-size: 14pt;
                        font-weight: 800;
                        color: #1a1a1a;
                        margin: 0 0 1mm 0;
                        letter-spacing: 0.5pt;
                    }
                    .p-header-meta {
                        font-size: 8pt;
                        color: #555;
                        display: flex;
                        justify-content: center;
                        gap: 8mm;
                    }

                    /* ===== SECTION CARDS ===== */
                    .p-section {
                        border: 0.5pt solid #d1d5db;
                        border-radius: 2mm;
                        padding: 2mm 2.5mm;
                        background: #fafafa;
                    }
                    .p-section-title {
                        font-size: 9pt;
                        font-weight: 700;
                        color: #1a1a1a;
                        margin: 0 0 1.5mm 0;
                        padding-bottom: 1mm;
                        border-bottom: 0.5pt solid #e5e7eb;
                        display: flex;
                        align-items: center;
                        gap: 2mm;
                    }

                    /* ===== INFO GRID ===== */
                    .p-info-grid {
                        display: grid;
                        grid-template-columns: repeat(3, 1fr);
                        gap: 1mm 3mm;
                    }
                    .p-info-item {
                        display: flex;
                        align-items: baseline;
                        gap: 1.5mm;
                        font-size: 8pt;
                        line-height: 1.3;
                    }
                    .p-info-label {
                        color: #6b7280;
                        font-weight: 500;
                        white-space: nowrap;
                    }
                    .p-info-value {
                        font-weight: 600;
                        color: #1a1a1a;
                    }

                    /* ===== TABLE STYLES ===== */
                    .p-table {
                        width: 100%;
                        border-collapse: collapse;
                        font-size: 8pt;
                    }
                    .p-table th {
                        background: #f3f4f6;
                        font-weight: 600;
                        text-align: left;
                        padding: 1.5mm 2mm;
                        border: 0.5pt solid #d1d5db;
                        color: #374151;
                        font-size: 7.5pt;
                    }
                    .p-table td {
                        padding: 1.5mm 2mm;
                        border: 0.5pt solid #d1d5db;
                        vertical-align: middle;
                    }
                    .p-table .p-num {
                        text-align: center;
                        font-weight: 600;
                    }
                    .p-table .p-right {
                        text-align: right;
                        font-weight: 600;
                    }
                    .p-table tr:nth-child(even) {
                        background: #f9fafb;
                    }

                    /* ===== STAT CARDS (compact) ===== */
                    .p-stats {
                        display: grid;
                        grid-template-columns: repeat(6, 1fr);
                        gap: 2mm;
                    }
                    .p-stat {
                        border: 0.5pt solid #e5e7eb;
                        border-radius: 1.5mm;
                        padding: 2mm 1mm;
                        text-align: center;
                        background: white;
                    }
                    .p-stat-value {
                        font-size: 13pt;
                        font-weight: 800;
                        line-height: 1;
                    }
                    .p-stat-label {
                        font-size: 6.5pt;
                        color: #6b7280;
                        margin-top: 1mm;
                        font-weight: 500;
                    }

                    /* ===== AMOUNT CARDS ===== */
                    .p-amounts {
                        display: grid;
                        grid-template-columns: repeat(4, 1fr);
                        gap: 2mm;
                    }
                    .p-amount {
                        border: 0.5pt solid #e5e7eb;
                        border-radius: 1.5mm;
                        padding: 2mm;
                        text-align: center;
                        background: white;
                    }
                    .p-amount-value {
                        font-size: 11pt;
                        font-weight: 800;
                        line-height: 1;
                    }
                    .p-amount-label {
                        font-size: 6.5pt;
                        color: #6b7280;
                        margin-top: 1mm;
                        font-weight: 500;
                    }
                    .p-amount-unit {
                        font-size: 6pt;
                        color: #9ca3af;
                    }

                    /* ===== TAGS ===== */
                    .p-tags {
                        display: flex;
                        flex-wrap: wrap;
                        gap: 1.5mm;
                    }
                    .p-tag {
                        padding: 1mm 2.5mm;
                        border-radius: 1mm;
                        font-size: 7.5pt;
                        font-weight: 500;
                    }
                    .p-tag-blue { background: #dbeafe; color: #1e40af; }
                    .p-tag-green { background: #dcfce7; color: #166534; }
                    .p-tag-amber { background: #fef3c7; color: #92400e; }
                    .p-tag-red { background: #fee2e2; color: #991b1b; }

                    /* ===== TWO COLUMN LAYOUT ===== */
                    .p-two-col {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 2mm;
                    }

                    /* ===== DESCRIPTION BOXES ===== */
                    .p-desc {
                        border-left: 2pt solid;
                        padding: 2mm;
                        border-radius: 0 1mm 1mm 0;
                        font-size: 8pt;
                        line-height: 1.4;
                        margin-top: 1.5mm;
                    }
                    .p-desc-red {
                        background: #fef2f2;
                        border-color: #dc2626;
                        color: #7f1d1d;
                    }
                    .p-desc-green {
                        background: #f0fdf4;
                        border-color: #16a34a;
                        color: #14532d;
                    }

                    /* ===== CG BANNER ===== */
                    .p-banner {
                        background: #1a1a1a !important;
                        color: white !important;
                        border-radius: 1.5mm;
                        padding: 2.5mm;
                        text-align: center;
                    }
                    .p-banner h3 {
                        color: white !important;
                        font-size: 10pt;
                        margin: 0;
                        font-weight: 700;
                    }

                    /* ===== FOOTER ===== */
                    .p-footer {
                        margin-top: auto;
                        padding-top: 1.5mm;
                        border-top: 0.5pt solid #d1d5db;
                        font-size: 6.5pt;
                        color: #9ca3af;
                        text-align: center;
                    }

                    /* ===== COMPACT HELPERS ===== */
                    .p-mb-1 { margin-bottom: 1mm; }
                    .p-mb-2 { margin-bottom: 2mm; }
                    .p-flex { display: flex; }
                    .p-items-center { align-items: center; }
                    .p-gap-1 { gap: 1mm; }
                    .p-text-xs { font-size: 7.5pt; }
                    .p-font-bold { font-weight: 700; }
                    .p-text-gray { color: #6b7280; }
                }
            `}</style>

            <Drawer open={open} onOpenChange={setOpen}>
                <DrawerContent className="max-h-[95vh] print-area">

                    {/* ===== SCREEN HEADER ===== */}
                    <DrawerHeader className="text-left border-b pb-4 no-print">
                        <div className="flex justify-between items-start gap-4">
                            <div>
                                <DrawerTitle className="text-2xl font-bold text-gray-900">
                                    Rapport du CG - {getEmployeeName(reporting.createdBy)}
                                </DrawerTitle>
                                <DrawerDescription className="text-gray-500 mt-1">
                                    Details du rapport - {reporting.numRef}
                                </DrawerDescription>
                            </div>
                            <button
                                onClick={handlePrint}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                            >
                                <Printer size={16} />
                                Imprimer
                            </button>
                        </div>
                    </DrawerHeader>

                    {/* ===== PRINT CONTENT ===== */}
                    <div className="print-content mx-4 md:mx-8 overflow-y-auto max-h-[75vh] print:mx-0 print:max-h-none pb-4">

                        {/* HEADER */}
                        <div className="hidden print:block p-header">
                            <h1>RAPPORT DE PESÉE CG</h1>
                            <div className="p-header-meta">
                                <span><strong>Ref:</strong> {reporting.numRef}</span>
                                <span><strong>Site:</strong> {getSiteName(reporting.siteId)}</span>
                                <span><strong>Quart:</strong> {getShiftName(reporting.shiftId)}</span>
                                <span><strong>Date:</strong> {formatDateShort(reporting.createdAt)}</span>
                            </div>
                        </div>

                        {/* SECTION 1: INFOS GENERALES */}
                        <section className="bg-white border rounded-xl p-4 shadow-sm print:p-section print:p-mb-1 print-compact print-break-inside">
                            <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2 border-b pb-2 print:p-section-title">
                                <FileText size={16} className="text-blue-600" />
                                Informations generales
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm print:p-info-grid">
                                <div className="flex items-center gap-2 print:p-info-item">
                                    <span className="text-gray-600 print:p-info-label">Reference :</span>
                                    <span className="font-semibold print:p-info-value">{reporting.numRef}</span>
                                </div>
                                <div className="flex items-center gap-2 print:p-info-item">
                                    <span className="text-gray-600 print:p-info-label">Site :</span>
                                    <span className="font-semibold print:p-info-value">{getSiteName(reporting.siteId)}</span>
                                </div>
                                <div className="flex items-center gap-2 print:p-info-item">
                                    <span className="text-gray-600 print:p-info-label">Quart :</span>
                                    <span className="font-semibold print:p-info-value">{getShiftName(reporting.shiftId)}</span>
                                </div>
                                <div className="flex items-center gap-2 print:p-info-item">
                                    <span className="text-gray-600 print:p-info-label">Cree par :</span>
                                    <span className="font-semibold print:p-info-value">{getEmployeeName(reporting.createdBy)}</span>
                                </div>
                                <div className="flex items-center gap-2 print:p-info-item">
                                    <span className="text-gray-600 print:p-info-label">Date :</span>
                                    <span className="font-semibold print:p-info-value">{formatDate(reporting.createdAt)}</span>
                                </div>
                                <div className="flex items-center gap-2 print:p-info-item">
                                    <span className="text-gray-600 print:p-info-label">Modifie par :</span>
                                    <span className="font-semibold print:p-info-value">{getEmployeeName(reporting.updatedBy) || '-'}</span>
                                </div>
                            </div>
                        </section>

                        {/* SECTION 2: SUIVI PESEES (tableau unique) */}
                        <section className="bg-white border rounded-xl p-4 shadow-sm print:p-section print:p-mb-1 print-compact print-break-inside">
                            <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2 border-b pb-2 print:p-section-title">
                                <Calendar size={16} className="text-teal-600" />
                                Suivi des pesees
                            </h2>
                            <table className="w-full text-sm print:p-table print-table">
                                <thead>
                                    <tr>
                                        <th className="text-left bg-gray-50"></th>
                                        <th className="text-left bg-gray-50">DATE</th>
                                        <th className="text-left bg-gray-50">N PESEE</th>
                                        <th className="text-left bg-gray-50">N TRACTEUR</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="font-semibold">PREMIERE PESEE</td>
                                        <td>{formatDateShort(reporting.firstWeighDate)}</td>
                                        <td>{reporting.firstWeighNumber || '-'}</td>
                                        <td>{reporting.firstWeighTractorNumber || '-'}</td>
                                    </tr>
                                    <tr>
                                        <td className="font-semibold">DERNIERE PESEE</td>
                                        <td>{formatDateShort(reporting.lastWeighDate)}</td>
                                        <td>{reporting.lastWeighNumber || '-'}</td>
                                        <td>{reporting.lastWeighTractorNumber || '-'}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </section>

                        {/* SECTION 3: RECAPITULATIF PESEES (tableau + stats) */}
                        <section className="bg-white border rounded-xl p-4 shadow-sm print:p-section print:p-mb-1 print-compact print-break-inside">
                            <button
                                onClick={() => toggleSection('weighing')}
                                className="w-full flex items-center justify-between text-left no-print"
                            >
                                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <Weight size={16} className="text-indigo-600" />
                                    Recapitulatif des pesees
                                    {/* ✅ Badge avec séparateur de milliers */}
                                    <span className="ml-2 px-2 py-0.5 bg-indigo-100 text-indigo-800 text-xs font-bold rounded-full">
                                        Especes: {formatNumber(totalWeighingsBySpecies)}
                                    </span>
                                </h2>
                                {expandedSections.weighing ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>

                            <div className={`mt-3 ${expandedSections.weighing ? 'block' : 'hidden'} print:!block`}>
                                {/* Stats compactes */}
                                <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-3 print:p-stats">
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-2 text-center print:p-stat">
                                        {/* ✅ */}
                                        <p className="text-lg font-bold text-green-700 print:p-stat-value">{formatNumber(reporting.completeNumberWeighingsToBeBilled || 0)}</p>
                                        <p className="text-[10px] text-green-600 print:p-stat-label">Compl. facturer</p>
                                    </div>
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-2 text-center print:p-stat">
                                        {/* ✅ */}
                                        <p className="text-lg font-bold text-green-700 print:p-stat-value">{formatNumber(reporting.completeNumberWeighingsBySpecies || 0)}</p>
                                        <p className="text-[10px] text-green-600 print:p-stat-label">Compl. espece</p>
                                    </div>
                                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-2 text-center print:p-stat">
                                        {/* ✅ */}
                                        <p className="text-lg font-bold text-orange-700 print:p-stat-value">{formatNumber(reporting.incompleteNumberWeighingsToBeBilled || 0)}</p>
                                        <p className="text-[10px] text-orange-600 print:p-stat-label">Incompl. facturer</p>
                                    </div>
                                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-2 text-center print:p-stat">
                                        {/* ✅ */}
                                        <p className="text-lg font-bold text-orange-700 print:p-stat-value">{formatNumber(reporting.incompleteNumberWeighingsBySpecies || 0)}</p>
                                        <p className="text-[10px] text-orange-600 print:p-stat-label">Incompl. espece</p>
                                    </div>
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 text-center print:p-stat">
                                        {/* ✅ */}
                                        <p className="text-lg font-bold text-blue-700 print:p-stat-value">{formatNumber(reporting.testNumberWeighingsBySpecies || 0)}</p>
                                        <p className="text-[10px] text-blue-600 print:p-stat-label">Tests espece</p>
                                    </div>
                                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 text-center print:p-stat">
                                        {/* ✅ */}
                                        <p className="text-lg font-bold text-gray-700 print:p-stat-value">{formatNumber(reporting.offBridgeNumber || 0)}</p>
                                        <p className="text-[10px] text-gray-600 print:p-stat-label">Hors-pont</p>
                                    </div>
                                </div>

                                {/* Tableau detaille */}
                                <table className="w-full text-sm print:p-table">
                                    <thead>
                                        <tr>
                                            <th>Type de pesee</th>
                                            <th className="p-num">A facturer</th>
                                            <th className="p-num">Par espece</th>
                                            <th className="p-right">Montant (CFA)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="font-medium">Pesees completes</td>
                                            {/* ✅ */}
                                            <td className="p-num text-green-700">{formatNumber(reporting.completeNumberWeighingsToBeBilled || 0)}</td>
                                            <td className="p-num">{formatNumber(reporting.completeNumberWeighingsBySpecies || 0)}</td>
                                            <td className="p-right">-</td>
                                        </tr>
                                        <tr>
                                            <td className="font-medium">Pesees incompletes</td>
                                            {/* ✅ */}
                                            <td className="p-num text-orange-700">{formatNumber(reporting.incompleteNumberWeighingsToBeBilled || 0)}</td>
                                            <td className="p-num">{formatNumber(reporting.incompleteNumberWeighingsBySpecies || 0)}</td>
                                            <td className="p-right">-</td>
                                        </tr>
                                        <tr>
                                            <td className="font-medium">Pesees test</td>
                                            <td className="p-num text-gray-400">-</td>
                                            {/* ✅ */}
                                            <td className="p-num text-blue-700">{formatNumber(reporting.testNumberWeighingsBySpecies || 0)}</td>
                                            <td className="p-right text-blue-700">{formatNumber(reporting.totalTestWeightAmount || 0, 2)}</td>
                                        </tr>
                                        <tr className="bg-gray-100 font-bold">
                                            <td>TOTAL</td>
                                            {/* ✅ */}
                                            <td className="p-num">{formatNumber((reporting.completeNumberWeighingsToBeBilled || 0) + (reporting.incompleteNumberWeighingsToBeBilled || 0))}</td>
                                            <td className="p-num">{formatNumber(totalWeighingsBySpecies)}</td>
                                            <td className="p-right">{formatNumber(reporting.totalTestWeightAmount || 0, 2)}</td>
                                        </tr>
                                    </tbody>
                                </table>

                                {reporting.productionDescription && (
                                    <div className="mt-2 bg-green-50 border-l-4 border-green-500 p-2 rounded-r-lg print:p-desc print:p-desc-green">
                                        <strong className="text-green-900 text-xs">Production:</strong>
                                        <span className="text-green-800 text-xs ml-1">{reporting.productionDescription}</span>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* SECTION 4: MONTANTS */}
                        <section className="bg-white border rounded-xl p-4 shadow-sm print:p-section print:p-mb-1 print-compact print-break-inside">
                            <button
                                onClick={() => toggleSection('amounts')}
                                className="w-full flex items-center justify-between text-left no-print"
                            >
                                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <FileSpreadsheet size={18} className="text-emerald-600" />
                                    Montants calcules
                                </h2>
                                {expandedSections.amounts ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                            </button>

                            <div className={`mt-3 ${expandedSections.amounts ? 'block' : 'hidden'} print:!block`}>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 print:p-amounts print-grid-4">

                                    <div className="bg-emerald-50 border border-emerald-200 p-2 rounded-lg text-center print:p-amount">
                                        <p className="text-xs text-emerald-600 print:p-amount-label">Total pesée en Espèce</p>
                                        {/* ✅ */}
                                        <p className="text-lg font-bold text-emerald-700 print:p-amount-value">{formatNumber(reporting.totalWeightAmount || 0, 2)}</p>
                                        <p className="text-[10px] text-emerald-500 print:p-amount-unit">CFA</p>
                                    </div>

                                    <div className="bg-emerald-50 border border-emerald-200 p-2 rounded-lg text-center print:p-amount">
                                        <p className="text-xs text-emerald-600 print:p-amount-label">Total pesée à facturer</p>
                                        {/* ✅ */}
                                        <p className="text-lg font-bold text-emerald-700 print:p-amount-value">{formatNumber(reporting.totalWeightAmountToBeBilled || 0, 2)}</p>
                                        <p className="text-[10px] text-emerald-500 print:p-amount-unit">CFA</p>
                                    </div>

                                    <div className="bg-blue-50 border border-blue-200 p-2 rounded-lg text-center print:p-amount">
                                        <p className="text-xs text-blue-600 print:p-amount-label">Total tests</p>
                                        {/* ✅ */}
                                        <p className="text-lg font-bold text-blue-700 print:p-amount-value">{formatNumber(reporting.totalTestWeightAmount || 0, 2)}</p>
                                        <p className="text-[10px] text-blue-500 print:p-amount-unit">CFA</p>
                                    </div>

                                    <div className="bg-gray-50 border border-gray-200 p-2 rounded-lg text-center print:p-amount">
                                        <p className="text-xs text-gray-600 print:p-amount-label">Total hors-pont</p>
                                        {/* ✅ */}
                                        <p className="text-lg font-bold text-gray-700 print:p-amount-value">{formatNumber(reporting.totalOffBridgeAmount || 0, 2)}</p>
                                        <p className="text-[10px] text-gray-500 print:p-amount-unit">CFA</p>
                                    </div>
                                </div>

                                {/* Chiffre d'affaires TTC */}
                                <div className="mt-4">
                                    <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-lg text-center shadow-sm print:p-amount">
                                        <p className="text-sm text-emerald-700 font-semibold uppercase print:p-amount-label">Chiffre d'Affaires TTC</p>
                                        {/* ✅ */}
                                        <p className="text-3xl font-bold text-emerald-800 mt-1 print:p-amount-value">{formatNumber(totalRevenue, 2)}</p>
                                        <p className="text-[10px] text-emerald-500 print:p-amount-unit">CFA</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* SECTION 5: INCIDENTS + OPERATEURS/HSE (2 colonnes) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 print:p-two-col print:p-mb-1">
                            {/* Incidents */}
                            <section className="bg-white border rounded-xl p-4 shadow-sm print:p-section print-compact print-break-inside">
                                <button
                                    onClick={() => toggleSection('incidents')}
                                    className="w-full flex items-center justify-between text-left no-print"
                                >
                                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                        <AlertTriangle size={16} className="text-red-600" />
                                        Incidents
                                        {reporting.numberIncidents > 0 && (
                                            <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-800 text-xs font-bold rounded-full">
                                                {/* ✅ */}
                                                {formatNumber(reporting.numberIncidents)}
                                            </span>
                                        )}
                                    </h2>
                                    {expandedSections.incidents ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </button>

                                <div className={`mt-2 ${expandedSections.incidents ? 'block' : 'hidden'} print:!block`}>
                                    {reporting.numberIncidents > 0 ? (
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-sm text-red-600 font-medium">Nombre:</span>
                                                {/* ✅ */}
                                                <span className="text-xl font-bold text-red-700">{formatNumber(reporting.numberIncidents)}</span>
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

                            {/* Operateurs + HSE combines */}
                            <section className="bg-white border rounded-xl p-4 shadow-sm print:p-section print-compact print-break-inside">
                                <h2 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2 border-b pb-1 print:p-section-title">
                                    <Users size={16} className="text-blue-600" />
                                    Equipe
                                </h2>
                                <div className="space-y-2">
                                    {reporting.operators?.length > 0 && (
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1 font-medium">Operateurs ({reporting.operators.length})</p>
                                            <div className="flex flex-wrap gap-1 print:p-tags">
                                                {reporting.operators.map(op => (
                                                    <span key={op.id} className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs print:p-tag print:p-tag-blue">
                                                        {getEmployeeName(op.operatorId)}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {reporting.hses?.length > 0 && (
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1 font-medium">HSE ({reporting.hses.length})</p>
                                            <div className="flex flex-wrap gap-1 print:p-tags">
                                                {reporting.hses.map(h => (
                                                    <span key={h.id} className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs print:p-tag print:p-tag-green">
                                                        {getEmployeeName(h.hseId)}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </section>
                        </div>

                        {/* SECTION 6: CONSOMMABLES EN RUPTURE */}
                        {reporting.outOfStockConsumableReportingCgs?.length > 0 && (
                            <section className="bg-white border rounded-xl p-4 shadow-sm print:p-section print:p-mb-1 print-compact print-break-inside">
                                <button
                                    onClick={() => toggleSection('consumables')}
                                    className="w-full flex items-center justify-between text-left no-print"
                                >
                                    <h2 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2 border-b pb-1 print:p-section-title">
                                        <Package size={16} className="text-amber-600" />
                                        Consommables en rupture
                                        <span className="ml-1 text-xs text-gray-500">({reporting.outOfStockConsumableReportingCgs.length})</span>
                                    </h2>
                                    {expandedSections.consumables ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </button>
                                <div className={`mt-2 ${expandedSections.consumables ? 'block' : 'hidden'} print:!block`}>
                                        <p className="text-xs text-gray-500 mb-1 font-medium">{reporting.outOfStockConsumableReportingCgs.length} consommable(s) en rupture</p>
                                    <div className="flex flex-wrap gap-1 print:p-tags">
                                        {reporting.outOfStockConsumableReportingCgs.map(c => (
                                            <span key={c.id} className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-xs print:p-tag print:p-tag-amber">
                                                {c.consumable?.name || c.consumableId}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* SECTION 7: PIECES JOINTES (écran uniquement, pas à l'impression) */}
                        <section className="bg-white border rounded-xl p-4 shadow-sm no-print">
                            <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2 border-b pb-2">
                                <Paperclip size={18} className="text-purple-600" />
                                Documents joints
                            </h2>

                            <div className="space-y-3">
                                {reporting.extractionFileUrl && (
                                    <div className="print-break-inside">
                                        <h3 className="font-semibold text-gray-700 mb-1 flex items-center gap-2 text-sm">
                                            <FileSpreadsheet size={14} className="text-green-600" />
                                            Fichier d'extraction PW
                                        </h3>
                                        <div className="border rounded-lg p-3 bg-gray-50 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                                    <FileSpreadsheet size={16} className="text-green-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm text-gray-900">Extraction_PW</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 no-print">
                                                <button
                                                    onClick={() => handleSecureView(reporting.extractionFileUrl)}
                                                    className="flex items-center gap-1 px-2 py-1 text-xs bg-white border rounded-md hover:bg-gray-50"
                                                >
                                                    <Eye size={12} /> Voir
                                                </button>
                                                <button
                                                    onClick={() => handleSecureDownload(reporting.extractionFileUrl, 'extraction_pw')}
                                                    className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                                >
                                                    <Download size={12} /> Telecharger
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {reporting.attachments?.length > 0 && (
                                    <div className="print-break-inside">
                                        <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2 text-sm">
                                            <FileText size={14} />
                                            Pieces jointes ({reporting.attachments.length})
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            {reporting.attachments.map((att, idx) => (
                                                <div key={att.id || idx} className="border rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow">
                                                    {isImage(att.filename) && att.url ? (
                                                        <div className="relative group">
                                                            <SecureImage
                                                                src={att.url}
                                                                alt={att.filename}
                                                                className="w-full h-32 object-cover"
                                                            />
                                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 no-print">
                                                                <button
                                                                    onClick={() => handleSecureView(att.url)}
                                                                    className="p-2 bg-white rounded-full hover:bg-gray-100"
                                                                >
                                                                    <Eye size={14} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="h-32 bg-gray-100 flex items-center justify-center">
                                                            {getFileIcon(att.filename)}
                                                        </div>
                                                    )}

                                                    <div className="p-2">
                                                        <div className="flex items-start justify-between gap-2">
                                                            <div className="min-w-0">
                                                                <p className="font-medium text-xs text-gray-900 truncate" title={att.filename}>
                                                                    {att.filename}
                                                                </p>
                                                            </div>
                                                            <button
                                                                onClick={() => handleSecureDownload(att.url, att.filename)}
                                                                className="flex-shrink-0 p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded no-print"
                                                                title="Telecharger"
                                                            >
                                                                <Download size={12} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* SECTION 8: CG ENTRANT */}
                        <section className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-3 text-white print:p-banner print:p-mb-1 print-compact print-break-inside">
                            <h3 className="text-base font-bold flex items-center justify-center gap-2">
                                <User size={18} className="text-yellow-400" />
                                CG Entrant : {getEmployeeName(reporting.incomingCgId)}
                            </h3>
                        </section>

                        {/* FOOTER */}
                        <div className="hidden print:block p-footer">
                            Rapport CG - {reporting.numRef} | Site {getSiteName(reporting.siteId)} | Imprime le {new Date().toLocaleString('fr-FR')}
                        </div>
                    </div>

                    {/* ===== SCREEN FOOTER ===== */}
                    <DrawerFooter className="border-t no-print">
                        <DrawerClose asChild>
                            <button className="px-6 py-2.5 bg-gray-100 hover:bg-secondary rounded-lg transition-colors flex items-center justify-center gap-2 font-medium">
                                <X size={16} /> Fermer
                            </button>
                        </DrawerClose>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    );
};

export default ReportingCgDetails;