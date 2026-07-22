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
//     Weight, ChevronDown, ChevronUp, FileCheck, Edit3, History,
//     Ship, Package, Factory, Truck, Anchor
// } from 'lucide-react';
// import SecureImage from "../../ui/SecureImage";

// const ReportingSupervisoryDetails = ({ open, setOpen, reporting, references = {} }) => {
//     const { employees = [], shifts = [], suppliers = [], ships = [], products = [] } = references;
//     const [expandedSections, setExpandedSections] = useState({
//         weighing: true,
//         incidents: true,
//         parties: true,
//         ships: true,
//         resources: false,
//         workProgress: false
//     });

//     const toggleSection = (section) => {
//         setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
//     };

//     const getEmployeeName = (id) => employees.find(e => e.id === id)?.name || id;
//     const getShiftName = (id) => shifts.find(s => s.id === id)?.name || id;
//     const getSupplierName = (id) => suppliers.find(s => s.id === id)?.name || id;
//     const getShipName = (id) => ships.find(s => s.id === id)?.name || id;
//     const getProductName = (id) => products.find(p => p.id === id)?.name || id;

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
//                 alert('Session expirée. Veuillez vous reconnecter.');
//                 return;
//             }
//             const response = await fetch(url, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             if (!response.ok) throw new Error('Erreur lors du téléchargement');
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
//             if (!response.ok) throw new Error('Erreur lors de la visualisation');
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
//                     .print-supervisory {
//                         padding: 8px 10px !important;
//                         border-radius: 6px !important;
//                     }
//                     .print-supervisory .w-14 {
//                         width: 32px !important;
//                         height: 32px !important;
//                     }
//                     .print-supervisory .text-2xl {
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
//                                     Rapport Superviseur – {getEmployeeName(reporting.createdBy)}
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
//                         <h1 className="text-2xl font-bold text-gray-900">Rapport Superviseur – {reporting.numRef}</h1>
//                         <p className="text-gray-600">Quart : {getShiftName(reporting.shiftId)} | Superviseur : {getEmployeeName(reporting.incomingSupervisoryId)}</p>
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
//                                     <User size={14} className="text-gray-400" />
//                                     <span className="text-gray-600">Modifié par :</span>
//                                     <span className="font-semibold">{getEmployeeName(reporting.updatedBy)}</span>
//                                 </div>
//                                 <div className="flex items-center gap-2">
//                                     <Clock size={14} className="text-gray-400" />
//                                     <span className="text-gray-600">Dernière modif :</span>
//                                     {reporting.updatedBy && (
//                                         <span className="font-semibold">{formatDate(reporting.updatedAt)}</span>
//                                     )}
//                                 </div>
//                                 <div className="flex items-center gap-2">
//                                     <FileCheck size={14} className="text-gray-400" />
//                                     <span className="text-gray-600">Actif :</span>
//                                     <span className="font-semibold">{reporting.isActive ? 'Oui' : 'Non'}</span>
//                                 </div>
//                             </div>
//                         </section>

//                         {/* ═══════════════════════════════════════════════
//                             SECTION 2: PARTIES PRENANTES
//                             ═══════════════════════════════════════════════ */}
//                         <section className="print-section print-break-inside bg-white border rounded-xl p-4 shadow-sm">
//                             <button 
//                                 onClick={() => toggleSection('parties')}
//                                 className="w-full flex items-center justify-between text-left no-print"
//                             >
//                                 <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
//                                     <Users size={18} className="text-indigo-600" />
//                                     Parties prenantes
//                                     <span className="ml-2 px-2 py-0.5 bg-indigo-100 text-indigo-800 text-xs font-bold rounded-full">
//                                         {(reporting.chargers?.length || 0) + (reporting.shippers?.length || 0) + (reporting.thirdParties?.length || 0)}
//                                     </span>
//                                 </h2>
//                                 {expandedSections.parties ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
//                             </button>

//                             <div className={`mt-3 ${expandedSections.parties ? 'block' : 'hidden'} print:!block`}>
//                                 <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//                                     {/* Chargeurs */}
//                                     <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
//                                         <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2 text-sm">
//                                             <Truck size={14} />
//                                             Chargeurs ({reporting.chargers?.length || 0})
//                                         </h4>
//                                         <ul className="space-y-1">
//                                             {reporting.chargers?.length > 0 ? reporting.chargers.map(c => (
//                                                 <li key={c.id} className="flex items-center gap-2 text-sm">
//                                                     <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
//                                                     {getSupplierName(c.chargerId)}
//                                                 </li>
//                                             )) : <li className="text-gray-400 text-sm">Aucun</li>}
//                                         </ul>
//                                     </div>

//                                     {/* Expéditeurs */}
//                                     <div className="bg-green-50 border border-green-200 rounded-lg p-3">
//                                         <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2 text-sm">
//                                             <Factory size={14} />
//                                             Expéditeurs ({reporting.shippers?.length || 0})
//                                         </h4>
//                                         <ul className="space-y-1">
//                                             {reporting.shippers?.length > 0 ? reporting.shippers.map(s => (
//                                                 <li key={s.id} className="flex items-center gap-2 text-sm">
//                                                     <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//                                                     {getSupplierName(s.shipperId)}
//                                                 </li>
//                                             )) : <li className="text-gray-400 text-sm">Aucun</li>}
//                                         </ul>
//                                     </div>

//                                     {/* Tiers */}
//                                     <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
//                                         <h4 className="font-semibold text-purple-900 mb-2 flex items-center gap-2 text-sm">
//                                             <Users size={14} />
//                                             Tiers ({reporting.thirdParties?.length || 0})
//                                         </h4>
//                                         <ul className="space-y-1">
//                                             {reporting.thirdParties?.length > 0 ? reporting.thirdParties.map(t => (
//                                                 <li key={t.id} className="flex items-center gap-2 text-sm">
//                                                     <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
//                                                     {getSupplierName(t.thirdPartyId)}
//                                                 </li>
//                                             )) : <li className="text-gray-400 text-sm">Aucun</li>}
//                                         </ul>
//                                     </div>
//                                 </div>
//                             </div>
//                         </section>

