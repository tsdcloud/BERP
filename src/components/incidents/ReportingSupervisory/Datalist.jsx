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
import ReportingSupervisoryDetails from './ReportingSupervisoryDetails';

const Datalist = ({ dataList, fetchData, searchValue, pagination, loading, onEdit, references = {} }) => {
    const { handleFetch } = useFetch();
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);

    const { shifts = [], employees = [], suppliers = [], ships = [], products = [] } = references;

    const highlightText = (text) => {
        if (!searchValue || !text) return text;
        const regex = new RegExp(searchValue, 'gi');
        return <span dangerouslySetInnerHTML={{ __html: text.replace(regex, match => `<mark>${match}</mark>`) }} />;
    };

    const handleDelete = async (id) => {
        if (window.confirm("Voulez-vous supprimer ce rapport ?")) {
            try {
                const response = await handleFetch(`${URLS.INCIDENT_API}/reporting-supervisories/${id}`, { method: 'DELETE' });
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

    const getShiftName = (id) => shifts.find(s => s.id === id)?.name || id;
    const getEmployeeName = (id) => employees.find(e => e.id === id)?.name || id;
    const getSupplierName = (id) => suppliers.find(s => s.id === id)?.name || id;
    const getShipName = (id) => ships.find(s => s.id === id)?.name || id;
    const getProductName = (id) => products.find(p => p.id === id)?.name || id;

    const columns = [
        { title: "N° Réf", dataIndex: "numRef", width: 120, render: (v) => highlightText(v) },
        { title: "Créé par", dataIndex: "createdBy", width: 150, render: (v) => getEmployeeName(v) },
        { title: "Créé le", dataIndex: "createdAt", width: 150, render: (v) => new Date(v).toLocaleDateString() },
        { title: "Quart", dataIndex: "shiftId", width: 120, render: (v) => getShiftName(v) },
        { title: "Superviseur entrant", dataIndex: "incomingSupervisoryId", width: 150, render: (v) => getEmployeeName(v) },
        { title: "Chargeurs", dataIndex: "chargers", width: 200, render: (v, record) => 
            record.chargers?.length ? record.chargers.map(c => getSupplierName(c.chargerId)).join(', ') : '--' },
        { title: "Acconiers", dataIndex: "shippers", width: 200, render: (v, record) => 
            record.shippers?.length ? record.shippers.map(s => getSupplierName(s.shipperId)).join(', ') : '--' },
        { title: "Tonnage brut", dataIndex: "grossTonnage", width: 120 },
        { title: "Pesées complètes à F", dataIndex: "completeNumberWeighingsToBeBilled", width: 120 },
        { title: "Incidents", dataIndex: "numberIncidents", width: 100 },
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
                        scroll={{ x: 1200, y: "40vh" }}
                        footer={() => <div className="flex justify-end">{pagination}</div>}
                    />
                </Form>
            </div>
            <ReportingSupervisoryDetails
                open={detailsOpen}
                setOpen={setDetailsOpen}
                reporting={selectedRecord}
                references={references}
            />
        </div>
    );
};

export default Datalist;