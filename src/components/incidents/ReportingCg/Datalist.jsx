// import React, { useState } from 'react';
// import { Button } from '../../ui/button';
// import { PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
// import { Table, Form } from 'antd';
// import { MoreHorizontal } from "lucide-react";
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuItem,
//     DropdownMenuLabel,
//     DropdownMenuSeparator,
//     DropdownMenuTrigger,
// } from "../../../components/ui/dropdown-menu";
// import { URLS } from '../../../../configUrl';
// import { useFetch } from '../../../hooks/useFetch';
// import toast from 'react-hot-toast';
// import ReportingCgDetails from './ReportingCgDetails';

// // ✅ `references` reçu en props depuis ReportingCg.jsx — plus aucun fetch ici
// const Datalist = ({ dataList, fetchData, searchValue, pagination, loading, onEdit, references = {} }) => {
//     const { handleFetch } = useFetch();
//     const [detailsOpen, setDetailsOpen] = useState(false);
//     const [selectedRecord, setSelectedRecord] = useState(null);

//     const { sites = [], shifts = [], employees = [] } = references;

//     const highlightText = (text) => {
//         if (!searchValue || !text) return text;
//         const regex = new RegExp(searchValue, 'gi');
//         return <span dangerouslySetInnerHTML={{ __html: text.replace(regex, match => `<mark>${match}</mark>`) }} />;
//     };

//     const handleDelete = async (id) => {
//         if (window.confirm("Voulez-vous supprimer ce rapport ?")) {
//             try {
//                 const response = await handleFetch(`${URLS.INCIDENT_API}/reporting-cgs/${id}`, { method: 'DELETE' });
//                 if (response && !response.error) {
//                     toast.success("Supprimé avec succès");
//                     fetchData();
//                 } else {
//                     toast.error("Échec de la suppression");
//                 }
//             } catch (error) {
//                 console.error(error);
//                 toast.error("Erreur réseau");
//             }
//         }
//     };

//     const openDetails = (record) => {
//         setSelectedRecord(record);
//         setDetailsOpen(true);
//     };

//     const getSiteName = (id) => sites.find(s => s.id === id)?.name || id;
//     const getShiftName = (id) => shifts.find(s => s.id === id)?.name || id;
//     const getEmployeeName = (id) => employees.find(e => e.id === id)?.name || id;

//     const columns = [
//         { title: "N° Réf", dataIndex: "numRef", width: 120, render: (v) => highlightText(v) },
//         { title: "Créé par", dataIndex: "createdBy", width: 150, render: (v) => getEmployeeName(v) },
//         { title: "Créé le", dataIndex: "createdAt", width: 150, render: (v) => new Date(v).toLocaleDateString() },
//         { title: "Quart", dataIndex: "shiftId", width: 120, render: (v) => getShiftName(v) },
//         { title: "Site", dataIndex: "siteId", width: 150, render: (v) => getSiteName(v) },
//         { title: "CG entrant", dataIndex: "incomingCgId", width: 150, render: (v) => getEmployeeName(v) },
//         { title: "Pesées complètes à F", dataIndex: "completeNumberWeighingsToBeBilled", width: 120 },
//         { title: "Incidents", dataIndex: "numberIncidents", width: 100 },
//         { title: "Mis à jour par", dataIndex: "updatedBy", width: 150, render: (v) => getEmployeeName(v) },
//         { title: "Mis à jour le", dataIndex: "updatedAt", width: 150, render: (v) => new Date(v).toLocaleDateString() },
//         {
//             title: "Actions", width: 100, fixed: 'right',
//             render: (_, record) => (
//                 <div onClick={(e) => e.stopPropagation()}>
//                     <DropdownMenu>
//                         <DropdownMenuTrigger asChild>
//                             <Button variant="ghost" className="h-8 w-8 p-0">
//                                 <MoreHorizontal />
//                             </Button>
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent align="end">
//                             <DropdownMenuLabel>Actions</DropdownMenuLabel>
//                             <DropdownMenuSeparator />
//                             <DropdownMenuItem onClick={() => openDetails(record)}>
//                                 <EyeIcon className="h-4 w-4 mr-2" /> Voir détails
//                             </DropdownMenuItem>
//                             <DropdownMenuItem onClick={() => onEdit(record)}>
//                                 <PencilIcon className="h-4 w-4 mr-2" /> Éditer
//                             </DropdownMenuItem>
//                             <DropdownMenuItem onClick={() => handleDelete(record.id)} className="text-red-600">
//                                 <TrashIcon className="h-4 w-4 mr-2" /> Supprimer
//                             </DropdownMenuItem>
//                         </DropdownMenuContent>
//                     </DropdownMenu>
//                 </div>
//             )
//         }
//     ];

//     return (
//         <div className="w-full">
//             <div className="py-2 px-4 w-full max-h-[500px]">
//                 <Form>
//                     <Table
//                         dataSource={dataList}
//                         columns={columns}
//                         rowKey="id"
//                         pagination={false}
//                         loading={loading}
//                         onRow={(record) => ({
//                             onClick: () => openDetails(record)
//                         })}
//                         scroll={{ x: 1000, y: "40vh" }}
//                         footer={() => <div className="flex justify-end">{pagination}</div>}
//                     />
//                 </Form>
//             </div>
//             {/* ✅ references passées en props au drawer — pas de fetch supplémentaire */}
//             <ReportingCgDetails
//                 open={detailsOpen}
//                 setOpen={setDetailsOpen}
//                 reporting={selectedRecord}
//                 references={references}
//             />
//         </div>
//     );
// };

