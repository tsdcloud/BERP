// import React, {useEffect, useState} from 'react';
// import { Button } from '../ui/button';
// import { useForm } from 'react-hook-form';
// import { INCIDENT_STATUS } from '../../utils/constant.utils';
// import { XMarkIcon, TrashIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
// import { Form, Table } from 'antd';
// import { useFetch } from '../../hooks/useFetch';
// import { URLS } from '../../../configUrl';
// import AutoComplete from '../common/AutoComplete';
// import {
//   Dialog,
//   DialogContent,
//   DialogFooter,
//   DialogHeader,
// } from "../ui/dialog"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "../../components/ui/dropdown-menu";
// import { CheckCircle, MoreHorizontal } from "lucide-react";
// import VerifyPermission from '../../utils/verifyPermission';
// import { Cog6ToothIcon } from '@heroicons/react/24/solid';
// import Preloader from '../Preloader';
// import { getEmployee } from '../../utils/entity.utils';
// import CloseIncidentForm from './CloseIncidentForm';
 




// const Datalist = ({dataList, fetchData, searchValue, pagination, loading}) => {

//   // const {roles, permissions} = useContext(PERMISSION_CONTEXT);
//   const [sitesMap, setSitesMap] = useState(new Map());

//   const handleDelete = async (id) =>{
//     if (window.confirm("Voulez vous supprimer l'incident ?")) {
//       try {
//         let url = `${URLS.INCIDENT_API}/incidents/${id}`;
//         let response = await fetch(url, {
//           method:"DELETE",
//           headers:{
//             "Content-Type":"application/json",
//             'authorization': `Bearer ${localStorage.getItem('token')}` || ''
//           },
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

//   // const highlightText = (text) => {
//   //   if (!searchValue) return text;

//   //   const regex = new RegExp(searchValue, 'gi');
//   //   return <span dangerouslySetInnerHTML={{ __html: text?.replace(
//   //     new RegExp(searchValue, 'gi'),
//   //     (match) => `<mark style="background-color: yellow;">${match}</mark>`
//   //   )}} />
//   // };
//   const highlightText = React.useCallback((text) => {
//     if (!searchValue || !text) return text || "--";

//     const regex = new RegExp(searchValue, 'gi');
//     const parts = text.split(regex);
//     const matches = text.match(regex);
    
//     if (!matches) return text;
    
//     return parts.reduce((acc, part, i) => [
//         ...acc,
//         part,
//         matches[i] && <mark key={i} style={{backgroundColor: 'yellow'}}>{matches[i]}</mark>
//     ], []);
//   }, [searchValue]);
          
//   const [sites, setSites] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [shifts, setShifts] = useState([]);
//   const [employees, setEmployees] = useState([]);
//   const [roles, setRoles] = useState([]);
//   const [permissions, setPermissions] = useState([]);
//   const [externalEntities, setExternalEntities] = useState([]);
//   const [maintenanceTypes, setMaintenanceTypes] = useState([]);
//   const [incidentCauses, setIncidentCauses] = useState([]);
//   const [rowSelection, setRowSelection] = useState({});
//   const [selectedSite, setSelectedSite] = useState("");
//   const [selectedIncident, setSelectedIncident] = useState("");
//   const [selectedEquipement, setSelectedEquipement] = useState("");

//   const [isOpen, setIsOpen] = useState(false);
//   const [modalIsOpen, setModalIsOpen] = useState(false);
//   const [description, setDescription] = useState("");

//   const {register, handleSubmit, formState:{errors}, setValue} = useForm();


//   const columns=[
//     {
//       title:"No ref",
//       dataIndex:"numRef",
//       width:"100px",
//       render:(value, record)=>
//         <p className='text-sm'>{highlightText(value)}</p>
//     },
//     {
//       title:"Equipement",
//       dataIndex:"equipement",
//       width:"200px",
//       render:(value)=>
//         <p className='text-sm capitalize'>
//           {value?.title}
//         </p>
//     },
//     {
//       title:"Description",
//       dataIndex:"description",
//       width:"200px",
//       render:(value)=><p className='text-sm'>{highlightText(value) || "--"}</p>
//     },
//     {
//       title: "Arrêt opération",
//       dataIndex: "hasStoppedOperations",
//       width: "150px",
//       render: (value) => (
//         <p className='text-sm'>
//           {value === true ? "Oui" : value === false ? "Non" : "--"}
//         </p>
//       )
//     },
//     {
//       title: "Site",
//       dataIndex: "siteId",
//       width: "150px",
//       render: (value) =>
//           <p className='text-sm capitalize'>
//               {sitesMap.get(value) || value}
//           </p>
//     },
//     {
//       title:"Quart",
//       dataIndex:"shiftId",
//       width:"150px",
//       render:(value)=>
//         <p className='text-sm capitalize'>
//           {shifts.find(shift => shift.value === value)?.name || value || "--"}
//         </p>
//     },
//     {
//       title:"Initiateur",
//       dataIndex:"createdBy",
//       width:"200px",
//       render:(value)=>
//         <p className='text-sm capitalize'>
//           {employees.find(employee => employee.value === value)?.name || value}
//         </p>
//     },
//     {
//       title:"Intervenant",
//       dataIndex:"technician",
//       width:"200px",
//       render:(value)=>
//         <p className='text-sm capitalize'>
//           {employees.find(employee => employee.value === value)?.name || externalEntities.find(entity => entity.value === value)?.name ||  value || "--"}
//         </p>
//     },
//     {
//       title:"Clôturé par",
//       dataIndex:"closedBy",
//       width:"200px",
//       render:(value)=>
//         <p className='text-sm capitalize'>
//           {employees.find(employee => employee.value === value)?.name || value || "--"}
//         </p>
//     },
//     {
//       title:"Type incident",
//       dataIndex:"incident",
//       width:"200px",
//       render:(value)=><p className='text-sm'>{highlightText(value?.name) || value}</p>
//     },
//     {
//       title:"Cause incident",
//       dataIndex:"incidentCauseId",
//       width:"200px",
//       render:(value)=>
//         <p className='text-sm capitalize'>
//           {incidentCauses.find(cause => cause.value === value)?.name || value || "--"}
//         </p>
//     },
//     {
//       title:"Date de création",
//       dataIndex:"creationDate",
//       width:"200px",
//       render:(value)=>
//         <p className='text-sm capitalize'>
//           {new Date(value).toLocaleString() || "--"}
//         </p>
//     },
//     {
//       title:"Date de clôture Utilisateur",
//       dataIndex:"closedManuDate",
//       width:"200px",
//       render:(value)=>
//         <p className='text-sm capitalize'>
//           {value ? new Date(value).toLocaleString() : "--"}
//         </p>
//     },
//     {
//       title:"Date de clôture Système",
//       dataIndex:"closedDate",
//       width:"200px",
//       render:(value)=>
//         <p className='text-sm capitalize'>
//           {value ? new Date(value).toLocaleString() : "--"}
//         </p>
//     },
//     {
//       title: "Durée",
//       dataIndex: "duration",
//       width: "120px",
//       render: (_, record) => {
//           let startDate = new Date(record.creationDate);
//           let endDate = null;
  
//           // Déterminer la date de fin
//           if (record.closedManuDate) {
//               endDate = new Date(record.closedManuDate);
//           } else if (record.status === "CLOSED" && record.closedDate) {
//               endDate = new Date(record.closedDate);
//           }
  
//           // Calculer la durée si on a une date de fin
//           if (endDate) {
//               const durationMs = endDate - startDate;
//               const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
//               const durationMinutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
              
