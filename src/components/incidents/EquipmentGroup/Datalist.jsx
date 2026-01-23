// import React, {useEffect, useState} from 'react';
// import { Button } from '../../ui/button';
// import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
// import { Form, Table } from 'antd';
// import { ChevronDown, DatabaseBackupIcon, MoreHorizontal } from "lucide-react"
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




// const Datalist = ({dataList, fetchData, searchValue, pagination, loading}) => {

//   const handleDelete = async (id) =>{
//     if (window.confirm("Voulez vous supprimer le group d'equipement ?")) {
//       try {
//         let url = `${URLS.INCIDENT_API}/equipment-groups/${id}`;
//         let response = await fetch(url, {
//           method:"DELETE",
//           headers:{
//             "Content-Type":"application/json",
//             'authorization': `Bearer ${localStorage.getItem('token')}` || ''
//           },
//         });
//         toast.success("Supprimé avec succès");
//         fetchData();
//         return
//         console.log(response.error)
//         if(!response.error){
//         }
//       } catch (error) {
//         console.error(error);
//         toast.error("Vérifier la connexion internet, nous ne pouvons pas récupérer les équipements.");
//       }
//     }
//   }

//   const {handleFetch} = useFetch();

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
//   const [employees, setEmployees] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [columnVisibility, setColumnVisibility] = useState({});
//   const [rowSelection, setRowSelection] = useState({});
//   const [editingRow, setEditingRow] = useState("");


//   const [open, setOpen] = useState(false);
//   const columns = [
//     {
//       title:"No ref",
//       dataIndex:"numRef",
//       width:"100px",
//       render:(value, record)=>
//         editingRow == record.id ?
//         <input className='w-full border rounded-lg p-2 text-sm'/>:
//         <p className='text-sm'>{highlightText(value)}</p>
//     },
//     {
//       title:"Nom",
//       dataIndex:"name",
//       width:"200px",
//       render:(value)=><p className='text-sm'>{highlightText(value)}</p>
//     },
//     {
//       title:"Famille d'equipement",
//       dataIndex:"equipmentGroupFamily",
//       width:"200px",
//       render:(value)=><p className='text-sm'>{value?.name ? highlightText(value?.name) : "--"}</p>
//     },
//     {
//       title:"Cree par",
//       dataIndex:"createdBy",
//       width:"200px",
//       render:(value)=><p className='text-sm capitalize'>{employees.find(site => site.value === value)?.name || value}</p>
//     },
//     {
//       title:"Date de création",
//       dataIndex:"createdAt",
//       width:"200px",
//       render:(value)=><p className='text-sm'>{highlightText(new Date(value).toLocaleString().toString())}</p>
//     },
//     {
//       title:"Dernière mise a jour",
//       dataIndex:"updatedAt",
//       width:"200px",
//       render:(value)=><p className='text-sm'>{highlightText(new Date(value).toLocaleString().toString())}</p>
//     },
//     {
//       title:"Actions",
//       width:  "200px",
//       fixed: 'right',
//       render:(value, record)=>
//         editingRow == record.id ?
//         <button title='Enregistrer' className='text-xs p-2 bg-secondary rounded-lg text-white shadow flex gap-2'>
//           <DatabaseBackupIcon className='h-4 w-4'/>
//           <span>Sauvegarder</span>
//         </button>:
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
//     handleFetchEmployees(`${import.meta.env.VITE_ENTITY_API}/employees`);
//   },[])

//   useEffect(()=>{
//   },[editingRow])

//   return (
//     <div className="w-full">
//       <div className="py-2 px-4 w-full max-h-[500px]">
//         <Form>
//           <Table 
//             footer={() => <div className='flex'>{pagination}</div>}
//             dataSource={dataList}
//             bordered={true}
//             columns={columns}
//             onRow={record => ({
//               onClick: () => {
//                 setOpen(true);
//               }
//             })}
//             scroll={{
//                 x: 500,
//                 y: "40vh"
//             }}
//             pagination={false}
//             loading={loading}
//           />
//         </Form>
//       </div>
//     </div>
//   )
// }

// export default Datalist

import React, {useEffect, useState} from 'react';
import { Button } from '../../ui/button';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Form, Table } from 'antd';
import { MoreHorizontal } from "lucide-react"
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
import toast from 'react-hot-toast';
import EditEquipmentGroupForm from './EditEquipmentGroupForm';

