// import React, {useEffect, useState} from 'react';
// import { Button } from '../../ui/button';
// import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
// import { Form, Table, Input, Select } from 'antd';
// import { ChevronDown, DatabaseBackupIcon, MoreHorizontal, XCircle } from "lucide-react"
// import {
//   DropdownMenu,
//   DropdownMenuCheckboxItem,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "../../../components/ui/dropdown-menu"
// import { URLS } from '../../../../configUrl';
// import { useFetch } from '../../../hooks/useFetch';
// import toast from 'react-hot-toast';
// import { EQUIPMENT_DOMAIN } from '../../../utils/constant.utils';

// const Datalist = ({dataList, fetchData, searchValue, pagination, loading, onEditSuccess}) => {
//   const {handleFetch, handlePatch} = useFetch();
//   const [isLoading, setIsLoading] = useState(true);
//   const [employees, setEmployees] = useState([]);
//   const [editingRow, setEditingRow] = useState(null);
//   const [editFormData, setEditFormData] = useState({});
//   const [isSaving, setIsSaving] = useState(false);

//   const handleDelete = async (id) => {
//     if (window.confirm("Voulez-vous supprimer le groupe d'équipement ?")) {
//       try {
//         let url = `${URLS.INCIDENT_API}/equipment-group-families/${id}`;
//         let response = await fetch(url, {
//           method:"DELETE",
//           headers:{
//             "Content-Type":"application/json",
//             'authorization': `Bearer ${localStorage.getItem('token')}` || ''
//           },
//         });
//         toast.success("Supprimé avec succès");
//         fetchData();
//       } catch (error) {
//         console.error(error);
//         toast.error("Vérifier la connexion internet, nous ne pouvons pas récupérer les équipements.");
//       }
//     }
//   }

//   const handleSaveEdit = async (record) => {
//     if (!editFormData.name || !editFormData.domain) {
//       toast.error("Tous les champs sont requis");
//       return;
//     }

//     setIsSaving(true);
//     try {
//       const url = `${URLS.INCIDENT_API}/equipment-group-families/${record.id}`;
//       const response = await handlePatch(url, editFormData, true);
      
//       if (response.error) {
//         response?.errors?.forEach(error => {
//           toast.error(error?.msg);
//         });
//         return;
//       }
      
//       toast.success("Modifié avec succès");
//       setEditingRow(null);
//       setEditFormData({});
//       fetchData();
//       if (onEditSuccess) onEditSuccess();
      
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

//   const highlightText = (text) => {
//     if (!searchValue || !text) return text;

//     const regex = new RegExp(searchValue, 'gi');
//     return <span dangerouslySetInnerHTML={{ __html: text?.toString().replace(
//       new RegExp(searchValue, 'gi'),
//       (match) => `<mark style="background-color: yellow;">${match}</mark>`
//     )}} />
//   };

//   const handleFetchEmployees = async (link) => {
//     try {
//       let response = await handleFetch(link);
//       if(response?.status === 200){
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

//   const columns = [
//     {
//       title:"No ref",
//       dataIndex:"numRef",
//       width:"100px",
//       render:(value, record) => (
//         <p className='text-sm'>{highlightText(value)}</p>
//       )
//     },
//     {
//       title:"Nom",
//       dataIndex:"name",
//       width:"200px",
//       render:(value, record) => 
//         editingRow === record.id ? (
//           <Input
//             value={editFormData.name || value}
//             onChange={(e) => handleEditChange('name', e.target.value)}
//             className="w-full text-sm"
//             placeholder="Nom du domaine"
//           />
//         ) : (
//           <p className='text-sm'>{highlightText(value)}</p>
//         )
//     },
//     {
//       title:"Département",
//       dataIndex:"domain",
//       width:"200px",
//       render:(value, record) => 
//         editingRow === record.id ? (
//           <Select
//             value={editFormData.domain || value}
//             onChange={(val) => handleEditChange('domain', val)}
//             className="w-full"
//             placeholder="Choisir le département"
//           >
//             <Select.Option value="">Choisir le département</Select.Option>
//             {EQUIPMENT_DOMAIN.map((domain, index) => (
//               <Select.Option value={domain.value} key={index}>
//                 {domain.label}
//               </Select.Option>
//             ))}
//           </Select>
//         ) : (
//           <p className='text-sm'>{highlightText(value)}</p>
//         )
//     },
//     {
//       title:"Créé par",
//       dataIndex:"createdBy",
//       width:"200px",
//       render:(value) => (
//         <p className='text-sm capitalize'>
//           {employees.find(employee => employee.value === value)?.name || value}
//         </p>
//       )
//     },
//     {
//       title:"Date de création",
//       dataIndex:"createdAt",
//       width:"200px",
//       render:(value) => (
//         <p className='text-sm'>
//           {highlightText(new Date(value).toLocaleString())}
//         </p>
//       )
//     },
//     {
//       title:"Actions",
//       width:"200px",
//       fixed: 'right',
//       render:(value, record) => 
//         editingRow === record.id ? (
//           <div className="flex gap-2">
//             <Button 
//               onClick={() => handleSaveEdit(record)}
//               disabled={isSaving}
//               className="text-xs p-2 bg-green-600 hover:bg-green-700 rounded-lg text-white shadow flex gap-2"
//             >
//               <DatabaseBackupIcon className='h-4 w-4'/>
//               <span>{isSaving ? "Sauvegarde..." : "Sauvegarder"}</span>
//             </Button>
//             <Button 
//               onClick={handleCancelEdit}
//               className="text-xs p-2 bg-gray-500 hover:bg-gray-600 rounded-lg text-white shadow flex gap-2"
//             >
//               <XCircle className='h-4 w-4'/>
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
//                 onClick={() => {
//                   setEditingRow(record.id);
//                   setEditFormData({
//                     name: record.name,
//                     domain: record.domain
//                   });
//                 }}
//               >
//                 <PencilIcon className='h-4 w-6'/>
//                 <span className=''>Éditer</span>
//               </DropdownMenuItem>
//               <DropdownMenuItem 
//                 className="flex gap-2 items-center hover:bg-red-200 cursor-pointer" 
//                 onClick={() => handleDelete(record.id)}
//               >
//                 <TrashIcon className='text-red-500 h-4 w-6'/>
//                 <span className='text-red-500'>Supprimer</span>
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         )
//     },
//   ];

