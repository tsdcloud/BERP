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


// // Datalist.jsx - Version avec règles de domaine corrigées
// import { useEffect, useState, useCallback, useRef, useContext } from 'react';
// import { Button } from '../ui/button';
// import { useForm } from 'react-hook-form';
// import { INCIDENT_STATUS } from '../../utils/constant.utils';
// import { Table } from 'antd';
// import { useFetch } from '../../hooks/useFetch';
// import toast from 'react-hot-toast';
// import { URLS } from '../../../configUrl';
// import AutoComplete from '../common/AutoComplete';
// import { 
//   XMarkIcon, 
//   TrashIcon, 
//   ExclamationTriangleIcon, 
//   EyeIcon, 
//   PencilSquareIcon,
//   DocumentTextIcon,
//   CameraIcon,
//   UserGroupIcon,
//   InformationCircleIcon
// } from '@heroicons/react/24/outline';
// import {
//   Dialog,
//   DialogContent,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription
// } from "../ui/dialog";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "../ui/dropdown-menu";
// import { CheckCircle, MoreHorizontal } from "lucide-react";
// import VerifyPermission from '../../utils/verifyPermission';
// import { Cog6ToothIcon } from '@heroicons/react/24/solid';
// import Preloader from '../Preloader';
// import { getEmployee } from '../../utils/entity.utils';
// import CloseIncidentForm from './CloseIncidentForm';
// import { AUTHCONTEXT } from '../../contexts/AuthProvider';

// const SecureImage = ({ src, alt, className }) => {
//   const [imageUrl, setImageUrl] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [hasError, setHasError] = useState(false);
//   const blobUrlRef = useRef(null);

//   const defaultImageSVG = `image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23f7fafc"/><path d="M100 50C89.5228 50 81 58.5228 81 69C81 79.4772 89.5228 88 100 88C110.477 88 119 79.4772 119 69C119 58.5228 110.477 50 100 50ZM100 125C80.1109 125 64 141.111 64 161V75C64 65.4772 72.4772 57 82 57H118C127.523 57 136 65.4772 136 75V161C136 141.111 119.889 125 100 125Z" fill="%23a0aec0"/><text x="100" y="120" text-anchor="middle" font-family="Arial" font-size="14" fill="%234a5568">Image non disponible</text></svg>`;

//   useEffect(() => {
//     let isCancelled = false;

//     const loadImageWithAuth = async () => {
//       try {
//         setIsLoading(true);
//         setHasError(false);
//         const token = localStorage.getItem('token');
//         if (!token) {
//           if (!isCancelled) setHasError(true);
//           return;
//         }

//         const response = await fetch(src, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         if (response.ok && !isCancelled) {
//           const blob = await response.blob();
//           const objectUrl = URL.createObjectURL(blob);
//           setImageUrl(objectUrl);
//           blobUrlRef.current = objectUrl;
//         } else if (!isCancelled) {
//           setHasError(true);
//         }
//       } catch (error) {
//         if (!isCancelled) {
//           console.error('Erreur chargement image:', error);
//           setHasError(true);
//         }
//       } finally {
//         if (!isCancelled) setIsLoading(false);
//       }
//     };

//     loadImageWithAuth();

//     return () => {
//       isCancelled = true;
//       if (blobUrlRef.current) {
//         URL.revokeObjectURL(blobUrlRef.current);
//         blobUrlRef.current = null;
//       }
//     };
//   }, [src]);

//   const handleClick = () => {
//     if (imageUrl && imageUrl.startsWith('blob:')) {
//       const win = window.open(imageUrl, '_blank');
//       if (!win) {
//         alert('Popup bloquée. Veuillez autoriser les popups.');
//       }
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className={`${className} bg-gray-100 flex items-center justify-center`}>
//         <div className="animate-pulse text-gray-400 text-sm">Chargement...</div>
//       </div>
//     );
//   }

//   if (hasError) {
//     return <img src={defaultImageSVG} alt={alt} className={className} />;
//   }

//   return (
//     <img
//       src={imageUrl}
//       alt={alt}
//       className={className}
//       onClick={handleClick}
//       onError={() => setHasError(true)}
//     />
//   );
// };

// const Datalist = ({ dataList, fetchData, searchValue, pagination, loading }) => {
//   const [sitesMap, setSitesMap] = useState(new Map());
//   const [sites, setSites] = useState([]);
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
//   const [isOpenDetails, setIsOpenDetails] = useState(false);
//   const [isOpenEdit, setIsOpenEdit] = useState(false);
//   const [editFields, setEditFields] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [selectedIncidentData, setSelectedIncidentData] = useState(null);
//   const [incidentTypes, setIncidentTypes] = useState([]);
//   const [equipments, setEquipments] = useState([]);
//   const [isEquipementLoading, setIsEquipementLoading] = useState(false);
//   const [isLoadingTypes, setIsLoadingTypes] = useState(false);
//   const [isOpenReclassify, setIsOpenReclassify] = useState(false);
//   const [reclassifyFields, setReclassifyFields] = useState({});
//   const [userDomain, setUserDomain] = useState("");
  
//   const authContext = useContext(AUTHCONTEXT);

//   const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm();
  
//   const { handleFetch, handlePost, handlePatch } = useFetch();

//   // Fonction pour extraire le domaine d'un équipement
//   const getEquipmentDomain = useCallback((equipement) => {
//     if (!equipement) {
//       return null;
//     }
    
//     const equipmentObj = Array.isArray(equipement) ? equipement[0] : equipement;
    
//     if (equipmentObj && equipmentObj.equipmentGroup && equipmentObj.equipmentGroup.equipmentGroupFamily) {
//       return equipmentObj.equipmentGroup.equipmentGroupFamily.domain;
//     }
    
//     return null;
//   }, []);

//   // Fonction pour obtenir le domaine d'un équipement par son ID
//   const getEquipmentDomainFromId = useCallback(async (equipmentId) => {
//     if (!equipmentId) return null;
    
//     try {
//       // Si on a déjà l'équipement dans selectedIncidentData
//       if (selectedIncidentData?.equipement) {
//         const currentDomain = getEquipmentDomain(selectedIncidentData.equipement);
//         if (currentDomain) return currentDomain;
//       }
      
//       // Sinon, charger l'équipement
//       const response = await handleFetch(`${URLS.INCIDENT_API}/equipements/${equipmentId}`);
      
//       if (response?.status === 200 && response.data) {
//         const equipment = response.data;
//         if (equipment.equipmentGroup && equipment.equipmentGroup.equipmentGroupFamily) {
//           return equipment.equipmentGroup.equipmentGroupFamily.domain;
//         }
//       }
//       return null;
//     } catch (error) {
//       console.error("Erreur récupération domaine équipement:", error);
//       return null;
//     }
//   }, [handleFetch, selectedIncidentData, getEquipmentDomain]);

//   // Fonction pour obtenir le domaine de l'utilisateur à partir de ses rôles
//   const getUserDomainFromRoles = useCallback((rolesArray) => {
//     if (!rolesArray || !Array.isArray(rolesArray)) return null;
    
//     const normalizedRoles = rolesArray.map(role => role.toLowerCase());
    
//     // Vérifier d'abord les rôles privilégiés (Admin, Manager, DEX)
//     const privilegedRoles = ['admin', 'manager', 'dex'];
//     const hasPrivilegedRole = privilegedRoles.some(privilegedRole => 
//       normalizedRoles.some(role => role.includes(privilegedRole))
//     );
    
//     if (hasPrivilegedRole) {
//       return "PRIVILEGED";
//     }
    
//     // Vérifier les domaines spécifiques (ordre d'importance)
//     if (normalizedRoles.some(role => role.includes('maintenancier'))) return "MAINTENANCE";
//     if (normalizedRoles.some(role => role.includes('it'))) return "IT";
//     if (normalizedRoles.some(role => ['rop', 'customer manager'].some(r => role.includes(r)))) return "OPERATIONS";
//     if (normalizedRoles.some(role => role.includes('hse'))) return "HSE";
    
//     return null;
//   }, []);

//   // Fonction pour vérifier si l'utilisateur peut clôturer un incident
//   const canCloseIncident = useCallback((record) => {
//     // 1. Vérifier si l'incident est déjà clôturé
//     if (record.status === "CLOSED") return false;
    
//     // 2. Vérifier si l'incident a un équipement
//     if (!record.equipement) return false;
    
//     // 3. Obtenir le domaine de l'incident
//     const incidentDomain = getEquipmentDomain(record.equipement);
    
//     // 4. Normaliser les rôles pour la comparaison
//     const normalizedRoles = roles.map(role => role.toLowerCase());
    
//     // 5. Vérifier les rôles privilégiés (Admin, Manager, DEX)
//     const privilegedRoles = ['admin', 'manager', 'dex'];
//     const isPrivilegedUser = privilegedRoles.some(privilegedRole => 
//       normalizedRoles.some(role => role.includes(privilegedRole))
//     );
    
//     // 6. Les rôles privilégiés peuvent TOUJOURS clôturer
//     if (isPrivilegedUser) {
//       return true;
//     }
    
//     // 7. Pour les autres utilisateurs, ils doivent avoir la permission spécifique
//     const hasPermission = permissions.includes("incident__can_close_incident");
    
//     // 8. Si pas de permission, ne peut pas clôturer
//     if (!hasPermission) return false;
    
//     // 9. Si pas de domaine sur l'incident, ne peut pas clôturer
//     if (!incidentDomain) {
//       return false;
//     }
    
//     // 10. Si utilisateur n'a pas de domaine spécifique, ne peut pas clôturer
//     if (!userDomain) return false;
    
//     // 11. Vérifier la correspondance des domaines
//     return incidentDomain === userDomain;
//   }, [userDomain, roles, permissions, getEquipmentDomain]);
  

//   // Fonction pour vérifier si l'utilisateur peut reclasser un incident
//   const canReclassifyIncident = useCallback((record) => {
//     // Seuls les incidents clôturés peuvent être reclassés
//     if (record.status !== "CLOSED") return false;
    
//     // Vérifier si l'incident a un équipement
//     if (!record.equipement) return false;
    
//     // Obtenir le domaine de l'incident
//     const incidentDomain = getEquipmentDomain(record.equipement);
    
//     // Normaliser les rôles pour la comparaison
//     const normalizedRoles = roles.map(role => role.toLowerCase());
    
//     // Vérifier les rôles privilégiés (Admin, Manager, DEX) - peuvent toujours reclasser
//     const privilegedRoles = ['admin', 'manager', 'dex'];
//     const isPrivilegedUser = privilegedRoles.some(privilegedRole => 
//       normalizedRoles.some(role => role.includes(privilegedRole))
//     );
    
//     // Les rôles privilégiés peuvent TOUJOURS reclasser
//     if (isPrivilegedUser) {
//       return true;
//     }
    
//     // Tous les utilisateurs peuvent reclasser les incidents de leur domaine
//     // L'utilisateur doit avoir la permission de reclasser
//     const hasPermission = permissions.includes("incident__can_edit_incident");
    
//     // Si pas de permission, ne peut pas reclasser
//     if (!hasPermission) return false;
    
//     // Si utilisateur n'a pas de domaine spécifique, ne peut pas reclasser
//     if (!userDomain) return false;
    
//     // Vérifier la correspondance des domaines
//     return incidentDomain === userDomain;
//   }, [userDomain, roles, permissions, getEquipmentDomain]);


//   // Fonction pour vérifier si l'utilisateur peut mettre en maintenance un incident
//   const canPutIntoMaintenance = useCallback((record) => {
//     // Seuls les incidents en attente peuvent être mis en maintenance
//     if (record.status !== "PENDING") return false;
    
//     // Vérifier si l'incident a un équipement
//     if (!record.equipement) return false;
    
//     // Obtenir le domaine de l'incident
//     const incidentDomain = getEquipmentDomain(record.equipement);
    
//     // Normaliser les rôles pour la comparaison
//     const normalizedRoles = roles.map(role => role.toLowerCase());
    
//     // Vérifier les rôles privilégiés (Admin, Manager, DEX) - peuvent toujours mettre en maintenance
//     const privilegedRoles = ['admin', 'manager', 'dex'];
//     const isPrivilegedUser = privilegedRoles.some(privilegedRole => 
//       normalizedRoles.some(role => role.includes(privilegedRole))
//     );
    
//     // Les rôles privilégiés peuvent TOUJOURS mettre en maintenance
//     if (isPrivilegedUser) {
//       return true;
//     }
    
//     // Seuls les utilisateurs IT et Maintenance peuvent mettre en maintenance leurs incidents respectifs
//     if (userDomain === "IT" || userDomain === "MAINTENANCE") {
//       // L'utilisateur doit avoir la permission de mettre en maintenance
//       const hasPermission = permissions.includes("incident__can_send_to_maintenance_incident");
      
//       // Si pas de permission, ne peut pas mettre en maintenance
//       if (!hasPermission) return false;
      
//       // Vérifier la correspondance des domaines
//       return incidentDomain === userDomain;
//     }
    
//     // Pour les autres domaines (HSE, OPERATIONS), pas de mise en maintenance
//     return false;
//   }, [userDomain, roles, permissions, getEquipmentDomain]);

//   // Highlight texte recherche
//   const highlightText = useCallback((text) => {
//     if (!searchValue || !text) return text || "--";
    
//     try {
//         const textStr = String(text);
//         const searchStr = String(searchValue);
        
//         const escapedSearch = searchStr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
//         const regex = new RegExp(escapedSearch, 'gi');
        
//         const parts = textStr.split(regex);
//         const matches = textStr.match(regex);
        
//         if (!matches) return textStr;
        
//         return parts.reduce((acc, part, i) => [
//             ...acc,
//             part,
//             matches[i] && <mark key={i} style={{ backgroundColor: 'yellow' }}>{matches[i]}</mark>
//         ], []);
//     } catch (error) {
//         return text;
//     }
//   }, [searchValue]);

//   // Fonctions de recherche
//   const handleSearchSites = async (searchInput) => {
//     try {
//       await handleFetchSites(`${URLS.ENTITY_API}/sites?search=${searchInput}`);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleSearchEquipements = async (searchInput) => {
//     try {
//       setIsEquipementLoading(true);
      
//       let siteId = "";
      
//       if (isOpenReclassify && selectedIncidentData?.siteId) {
//         siteId = selectedIncidentData.siteId;
//       } else if (watch("siteId")) {
//         siteId = watch("siteId");
//       }
      
//       let url = "";
//       if (siteId) {
//         url = `${URLS.INCIDENT_API}/equipements/site/${siteId}`;
//         if (searchInput) {
//           url += `?search=${searchInput}`;
//         }
//       } else {
//         url = `${URLS.INCIDENT_API}/equipements`;
//         if (searchInput) {
//           url += `?search=${searchInput}`;
//         }
//       }
      
//       await handleFetchIncidentEquipement(url);
//     } catch (error) {
//       console.error("Erreur recherche équipements:", error);
//     } finally {
//       setIsEquipementLoading(false);
//     }
//   };

//   const handleSearchShifts = async (searchInput) => {
//     try {
//       await handleFetchShifts(`${URLS.ENTITY_API}/shifts?search=${searchInput}`);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleSearchIncidentTypes = async (searchInput) => {
//     try {
//       await handleFetchIncidentTypes(`${URLS.INCIDENT_API}/incident-types?search=${searchInput}`);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleSearchIncidentCauses = useCallback(async (searchInput = "", incidentTypeId = null) => {
//     try {
//       let url = `${URLS.INCIDENT_API}/incident-causes`;
//       let queryParams = [];
      