//                         {/* ═══════════════════════════════════════════════
//                             SECTION 3: NAVIRES ET PRODUITS
//                             ═══════════════════════════════════════════════ */}
//                         <section className="print-section print-break-inside bg-white border rounded-xl p-4 shadow-sm">
//                             <button 
//                                 onClick={() => toggleSection('ships')}
//                                 className="w-full flex items-center justify-between text-left no-print"
//                             >
//                                 <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
//                                     <Ship size={18} className="text-cyan-600" />
//                                     Navires et Produits
//                                 </h2>
//                                 {expandedSections.ships ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
//                             </button>

//                             <div className={`mt-3 ${expandedSections.ships ? 'block' : 'hidden'} print:!block`}>
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                                     {/* Navires */}
//                                     <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-3">
//                                         <h4 className="font-semibold text-cyan-900 mb-2 flex items-center gap-2 text-sm">
//                                             <Anchor size={14} />
//                                             Navires ({reporting.ships?.length || 0})
//                                         </h4>
//                                         <ul className="space-y-1">
//                                             {reporting.ships?.length > 0 ? reporting.ships.map(s => (
//                                                 <li key={s.id} className="flex items-center gap-2 text-sm">
//                                                     <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
//                                                     {getShipName(s.shipId)}
//                                                 </li>
//                                             )) : <li className="text-gray-400 text-sm">Aucun navire</li>}
//                                         </ul>
//                                     </div>

//                                     {/* Produits */}
//                                     <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
//                                         <h4 className="font-semibold text-orange-900 mb-2 flex items-center gap-2 text-sm">
//                                             <Package size={14} />
//                                             Produits ({reporting.products?.length || 0})
//                                         </h4>
//                                         <ul className="space-y-1">
//                                             {reporting.products?.length > 0 ? reporting.products.map(p => (
//                                                 <li key={p.id} className="flex items-center gap-2 text-sm">
//                                                     <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
//                                                     {getProductName(p.productId)}
//                                                 </li>
//                                             )) : <li className="text-gray-400 text-sm">Aucun produit</li>}
//                                         </ul>
//                                     </div>
//                                 </div>
//                             </div>
//                         </section>

//                         {/* ═══════════════════════════════════════════════
//                             SECTION 4: INFORMATIONS DE PESÉE
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

//                                 {/* Tonnage brut */}
//                                 <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-center justify-between">
//                                     <div className="flex items-center gap-2">
//                                         <Weight size={16} className="text-yellow-600" />
//                                         <span className="font-semibold text-yellow-900 text-sm">Tonnage brut</span>
//                                     </div>
//                                     <span className="text-xl font-bold text-yellow-700">{reporting.grossTonnage || 0} T</span>
//                                 </div>

//                                 {/* Note production */}
//                                 {reporting.productionNote && (
//                                     <div className="print-desc mt-3 bg-green-50 border-l-4 border-green-500 p-3 rounded-r-lg">
//                                         <h4 className="font-semibold text-green-900 mb-1 flex items-center gap-2 text-sm">
//                                             <HardDrive size={14} />
//                                             Note production
//                                         </h4>
//                                         <p className="text-green-800 whitespace-pre-wrap text-sm leading-relaxed">
//                                             {reporting.productionNote}
//                                         </p>
//                                     </div>
//                                 )}
//                             </div>
//                         </section>

//                         {/* ═══════════════════════════════════════════════
//                             SECTION 5: RESSOURCES
//                             ═══════════════════════════════════════════════ */}
//                         <section className="print-section print-break-inside bg-white border rounded-xl p-4 shadow-sm">
//                             <button 
//                                 onClick={() => toggleSection('resources')}
//                                 className="w-full flex items-center justify-between text-left no-print"
//                             >
//                                 <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
//                                     <Users size={18} className="text-teal-600" />
//                                     Ressources
//                                 </h2>
//                                 {expandedSections.resources ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
//                             </button>

//                             <div className={`mt-3 ${expandedSections.resources ? 'block' : 'hidden'} print:!block`}>
//                                 <div className="print-cards grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
//                                     <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 text-center">
//                                         <p className="text-xl font-bold text-blue-700">
//                                             {reporting.expectedNumberResources || 0}
//                                         </p>
//                                         <p className="text-[10px] text-blue-600 font-medium mt-0.5">Attendues</p>
//                                     </div>
//                                     <div className="bg-green-50 border border-green-200 rounded-lg p-2 text-center">
//                                         <p className="text-xl font-bold text-green-700">
//                                             {reporting.availableNumberResources || 0}
//                                         </p>
//                                         <p className="text-[10px] text-green-600 font-medium mt-0.5">Disponibles</p>
//                                     </div>
//                                     <div className="bg-orange-50 border border-orange-200 rounded-lg p-2 text-center">
//                                         <p className="text-xl font-bold text-orange-700">
//                                             {reporting.overdueNumberResources || 0}
//                                         </p>
//                                         <p className="text-[10px] text-orange-600 font-medium mt-0.5">En retard</p>
//                                     </div>
//                                     <div className="bg-red-50 border border-red-200 rounded-lg p-2 text-center">
//                                         <p className="text-xl font-bold text-red-700">
//                                             {reporting.missingNumberResources || 0}
//                                         </p>
//                                         <p className="text-[10px] text-red-600 font-medium mt-0.5">Manquantes</p>
//                                     </div>
//                                 </div>