// export default Datalist;

import React, { useState } from 'react';
import { Button } from '../../ui/button';
import { PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import { Table, Form } from 'antd';
import { MoreHorizontal } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { URLS } from '../../../../configUrl';
import { useFetch } from '../../../hooks/useFetch';
import toast from 'react-hot-toast';
import ReportingCgDetails from './ReportingCgDetails';

const Datalist = ({ dataList, fetchData, searchValue, pagination, loading, onEdit, references = {} }) => {
    const { handleFetch } = useFetch();
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);

    const { sites = [], shifts = [], employees = [] } = references;

    const highlightText = (text) => {
        if (!searchValue || !text) return text;
        const regex = new RegExp(searchValue, 'gi');
        return <span dangerouslySetInnerHTML={{ __html: text.replace(regex, match => `<mark>${match}</mark>`) }} />;
    };

    const handleDelete = async (id) => {
        if (window.confirm("Voulez-vous supprimer ce rapport ?")) {
            try {
                const response = await handleFetch(`${URLS.INCIDENT_API}/reporting-cgs/${id}`, { method: 'DELETE' });
                if (response && !response.error) {
                    toast.success("Supprimé avec succès");
                    fetchData();
                } else {
                    toast.error("Échec de la suppression");
                }
            } catch (error) {
                console.error(error);
                toast.error("Erreur réseau");
            }
        }
    };

    const openDetails = (record) => {
        setSelectedRecord(record);
        setDetailsOpen(true);
    };

    const getSiteName = (id) => sites.find(s => s.id === id)?.name || id;
    const getShiftName = (id) => shifts.find(s => s.id === id)?.name || id;
    const getEmployeeName = (id) => employees.find(e => e.id === id)?.name || id;

    const columns = [
        { title: "N° Réf", dataIndex: "numRef", width: 120, render: (v) => highlightText(v) },
        { title: "Créé par", dataIndex: "createdBy", width: 150, render: (v) => getEmployeeName(v) },
        { title: "Créé le", dataIndex: "createdAt", width: 150, render: (v) => new Date(v).toLocaleDateString() },
        { title: "Quart", dataIndex: "shiftId", width: 120, render: (v) => getShiftName(v) },
        { title: "Site", dataIndex: "siteId", width: 150, render: (v) => getSiteName(v) },
        { title: "CG entrant", dataIndex: "incomingCgId", width: 150, render: (v) => getEmployeeName(v) },
        { title: "Pesées compl. F", dataIndex: "completeNumberWeighingsToBeBilled", width: 110 },
        { title: "Pesées compl. E", dataIndex: "completeNumberWeighingsBySpecies", width: 110 },
        { title: "Pesées incomp. F", dataIndex: "incompleteNumberWeighingsToBeBilled", width: 120 },
        { title: "Pesées incomp. E", dataIndex: "incompleteNumberWeighingsBySpecies", width: 120 },
        { title: "Tests E", dataIndex: "testNumberWeighingsBySpecies", width: 90 },
        { title: "Hors-pont", dataIndex: "offBridgeNumber", width: 90 },
        { title: "Mt pesée", dataIndex: "totalWeightAmount", width: 100, render: (v) => v?.toFixed(2) },
        { title: "Mt pesée F", dataIndex: "totalWeightAmountToBeBilled", width: 100, render: (v) => v?.toFixed(2) },
        { title: "Incidents", dataIndex: "numberIncidents", width: 90 },
        { title: "Mis à jour par", dataIndex: "updatedBy", width: 150, render: (v) => getEmployeeName(v) },
        { title: "Mis à jour le", dataIndex: "updatedAt", width: 150, render: (v) => new Date(v).toLocaleDateString() },
        {
            title: "Actions", width: 100, fixed: 'right',
            render: (_, record) => (
                <div onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => openDetails(record)}>
                                <EyeIcon className="h-4 w-4 mr-2" /> Voir détails
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onEdit(record)}>
                                <PencilIcon className="h-4 w-4 mr-2" /> Éditer
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(record.id)} className="text-red-600">
                                <TrashIcon className="h-4 w-4 mr-2" /> Supprimer
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        }
    ];

    return (
        <div className="w-full">
            <div className="py-2 px-4 w-full max-h-[500px]">
                <Form>
                    <Table
                        dataSource={dataList}
                        columns={columns}
                        rowKey="id"
                        pagination={false}
                        loading={loading}
                        onRow={(record) => ({
                            onClick: () => openDetails(record)
                        })}
                        scroll={{ x: 1600, y: "40vh" }}
                        footer={() => <div className="flex justify-end">{pagination}</div>}
                    />
                </Form>
            </div>
            <ReportingCgDetails
                open={detailsOpen}
                setOpen={setDetailsOpen}
                reporting={selectedRecord}
                references={references}
            />
        </div>
    );
};

export default Datalist;