//       if (searchInput) queryParams.push(`search=${searchInput}`);
//       if (incidentTypeId) queryParams.push(`incidentTypeId=${incidentTypeId}`);
      
//       if (queryParams.length > 0) {
//         url += `?${queryParams.join('&')}`;
//       }
      
//       console.log("URL appelée pour causes d'incident:", url);
      
//       await handleFetchIncidentCauses(url);
//     } catch (error) {
//       console.error(error);
//     }
//   }, []);

//   const handleSearchEmployees = async (searchInput) => {
//     try {
//       await handleFetchEmployees(`${URLS.ENTITY_API}/employees?search=${searchInput}`);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleSearchIntervenant = async (searchInput) => {
//     try {
//       await handleFetchEmployees(`${URLS.ENTITY_API}/employees?search=${searchInput}`);
//       await handleFetchExternalEntities(`${URLS.ENTITY_API}/suppliers?search=${searchInput}`);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleSelectIntervenant = (item) => {
//     if (item) {
//       setValue("technician", item.value);
//     } else {
//       setValue("technician", "");
//     }
//   };

//   const handleSelectSite = async (item) => {
//     if (item) {
//       setValue("siteId", item.value);
//       setValue("equipementId", "");
      
//       setIsEquipementLoading(true);
//       try {
//         await handleFetchIncidentEquipement(`${URLS.INCIDENT_API}/equipements/site/${item.value}`);
//       } catch (error) {
//         console.error(error);
//       } finally {
//         setIsEquipementLoading(false);
//       }
//     } else {
//       setValue("siteId", "");
//       setValue("equipementId", "");
//       setEquipments([]);
//     }
//   };

//   const handleSelectEquipement = (item) => {
//     if (item) {
//       setValue("equipementId", item.value);
//     } else {
//       setValue("equipementId", "");
//     }
//   };

//   const handleSelectShift = (item) => {
//     if (item) {
//       setValue("shiftId", item.value);
//     } else {
//       setValue("shiftId", "");
//     }
//   };

//   const handleSelectIncidentType = (item) => {
//     if (item) {
//       setValue("incidentId", item.value);
//       const hiddenInput = document.getElementById('incidentId');
//       if (hiddenInput) {
//         hiddenInput.value = item.value;
//       }
//     } else {
//       setValue("incidentId", "");
//       const hiddenInput = document.getElementById('incidentId');
//       if (hiddenInput) {
//         hiddenInput.value = "";
//       }
//     }
//   };

//   const handleSelectIncidentCause = (item) => {
//     if (item) {
//       setValue("incidentCauseId", item.value);
//     } else {
//       setValue("incidentCauseId", "");
//     }
//   };

//   const handleSelectClosedBy = (item) => {
//     if (item) {
//       setValue("closedBy", item.value);
//     } else {
//       setValue("closedBy", "");
//     }
//   };

//   // Fetch datas
//   const handleFetchSites = async (link) => {
//     try {
//       let response = await handleFetch(link);
//       if (response?.status === 200) {
//         let formatedData = response?.data.map(item => ({ name: item?.name, value: item?.id }));
//         setSites(formatedData);
//         const newMap = new Map();
//         formatedData.forEach(site => newMap.set(site.value, site.name));
//         setSitesMap(newMap);
//       }
//     } catch (error) { console.error(error); }
//   };

//   const handleFetchShifts = async (link) => {
//     try {
//       let response = await handleFetch(link);
//       if (response?.status === 200) setShifts(response?.data.map(item => ({ name: item?.name, value: item?.id })));
//     } catch (error) { console.error(error); }
//   };

//   const handleFetchEmployees = async (link) => {
//     try {
//       let response = await handleFetch(link);
//       if (response?.status === 200) setEmployees(response?.data.map(item => ({ name: item?.name, value: item?.id })));
//     } catch (error) { console.error(error); }
//   };

//   const handleFetchExternalEntities = async (link) => {
//     try {
//       let response = await handleFetch(link);
//       if (response?.status === 200) setExternalEntities(response?.data.map(item => ({ name: item?.name, value: item?.id })));
//     } catch (error) { console.error(error); }
//   };

//   const handleFetchMaintenanceTypes = async (link) => {
//     try {
//       let response = await handleFetch(link);
//       if (response?.status === 200) setMaintenanceTypes(response?.data.map(item => ({ name: item?.name, value: item?.id })));
//     } catch (error) { console.error(error); }
//   };

//   const handleFetchIncidentCauses = useCallback(async (searchInput = "", incidentTypeId = null) => {
//     try {
//       let url = `${URLS.INCIDENT_API}/incident-causes`;
//       let queryParams = [];
      
//       if (searchInput) queryParams.push(`search=${searchInput}`);
//       if (incidentTypeId) queryParams.push(`incidentTypeId=${incidentTypeId}`);
      
//       if (queryParams.length > 0) {
//         url += `?${queryParams.join('&')}`;
//       }
      
//       console.log("Chargement causes depuis:", url);
      
//       let response = await handleFetch(url);
//       if(response?.status === 200) {
//         let formattedData = response.data.map(item => ({ 
//           name: item?.name || "", 
//           value: item?.id 
//         }));
//         setIncidentCauses(formattedData);
//       }
//     } catch (error) { 
//       console.error("Erreur chargement causes:", error);
//       setIncidentCauses([]);
//     }
//   }, [handleFetch]);

//   const handleFetchIncidentTypes = useCallback(async (searchInput = "", equipmentDomain = null) => {
//     setIsLoadingTypes(true);
//     try {
//       let baseUrl = `${URLS.INCIDENT_API}/incident-types`;
//       let queryParams = [];
      
//       if (searchInput) queryParams.push(`search=${searchInput}`);
//       if (equipmentDomain) queryParams.push(`domain=${equipmentDomain}`);
      
//       const url = queryParams.length > 0 
//         ? `${baseUrl}?${queryParams.join('&')}`
//         : baseUrl;
      
//       console.log("URL appelée pour types d'incident:", url);
      
//       let response = await handleFetch(url);
//       if(response?.status === 200) {
//         let formattedData = response.data.map(entity => ({
//           name: entity?.name || "",
//           value: entity?.id
//         }));
//         setIncidentTypes(formattedData);
//       }
//     } catch (error) {
//       console.error("Erreur chargement types:", error);
//     } finally {
//       setIsLoadingTypes(false);
//     }
//   }, [handleFetch]);

//   const handleFetchIncidentEquipement = async (link) => {
//     try {
//       let response = await handleFetch(link);
      
//       if (response?.status === 200) {
//         const equipmentsData = response?.data.map(item => ({ 
//           name: item?.title || item?.name, 
//           value: item?.id 
//         }));
//         setEquipments(equipmentsData);
//       } else {
//         setEquipments([]);
//       }
//     } catch (error) { 
//       setEquipments([]);
//     }
//   };

//   const handleOpenDetails = (record) => {
//     setSelectedIncident(record.id);
//     setSelectedIncidentData(record);
//     setEditFields({
//       description: record.description,
//       hasStoppedOperations: record.hasStoppedOperations,
//       siteId: record.siteId,
//       shiftId: record.shiftId,
//       incidentCauseId: record.incidentCauseId
//     });
//     setIsOpenDetails(true);
//   };

//   const handleOpenEdit = (record) => {
//     setSelectedIncident(record.id);
//     setSelectedIncidentData(record);
    
//     const fields = {
//       description: record.description,
//       hasStoppedOperations: record.hasStoppedOperations,
//       siteId: record.siteId,
//       shiftId: record.shiftId,
//       incidentCauseId: record.incidentCauseId,
//       incidentId: record.incidentId,
//       equipementId: record.equipementId,
//       closedBy: record.closedBy,
//       technician: record.technician
//     };
    
//     setEditFields(fields);
    
//     reset(fields);
    
//     if (record.siteId) {
//       setIsEquipementLoading(true);
//       handleFetchIncidentEquipement(`${URLS.INCIDENT_API}/equipements/site/${record.siteId}`)
//         .finally(() => setIsEquipementLoading(false));
//     } else {
//       setEquipments([]);
//     }
    
//     setIsOpenEdit(true);
//   };

//   const handleOpenMaintenance = (record) => {
//     // Vérifier si l'utilisateur peut mettre en maintenance cet incident
//     if (!canPutIntoMaintenance(record)) {
//       const incidentDomain = getEquipmentDomain(record.equipement);
//       toast.error(`Vous n'avez pas accès aux incidents de domaine ${incidentDomain} pour la maintenance`);
//       return;
//     }
    
//     if (!record?.id) {
//       console.error("Aucun ID d'incident trouvé");
//       return;
//     }
    
//     setValue("maintenance", "");
//     setValue("incidentId", "");
//     setValue("hasStoppedOperations", false);
//     setDescription("");
    
//     setSelectedSite(record.siteId);
//     setSelectedIncident(record.id);
//     setSelectedEquipement(record.equipementId);
    
//     if (record.incidentId) {
//       setValue("incidentId", record.incidentId);
//     }
//     if (record.hasStoppedOperations !== undefined) {
//       setValue("hasStoppedOperations", record.hasStoppedOperations);
//     }
    
//     setIsOpen(true);
//   };

//   const handleOpenReclassify = async (record) => {
//     // Vérifier si l'utilisateur peut reclasser cet incident
//     if (!canReclassifyIncident(record)) {
//       const incidentDomain = getEquipmentDomain(record.equipement);
//       toast.error(`Vous n'avez pas accès aux incidents de domaine ${incidentDomain} pour le reclassement`);
//       return;
//     }
    
//     setSelectedIncident(record.id);
//     setSelectedIncidentData(record);
    
//     const fields = {
//       description: record.description,
//       equipementId: record.equipementId,
//       incidentId: record.incidentId,
//       incidentCauseId: record.incidentCauseId
//     };
    
//     setReclassifyFields(fields);
//     reset(fields);
  
//     // Charger les équipements du site
//     if (record.siteId) {
//       setIsEquipementLoading(true);
//       try {
//         await handleFetchIncidentEquipement(`${URLS.INCIDENT_API}/equipements/site/${record.siteId}`);
        
//         // IMPORTANT: Attendre que les équipements soient chargés avant de continuer
//         setTimeout(async () => {
//           // Charger les types d'incident en fonction du domaine de l'équipement actuel
//           const currentEquipmentDomain = getEquipmentDomain(record.equipement);
//           console.log("Domaine actuel de l'équipement:", currentEquipmentDomain);
//           await handleFetchIncidentTypes("", currentEquipmentDomain);
          
//           // Charger les causes en fonction du type d'incident actuel
//           if (record.incidentId) {
//             console.log("Chargement causes pour incidentId:", record.incidentId);
//             await handleFetchIncidentCauses("", record.incidentId);
//           } else {
//             await handleFetchIncidentCauses();
//           }
//         }, 100);
        
//       } catch (error) {
//         console.error("Erreur chargement données reclassement:", error);
//       } finally {
//         setIsEquipementLoading(false);
//       }
//     }
    
//     setIsOpenReclassify(true);
//   };

//   const submitMaintenance = async(data) => {
//     if (!selectedIncident) {
//       toast.error("Aucun incident sélectionné pour la maintenance");
//       return;
//     }
  
//     if (!data.incidentId) {
//       toast.error("Veuillez sélectionner un type d'incident");
//       return;
//     }
  
//     setIsSubmitting(true);
  
//     try {
//       const maintenanceData = {
//         description: description,
//         siteId: selectedSite,
//         equipementId: selectedEquipement,
//         maintenance: data.maintenance,
//         incidentId: selectedIncident
//       };
      
//       let response = await handlePost(
//         `${URLS.INCIDENT_API}/maintenances`, 
//         maintenanceData
//       );
      
//       if(response.status !== 201){
//         toast.error("Échec de la création de la maintenance");
//         return;
//       }
  
//       const updateData = {
//         status: "UNDER_MAINTENANCE",
//         incidentId: data.incidentId,
//         hasStoppedOperations: data.hasStoppedOperations || false
//       };
      
//       const updateResponse = await handlePatch(
//         `${URLS.INCIDENT_API}/incidents/put_into_maintenance/${selectedIncident}`,
//         updateData
//       );
      
//       if (updateResponse && updateResponse.error) {
//         toast.error("Échec de la mise à jour: " + updateResponse.error);
//         return;
//       }
      
//       toast.success("Incident mis en maintenance avec succès");
//       fetchData();
//       setIsOpen(false);
//       setDescription("");
      
//     } catch (error) {
//       toast.error("Erreur lors de la mise en maintenance: " + error.message);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const submitEdit = async (data) => {
//     try {
//       setIsSubmitting(true);
//       const updateData = {
//         description: data.description,
//         hasStoppedOperations: data.hasStoppedOperations === "true",
//         siteId: data.siteId,
//         shiftId: data.shiftId,
//         incidentCauseId: data.incidentCauseId,
//         incidentId: data.incidentId,
//         equipementId: data.equipementId,
//         closedBy: data.closedBy,
//         technician: data.technician
//       };

//       await handlePatch(`${URLS.INCIDENT_API}/incidents/${selectedIncident}`, updateData);
//       toast.success("Incident modifié avec succès");
//       fetchData();
//       setIsOpenEdit(false);
//     } catch (error) {
//       console.error(error);
//       toast.error("Erreur lors de la modification de l'incident");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const submitReclassify = async (data) => {
//     try {
//       setIsSubmitting(true);
      
//       const updateData = {
//         equipementId: data.equipementId,
//         incidentId: data.incidentId,
//         incidentCauseId: data.incidentCauseId
//       };
  
//       // Vérifier que tous les champs requis sont présents
//       if (!updateData.equipementId || !updateData.incidentId || !updateData.incidentCauseId) {
//         toast.error("Tous les champs sont requis pour le reclassement");
//         setIsSubmitting(false);
//         return;
//       }
  
//       const response = await handlePatch(
//         `${URLS.INCIDENT_API}/incidents/reclassify/${selectedIncident}`,
//         updateData
//       );
  
//       if (response && response.error) {
//         toast.error("Erreur lors du reclassement: " + response.error);
//         return;
//       }
  
//       toast.success("Incident reclassé avec succès");
//       fetchData();
//       setIsOpenReclassify(false);
      
//     } catch (error) {
//       console.error("Erreur reclassification:", error);
//       toast.error("Erreur lors du reclassement");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const InfoItem = ({ label, value }) => (
//     <div className="flex flex-col">
//       <span className="text-sm font-medium text-gray-500">{label}</span>
//       <span className="text-gray-900 mt-1">{value || "--"}</span>
//     </div>
//   );

//   // Load initial data
//   useEffect(() => {
//     const loadInitialData = async () => {
//       try {
//         await Promise.all([
//           handleFetchSites(`${URLS.ENTITY_API}/sites`),
//           handleFetchShifts(`${URLS.ENTITY_API}/shifts`),
//           handleFetchIncidentCauses(`${URLS.INCIDENT_API}/incident-causes`),
//           handleFetchIncidentTypes(`${URLS.INCIDENT_API}/incident-types`),
//           handleFetchEmployees(`${URLS.ENTITY_API}/employees`)
//         ]);
//       } catch (error) {
//         console.error("Erreur chargement données:", error);
//       }
//     };

//     loadInitialData();
//   }, []);

//   // Load user roles & permissions
//   useEffect(() => {
//     const handleCheckPermissions = async () => {
//       try {
//         const employee = await getEmployee();
//         if (!employee) return;
        
