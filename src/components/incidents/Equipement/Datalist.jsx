// // Datalist.js - Version simplifiée avec juste la colonne domaine
// import React, {useEffect, useState} from 'react';
// import { Button } from '../../ui/button';
// import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
// import { Form, Table } from 'antd';
// import { DatabaseBackupIcon, MoreHorizontal } from "lucide-react"
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
// import toast from 'react-hot-toast';
// import EquipementDetails from './EquipementDetails';
// import EditEquipementForm from './EditEquipementForm';

// const Datalist = ({dataList, fetchData, searchValue, pagination, loading}) => {
//   const {handleFetch} = useFetch();

//   const handleDelete = async (id) =>{
//     if (window.confirm("Voulez vous supprimer l'equipement ?")) {
//       try {
//         let url = `${URLS.INCIDENT_API}/equipements/${id}`;
//         let response = await fetch(url, {
//           method:"DELETE",
//           headers:{
//             "Content-Type":"application/json",
//             'authorization': `Bearer ${localStorage.getItem('token')}` || ''
//           },
//         });
//         if(response.status === 200){
//           toast.success("Supprimé avec succès");
//           fetchData();
//           return
//         }
//       } catch (error) {
//         console.error(error);
//         toast.error("Vérifier la connexion internet, nous ne pouvons pas récupérer les équipements.");
//       }
//     }
//   }

//   // État pour gérer l'ouverture du modal d'édition
//   const [editModalOpen, setEditModalOpen] = useState(false);
//   const [selectedEquipement, setSelectedEquipement] = useState(null);

//   const highlightText = (text) => {
//     if (!searchValue) return text;

//     const regex = new RegExp(searchValue, 'gi');
//     return <span dangerouslySetInnerHTML={{ __html: text?.replace(
//       new RegExp(searchValue, 'gi'),
//       (match) => `<mark style="background-color: yellow;">${match}</mark>`
//     )}} />
//   };
          
//   const [sites, setSites] = useState([]);
//   const [employees, setEmployees] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [open, setOpen] = useState(false);
//   const [rowSelection, setRowSelection] = useState({});

//   // Fonction pour obtenir le domaine d'un équipement
//   const getEquipmentDomain = (equipmentGroup) => {
//     if (!equipmentGroup || !equipmentGroup.equipmentGroupFamily) {
//       return null;
//     }
//     return equipmentGroup.equipmentGroupFamily.domain;
//   };

//   // Fonction pour obtenir le badge de domaine
//   const DomainBadge = ({ domain }) => {
//     if (!domain) return <span className="text-gray-500 text-xs">--</span>;
    
//     const domainConfig = {
//       IT: { color: "bg-blue-100 text-blue-800 border-blue-200" },
//       HSE: { color: "bg-red-100 text-red-800 border-red-200" },
//       OPERATIONS: { color: "bg-green-100 text-green-800 border-green-200" },
//       MAINTENANCE: { color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
//     };
    
//     const config = domainConfig[domain] || { color: "bg-gray-100 text-gray-800 border-gray-200" };
    
//     return (
//       <span className={`inline-block text-xs px-2 py-1 rounded-full border ${config.color}`}>
//         {domain}
//       </span>
//     );
//   };

//   // Fonction pour ouvrir le modal d'édition
//   const handleEditClick = (equipement) => {
//     setSelectedEquipement(equipement);
//     setEditModalOpen(true);
//   };

//   const columns = [
//     {
//       title:"No ref",
//       dataIndex:"numRef",
//       width:"100px",
//       render:(value)=> <p className='text-sm'>{highlightText(value)}</p>
//     },
//     {
//       title:"Nom",
//       dataIndex:"title",
//       width:"200px",
//       render:(value)=><p className='text-sm'>{highlightText(value)}</p>
//     },
//     {
//       title:"Domaine",
//       dataIndex:"equipmentGroup",
//       width:"120px",
//       render:(value)=>
//         <div className="flex justify-center">
//           <DomainBadge domain={getEquipmentDomain(value)} />
//         </div>
//     },
//     {
//       title:"Statut d'équipement",
//       dataIndex:"status",
//       width:"200px",
//       render:(value)=><p className='text-sm'>{value === "NEW" ? "NEUF" : value === "SECOND_HAND" ? "SECONDE MAIN" : "--"}</p>
//     },
//     {
//       title:"Groupe equipement",
//       dataIndex:"equipmentGroup",
//       width:"200px",
//       render:(value)=><p className='text-sm capitalize'>{ value?.name || '--'}</p>
//     },
//     {
//       title:"Site",
//       dataIndex:"siteId",
//       width:"200px",
//       render:(value)=><p className='text-sm capitalize'>{sites.find(site => site.value === value)?.name || value || '--'}</p>
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
//       title:"Actions",
//       width: "200px",
//       fixed: 'right',
//       render:(value, record)=>
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
              
//               {/* Bouton Éditer */}
//               <DropdownMenuItem 
//                 className="flex gap-2 items-center cursor-pointer"
//                 onClick={() => handleEditClick(record)}
//               >
//                 <PencilIcon className='h-4 w-4'/>
//                 <span>Éditer</span>
//               </DropdownMenuItem>
              