//   useEffect(() => {
//     handleFetchEmployees(`${import.meta.env.VITE_ENTITY_API}/employees`);
//   }, []);

//   return (
//     <div className="w-full">
//       <div className="py-2 px-4 w-full max-h-[500px]">
//         <Form>
//           <Table 
//             footer={() => <div className='flex'>{pagination}</div>}
//             dataSource={dataList}
//             bordered={true}
//             columns={columns}
//             scroll={{
//               x: 500,
//               y: "40vh"
//             }}
//             pagination={false}
//             loading={loading}
//             rowKey="id"
//           />
//         </Form>
//       </div>
//     </div>
//   )
// }

// export default Datalist

// export default Datalist
import React, {useEffect, useState} from 'react';
import { Button } from '../../ui/button';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Form, Table, Input, Select } from 'antd';
import { ChevronDown, DatabaseBackupIcon, MoreHorizontal, XCircle } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu"
import { URLS } from '../../../../configUrl';
import { useFetch } from '../../../hooks/useFetch';
import toast from 'react-hot-toast';
import { EQUIPMENT_DOMAIN } from '../../../utils/constant.utils';

const Datalist = ({dataList, fetchData, searchValue, pagination, loading, userDomain, userPermissions, onEditSuccess}) => {
  const {handleFetch, handlePatch} = useFetch();
  const [isLoading, setIsLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [editingRow, setEditingRow] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // Fonction pour vérifier si l'utilisateur peut éditer une famille
  const canEditFamily = (family) => {
    // Si pas de permissions définies, autoriser pour le debug
    if (!userPermissions) return true;
    
    // Vérifier la permission spécifique
    const hasEditPermission = userPermissions.includes("equipment__can_edit_equipment_group_family");
    
    // Si l'utilisateur est privilégié, il peut tout éditer
    if (userDomain === "PRIVILEGED") {
      return hasEditPermission;
    }
    
    // Sinon, vérifier que le domaine correspond
    const familyDomain = family?.domain;
    return hasEditPermission && familyDomain === userDomain;
  }

  // Fonction pour vérifier si l'utilisateur peut supprimer une famille
  const canDeleteFamily = () => {
    // Si pas de permissions définies, autoriser pour le debug
    if (!userPermissions) return true;
    
    return userPermissions.includes("equipment__can_delete_equipment_group_family");
  }

  const handleDelete = async (id) => {
    if (!canDeleteFamily()) {
      toast.error("Vous n'avez pas la permission de supprimer");
      return;
    }
    
    if (window.confirm("Voulez-vous supprimer cette famille d'équipement ?")) {
      try {
        let url = `${URLS.INCIDENT_API}/equipment-group-families/${id}`;
        let response = await fetch(url, {
          method:"DELETE",
          headers:{
            "Content-Type":"application/json",
            'authorization': `Bearer ${localStorage.getItem('token')}` || ''
          },
        });
        toast.success("Supprimé avec succès");
        fetchData();
      } catch (error) {
        console.error(error);
        toast.error("Erreur lors de la suppression");
      }
    }
  }

  const handleSaveEdit = async (record) => {
    if (!editFormData.name || !editFormData.domain) {
      toast.error("Tous les champs sont requis");
      return;
    }

    // Vérifier la permission d'édition
    if (!canEditFamily(record)) {
      toast.error("Vous n'avez pas la permission de modifier cette famille");
      return;
    }

    setIsSaving(true);
    try {
      const url = `${URLS.INCIDENT_API}/equipment-group-families/${record.id}`;
      const response = await handlePatch(url, editFormData, true);
      
      if (response.error) {
        response?.errors?.forEach(error => {
          toast.error(error?.msg);
        });
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
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const highlightText = (text) => {
    if (!searchValue || !text) return text;

    const regex = new RegExp(searchValue, 'gi');
    return <span dangerouslySetInnerHTML={{ __html: text?.toString().replace(
      new RegExp(searchValue, 'gi'),
      (match) => `<mark style="background-color: yellow;">${match}</mark>`
    )}} />
  };

  const handleFetchEmployees = async (link) => {
    try {
      let response = await handleFetch(link);
      if(response?.status === 200){
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

  // Fonction pour obtenir le badge de domaine
  const DomainBadge = ({ domain }) => {
    if (!domain) return <span className="text-gray-500 text-xs">--</span>;
    
    const domainConfig = {
      IT: { 
        color: "bg-blue-100 text-blue-800 border border-blue-200",
        text: "IT"
      },
      HSE: { 
        color: "bg-red-100 text-red-800 border border-red-200",
        text: "HSE"
      },
      OPERATIONS: { 
        color: "bg-green-100 text-green-800 border border-green-200",
        text: "OPERATIONS"
      },
      MAINTENANCE: { 
        color: "bg-yellow-100 text-yellow-800 border border-yellow-200",
        text: "MAINTENANCE"
      },
    };
    
    const config = domainConfig[domain] || { 
      color: "bg-gray-100 text-gray-800 border border-gray-200",
      text: domain
    };
    
    return (
      <span className={`inline-block text-xs px-2 py-1 rounded-full ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const columns = [
    {
      title:"No ref",
      dataIndex:"numRef",
      width:"100px",
      render:(value, record) => (
        <p className='text-sm font-medium'>{highlightText(value)}</p>
      )
    },
    {
      title:"Nom",
      dataIndex:"name",
      width:"200px",
      render:(value, record) => 
        editingRow === record.id ? (
          <Input
            value={editFormData.name || value}
            onChange={(e) => handleEditChange('name', e.target.value)}
            className="w-full text-sm"
            placeholder="Nom de la famille"
            disabled={!canEditFamily(record)}
          />
        ) : (
          <p className='text-sm'>{highlightText(value)}</p>
        )
    },
    {
      title:"Département",
      dataIndex:"domain",
      width:"150px",
      render:(value, record) => 
        editingRow === record.id ? (
          <Select
            value={editFormData.domain || value}
            onChange={(val) => handleEditChange('domain', val)}
            className="w-full"
            placeholder="Choisir le département"
            disabled={!canEditFamily(record)}
          >
            <Select.Option value="">Choisir le département</Select.Option>
            {EQUIPMENT_DOMAIN.map((domain, index) => (
              <Select.Option value={domain.value} key={index}>
                {domain.label}
              </Select.Option>
            ))}
          </Select>
        ) : (
          <div className="flex justify-center">
            <DomainBadge domain={value} />
          </div>
        )
    },
    {
      title:"Créé par",
      dataIndex:"createdBy",
      width:"150px",
      render:(value) => (
        <p className='text-sm capitalize'>
          {employees.find(employee => employee.value === value)?.name || value || "--"}
        </p>
      )
    },
    {
      title:"Date de création",
      dataIndex:"createdAt",
      width:"170px",
      render:(value) => (
        <p className='text-sm'>
          {highlightText(new Date(value).toLocaleDateString('fr-FR'))}
        </p>
      )
    },
    {
      title:"Actions",
      width:"150px",
      fixed: 'right',
      render:(value, record) => {
        const canEdit = canEditFamily(record);
        const canDelete = canDeleteFamily();
        
        return editingRow === record.id ? (
          <div className="flex gap-2">
            {canEdit && (
              <>
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
              </>
            )}
          </div>
        ) : (
          <div className="flex justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="h-8 w-8 p-0 hover:bg-gray-100"
                  disabled={!canEdit && !canDelete}
                >
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuLabel className="text-xs font-semibold">
                  Actions
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                {/* Bouton Éditer */}
                {canEdit && (
                  <DropdownMenuItem 
                    className="flex gap-2 items-center cursor-pointer py-2 text-sm"
                    onClick={() => {
                      setEditingRow(record.id);
                      setEditFormData({
                        name: record.name,
                        domain: record.domain
                      });
                    }}
                  >
                    <PencilIcon className='h-4 w-4'/>
                    <span>Éditer</span>
                  </DropdownMenuItem>
                )}
                
                {/* Bouton Supprimer */}
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
                
                {/* Message si aucune action disponible */}
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

  // S'assurer que dataList est un tableau
  const safeDataList = Array.isArray(dataList) ? dataList : [];

  return (
    <div className="w-full">
      <div className="py-2 px-4 w-full max-h-[500px]">
        <Form>
          <Table 
            rowKey={(record) => record.id || record.numRef || Math.random().toString()}
            footer={() => <div className='flex'>{pagination}</div>}
            dataSource={safeDataList}
            bordered={true}
            columns={columns}
            scroll={{
              x: 1000,
              y: "40vh"
            }}
            pagination={false}
            loading={loading || isLoading}
            locale={{
              emptyText: "Aucune famille d'équipement trouvée"
            }}
          />
        </Form>
      </div>
    </div>
  )
}

export default Datalist