// import React, {useEffect, useState} from 'react';
// import { Button } from '../../ui/button';
// import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
// import { Form, Table } from 'antd';
// import {
//   flexRender,
//   getCoreRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   useReactTable,
// } from "@tanstack/react-table"
// import { ChevronDown, MoreHorizontal } from "lucide-react"
// import { Checkbox } from "../../ui/checkbox"
// import {
//   DropdownMenu,
//   DropdownMenuCheckboxItem,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "../../../components/ui/dropdown-menu"
// import { Input } from "../../../components/ui/input"
// import {
//   // Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "../../../components/ui/table"
// import { URLS } from '../../../../configUrl';
// import { useFetch } from '../../../hooks/useFetch';
 
// const token = localStorage.getItem("token")




// const Datalist = ({dataList, fetchData, searchValue, pagination, loading}) => {
//   const {handleFetch} = useFetch();
//   const handleDelete = async (id) =>{
//     if (window.confirm("Voulez vous supprimer le type d'incident ?")) {
//       try {
//         let url = `${URLS.INCIDENT_API}/incident-types/${id}`;
//         let response = await fetch(url, {
//           method:"DELETE",
//           headers:{
//             'authorization':`Bearer ${token}`,
//             'Content-Type':'application/json'
//           }
//         });
//         if(response.status === 200){
//           alert("Deleted successfully");
//           fetchData();
//         }
//       } catch (error) {
//         console.log(error);
//       }
//     }
//   }

//   const highlightText = (text) => {
//     if (!searchValue) return text;

//     const regex = new RegExp(searchValue, 'gi');
//     return <span dangerouslySetInnerHTML={{ __html: text?.replace(
//       new RegExp(searchValue, 'gi'),
//       (match) => `<mark style="background-color: yellow;">${match}</mark>`
//     )}} />
//   };

//   const handleFetchEmployees = async (link) =>{
//     try {
//       let response = await handleFetch(link);     
//       if(response?.status === 200){
//         let formatedData = response?.data.map(item=>{
//           return {
//             name:  item?.name,
//             value: item?.id
//           }
//         });
//         setEmployees(formatedData);
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   }

//   useEffect(()=>{
//     handleFetchEmployees(`${import.meta.env.VITE_ENTITY_API}/employees`);
//   },[])
          
//   const [sorting, setSorting] = useState([]);
//   const [columnFilters, setColumnFilters] = useState([]);
//   const [columnVisibility, setColumnVisibility] = useState({});
//   const [rowSelection, setRowSelection] = useState({});
//   const [editingRow, setEditingRow] = useState("");
//   const [employees, setEmployees] = useState([]);
//   const columns =
//     [
//     {
//       title:"No ref",
//       dataIndex:"numRef",
//       width:"100px",
//       render:(value, record)=>
//         editingRow == record.id ?
//         <input />:
//         <p className='text-sm'>{highlightText(value)}</p>
//     },
//     {
//       title:"Nom",
//       dataIndex:"name",
//       width:"200px",
//       render:(value)=><p className='text-sm'>{highlightText(value)}</p>
//     },
//     {
//       title:"Département",
//       dataIndex:"domain",
//       width:"200px",
//       render:(value)=><p className='text-sm'>{highlightText(value)}</p>
//     },
//     {
//       title:"Crée par",
//       dataIndex:"createdBy",
//       width:"200px",
//       render:(value)=><p className='text-sm'>{employees.filter(employee => employee.value === value)[0]?.name || value}</p>
//     },
//     {
//       title:"Date de création",
//       dataIndex:"createdAt",
//       width:"200px",
//       render:(value)=><p className='text-sm'>{highlightText(value?.split("T")[0])}</p>
//     },
//     {
//       title:"Dernière mise a jour",
//       dataIndex:"updatedAt",
//       width:"200px",
//       render:(value)=><p className='text-sm'>{highlightText(value?.split("T")[0])}</p>
//     },
//     {
//       title:"Actions",
//       width:  "200px",
//       fixed: 'right',
//       render:(value, record)=>
//         editingRow == record.id ?
//         <button title='Enregistrer'>Enreg...</button>:
//       <>
//         <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="ghost" className="h-8 w-8 p-0">
//                 <span className="sr-only">Open menu</span>
//                 <MoreHorizontal />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end">
//               <DropdownMenuLabel>Actions</DropdownMenuLabel>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem 
//                 className="flex gap-2 items-center cursor-pointer"
//                 onClick={()=>{
//                   setEditingRow(record.id)
//                 }}
//               >
//                 <PencilIcon className='h-4 w-6'/>
//                 <span className=''>Editer</span>
//               </DropdownMenuItem>
//               <DropdownMenuItem className="flex gap-2 items-center hover:bg-red-200 cursor-pointer" 
//                 onClick={()=>handleDelete(record.id)}>
//                 <TrashIcon className='text-red-500 h-4 w-6'/>
//                 <span className='text-red-500'>Supprimer</span>
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//       </>
//     },
//   ]
    