//               {/* Bouton Supprimer */}
//               <DropdownMenuItem 
//                 className="flex gap-2 items-center hover:bg-red-200 cursor-pointer" 
//                 onClick={() => handleDelete(record.id)}
//               >
//                 <TrashIcon className='text-red-500 h-4 w-4'/>
//                 <span className='text-red-500'>Supprimer</span>
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//       </>
//     },
//   ]

//   const handleFetchSites = async (link) =>{
//     try {
//       let response = await handleFetch(link);
//       if(response?.status === 200){
//         let formatedData = response?.data.map(item=>{
//           return {
//             name:item?.name,
//             value: item?.id
//           }
//         });
//         setSites(formatedData);
//       }
//     } catch (error) {
//       console.error(error);
//     }
  
//   }
  
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
//     handleFetchSites(`${import.meta.env.VITE_ENTITY_API}/sites`);
//     handleFetchEmployees(`${import.meta.env.VITE_ENTITY_API}/employees`);
//     setIsLoading(false);
//   },[])

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
//                 setRowSelection(record);
//                 setOpen(true);
//               }
//             })}
//             scroll={{
//                 x: 1500,
//                 y: "40vh"
//             }}
//             pagination={false}
//             loading={loading || isLoading}
//           />
//         </Form>
//       </div>
      
//       {/* Modal de détails */}
//       <EquipementDetails open={open} setOpen={setOpen} equipements={rowSelection}/>
      
//       {/* Modal d'édition - Vous devez créer ce composant */}
//       {editModalOpen && selectedEquipement && (
//         <EditEquipementForm
//           isOpen={editModalOpen}
//           onClose={() => setEditModalOpen(false)}
//           equipement={selectedEquipement}
//           onSuccess={() => {
//             fetchData();
//             setEditModalOpen(false);
//           }}
//         />
//       )}
//     </div>
//   )
// }

// export default Datalist

import React, {useEffect, useState} from 'react';
import { Button } from '../../ui/button';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Form, Table } from 'antd';
import { DatabaseBackupIcon, MoreHorizontal } from "lucide-react"
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
import EquipementDetails from './EquipementDetails';
import EditEquipementForm from './EditEquipementForm';

