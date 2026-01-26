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
 




// const Datalist = ({dataList, fetchData, searchValue, pagination, loading}) => {
//   const {handleFetch} = useFetch();

//   const handleDelete = async (id) =>{
//     if (window.confirm("Voulez vous supprimer la cause d'incident ?")) {
//       try {
//         let url = `${URLS.INCIDENT_API}/incident-causes/${id}`;
//         let response = await fetch(url, {
//           method:"DELETE"
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
          
//   const [sorting, setSorting] = useState([]);
//   const [columnFilters, setColumnFilters] = useState([]);
//   const [columnVisibility, setColumnVisibility] = useState({});
//   const [rowSelection, setRowSelection] = useState({});
//   const [employees, setEmployees] = useState([]);
//   const [editingRow, setEditingRow] = useState("");
//   const columns = [
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
//       title: "Type d'incident associé",
//       dataIndex: "incidentType",   // pointez vers l'objet complet
//       width: "200px",
//       render: (incidentType) => (
//         <p className="text-sm">
//           {highlightText(incidentType?.name || '')}
//         </p>
//       )
//     },
//     {
//       title:"Cree par",
//       dataIndex:"createdBy",
//       width:"200px",
//       render:(value)=><p className='text-sm'>{employees.find(employee => employee.value === value)?.name || highlightText(value)}</p>
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
//               {/* <DropdownMenuItem 
//                 className="flex gap-2 items-center cursor-pointer"
//                 onClick={()=>{
//                   setEditingRow(record.id)
//                 }}
//               >
//                 <PencilIcon className='h-4 w-6'/>
//                 <span className=''>Editer</span>
//               </DropdownMenuItem> */}
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
    
//   const handleFetchEmployees = async (link) =>{
//     try {
//       let response = await handleFetch(link);     
//       if(response?.status === 200){
//         let formatedData = response?.data.map(item=>{
//           return {
//             name:item?.name,
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
//   },[editingRow])

//   useEffect(()=>{
//     handleFetchEmployees(`${import.meta.env.VITE_ENTITY_API}/employees`);
//   },[])

//   return (
//     <div className="w-full">
//       <div className="py-2 px-4 w-full max-h-[500px]">
//         <Form>
//           <Table 
//             footer={() => <div className='flex justify-end'>{pagination}</div>}
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

import React, {useEffect, useState} from 'react';
import { Button } from '../../ui/button';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Form, Table } from 'antd';
import { URLS } from '../../../../configUrl';
import { useFetch } from '../../../hooks/useFetch';
import { EQUIPMENT_DOMAIN } from '../../../utils/constant.utils';
import '../../../utils/Datalist.css'; // Créez ce fichier CSS