//   useEffect(()=>{
//   },[editingRow])
//   const table = useReactTable({
//       data: dataList,
//       columns,
//       onSortingChange: setSorting,
//       onColumnFiltersChange: setColumnFilters,
//       getCoreRowModel: getCoreRowModel(),
//       getPaginationRowModel: getPaginationRowModel(),
//       getSortedRowModel: getSortedRowModel(),
//       getFilteredRowModel: getFilteredRowModel(),
//       onColumnVisibilityChange: setColumnVisibility,
//       onRowSelectionChange: setRowSelection,
//       state: {
//         sorting,
//         columnFilters,
//         columnVisibility,
//         rowSelection,
//       },
//   });

//   return (
//     <div className="w-full">
//       <div className="py-4 px-4 w-full max-h-[500px]">
//         <Form>
//           <Table 
//             footer={() => <div className='flex w-full justify-end'>{pagination}</div>}
//             dataSource={dataList}
//             columns={columns}
//             bordered={true}
//             scroll={{
//                 x: 500,
//                 y: "40vh"
//             }}
//             pagination={false}
//             loading={loading}
//           />
//         </Form>
//       </div>
//       <div className="flex items-center justify-end space-x-2 py-4">
//       </div>
//     </div>
//   )
// }

// export default Datalist

// import React, {useEffect, useState} from 'react';
// import { Button } from '../../ui/button';
// import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
// import { Form, Table, Input, Select } from 'antd';
// import { MoreHorizontal, SaveIcon, X } from "lucide-react"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "../../../components/ui/dropdown-menu"
// import { URLS } from '../../../../configUrl';
// import { useFetch } from '../../../hooks/useFetch';
// import { EQUIPMENT_DOMAIN } from '../../../utils/constant.utils';
// import toast from 'react-hot-toast';

// const Datalist = ({
//   dataList,
//   fetchData,
//   searchValue,
//   loading,
//   totalItems,
//   currentPage,
//   pageSize,
//   onPageChange,
//   onPageSizeChange,
//   onEditRequest
// }) => {
//   const {handleFetch, handlePatch} = useFetch();
//   const [employees, setEmployees] = useState([]);
//   const [editingRow, setEditingRow] = useState(null);
//   const [editFormData, setEditFormData] = useState({});
//   const [isSaving, setIsSaving] = useState(false);

//   const handleDelete = async (id) => {
//     if (window.confirm("Voulez-vous supprimer le type d'incident ?")) {
//       try {
//         let url = `${URLS.INCIDENT_API}/incident-types/${id}`;
//         let response = await fetch(url, {
//           method: "DELETE",
//           headers: {
//             'authorization': `Bearer ${localStorage.getItem("token")}`,
//             'Content-Type': 'application/json'
//           }
//         });
        
//         if (response.status === 200) {
//           toast.success("Supprimé avec succès");
//           fetchData(); // Recharger les données
//         } else {
//           toast.error("Erreur lors de la suppression");
//         }
//       } catch (error) {
//         console.log(error);
//         toast.error("Erreur lors de la suppression");
//       }
//     }
//   };

//   const handleSaveEdit = async (record) => {
//     if (!editFormData.name || !editFormData.domain) {
//       toast.error("Tous les champs sont requis");
//       return;
//     }