//         const employeeRoles = await handleFetch(`${URLS.ENTITY_API}/employees/${employee?.id}/roles`);
//         const employeePermissions = await handleFetch(`${URLS.ENTITY_API}/employees/${employee?.id}/permissions`);
        
//         const roleNames = employeeRoles?.employeeRoles?.map(r => r.role.roleName) || [];
//         const permissionNames = employeePermissions?.employeePermissions?.map(p => p.permission.permissionName) || [];
        
//         setRoles(roleNames);
//         setPermissions(permissionNames);
        
//         // Déterminer le domaine de l'utilisateur
//         const domain = getUserDomainFromRoles(roleNames);
//         setUserDomain(domain);
        
//         console.log("👤 Rôles utilisateur:", roleNames);
//         console.log("👤 Domaine de l'utilisateur:", domain);
//         console.log("👤 Permissions:", permissionNames);
//       } catch (error) {
//         console.error("Erreur permissions:", error);
//       }
//     };
    
//     handleCheckPermissions();
//   }, [getUserDomainFromRoles]);

//   // Columns
//   const columns = [
//     { 
//       title: "No ref", 
//       dataIndex: "numRef", 
//       width: "100px", 
//       render: v => <p className='text-sm'>{highlightText(v)}</p> 
//     },
//     { 
//       title: "Équipement", 
//       dataIndex: "equipement", 
//       width: "250px", 
//       render: (equipement) => {
//         if (!equipement) {
//           return <p className='text-sm'>--</p>;
//         }
        
//         const equipmentObj = Array.isArray(equipement) ? equipement[0] : equipement;
//         const domain = getEquipmentDomain(equipement);
        
//         return (
//           <div className="flex flex-col gap-1">
//             <p className='text-sm font-medium'>{equipmentObj?.title || equipmentObj?.name || "--"}</p>
//             {domain && (
//               <span className={`inline-block text-xs px-2 py-1 rounded-full w-fit ${
//                 domain === "IT" ? "bg-blue-100 text-blue-800 border border-blue-200" :
//                 domain === "HSE" ? "bg-red-100 text-red-800 border border-red-200" :
//                 domain === "OPERATIONS" ? "bg-green-100 text-green-800 border border-green-200" :
//                 domain === "MAINTENANCE" ? "bg-yellow-100 text-yellow-800 border border-yellow-200" :
//                 "bg-gray-100 text-gray-800 border border-gray-200"
//               }`}>
//                 {domain}
//               </span>
//             )}
//           </div>
//         );
//       } 
//     },
//     { 
//       title: "Description", 
//       dataIndex: "description", 
//       width: "200px", 
//       render: v => <p className='text-sm'>{highlightText(v) || "--"}</p> 
//     },
//     { 
//       title: "Arrêt opération", 
//       dataIndex: "hasStoppedOperations", 
//       width: "150px", 
//       render: v => <p className='text-sm'>{v === true ? "Oui" : v === false ? "Non" : "--"}</p> 
//     },
//     { 
//       title: "Site", 
//       dataIndex: "siteId", 
//       width: "150px", 
//       render: v => <p className='text-sm capitalize'>{sitesMap.get(v) || v}</p> 
//     },
//     { 
//       title: "Quart", 
//       dataIndex: "shiftId", 
//       width: "150px", 
//       render: v => <p className='text-sm capitalize'>{shifts.find(s => s.value === v)?.name || v || "--"}</p> 
//     },
//     { 
//       title: "Initiateur", 
//       dataIndex: "createdBy", 
//       width: "200px", 
//       render: v => <p className='text-sm capitalize'>{employees.find(e => e.value === v)?.name || v}</p> 
//     },
//     { 
//       title: "Intervenant", 
//       dataIndex: "technician", 
//       width: "200px", 
//       render: v => <p className='text-sm capitalize'>{employees.find(e => e.value === v)?.name || externalEntities.find(e => e.value === v)?.name || v || "--"}</p> 
//     },
//     { 
//       title: "Clôturé par", 
//       dataIndex: "closedBy", 
//       width: "200px", 
//       render: v => <p className='text-sm capitalize'>{employees.find(e => e.value === v)?.name || v || "--"}</p> 
//     },
//     { 
//       title: "Type incident", 
//       dataIndex: "incident", 
//       width: "200px", 
//       render: v => <p className='text-sm'>{highlightText(v?.name) || v}</p> 
//     },
//     { 
//       title: "Cause incident", 
//       dataIndex: "incidentCauseId", 
//       width: "200px", 
//       render: v => <p className='text-sm capitalize'>{incidentCauses.find(c => c.value === v)?.name || v || "--"}</p> 
//     },
//     { 
//       title: "Date de création", 
//       dataIndex: "creationDate", 
//       width: "200px", 
//       render: v => <p className='text-sm capitalize'>{v ? new Date(v).toLocaleString() : "--"}</p> 
//     },
//     { 
//       title: "Date de clôture Utilisateur", 
//       dataIndex: "closedManuDate", 
//       width: "200px", 
//       render: v => <p className='text-sm capitalize'>{v ? new Date(v).toLocaleString() : "--"}</p> 
//     },
//     { 
//       title: "Date de clôture Système", 
//       dataIndex: "closedDate", 
//       width: "200px", 
//       render: v => <p className='text-sm capitalize'>{v ? new Date(v).toLocaleString() : "--"}</p> 
//     },
//     {
//       title: "Durée", 
//       dataIndex: "duration", 
//       width: "120px", 
//       render: (_, record) => {
//         const startDate = new Date(record.creationDate);
//         let endDate = record.closedManuDate ? new Date(record.closedManuDate) : record.status === "CLOSED" && record.closedDate ? new Date(record.closedDate) : null;
//         if (!endDate) return <p className='text-sm'>--</p>;
//         const durationMs = endDate - startDate;
//         const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
//         const durationMinutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
//         return <p className='text-sm'>{durationHours > 0 ? `${durationHours}h ` : ''}{durationMinutes > 0 ? `${durationMinutes}min` : '0min'}</p>;
//       }
//     },
//     { 
//       title: "Reclassé par", 
//       dataIndex: "reclassifiedBy", 
//       width: "200px", 
//       render: v => <p className='text-sm capitalize'>{employees.find(e => e.value === v)?.name || v || "--"}</p> 
//     },
//     {
//       title: "Statut", 
//       dataIndex: "status", 
//       fixed: "right", 
//       width: "150px", 
//       render: v => (
//         <div className={`${v === "UNDER_MAINTENANCE" ? "border-yellow-500 bg-yellow-300" : v === "CLOSED" ? "border-green-500 bg-green-300" : ""} p-2 rounded-lg border`}>
//           {INCIDENT_STATUS[v] || "Unknown Status"}
//         </div>
//       )
//     },
//     {
//       title: "Action", 
//       dataIndex: "", 
//       fixed: "right", 
//       width: "75px", 
//       render: (_, record) => (
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="ghost" className="h-8 w-8 p-0">
//               <span className="sr-only">Open menu</span>
//               <MoreHorizontal />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end">
//             <DropdownMenuLabel>Actions</DropdownMenuLabel>
//             <DropdownMenuSeparator />
            
//             {/* Voir détails - Toujours disponible */}
//             <DropdownMenuItem 
//               className="flex gap-2 items-center cursor-pointer"
//               onClick={() => handleOpenDetails(record)}
//             >
//               <EyeIcon className='h-4 w-6' />
//               <span>Voir détails</span>
//             </DropdownMenuItem>
            
//             {/* Actions pour incidents clôturés */}
//             {record.status === "CLOSED" && (
//               <>
//                 <DropdownMenuSeparator />
//                 {/* Reclasser - tous les utilisateurs peuvent reclasser les incidents de leur domaine */}
//                 {canReclassifyIncident(record) && (
//                   <DropdownMenuItem 
//                     className="flex gap-2 items-center cursor-pointer"
//                     onClick={() => handleOpenReclassify(record)}
//                   >
//                     <PencilSquareIcon className='h-4 w-6'/>
//                     <span>Reclasser</span>
//                   </DropdownMenuItem>
//                 )}
//               </>
//             )}
            
//             {/* Actions pour incidents en attente */}
//             {record.status === "PENDING" && (
//               <>
//                 {/* Mettre en maintenance - seulement IT et Maintenance (et privilégiés) */}
//                 {canPutIntoMaintenance(record) && (
//                   <>
//                     <DropdownMenuSeparator />
//                     <DropdownMenuItem className="flex gap-2 items-center cursor-pointer">
//                       <button 
//                         className='flex items-center space-x-2'
//                         onClick={() => handleOpenMaintenance(record)}
//                       >
//                         <ExclamationTriangleIcon />
//                         <span>Mettre en maintenance</span>
//                       </button>
//                     </DropdownMenuItem>
//                   </>
//                 )}
    
//                 {/* Clôturer l'incident - tous les utilisateurs peuvent clôturer les incidents de leur domaine */}
//                 {canCloseIncident(record) && (
//                   <>
//                     <DropdownMenuSeparator />
//                     <DropdownMenuItem className="flex gap-2 items-center cursor-pointer">
//                       <button 
//                         className='flex items-center space-x-2'
//                         onClick={() => {
//                           setModalIsOpen(true);
//                           setSelectedIncident(record.id);
//                           setRowSelection(record);
//                         }}
//                       >
//                         <XMarkIcon />
//                         <span>Clôturer l'incident</span>
//                       </button>
//                     </DropdownMenuItem>
//                   </>
//                 )}
//               </>
//             )}
    
//             <DropdownMenuSeparator />
            
//             {/* Supprimer - avec vérification de permission */}
//             <VerifyPermission functions={permissions} roles={roles} expected={['incident__can_delete_incident']}>
//               <DropdownMenuItem 
//                 className="flex gap-2 items-center cursor-pointer text-red-600"
//                 onClick={async () => {
//                   if (!window.confirm("Voulez-vous vraiment supprimer cet incident ?")) return;
//                   try {
//                     await handlePost(`${URLS.INCIDENT_API}/incidents/${record.id}`, { method: "DELETE" });
//                     toast.success("Incident supprimé avec succès");
//                     fetchData();
//                   } catch (error) {
//                     console.error(error);
//                     toast.error("Erreur lors de la suppression");
//                   }
//                 }}
//               >
//                 <TrashIcon className='h-4 w-6' />
//                 <span>Supprimer</span>
//               </DropdownMenuItem>
//             </VerifyPermission>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       ),
//     }
//   ];

//   return (
//     <div>
//       {loading && <Preloader />}
      
//       {/* Indicateur de domaine utilisateur avec informations détaillées */}
//       {userDomain && (
//         <div className="mb-4 p-4 bg-gray-50 rounded-lg border">
//           <div className="flex items-center gap-2 mb-2">
//             <span className="text-sm font-medium">Statut utilisateur :</span>
//             <span className={`px-3 py-1 rounded-full text-sm font-medium ${
//               userDomain === "PRIVILEGED" ? "bg-purple-100 text-purple-800 border border-purple-200" :
//               userDomain === "IT" ? "bg-blue-100 text-blue-800 border border-blue-200" :
//               userDomain === "HSE" ? "bg-red-100 text-red-800 border border-red-200" :
//               userDomain === "OPERATIONS" ? "bg-green-100 text-green-800 border border-green-200" :
//               userDomain === "MAINTENANCE" ? "bg-yellow-100 text-yellow-800 border border-yellow-200" :
//               "bg-gray-100 text-gray-800 border border-gray-200"
//             }`}>
//               {userDomain === "PRIVILEGED" ? "Privilégié (Admin/Manager/DEX)" : userDomain}
//             </span>
//           </div>
          
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
//             <div className="p-2 bg-white rounded border">
//               <p className="font-medium mb-1">Clôture incidents :</p>
//               <p className={canCloseIncident({ status: "PENDING", equipement: [] }) ? "text-green-600" : "text-gray-600"}>
//                 {userDomain === "PRIVILEGED" 
//                   ? "✓ Tous domaines" 
//                   : canCloseIncident({ status: "PENDING", equipement: [] }) 
//                     ? `✓ Domaine ${userDomain}` 
//                     : "✗ Non autorisé"}
//               </p>
//             </div>
            
//             <div className="p-2 bg-white rounded border">
//               <p className="font-medium mb-1">Reclassement incidents :</p>
//               <p className={canReclassifyIncident({ status: "CLOSED", equipement: [] }) ? "text-green-600" : "text-gray-600"}>
//                 {userDomain === "PRIVILEGED" 
//                   ? "✓ Tous domaines" 
//                   : canReclassifyIncident({ status: "CLOSED", equipement: [] }) 
//                     ? `✓ Domaine ${userDomain}` 
//                     : "✗ Non autorisé"}
//               </p>
//             </div>
            
//             <div className="p-2 bg-white rounded border">
//               <p className="font-medium mb-1">Mise en maintenance :</p>
//               <p className={canPutIntoMaintenance({ status: "PENDING", equipement: [] }) ? "text-green-600" : "text-gray-600"}>
//                 {userDomain === "PRIVILEGED" 
//                   ? "✓ Tous domaines" 
//                   : userDomain === "IT" || userDomain === "MAINTENANCE"
//                     ? `✓ Domaine ${userDomain}`
//                     : "✗ IT/Maintenance uniquement"}
//               </p>
//             </div>
//           </div>
          
//           <div className="mt-2 text-xs text-gray-500">
//             <p>Rôles détectés: {roles.join(', ') || 'Aucun rôle'}</p>
//             <p>Permissions: {permissions.filter(p => p.includes('incident')).join(', ') || 'Aucune permission incident'}</p>
//           </div>
//         </div>
//       )}
      
//       <Table
//         columns={columns}
//         dataSource={dataList}
//         pagination={pagination}
//         rowKey="id"
//         scroll={{ x: 2500 }}
//         loading={loading}
//       />

//       {/* Modal Mettre en maintenance */}
//       <Dialog open={isOpen} onOpenChange={setIsOpen}>
//         <DialogContent className="max-w-2xl">
//           <DialogHeader>
//             <DialogTitle className="flex items-center gap-2">
//               <Cog6ToothIcon className='h-5 w-5'/>
//               <span>Mettre en maintenance</span>
//             </DialogTitle>
//             <DialogDescription>
//               Sélectionnez le type de maintenance et décrivez les travaux à effectuer
//             </DialogDescription>
//           </DialogHeader>
          
//           <form onSubmit={(e) => {
//             e.preventDefault();
//             const formData = new FormData(e.target);
//             const data = {
//               maintenance: formData.get('maintenance'),
//               incidentId: formData.get('incidentId'),
//               hasStoppedOperations: formData.get('hasStoppedOperations') === 'on'
//             };
//             submitMaintenance(data);
//           }} className="space-y-4">
            
//             <div className='flex flex-col'>
//               <label htmlFor="maintenance-type" className='text-sm font-semibold mb-2'>
//                 Type de maintenance <span className='text-red-500'>*</span>
//               </label>
//               <select 
//                 id="maintenance-type"
//                 name="maintenance"
//                 className='border rounded-lg w-full p-2' 
//                 required
//               >
//                 <option value="">Choisir le type de maintenance</option>
//                 <option value="CORRECTION">CORRECTIF</option>
//                 <option value="PALLIATIVE">PALIATIF</option>
//                 <option value="CURATIVE">CURATIF</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-semibold mb-2">
//                 Type d'incident <span className='text-red-500'>*</span>
//               </label>
//               <AutoComplete
//                 placeholder="Rechercher un type d'incident..."
//                 isLoading={isLoadingTypes}
//                 dataList={incidentTypes}
//                 onSearch={handleSearchIncidentTypes}
//                 onSelect={handleSelectIncidentType}
//               />
//               <input
//                 type="hidden"
//                 name="incidentId"
//                 id="incidentId"
//               />
//             </div>