const Datalist = ({dataList, fetchData, searchValue, pagination, loading, userDomain, userPermissions}) => {
  const {handleFetch, handleDelete} = useFetch();
  
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fonction de suppression
  const handleDeleteGroup = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce groupe d'équipement ?")) {
      try {
        const response = await handleDelete(`${URLS.INCIDENT_API}/equipment-groups/${id}`);
        
        console.log("Réponse suppression:", response);
        
        // Vérifier la réponse selon le format de votre API
        if (response && response.status === 200) {
          toast.success("Supprimé avec succès");
          fetchData();
        } else if (response && !response.error) {
          toast.success("Supprimé avec succès");
          fetchData();
        } else {
          // Gérer les erreurs spécifiques
          if (response?.errors) {
            response.errors.forEach(err => toast.error(err.msg || err.message));
          } else if (response?.error) {
            toast.error(response.error);
          } else {
            toast.error("Erreur lors de la suppression");
          }
        }
      } catch (error) {
        console.error("Erreur suppression:", error);
        toast.error("Erreur réseau lors de la suppression");
      }
    }
  }

  // Fonction pour vérifier si l'utilisateur peut éditer un groupe
  const canEditGroup = (group) => {
    // Si pas de permissions définies, autoriser pour le debug
    if (!userPermissions) return true;
    
    // Vérifier la permission spécifique
    const hasEditPermission = userPermissions.includes("equipment__can_edit_equipment_group");
    
    // Si l'utilisateur est privilégié, il peut tout éditer
    if (userDomain === "PRIVILEGED") {
      return hasEditPermission;
    }
    
    // Sinon, vérifier que le domaine correspond
    const groupDomain = group?.equipmentGroupFamily?.domain;
    return hasEditPermission && groupDomain === userDomain;
  }

  // Fonction pour vérifier si l'utilisateur peut supprimer un groupe
  const canDeleteGroup = () => {
    // Si pas de permissions définies, autoriser pour le debug
    if (!userPermissions) return true;
    
    return userPermissions.includes("equipment__can_delete_equipment_group");
  }

  // Mise en surbrillance du texte de recherche
  const highlightText = (text) => {
    if (!searchValue || !text) return text || '--';
    
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

  // Colonnes du tableau
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
      width: "180px",
      render: (value) => <p className='text-sm'>{highlightText(value)}</p>
    },
    {
      title: "Domaine",
      dataIndex: "equipmentGroupFamily",
      width: "120px",
      render: (value) => (
        <div className="flex justify-center">
          <DomainBadge domain={value?.domain} />
        </div>
      )
    },
    {
      title: "Famille d'équipement",
      dataIndex: "equipmentGroupFamily",
      width: "180px",
      render: (value) => (
        <p className='text-sm'>
          {value?.name ? highlightText(value.name) : "--"}
        </p>
      )
    },
    {
      title: "Créé par",
      dataIndex: "createdBy",
      width: "150px",
      render: (value) => (
        <p className='text-sm capitalize'>
          {employees.find(emp => emp.value === value)?.name || value || "--"}
        </p>
      )
    },
    {
      title: "Date de création",
      dataIndex: "createdAt",
      width: "170px",
      render: (value) => (
        <p className='text-sm'>
          {value ? highlightText(new Date(value).toLocaleDateString('fr-FR')) : "--"}
        </p>
      )
    },
    {
      title: "Actions",
      width: "130px",
      fixed: 'right',
      render: (value, record) => {
        const canEdit = canEditGroup(record);
        const canDelete = canDeleteGroup();
        
        return (
          <div className="flex justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="h-8 w-8 p-0 hover:bg-gray-100"
                  onClick={(e) => e.stopPropagation()} // Empêche le clic de se propager
                >
                  <span className="sr-only">Ouvrir le menu</span>
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
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("Éditer groupe:", record);
                      setSelectedGroup(record);
                      setEditModalOpen(true);
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
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteGroup(record.id);
                      }}
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

  // Charger la liste des employés
  const handleFetchEmployees = async (link) => {
    try {
      let response = await handleFetch(link);
      if (response?.status === 200) {
        let formatedData = response?.data?.map(item => ({
          name: item?.name,
          value: item?.id
        })) || [];
        setEmployees(formatedData);
      }
    } catch (error) {
      console.error("Erreur chargement employés:", error);
    }
  };

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
              x: 1100,
              y: "40vh"
            }}
            pagination={false}
            loading={loading || isLoading}
            locale={{
              emptyText: "Aucun groupe d'équipement trouvé"
            }}
          />
        </Form>
      </div>
      
      {/* Modal d'édition */}
      {editModalOpen && selectedGroup && (
        <EditEquipmentGroupForm
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          group={selectedGroup}
          onSuccess={() => {
            fetchData();
            setEditModalOpen(false);
            toast.success("Groupe d'équipement mis à jour avec succès");
          }}
        />
      )}
    </div>
  );
};

export default Datalist;