//                                 {reporting.teamManagementFeedback && (
//                                     <div className="print-desc mt-3 bg-teal-50 border-l-4 border-teal-500 p-3 rounded-r-lg">
//                                         <h4 className="font-semibold text-teal-900 mb-1 flex items-center gap-2 text-sm">
//                                             <Users size={14} />
//                                             Feedback gestion équipe
//                                         </h4>
//                                         <p className="text-teal-800 whitespace-pre-wrap text-sm leading-relaxed">
//                                             {reporting.teamManagementFeedback}
//                                         </p>
//                                     </div>
//                                 )}
//                             </div>
//                         </section>

//                         {/* ═══════════════════════════════════════════════
//                             SECTION 6: AVANCEMENT TRAVAUX
//                             ═══════════════════════════════════════════════ */}
//                         {(reporting.titleWorkProgress || reporting.commentWorkProgress) && (
//                             <section className="print-section print-break-inside bg-white border rounded-xl p-4 shadow-sm">
//                                 <button 
//                                     onClick={() => toggleSection('workProgress')}
//                                     className="w-full flex items-center justify-between text-left no-print"
//                                 >
//                                     <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
//                                         <HardDrive size={18} className="text-amber-600" />
//                                         Avancement travaux
//                                     </h2>
//                                     {expandedSections.workProgress ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
//                                 </button>

//                                 <div className={`mt-3 ${expandedSections.workProgress ? 'block' : 'hidden'} print:!block`}>
//                                     {reporting.titleWorkProgress && (
//                                         <div className="mb-3">
//                                             <h4 className="font-semibold text-amber-900 mb-1 text-sm">Titre</h4>
//                                             <p className="text-amber-800 font-medium text-sm">{reporting.titleWorkProgress}</p>
//                                         </div>
//                                     )}
//                                     {reporting.commentWorkProgress && (
//                                         <div className="print-desc bg-amber-50 border-l-4 border-amber-500 p-3 rounded-r-lg">
//                                             <h4 className="font-semibold text-amber-900 mb-1 text-sm">Commentaire</h4>
//                                             <p className="text-amber-800 whitespace-pre-wrap text-sm leading-relaxed">
//                                                 {reporting.commentWorkProgress}
//                                             </p>
//                                         </div>
//                                     )}
//                                 </div>
//                             </section>
//                         )}

//                         {/* ═══════════════════════════════════════════════
//                             SECTION 7: INCIDENTS
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
//                                 {reporting.incidents?.length > 0 ? (
//                                     <div className="space-y-3">
//                                         <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
//                                             <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
//                                                 <AlertTriangle size={20} className="text-red-600" />
//                                             </div>
//                                             <div>
//                                                 <p className="text-sm text-red-600 font-medium">Nombre d\'incidents déclarés</p>
//                                                 <p className="text-2xl font-bold text-red-700">{reporting.numberIncidents}</p>
//                                             </div>
//                                         </div>

//                                         {/* Tableau des incidents */}
//                                         <div className="print-table overflow-hidden rounded-lg border border-red-200">
//                                             <table className="w-full text-sm">
//                                                 <thead className="bg-red-50">
//                                                     <tr>
//                                                         <th className="px-3 py-2 text-left font-semibold text-red-800">#</th>
//                                                         <th className="px-3 py-2 text-left font-semibold text-red-800">Équipement</th>
//                                                         <th className="px-3 py-2 text-left font-semibold text-red-800">Panne</th>
//                                                         <th className="px-3 py-2 text-left font-semibold text-red-800">Type</th>
//                                                         <th className="px-3 py-2 text-left font-semibold text-red-800">Arrêt</th>
//                                                         <th className="px-3 py-2 text-left font-semibold text-red-800">Statut</th>
//                                                         <th className="px-3 py-2 text-left font-semibold text-red-800">Gestionnaire</th>
//                                                     </tr>
//                                                 </thead>
//                                                 <tbody className="divide-y divide-red-100">
//                                                     {reporting.incidents.map((inc, idx) => (
//                                                         <tr key={inc.id} className="hover:bg-red-50/50">
//                                                             <td className="px-3 py-2 font-bold text-red-700">{idx + 1}</td>
//                                                             <td className="px-3 py-2 text-gray-900">{inc.equipment}</td>
//                                                             <td className="px-3 py-2 text-gray-900">{inc.breakdown}</td>
//                                                             <td className="px-3 py-2 text-gray-900">{inc.typeFailure}</td>
//                                                             <td className="px-3 py-2 text-gray-900">{inc.downtime}</td>
//                                                             <td className="px-3 py-2">
//                                                                 <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
//                                                                     inc.status === 'Résolu' ? 'bg-green-100 text-green-800' :
//                                                                     inc.status === 'En cours' ? 'bg-yellow-100 text-yellow-800' :
//                                                                     'bg-red-100 text-red-800'
//                                                                 }`}>
//                                                                     {inc.status}
//                                                                 </span>
//                                                             </td>
//                                                             <td className="px-3 py-2 text-gray-900">{inc.managerFailure}</td>
//                                                         </tr>
//                                                     ))}
//                                                 </tbody>
//                                             </table>
//                                         </div>
//                                     </div>
//                                 ) : (
//                                     <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg text-gray-500">
//                                         <FileCheck size={18} />
//                                         <span className="text-sm">Aucun incident déclaré pour ce rapport</span>
//                                     </div>
//                                 )}

//                                 {reporting.incidentNote && (
//                                     <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3">
//                                         <h4 className="font-semibold text-red-900 mb-1 text-sm">Note incidents</h4>
//                                         <p className="text-red-800 whitespace-pre-wrap text-sm leading-relaxed">
//                                             {reporting.incidentNote}
//                                         </p>
//                                     </div>
//                                 )}
//                             </div>
//                         </section>

//                         {/* ═══════════════════════════════════════════════
//                             SECTION 8: PIÈCES JOINTES
//                             ═══════════════════════════════════════════════ */}
//                         {reporting.attachments?.length > 0 && (
//                             <section className="print-section print-break-inside bg-white border rounded-xl p-4 shadow-sm">
//                                 <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2 border-b pb-2">
//                                     <Paperclip size={18} className="text-purple-600" />
//                                     Documents joints ({reporting.attachments.length})
//                                 </h2>