//             <div className='bg-gray-50 rounded-lg p-4'>
//               <label className='flex items-center space-x-2 cursor-pointer'>
//                 <input
//                   type="checkbox"
//                   name="hasStoppedOperations"
//                   className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500'
//                 />
//                 <span className='font-semibold text-sm'>L'incident a causé un arrêt des opérations</span>
//               </label>
//             </div>

//             <div className='flex flex-col'>
//               <label htmlFor="maintenance-description" className='text-sm font-semibold mb-2'>
//                 Description des travaux <span className='text-red-500'>*</span>
//               </label>
//               <textarea 
//                 id="maintenance-description"
//                 className='border rounded-lg p-2 w-full' 
//                 placeholder='Décrivez en détail les travaux de maintenance à effectuer...'
//                 value={description}
//                 onChange={(e)=>setDescription(e.target.value)}
//                 required
//                 rows={4}
//               />
//               {!description && (
//                 <p className='text-xs text-red-500 mt-1'>La description est obligatoire</p>
//               )}
//             </div>

//             <DialogFooter className="flex gap-2 pt-4">
//               <Button 
//                 type="button" 
//                 variant="outline" 
//                 onClick={() => setIsOpen(false)}
//                 disabled={isSubmitting}
//               >
//                 Annuler
//               </Button>
//               <Button 
//                 type="submit" 
//                 className={`flex gap-2 text-white hover:bg-secondary ${
//                   isSubmitting ? "bg-blue-300 cursor-not-allowed" : "bg-primary"
//                 }`}
//                 disabled={isSubmitting || !description}
//               >
//                 {isSubmitting ? <Preloader size={20}/> : <CheckCircle />}
//                 <span>{isSubmitting ? "En cours..." : "Démarrer la maintenance"}</span>
//               </Button>  
//             </DialogFooter>
//           </form>
//         </DialogContent>
//       </Dialog>

//       {/* Modal Clôturer l'incident */}
//       <CloseIncidentForm
//         isOpen={modalIsOpen}
//         setIsOpen={setModalIsOpen}
//         fetchData={fetchData}
//         selectedRow={rowSelection}
//       />

//       {/* Modal Voir détails */}
//       <Dialog open={isOpenDetails} onOpenChange={setIsOpenDetails}>
//         <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
//           <DialogHeader className="flex flex-row items-center justify-between border-b pb-4">
//             <div>
//               <DialogTitle className="text-xl font-bold flex items-center gap-2">
//                 <EyeIcon className="h-5 w-5 text-blue-600" />
//                 Détails de l'incident
//               </DialogTitle>
//               <DialogDescription className="mt-1">
//                 Informations complètes sur l'incident #{selectedIncidentData?.numRef}
//               </DialogDescription>
//             </div>
//           </DialogHeader>

//           <div className="space-y-6 py-4">
//             {/* Section Informations principales */}
//             <div className="bg-blue-50 rounded-lg p-4">
//               <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
//                 <InformationCircleIcon className="h-4 w-4" />
//                 Informations principales
//               </h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 <div className="space-y-2">
//                   <InfoItem label="No Ref" value={selectedIncidentData?.numRef} />
//                   <InfoItem label="Statut" value={
//                     <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
//                       selectedIncidentData?.status === "CLOSED" ? "bg-green-100 text-green-800" :
//                       selectedIncidentData?.status === "UNDER_MAINTENANCE" ? "bg-yellow-100 text-yellow-800" :
//                       "bg-red-100 text-red-800"
//                     }`}>
//                       {INCIDENT_STATUS[selectedIncidentData?.status] || "Inconnu"}
//                     </span>
//                   } />
//                   <InfoItem label="Arrêt opération" value={
//                     selectedIncidentData?.hasStoppedOperations ? 
//                       <span className="text-red-600 font-medium">Oui</span> : 
//                       <span className="text-green-600">Non</span>
//                   } />
//                 </div>
//                 <div className="space-y-2">
//                   <InfoItem label="Site" value={sitesMap.get(selectedIncidentData?.siteId) || "--"} />
//                   <InfoItem label="Quart" value={shifts.find(s => s.value === selectedIncidentData?.shiftId)?.name || "--"} />
//                   <InfoItem label="Équipement" value={
//                     selectedIncidentData?.equipement?.title || 
//                     (Array.isArray(selectedIncidentData?.equipement) ? selectedIncidentData?.equipement[0]?.title : "") || 
//                     "--"
//                   } />
//                 </div>
//                 <div className="space-y-2">
//                   <InfoItem label="Type incident" value={selectedIncidentData?.incident?.name || "--"} />
//                   <InfoItem label="Cause incident" value={incidentCauses.find(c => c.value === selectedIncidentData?.incidentCauseId)?.name || "--"} />
//                   {selectedIncidentData?.equipement && (
//                     <InfoItem 
//                       label="Domaine" 
//                       value={
//                         <span className={`inline-block text-xs px-2 py-1 rounded-full ${
//                           getEquipmentDomain(selectedIncidentData?.equipement) === "IT" ? "bg-blue-100 text-blue-800" :
//                           getEquipmentDomain(selectedIncidentData?.equipement) === "HSE" ? "bg-red-100 text-red-800" :
//                           getEquipmentDomain(selectedIncidentData?.equipement) === "OPERATIONS" ? "bg-green-100 text-green-800" :
//                           getEquipmentDomain(selectedIncidentData?.equipement) === "MAINTENANCE" ? "bg-yellow-100 text-yellow-800" :
//                           "bg-gray-100 text-gray-800"
//                         }`}>
//                           {getEquipmentDomain(selectedIncidentData?.equipement) || "--"}
//                         </span>
//                       } 
//                     />
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Description */}
//             <div className="bg-white border rounded-lg p-4">
//               <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
//                 <DocumentTextIcon className="h-4 w-4" />
//                 Description
//               </h3>
//               <div className="bg-gray-50 rounded p-3 min-h-[80px]">
//                 <p className="text-gray-700 whitespace-pre-wrap">
//                   {selectedIncidentData?.description || "Aucune description fournie"}
//                 </p>
//               </div>
//             </div>

//             {/* Section Dates */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div className="bg-white border rounded-lg p-4">
//                 <h3 className="font-semibold text-gray-900 mb-2 text-sm">Date de création</h3>
//                 <p className="text-gray-600">
//                   {selectedIncidentData?.creationDate ? 
//                     new Date(selectedIncidentData.creationDate).toLocaleString('fr-FR') : "--"
//                   }
//                 </p>
//               </div>
              
//               {selectedIncidentData?.closedManuDate && (
//                 <div className="bg-white border rounded-lg p-4">
//                   <h3 className="font-semibold text-gray-900 mb-2 text-sm">Date de clôture manuelle</h3>
//                   <p className="text-gray-600">
//                     {new Date(selectedIncidentData.closedManuDate).toLocaleString('fr-FR')}
//                   </p>
//                 </div>
//               )}
              
//               {selectedIncidentData?.closedDate && (
//                 <div className="bg-white border rounded-lg p-4">
//                   <h3 className="font-semibold text-gray-900 mb-2 text-sm">Date de clôture système</h3>
//                   <p className="text-gray-600">
//                     {new Date(selectedIncidentData.closedDate).toLocaleString('fr-FR')}
//                   </p>
//                 </div>
//               )}
//             </div>

//             {/* Section Intervenants */}
//             <div className="bg-white border rounded-lg p-4">
//               <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
//                 <UserGroupIcon className="h-4 w-4" />
//                 Intervenants
//               </h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <InfoItem 
//                   label="Initiateur" 
//                   value={employees.find(e => e.value === selectedIncidentData?.createdBy)?.name || selectedIncidentData?.createdBy || "--"} 
//                 />
//                 <InfoItem 
//                   label="Intervenant" 
//                   value={
//                     employees.find(e => e.value === selectedIncidentData?.technician)?.name ||
//                     externalEntities.find(e => e.value === selectedIncidentData?.technician)?.name ||
//                     selectedIncidentData?.technician || "--"
//                   } 
//                 />
//                 {selectedIncidentData?.closedBy && (
//                   <InfoItem 
//                     label="Clôturé par" 
//                     value={employees.find(e => e.value === selectedIncidentData?.closedBy)?.name || selectedIncidentData?.closedBy || "--"} 
//                   />
//                 )}
//                 {selectedIncidentData?.reclassifiedBy && (
//                   <InfoItem 
//                     label="Reclassé par" 
//                     value={employees.find(e => e.value === selectedIncidentData?.reclassifiedBy)?.name || selectedIncidentData?.reclassifiedBy || "--"} 
//                   />
//                 )}
//               </div>
//             </div>

//             {/* Section Photos */}
//             {selectedIncidentData?.photos && selectedIncidentData.photos.length > 0 ? (
//               <div className="bg-white border rounded-lg p-4">
//                 <div className="flex justify-between items-center mb-4">
//                   <h3 className="font-semibold text-gray-900 flex items-center gap-2">
//                     <CameraIcon className="h-4 w-4" />
//                     Photos associées ({selectedIncidentData.photos.length})
//                   </h3>
//                 </div>
                
//                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//                   {selectedIncidentData.photos.map((photo, index) => (
//                     <div key={photo.id} className="group relative border rounded-lg overflow-hidden bg-gray-50 hover:shadow-md transition-shadow">
//                       <SecureImage
//                         src={photo.url}
//                         alt={`Photo ${index + 1} de l'incident ${selectedIncidentData?.numRef}`}
//                         className="w-full h-32 object-cover cursor-pointer group-hover:opacity-90 transition-opacity"
//                       />
//                       <div className="p-2 text-xs text-center bg-white border-t">
//                         <p className="font-medium">Photo {index + 1}</p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             ) : (
//               <div className="bg-gray-50 rounded-lg p-6 text-center">
//                 <CameraIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
//                 <p className="text-gray-500">Aucune photo associée à cet incident</p>
//               </div>
//             )}
//           </div>

//           <DialogFooter className="border-t pt-4">
//             <div className="flex justify-between items-center w-full">
//               <div className="text-sm text-gray-500">
//                 Dernière mise à jour: {selectedIncidentData?.updatedAt ? 
//                   new Date(selectedIncidentData.updatedAt).toLocaleString('fr-FR') : 
//                   new Date().toLocaleString('fr-FR')
//                 }
//               </div>
//               <div className="flex gap-2">
//                 <Button 
//                   variant="outline" 
//                   onClick={() => setIsOpenDetails(false)}
//                   className="flex items-center gap-2"
//                 >
//                   <XMarkIcon className="h-4 w-4" />
//                   Fermer
//                 </Button>
//               </div>
//             </div>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Modal Modifier incident */}
//       <Dialog open={isOpenReclassify} onOpenChange={setIsOpenReclassify}>
//         <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
//           <DialogHeader className="flex-shrink-0">
//             <DialogTitle className="flex items-center gap-2">
//               <PencilSquareIcon className="h-5 w-5" />
//               Reclasser l'incident #{selectedIncidentData?.numRef} 
//             </DialogTitle>
//             <DialogDescription>
//               Modifier la classification de cet incident
//             </DialogDescription>
//           </DialogHeader>
          
//           <div className="flex-1 overflow-y-auto pr-2 -mr-2">
//             <form 
//               onSubmit={handleSubmit(submitReclassify)} 
//               className="space-y-6 pb-4"
//             >
//               {/* Site - Lecture seule */}
//               <div>
//                 <label className="block text-sm font-semibold mb-2">
//                   Site
//                 </label>
//                 <div className="p-2 border border-gray-300 rounded-md bg-gray-50">
//                   <p className="text-gray-700">
//                     {sitesMap.get(selectedIncidentData?.siteId) || "Site non spécifié"}
//                   </p>
//                 </div>
//                 <p className="text-xs text-gray-500 mt-1">
//                   Le site ne peut pas être modifié lors du reclassement
//                 </p>
//               </div>

//               {/* Équipement */}
//               <div>
//                 <label className="block text-sm font-semibold mb-2">
//                   Équipement <span className="text-red-500">*</span>
//                 </label>
//                 <AutoComplete
//                   placeholder="Rechercher un équipement..."
//                   isLoading={isEquipementLoading}
//                   dataList={equipments}
//                   onSearch={(input) => {
//                     handleSearchEquipements(input);
//                   }}
//                   onSelect={(item) => {
//                     if (item) {
//                       setValue("equipementId", item.value, { shouldValidate: true });
                      
//                       // Obtenir le domaine du nouvel équipement et charger les types d'incident correspondants
//                       getEquipmentDomainFromId(item.value).then(equipmentDomain => {
//                         console.log("Domaine obtenu pour équipement:", equipmentDomain);
//                         handleFetchIncidentTypes("", equipmentDomain);
//                       });
                      
//                       // Réinitialiser le type d'incident et la cause
//                       setValue("incidentId", "");
//                       setValue("incidentCauseId", "");
//                     } else {
//                       setValue("equipementId", "");
//                       // Si pas d'équipement, charger tous les types d'incident
//                       handleFetchIncidentTypes("", null);
//                       setValue("incidentId", "");
//                       setValue("incidentCauseId", "");
//                     }
//                   }}
//                   initialValue={reclassifyFields.equipementId ? 
//                     equipments.find(e => e.value === reclassifyFields.equipementId) : null}
//                 />
//                 {errors.equipementId && (
//                   <p className="text-red-500 text-sm mt-1">{errors.equipementId.message}</p>
//                 )}
//               </div>

//               {/* Type d'incident */}
//               <div>
//                 <label className="block text-sm font-semibold mb-2">
//                   Type d'incident <span className="text-red-500">*</span>
//                 </label>
//                 <AutoComplete
//                   placeholder="Rechercher un type d'incident..."
//                   isLoading={isLoadingTypes}
//                   dataList={incidentTypes}
//                   onSearch={(input) => {
//                     // Obtenir le domaine de l'équipement sélectionné
//                     const selectedEquipementId = watch("equipementId");
//                     let equipmentDomain = null;
                    
//                     if (selectedEquipementId) {
//                       // Obtenir le domaine de l'équipement sélectionné
//                       return getEquipmentDomainFromId(selectedEquipementId).then(domain => {
//                         console.log("Recherche types avec domaine:", domain);
//                         return handleFetchIncidentTypes(input, domain);
//                       });
//                     } else {
//                       // Si aucun équipement sélectionné, charger tous les types
//                       console.log("Recherche types sans domaine (tous)");
//                       return handleFetchIncidentTypes(input, null);
//                     }
//                   }}
//                   onSelect={(item) => {
//                     if (item) {
//                       setValue("incidentId", item.value, { shouldValidate: true });
//                       console.log("Type d'incident sélectionné:", item.value);
//                       // Recharger les causes avec le filtre du type sélectionné
//                       handleFetchIncidentCauses("", item.value);
//                       // Réinitialiser la cause sélectionnée
//                       setValue("incidentCauseId", "");
//                     } else {
//                       setValue("incidentId", "");
//                       // Si pas de type d'incident, charger toutes les causes
//                       handleFetchIncidentCauses();
//                     }
//                   }}
//                   initialValue={reclassifyFields.incidentId ? 
//                     incidentTypes.find(t => t.value === reclassifyFields.incidentId) : null}
//                 />
//                 {errors.incidentId && (
//                   <p className="text-red-500 text-sm mt-1">{errors.incidentId.message}</p>
//                 )}
//               </div>