const Datalist = ({ 
    dataList, 
    fetchData, 
    searchValue, 
    loading, 
    onEdit,
    userDomain = "PRIVILEGED",
    userPermissions = [],
    selectedDomain = "ALL",
    currentPage = 1,
    pageSize = 10,
    totalItems = 0,
    onPageChange
}) => {
    const { handleFetch } = useFetch();
    const [employees, setEmployees] = useState([]);

    const canDelete = (record) => {
        const hasPermission = userPermissions.includes("incident__can_delete_incident_cause") || 
                            (userDomain === "PRIVILEGED");
        
        if (userDomain !== "PRIVILEGED" && record.incidentType) {
            return record.incidentType.domain === userDomain;
        }
        
        return hasPermission;
    };

    const canEdit = (record) => {
        const hasPermission = userPermissions.includes("incident__can_update_incident_cause") || 
                            (userDomain === "PRIVILEGED");
        
        if (userDomain !== "PRIVILEGED" && record.incidentType) {
            return record.incidentType.domain === userDomain;
        }
        
        return hasPermission;
    };

    const handleDelete = async (id, record) => {
        if (!canDelete(record)) {
            alert("Vous n'avez pas la permission de supprimer cette cause d'incident");
            return;
        }

        if (window.confirm("Voulez-vous supprimer cette cause d'incident ?")) {
            try {
                let url = `${URLS.INCIDENT_API}/incident-causes/${id}`;
                let response = await fetch(url, {
                    method: "DELETE",
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}` || ''
                    }
                });
                if (response.status === 200) {
                    alert("Supprimé avec succès");
                    fetchData();
                }
            } catch (error) {
                console.log(error);
                alert("Erreur lors de la suppression");
            }
        }
    };

    const highlightText = (text) => {
        if (!searchValue || !text) return text || "--";

        try {
            const textStr = String(text);
            const searchStr = String(searchValue);
            const escapedSearch = searchStr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(escapedSearch, 'gi');
            
            const parts = textStr.split(regex);
            const matches = textStr.match(regex);
            
            if (!matches) return textStr;
            
            return parts.reduce((acc, part, i) => [
                ...acc,
                part,
                matches[i] && <mark key={i} style={{ backgroundColor: 'yellow' }}>{matches[i]}</mark>
            ], []);
        } catch (error) {
            console.error("Erreur highlight:", error);
            return text;
        }
    };

    const getDomainBadge = (domain) => {
        if (!domain) return null;
        
        const domainConfig = EQUIPMENT_DOMAIN.find(d => d.value === domain);
        if (!domainConfig) return null;
        
        return (
            <span className={`px-2 py-1 rounded text-xs font-medium ${
                domain === "IT" ? "bg-blue-100 text-blue-800" :
                domain === "HSE" ? "bg-red-100 text-red-800" :
                domain === "OPERATIONS" ? "bg-green-100 text-green-800" :
                domain === "MAINTENANCE" ? "bg-yellow-100 text-yellow-800" :
                "bg-gray-100 text-gray-800"
            }`}>
                {domainConfig.label}
            </span>
        );
    };

    const columns = [
        {
            title: "No ref",
            dataIndex: "numRef",
            width: "100px",
            fixed: 'left',
            render: (value) => <p className='text-sm'>{highlightText(value)}</p>
        },
        {
            title: "Nom",
            dataIndex: "name",
            width: "200px",
            fixed: 'left',
            render: (value) => <p className='text-sm font-medium'>{highlightText(value)}</p>
        },
        {
            title: "Type d'incident associé",
            dataIndex: "incidentType",
            width: "200px",
            render: (incidentType) => (
                <div className="flex flex-col gap-1">
                    <p className="text-sm">
                        {incidentType ? highlightText(incidentType.name) : <span className="text-gray-400">Non spécifié</span>}
                    </p>
                    {/* {incidentType?.domain && (
                        <div>{getDomainBadge(incidentType.domain)}</div>
                    )} */}
                </div>
            )
        },
        {
            title: "Domaine",
            dataIndex: "incidentType",
            width: "120px",
            render: (incidentType) => (
                incidentType?.domain ? getDomainBadge(incidentType.domain) : '--'
            )
        },
        {
            title: "Créé par",
            dataIndex: "createdBy",
            width: "150px",
            render: (value) => <p className='text-sm'>{employees.find(employee => employee.value === value)?.name || highlightText(value)}</p>
        },
        {
            title: "Date de création",
            dataIndex: "createdAt",
            width: "150px",
            render: (value) => <p className='text-sm text-gray-600'>{value ? new Date(value).toLocaleDateString('fr-FR') : '--'}</p>
        },
        {
            title: "Dernière MAJ",
            dataIndex: "updatedAt",
            width: "150px",
            render: (value) => <p className='text-sm text-gray-600'>{value ? new Date(value).toLocaleDateString('fr-FR') : '--'}</p>
        },
        {
            title: "Actions",
            width: "120px",
            fixed: 'right',
            render: (_, record) => (
                <div className="flex gap-2">
                    {/* {canEdit(record) && ( */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(record)}
                            className="h-8 w-8 p-0"
                            title="Modifier"
                        >
                            <PencilIcon className='h-4 w-4' />
                        </Button>
                    {/* )} */}
                    
                    {canDelete(record) && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(record.id, record)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                            title="Supprimer"
                        >
                            <TrashIcon className='h-4 w-4' />
                        </Button>
                    )}
                    
                    {!canEdit(record) && !canDelete(record) && (
                        <span className="text-xs text-gray-400">Non autorisé</span>
                    )}
                </div>
            )
        },
    ];

    const handleFetchEmployees = async () => {
        try {
            let response = await handleFetch(`${import.meta.env.VITE_ENTITY_API}/employees`);
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
        handleFetchEmployees();
    }, []);

    return (
        <div className="w-full datalist-container">
            {/* Indicateur de filtrage */}
            {selectedDomain !== "ALL" && (
                <div className="px-4 py-2 bg-blue-50 border-b">
                    <p className="text-sm text-blue-700">
                        <span className="font-medium">Filtre actif : </span>
                        {selectedDomain === "ALL" ? "Tous les domaines" : 
                         EQUIPMENT_DOMAIN.find(d => d.value === selectedDomain)?.label || selectedDomain}
                    </p>
                </div>
            )}
            
            <div className="py-2 px-4">
                <Form>
                    <Table
                        dataSource={dataList}
                        columns={columns}
                        bordered={true}
                        scroll={{ 
                            x: 1100,
                            y: 'calc(70vh - 200px)' // Ajustez cette valeur selon votre layout
                        }}
                        pagination={false}
                        loading={loading}
                        rowKey="id"
                        sticky={{
                            offsetHeader: 0
                        }}
                        locale={{
                            emptyText: loading 
                                ? "Chargement..." 
                                : searchValue 
                                    ? `Aucun résultat pour "${searchValue}"`
                                    : selectedDomain !== "ALL"
                                        ? `Aucune cause d'incident pour le domaine "${selectedDomain}"`
                                        : "Aucune donnée disponible"
                        }}
                        className="sticky-header-table"
                    />
                </Form>
            </div>
        </div>
    );
};

export default Datalist;

// import React, {useEffect, useState} from 'react';
// import { Button } from '../../ui/button';
// import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
// import { Form, Table } from 'antd';
// import { URLS } from '../../../../configUrl';
// import { useFetch } from '../../../hooks/useFetch';
// import { EQUIPMENT_DOMAIN } from '../../../utils/constant.utils';

// const Datalist = ({ 
//     dataList, 
//     fetchData, 
//     searchValue, 
//     pagination, 
//     loading, 
//     onEdit,
//     userDomain = "PRIVILEGED",
//     userPermissions = [],
//     selectedDomain = "ALL"
// }) => {
//     const { handleFetch } = useFetch();
//     const [employees, setEmployees] = useState([]);

//     const canDelete = (record) => {
//         // Vérifier les permissions pour la suppression
//         const hasPermission = userPermissions.includes("incident__can_delete_incident_cause") || 
//                             (userDomain === "PRIVILEGED");
        
//         // Si l'utilisateur n'est pas privilégié, vérifier s'il peut supprimer selon le domaine
//         if (userDomain !== "PRIVILEGED" && record.incidentType) {
//             return record.incidentType.domain === userDomain;
//         }
        
//         return hasPermission;
//     };

//     const canEdit = (record) => {
//         // Vérifier les permissions pour l'édition
//         const hasPermission = userPermissions.includes("incident__can_update_incident_cause") || 
//                             (userDomain === "PRIVILEGED");
        
//         // Si l'utilisateur n'est pas privilégié, vérifier s'il peut éditer selon le domaine
//         if (userDomain !== "PRIVILEGED" && record.incidentType) {
//             return record.incidentType.domain === userDomain;
//         }
        
//         return hasPermission;
//     };

//     const handleDelete = async (id, record) => {
//         if (!canDelete(record)) {
//             alert("Vous n'avez pas la permission de supprimer cette cause d'incident");
//             return;
//         }

//         if (window.confirm("Voulez-vous supprimer cette cause d'incident ?")) {
//             try {
//                 let url = `${URLS.INCIDENT_API}/incident-causes/${id}`;
//                 let response = await fetch(url, {
//                     method: "DELETE",
//                     headers: {
//                         'Authorization': `Bearer ${localStorage.getItem('token')}` || ''
//                     }
//                 });
//                 if (response.status === 200) {
//                     alert("Supprimé avec succès");
//                     fetchData();
//                 }
//             } catch (error) {
//                 console.log(error);
//                 alert("Erreur lors de la suppression");
//             }
//         }
//     };

//     const highlightText = (text) => {
//         if (!searchValue || !text) return text || "--";

//         try {
//             const textStr = String(text);
//             const searchStr = String(searchValue);
//             const escapedSearch = searchStr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
//             const regex = new RegExp(escapedSearch, 'gi');
            
//             const parts = textStr.split(regex);
//             const matches = textStr.match(regex);
            
//             if (!matches) return textStr;
            
//             return parts.reduce((acc, part, i) => [
//                 ...acc,
//                 part,
//                 matches[i] && <mark key={i} style={{ backgroundColor: 'yellow' }}>{matches[i]}</mark>
//             ], []);
//         } catch (error) {
//             console.error("Erreur highlight:", error);
//             return text;
//         }
//     };

//     const getDomainBadge = (domain) => {
//         if (!domain) return null;
        
//         const domainConfig = EQUIPMENT_DOMAIN.find(d => d.value === domain);
//         if (!domainConfig) return null;
        
//         return (
//             <span className={`px-2 py-1 rounded text-xs font-medium ${
//                 domain === "IT" ? "bg-blue-100 text-blue-800" :
//                 domain === "HSE" ? "bg-red-100 text-red-800" :
//                 domain === "OPERATIONS" ? "bg-green-100 text-green-800" :
//                 domain === "MAINTENANCE" ? "bg-yellow-100 text-yellow-800" :
//                 "bg-gray-100 text-gray-800"
//             }`}>
//                 {domainConfig.label}
//             </span>
//         );
//     };

//     const columns = [
//         {
//             title: "No ref",
//             dataIndex: "numRef",
//             width: "100px",
//             render: (value) => <p className='text-sm'>{highlightText(value)}</p>
//         },
//         {
//             title: "Nom",
//             dataIndex: "name",
//             width: "200px",
//             render: (value) => <p className='text-sm font-medium'>{highlightText(value)}</p>
//         },
//         {
//             title: "Type d'incident associé",
//             dataIndex: "incidentType",
//             width: "200px",
//             render: (incidentType) => (
//                 <div className="flex flex-col gap-1">
//                     <p className="text-sm">
//                         {incidentType ? highlightText(incidentType.name) : <span className="text-gray-400">Non spécifié</span>}
//                     </p>
//                     {incidentType?.domain && (
//                         <div>{getDomainBadge(incidentType.domain)}</div>
//                     )}
//                 </div>
//             )
//         },
//         {
//             title: "Domaine",
//             dataIndex: "incidentType",
//             width: "120px",
//             render: (incidentType) => (
//                 incidentType?.domain ? getDomainBadge(incidentType.domain) : '--'
//             )
//         },
//         {
//             title: "Créé par",
//             dataIndex: "createdBy",
//             width: "150px",
//             render: (value) => <p className='text-sm'>{employees.find(employee => employee.value === value)?.name || highlightText(value)}</p>
//         },
//         {
//             title: "Date de création",
//             dataIndex: "createdAt",
//             width: "150px",
//             render: (value) => <p className='text-sm text-gray-600'>{value ? new Date(value).toLocaleDateString('fr-FR') : '--'}</p>
//         },
//         {
//             title: "Dernière mise à jour",
//             dataIndex: "updatedAt",
//             width: "150px",
//             render: (value) => <p className='text-sm text-gray-600'>{value ? new Date(value).toLocaleDateString('fr-FR') : '--'}</p>
//         },
//         {
//             title: "Actions",
//             width: "120px",
//             fixed: 'right',
//             render: (_, record) => (
//                 <div className="flex gap-2">
//                     {canEdit(record) && (
//                         <Button
//                             variant="ghost"
//                             size="sm"
//                             onClick={() => onEdit(record)}
//                             className="h-8 w-8 p-0"
//                             title="Modifier"
//                         >
//                             <PencilIcon className='h-4 w-4' />
//                         </Button>
//                     )}
                    
//                     {canDelete(record) && (
//                         <Button
//                             variant="ghost"
//                             size="sm"
//                             onClick={() => handleDelete(record.id, record)}
//                             className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
//                             title="Supprimer"
//                         >
//                             <TrashIcon className='h-4 w-4' />
//                         </Button>
//                     )}
                    
//                     {!canEdit(record) && !canDelete(record) && (
//                         <span className="text-xs text-gray-400">Non autorisé</span>
//                     )}
//                 </div>
//             )
//         },
//     ];

//     const handleFetchEmployees = async () => {
//         try {
//             let response = await handleFetch(`${import.meta.env.VITE_ENTITY_API}/employees`);
//             if (response?.status === 200) {
//                 let formatedData = response?.data.map(item => ({
//                     name: item?.name,
//                     value: item?.id
//                 }));
//                 setEmployees(formatedData);
//             }
//         } catch (error) {
//             console.error(error);
//         }
//     };

//     useEffect(() => {
//         handleFetchEmployees();
//     }, []);

//     return (
//         <div className="w-full">
//             {/* Indicateur de filtrage */}
//             {/* {selectedDomain !== "ALL" && (
//                 <div className="px-4 py-2 bg-blue-50 border-b">
//                     <p className="text-sm text-blue-700">
//                         <span className="font-medium">Filtre actif : </span>
//                         {selectedDomain === "ALL" ? "Tous les domaines" : 
//                          EQUIPMENT_DOMAIN.find(d => d.value === selectedDomain)?.label || selectedDomain}
//                     </p>
//                 </div>
//             )} */}
            
//             <div className="py-2 px-4">
//                 <Form>
//                     <Table
//                         footer={() => <div className='flex justify-end'>{pagination}</div>}
//                         dataSource={dataList}
//                         columns={columns}
//                         bordered={true}
//                         scroll={{ x: 1100 }}
//                         pagination={false}
//                         loading={loading}
//                         rowKey="id"
//                         locale={{
//                             emptyText: loading 
//                                 ? "Chargement..." 
//                                 : searchValue 
//                                     ? `Aucun résultat pour "${searchValue}"`
//                                     : selectedDomain !== "ALL"
//                                         ? `Aucune cause d'incident pour le domaine "${selectedDomain}"`
//                                         : "Aucune donnée disponible"
//                         }}
//                     />
//                 </Form>
//             </div>
//         </div>
//     );
// };

// export default Datalist;