//                                 <div className="print-attachments grid grid-cols-1 md:grid-cols-2 gap-2">
//                                     {reporting.attachments.map((att, idx) => (
//                                         <div key={att.id || idx} className="border rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow">
//                                             {isImage(att.filename) && att.url ? (
//                                                 <div className="relative group">
//                                                     <SecureImage 
//                                                         src={att.url} 
//                                                         alt={att.filename}
//                                                         className="w-full h-32 object-cover cursor-pointer"
//                                                     />
//                                                     <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 no-print">
//                                                         <button 
//                                                             onClick={() => handleSecureView(att.url)}
//                                                             className="p-2 bg-white rounded-full hover:bg-gray-100"
//                                                         >
//                                                             <Eye size={14} />
//                                                         </button>
//                                                     </div>
//                                                 </div>
//                                             ) : (
//                                                 <div className="h-32 bg-gray-100 flex items-center justify-center">
//                                                     {getFileIcon(att.filename)}
//                                                 </div>
//                                             )}

//                                             <div className="p-2">
//                                                 <div className="flex items-start justify-between gap-2">
//                                                     <div className="min-w-0">
//                                                         <p className="font-medium text-xs text-gray-900 truncate" title={att.filename}>
//                                                             {att.filename}
//                                                         </p>
//                                                         <p className="text-[10px] text-gray-500 mt-0.5">
//                                                             {att.filename?.split('.').pop()?.toUpperCase()}
//                                                         </p>
//                                                     </div>
//                                                     <button 
//                                                         onClick={() => handleSecureDownload(att.url, att.filename)}
//                                                         className="flex-shrink-0 p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded no-print"
//                                                         title="Télécharger"
//                                                     >
//                                                         <Download size={12} />
//                                                     </button>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </section>
//                         )}

//                         {/* ═══════════════════════════════════════════════
//                             SECTION 9: SUPERVISEUR ENTRANT (En bas de fiche)
//                             ═══════════════════════════════════════════════ */}
//                         <section className="print-supervisory print-break-inside bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-4 text-white">
//                             <div className="flex items-center gap-3">
//                                 <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center">
//                                     <User size={28} className="text-yellow-400" />
//                                 </div>
//                                 <div>
//                                     <p className="text-xs text-gray-400 uppercase tracking-wider">Superviseur entrant</p>
//                                     <h2 className="text-2xl font-bold">{getEmployeeName(reporting.incomingSupervisoryId)}</h2>
//                                 </div>
//                             </div>
//                         </section>

//                         {/* Footer impression */}
//                         <div className="hidden print:block print-footer mt-2 pt-2 border-t text-[10px] text-gray-400 text-center">
//                             Rapport Superviseur – {reporting.numRef} | Imprimé le {new Date().toLocaleString('fr-FR')}
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

// export default ReportingSupervisoryDetails;

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
    X, FileText, Users, HardDrive, AlertTriangle, 
    MapPin, Clock, User, Calendar, Printer, Download, 
    Eye, FileSpreadsheet, Image as ImageIcon, Paperclip,
    Weight, ChevronDown, ChevronUp, FileCheck, Edit3, History,
    Ship, Package, Factory, Truck, Anchor
} from 'lucide-react';
import SecureImage from "../../ui/SecureImage";