//               {/* Cause d'incident */}
//               <div>
//                 <label className="block text-sm font-semibold mb-2">
//                   Cause d'incident <span className="text-red-500">*</span>
//                 </label>
//                 <AutoComplete
//                   placeholder="Rechercher une cause..."
//                   isLoading={false}
//                   dataList={incidentCauses}
//                   onSearch={(input) => {
//                     // Filtrer par type d'incident si sélectionné
//                     const incidentId = watch("incidentId");
//                     console.log("Recherche causes pour incidentId:", incidentId);
//                     return handleFetchIncidentCauses(input, incidentId);
//                   }}
//                   onSelect={(item) => {
//                     if (item) {
//                       setValue("incidentCauseId", item.value, { shouldValidate: true });
//                       console.log("Cause sélectionnée:", item.value);
//                     } else {
//                       setValue("incidentCauseId", "");
//                     }
//                   }}
//                   initialValue={reclassifyFields.incidentCauseId ? 
//                     incidentCauses.find(c => c.value === reclassifyFields.incidentCauseId) : null}
//                 />
//                 {errors.incidentCauseId && (
//                   <p className="text-red-500 text-sm mt-1">{errors.incidentCauseId.message}</p>
//                 )}
//               </div>

//               {/* Description - Lecture seule */}
//               <div>
//                 <label className="block text-sm font-semibold mb-2">
//                   Description originale
//                 </label>
//                 <div className="p-3 border border-gray-300 rounded-md bg-gray-50">
//                   <p className="text-gray-700 whitespace-pre-wrap">
//                     {selectedIncidentData?.description || "Aucune description"}
//                   </p>
//                 </div>
//                 <p className="text-xs text-gray-500 mt-1">
//                   La description originale est conservée
//                 </p>
//               </div>

//               <div className="flex gap-2 pt-6 border-t">
//                 <Button 
//                   type="button" 
//                   variant="outline" 
//                   onClick={() => setIsOpenReclassify(false)}
//                   disabled={isSubmitting}
//                   className="flex-1"
//                 >
//                   Annuler
//                 </Button>
//                 <Button 
//                   type="submit" 
//                   className="flex gap-2 text-white hover:bg-secondary bg-primary flex-1"
//                   disabled={isSubmitting || !watch("equipementId") || !watch("incidentId") || !watch("incidentCauseId")}
//                 >
//                   {isSubmitting ? (
//                     <>
//                       <Preloader size={16} />
//                       Reclassement...
//                     </>
//                   ) : (
//                     <>
//                       <CheckCircle className="h-4 w-4" />
//                       Confirmer le reclassement
//                     </>
//                   )}
//                 </Button>
//               </div>
//             </form>
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* Modal Reclasser incident */}
//       <Dialog open={isOpenReclassify} onOpenChange={setIsOpenReclassify}>
//         <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
//           <DialogHeader className="flex-shrink-0">
//             <DialogTitle className="flex items-center gap-2">
//               <PencilSquareIcon className="h-5 w-5" />
//               Reclasser l'incident #{selectedIncidentData?.numRef} 
//             </DialogTitle>
//             <DialogDescription>
//               Modifier la classification de cet incident
//             </DialogDescription>
//           </DialogHeader>
          
//           <div className="flex-1 overflow-y-auto pr-2 -mr-2">
//             <form 
//               onSubmit={handleSubmit(submitReclassify)} 
//               className="space-y-6 pb-4"
//             >
//               {/* Site - Lecture seule */}
//               <div>
//                 <label className="block text-sm font-semibold mb-2">
//                   Site
//                 </label>
//                 <div className="p-2 border border-gray-300 rounded-md bg-gray-50">
//                   <p className="text-gray-700">
//                     {sitesMap.get(selectedIncidentData?.siteId) || "Site non spécifié"}
//                   </p>
//                 </div>
//                 <p className="text-xs text-gray-500 mt-1">
//                   Le site ne peut pas être modifié lors du reclassement
//                 </p>
//               </div>

//               {/* Équipement */}
//               <div>
//                 <label className="block text-sm font-semibold mb-2">
//                   Équipement <span className="text-red-500">*</span>
//                 </label>
//                 <AutoComplete
//                   placeholder="Rechercher un équipement..."
//                   isLoading={isEquipementLoading}
//                   dataList={equipments}
//                   onSearch={(input) => {
//                     handleSearchEquipements(input);
//                   }}
//                   onSelect={(item) => {
//                     if (item) {
//                       setValue("equipementId", item.value, { shouldValidate: true });
                      
//                       // Obtenir le domaine du nouvel équipement et charger les types d'incident correspondants
//                       getEquipmentDomainFromId(item.value).then(equipmentDomain => {
//                         handleFetchIncidentTypes("", equipmentDomain);
//                       });
                      
//                       // Réinitialiser le type d'incident et la cause
//                       setValue("incidentId", "");
//                       setValue("incidentCauseId", "");
//                     } else {
//                       setValue("equipementId", "");
//                       // Si pas d'équipement, charger tous les types d'incident
//                       handleFetchIncidentTypes("", null);
//                       setValue("incidentId", "");
//                       setValue("incidentCauseId", "");
//                     }
//                   }}
//                   initialValue={reclassifyFields.equipementId ? 
//                     equipments.find(e => e.value === reclassifyFields.equipementId) : null}
//                 />
//                 {errors.equipementId && (
//                   <p className="text-red-500 text-sm mt-1">{errors.equipementId.message}</p>
//                 )}
//               </div>

//               {/* Type d'incident */}
//               <div>
//                 <label className="block text-sm font-semibold mb-2">
//                   Type d'incident <span className="text-red-500">*</span>
//                 </label>
//                 <AutoComplete
//                   placeholder="Rechercher un type d'incident..."
//                   isLoading={isLoadingTypes}
//                   dataList={incidentTypes}
//                   onSearch={(input) => {
//                     // Obtenir le domaine de l'équipement sélectionné
//                     const selectedEquipementId = watch("equipementId");
//                     let equipmentDomain = null;
                    
//                     if (selectedEquipementId) {
//                       // Obtenir le domaine de l'équipement sélectionné
//                       return getEquipmentDomainFromId(selectedEquipementId).then(domain => {
//                         return handleFetchIncidentTypes(input, domain);
//                       });
//                     } else {
//                       // Si aucun équipement sélectionné, charger tous les types
//                       return handleFetchIncidentTypes(input, null);
//                     }
//                   }}
//                   onSelect={(item) => {
//                     if (item) {
//                       setValue("incidentId", item.value, { shouldValidate: true });
//                       // Recharger les causes avec le filtre du type sélectionné
//                       handleFetchIncidentCauses("", item.value);
//                       // Réinitialiser la cause sélectionnée
//                       setValue("incidentCauseId", "");
//                     } else {
//                       setValue("incidentId", "");
//                       // Si pas de type d'incident, charger toutes les causes
//                       handleFetchIncidentCauses();
//                     }
//                   }}
//                   initialValue={reclassifyFields.incidentId ? 
//                     incidentTypes.find(t => t.value === reclassifyFields.incidentId) : null}
//                 />
//                 {errors.incidentId && (
//                   <p className="text-red-500 text-sm mt-1">{errors.incidentId.message}</p>
//                 )}
//               </div>

//               {/* Cause d'incident */}
//               <div>
//                 <label className="block text-sm font-semibold mb-2">
//                   Cause d'incident <span className="text-red-500">*</span>
//                 </label>
//                 <AutoComplete
//                   placeholder="Rechercher une cause..."
//                   isLoading={false}
//                   dataList={incidentCauses}
//                   onSearch={(input) => {
//                     // Filtrer par type d'incident si sélectionné
//                     const incidentId = watch("incidentId");
//                     return handleFetchIncidentCauses(input, incidentId);
//                   }}
//                   onSelect={(item) => {
//                     if (item) {
//                       setValue("incidentCauseId", item.value, { shouldValidate: true });
//                     } else {
//                       setValue("incidentCauseId", "");
//                     }
//                   }}
//                   initialValue={reclassifyFields.incidentCauseId ? 
//                     incidentCauses.find(c => c.value === reclassifyFields.incidentCauseId) : null}
//                 />
//                 {errors.incidentCauseId && (
//                   <p className="text-red-500 text-sm mt-1">{errors.incidentCauseId.message}</p>
//                 )}
//               </div>

//               {/* Description - Lecture seule */}
//               <div>
//                 <label className="block text-sm font-semibold mb-2">
//                   Description originale
//                 </label>
//                 <div className="p-3 border border-gray-300 rounded-md bg-gray-50">
//                   <p className="text-gray-700 whitespace-pre-wrap">
//                     {selectedIncidentData?.description || "Aucune description"}
//                   </p>
//                 </div>
//                 <p className="text-xs text-gray-500 mt-1">
//                   La description originale est conservée
//                 </p>
//               </div>

//               <div className="flex gap-2 pt-6 border-t">
//                 <Button 
//                   type="button" 
//                   variant="outline" 
//                   onClick={() => setIsOpenReclassify(false)}
//                   disabled={isSubmitting}
//                   className="flex-1"
//                 >
//                   Annuler
//                 </Button>
//                 <Button 
//                   type="submit" 
//                   className="flex gap-2 text-white hover:bg-secondary bg-primary flex-1"
//                   disabled={isSubmitting || !watch("equipementId") || !watch("incidentId") || !watch("incidentCauseId")}
//                 >
//                   {isSubmitting ? (
//                     <>
//                       <Preloader size={16} />
//                       Reclassement...
//                     </>
//                   ) : (
//                     <>
//                       <CheckCircle className="h-4 w-4" />
//                       Confirmer le reclassement
//                     </>
//                   )}
//                 </Button>
//               </div>
//             </form>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default Datalist;