//               return (
//                   <p className='text-sm'>
//                       {durationHours > 0 ? `${durationHours}h ` : ''}
//                       {durationMinutes > 0 ? `${durationMinutes}min` : '0min'}
//                   </p>
//               );
//           }
  
//           return <p className='text-sm'>--</p>;
//       }
//     },
//     {
//       title:"Statut",
//       dataIndex:"status",
//       fixed:"right",
//       width:"150px",
//       render:(value)=>
//         <div className={`${
//           value === "UNDER_MAINTENANCE"?"border-yellow-500 bg-yellow-300":
//           value === "CLOSED" ? "border-green-500 bg-green-300" :""
//         } p-2 rounded-lg border`}>{INCIDENT_STATUS[value] || "Unknown Status"}</div>
//     },
//     {
//       title:"Action",
//       dataIndex:"",
//       fixed:"right",
//       width:"75px",
//       render:(value, record)=>
//         <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="ghost" className="h-8 w-8 p-0">
//                 <span className="sr-only">Open menu</span>
//                 <MoreHorizontal />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end">
//               <DropdownMenuLabel>Actions</DropdownMenuLabel>
//               {/* <DropdownMenuItem
//                 onClick={() => navigator.clipboard.writeText(payment.id)}
//               >
//                 Copy payment ID
//               </DropdownMenuItem> */}
//               <DropdownMenuSeparator />
//               {/* <DropdownMenuItem className="flex gap-2 items-center cursor-pointer">
//                 <PencilIcon className='h-4 w-6'/>
//                 <span className=''>Editer</span>
//               </DropdownMenuItem> */}
//               {
//                 record.status === "PENDING" &&
//                 <VerifyPermission roles={roles} functions={permissions} expected={["incident__can_send_to_maintenance_incident", "manager", "DEX", "maintenance technician"]}>
//                   <DropdownMenuItem className="flex gap-2 items-center cursor-pointer">
//                     <button className='flex items-center space-x-2'
//                       onClick={()=>{
//                         setSelectedSite(record.siteId);
//                         setSelectedIncident(record.id);
//                         setSelectedEquipement(record.equipementId);
//                         setIsOpen(true);
//                       }}
//                     >
//                       <ExclamationTriangleIcon />
//                       <span>Mettre en maintenance</span>
//                     </button>
//                   </DropdownMenuItem>
//                 </VerifyPermission>
//               }
//               {
//                 record.status === "PENDING" &&
//                 <VerifyPermission roles={roles} functions={permissions} expected={["incident__can_close_incident", "head guard", "HSE supervisor", "manager", "DEX", "IT technician"]}>
//                   <DropdownMenuItem className="flex gap-2 items-center cursor-pointer">
//                     <button className='flex items-center space-x-2'
//                       onClick={async ()=>{
//                         setModalIsOpen(true);
//                         setSelectedIncident(record.id);
//                         setRowSelection(record);
//                       }}
//                     >
//                       <XMarkIcon />
//                       <span>Cloturer l'incident</span>
//                     </button>
//                   </DropdownMenuItem>
//                 </VerifyPermission>
//               }
//               <VerifyPermission functions={permissions} roles={roles} expected={['incident__can_delete_incident']}>
//                 <DropdownMenuItem className="flex gap-2 items-center hover:bg-red-200 cursor-pointer" onClick={()=>handleDelete(record.id)}>
//                   <TrashIcon className='text-red-500 h-4 w-6'/>
//                   <span className='text-red-500'>Supprimer</span>
//                 </DropdownMenuItem>
//               </VerifyPermission>
//             </DropdownMenuContent>
//           </DropdownMenu>
//       },
//   ]
    
//   const {handleFetch, handlePost} = useFetch();

//   // const handleFetchSites = async (link) =>{
//   //   try {
//   //     let response = await handleFetch(link);     
//   //     if(response?.status === 200){
//   //       let formatedData = response?.data.map(item=>{
//   //         return {
//   //           name:item?.name,
//   //           value: item?.id
//   //         }
//   //       });
//   //       setSites(formatedData);
//   //     }
//   //   } catch (error) {
//   //     console.error(error);
//   //   }
//   // }
//   const handleFetchSites = async (link) => {
//     try {
//         let response = await handleFetch(link);     
//         if(response?.status === 200){
//             let formatedData = response?.data.map(item => ({
//                 name: item?.name,
//                 value: item?.id
//             }));
//             setSites(formatedData);
            
//             // Créer un Map pour des recherches rapides
//             const newMap = new Map();
//             formatedData.forEach(site => {
//                 newMap.set(site.value, site.name);
//             });
//             setSitesMap(newMap);
//         }
//     } catch (error) {
//         console.error(error);
//     }
//   }

//   const handleFetchShifts = async (link) =>{
//     try {
//       let response = await handleFetch(link);     
//       if(response?.status === 200){
//         let formatedData = response?.data.map(item=>{
//           return {
//             name:item?.name,
//             value: item?.id
//           }
//         });
//         setShifts(formatedData);
//       }
//     } catch (error) {
//       console.error(error);
//     } finally{
//       setIsLoading(false);
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
  

//   const handleFetchExternalEntities = async (link) =>{
//     try {
//       let response = await handleFetch(link);     
//       if(response?.status === 200){
//         let formatedData = response?.data.map(item=>{
//           return {
//             name:item?.name,
//             value: item?.id
//           }
//         });
//         setExternalEntities(formatedData);
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   }

//   const submitMaintenance = async(data) =>{
//     setIsSubmitting(true);

//     data.description = description;
//     data.siteId = selectedSite;
//     data.equipementId = selectedEquipement;
    
//     let url = `${import.meta.env.VITE_INCIDENT_API}/maintenances`
//     try {
//       let response = await handlePost(url, {...data, incidentId: selectedIncident});
//       if(response.status !== 201){
//         alert("Echec de la creation de la maintenance");
//         return;
//       }
//       let incidentUrl = `${import.meta.env.VITE_INCIDENT_API}/incidents/${selectedIncident}`;
//       let res = await fetch(incidentUrl,{
//         headers:{
//           "Content-Type":"application/json",
//           'authorization': `Bearer ${localStorage.getItem('token')}` || ''
//         },
//         method:"PATCH",
//         body: JSON.stringify({status:"UNDER_MAINTENANCE"})
//       })
//       if(res.status !== 200){
//         alert("Echec de la mis a jour");
//         return
//       }
//       fetchData();
//       setIsOpen(false);
//     } catch (error) {
//       console.log(error)
//     }finally{
//       setIsSubmitting(false);
//     }
//   }

//   const handleFetchMaintenanceTypes = async (link) =>{
//     try {
//       let response = await handleFetch(link);     
//       if(response?.status === 200){
//         let formatedData = response?.data.map(item=>{
//           return {
//             name:item?.name,
//             value: item?.id
//           }
//         });
//         setMaintenanceTypes(formatedData);
//       }
//     } catch (error) {
//       console.error(error);
//     } finally{
//       setIsLoading(false);
//     }
//   }

//   const handleSelectMaintenanceType=(item)=>{
//     if(item){
//       setValue("maintenanceId", item.value);
//     }else{
//       setValue("maintenanceId", null);

//     }
//   }

//   const handleSelectSupplier=(item)=>{
//     setValue("supplierId", item.value)
//   }

//   const handleSearchMaintenanceType=async(searchInput)=>{
//     try{
//       handleFetchMaintenanceTypes(`${import.meta.env.VITE_INCIDENT_API}/maintenance-types?search=${searchInput}`);
//     }catch(error){
//       console.log(error);
//     }
//   }