const ReportingSupervisoryDetails = ({ open, setOpen, reporting, references = {} }) => {
    const { employees = [], shifts = [], suppliers = [], ships = [], products = [] } = references;
    const [expandedSections, setExpandedSections] = useState({
        weighing: true,
        incidents: true,
        parties: true,
        ships: true,
        resources: false,
        workProgress: false
    });

    const toggleSection = (section) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const getEmployeeName = (id) => employees.find(e => e.id === id)?.name || id || '-';
    const getShiftName = (id) => shifts.find(s => s.id === id)?.name || id || '-';
    const getSupplierName = (id) => suppliers.find(s => s.id === id)?.name || id || '-';
    const getShipName = (id) => ships.find(s => s.id === id)?.name || id || '-';
    const getProductName = (id) => products.find(p => p.id === id)?.name || id || '-';

    const formatDate = (date) => date ? new Date(date).toLocaleString('fr-FR') : '-';
    const formatDateShort = (date) => date ? new Date(date).toLocaleDateString('fr-FR') : '-';

    if (!reporting) return null;

    // ─── Totaux ───────────────────────────────────────────────────────
    const totalWeighings = 
        (reporting.completeNumberWeighingsToBeBilled || 0) +
        (reporting.incompleteNumberWeighingsToBeBilled || 0) +
        (reporting.testNumberWeighingsToBeBilled || 0) +
        (reporting.numberPassagesWithoutWeighingToBeBilled || 0);

    const totalWeighingsBySpecies = 
        (reporting.completeNumberWeighingsBySpecies || 0) +
        (reporting.incompleteNumberWeighingsBySpecies || 0) +
        (reporting.testNumberWeighingsBySpecies || 0) +
        (reporting.numberPassagesWithoutWeighingBySpecies || 0);

    // ─── Fichiers ──────────────────────────────────────────────────────
    const getFileIcon = (filename) => {
        if (!filename) return <FileText size={16} />;
        const ext = filename.split('.').pop().toLowerCase();
        if (['xlsx', 'xls', 'csv'].includes(ext)) return <FileSpreadsheet size={16} className="text-green-600" />;
        if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return <ImageIcon size={16} className="text-purple-600" />;
        if (['pdf'].includes(ext)) return <FileText size={16} className="text-red-600" />;
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
                alert('Session expiree. Veuillez vous reconnecter.');
                return;
            }
            const response = await fetch(url, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) throw new Error('Erreur lors du telechargement');
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
            console.error('Erreur telechargement:', error);
            alert('Impossible de telecharger le fichier.');
        }
    };

    const handleSecureView = async (url) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Session expiree. Veuillez vous reconnecter.');
                return;
            }
            const response = await fetch(url, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) throw new Error('Erreur lors de la visualisation');
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            window.open(blobUrl, '_blank');
        } catch (error) {
            console.error('Erreur visualisation:', error);
            alert('Impossible d\'ouvrir le fichier.');
        }
    };

    const handlePrint = () => {
        window.print();
    };

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
                        grid-template-columns: repeat(4, 1fr);
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
                    .p-tag-purple { background: #f3e8ff; color: #6b21a8; }
                    .p-tag-cyan { background: #cffafe; color: #155e75; }
                    .p-tag-orange { background: #ffedd5; color: #9a3412; }
                    .p-tag-red { background: #fee2e2; color: #991b1b; }

                    /* ===== TWO COLUMN LAYOUT ===== */
                    .p-two-col {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 2mm;
                    }

                    /* ===== THREE COLUMN LAYOUT ===== */
                    .p-three-col {
                        display: grid;
                        grid-template-columns: repeat(3, 1fr);
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
                    .p-desc-green {
                        background: #f0fdf4;
                        border-color: #16a34a;
                        color: #14532d;
                    }
                    .p-desc-yellow {
                        background: #fefce8;
                        border-color: #ca8a04;
                        color: #713f12;
                    }
                    .p-desc-red {
                        background: #fef2f2;
                        border-color: #dc2626;
                        color: #7f1d1d;
                    }
                    .p-desc-teal {
                        background: #f0fdfa;
                        border-color: #0d9488;
                        color: #134e4a;
                    }
                    .p-desc-amber {
                        background: #fffbeb;
                        border-color: #d97706;
                        color: #78350f;
                    }

                    /* ===== BANNER ===== */
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
                    .p-mb-0 { margin-bottom: 0 !important; }
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
                                    Rapport Superviseur – {getEmployeeName(reporting.createdBy)}
                                </DrawerTitle>
                                <DrawerDescription className="text-gray-500 mt-1">
                                    Details du rapport – {reporting.numRef}
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

                        {/* HEADER IMPRESSION */}
                        <div className="hidden print:block p-header">
                            <h1>RAPPORT SUPERVISEUR</h1>
                            <div className="p-header-meta">
                                <span><strong>Ref:</strong> {reporting.numRef}</span>
                                <span><strong>Quart:</strong> {getShiftName(reporting.shiftId)}</span>
                                <span><strong>Superviseur:</strong> {getEmployeeName(reporting.incomingSupervisoryId)}</span>
                                <span><strong>Date:</strong> {formatDateShort(reporting.createdAt)}</span>
                            </div>
                        </div>

                        {/* ═══════════════════════════════════════════════
                            SECTION 1: INFORMATIONS GENERALES
                            ═══════════════════════════════════════════════ */}
                        <section className="bg-white border rounded-xl p-4 shadow-sm print:p-section print:p-mb-1 print-compact print-break-inside">
                            <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2 border-b pb-2 print:p-section-title">
                                <FileText size={16} className="text-blue-600" />
                                Informations generales
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm print:p-info-grid">
                                <div className="flex items-center gap-2 print:p-info-item">
                                    <span className="text-gray-600 print:p-info-label">Cree par :</span>
                                    <span className="font-semibold print:p-info-value">{getEmployeeName(reporting.createdBy)}</span>
                                </div>
                                <div className="flex items-center gap-2 print:p-info-item">
                                    <span className="text-gray-600 print:p-info-label">Date :</span>
                                    <span className="font-semibold print:p-info-value">{formatDate(reporting.createdAt)}</span>
                                </div>
                                <div className="flex items-center gap-2 print:p-info-item">
                                    <span className="text-gray-600 print:p-info-label">Quart :</span>
                                    <span className="font-semibold print:p-info-value">{getShiftName(reporting.shiftId)}</span>
                                </div>
                                <div className="flex items-center gap-2 print:p-info-item">
                                    <span className="text-gray-600 print:p-info-label">Modifie par :</span>
                                    <span className="font-semibold print:p-info-value">{getEmployeeName(reporting.updatedBy) || '-'}</span>
                                </div>
                                <div className="flex items-center gap-2 print:p-info-item">
                                    <span className="text-gray-600 print:p-info-label">Derniere modif :</span>
                                    <span className="font-semibold print:p-info-value">{reporting.updatedBy ? formatDate(reporting.updatedAt) : '-'}</span>
                                </div>
                                <div className="flex items-center gap-2 print:p-info-item">
                                    <span className="text-gray-600 print:p-info-label">Actif :</span>
                                    <span className="font-semibold print:p-info-value">{reporting.isActive ? 'Oui' : 'Non'}</span>
                                </div>
                            </div>
                        </section>

                        {/* ═══════════════════════════════════════════════
                            SECTION 2: PARTIES PRENANTES (3 colonnes)
                            ═══════════════════════════════════════════════ */}
                        <section className="bg-white border rounded-xl p-4 shadow-sm print:p-section print:p-mb-1 print-compact print-break-inside">
                            <button 
                                onClick={() => toggleSection('parties')}
                                className="w-full flex items-center justify-between text-left no-print"
                            >
                                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <Users size={18} className="text-indigo-600" />
                                    Parties prenantes
                                    <span className="ml-2 px-2 py-0.5 bg-indigo-100 text-indigo-800 text-xs font-bold rounded-full">
                                        {(reporting.chargers?.length || 0) + (reporting.shippers?.length || 0) + (reporting.thirdParties?.length || 0)}
                                    </span>
                                </h2>
                                {expandedSections.parties ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                            </button>

                            <div className={`mt-3 ${expandedSections.parties ? 'block' : 'hidden'} print:!block`}>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 print:p-three-col">
                                    {/* Chargeurs */}
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 print:p-section print:p-mb-0">
                                        <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2 text-sm print:p-section-title">
                                            <Truck size={14} />
                                            Chargeurs ({reporting.chargers?.length || 0})
                                        </h4>
                                        <div className="flex flex-wrap gap-1 print:p-tags">
                                            {reporting.chargers?.length > 0 ? reporting.chargers.map(c => (
                                                <span key={c.id} className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs print:p-tag print:p-tag-blue">
                                                    {getSupplierName(c.chargerId)}
                                                </span>
                                            )) : <span className="text-gray-400 text-sm">Aucun</span>}
                                        </div>
                                    </div>

                                    {/* Expéditeurs */}
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 print:p-section print:p-mb-0">
                                        <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2 text-sm print:p-section-title">
                                            <Factory size={14} />
                                            Acconierss ({reporting.shippers?.length || 0})
                                        </h4>
                                        <div className="flex flex-wrap gap-1 print:p-tags">
                                            {reporting.shippers?.length > 0 ? reporting.shippers.map(s => (
                                                <span key={s.id} className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs print:p-tag print:p-tag-green">
                                                    {getSupplierName(s.shipperId)}
                                                </span>
                                            )) : <span className="text-gray-400 text-sm">Aucun</span>}
                                        </div>
                                    </div>

                                    {/* Tiers */}
                                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 print:p-section print:p-mb-0">
                                        <h4 className="font-semibold text-purple-900 mb-2 flex items-center gap-2 text-sm print:p-section-title">
                                            <Users size={14} />
                                            Tiers ({reporting.thirdParties?.length || 0})
                                        </h4>
                                        <div className="flex flex-wrap gap-1 print:p-tags">
                                            {reporting.thirdParties?.length > 0 ? reporting.thirdParties.map(t => (
                                                <span key={t.id} className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded text-xs print:p-tag print:p-tag-purple">
                                                    {getSupplierName(t.thirdPartyId)}
                                                </span>
                                            )) : <span className="text-gray-400 text-sm">Aucun</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* ═══════════════════════════════════════════════
                            SECTION 3: NAVIRES ET PRODUITS (2 colonnes)
                            ═══════════════════════════════════════════════ */}
                        <section className="bg-white border rounded-xl p-4 shadow-sm print:p-section print:p-mb-1 print-compact print-break-inside">
                            <button 
                                onClick={() => toggleSection('ships')}
                                className="w-full flex items-center justify-between text-left no-print"
                            >
                                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <Ship size={18} className="text-cyan-600" />
                                    Navires et Produits
                                </h2>
                                {expandedSections.ships ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                            </button>

                            <div className={`mt-3 ${expandedSections.ships ? 'block' : 'hidden'} print:!block`}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 print:p-two-col">
                                    {/* Navires */}
                                    <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-3 print:p-section print:p-mb-0">
                                        <h4 className="font-semibold text-cyan-900 mb-2 flex items-center gap-2 text-sm print:p-section-title">
                                            <Anchor size={14} />
                                            Navires ({reporting.ships?.length || 0})
                                        </h4>
                                        <div className="flex flex-wrap gap-1 print:p-tags">
                                            {reporting.ships?.length > 0 ? reporting.ships.map(s => (
                                                <span key={s.id} className="bg-cyan-100 text-cyan-800 px-2 py-0.5 rounded text-xs print:p-tag print:p-tag-cyan">
                                                    {getShipName(s.shipId)}
                                                </span>
                                            )) : <span className="text-gray-400 text-sm">Aucun navire</span>}
                                        </div>
                                    </div>

                                    {/* Produits */}
                                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 print:p-section print:p-mb-0">
                                        <h4 className="font-semibold text-orange-900 mb-2 flex items-center gap-2 text-sm print:p-section-title">
                                            <Package size={14} />
                                            Produits ({reporting.products?.length || 0})
                                        </h4>
                                        <div className="flex flex-wrap gap-1 print:p-tags">
                                            {reporting.products?.length > 0 ? reporting.products.map(p => (
                                                <span key={p.id} className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded text-xs print:p-tag print:p-tag-orange">
                                                    {getProductName(p.productId)}
                                                </span>
                                            )) : <span className="text-gray-400 text-sm">Aucun produit</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* ═══════════════════════════════════════════════
                            SECTION 4: INFORMATIONS DE PESEE
                            ═══════════════════════════════════════════════ */}
                        <section className="bg-white border rounded-xl p-4 shadow-sm print:p-section print:p-mb-1 print-compact print-break-inside">
                            <button 
                                onClick={() => toggleSection('weighing')}
                                className="w-full flex items-center justify-between text-left no-print"
                            >
                                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <Weight size={18} className="text-indigo-600" />
                                    Informations de pesee
                                    <span className="ml-2 px-2 py-0.5 bg-indigo-100 text-indigo-800 text-xs font-bold rounded-full">
                                        Total : {totalWeighings}
                                    </span>
                                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                                        Especes : {totalWeighingsBySpecies}
                                    </span>
                                </h2>
                                {expandedSections.weighing ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                            </button>

                            <div className={`mt-3 ${expandedSections.weighing ? 'block' : 'hidden'} print:!block`}>
                                {/* Stats compactes */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3 print:p-stats">
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-2 text-center print:p-stat">
                                        <p className="text-lg font-bold text-green-700 print:p-stat-value">{reporting.completeNumberWeighingsToBeBilled || 0}</p>
                                        <p className="text-[10px] text-green-600 print:p-stat-label">Completes facturer</p>
                                    </div>
                                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-2 text-center print:p-stat">
                                        <p className="text-lg font-bold text-orange-700 print:p-stat-value">{reporting.incompleteNumberWeighingsToBeBilled || 0}</p>
                                        <p className="text-[10px] text-orange-600 print:p-stat-label">Incompletes facturer</p>
                                    </div>
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 text-center print:p-stat">
                                        <p className="text-lg font-bold text-blue-700 print:p-stat-value">{reporting.testNumberWeighingsToBeBilled || 0}</p>
                                        <p className="text-[10px] text-blue-600 print:p-stat-label">Tests facturer</p>
                                    </div>
                                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 text-center print:p-stat">
                                        <p className="text-lg font-bold text-gray-700 print:p-stat-value">{reporting.numberPassagesWithoutWeighingToBeBilled || 0}</p>
                                        <p className="text-[10px] text-gray-600 print:p-stat-label">Sans pesee</p>
                                    </div>
                                </div>

                                {/* Tableau detaille */}
                                <div className="overflow-hidden rounded-lg border border-gray-200 print:p-mb-0">
                                    <table className="w-full text-sm print:p-table">
                                        <thead>
                                            <tr>
                                                <th>Type de pesee</th>
                                                <th className="p-num">A facturer</th>
                                                <th className="p-num">Par espece</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="font-medium">Pesees completes</td>
                                                <td className="p-num text-green-700">{reporting.completeNumberWeighingsToBeBilled || 0}</td>
                                                <td className="p-num">{reporting.completeNumberWeighingsBySpecies || 0}</td>
                                            </tr>
                                            <tr>
                                                <td className="font-medium">Pesees incompletes</td>
                                                <td className="p-num text-orange-700">{reporting.incompleteNumberWeighingsToBeBilled || 0}</td>
                                                <td className="p-num">{reporting.incompleteNumberWeighingsBySpecies || 0}</td>
                                            </tr>
                                            <tr>
                                                <td className="font-medium">Pesees test</td>
                                                <td className="p-num text-blue-700">{reporting.testNumberWeighingsToBeBilled || 0}</td>
                                                <td className="p-num">{reporting.testNumberWeighingsBySpecies || 0}</td>
                                            </tr>
                                            <tr>
                                                <td className="font-medium">Passages sans pesee</td>
                                                <td className="p-num text-gray-700">{reporting.numberPassagesWithoutWeighingToBeBilled || 0}</td>
                                                <td className="p-num">{reporting.numberPassagesWithoutWeighingBySpecies || 0}</td>
                                            </tr>
                                        </tbody>
                                        <tfoot>
                                            <tr className="bg-gray-100 font-bold">
                                                <td>TOTAL</td>
                                                <td className="p-num">{totalWeighings}</td>
                                                <td className="p-num">{totalWeighingsBySpecies}</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>

                                {/* Tonnage brut */}
                                <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-center justify-between print:p-desc print:p-desc-yellow">
                                    <div className="flex items-center gap-2">
                                        <Weight size={16} className="text-yellow-600" />
                                        <span className="font-semibold text-yellow-900 text-sm">Tonnage brut</span>
                                    </div>
                                    <span className="text-xl font-bold text-yellow-700">{reporting.grossTonnage || 0} T</span>
                                </div>

                                {/* Note production */}
                                {reporting.productionNote && (
                                    <div className="mt-3 bg-green-50 border-l-4 border-green-500 p-3 rounded-r-lg print:p-desc print:p-desc-green">
                                        <h4 className="font-semibold text-green-900 mb-1 flex items-center gap-2 text-sm">
                                            <HardDrive size={14} />
                                            Note production
                                        </h4>
                                        <p className="text-green-800 whitespace-pre-wrap text-sm leading-relaxed">
                                            {reporting.productionNote}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* ═══════════════════════════════════════════════
                            SECTION 5: RESSOURCES
                            ═══════════════════════════════════════════════ */}
                        <section className="bg-white border rounded-xl p-4 shadow-sm print:p-section print:p-mb-1 print-compact print-break-inside">
                            <button 
                                onClick={() => toggleSection('resources')}
                                className="w-full flex items-center justify-between text-left no-print"
                            >
                                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <Users size={18} className="text-teal-600" />
                                    Ressources
                                </h2>
                                {expandedSections.resources ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                            </button>

                            <div className={`mt-3 ${expandedSections.resources ? 'block' : 'hidden'} print:!block`}>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3 print:p-stats">
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 text-center print:p-stat">
                                        <p className="text-lg font-bold text-blue-700 print:p-stat-value">{reporting.expectedNumberResources || 0}</p>
                                        <p className="text-[10px] text-blue-600 print:p-stat-label">Attendues</p>
                                    </div>
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-2 text-center print:p-stat">
                                        <p className="text-lg font-bold text-green-700 print:p-stat-value">{reporting.availableNumberResources || 0}</p>
                                        <p className="text-[10px] text-green-600 print:p-stat-label">Disponibles</p>
                                    </div>
                                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-2 text-center print:p-stat">
                                        <p className="text-lg font-bold text-orange-700 print:p-stat-value">{reporting.overdueNumberResources || 0}</p>
                                        <p className="text-[10px] text-orange-600 print:p-stat-label">En retard</p>
                                    </div>
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-2 text-center print:p-stat">
                                        <p className="text-lg font-bold text-red-700 print:p-stat-value">{reporting.missingNumberResources || 0}</p>
                                        <p className="text-[10px] text-red-600 print:p-stat-label">Manquantes</p>
                                    </div>
                                </div>

                                {reporting.teamManagementFeedback && (
                                    <div className="mt-3 bg-teal-50 border-l-4 border-teal-500 p-3 rounded-r-lg print:p-desc print:p-desc-teal">
                                        <h4 className="font-semibold text-teal-900 mb-1 flex items-center gap-2 text-sm">
                                            <Users size={14} />
                                            Feedback gestion equipe
                                        </h4>
                                        <p className="text-teal-800 whitespace-pre-wrap text-sm leading-relaxed">
                                            {reporting.teamManagementFeedback}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* ═══════════════════════════════════════════════
                            SECTION 6: AVANCEMENT TRAVAUX
                            ═══════════════════════════════════════════════ */}
                        {(reporting.titleWorkProgress || reporting.commentWorkProgress) && (
                            <section className="bg-white border rounded-xl p-4 shadow-sm print:p-section print:p-mb-1 print-compact print-break-inside">
                                <button 
                                    onClick={() => toggleSection('workProgress')}
                                    className="w-full flex items-center justify-between text-left no-print"
                                >
                                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                        <HardDrive size={18} className="text-amber-600" />
                                        Avancement travaux
                                    </h2>
                                    {expandedSections.workProgress ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                </button>

                                <div className={`mt-3 ${expandedSections.workProgress ? 'block' : 'hidden'} print:!block`}>
                                    {reporting.titleWorkProgress && (
                                        <div className="mb-3">
                                            <h4 className="font-semibold text-amber-900 mb-1 text-sm">Titre</h4>
                                            <p className="text-amber-800 font-medium text-sm">{reporting.titleWorkProgress}</p>
                                        </div>
                                    )}
                                    {reporting.commentWorkProgress && (
                                        <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded-r-lg print:p-desc print:p-desc-amber">
                                            <h4 className="font-semibold text-amber-900 mb-1 text-sm">Commentaire</h4>
                                            <p className="text-amber-800 whitespace-pre-wrap text-sm leading-relaxed">
                                                {reporting.commentWorkProgress}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </section>
                        )}

                        {/* ═══════════════════════════════════════════════
                            SECTION 7: INCIDENTS
                            ═══════════════════════════════════════════════ */}
                        <section className="bg-white border rounded-xl p-4 shadow-sm print:p-section print:p-mb-1 print-compact print-break-inside">
                            <button 
                                onClick={() => toggleSection('incidents')}
                                className="w-full flex items-center justify-between text-left no-print"
                            >
                                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <AlertTriangle size={18} className="text-red-600" />
                                    Incidents
                                    {(reporting.numberIncidents > 0) && (
                                        <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-800 text-xs font-bold rounded-full">
                                            {reporting.numberIncidents}
                                        </span>
                                    )}
                                </h2>
                                {expandedSections.incidents ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                            </button>

                            <div className={`mt-3 ${expandedSections.incidents ? 'block' : 'hidden'} print:!block`}>
                                {reporting.incidents?.length > 0 ? (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg print:p-stat print:p-mb-1">
                                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                                <AlertTriangle size={20} className="text-red-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-red-600 font-medium">Nombre d'incidents declares</p>
                                                <p className="text-2xl font-bold text-red-700">{reporting.numberIncidents}</p>
                                            </div>
                                        </div>

                                        <table className="w-full text-sm print:p-table">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Equipement</th>
                                                    <th>Panne</th>
                                                    <th>Type</th>
                                                    <th>Arret</th>
                                                    <th>Statut</th>
                                                    <th>Gestionnaire</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {reporting.incidents.map((inc, idx) => (
                                                    <tr key={inc.id}>
                                                        <td className="p-num font-bold text-red-700">{idx + 1}</td>
                                                        <td>{inc.equipment}</td>
                                                        <td>{inc.breakdown}</td>
                                                        <td>{inc.typeFailure}</td>
                                                        <td>{inc.downtime}</td>
                                                        <td>
                                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                                                inc.status === 'Resolu' ? 'bg-green-100 text-green-800' :
                                                                inc.status === 'En cours' ? 'bg-yellow-100 text-yellow-800' :
                                                                'bg-red-100 text-red-800'
                                                            }`}>
                                                                {inc.status}
                                                            </span>
                                                        </td>
                                                        <td>{inc.managerFailure}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg text-gray-500">
                                        <FileCheck size={18} />
                                        <span className="text-sm">Aucun incident declare</span>
                                    </div>
                                )}

                                {reporting.incidentNote && (
                                    <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3 print:p-desc print:p-desc-red">
                                        <h4 className="font-semibold text-red-900 mb-1 text-sm">Note incidents</h4>
                                        <p className="text-red-800 whitespace-pre-wrap text-sm leading-relaxed">
                                            {reporting.incidentNote}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* ═══════════════════════════════════════════════
                            SECTION 8: PIECES JOINTES (ecran uniquement)
                            ═══════════════════════════════════════════════ */}
                        {reporting.attachments?.length > 0 && (
                            <section className="bg-white border rounded-xl p-4 shadow-sm no-print">
                                <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2 border-b pb-2">
                                    <Paperclip size={18} className="text-purple-600" />
                                    Documents joints ({reporting.attachments.length})
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {reporting.attachments.map((att, idx) => (
                                        <div key={att.id || idx} className="border rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow">
                                            {isImage(att.filename) && att.url ? (
                                                <div className="relative group">
                                                    <SecureImage 
                                                        src={att.url} 
                                                        alt={att.filename}
                                                        className="w-full h-32 object-cover cursor-pointer"
                                                    />
                                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
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
                                                        <p className="text-[10px] text-gray-500 mt-0.5">
                                                            {att.filename?.split('.').pop()?.toUpperCase()}
                                                        </p>
                                                    </div>
                                                    <button 
                                                        onClick={() => handleSecureDownload(att.url, att.filename)}
                                                        className="flex-shrink-0 p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                                                        title="Telecharger"
                                                    >
                                                        <Download size={12} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* ═══════════════════════════════════════════════
                            SECTION 9: SUPERVISEUR ENTRANT
                            ═══════════════════════════════════════════════ */}
                        <section className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-4 text-white print:p-banner print:p-mb-1 print-compact print-break-inside">
                            <div className="flex items-center gap-3">
                                <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center">
                                    <User size={28} className="text-yellow-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-wider">Superviseur entrant</p>
                                    <h2 className="text-2xl font-bold">{getEmployeeName(reporting.incomingSupervisoryId)}</h2>
                                </div>
                            </div>
                        </section>

                        {/* FOOTER IMPRESSION */}
                        <div className="hidden print:block p-footer">
                            Rapport Superviseur – {reporting.numRef} | Imprime le {new Date().toLocaleString('fr-FR')}
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

export default ReportingSupervisoryDetails;