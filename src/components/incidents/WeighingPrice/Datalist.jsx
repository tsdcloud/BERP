import React, { useEffect, useState } from 'react';
import { Button } from '../../ui/button';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Table, Input } from 'antd';
import { DatabaseBackupIcon, MoreHorizontal, XCircle } from "lucide-react";
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

const Datalist = ({ dataList, fetchData, searchValue, pagination, loading, userPermissions, onEditSuccess, onEdit }) => {
  const { handleFetch, handlePatch } = useFetch();
  const [isLoading, setIsLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [editingRow, setEditingRow] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const canEditWeighingPrice = () => {
    if (!userPermissions) return true;
    return userPermissions.includes("weighingPrice__can_edit");
  };

  const canDeleteWeighingPrice = () => {
    if (!userPermissions) return true;
    return userPermissions.includes("weighingPrice__can_delete");
  };

  const handleDelete = async (id) => {
    if (!canDeleteWeighingPrice()) {
      toast.error("Vous n'avez pas la permission de supprimer");
      return;
    }
    if (window.confirm("Voulez-vous supprimer ce prix de pesée ?")) {
      try {
        const url = `${URLS.INCIDENT_API}/weighing-prices/${id}`;
        const response = await fetch(url, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            'authorization': `Bearer ${localStorage.getItem('token')}` || ''
          },
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        toast.success("Supprimé avec succès");
        fetchData();
      } catch (error) {
        console.error(error);
        toast.error("Erreur lors de la suppression");
      }
    }
  };

  const handleSaveEdit = async (record) => {
    if (!editFormData.name) {
      toast.error("Le nom est requis");
      return;
    }
    setIsSaving(true);
    try {
      const url = `${URLS.INCIDENT_API}/weighing-prices/${record.id}`;
      const response = await handlePatch(url, editFormData, true);
      if (response?.error || response?.errors) {
        const errors = response?.errors || [{ msg: "Erreur lors de la modification" }];
        errors.forEach(error => toast.error(error?.msg || "Erreur"));
        setIsSaving(false);
        return;
      }
      toast.success("Modifié avec succès");
      setEditingRow(null);
      setEditFormData({});
      fetchData();
      if (onEditSuccess) onEditSuccess();
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la modification");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingRow(null);
    setEditFormData({});
  };

  const handleEditChange = (field, value) => {
    setEditFormData(prev => ({ ...prev, [field]: value }));
  };

  const highlightText = (text) => {
    if (!searchValue || !text) return text;
    const regex = new RegExp(searchValue, 'gi');
    const parts = text.toString().split(regex);
    const matches = text.toString().match(regex) || [];
    return (
      <span>
        {parts.map((part, i) => (
          <React.Fragment key={i}>
            {part}
            {matches[i] && <mark style={{ backgroundColor: 'yellow' }}>{matches[i]}</mark>}
          </React.Fragment>
        ))}
      </span>
    );
  };

  const handleFetchEmployees = async (link) => {
    try {
      const response = await handleFetch(link);
      if (response?.status === 200) {
        const formatedData = response?.data.map(item => ({
          name: item?.name,
          value: item?.id
        }));
        setEmployees(formatedData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const columns = [
    {
      title: "No ref",
      dataIndex: "numRef",
      width: "100px",
      render: (value) => <p className='text-sm font-medium'>{highlightText(value)}</p>
    },
    {
      title: "Nom",
      dataIndex: "name",
      width: "200px",
      render: (value, record) => 
        editingRow === record.id ? (
          <Input
            value={editFormData.name || value}
            onChange={(e) => handleEditChange('name', e.target.value)}
            className="w-full text-sm"
            placeholder="Nom du prix de pesée"
          />
        ) : (
          <p className='text-sm'>{highlightText(value)}</p>
        )
    },
    {
      title: "Prix (XAF)",
      dataIndex: "price",
      width: "120px",
      render: (value, record) => 
        editingRow === record.id ? (
          <Input
            type="number"
            step="0.01"
            value={editFormData.price !== undefined ? editFormData.price : value}
            onChange={(e) => handleEditChange('price', parseFloat(e.target.value) || 0)}
            className="w-full text-sm"
            placeholder="Prix"
          />
        ) : (
        //   <p className='text-sm'>{value !== undefined && value !== null ? `${value}` : "--"}</p>
        <p className="text-sm">
            {value !== undefined && value !== null
                ? Number(value).toLocaleString('fr-FR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                })
                : "--"}
        </p>
        )
    },
    {
      title: "Créé par",
      dataIndex: "createdBy",
      width: "150px",
      render: (value) => (
        <p className='text-sm capitalize'>
          {employees.find(employee => employee.value === value)?.name || value || "--"}
        </p>
      )
    },
    {
      title: "Date de création",
      dataIndex: "createdAt",
      width: "170px",
      render: (value) => (
        <p className='text-sm'>
          {highlightText(new Date(value).toLocaleDateString('fr-FR'))}
        </p>
      )
    },
    {
      title: "Actions",
      width: "150px",
      fixed: 'right',
      render: (value, record) => {
        const canEdit = canEditWeighingPrice();
        const canDelete = canDeleteWeighingPrice();
        return editingRow === record.id ? (
          <div className="flex gap-2">
            <Button 
              onClick={() => handleSaveEdit(record)}
              disabled={isSaving}
              className="text-xs p-2 bg-green-600 hover:bg-green-700 rounded-lg text-white shadow flex gap-2"
            >
              <DatabaseBackupIcon className='h-4 w-4'/>
              <span>{isSaving ? "Sauvegarde..." : "Sauvegarder"}</span>
            </Button>
            <Button 
              onClick={handleCancelEdit}
              className="text-xs p-2 bg-gray-500 hover:bg-gray-600 rounded-lg text-white shadow flex gap-2"
            >
              <XCircle className='h-4 w-4'/>
              <span>Annuler</span>
            </Button>
          </div>
        ) : (
          <div className="flex justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuLabel className="text-xs font-semibold">Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {/* {canEdit && ( */}
                { (
                  <DropdownMenuItem 
                    className="flex gap-2 items-center cursor-pointer py-2 text-sm"
                    onClick={() => {
                      if (onEdit) {
                        onEdit(record);
                      } else {
                        setEditingRow(record.id);
                        setEditFormData({ name: record.name, price: record.price });
                      }
                    }}
                  >
                    <PencilIcon className='h-4 w-4'/>
                    <span>Éditer</span>
                  </DropdownMenuItem>
                )}
                {canDelete && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="flex gap-2 items-center hover:bg-red-50 cursor-pointer py-2 text-sm"
                      onClick={() => handleDelete(record.id)}
                    >
                      <TrashIcon className='text-red-500 h-4 w-4'/>
                      <span className='text-red-600'>Supprimer</span>
                    </DropdownMenuItem>
                  </>
                )}
                {!canEdit && !canDelete && (
                  <DropdownMenuItem className="text-xs text-gray-500 italic py-2">
                    Aucune action disponible
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      }
    },
  ];

  useEffect(() => {
    handleFetchEmployees(`${import.meta.env.VITE_ENTITY_API}/employees`);
    setIsLoading(false);
  }, []);

  const safeDataList = Array.isArray(dataList) ? dataList : [];

  return (
    <div className="w-full">
      <div className="py-2 px-4 w-full max-h-[500px]">
        <Table 
          rowKey={(record) => record.id || record.numRef || Math.random().toString()}
          footer={() => <div className='flex'>{pagination}</div>}
          dataSource={safeDataList}
          bordered={true}
          columns={columns}
          scroll={{ x: 1000, y: "40vh" }}
          pagination={false}
          loading={loading || isLoading}
          locale={{ emptyText: "Aucun prix de pesée trouvé" }}
        />
      </div>
    </div>
  );
};

export default Datalist;