//   const handleFetchIncidentCauses = async (link) =>{
//     try {
//       let response = await handleFetch(link);     
//       if(response?.status === 200){
//         let formatedData = response?.data.map(item=>{
//           return {
//             name:item?.name,
//             value: item?.id
//           }
//         });
//         setIncidentCauses(formatedData);
//       }
//     } catch (error) {
//       console.error(error);
//     } finally{
//       setIsLoading(false);
//     }
//   }
//   useEffect(()=>{
//     handleFetchSites(`${import.meta.env.VITE_ENTITY_API}/sites`);
//     handleFetchShifts(`${import.meta.env.VITE_ENTITY_API}/shifts`);
//     handleFetchIncidentCauses(`${import.meta.env.VITE_INCIDENT_API}/incident-causes`);
//     handleFetchMaintenanceTypes(`${import.meta.env.VITE_INCIDENT_API}/maintenance-types?hasIncident=${true}`);
//     handleFetchEmployees(`${import.meta.env.VITE_ENTITY_API}/employees`);
//     handleFetchExternalEntities(`${import.meta.env.VITE_ENTITY_API}/suppliers`);

//     const handleCheckPermissions = async () =>{
//       const employee = await getEmployee();
//       if(!employee){
//          setIsLoading(false);
//          return 
//       }

//       const employeeRoles = await handleFetch(`${URLS.ENTITY_API}/employees/${employee?.id}/roles`);
//       const employeePermissions = await handleFetch(`${URLS.ENTITY_API}/employees/${employee?.id}/permissions`);
      
      
//       let empPerms = employeePermissions?.employeePermissions
//       let empRoles = employeeRoles?.employeeRoles

//       let formatedRoles = empRoles.map(role=>role?.role.roleName)
//       let formatedPerms = empPerms.map(perm=>perm?.permission.permissionName)


//       setRoles(formatedRoles);
//       setPermissions(formatedPerms);
      
//       setIsLoading(false);
//     }
//     handleCheckPermissions();
//   }, []);

//   useEffect(()=>{
//     handleFetchMaintenanceTypes(`${import.meta.env.VITE_INCIDENT_API}/maintenance-types?hasIncident=${false}`);
//   }, [isOpen])
  
//   return (
//     <div className="w-full">
//       <div className="py-2 md:px-4 w-full max-h-[60vh] h-[60vh]">
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

//       <Dialog open={isOpen} onOpenChange={setIsOpen}>
//             <DialogContent>
//                 <DialogHeader className={"font-poppins mx-2 text-lg"}>
//                   <div className='flex items-center gap-2'>
//                     <Cog6ToothIcon className='h-5 w-5'/>
//                     <span>{"Mettre en maintenance"}</span>
//                   </div>
//                 </DialogHeader>
//                 <form onSubmit={handleSubmit(submitMaintenance)}>
//                   {/* Type maintenance selection */}
//                   <div className='flex flex-col mx-4'>
//                     <label htmlFor="" className='text-xs font-semibold px-2'>Choisir le type de maintenance <span className='text-red-500'>*</span></label>
//                     <select className='border rounded-lg w-full p-2' {...register('maintenance', {required:'Ce champ est requis'})}>
//                       <option value="">Choisir le type de maintenance</option>
//                       <option value="CORRECTION">CORRECTIF</option>
//                       <option value="PALLIATIVE">PALIATIF</option>
//                       <option value="CURATIVE">CURATIF</option>
//                     </select>
//                     {errors.maintenance && <small className='text-xs my-2 text-red-500 mx-4'>{errors.maintenance.message}</small>}
//                   </div>
                  
//                   {/* type selection */}
//                   {/* <label htmlFor="" className='text-xs px-2'>Choisir le type d'intervenant*:</label>
//                   <div 
//                     className='flex flex-col mx-2'
//                     onChange={(e)=>setSupplierType(e.target.value)}
//                   >
//                     <select name="" id="" className='border rounded-lg p-2' placeholder="Choisir le type d'intervenant">
//                       <option value="">Choisir le type d'intervenant</option>
//                       <option value="EMPLOYEE">Employer</option>
//                       <option value="SUPPLIER">Prestataire</option>
//                     </select> */}
//                     {/* {errors.equipementId && <small className='text-xs my-2 text-red-500'>{errors.equipementId.message}</small>} */}
//                   {/* </div> */}


//                   {/* Supplier selection */}
//                   {/* {
//                     supplierType === "SUPPLIER" &&
//                     <div className='flex flex-col'>
//                     <label htmlFor="" className='text-sm font-semibold px-2'>Choisir le prestataire:</label>
//                     <AutoComplete
//                       placeholder="Choisir le prestataire"
//                       isLoading={isLoading}
//                       dataList={externalEntities}
//                       onSearch={()=>{}}
//                       onSelect={handleSelectSupplier}
//                       register={{...register('maintenanceId', {required:'Ce champ est requis'})}}
//                     />
//                     {errors.maintenanceId && <small className='text-xs my-2 text-red-500 mx-2'>{errors.maintenanceId.message}</small>}
//                     </div>
//                   } */}

//                   {/* Employer selection */}
//                   {/* {
//                     supplierType === "EMPLOYEE" &&
//                     <div className='flex flex-col'>
//                       <label htmlFor="" className='text-xs px-2'>Choisir un employer:</label>
//                       <AutoComplete
//                         placeholder="Choisir un employer"
//                         isLoading={isLoading}
//                         dataList={employees}
//                         onSearch={()=>{}}
//                         onSelect={handleSelectSupplier}
//                         register={register}
//                       />
//                       {errors.equipementId && <small className='text-xs my-2 text-red-500'>{errors.equipementId.message}</small>}
//                     </div>
//                   } */}

//                   {/* Description */}
//                   <div className='mx-4 mt-3'>
//                     <label htmlFor="" className='text-sm font-semibold'>Description</label>
//                     <textarea 
//                       name="" 
//                       id="" 
//                       className='border rounded-lg p-2 w-full' 
//                       placeholder='Description'
//                       value={description}
//                       onChange={(e)=>setDescription(e.target.value)}
//                     ></textarea>
//                   </div>
//                   <div className='flex justify-end p-4'>
//                     <Button className={` flex gap-2 text-white hover:bg-secondary ${isSubmitting ? "bg-blue-300" :""}`}>
//                       {isSubmitting ? <Preloader size={20}/> : <CheckCircle />}
//                       <span>{isSubmitting ? "Encours..." : "Mettre en maintenance"}</span>
//                     </Button>  
//                   </div>
//                 </form>
//                 <DialogFooter>{""}</DialogFooter>
//             </DialogContent>
//         </Dialog>

//         <CloseIncidentForm selectedRow={rowSelection} isOpen={modalIsOpen} setIsOpen={setModalIsOpen} fetchData={fetchData}/>
//     </div>
//   )
// }