// Datalist.jsx - Version avec règles de domaine corrigées
import { useEffect, useState, useCallback, useRef, useContext } from 'react';
import { Button } from '../ui/button';
import { useForm } from 'react-hook-form';
import { INCIDENT_STATUS } from '../../utils/constant.utils';
import { Table } from 'antd';
import { useFetch } from '../../hooks/useFetch';
import toast from 'react-hot-toast';
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
} from "../ui/dropdown-menu";
import { CheckCircle, MoreHorizontal } from "lucide-react";
import VerifyPermission from '../../utils/verifyPermission';
import { Cog6ToothIcon } from '@heroicons/react/24/solid';
import Preloader from '../Preloader';
import { getEmployee } from '../../utils/entity.utils';
import CloseIncidentForm from './CloseIncidentForm';
import { AUTHCONTEXT } from '../../contexts/AuthProvider';

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
    if (imageUrl && imageUrl.startsWith('blob:')) {
      const win = window.open(imageUrl, '_blank');
      if (!win) {
        alert('Popup bloquée. Veuillez autoriser les popups.');
      }
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
  const [isOpen, setIsOpen] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [isOpenDetails, setIsOpenDetails] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [editFields, setEditFields] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedIncidentData, setSelectedIncidentData] = useState(null);
  const [incidentTypes, setIncidentTypes] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [isEquipementLoading, setIsEquipementLoading] = useState(false);
  const [isLoadingTypes, setIsLoadingTypes] = useState(false);
  const [isOpenReclassify, setIsOpenReclassify] = useState(false);
  const [reclassifyFields, setReclassifyFields] = useState({});
  const [userDomain, setUserDomain] = useState("");
  
  const authContext = useContext(AUTHCONTEXT);

  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm();
  
  const { handleFetch, handlePost, handlePatch } = useFetch();

  const getEquipmentDomainFromRecord = (record) => {
    if (!record?.equipement) return null;
    
    const equipmentObj = Array.isArray(record.equipement) ? record.equipement[0] : record.equipement;
    
    if (equipmentObj && equipmentObj.equipmentGroup && equipmentObj.equipmentGroup.equipmentGroupFamily) {
      return equipmentObj.equipmentGroup.equipmentGroupFamily.domain;
    }
    
    return null;
  };

  // Fonction pour extraire le domaine d'un équipement
  const getEquipmentDomain = useCallback((equipement) => {
    if (!equipement) {
      return null;
    }
    
    const equipmentObj = Array.isArray(equipement) ? equipement[0] : equipement;
    
    if (equipmentObj && equipmentObj.equipmentGroup && equipmentObj.equipmentGroup.equipmentGroupFamily) {
      return equipmentObj.equipmentGroup.equipmentGroupFamily.domain;
    }
    
    return null;
  }, []);

  // Fonction pour obtenir le domaine d'un équipement par son ID
  const getEquipmentDomainFromId = useCallback(async (equipmentId) => {
    if (!equipmentId) return null;
    
    try {
      // Si on a déjà l'équipement dans selectedIncidentData
      if (selectedIncidentData?.equipement) {
        const currentDomain = getEquipmentDomain(selectedIncidentData.equipement);
        if (currentDomain) return currentDomain;
      }
      
      // Sinon, charger l'équipement
      const response = await handleFetch(`${URLS.INCIDENT_API}/equipements/${equipmentId}`);
      
      if (response?.status === 200 && response.data) {
        const equipment = response.data;
        if (equipment.equipmentGroup && equipment.equipmentGroup.equipmentGroupFamily) {
          return equipment.equipmentGroup.equipmentGroupFamily.domain;
        }
      }
      return null;
    } catch (error) {
      console.error("Erreur récupération domaine équipement:", error);
      return null;
    }
  }, [handleFetch, selectedIncidentData, getEquipmentDomain]);

  // Fonction pour obtenir le domaine de l'utilisateur à partir de ses rôles
  const getUserDomainFromRoles = useCallback((rolesArray) => {
    if (!rolesArray || !Array.isArray(rolesArray)) return null;
    
    // Normaliser : minuscules + retirer espaces/underscores pour comparaison
    const normalizedRoles = rolesArray.map(role => 
      role.toLowerCase().replace(/[\s_-]/g, '')
    );
    
    // Vérifier d'abord les rôles privilégiés (Admin, Manager, DEX)
    const privilegedRoles = ['admin', 'manager', 'dex'];
    const hasPrivilegedRole = privilegedRoles.some(privilegedRole => 
      normalizedRoles.some(role => role.includes(privilegedRole))
    );
    
    if (hasPrivilegedRole) {
      return "PRIVILEGED";
    }
    
    // Vérifier les domaines spécifiques (ordre d'importance)
    const maintenanceKeywords = ['responsabletechnique', 'maintenancetechnician', 'maintenancier', 'technicienmaintenance'];
    if (normalizedRoles.some(role => maintenanceKeywords.some(keyword => role.includes(keyword)))) {
      return "MAINTENANCE";
    }
    
    const itKeywords = ['responsableit', 'ittechnician', 'technicienit','it'];
    if (normalizedRoles.some(role => itKeywords.some(keyword => role.includes(keyword)))) {
      return "IT";
    }
    
    const operationsKeywords = ['rop', 'customermanager'];
    if (normalizedRoles.some(role => operationsKeywords.some(keyword => role.includes(keyword)))) {
      return "OPERATIONS";
    }
    
    const hseKeywords = ['hsesupervisor', 'coordonnateurhse', 'responsablehse', 'hse'];
    if (normalizedRoles.some(role => hseKeywords.some(keyword => role.includes(keyword)))) {
      return "HSE";
    }
    
    return null;
}, []);

  // NOUVELLE FONCTION : Vérifier si un rôle donne la permission automatique
  const canPerformActionBasedOnRole = useCallback((action, normalizedRoles, incidentDomain) => {
    if (!incidentDomain) return false;
    
    // Matrice des rôles par domaine et action
    const roleMatrix = {
      CLOSE: {
        MAINTENANCE: ['responsable technique', 'maintenance technician', 'maintenancier', 'technicien maintenance'],
        IT: ['responsable it', 'it technician', 'technicien it', 'it', 'administrateur système'],
        HSE: ['hse supervisor', 'coordonnateur hse', 'responsable hse', 'hse'],
        OPERATIONS: ['rop', 'coordo', 'coordinator', 'customer manager', 'responsable opérations']
      },
      RECLASSIFY: {
        MAINTENANCE: ['responsable technique', 'maintenance technician', 'maintenancier', 'technicien maintenance'],
        IT: ['responsable it', 'it technician', 'technicien it', 'it', 'administrateur système'],
        HSE: ['hse supervisor', 'coordonnateur hse', 'responsable hse', 'hse'],
        OPERATIONS: ['rop', 'coordo', 'coordinator', 'customer manager', 'responsable opérations']
      },
      MAINTENANCE: {
        MAINTENANCE: ['responsable technique', 'maintenance technician', 'it', 'maintenancier', 'technicien maintenance'],
        IT: ['responsable it', 'it technician', 'technicien it', 'administrateur système']
      }
    };
    
    const rolesForAction = roleMatrix[action]?.[incidentDomain];
    if (!rolesForAction) return false;
    
    // Vérifier si l'utilisateur a un de ces rôles
    return rolesForAction.some(role => 
      normalizedRoles.some(userRole => userRole.includes(role))
    );
  }, []);

  // Fonction pour vérifier si l'utilisateur peut clôturer un incident
  const canCloseIncident = useCallback((record) => {
    // 1. Vérifier si l'incident est déjà clôturé
    if (record.status === "CLOSED") return false;
    
    // 2. Vérifier si l'incident a un équipement
    if (!record.equipement) return false;
    
    // 3. Obtenir le domaine de l'incident
    const incidentDomain = getEquipmentDomain(record.equipement);
    
    // 4. Normaliser les rôles pour la comparaison
    const normalizedRoles = roles.map(role => role.toLowerCase());
    
    // 5. Vérifier les rôles privilégiés (Admin, Manager, DEX) - peuvent TOUJOURS clôturer
    const privilegedRoles = ['admin', 'manager', 'dex'];
    const isPrivilegedUser = privilegedRoles.some(privilegedRole => 
      normalizedRoles.some(role => role.includes(privilegedRole))
    );
    
    // 6. Les rôles privilégiés peuvent TOUJOURS clôturer
    if (isPrivilegedUser) {
      return true;
    }
    
    // 7. Vérifier si l'utilisateur a un rôle qui lui donne automatiquement la permission
    if (incidentDomain && canPerformActionBasedOnRole('CLOSE', normalizedRoles, incidentDomain)) {
      return true;
    }
    
    // 8. Sinon, vérifier la permission spécifique
    const hasExplicitPermission = permissions.includes("incident__can_close_incident");
    if (!hasExplicitPermission) return false;
    
    // 9. Vérifier la correspondance des domaines
    if (!incidentDomain || !userDomain) return false;
    return incidentDomain === userDomain;
  }, [userDomain, roles, permissions, getEquipmentDomain, canPerformActionBasedOnRole]);

  // Fonction pour vérifier si l'utilisateur peut reclasser un incident
  const canReclassifyIncident = useCallback((record) => {
    // Seuls les incidents clôturés peuvent être reclassés
    if (record.status !== "CLOSED") return false;
    
    // Vérifier si l'incident a un équipement
    if (!record.equipement) return false;
    
    // Obtenir le domaine de l'incident
    const incidentDomain = getEquipmentDomain(record.equipement);
    
    // Normaliser les rôles pour la comparaison
    const normalizedRoles = roles.map(role => role.toLowerCase());
    
    // Vérifier les rôles privilégiés (Admin, Manager, DEX) - peuvent toujours reclasser
    const privilegedRoles = ['admin', 'manager', 'dex'];
    const isPrivilegedUser = privilegedRoles.some(privilegedRole => 
      normalizedRoles.some(role => role.includes(privilegedRole))
    );
    
    // Les rôles privilégiés peuvent TOUJOURS reclasser
    if (isPrivilegedUser) {
      return true;
    }
    
    // Vérifier si l'utilisateur a un rôle qui lui donne automatiquement la permission
    if (incidentDomain && canPerformActionBasedOnRole('RECLASSIFY', normalizedRoles, incidentDomain)) {
      return true;
    }
    
    // Sinon, vérifier la permission spécifique
    const hasExplicitPermission = permissions.includes("incident__can_edit_incident");
    if (!hasExplicitPermission) return false;
    
    // Vérifier la correspondance des domaines
    if (!incidentDomain || !userDomain) return false;
    return incidentDomain === userDomain;
  }, [userDomain, roles, permissions, getEquipmentDomain, canPerformActionBasedOnRole]);

  // Fonction pour vérifier si l'utilisateur peut mettre en maintenance un incident
  const canPutIntoMaintenance = useCallback((record) => {
    // Seuls les incidents en attente peuvent être mis en maintenance
    if (record.status !== "PENDING") return false;
    
    // Vérifier si l'incident a un équipement
    if (!record.equipement) return false;
    
    // Obtenir le domaine de l'incident
    const incidentDomain = getEquipmentDomain(record.equipement);
    
    // Normaliser les rôles pour la comparaison
    const normalizedRoles = roles.map(role => role.toLowerCase());
    
    // Vérifier les rôles privilégiés (Admin, Manager, DEX) - peuvent toujours mettre en maintenance
    const privilegedRoles = ['admin', 'manager', 'dex'];
    const isPrivilegedUser = privilegedRoles.some(privilegedRole => 
      normalizedRoles.some(role => role.includes(privilegedRole))
    );
    
    // Les rôles privilégiés peuvent TOUJOURS mettre en maintenance
    if (isPrivilegedUser) {
      return true;
    }
    
    // Vérifier les rôles spécifiques pour la maintenance
    if (incidentDomain && canPerformActionBasedOnRole('MAINTENANCE', normalizedRoles, incidentDomain)) {
      return true;
    }
    
    // Vérifier la permission explicite
    const hasExplicitPermission = permissions.includes("incident__can_send_to_maintenance_incident");
    if (!hasExplicitPermission) return false;
    
    // Seuls IT et MAINTENANCE peuvent mettre en maintenance
    if (!(userDomain === "IT" || userDomain === "MAINTENANCE")) return false;
    
    return incidentDomain === userDomain;
  }, [userDomain, roles, permissions, getEquipmentDomain, canPerformActionBasedOnRole]);

  // Highlight texte recherche
  const highlightText = useCallback((text) => {
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
        return text;
    }
  }, [searchValue]);

  // Fonctions de recherche
  const handleSearchSites = async (searchInput) => {
    try {
      await handleFetchSites(`${URLS.ENTITY_API}/sites?search=${searchInput}`);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearchEquipements = async (searchInput) => {
    try {
      setIsEquipementLoading(true);
      
      let siteId = "";
      
      if (isOpenReclassify && selectedIncidentData?.siteId) {
        siteId = selectedIncidentData.siteId;
      } else if (watch("siteId")) {
        siteId = watch("siteId");
      }
      
      let url = "";
      if (siteId) {
        url = `${URLS.INCIDENT_API}/equipements/site/${siteId}`;
        if (searchInput) {
          url += `?search=${searchInput}`;
        }
      } else {
        url = `${URLS.INCIDENT_API}/equipements`;
        if (searchInput) {
          url += `?search=${searchInput}`;
        }
      }
      
      await handleFetchIncidentEquipement(url);
    } catch (error) {
      console.error("Erreur recherche équipements:", error);
    } finally {
      setIsEquipementLoading(false);
    }
  };

  const handleSearchShifts = async (searchInput) => {
    try {
      await handleFetchShifts(`${URLS.ENTITY_API}/shifts?search=${searchInput}`);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearchIncidentTypes = async (searchInput) => {
    try {
      await handleFetchIncidentTypes(`${URLS.INCIDENT_API}/incident-types?search=${searchInput}`);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearchIncidentCauses = useCallback(async (searchInput = "", incidentTypeId = null) => {
    try {
      let url = `${URLS.INCIDENT_API}/incident-causes`;
      let queryParams = [];
      
      if (searchInput) queryParams.push(`search=${searchInput}`);
      if (incidentTypeId) queryParams.push(`incidentTypeId=${incidentTypeId}`);
      
      if (queryParams.length > 0) {
        url += `?${queryParams.join('&')}`;
      }
      
      console.log("URL appelée pour causes d'incident:", url);
      
      await handleFetchIncidentCauses(url);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const handleSearchEmployees = async (searchInput) => {
    try {
      await handleFetchEmployees(`${URLS.ENTITY_API}/employees?search=${searchInput}`);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearchIntervenant = async (searchInput) => {
    try {
      await handleFetchEmployees(`${URLS.ENTITY_API}/employees?search=${searchInput}`);
      await handleFetchExternalEntities(`${URLS.ENTITY_API}/suppliers?search=${searchInput}`);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectIntervenant = (item) => {
    if (item) {
      setValue("technician", item.value);
    } else {
      setValue("technician", "");
    }
  };

  const handleSelectSite = async (item) => {
    if (item) {
      setValue("siteId", item.value);
      setValue("equipementId", "");
      
      setIsEquipementLoading(true);
      try {
        await handleFetchIncidentEquipement(`${URLS.INCIDENT_API}/equipements/site/${item.value}`);
      } catch (error) {
        console.error(error);
      } finally {
        setIsEquipementLoading(false);
      }
    } else {
      setValue("siteId", "");
      setValue("equipementId", "");
      setEquipments([]);
    }
  };

  const handleSelectEquipement = (item) => {
    if (item) {
      setValue("equipementId", item.value);
    } else {
      setValue("equipementId", "");
    }
  };

  const handleSelectShift = (item) => {
    if (item) {
      setValue("shiftId", item.value);
    } else {
      setValue("shiftId", "");
    }
  };

  const handleSelectIncidentType = (item) => {
    if (item) {
      setValue("incidentId", item.value);
      const hiddenInput = document.getElementById('incidentId');
      if (hiddenInput) {
        hiddenInput.value = item.value;
      }
    } else {
      setValue("incidentId", "");
      const hiddenInput = document.getElementById('incidentId');
      if (hiddenInput) {
        hiddenInput.value = "";
      }
    }
  };

  const handleSelectIncidentCause = (item) => {
    if (item) {
      setValue("incidentCauseId", item.value);
    } else {
      setValue("incidentCauseId", "");
    }
  };

  const handleSelectClosedBy = (item) => {
    if (item) {
      setValue("closedBy", item.value);
    } else {
      setValue("closedBy", "");
    }
  };

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
  };

  const handleFetchShifts = async (link) => {
    try {
      let response = await handleFetch(link);
      if (response?.status === 200) setShifts(response?.data.map(item => ({ name: item?.name, value: item?.id })));
    } catch (error) { console.error(error); }
  };

  const handleFetchEmployees = async (link) => {
    try {
      let response = await handleFetch(link);
      if (response?.status === 200) setEmployees(response?.data.map(item => ({ name: item?.name, value: item?.id })));
    } catch (error) { console.error(error); }
  };

  const handleFetchExternalEntities = async (link) => {
    try {
      let response = await handleFetch(link);
      if (response?.status === 200) setExternalEntities(response?.data.map(item => ({ name: item?.name, value: item?.id })));
    } catch (error) { console.error(error); }
  };

  const handleFetchMaintenanceTypes = async (link) => {
    try {
      let response = await handleFetch(link);
      if (response?.status === 200) setMaintenanceTypes(response?.data.map(item => ({ name: item?.name, value: item?.id })));
    } catch (error) { console.error(error); }
  };

  const handleFetchIncidentCauses = useCallback(async (searchInput = "", incidentTypeId = null) => {
    try {
      let url = `${URLS.INCIDENT_API}/incident-causes`;
      let queryParams = [];
      
      if (searchInput) queryParams.push(`search=${searchInput}`);
      if (incidentTypeId) queryParams.push(`incidentTypeId=${incidentTypeId}`);
      
      if (queryParams.length > 0) {
        url += `?${queryParams.join('&')}`;
      }
      
      console.log("Chargement causes depuis:", url);
      
      let response = await handleFetch(url);
      if(response?.status === 200) {
        let formattedData = response.data.map(item => ({ 
          name: item?.name || "", 
          value: item?.id 
        }));
        setIncidentCauses(formattedData);
      }
    } catch (error) { 
      console.error("Erreur chargement causes:", error);
      setIncidentCauses([]);
    }
  }, [handleFetch]);

  // const handleFetchIncidentTypes = useCallback(async (searchInput = "", equipmentDomain = null) => {
  //   setIsLoadingTypes(true);
  //   try {
  //     let baseUrl = `${URLS.INCIDENT_API}/incident-types`;
  //     let queryParams = [];
      
  //     if (searchInput) queryParams.push(`search=${searchInput}`);
  //     if (equipmentDomain) queryParams.push(`domain=${equipmentDomain}`);
      
  //     const url = queryParams.length > 0 
  //       ? `${baseUrl}?${queryParams.join('&')}`
  //       : baseUrl;
      
  //     console.log("URL appelée pour types d'incident:", url);
      
  //     let response = await handleFetch(url);
  //     if(response?.status === 200) {
  //       let formattedData = response.data.map(entity => ({
  //         name: entity?.name || "",
  //         value: entity?.id
  //       }));
  //       setIncidentTypes(formattedData);
  //     }
  //   } catch (error) {
  //     console.error("Erreur chargement types:", error);
  //   } finally {
  //     setIsLoadingTypes(false);
  //   }
  // }, [handleFetch]);
  const handleFetchIncidentTypes = useCallback(async (searchInput = "", equipmentDomain = null) => {
    setIsLoadingTypes(true);
    try {
      let baseUrl = `${URLS.INCIDENT_API}/incident-types`;
      let queryParams = [];
      
      if (searchInput) queryParams.push(`search=${searchInput}`);
      if (equipmentDomain) queryParams.push(`domain=${equipmentDomain}`);
      
      const url = queryParams.length > 0 
        ? `${baseUrl}?${queryParams.join('&')}`
        : baseUrl;
      
      console.log("URL chargement types pour maintenance:", url);
      
      let response = await handleFetch(url);
      if(response?.status === 200) {
        let formattedData = response.data.map(entity => ({
          name: entity?.name || "",
          value: entity?.id
        }));
        setIncidentTypes(formattedData);
      }
    } catch (error) {
      console.error("Erreur chargement types pour maintenance:", error);
    } finally {
      setIsLoadingTypes(false);
    }
  }, [handleFetch]);

  const handleFetchIncidentEquipement = async (link) => {
    try {
      let response = await handleFetch(link);
      
      if (response?.status === 200) {
        const equipmentsData = response?.data.map(item => ({ 
          name: item?.title || item?.name, 
          value: item?.id 
        }));
        setEquipments(equipmentsData);
      } else {
        setEquipments([]);
      }
    } catch (error) { 
      setEquipments([]);
    }
  };

  const handleOpenDetails = (record) => {
    setSelectedIncident(record.id);
    setSelectedIncidentData(record);
    setEditFields({
      description: record.description,
      hasStoppedOperations: record.hasStoppedOperations,
      siteId: record.siteId,
      shiftId: record.shiftId,
      incidentCauseId: record.incidentCauseId
    });
    setIsOpenDetails(true);
  };

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
    
    reset(fields);
    
    if (record.siteId) {
      setIsEquipementLoading(true);
      handleFetchIncidentEquipement(`${URLS.INCIDENT_API}/equipements/site/${record.siteId}`)
        .finally(() => setIsEquipementLoading(false));
    } else {
      setEquipments([]);
    }
    
    setIsOpenEdit(true);
  };

  // const handleOpenMaintenance = (record) => {
  //   // Vérifier si l'utilisateur peut mettre en maintenance cet incident
  //   if (!canPutIntoMaintenance(record)) {
  //     const incidentDomain = getEquipmentDomain(record.equipement);
  //     toast.error(`Vous n'avez pas accès aux incidents de domaine ${incidentDomain} pour la maintenance`);
  //     return;
  //   }
    
  //   if (!record?.id) {
  //     console.error("Aucun ID d'incident trouvé");
  //     return;
  //   }
    
  //   setValue("maintenance", "");
  //   setValue("incidentId", "");
  //   setValue("hasStoppedOperations", false);
  //   setDescription("");
    
  //   setSelectedSite(record.siteId);
  //   setSelectedIncident(record.id);
  //   setSelectedEquipement(record.equipementId);
    
  //   if (record.incidentId) {
  //     setValue("incidentId", record.incidentId);
  //   }
  //   if (record.hasStoppedOperations !== undefined) {
  //     setValue("hasStoppedOperations", record.hasStoppedOperations);
  //   }
    
  //   setIsOpen(true);
  // };
  const handleOpenMaintenance = async (record) => {
    // Vérifier si l'utilisateur peut mettre en maintenance cet incident
    if (!canPutIntoMaintenance(record)) {
      const incidentDomain = getEquipmentDomain(record.equipement);
      toast.error(`Vous n'avez pas accès aux incidents de domaine ${incidentDomain} pour la maintenance`);
      return;
    }
    
    if (!record?.id) {
      console.error("Aucun ID d'incident trouvé");
      return;
    }
    
    setValue("maintenance", "");
    setValue("incidentId", "");
    setValue("hasStoppedOperations", false);
    setDescription("");
    
    setSelectedSite(record.siteId);
    setSelectedIncident(record.id);
    setSelectedEquipement(record.equipementId);
    
    if (record.incidentId) {
      setValue("incidentId", record.incidentId);
    }
    if (record.hasStoppedOperations !== undefined) {
      setValue("hasStoppedOperations", record.hasStoppedOperations);
    }
    
    // IMPORTANT: Obtenir le domaine de l'équipement et charger les types d'incident correspondants
    const equipmentDomain = getEquipmentDomain(record.equipement);
    console.log("Domaine équipement pour maintenance:", equipmentDomain);
    
    // Charger les types d'incident en fonction du domaine
    setIsLoadingTypes(true);
    try {
      await handleFetchIncidentTypes("", equipmentDomain);
    } catch (error) {
      console.error("Erreur chargement types incident pour maintenance:", error);
    } finally {
      setIsLoadingTypes(false);
    }
    
    setIsOpen(true);
  };

  const handleOpenReclassify = async (record) => {
    // Vérifier si l'utilisateur peut reclasser cet incident
    if (!canReclassifyIncident(record)) {
      const incidentDomain = getEquipmentDomain(record.equipement);
      toast.error(`Vous n'avez pas accès aux incidents de domaine ${incidentDomain} pour le reclassement`);
      return;
    }
    
    setSelectedIncident(record.id);
    setSelectedIncidentData(record);
    
    const fields = {
      description: record.description,
      equipementId: record.equipementId,
      incidentId: record.incidentId,
      incidentCauseId: record.incidentCauseId
    };
    
    setReclassifyFields(fields);
    reset(fields);
  
    // Charger les équipements du site
    if (record.siteId) {
      setIsEquipementLoading(true);
      try {
        await handleFetchIncidentEquipement(`${URLS.INCIDENT_API}/equipements/site/${record.siteId}`);
        
        // IMPORTANT: Attendre que les équipements soient chargés avant de continuer
        setTimeout(async () => {
          // Charger les types d'incident en fonction du domaine de l'équipement actuel
          const currentEquipmentDomain = getEquipmentDomain(record.equipement);
          console.log("Domaine actuel de l'équipement:", currentEquipmentDomain);
          await handleFetchIncidentTypes("", currentEquipmentDomain);
          
          // Charger les causes en fonction du type d'incident actuel
          if (record.incidentId) {
            console.log("Chargement causes pour incidentId:", record.incidentId);
            await handleFetchIncidentCauses("", record.incidentId);
          } else {
            await handleFetchIncidentCauses();
          }
        }, 100);
        
      } catch (error) {
        console.error("Erreur chargement données reclassement:", error);
      } finally {
        setIsEquipementLoading(false);
      }
    }
    
    setIsOpenReclassify(true);
  };

  const submitMaintenance = async(data) => {
    if (!selectedIncident) {
      toast.error("Aucun incident sélectionné pour la maintenance");
      return;
    }
  
    if (!data.incidentId) {
      toast.error("Veuillez sélectionner un type d'incident");
      return;
    }
  
    setIsSubmitting(true);
  
    try {
      const maintenanceData = {
        description: description,
        siteId: selectedSite,
        equipementId: selectedEquipement,
        maintenance: data.maintenance,
        incidentId: selectedIncident
      };
      
      let response = await handlePost(
        `${URLS.INCIDENT_API}/maintenances`, 
        maintenanceData
      );
      
      if(response.status !== 201){
        toast.error("Échec de la création de la maintenance");
        return;
      }
  
      const updateData = {
        status: "UNDER_MAINTENANCE",
        incidentId: data.incidentId,
        hasStoppedOperations: data.hasStoppedOperations || false
      };
      
      const updateResponse = await handlePatch(
        `${URLS.INCIDENT_API}/incidents/put_into_maintenance/${selectedIncident}`,
        updateData
      );
      
      if (updateResponse && updateResponse.error) {
        toast.error("Échec de la mise à jour: " + updateResponse.error);
        return;
      }
      
      toast.success("Incident mis en maintenance avec succès");
      fetchData();
      setIsOpen(false);
      setDescription("");
      
    } catch (error) {
      toast.error("Erreur lors de la mise en maintenance: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

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

      await handlePatch(`${URLS.INCIDENT_API}/incidents/${selectedIncident}`, updateData);
      toast.success("Incident modifié avec succès");
      fetchData();
      setIsOpenEdit(false);
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la modification de l'incident");
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitReclassify = async (data) => {
    try {
      setIsSubmitting(true);
      
      const updateData = {
        equipementId: data.equipementId,
        incidentId: data.incidentId,
        incidentCauseId: data.incidentCauseId
      };
  
      // Vérifier que tous les champs requis sont présents
      if (!updateData.equipementId || !updateData.incidentId || !updateData.incidentCauseId) {
        toast.error("Tous les champs sont requis pour le reclassement");
        setIsSubmitting(false);
        return;
      }
  
      const response = await handlePatch(
        `${URLS.INCIDENT_API}/incidents/reclassify/${selectedIncident}`,
        updateData
      );
  
      if (response && response.error) {
        toast.error("Erreur lors du reclassement: " + response.error);
        return;
      }
  
      toast.success("Incident reclassé avec succès");
      fetchData();
      setIsOpenReclassify(false);
      
    } catch (error) {
      console.error("Erreur reclassification:", error);
      toast.error("Erreur lors du reclassement");
    } finally {
      setIsSubmitting(false);
    }
  };

  const InfoItem = ({ label, value }) => (
    <div className="flex flex-col">
      <span className="text-sm font-medium text-gray-500">{label}</span>
      <span className="text-gray-900 mt-1">{value || "--"}</span>
    </div>
  );

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await Promise.all([
          handleFetchSites(`${URLS.ENTITY_API}/sites`),
          handleFetchShifts(`${URLS.ENTITY_API}/shifts`),
          handleFetchIncidentCauses(`${URLS.INCIDENT_API}/incident-causes`),
          handleFetchIncidentTypes(`${URLS.INCIDENT_API}/incident-types`),
          handleFetchEmployees(`${URLS.ENTITY_API}/employees`)
        ]);
      } catch (error) {
        console.error("Erreur chargement données:", error);
      }
    };

    loadInitialData();
  }, []);

  // Load user roles & permissions
  useEffect(() => {
    const handleCheckPermissions = async () => {
      try {
        const employee = await getEmployee();
        if (!employee) return;
        
        const employeeRoles = await handleFetch(`${URLS.ENTITY_API}/employees/${employee?.id}/roles`);
        const employeePermissions = await handleFetch(`${URLS.ENTITY_API}/employees/${employee?.id}/permissions`);
        
        const roleNames = employeeRoles?.employeeRoles?.map(r => r.role.roleName) || [];
        const permissionNames = employeePermissions?.employeePermissions?.map(p => p.permission.permissionName) || [];
        
        setRoles(roleNames);
        setPermissions(permissionNames);
        
        // Déterminer le domaine de l'utilisateur
        const domain = getUserDomainFromRoles(roleNames);
        setUserDomain(domain);
        
        console.log("👤 Rôles utilisateur:", roleNames);
        console.log("👤 Domaine de l'utilisateur:", domain);
        console.log("👤 Permissions:", permissionNames);
      } catch (error) {
        console.error("Erreur permissions:", error);
      }
    };
    
    handleCheckPermissions();
  }, [getUserDomainFromRoles]);

  // Columns
  const columns = [
    { 
      title: "No ref", 
      dataIndex: "numRef", 
      width: "100px", 
      render: v => <p className='text-sm'>{highlightText(v)}</p> 
    },
    { 
      title: "Équipement", 
      dataIndex: "equipement", 
      width: "250px", 
      render: (equipement) => {
        if (!equipement) {
          return <p className='text-sm'>--</p>;
        }
        
        const equipmentObj = Array.isArray(equipement) ? equipement[0] : equipement;
        const domain = getEquipmentDomain(equipement);
        
        return (
          <div className="flex flex-col gap-1">
            <p className='text-sm font-medium'>{equipmentObj?.title || equipmentObj?.name || "--"}</p>
            {domain && (
              <span className={`inline-block text-xs px-2 py-1 rounded-full w-fit ${
                domain === "IT" ? "bg-blue-100 text-blue-800 border border-blue-200" :
                domain === "HSE" ? "bg-red-100 text-red-800 border border-red-200" :
                domain === "OPERATIONS" ? "bg-green-100 text-green-800 border border-green-200" :
                domain === "MAINTENANCE" ? "bg-yellow-100 text-yellow-800 border border-yellow-200" :
                "bg-gray-100 text-gray-800 border border-gray-200"
              }`}>
                {domain}
              </span>
            )}
          </div>
        );
      } 
    },
    { 
      title: "Description", 
      dataIndex: "description", 
      width: "200px", 
      render: v => <p className='text-sm'>{highlightText(v) || "--"}</p> 
    },
    { 
      title: "Arrêt opération", 
      dataIndex: "hasStoppedOperations", 
      width: "150px", 
      render: v => <p className='text-sm'>{v === true ? "Oui" : v === false ? "Non" : "--"}</p> 
    },
    { 
      title: "Site", 
      dataIndex: "siteId", 
      width: "150px", 
      render: v => <p className='text-sm capitalize'>{sitesMap.get(v) || v}</p> 
    },
    { 
      title: "Quart", 
      dataIndex: "shiftId", 
      width: "150px", 
      render: v => <p className='text-sm capitalize'>{shifts.find(s => s.value === v)?.name || v || "--"}</p> 
    },
    { 
      title: "Initiateur", 
      dataIndex: "createdBy", 
      width: "200px", 
      render: v => <p className='text-sm capitalize'>{employees.find(e => e.value === v)?.name || v}</p> 
    },
    { 
      title: "Intervenant", 
      dataIndex: "technician", 
      width: "200px", 
      render: v => <p className='text-sm capitalize'>{employees.find(e => e.value === v)?.name || externalEntities.find(e => e.value === v)?.name || v || "--"}</p> 
    },
    { 
      title: "Clôturé par", 
      dataIndex: "closedBy", 
      width: "200px", 
      render: v => <p className='text-sm capitalize'>{employees.find(e => e.value === v)?.name || v || "--"}</p> 
    },
    { 
      title: "Type incident", 
      dataIndex: "incident", 
      width: "200px", 
      render: v => <p className='text-sm'>{highlightText(v?.name) || v}</p> 
    },
    { 
      title: "Cause incident", 
      dataIndex: "incidentCauseId", 
      width: "200px", 
      render: v => <p className='text-sm capitalize'>{incidentCauses.find(c => c.value === v)?.name || v || "--"}</p> 
    },
    { 
      title: "Date de création", 
      dataIndex: "creationDate", 
      width: "200px", 
      render: v => <p className='text-sm capitalize'>{v ? new Date(v).toLocaleString() : "--"}</p> 
    },
    { 
      title: "Date de clôture Utilisateur", 
      dataIndex: "closedManuDate", 
      width: "200px", 
      render: v => <p className='text-sm capitalize'>{v ? new Date(v).toLocaleString() : "--"}</p> 
    },
    { 
      title: "Date de clôture Système", 
      dataIndex: "closedDate", 
      width: "200px", 
      render: v => <p className='text-sm capitalize'>{v ? new Date(v).toLocaleString() : "--"}</p> 
    },
    {
      title: "Durée", 
      dataIndex: "duration", 
      width: "120px", 
      render: (_, record) => {
        const startDate = new Date(record.creationDate);
        let endDate = record.closedManuDate ? new Date(record.closedManuDate) : record.status === "CLOSED" && record.closedDate ? new Date(record.closedDate) : null;
        if (!endDate) return <p className='text-sm'>--</p>;
        const durationMs = endDate - startDate;
        const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
        const durationMinutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
        return <p className='text-sm'>{durationHours > 0 ? `${durationHours}h ` : ''}{durationMinutes > 0 ? `${durationMinutes}min` : '0min'}</p>;
      }
    },
    { 
      title: "Reclassé par", 
      dataIndex: "reclassifiedBy", 
      width: "200px", 
      render: v => <p className='text-sm capitalize'>{employees.find(e => e.value === v)?.name || v || "--"}</p> 
    },
    {
      title: "Statut", 
      dataIndex: "status", 
      fixed: "right", 
      width: "150px", 
      render: v => (
        <div className={`${v === "UNDER_MAINTENANCE" ? "border-yellow-500 bg-yellow-300" : v === "CLOSED" ? "border-green-500 bg-green-300" : ""} p-2 rounded-lg border`}>
          {INCIDENT_STATUS[v] || "Unknown Status"}
        </div>
      )
    },
    {
      title: "Action", 
      dataIndex: "", 
      fixed: "right", 
      width: "75px", 
      render: (_, record) => (
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
            
            {/* Voir détails - Toujours disponible */}
            <DropdownMenuItem 
              className="flex gap-2 items-center cursor-pointer"
              onClick={() => handleOpenDetails(record)}
            >
              <EyeIcon className='h-4 w-6' />
              <span>Voir détails</span>
            </DropdownMenuItem>
            
            {/* Actions pour incidents clôturés */}
            {record.status === "CLOSED" && (
              <>
                <DropdownMenuSeparator />
                {/* Reclasser - tous les utilisateurs peuvent reclasser les incidents de leur domaine */}
                {canReclassifyIncident(record) && (
                  <DropdownMenuItem 
                    className="flex gap-2 items-center cursor-pointer"
                    onClick={() => handleOpenReclassify(record)}
                  >
                    <PencilSquareIcon className='h-4 w-6'/>
                    <span>Reclasser</span>
                  </DropdownMenuItem>
                )}
              </>
            )}
            
            {/* Actions pour incidents en attente */}
            {record.status === "PENDING" && (
              <>
                {/* Mettre en maintenance - seulement IT et Maintenance (et privilégiés) */}
                {canPutIntoMaintenance(record) && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="flex gap-2 items-center cursor-pointer">
                      <button 
                        className='flex items-center space-x-2'
                        onClick={() => handleOpenMaintenance(record)}
                      >
                        <ExclamationTriangleIcon />
                        <span>Mettre en maintenance</span>
                      </button>
                    </DropdownMenuItem>
                  </>
                )}
    
                {/* Clôturer l'incident - tous les utilisateurs peuvent clôturer les incidents de leur domaine */}
                {canCloseIncident(record) && (
                  <>
                    <DropdownMenuSeparator />
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
                        <span>Clôturer l'incident</span>
                      </button>
                    </DropdownMenuItem>
                  </>
                )}
              </>
            )}
    
            <DropdownMenuSeparator />
            
            {/* Supprimer - avec vérification de permission */}
            <VerifyPermission functions={permissions} roles={roles} expected={['incident__can_delete_incident']}>
              <DropdownMenuItem 
                className="flex gap-2 items-center cursor-pointer text-red-600"
                onClick={async () => {
                  if (!window.confirm("Voulez-vous vraiment supprimer cet incident ?")) return;
                  try {
                    await handlePost(`${URLS.INCIDENT_API}/incidents/${record.id}`, { method: "DELETE" });
                    toast.success("Incident supprimé avec succès");
                    fetchData();
                  } catch (error) {
                    console.error(error);
                    toast.error("Erreur lors de la suppression");
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
    }
  ];

  return (
    <div>
      {loading && <Preloader />}
      
      {/* Indicateur de domaine utilisateur avec informations détaillées */}
      {userDomain && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div className="p-2 bg-white rounded border">
            <span className="text-sm font-medium">Statut utilisateur :</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              userDomain === "PRIVILEGED" ? "bg-purple-100 text-purple-800 border border-purple-200" :
              userDomain === "IT" ? "bg-blue-100 text-blue-800 border border-blue-200" :
              userDomain === "HSE" ? "bg-red-100 text-red-800 border border-red-200" :
              userDomain === "OPERATIONS" ? "bg-green-100 text-green-800 border border-green-200" :
              userDomain === "MAINTENANCE" ? "bg-yellow-100 text-yellow-800 border border-yellow-200" :
              "bg-gray-100 text-gray-800 border border-gray-200"
            }`}>
              {userDomain === "PRIVILEGED" ? "Privilégié (Admin/Manager/DEX)" : userDomain}
            </span>
          </div>
          <div className="p-2 bg-white rounded border">
            <p className="font-medium mb-1">Clôture incidents :</p>
            <p className="text-green-600">
              {userDomain === "PRIVILEGED" 
                ? "✓ Tous domaines" 
                : "✓ Domaine " + userDomain}
            </p>
          </div>
          
          <div className="p-2 bg-white rounded border">
            <p className="font-medium mb-1">Reclassement incidents :</p>
            <p className="text-green-600">
              {userDomain === "PRIVILEGED" 
                ? "✓ Tous domaines" 
                : "✓ Domaine " + userDomain}
            </p>
          </div>
          
          <div className="p-2 bg-white rounded border">
            <p className="font-medium mb-1">Mise en maintenance :</p>
            <p className={
              userDomain === "PRIVILEGED" || userDomain === "IT" || userDomain === "MAINTENANCE" 
                ? "text-green-600" 
                : "text-gray-600"
            }>
              {userDomain === "PRIVILEGED" 
                ? "✓ Tous domaines" 
                : userDomain === "IT" || userDomain === "MAINTENANCE"
                  ? `✓ Domaine ${userDomain}`
                  : "✗ IT/Maintenance uniquement"}
            </p>
          </div>
        </div>
      )}
      
      <Table
        columns={columns}
        dataSource={dataList}
        pagination={pagination}
        rowKey="id"
        scroll={{ x: 2500 }}
        loading={loading}
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
          
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = {
              maintenance: formData.get('maintenance'),
              incidentId: formData.get('incidentId'),
              hasStoppedOperations: formData.get('hasStoppedOperations') === 'on'
            };
            submitMaintenance(data);
          }} className="space-y-4">
            
            <div className='flex flex-col'>
              <label htmlFor="maintenance-type" className='text-sm font-semibold mb-2'>
                Type de maintenance <span className='text-red-500'>*</span>
              </label>
              <select 
                id="maintenance-type"
                name="maintenance"
                className='border rounded-lg w-full p-2' 
                required
              >
                <option value="">Choisir le type de maintenance</option>
                <option value="CORRECTION">CORRECTIF</option>
                <option value="PALLIATIVE">PALIATIF</option>
                <option value="CURATIVE">CURATIF</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Type d'incident <span className='text-red-500'>*</span>
              </label>
              {/* <AutoComplete
                placeholder="Rechercher un type d'incident..."
                isLoading={isLoadingTypes}
                dataList={incidentTypes}
                onSearch={handleSearchIncidentTypes}
                onSelect={handleSelectIncidentType}
              /> */}
              <AutoComplete
                placeholder="Rechercher un type d'incident..."
                isLoading={isLoadingTypes}
                dataList={incidentTypes}
                onSearch={(input) => {
                  // Obtenir le domaine de l'équipement de l'incident
                  const equipmentDomain = getEquipmentDomain(selectedIncidentData?.equipement);
                  console.log("Recherche types pour maintenance avec domaine:", equipmentDomain);
                  return handleFetchIncidentTypes(input, equipmentDomain);
                }}
                onSelect={handleSelectIncidentType}
                // Optionnel: pré-sélectionner le type si déjà défini
                initialValue={selectedIncidentData?.incidentId ? 
                  incidentTypes.find(t => t.value === selectedIncidentData?.incidentId) : null}
              />
              <input
                type="hidden"
                name="incidentId"
                id="incidentId"
              />
            </div>

            <div className='bg-gray-50 rounded-lg p-4'>
              <label className='flex items-center space-x-2 cursor-pointer'>
                <input
                  type="checkbox"
                  name="hasStoppedOperations"
                  className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500'
                />
                <span className='font-semibold text-sm'>L'incident a causé un arrêt des opérations</span>
              </label>
            </div>

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

      {/* Modal Voir détails */}
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
                  <InfoItem label="Équipement" value={
                    selectedIncidentData?.equipement?.title || 
                    (Array.isArray(selectedIncidentData?.equipement) ? selectedIncidentData?.equipement[0]?.title : "") || 
                    "--"
                  } />
                </div>
                <div className="space-y-2">
                  <InfoItem label="Type incident" value={selectedIncidentData?.incident?.name || "--"} />
                  <InfoItem label="Cause incident" value={incidentCauses.find(c => c.value === selectedIncidentData?.incidentCauseId)?.name || "--"} />
                  {selectedIncidentData?.equipement && (
                    <InfoItem 
                      label="Domaine" 
                      value={
                        <span className={`inline-block text-xs px-2 py-1 rounded-full ${
                          getEquipmentDomain(selectedIncidentData?.equipement) === "IT" ? "bg-blue-100 text-blue-800" :
                          getEquipmentDomain(selectedIncidentData?.equipement) === "HSE" ? "bg-red-100 text-red-800" :
                          getEquipmentDomain(selectedIncidentData?.equipement) === "OPERATIONS" ? "bg-green-100 text-green-800" :
                          getEquipmentDomain(selectedIncidentData?.equipement) === "MAINTENANCE" ? "bg-yellow-100 text-yellow-800" :
                          "bg-gray-100 text-gray-800"
                        }`}>
                          {getEquipmentDomain(selectedIncidentData?.equipement) || "--"}
                        </span>
                      } 
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
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
                {selectedIncidentData?.reclassifiedBy && (
                  <InfoItem 
                    label="Reclassé par" 
                    value={employees.find(e => e.value === selectedIncidentData?.reclassifiedBy)?.name || selectedIncidentData?.reclassifiedBy || "--"} 
                  />
                )}
              </div>
            </div>

            {/* Section Photos */}
            {selectedIncidentData?.photos && selectedIncidentData.photos.length > 0 ? (
              <div className="bg-white border rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <CameraIcon className="h-4 w-4" />
                    Photos associées ({selectedIncidentData.photos.length})
                  </h3>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {selectedIncidentData.photos.map((photo, index) => (
                    <div key={photo.id} className="group relative border rounded-lg overflow-hidden bg-gray-50 hover:shadow-md transition-shadow">
                      <SecureImage
                        src={photo.url}
                        alt={`Photo ${index + 1} de l'incident ${selectedIncidentData?.numRef}`}
                        className="w-full h-32 object-cover cursor-pointer group-hover:opacity-90 transition-opacity"
                      />
                      <div className="p-2 text-xs text-center bg-white border-t">
                        <p className="font-medium">Photo {index + 1}</p>
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
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Modifier incident (vous l'aviez appelé isOpenEdit mais il n'est pas utilisé, je l'ai supprimé car vous n'avez pas de fonction pour l'ouvrir) */}

      {/* Modal Reclasser incident - UNE SEULE MODAL */}
      <Dialog open={isOpenReclassify} onOpenChange={setIsOpenReclassify}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <PencilSquareIcon className="h-5 w-5" />
              Reclasser l'incident #{selectedIncidentData?.numRef} 
            </DialogTitle>
            <DialogDescription>
              Modifier la classification de cet incident
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto pr-2 -mr-2">
            <form 
              onSubmit={handleSubmit(submitReclassify)} 
              className="space-y-6 pb-4"
            >
              {/* Site - Lecture seule */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Site
                </label>
                <div className="p-2 border border-gray-300 rounded-md bg-gray-50">
                  <p className="text-gray-700">
                    {sitesMap.get(selectedIncidentData?.siteId) || "Site non spécifié"}
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Le site ne peut pas être modifié lors du reclassement
                </p>
              </div>

              {/* Équipement */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Équipement <span className="text-red-500">*</span>
                </label>
                <AutoComplete
                  placeholder="Rechercher un équipement..."
                  isLoading={isEquipementLoading}
                  dataList={equipments}
                  onSearch={(input) => {
                    handleSearchEquipements(input);
                  }}
                  onSelect={(item) => {
                    if (item) {
                      setValue("equipementId", item.value, { shouldValidate: true });
                      
                      // Obtenir le domaine du nouvel équipement et charger les types d'incident correspondants
                      getEquipmentDomainFromId(item.value).then(equipmentDomain => {
                        console.log("Domaine obtenu pour équipement:", equipmentDomain);
                        handleFetchIncidentTypes("", equipmentDomain);
                      });
                      
                      // Réinitialiser le type d'incident et la cause
                      setValue("incidentId", "");
                      setValue("incidentCauseId", "");
                    } else {
                      setValue("equipementId", "");
                      // Si pas d'équipement, charger tous les types d'incident
                      handleFetchIncidentTypes("", null);
                      setValue("incidentId", "");
                      setValue("incidentCauseId", "");
                    }
                  }}
                  initialValue={reclassifyFields.equipementId ? 
                    equipments.find(e => e.value === reclassifyFields.equipementId) : null}
                />
                {errors.equipementId && (
                  <p className="text-red-500 text-sm mt-1">{errors.equipementId.message}</p>
                )}
              </div>

              {/* Type d'incident */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Type d'incident <span className="text-red-500">*</span>
                </label>
                <AutoComplete
                  placeholder="Rechercher un type d'incident..."
                  isLoading={isLoadingTypes}
                  dataList={incidentTypes}
                  onSearch={(input) => {
                    // Obtenir le domaine de l'équipement sélectionné
                    const selectedEquipementId = watch("equipementId");
                    let equipmentDomain = null;
                    
                    if (selectedEquipementId) {
                      // Obtenir le domaine de l'équipement sélectionné
                      return getEquipmentDomainFromId(selectedEquipementId).then(domain => {
                        console.log("Recherche types avec domaine:", domain);
                        return handleFetchIncidentTypes(input, domain);
                      });
                    } else {
                      // Si aucun équipement sélectionné, charger tous les types
                      console.log("Recherche types sans domaine (tous)");
                      return handleFetchIncidentTypes(input, null);
                    }
                  }}
                  onSelect={(item) => {
                    if (item) {
                      setValue("incidentId", item.value, { shouldValidate: true });
                      console.log("Type d'incident sélectionné:", item.value);
                      // Recharger les causes avec le filtre du type sélectionné
                      handleFetchIncidentCauses("", item.value);
                      // Réinitialiser la cause sélectionnée
                      setValue("incidentCauseId", "");
                    } else {
                      setValue("incidentId", "");
                      // Si pas de type d'incident, charger toutes les causes
                      handleFetchIncidentCauses();
                    }
                  }}
                  initialValue={reclassifyFields.incidentId ? 
                    incidentTypes.find(t => t.value === reclassifyFields.incidentId) : null}
                />
                {errors.incidentId && (
                  <p className="text-red-500 text-sm mt-1">{errors.incidentId.message}</p>
                )}
              </div>

              {/* Cause d'incident */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Cause d'incident <span className="text-red-500">*</span>
                </label>
                <AutoComplete
                  placeholder="Rechercher une cause..."
                  isLoading={false}
                  dataList={incidentCauses}
                  onSearch={(input) => {
                    // Filtrer par type d'incident si sélectionné
                    const incidentId = watch("incidentId");
                    console.log("Recherche causes pour incidentId:", incidentId);
                    return handleFetchIncidentCauses(input, incidentId);
                  }}
                  onSelect={(item) => {
                    if (item) {
                      setValue("incidentCauseId", item.value, { shouldValidate: true });
                      console.log("Cause sélectionnée:", item.value);
                    } else {
                      setValue("incidentCauseId", "");
                    }
                  }}
                  initialValue={reclassifyFields.incidentCauseId ? 
                    incidentCauses.find(c => c.value === reclassifyFields.incidentCauseId) : null}
                />
                {errors.incidentCauseId && (
                  <p className="text-red-500 text-sm mt-1">{errors.incidentCauseId.message}</p>
                )}
              </div>

              {/* Description - Lecture seule */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Description originale
                </label>
                <div className="p-3 border border-gray-300 rounded-md bg-gray-50">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {selectedIncidentData?.description || "Aucune description"}
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  La description originale est conservée
                </p>
              </div>

              <div className="flex gap-2 pt-6 border-t">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsOpenReclassify(false)}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  Annuler
                </Button>
                <Button 
                  type="submit" 
                  className="flex gap-2 text-white hover:bg-secondary bg-primary flex-1"
                  disabled={isSubmitting || !watch("equipementId") || !watch("incidentId") || !watch("incidentCauseId")}
                >
                  {isSubmitting ? (
                    <>
                      <Preloader size={16} />
                      Reclassement...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      Confirmer le reclassement
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Datalist;