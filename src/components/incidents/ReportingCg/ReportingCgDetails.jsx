import React, { useState } from 'react';
// import { useFetch } from '../../../hooks/useFetch';
import { URLS } from '../../../../configUrl';
import toast, { Toaster } from 'react-hot-toast';
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
        // (reporting.totalWeightAmountToBeBilled || 0) +
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

    // const handlePrint = () => window.print();
    // const { handleFetch } = useFetch();

    const handlePrintPdf = async () => {
    try {
        const response = await fetch(`${URLS.INCIDENT_API}/reporting-cgs/${reporting.id}/pdf`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
        });
        if (!response.ok) throw new Error('Erreur PDF');
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
    } catch (error) {
        console.error(error);
        toast.error('Impossible de générer le PDF');
    }
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
                                // onClick={handlePrint}
                                onClick={handlePrintPdf}
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
                                    <span className="text-gray-600 print:p-info-label">N° recette :</span>
                                    <span className="font-semibold print:p-info-value">{reporting.recipeCardNumber || '-'}</span>
                                </div>
                            </div>
                        </section>

                        {/* SECTION 2: SUIVI PESEES (tableau unique)
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
                        </section> */}
                        {/* SECTION 2: SUIVI PESEES */}
                            <section className="bg-white border rounded-xl p-4 shadow-sm print:p-section print:p-mb-1 print-compact print-break-inside">
                                <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2 border-b pb-2 print:p-section-title">
                                    <Calendar size={16} className="text-teal-600" />
                                    Suivi des pesees
                                </h2>

                                <table className="w-full table-fixed text-sm print:p-table print-table">
                                    <colgroup>
                                        <col className="w-[32%]" />
                                        <col className="w-[22%]" />
                                        <col className="w-[23%]" />
                                        <col className="w-[23%]" />
                                    </colgroup>

                                    <thead>
                                        <tr>
                                            <th className="bg-gray-50 px-3 py-2 text-left align-middle"></th>
                                            <th className="bg-gray-50 px-3 py-2 text-center align-middle">
                                                DATE
                                            </th>
                                            <th className="bg-gray-50 px-3 py-2 text-center align-middle">
                                                N° PESÉE
                                            </th>
                                            <th className="bg-gray-50 px-3 py-2 text-center align-middle">
                                                N° TRACTEUR
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        <tr>
                                            <td className="px-3 py-2 font-semibold align-middle">
                                                PREMIÈRE PESÉE
                                            </td>
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
                                            <td className="px-3 py-2 font-semibold align-middle">
                                                DERNIÈRE PESÉE
                                            </td>
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
                                            <th className="p-left">Par espece</th>
                                            <th className="p-right">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="font-medium">Pesees completes</td>
                                            {/* ✅ */}
                                            <td className="p-num text-green-700">{formatNumber(reporting.completeNumberWeighingsToBeBilled || 0)}</td>
                                            <td className="p-num">{formatNumber(reporting.completeNumberWeighingsBySpecies || 0)}</td>
                                            <td className="p-right">{formatNumber((reporting.completeNumberWeighingsToBeBilled || 0) + (reporting.completeNumberWeighingsBySpecies || 0))}</td>
                                        </tr>
                                        <tr>
                                            <td className="font-medium">Pesees incompletes</td>
                                            {/* ✅ */}
                                            <td className="p-num text-orange-700">{formatNumber(reporting.incompleteNumberWeighingsToBeBilled || 0)}</td>
                                            <td className="p-num">{formatNumber(reporting.incompleteNumberWeighingsBySpecies || 0)}</td>
                                            <td className="p-right">{formatNumber((reporting.incompleteNumberWeighingsToBeBilled || 0) + (reporting.incompleteNumberWeighingsBySpecies || 0))}</td>
                                        </tr>
                                        <tr>
                                            <td className="font-medium">Pesees test</td>
                                            <td className="p-num text-gray-400">-</td>
                                            {/* ✅ */}
                                            <td className="p-num text-blue-700">{formatNumber(reporting.testNumberWeighingsBySpecies || 0)}</td>
                                            <td className="p-right text-blue-700">{formatNumber((reporting.testNumberWeighingsBySpecies || 0) + (0 || 0))}</td>
                                        </tr>
                                        <tr>
                                            <td className="font-medium">Hors-pont</td>
                                            <td className="p-num text-gray-400">-</td>
                                            {/* ✅ */}
                                            <td className="p-num text-blue-700">{formatNumber(reporting.offBridgeNumber || 0)}</td>
                                            <td className="p-right text-blue-700">{formatNumber(reporting.offBridgeNumber || 0)}</td>
                                        </tr>
                                        <tr className="bg-gray-100 font-bold">
                                            <td>TOTAL</td>
                                            {/* ✅ */}
                                            <td className="p-num">{formatNumber((reporting.completeNumberWeighingsToBeBilled || 0) + (reporting.incompleteNumberWeighingsToBeBilled || 0))}</td>
                                            <td className="p-num">{formatNumber((reporting.completeNumberWeighingsBySpecies || 0) + (reporting.incompleteNumberWeighingsBySpecies || 0) + (reporting.testNumberWeighingsBySpecies || 0) + (reporting.offBridgeNumber || 0))}</td>
                                            <td className="p-num">{formatNumber((reporting.completeNumberWeighingsToBeBilled || 0) + (reporting.incompleteNumberWeighingsToBeBilled || 0) + (reporting.completeNumberWeighingsBySpecies || 0) + (reporting.incompleteNumberWeighingsBySpecies || 0) + (reporting.testNumberWeighingsBySpecies || 0) + (reporting.offBridgeNumber || 0))}</td>
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
                                        {/* <p className="text-lg font-bold text-emerald-700 print:p-amount-value">{formatNumber(reporting.totalWeightAmountToBeBilled || 0, 2)}</p>
                                        <p className="text-[10px] text-emerald-500 print:p-amount-unit">CFA</p> */}
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