// export default Datalist

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Button } from '../ui/button';
import { useForm } from 'react-hook-form';
import { INCIDENT_STATUS } from '../../utils/constant.utils';
import { Form, Table } from 'antd';
import { useFetch } from '../../hooks/useFetch';
import { URLS } from '../../../configUrl';
import AutoComplete from '../common/AutoComplete';
import { 
  XMarkIcon, 
  TrashIcon, 
  ExclamationTriangleIcon, 
  EyeIcon, 
  PencilSquareIcon,
  DocumentTextIcon,
  CameraIcon,
  UserGroupIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { CheckCircle, MoreHorizontal } from "lucide-react";
import VerifyPermission from '../../utils/verifyPermission';
import { Cog6ToothIcon } from '@heroicons/react/24/solid';
import Preloader from '../Preloader';
import { getEmployee } from '../../utils/entity.utils';
import CloseIncidentForm from './CloseIncidentForm';


const SecureImage = ({ src, alt, className }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const blobUrlRef = useRef(null);

  const defaultImageSVG = `image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23f7fafc"/><path d="M100 50C89.5228 50 81 58.5228 81 69C81 79.4772 89.5228 88 100 88C110.477 88 119 79.4772 119 69C119 58.5228 110.477 50 100 50ZM100 125C80.1109 125 64 141.111 64 161V75C64 65.4772 72.4772 57 82 57H118C127.523 57 136 65.4772 136 75V161C136 141.111 119.889 125 100 125Z" fill="%23a0aec0"/><text x="100" y="120" text-anchor="middle" font-family="Arial" font-size="14" fill="%234a5568">Image non disponible</text></svg>`;

  useEffect(() => {
    let isCancelled = false;

    const loadImageWithAuth = async () => {
      try {
        setIsLoading(true);
        setHasError(false);
        const token = localStorage.getItem('token');
        if (!token) {
          if (!isCancelled) setHasError(true);
          return;
        }

        const response = await fetch(src, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok && !isCancelled) {
          const blob = await response.blob();
          const objectUrl = URL.createObjectURL(blob);
          setImageUrl(objectUrl);
          blobUrlRef.current = objectUrl;
        } else if (!isCancelled) {
          setHasError(true);
        }
      } catch (error) {
        if (!isCancelled) {
          console.error('Erreur chargement image:', error);
          setHasError(true);
        }
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    };

    loadImageWithAuth();

    return () => {
      isCancelled = true;
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
    };
  }, [src]);

  const handleClick = () => {
    console.log("Clic détecté, imageUrl =", imageUrl);
    if (imageUrl && imageUrl.startsWith('blob:')) {
      const win = window.open(imageUrl, '_blank');
      if (!win) {
        alert('Popup bloquée. Veuillez autoriser les popups.');
      }
    } else {
      console.warn("imageUrl non valide ou non chargée");
    }
  };

  if (isLoading) {
    return (
      <div className={`${className} bg-gray-100 flex items-center justify-center`}>
        <div className="animate-pulse text-gray-400 text-sm">Chargement...</div>
      </div>
    );
  }

  if (hasError) {
    return <img src={defaultImageSVG} alt={alt} className={className} />;
  }

  return (
    <img
      src={imageUrl}
      alt={alt}
      className={className}
      onClick={handleClick}
      onError={() => setHasError(true)}
    />
  );
};


const Datalist = ({ dataList, fetchData, searchValue, pagination, loading }) => {
  const [sitesMap, setSitesMap] = useState(new Map());
  const [sites, setSites] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [externalEntities, setExternalEntities] = useState([]);
  const [maintenanceTypes, setMaintenanceTypes] = useState([]);
  const [incidentCauses, setIncidentCauses] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [selectedSite, setSelectedSite] = useState("");
  const [selectedIncident, setSelectedIncident] = useState("");
  const [selectedEquipement, setSelectedEquipement] = useState("");
  const [isOpen, setIsOpen] = useState(false); // modal maintenance
  const [modalIsOpen, setModalIsOpen] = useState(false); // modal clôture
  const [description, setDescription] = useState("");
  const [isOpenDetails, setIsOpenDetails] = useState(false); // modal détails
  const [isOpenEdit, setIsOpenEdit] = useState(false); // modal édition
  const [editFields, setEditFields] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedIncidentData, setSelectedIncidentData] = useState(null); // Stocker les données complètes de l'incident
  const [incidentTypes, setIncidentTypes] = useState([]); // Nouvel état pour les types d'incident
  const [equipments, setEquipments] = useState([]); // Nouvel état pour les équipements
  const [isEquipementLoading, setIsEquipementLoading] = useState(false);
  const [isLoadingTypes, setIsLoadingTypes] = useState(false); // Ajoutez cet état
  
  

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm();
  const hasStoppedOperationsValue = watch("hasStoppedOperations");

  const { handleFetch, handlePost } = useFetch();

  // Highlight texte recherche
  const highlightText = useCallback((text) => {
    if (!searchValue || !text) return text || "--";
    const regex = new RegExp(searchValue, 'gi');
    const parts = text.split(regex);
    const matches = text.match(regex);
    if (!matches) return text;
    return parts.reduce((acc, part, i) => [
      ...acc,
      part,
      matches[i] && <mark key={i} style={{ backgroundColor: 'yellow' }}>{matches[i]}</mark>
    ], []);
  }, [searchValue]);

  // Fonctions de recherche pour les AutoComplete
  const handleSearchSites = async (searchInput) => {
    try {
      await handleFetchSites(`${import.meta.env.VITE_ENTITY_API}/sites?search=${searchInput}`);
    } catch (error) {
      console.error(error);
    }
  }

  const handleSearchEquipements = async (searchInput) => {
    try {
      setIsEquipementLoading(true);
      const siteId = watch("siteId");
      
      if (siteId) {
        // Rechercher les équipements du site spécifique
        await handleFetchIncidentEquipement(`${import.meta.env.VITE_INCIDENT_API}/equipements/site/${siteId}?search=${searchInput}`);
      } else {
        // Si aucun site sélectionné, charger tous les équipements
        await handleFetchIncidentEquipement(`${import.meta.env.VITE_INCIDENT_API}/equipements?search=${searchInput}`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsEquipementLoading(false);
    }
  }

  const handleSearchShifts = async (searchInput) => {
    try {
      await handleFetchShifts(`${import.meta.env.VITE_ENTITY_API}/shifts?search=${searchInput}`);
    } catch (error) {
      console.error(error);
    }
  }

  const handleSearchIncidentTypes = async (searchInput) => {
    try {
      await handleFetchIncidentTypes(`${import.meta.env.VITE_INCIDENT_API}/incident-types?search=${searchInput}`);
    } catch (error) {
      console.error(error);
    }
  }

  const handleSearchIncidentCauses = async (searchInput) => {
    try {
      await handleFetchIncidentCauses(`${import.meta.env.VITE_INCIDENT_API}/incident-causes?search=${searchInput}`);
    } catch (error) {
      console.error(error);
    }
  }

  const handleSearchEmployees = async (searchInput) => {
    try {
      await handleFetchEmployees(`${import.meta.env.VITE_ENTITY_API}/employees?search=${searchInput}`);
    } catch (error) {
      console.error(error);
    }
  }

  // Fonction de recherche pour les intervenants
  const handleSearchIntervenant = async (searchInput) => {
    try {
      // Rechercher dans les employés
      await handleFetchEmployees(`${import.meta.env.VITE_ENTITY_API}/employees?search=${searchInput}`);
      // Rechercher dans les entités externes
      await handleFetchExternalEntities(`${import.meta.env.VITE_ENTITY_API}/suppliers?search=${searchInput}`);
    } catch (error) {
      console.error(error);
    }
  }

  // Fonction de sélection pour les intervenants
  const handleSelectIntervenant = (item) => {
    if (item) {
      setValue("technician", item.value);
    } else {
      setValue("technician", "");
    }
  }

  // Fonctions de sélection pour les AutoComplete
  const handleSelectSite = async (item) => {
    if (item) {
      setValue("siteId", item.value);
      setValue("equipementId", ""); // Réinitialiser l'équipement quand le site change
      
      // Charger les équipements du site sélectionné (sans recherche)
      setIsEquipementLoading(true);
      try {
        await handleFetchIncidentEquipement(`${import.meta.env.VITE_INCIDENT_API}/equipements/site/${item.value}`);
      } catch (error) {
        console.error(error);
      } finally {
        setIsEquipementLoading(false);
      }
    } else {
      setValue("siteId", "");
      setValue("equipementId", "");
      setEquipments([]); // Vider la liste des équipements
    }
  }

  const handleSelectEquipement = (item) => {
    if (item) {
      setValue("equipementId", item.value);
    } else {
      setValue("equipementId", "");
    }
  }

  const handleSelectShift = (item) => {
    if (item) {
      setValue("shiftId", item.value);
    } else {
      setValue("shiftId", "");
    }
  }

  const handleSelectIncidentType = (item) => {
    if (item) {
      setValue("incidentId", item.value);
    } else {
      setValue("incidentId", "");
    }
  }

  const handleSelectIncidentCause = (item) => {
    if (item) {
      setValue("incidentCauseId", item.value);
    } else {
      setValue("incidentCauseId", "");
    }
  }

  const handleSelectClosedBy = (item) => {
    if (item) {
      setValue("closedBy", item.value);
    } else {
      setValue("closedBy", "");
    }
  }

  // Fetch datas
  const handleFetchSites = async (link) => {
    try {
      let response = await handleFetch(link);
      if (response?.status === 200) {
        let formatedData = response?.data.map(item => ({ name: item?.name, value: item?.id }));
        setSites(formatedData);
        const newMap = new Map();
        formatedData.forEach(site => newMap.set(site.value, site.name));
        setSitesMap(newMap);
      }
    } catch (error) { console.error(error); }
  }

  const handleFetchShifts = async (link) => {
    try {
      let response = await handleFetch(link);
      if (response?.status === 200) setShifts(response?.data.map(item => ({ name: item?.name, value: item?.id })));
    } catch (error) { console.error(error); }
  }

  const handleFetchEmployees = async (link) => {
    try {
      let response = await handleFetch(link);
      if (response?.status === 200) setEmployees(response?.data.map(item => ({ name: item?.name, value: item?.id })));
    } catch (error) { console.error(error); }
  }

  const handleFetchExternalEntities = async (link) => {
    try {
      let response = await handleFetch(link);
      if (response?.status === 200) setExternalEntities(response?.data.map(item => ({ name: item?.name, value: item?.id })));
    } catch (error) { console.error(error); }
  }

  const handleFetchMaintenanceTypes = async (link) => {
    try {
      let response = await handleFetch(link);
      if (response?.status === 200) setMaintenanceTypes(response?.data.map(item => ({ name: item?.name, value: item?.id })));
    } catch (error) { console.error(error); }
  }

  const handleFetchIncidentCauses = async (link) => {
    try {
      let response = await handleFetch(link);
      if (response?.status === 200) setIncidentCauses(response?.data.map(item => ({ name: item?.name, value: item?.id })));
    } catch (error) { console.error(error); }
  }

  // Nouvelle fonction pour récupérer les types d'incident
  const handleFetchIncidentTypes = async (link) => {
    try {
      setIsLoadingTypes(true);
      let response = await handleFetch(link);
      if (response?.status === 200) setIncidentTypes(response?.data.map(item => ({ name: item?.name, value: item?.id })));
    } catch (error) { console.error(error); }
    finally {
      setIsLoadingTypes(false);
    }
  }

  // Nouvelle fonction pour récupérer les équipements
  const handleFetchIncidentEquipement = async (link) => {
    try {
      let response = await handleFetch(link);
      if (response?.status === 200) setEquipments(response?.data.map(item => ({ name: item?.title, value: item?.id })));
    } catch (error) { console.error(error); }
  }

  // Fonction pour ouvrir la modal de détails avec les données complètes
  const handleOpenDetails = (record) => {
    setSelectedIncident(record.id);
    setSelectedIncidentData(record); // Stocker les données complètes de l'incident
    setEditFields({
      description: record.description,
      hasStoppedOperations: record.hasStoppedOperations,
      siteId: record.siteId,
      shiftId: record.shiftId,
      incidentCauseId: record.incidentCauseId
    });
    setIsOpenDetails(true);
  }

  // Fonction pour ouvrir la modal d'édition avec toutes les données
  const handleOpenEdit = (record) => {
    setSelectedIncident(record.id);
    setSelectedIncidentData(record);
    
    const fields = {
      description: record.description,
      hasStoppedOperations: record.hasStoppedOperations,
      siteId: record.siteId,
      shiftId: record.shiftId,
      incidentCauseId: record.incidentCauseId,
      incidentId: record.incidentId,
      equipementId: record.equipementId,
      closedBy: record.closedBy,
      technician: record.technician
    };
    
    setEditFields(fields);
    
    // Pré-remplir les valeurs pour react-hook-form
    setTimeout(() => {
      Object.keys(fields).forEach(key => {
        if (fields[key] !== undefined && fields[key] !== null) {
          setValue(key, fields[key]);
        }
      });
  
      // Charger les équipements du site si un site est sélectionné
      if (record.siteId) {
        setIsEquipementLoading(true);
        handleFetchIncidentEquipement(`${import.meta.env.VITE_INCIDENT_API}/equipements/site/${record.siteId}`)
          .finally(() => setIsEquipementLoading(false));
      } else {
        setEquipments([]); // Vider les équipements si pas de site
      }
    }, 100);
    
    setIsOpenEdit(true);
  }

  // Fonction pour ouvrir la maintenance
  const handleOpenMaintenance = (record) => {
    if (!record?.id) {
      console.error("Aucun ID d'incident trouvé");
      return;
    }
    setSelectedSite(record.siteId);
    setSelectedIncident(record.id);
    setSelectedEquipement(record.equipementId);
    setIsOpen(true);
  }

  const submitMaintenance = async(data) =>{
    if (!selectedIncident) {
      alert("Aucun incident sélectionné pour la maintenance");
      return;
    }

    setIsSubmitting(true);

    const maintenanceData = {
      description: description,
      siteId: selectedSite,
      equipementId: selectedEquipement,
      maintenance: data.maintenance,
      incidentId: selectedIncident
    };
    
    try {
      let response = await handlePost(
        `${import.meta.env.VITE_INCIDENT_API}/maintenances`, 
        maintenanceData
      );
      
      if(response.status !== 201){
        alert("Échec de la création de la maintenance");
        return;
      }

      // Mettre à jour le statut de l'incident avec les nouvelles données
      let incidentUrl = `${import.meta.env.VITE_INCIDENT_API}/incidents/${selectedIncident}`;
      let res = await fetch(incidentUrl, {
        headers: {
          "Content-Type": "application/json",
          'authorization': `Bearer ${localStorage.getItem('token')}` || ''
        },
        method: "PATCH",
        body: JSON.stringify({
          status: "UNDER_MAINTENANCE",
          incidentId: data.incidentId, // Type d'incident
          hasStoppedOperations: data.hasStoppedOperations // Arrêt des opérations
        })
      });
      
      if(res.status !== 200){
        alert("Échec de la mise à jour du statut");
        return;
      }
      
      fetchData();
      setIsOpen(false);
      setDescription("");
      
    } catch (error) {
      console.error("Erreur lors de la mise en maintenance:", error);
      alert("Erreur lors de la mise en maintenance");
    } finally {
      setIsSubmitting(false);
    }
  }

  // Fonction pour soumettre la modification
  const submitEdit = async (data) => {
    try {
      setIsSubmitting(true);
      const updateData = {
        description: data.description,
        hasStoppedOperations: data.hasStoppedOperations === "true",
        siteId: data.siteId,
        shiftId: data.shiftId,
        incidentCauseId: data.incidentCauseId,
        incidentId: data.incidentId,
        equipementId: data.equipementId,
        closedBy: data.closedBy,
        technician: data.technician
      };

      await handlePost(`${import.meta.env.VITE_INCIDENT_API}/incidents/${selectedIncident}`, {
        method: "PATCH",
        body: JSON.stringify(updateData)
      });
      fetchData();
      setIsOpenEdit(false);
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la modification de l'incident");
    } finally {
      setIsSubmitting(false);
    }
  }

  // Composant helper pour afficher les informations
  const InfoItem = ({ label, value }) => (
    <div className="flex flex-col">
      <span className="text-sm font-medium text-gray-500">{label}</span>
      <span className="text-gray-900 mt-1">{value || "--"}</span>
    </div>
  );

  // Load user roles & permissions
  useEffect(() => {
    handleFetchSites(`${import.meta.env.VITE_ENTITY_API}/sites`);
    handleFetchShifts(`${import.meta.env.VITE_ENTITY_API}/shifts`);
    handleFetchIncidentCauses(`${import.meta.env.VITE_INCIDENT_API}/incident-causes`);
    handleFetchIncidentTypes(`${import.meta.env.VITE_INCIDENT_API}/incident-types`);
    handleFetchMaintenanceTypes(`${import.meta.env.VITE_INCIDENT_API}/maintenance-types?hasIncident=true`);
    handleFetchEmployees(`${import.meta.env.VITE_ENTITY_API}/employees`);
    handleFetchExternalEntities(`${import.meta.env.VITE_ENTITY_API}/suppliers`);
    // Ne pas charger tous les équipements au début, seulement quand un site est sélectionné
  
    const handleCheckPermissions = async () => {
      const employee = await getEmployee();
      if (!employee) return;
      const employeeRoles = await handleFetch(`${URLS.ENTITY_API}/employees/${employee?.id}/roles`);
      const employeePermissions = await handleFetch(`${URLS.ENTITY_API}/employees/${employee?.id}/permissions`);
      setRoles(employeeRoles?.employeeRoles?.map(r => r.role.roleName) || []);
      setPermissions(employeePermissions?.employeePermissions?.map(p => p.permission.permissionName) || []);
    }
    handleCheckPermissions();
  }, []);

  // Columns
  const columns = [
    { title: "No ref", dataIndex: "numRef", width: "100px", render: v => <p className='text-sm'>{highlightText(v)}</p> },
    { title: "Equipement", dataIndex: "equipement", width: "200px", render: v => <p className='text-sm capitalize'>{v?.title}</p> },
    { title: "Description", dataIndex: "description", width: "200px", render: v => <p className='text-sm'>{highlightText(v) || "--"}</p> },
    { title: "Arrêt opération", dataIndex: "hasStoppedOperations", width: "150px", render: v => <p className='text-sm'>{v === true ? "Oui" : v === false ? "Non" : "--"}</p> },
    { title: "Site", dataIndex: "siteId", width: "150px", render: v => <p className='text-sm capitalize'>{sitesMap.get(v) || v}</p> },
    { title: "Quart", dataIndex: "shiftId", width: "150px", render: v => <p className='text-sm capitalize'>{shifts.find(s => s.value === v)?.name || v || "--"}</p> },
    { title: "Initiateur", dataIndex: "createdBy", width: "200px", render: v => <p className='text-sm capitalize'>{employees.find(e => e.value === v)?.name || v}</p> },
    { title: "Intervenant", dataIndex: "technician", width: "200px", render: v => <p className='text-sm capitalize'>{employees.find(e => e.value === v)?.name || externalEntities.find(e => e.value === v)?.name || v || "--"}</p> },
    { title: "Clôturé par", dataIndex: "closedBy", width: "200px", render: v => <p className='text-sm capitalize'>{employees.find(e => e.value === v)?.name || v || "--"}</p> },
    { title: "Type incident", dataIndex: "incident", width: "200px", render: v => <p className='text-sm'>{highlightText(v?.name) || v}</p> },
    { title: "Cause incident", dataIndex: "incidentCauseId", width: "200px", render: v => <p className='text-sm capitalize'>{incidentCauses.find(c => c.value === v)?.name || v || "--"}</p> },
    { title: "Date de création", dataIndex: "creationDate", width: "200px", render: v => <p className='text-sm capitalize'>{new Date(v).toLocaleString() || "--"}</p> },
    { title: "Date de clôture Utilisateur", dataIndex: "closedManuDate", width: "200px", render: v => <p className='text-sm capitalize'>{v ? new Date(v).toLocaleString() : "--"}</p> },
    { title: "Date de clôture Système", dataIndex: "closedDate", width: "200px", render: v => <p className='text-sm capitalize'>{v ? new Date(v).toLocaleString() : "--"}</p> },
    {
      title: "Durée", dataIndex: "duration", width: "120px", render: (_, record) => {
        const startDate = new Date(record.creationDate);
        let endDate = record.closedManuDate ? new Date(record.closedManuDate) : record.status === "CLOSED" && record.closedDate ? new Date(record.closedDate) : null;
        if (!endDate) return <p className='text-sm'>--</p>;
        const durationMs = endDate - startDate;
        const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
        const durationMinutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
        return <p className='text-sm'>{durationHours > 0 ? `${durationHours}h ` : ''}{durationMinutes > 0 ? `${durationMinutes}min` : '0min'}</p>
      }
    },
    {
      title: "Statut", dataIndex: "status", fixed: "right", width: "150px", render: v => (
        <div className={`${v === "UNDER_MAINTENANCE" ? "border-yellow-500 bg-yellow-300" : v === "CLOSED" ? "border-green-500 bg-green-300" : ""} p-2 rounded-lg border`}>
          {INCIDENT_STATUS[v] || "Unknown Status"}
        </div>
      )
    },
    {
      title: "Action", dataIndex: "", fixed: "right", width: "75px", render: (_, record) => (
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

            {record.status === "PENDING" && (
              <VerifyPermission roles={roles} functions={permissions} expected={["incident__can_send_to_maintenance_incident", "manager", "DEX", "maintenance technician"]}>
                <DropdownMenuItem className="flex gap-2 items-center cursor-pointer">
                  <button 
                    className='flex items-center space-x-2'
                    onClick={() => {
                      setSelectedSite(record.siteId);
                      setSelectedIncident(record.id);
                      setSelectedEquipement(record.equipementId);
                      setIsOpen(true);
                    }}
                  >
                    <ExclamationTriangleIcon />
                    <span>Mettre en maintenance</span>
                  </button>
                </DropdownMenuItem>
              </VerifyPermission>
            )}

            {record.status === "PENDING" && (
              <VerifyPermission roles={roles} functions={permissions} expected={["incident__can_close_incident", "head guard", "HSE supervisor", "manager", "DEX", "IT technician"]}>
                <DropdownMenuItem className="flex gap-2 items-center cursor-pointer">
                  <button 
                    className='flex items-center space-x-2'
                    onClick={() => {
                      setModalIsOpen(true);
                      setSelectedIncident(record.id);
                      setRowSelection(record);
                    }}
                  >
                    <XMarkIcon />
                    <span>Cloturer l'incident</span>
                  </button>
                </DropdownMenuItem>
              </VerifyPermission>
            )}

            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="flex gap-2 items-center cursor-pointer"
              onClick={() => handleOpenDetails(record)}
            >
              <EyeIcon className='h-4 w-6' />
              <span>Voir détails</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuSeparator />
            <VerifyPermission functions={permissions} roles={roles} expected={['incident__can_delete_incident']}>
              <DropdownMenuItem 
                className="flex gap-2 items-center cursor-pointer"
                onClick={async () => {
                  if (!window.confirm("Voulez-vous vraiment supprimer cet incident ?")) return;
                  try {
                    await handlePost(`${import.meta.env.VITE_INCIDENT_API}/incidents/${record.id}`, { method: "DELETE" });
                    fetchData();
                  } catch (error) {
                    console.error(error);
                    alert("Erreur lors de la suppression");
                  }
                }}
              >
                <TrashIcon className='h-4 w-6' />
                <span>Supprimer</span>
              </DropdownMenuItem>
            </VerifyPermission>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div>
      {loading && <Preloader />}
      <Table
        columns={columns}
        dataSource={dataList}
        pagination={pagination}
        rowKey="id"
        scroll={{ x: 2500 }}
      />

      {/* Modal Mettre en maintenance */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Cog6ToothIcon className='h-5 w-5'/>
              <span>Mettre en maintenance</span>
            </DialogTitle>
            <DialogDescription>
              Sélectionnez le type de maintenance et décrivez les travaux à effectuer
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit(submitMaintenance)} className="space-y-4">
            {/* Type maintenance selection */}
            <div className='flex flex-col'>
              <label htmlFor="maintenance-type" className='text-sm font-semibold mb-2'>
                Type de maintenance <span className='text-red-500'>*</span>
              </label>
              <select 
                id="maintenance-type"
                className='border rounded-lg w-full p-2' 
                {...register('maintenance', {required:'Ce champ est requis'})}
              >
                <option value="">Choisir le type de maintenance</option>
                <option value="CORRECTION">CORRECTIF</option>
                <option value="PALLIATIVE">PALIATIF</option>
                <option value="CURATIVE">CURATIF</option>
              </select>
              {errors.maintenance && (
                <p className='text-sm text-red-500 mt-1'>
                  {errors.maintenance.message}
                </p>
              )}
            </div>

            {/* Type d'incident */}
            <div>
              <label className="block text-sm font-semibold mb-2">Type d'incident :</label>
              <AutoComplete
                placeholder="Rechercher un type d'incident..."
                isLoading={isLoadingTypes}
                dataList={incidentTypes}
                onSearch={handleSearchIncidentTypes}
                onSelect={handleSelectIncidentType}
                register={{...register('incidentId', { required: "Le type d'incident est requis" })}}
              />
              {errors.incidentId && (
                <p className="text-red-500 text-sm mt-1">{errors.incidentId.message}</p>
              )}
            </div>

            {/* Arrêt opération */}
            <div className='bg-gray-50 rounded-lg p-4'>
              <label className='flex items-center space-x-2 cursor-pointer'>
                <input
                  type="checkbox"
                  {...register("hasStoppedOperations")}
                  className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500'
                />
                <span className='font-semibold text-sm'>L'incident a causé un arrêt des opérations</span>
              </label>
              <p className='text-xs text-gray-500 mt-1'>
                {hasStoppedOperationsValue ? "✓ Arrêt opération enregistré" : "Aucun arrêt opération"}
              </p>
            </div>

            {/* Description */}
            <div className='flex flex-col'>
              <label htmlFor="maintenance-description" className='text-sm font-semibold mb-2'>
                Description des travaux <span className='text-red-500'>*</span>
              </label>
              <textarea 
                id="maintenance-description"
                className='border rounded-lg p-2 w-full' 
                placeholder='Décrivez en détail les travaux de maintenance à effectuer...'
                value={description}
                onChange={(e)=>setDescription(e.target.value)}
                required
                rows={4}
              />
              {!description && (
                <p className='text-xs text-red-500 mt-1'>La description est obligatoire</p>
              )}
            </div>

            <DialogFooter className="flex gap-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsOpen(false)}
                disabled={isSubmitting}
              >
                Annuler
              </Button>
              <Button 
                type="submit" 
                className={`flex gap-2 text-white hover:bg-secondary ${
                  isSubmitting ? "bg-blue-300 cursor-not-allowed" : "bg-primary"
                }`}
                disabled={isSubmitting || !description}
              >
                {isSubmitting ? <Preloader size={20}/> : <CheckCircle />}
                <span>{isSubmitting ? "En cours..." : "Démarrer la maintenance"}</span>
              </Button>  
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal Clôturer l'incident */}
      <CloseIncidentForm
        isOpen={modalIsOpen}
        setIsOpen={setModalIsOpen}
        fetchData={fetchData}
        selectedRow={rowSelection}
      />

      {/* Modal Voir détails avec SecureImage */}
      <Dialog open={isOpenDetails} onOpenChange={setIsOpenDetails}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="flex flex-row items-center justify-between border-b pb-4">
            <div>
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                <EyeIcon className="h-5 w-5 text-blue-600" />
                Détails de l'incident
              </DialogTitle>
              <DialogDescription className="mt-1">
                Informations complètes sur l'incident #{selectedIncidentData?.numRef}
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Section Informations principales */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <InformationCircleIcon className="h-4 w-4" />
                Informations principales
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <InfoItem label="No Ref" value={selectedIncidentData?.numRef} />
                  <InfoItem label="Statut" value={
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      selectedIncidentData?.status === "CLOSED" ? "bg-green-100 text-green-800" :
                      selectedIncidentData?.status === "UNDER_MAINTENANCE" ? "bg-yellow-100 text-yellow-800" :
                      "bg-red-100 text-red-800"
                    }`}>
                      {INCIDENT_STATUS[selectedIncidentData?.status] || "Inconnu"}
                    </span>
                  } />
                  <InfoItem label="Arrêt opération" value={
                    selectedIncidentData?.hasStoppedOperations ? 
                      <span className="text-red-600 font-medium">Oui</span> : 
                      <span className="text-green-600">Non</span>
                  } />
                </div>
                <div className="space-y-2">
                  <InfoItem label="Site" value={sitesMap.get(selectedIncidentData?.siteId) || "--"} />
                  <InfoItem label="Quart" value={shifts.find(s => s.value === selectedIncidentData?.shiftId)?.name || "--"} />
                  <InfoItem label="Équipement" value={selectedIncidentData?.equipement?.title || "--"} />
                </div>
                <div className="space-y-2">
                  <InfoItem label="Type incident" value={selectedIncidentData?.incident?.name || "--"} />
                  <InfoItem label="Cause incident" value={incidentCauses.find(c => c.value === selectedIncidentData?.incidentCauseId)?.name || "--"} />
                </div>
              </div>
            </div>

            {/* Section Description */}
            <div className="bg-white border rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <DocumentTextIcon className="h-4 w-4" />
                Description
              </h3>
              <div className="bg-gray-50 rounded p-3 min-h-[80px]">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {selectedIncidentData?.description || "Aucune description fournie"}
                </p>
              </div>
            </div>

            {/* Section Dates */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white border rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">Date de création</h3>
                <p className="text-gray-600">
                  {selectedIncidentData?.creationDate ? 
                    new Date(selectedIncidentData.creationDate).toLocaleString('fr-FR') : "--"
                  }
                </p>
              </div>
              
              {selectedIncidentData?.closedManuDate && (
                <div className="bg-white border rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm">Date de clôture manuelle</h3>
                  <p className="text-gray-600">
                    {new Date(selectedIncidentData.closedManuDate).toLocaleString('fr-FR')}
                  </p>
                </div>
              )}
              
              {selectedIncidentData?.closedDate && (
                <div className="bg-white border rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm">Date de clôture système</h3>
                  <p className="text-gray-600">
                    {new Date(selectedIncidentData.closedDate).toLocaleString('fr-FR')}
                  </p>
                </div>
              )}
            </div>

            {/* Section Intervenants */}
            <div className="bg-white border rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <UserGroupIcon className="h-4 w-4" />
                Intervenants
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem 
                  label="Initiateur" 
                  value={employees.find(e => e.value === selectedIncidentData?.createdBy)?.name || selectedIncidentData?.createdBy || "--"} 
                />
                <InfoItem 
                  label="Intervenant" 
                  value={
                    employees.find(e => e.value === selectedIncidentData?.technician)?.name ||
                    externalEntities.find(e => e.value === selectedIncidentData?.technician)?.name ||
                    selectedIncidentData?.technician || "--"
                  } 
                />
                {selectedIncidentData?.closedBy && (
                  <InfoItem 
                    label="Clôturé par" 
                    value={employees.find(e => e.value === selectedIncidentData?.closedBy)?.name || selectedIncidentData?.closedBy || "--"} 
                  />
                )}
              </div>
            </div>

            {/* Section Photos avec SecureImage */}
            {selectedIncidentData?.photos && selectedIncidentData.photos.length > 0 ? (
              <div className="bg-white border rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <CameraIcon className="h-4 w-4" />
                    Photos associées ({selectedIncidentData.photos.length})
                  </h3>
                  <span className="text-sm text-gray-500">
                    Cliquez sur une photo pour l'agrandir
                  </span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {selectedIncidentData.photos.map((photo, index) => (
                    <div key={photo.id} className="group relative border rounded-lg overflow-hidden bg-gray-50 hover:shadow-md transition-shadow">
                      <SecureImage
                        src={photo.url}
                        alt={`Photo ${index + 1} de l'incident ${selectedIncidentData?.numRef}`}
                        className="w-full h-32 object-cover cursor-pointer group-hover:opacity-90 transition-opacity"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all flex items-center justify-center pointer-events-none">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <EyeIcon className="h-6 w-6 text-white drop-shadow-lg" />
                        </div>
                      </div>
                      <div className="p-2 text-xs text-center bg-white border-t">
                        <p className="font-medium">Photo {index + 1}</p>
                        <p className="text-gray-500 text-xs">
                          {new Date(photo.createdAt || photo.creationDate).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <CameraIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Aucune photo associée à cet incident</p>
              </div>
            )}

            {/* Section Maintenance (si applicable) */}
            {selectedIncidentData?.status === "UNDER_MAINTENANCE" && selectedIncidentData?.maintenances && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-800 mb-3 flex items-center gap-2">
                  <Cog6ToothIcon className="h-4 w-4" />
                  Informations de maintenance
                </h3>
                <div className="space-y-3">
                  {selectedIncidentData.maintenances.map((maintenance, index) => (
                    <div key={maintenance.id} className="bg-white rounded p-3 border">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InfoItem label="Type de maintenance" value={maintenance.maintenance} />
                        <InfoItem label="Date de début" value={new Date(maintenance.creationDate).toLocaleString('fr-FR')} />
                        <InfoItem 
                          label="Description" 
                          value={<span className="whitespace-pre-wrap">{maintenance.description}</span>} 
                        />
                        {maintenance.closedDate && (
                          <InfoItem label="Date de fin" value={new Date(maintenance.closedDate).toLocaleString('fr-FR')} />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="border-t pt-4">
            <div className="flex justify-between items-center w-full">
              <div className="text-sm text-gray-500">
                Dernière mise à jour: {selectedIncidentData?.updatedAt ? 
                  new Date(selectedIncidentData.updatedAt).toLocaleString('fr-FR') : 
                  new Date().toLocaleString('fr-FR')
                }
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsOpenDetails(false)}
                  className="flex items-center gap-2"
                >
                  <XMarkIcon className="h-4 w-4" />
                  Fermer
                </Button>
                {/* <Button 
                  onClick={() => {
                    setIsOpenDetails(false);
                    handleOpenEdit(selectedIncidentData);
                  }}
                  className="flex items-center gap-2"
                >
                  <PencilSquareIcon className="h-4 w-4" />
                  Modifier
                </Button> */}
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Modifier incident avec AutoComplete */}
      <Dialog open={isOpenEdit} onOpenChange={setIsOpenEdit}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier l'incident</DialogTitle>
            <DialogDescription>
              Modifiez les informations de l'incident
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleSubmit(submitEdit)}>
            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-1">Description :</label>
              <textarea
                {...register("description")}
                defaultValue={editFields.description}
                className="w-full border rounded p-2"
                rows={3}
              />
            </div>

            {/* Arrêt opération */}
            <div>
              <label className="block text-sm font-medium mb-1">Arrêt opération :</label>
              <select 
                {...register("hasStoppedOperations")} 
                defaultValue={editFields.hasStoppedOperations ? "true" : "false"} 
                className="w-full border rounded p-2"
              >
                <option value="true">Oui</option>
                <option value="false">Non</option>
              </select>
            </div>

            {/* Site avec AutoComplete */}
            <div>
              <label className="block text-sm font-medium mb-1">Site :</label>
              <AutoComplete
                placeholder="Rechercher un site..."
                isLoading={false}
                dataList={sites}
                onSearch={handleSearchSites}
                onSelect={handleSelectSite}
                register={{...register('siteId')}}
              />
            </div>

            {/* Équipement avec AutoComplete - conditionnel au site */}
            {watch("siteId") && (
              <div>
                <label className="block text-sm font-medium mb-1">Équipement :</label>
                <AutoComplete
                  placeholder="Rechercher un équipement..."
                  isLoading={isEquipementLoading}
                  dataList={equipments}
                  onSearch={handleSearchEquipements}
                  onSelect={handleSelectEquipement}
                  register={{...register('equipementId')}}
                />
              </div>
            )}

            {/* Quart avec AutoComplete */}
            <div>
              <label className="block text-sm font-medium mb-1">Quart :</label>
              <AutoComplete
                placeholder="Rechercher un quart..."
                isLoading={false}
                dataList={shifts}
                onSearch={handleSearchShifts}
                onSelect={handleSelectShift}
                register={{...register('shiftId')}}
              />
            </div>

            {/* Type d'incident avec AutoComplete */}
            <div>
              <label className="block text-sm font-medium mb-1">Type d'incident :</label>
              <AutoComplete
                placeholder="Rechercher un type d'incident..."
                isLoading={false}
                dataList={incidentTypes}
                onSearch={handleSearchIncidentTypes}
                onSelect={handleSelectIncidentType}
                register={{...register('incidentId')}}
              />
            </div>

            {/* Cause incident avec AutoComplete */}
            <div>
              <label className="block text-sm font-medium mb-1">Cause incident :</label>
              <AutoComplete
                placeholder="Rechercher une cause..."
                isLoading={false}
                dataList={incidentCauses}
                onSearch={handleSearchIncidentCauses}
                onSelect={handleSelectIncidentCause}
                register={{...register('incidentCauseId')}}
              />
            </div>

            {/* Intervenant avec AutoComplete */}
            <div>
              <label className="block text-sm font-medium mb-1">Intervenant :</label>
              <AutoComplete
                placeholder="Rechercher un intervenant..."
                isLoading={false}
                dataList={[...employees, ...externalEntities]} // Combiner employés et entités externes
                onSearch={handleSearchIntervenant}
                onSelect={handleSelectIntervenant}
                register={{...register('technician')}}
              />
            </div>

            <DialogFooter>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Preloader size={16} />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Enregistrer les modifications
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Datalist;