const Datalist = ({dataList, fetchData, searchValue, pagination, loading}) => {
  const {handleFetch} = useFetch();

  const handleDelete = async (id) =>{
    if (window.confirm("Voulez vous supprimer l'equipement ?")) {
      try {
        let url = `${URLS.INCIDENT_API}/equipements/${id}`;
        let response = await fetch(url, {
          method:"DELETE",
          headers:{
            "Content-Type":"application/json",
            'authorization': `Bearer ${localStorage.getItem('token')}` || ''
          },
        });
        if(response.status === 200){
          toast.success("Supprimé avec succès");
          fetchData();
          return
        }
      } catch (error) {
        console.error(error);
        toast.error("Vérifier la connexion internet, nous ne pouvons pas récupérer les équipements.");
      }
    }
  }

  // État pour gérer l'ouverture du modal d'édition
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedEquipement, setSelectedEquipement] = useState(null);

  const highlightText = (text) => {
    if (!searchValue) return text;

    const regex = new RegExp(searchValue, 'gi');
    return <span dangerouslySetInnerHTML={{ __html: text?.replace(
      new RegExp(searchValue, 'gi'),
      (match) => `<mark style="background-color: yellow;">${match}</mark>`
    )}} />
  };
          
  const [sites, setSites] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [rowSelection, setRowSelection] = useState({});

  // Fonction pour obtenir le domaine d'un équipement
  const getEquipmentDomain = (equipmentGroup) => {
    if (!equipmentGroup || !equipmentGroup.equipmentGroupFamily) {
      return null;
    }
    return equipmentGroup.equipmentGroupFamily.domain;
  };

  // Fonction pour obtenir le badge de domaine
  const DomainBadge = ({ domain }) => {
    if (!domain) return <span className="text-gray-500 text-xs">--</span>;
    
    const domainConfig = {
      IT: { color: "bg-blue-100 text-blue-800 border-blue-200" },
      HSE: { color: "bg-red-100 text-red-800 border-red-200" },
      OPERATIONS: { color: "bg-green-100 text-green-800 border-green-200" },
      MAINTENANCE: { color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
    };
    
    const config = domainConfig[domain] || { color: "bg-gray-100 text-gray-800 border-gray-200" };
    
    return (
      <span className={`inline-block text-xs px-2 py-1 rounded-full border ${config.color}`}>
        {domain}
      </span>
    );
  };

  // Fonction pour ouvrir le modal d'édition
  const handleEditClick = (equipement, e) => {
    e?.stopPropagation(); // Empêche la propagation à la ligne
    setSelectedEquipement(equipement);
    setEditModalOpen(true);
  };

  // Fonction pour ouvrir les détails
  const handleRowClick = (record) => {
    setRowSelection(record);
    setOpen(true);
  };

  // Fonction pour gérer la suppression avec arrêt de propagation
  const handleDeleteClick = (id, e) => {
    e?.stopPropagation(); // Empêche la propagation à la ligne
    handleDelete(id);
  };

  const columns = [
    {
      title:"No ref",
      dataIndex:"numRef",
      width:"100px",
      render:(value)=> <p className='text-sm'>{highlightText(value)}</p>
    },
    {
      title:"Nom",
      dataIndex:"title",
      width:"200px",
      render:(value)=><p className='text-sm'>{highlightText(value)}</p>
    },
    {
      title:"Domaine",
      dataIndex:"equipmentGroup",
      width:"120px",
      render:(value)=>
        <div className="flex justify-center">
          <DomainBadge domain={getEquipmentDomain(value)} />
        </div>
    },
    {
      title:"Statut d'équipement",
      dataIndex:"status",
      width:"200px",
      render:(value)=><p className='text-sm'>{value === "NEW" ? "NEUF" : value === "SECOND_HAND" ? "SECONDE MAIN" : "--"}</p>
    },
    {
      title:"Groupe equipement",
      dataIndex:"equipmentGroup",
      width:"200px",
      render:(value)=><p className='text-sm capitalize'>{ value?.name || '--'}</p>
    },
    {
      title:"Site",
      dataIndex:"siteId",
      width:"200px",
      render:(value)=><p className='text-sm capitalize'>{sites.find(site => site.value === value)?.name || value || '--'}</p>
    },
    {
      title:"Cree par",
      dataIndex:"createdBy",
      width:"200px",
      render:(value)=><p className='text-sm capitalize'>{employees.find(site => site.value === value)?.name || value}</p>
    },
    {
      title:"Date de création",
      dataIndex:"createdAt",
      width:"200px",
      render:(value)=><p className='text-sm'>{highlightText(new Date(value).toLocaleString().toString())}</p>
    },
    {
      title:"Actions",
      width: "130px", // Réduit la largeur
      fixed: 'right',
      render:(value, record)=>
        <div onClick={(e) => e.stopPropagation()}> {/* Bloque la propagation au niveau du conteneur Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="h-8 w-8 p-0"
                onClick={(e) => e.stopPropagation()} // Empêche le clic de se propager
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              {/* Bouton Éditer */}
              <DropdownMenuItem 
                className="flex gap-2 items-center cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation(); // Important : empêche la propagation
                  handleEditClick(record, e);
                }}
              >
                <PencilIcon className='h-4 w-4'/>
                <span>Éditer</span>
              </DropdownMenuItem>
              
              {/* Bouton Supprimer */}
              <DropdownMenuItem 
                className="flex gap-2 items-center hover:bg-red-50 cursor-pointer" 
                onClick={(e) => {
                  e.stopPropagation(); // Important : empêche la propagation
                  handleDeleteClick(record.id, e);
                }}
              >
                <TrashIcon className='text-red-500 h-4 w-4'/>
                <span className='text-red-600'>Supprimer</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
    },
  ]

  const handleFetchSites = async (link) =>{
    try {
      let response = await handleFetch(link);
      if(response?.status === 200){
        let formatedData = response?.data.map(item=>{
          return {
            name:item?.name,
            value: item?.id
          }
        });
        setSites(formatedData);
      }
    } catch (error) {
      console.error(error);
    }
  
  }
  
  const handleFetchEmployees = async (link) =>{
    try {
      let response = await handleFetch(link);
      if(response?.status === 200){
        let formatedData = response?.data.map(item=>{
          return {
            name:item?.name,
            value: item?.id
          }
        });
        setEmployees(formatedData);
      }
    } catch (error) {
      console.error(error);
    }
  }
    

  useEffect(()=>{
    handleFetchSites(`${import.meta.env.VITE_ENTITY_API}/sites`);
    handleFetchEmployees(`${import.meta.env.VITE_ENTITY_API}/employees`);
    setIsLoading(false);
  },[])

  return (
    <div className="w-full">
      <div className="py-2 px-4 w-full max-h-[500px]">
        <Form>
          <Table 
            footer={() => <div className='flex'>{pagination}</div>}
            dataSource={dataList}
            bordered={true}
            columns={columns}
            onRow={(record) => ({
              onClick: () => handleRowClick(record)
            })}
            scroll={{
                x: 1400, // Ajusté pour la nouvelle largeur
                y: "40vh"
            }}
            pagination={false}
            loading={loading || isLoading}
            rowClassName="cursor-pointer" // Ajoute un curseur pointer sur les lignes
          />
        </Form>
      </div>
      
      {/* Modal de détails */}
      <EquipementDetails open={open} setOpen={setOpen} equipements={rowSelection}/>
      
      {/* Modal d'édition */}
      {editModalOpen && selectedEquipement && (
        <EditEquipementForm
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          equipement={selectedEquipement}
          onSuccess={() => {
            fetchData();
            setEditModalOpen(false);
          }}
        />
      )}
    </div>
  )
}

export default Datalist