//     setIsSaving(true);
//     try {
//       const url = `${URLS.INCIDENT_API}/incident-types/${record.id}`;
//       const response = await handlePatch(url, editFormData, true);
      
//       if (response.error) {
//         toast.error("Erreur lors de la modification");
//         console.log(response);
//         return;
//       }
      
//       toast.success("Modifié avec succès");
//       setEditingRow(null);
//       setEditFormData({});
//       fetchData(); // Recharger les données
      
//     } catch (error) {
//       console.error(error);
//       toast.error("Erreur lors de la modification");
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const handleCancelEdit = () => {
//     setEditingRow(null);
//     setEditFormData({});
//   };

//   const handleEditChange = (field, value) => {
//     setEditFormData(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   const startEdit = (record) => {
//     setEditingRow(record.id);
//     setEditFormData({
//       name: record.name,
//       domain: record.domain
//     });
//   };

//   const highlightText = (text) => {
//     if (!searchValue || !text || typeof text !== 'string') return text;

//     const escapedSearch = searchValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
//     const regex = new RegExp(escapedSearch, 'gi');
//     return text.replace(
//       regex,
//       (match) => `<mark style="background-color: yellow; padding: 1px 0;">${match}</mark>`
//     );
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return '-';
//     try {
//       const date = new Date(dateString);
//       return date.toLocaleDateString('fr-FR');
//     } catch (error) {
//       return dateString.split('T')[0] || dateString;
//     }
//   };

//   const handleFetchEmployees = async (link) => {
//     try {
//       let response = await handleFetch(link);     
//       if (response?.status === 200) {
//         let formatedData = response?.data.map(item => ({
//           name: item?.name,
//           value: item?.id
//         }));
//         setEmployees(formatedData);
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   useEffect(() => {
//     handleFetchEmployees(`${import.meta.env.VITE_ENTITY_API}/employees`);
//   }, []);
          
//   const columns = [
//     {
//       title: "No ref",
//       dataIndex: "numRef",
//       width: "100px",
//       render: (value) => (
//         <div className='text-sm' dangerouslySetInnerHTML={{ 
//           __html: highlightText(value || '-') 
//         }} />
//       )
//     },
//     {
//       title: "Nom",
//       dataIndex: "name",
//       width: "200px",
//       render: (value, record) => 
//         editingRow === record.id ? (
//           <Input
//             value={editFormData.name || value}
//             onChange={(e) => handleEditChange('name', e.target.value)}
//             className="w-full text-sm border rounded px-2 py-1"
//             placeholder="Nom du type d'incident"
//             autoFocus
//           />
//         ) : (
//           <div className='text-sm' dangerouslySetInnerHTML={{ 
//             __html: highlightText(value) 
//           }} />
//         )
//     },
//     {
//       title: "Département",
//       dataIndex: "domain",
//       width: "200px",
//       render: (value, record) => 
//         editingRow === record.id ? (
//           <Select
//             value={editFormData.domain || value}
//             onChange={(val) => handleEditChange('domain', val)}
//             className="w-full text-sm"
//             placeholder="Choisir le département"
//             size="small"
//           >
//             <Select.Option value="">Sélectionner...</Select.Option>
//             {EQUIPMENT_DOMAIN.map((domain, index) => (
//               <Select.Option value={domain.value} key={index}>
//                 {domain.label}
//               </Select.Option>
//             ))}
//           </Select>
//         ) : (
//           <div className='text-sm' dangerouslySetInnerHTML={{ 
//             __html: highlightText(
//               EQUIPMENT_DOMAIN.find(d => d.value === value)?.label || value
//             ) 
//           }} />
//         )
//     },
//     {
//       title: "Créé par",
//       dataIndex: "createdBy",
//       width: "150px",
//       render: (value) => {
//         const employee = employees.find(emp => emp.value === value);
//         return (
//           <div className='text-sm' dangerouslySetInnerHTML={{ 
//             __html: highlightText(employee?.name || value || '-') 
//           }} />
//         );
//       }
//     },
//     {
//       title: "Date de création",
//       dataIndex: "createdAt",
//       width: "150px",
//       render: (value) => (
//         <div className='text-sm' dangerouslySetInnerHTML={{ 
//           __html: highlightText(formatDate(value)) 
//         }} />
//       )
//     },
//     {
//       title: "Actions",
//       width: "120px",
//       fixed: 'right',
//       render: (value, record) => 
//         editingRow === record.id ? (
//           <div className="flex gap-1">
//             <Button 
//               onClick={() => handleSaveEdit(record)}
//               disabled={isSaving}
//               className="h-7 px-2 bg-green-600 hover:bg-green-700 text-white text-xs flex gap-1 items-center"
//               size="sm"
//             >
//               <SaveIcon className='h-3 w-3'/>
//               <span>{isSaving ? "..." : "Save"}</span>
//             </Button>
//             <Button 
//               onClick={handleCancelEdit}
//               className="h-7 px-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs flex gap-1 items-center border"
//               size="sm"
//             >
//               <X className='h-3 w-3'/>
//               <span>Annuler</span>
//             </Button>
//           </div>
//         ) : (
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="ghost" className="h-8 w-8 p-0">
//                 <span className="sr-only">Open menu</span>
//                 <MoreHorizontal />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end">
//               <DropdownMenuLabel>Actions</DropdownMenuLabel>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem 
//                 className="flex gap-2 items-center cursor-pointer"
//                 onClick={() => startEdit(record)}
//               >
//                 <PencilIcon className='h-4 w-4'/>
//                 <span>Éditer</span>
//               </DropdownMenuItem>
              
              
//               <DropdownMenuItem 
//                 className="flex gap-2 items-center hover:bg-red-50 cursor-pointer" 
//                 onClick={() => handleDelete(record.id)}
//               >
//                 <TrashIcon className='text-red-500 h-4 w-4'/>
//                 <span className='text-red-500'>Supprimer</span>
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         )
//     },
//   ];

//   return (
//     <div className="w-full">
//       <div className="py-2 px-4 w-full">
//         <Form>
//           <Table 
//             dataSource={dataList}
//             columns={columns}
//             bordered={true}
//             scroll={{
//               x: 900,
//               y: "50vh"
//             }}
//             pagination={false}
//             loading={loading}
//             rowKey="id"
//             locale={{
//               emptyText: loading 
//                 ? "Chargement..." 
//                 : searchValue 
//                   ? `Aucun résultat pour "${searchValue}"`
//                   : "Aucune donnée disponible"
//             }}
//           />
//         </Form>
//       </div>
//     </div>
//   );
// };

// export default Datalist;

import React, {useEffect, useState} from 'react';
import { Button } from '../../ui/button';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Form, Table, Input, Select } from 'antd';
import { MoreHorizontal, SaveIcon, X } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu"
import { URLS } from '../../../../configUrl';
import { useFetch } from '../../../hooks/useFetch';
import { EQUIPMENT_DOMAIN } from '../../../utils/constant.utils';
import toast from 'react-hot-toast';

const Datalist = ({
  dataList,
  fetchData,
  searchValue,
  loading,
  totalItems,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onEditRequest,
  userDomain = "PRIVILEGED", // Valeur par défaut
  userPermissions = [], // Valeur par défaut
  selectedDomain = "ALL" // Nouvelle prop
}) => {
  const {handleFetch, handlePatch} = useFetch();
  const [employees, setEmployees] = useState([]);
  const [editingRow, setEditingRow] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const handleDelete = async (id) => {
    // Vérifier les permissions avant la suppression
    const canDelete = userPermissions.includes("incident__can_delete_incident_type") || 
                     (userDomain === "PRIVILEGED");
    
    if (!canDelete) {
      toast.error("Vous n'avez pas la permission de supprimer");
      return;
    }

    if (window.confirm("Voulez-vous supprimer le type d'incident ?")) {
      try {
        let url = `${URLS.INCIDENT_API}/incident-types/${id}`;
        let response = await fetch(url, {
          method: "DELETE",
          headers: {
            'authorization': `Bearer ${localStorage.getItem("token")}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.status === 200) {
          toast.success("Supprimé avec succès");
          fetchData();
        } else {
          toast.error("Erreur lors de la suppression");
        }
      } catch (error) {
        console.log(error);
        toast.error("Erreur lors de la suppression");
      }
    }
  };

  const handleSaveEdit = async (record) => {
    // Vérifier les permissions avant l'édition
    const canEdit = userPermissions.includes("incident__can_update_incident_type") || 
                   (userDomain === "PRIVILEGED") ||
                   (record.domain && record.domain === userDomain);
    
    if (!canEdit) {
      toast.error("Vous n'avez pas la permission de modifier");
      return;
    }

    if (!editFormData.name || !editFormData.domain) {
      toast.error("Tous les champs sont requis");
      return;
    }

    setIsSaving(true);
    try {
      const url = `${URLS.INCIDENT_API}/incident-types/${record.id}`;
      const response = await handlePatch(url, editFormData, true);
      
      if (response.error) {
        toast.error("Erreur lors de la modification");
        console.log(response);
        return;
      }
      
      toast.success("Modifié avec succès");
      setEditingRow(null);
      setEditFormData({});
      fetchData();
      
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
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const startEdit = (record) => {
    // Vérifier les permissions avant d'éditer
    const canEdit = userPermissions.includes("incident__can_update_incident_type") || 
                   (userDomain === "PRIVILEGED") ||
                   (record.domain && record.domain === userDomain);
    
    if (!canEdit) {
      toast.error("Vous n'avez pas la permission de modifier cet élément");
      return;
    }

    setEditingRow(record.id);
    setEditFormData({
      name: record.name,
      domain: record.domain
    });
  };

  const highlightText = (text) => {
    if (!searchValue || !text || typeof text !== 'string') return text;

    const escapedSearch = searchValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escapedSearch, 'gi');
    return text.replace(
      regex,
      (match) => `<mark style="background-color: yellow; padding: 1px 0;">${match}</mark>`
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR');
    } catch (error) {
      return dateString.split('T')[0] || dateString;
    }
  };

  const handleFetchEmployees = async (link) => {
    try {
      let response = await handleFetch(link);     
      if (response?.status === 200) {
        let formatedData = response?.data.map(item => ({
          name: item?.name,
          value: item?.id
        }));
        setEmployees(formatedData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handleFetchEmployees(`${import.meta.env.VITE_ENTITY_API}/employees`);
  }, []);
          
  const columns = [
    {
      title: "No ref",
      dataIndex: "numRef",
      width: "100px",
      render: (value) => (
        <div className='text-sm' dangerouslySetInnerHTML={{ 
          __html: highlightText(value || '-') 
        }} />
      )
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
            className="w-full text-sm border rounded px-2 py-1"
            placeholder="Nom du type d'incident"
            autoFocus
          />
        ) : (
          <div className='text-sm' dangerouslySetInnerHTML={{ 
            __html: highlightText(value) 
          }} />
        )
    },
    {
      title: "Département",
      dataIndex: "domain",
      width: "200px",
      render: (value, record) => 
        editingRow === record.id ? (
          <Select
            value={editFormData.domain || value}
            onChange={(val) => handleEditChange('domain', val)}
            className="w-full text-sm"
            placeholder="Choisir le département"
            size="small"
            disabled={userDomain !== "PRIVILEGED" && userDomain !== record.domain}
          >
            <Select.Option value="">Sélectionner...</Select.Option>
            {EQUIPMENT_DOMAIN.map((domain, index) => (
              <Select.Option 
                value={domain.value} 
                key={index}
                disabled={userDomain !== "PRIVILEGED" && userDomain !== domain.value}
              >
                {domain.label}
                {userDomain !== "PRIVILEGED" && userDomain !== domain.value && " (Non autorisé)"}
              </Select.Option>
            ))}
          </Select>
        ) : (
          <div className='text-sm' dangerouslySetInnerHTML={{ 
            __html: highlightText(
              EQUIPMENT_DOMAIN.find(d => d.value === value)?.label || value
            ) 
          }} />
        )
    },
    {
      title: "Créé par",
      dataIndex: "createdBy",
      width: "150px",
      render: (value) => {
        const employee = employees.find(emp => emp.value === value);
        return (
          <div className='text-sm' dangerouslySetInnerHTML={{ 
            __html: highlightText(employee?.name || value || '-') 
          }} />
        );
      }
    },
    {
      title: "Date de création",
      dataIndex: "createdAt",
      width: "150px",
      render: (value) => (
        <div className='text-sm' dangerouslySetInnerHTML={{ 
          __html: highlightText(formatDate(value)) 
        }} />
      )
    },
    {
      title: "Actions",
      width: "120px",
      fixed: 'right',
      render: (value, record) => {
          // Vérifier les permissions pour l'édition
          const canEdit = userPermissions.includes("incident__can_update_incident_type") || 
                        (userDomain === "PRIVILEGED") ||
                        (record.domain && record.domain === userDomain);
          
          // Vérifier les permissions pour la suppression
          const canDelete = userPermissions.includes("incident__can_delete_incident_type") || 
                          (userDomain === "PRIVILEGED");
          
          return editingRow === record.id ? (
              <div className="flex gap-1">
                  {canEdit && (
                      <Button 
                          onClick={() => handleSaveEdit(record)}
                          disabled={isSaving}
                          className="h-7 px-2 bg-green-600 hover:bg-green-700 text-white text-xs flex gap-1 items-center"
                          size="sm"
                      >
                          <SaveIcon className='h-3 w-3'/>
                          <span>{isSaving ? "..." : "Enregistrer"}</span>
                      </Button>
                  )}
                  <Button 
                      onClick={handleCancelEdit}
                      className="h-7 px-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs flex gap-1 items-center border"
                      size="sm"
                  >
                      <X className='h-3 w-3'/>
                      <span>Annuler</span>
                  </Button>
              </div>
          ) : (
              <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal />
                      </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      
                      {canEdit && (
                          <DropdownMenuItem 
                              className="flex gap-2 items-center cursor-pointer"
                              onClick={() => startEdit(record)}
                          >
                              <PencilIcon className='h-4 w-4'/>
                              <span>Éditer</span>
                          </DropdownMenuItem>
                      )}
                      
                      {canDelete && (
                          <DropdownMenuItem 
                              className="flex gap-2 items-center hover:bg-red-50 cursor-pointer" 
                              onClick={() => handleDelete(record.id)}
                          >
                              <TrashIcon className='text-red-500 h-4 w-4'/>
                              <span className='text-red-500'>Supprimer</span>
                          </DropdownMenuItem>
                      )}
                      
                      {/* Message si aucune permission */}
                      {!canEdit && !canDelete && (
                          <DropdownMenuItem className="text-gray-400 cursor-not-allowed">
                              Aucune permission
                          </DropdownMenuItem>
                      )}
                  </DropdownMenuContent>
              </DropdownMenu>
          )
      }
    },
  ];

  return (
    <div className="w-full">
      <div className="py-2 px-4 w-full">
        {/* Indicateur de filtrage actif */}
        {/* {selectedDomain !== "ALL" && (
          <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded text-sm">
            <span className="font-medium">Filtre actif : </span>
            <span className="text-blue-700">
              {selectedDomain === "ALL" ? "Tous les domaines" : 
               EQUIPMENT_DOMAIN.find(d => d.value === selectedDomain)?.label || selectedDomain}
            </span>
          </div>
        )} */}
        
        <Form>
          <Table 
            dataSource={dataList}
            columns={columns}
            bordered={true}
            scroll={{
              x: 900,
              y: "50vh"
            }}
            pagination={false}
            loading={loading}
            rowKey="id"
            locale={{
              emptyText: loading 
                ? "Chargement..." 
                : searchValue 
                  ? `Aucun résultat pour "${searchValue}"`
                  : selectedDomain !== "ALL"
                    ? `Aucun type d'incident pour le domaine "${selectedDomain}"`
                    : "Aucune donnée disponible"
            }}
          />
        </Form>
      </div>
    </div>
  );
};

export default Datalist;