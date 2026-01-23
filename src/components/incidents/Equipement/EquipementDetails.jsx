import React, { useState, useEffect } from 'react';
import { Archive, Minus, Plus } from "lucide-react";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
} from "../../ui/drawer";
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Table } from 'antd';
import MovementDataList from './MovementDataList';
import OperationsDataList from './OperationsDataList';
import MaintenanceDataList from './MaintenanceDataList';

const EquipementDetails = ({open, setOpen, equipements}) => {
  useEffect(()=>{
    console.log(equipements);
  }, [])

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent>
        <div className="mx-12">
          {/* <DrawerHeader>
            <DrawerTitle>Detail de l'équipement</DrawerTitle>
            <DrawerDescription>Obtenir tous les détails de l'équipement sélectionné.</DrawerDescription>
          </DrawerHeader> */}
          <div className='min-h-[80vh] max-h-[80vh] w-full overflow-y-auto overflow-x-hidden'>
            {/* Equipment Details */}
            <div className='h-1/3 w-full space-y-3 sticky top-0 bg-gray-50 p-4 z-30 border rounded-t-xl'>
            
              {/* Equipment name */}
              <div className='flex items-center gap-3'>
                <Archive className='text-4xl'/>
                <h4 className='text-4xl'>{equipements?.title}</h4>
              </div>

              {/* Equipment information */}
              <div className='flex md:items-center gap-3 flex-wrap flex-col md:flex-row text-xs'>
                  <div>
                    <p className='space-x-4'><span>Numéro de ref. : </span>{equipements?.numRef}</p>
                    <p className='space-x-4'><span>Régime : </span>{equipements?.operatingMode}</p>
                    <p className='space-x-4'><span>Mise en service : </span>{new Date(equipements?.createdAt).toLocaleString()}</p>
                    <div className='flex items-center gap-4 mt-2 flex-wrap'>
                      <p className='space-x-4 p-2 rounded-lg bg-orange-300 border border-orange-400'><span>Dernière maintenance : </span>{equipements?.lastMaintenance ? new Date(equipements?.lastMaintenance).toLocaleString() : "Not maintained"}</p>
                      <p className='space-x-4 p-2 rounded-lg bg-orange-300 border border-orange-400'><span>Prochaine maintenance : </span>{new Date(equipements?.nextMaintenance).toLocaleString()}</p>
                    </div>
                  </div>
              </div>

            </div>
            {/* Content */}
            <div className='w-full h-2/3 space-y-4 mt-8 overflow-y-auto'>
              <div>
                <OperationsDataList data={equipements?.operations}/>
              </div>
              <hr />
              <div>
                <MovementDataList data={equipements?.movement}/>
              </div>
              <hr />
              <div>
                <MaintenanceDataList data={equipements?.maintenance}/>
              </div>
            </div>
          </div>

          {/* Footer */}
          <DrawerFooter>
            <div className='flex items-center gap-4 justify-end'>
                <DrawerClose asChild>
                    <button className='px-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-900 transition-all flex items-center gap-2 text-sm' variant="outline">
                        <XMarkIcon className='h-5'/>
                        <span>Fermer</span>
                    </button>
                </DrawerClose>
            </div>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export default EquipementDetails


// import React, { useState, useEffect } from 'react';
// import { 
//   Archive, 
//   Calendar, 
//   Clock, 
//   Cog, 
//   Cpu, 
//   Factory, 
//   Gauge, 
//   HardDrive, 
//   MapPin, 
//   RefreshCw, 
//   Shield, 
//   Tag, 
//   Users, 
//   Wrench, 
//   X
// } from "lucide-react";
// import {
//   Drawer,
//   DrawerClose,
//   DrawerContent,
//   DrawerDescription,
//   DrawerFooter,
//   DrawerHeader,
//   DrawerTitle,
// } from "../../ui/drawer";
// import { useFetch } from '../../../hooks/useFetch';
// import OperationsDataList from './OperationsDataList';
// import MovementDataList from './MovementDataList';
// import MaintenanceDataList from './MaintenanceDataList';

// const EquipementDetails = ({ open, setOpen, equipements }) => {
//   const [activeTab, setActiveTab] = useState("overview");
//   const { handleFetch } = useFetch();
  
//   // États pour stocker les données supplémentaires
//   const [siteDetails, setSiteDetails] = useState(null);
//   const [employeeDetails, setEmployeeDetails] = useState(null);
//   const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  
//   // Fonction pour formater les dates
//   const formatDate = (dateString) => {
//     if (!dateString) return "Non défini";
//     const date = new Date(dateString);
//     return date.toLocaleDateString('fr-FR', {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   // Fonction pour calculer le pourcentage de vie utilisée
//   const calculateLifePercentage = () => {
//     if (!equipements?.lifeSpan || !equipements?.createdAt) return 0;
    
//     const creationDate = new Date(equipements.createdAt);
//     const now = new Date();
//     const daysSinceCreation = Math.floor((now - creationDate) / (1000 * 60 * 60 * 24));
    
//     const percentage = (daysSinceCreation / equipements.lifeSpan) * 100;
//     return Math.min(Math.max(percentage, 0), 100);
//   };

//   // Fonction pour obtenir la couleur du statut
//   const getStatusColor = (status) => {
//     switch(status) {
//       case 'NEW': return 'bg-green-100 text-green-800 border-green-200';
//       case 'SECOND_HAND': return 'bg-blue-100 text-blue-800 border-blue-200';
//       case 'MAINTENANCE_REQUIRED': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
//       case 'OUT_OF_SERVICE': return 'bg-red-100 text-red-800 border-red-200';
//       default: return 'bg-gray-100 text-gray-800 border-gray-200';
//     }
//   };

//   // Fonction pour obtenir le label du statut
//   const getStatusLabel = (status) => {
//     switch(status) {
//       case 'NEW': return 'NEUF';
//       case 'SECOND_HAND': return 'SECONDE MAIN';
//       case 'MAINTENANCE_REQUIRED': return 'MAINTENANCE REQUISE';
//       case 'OUT_OF_SERVICE': return 'HORS SERVICE';
//       default: return status || 'NON DÉFINI';
//     }
//   };

//   // Fonction pour obtenir le domaine de l'équipement
//   const getEquipmentDomain = () => {
//     if (!equipements?.equipmentGroup?.equipmentGroupFamily) return null;
//     return equipements.equipmentGroup.equipmentGroupFamily.domain;
//   };

//   // Fonction pour obtenir la couleur du domaine
//   const getDomainColor = (domain) => {
//     switch(domain) {
//       case 'IT': return 'bg-blue-100 text-blue-800 border-blue-200';
//       case 'HSE': return 'bg-red-100 text-red-800 border-red-200';
//       case 'OPERATIONS': return 'bg-green-100 text-green-800 border-green-200';
//       case 'MAINTENANCE': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
//       default: return 'bg-gray-100 text-gray-800 border-gray-200';
//     }
//   };

//   // Fonction pour récupérer les détails du site
//   const fetchSiteDetails = async (siteId) => {
//     if (!siteId) return;
    
//     try {
//       console.log("Récupération du site ID:", siteId);
//       const response = await handleFetch(`${import.meta.env.VITE_ENTITY_API}/sites`);
      
//       // Vérifier la structure de la réponse
//       console.log("Réponse sites:", response);
      
//       if (response?.data) {
//         // Extraire le tableau de données selon la structure
//         let sitesArray = response.data;
        
//         // Si la réponse a une structure paginée
//         if (response.data.data && Array.isArray(response.data.data)) {
//           sitesArray = response.data.data;
//         }
        
//         // Si c'est un objet, essayer de le convertir en tableau
//         if (!Array.isArray(sitesArray) && typeof sitesArray === 'object') {
//           sitesArray = Object.values(sitesArray);
//         }
        
//         // Trouver le site correspondant
//         const site = Array.isArray(sitesArray) 
//           ? sitesArray.find(s => s.id === siteId)
//           : null;
        
//         console.log("Site trouvé:", site);
//         setSiteDetails(site);
//       }
//     } catch (error) {
//       console.error("Erreur lors de la récupération des détails du site:", error);
//     }
//   };

//   // Fonction pour récupérer les détails de l'employé
//   const fetchEmployeeDetails = async (employeeId) => {
//     if (!employeeId) return;
    
//     try {
//       console.log("Récupération de l'employé ID:", employeeId);
//       const response = await handleFetch(`${import.meta.env.VITE_ENTITY_API}/employees`);
      
//       // Vérifier la structure de la réponse
//       console.log("Réponse employés:", response);
      
//       if (response?.data) {
//         // Extraire le tableau de données selon la structure
//         let employeesArray = response.data;
        
//         // Si la réponse a une structure paginée
//         if (response.data.data && Array.isArray(response.data.data)) {
//           employeesArray = response.data.data;
//         }
        
//         // Si c'est un objet, essayer de le convertir en tableau
//         if (!Array.isArray(employeesArray) && typeof employeesArray === 'object') {
//           employeesArray = Object.values(employeesArray);
//         }
        
//         // Trouver l'employé correspondant
//         const employee = Array.isArray(employeesArray) 
//           ? employeesArray.find(e => e.id === employeeId)
//           : null;
        
//         console.log("Employé trouvé:", employee);
//         setEmployeeDetails(employee);
//       }
//     } catch (error) {
//       console.error("Erreur lors de la récupération des détails de l'employé:", error);
//     }
//   };

//   // Fonction pour créer un badge simple
//   const Badge = ({ children, className, variant = 'default' }) => {
//     const baseClasses = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors';
//     const variantClasses = variant === 'outline' ? 'border' : '';
    
//     return (
//       <span className={`${baseClasses} ${variantClasses} ${className}`}>
//         {children}
//       </span>
//     );
//   };

//   // Fonction pour créer un composant Progress
//   const Progress = ({ value, className = '' }) => {
//     return (
//       <div className={`h-2 w-full overflow-hidden rounded-full bg-gray-200 ${className}`}>
//         <div
//           className="h-full rounded-full bg-blue-600 transition-all"
//           style={{ width: `${value}%` }}
//         />
//       </div>
//     );
//   };

//   // Composant Tabs simplifié
//   const Tabs = ({ value, onValueChange, children, className }) => {
//     return (
//       <div className={className}>
//         {React.Children.map(children, child => 
//           React.cloneElement(child, { value, onValueChange })
//         )}
//       </div>
//     );
//   };

//   const TabsList = ({ children, className }) => {
//     return (
//       <div className={`inline-flex h-10 items-center justify-center rounded-lg bg-gray-100 p-1 ${className}`}>
//         {children}
//       </div>
//     );
//   };

//   const TabsTrigger = ({ value, children, className }) => {
//     const isActive = value === activeTab;
//     return (
//       <button
//         onClick={() => setActiveTab(value)}
//         className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
//           isActive 
//             ? 'bg-white text-blue-600 shadow-sm' 
//             : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
//         } ${className}`}
//       >
//         {children}
//       </button>
//     );
//   };

//   const TabsContent = ({ value, children, className }) => {
//     if (value !== activeTab) return null;
//     return <div className={className}>{children}</div>;
//   };

//   // Charger les données supplémentaires quand l'équipement change
//   useEffect(() => {
//     if (equipements) {
//       console.log("Détails de l'équipement:", equipements);
      
//       // Réinitialiser les états
//       setSiteDetails(null);
//       setEmployeeDetails(null);
      
//       // Charger les détails du site
//       if (equipements.siteId) {
//         fetchSiteDetails(equipements.siteId);
//       }
      
//       // Charger les détails de l'employé
//       if (equipements.createdBy) {
//         fetchEmployeeDetails(equipements.createdBy);
//       }
//     }
//   }, [equipements]);

//   if (!equipements) return null;

//   const lifePercentage = calculateLifePercentage();
//   const equipmentDomain = getEquipmentDomain();

//   return (
//     <Drawer open={open} onOpenChange={setOpen}>
//       <DrawerContent className="max-h-[90vh]">
//         {/* Ajout du DrawerHeader avec DrawerTitle et DrawerDescription */}
//         <DrawerHeader className="text-left">
//           <DrawerTitle className="text-xl font-bold">Détails de l'équipement</DrawerTitle>
//           <DrawerDescription>
//             Informations détaillées de l'équipement {equipements?.title}
//           </DrawerDescription>
//         </DrawerHeader>
        
//         <div className="mx-4 md:mx-12">
//           {/* Header avec navigation par onglets */}
//           <div className="sticky top-0 bg-white z-40 pt-2 pb-2 border-b">
//             <div className="flex items-start justify-between mb-4">
//               <div className="flex items-center gap-3">
//                 <div className="p-2 bg-blue-50 rounded-lg">
//                   <Archive className="h-8 w-8 text-blue-600" />
//                 </div>
//                 <div>
//                   <h2 className="text-2xl font-bold text-gray-800">{equipements?.title}</h2>
//                   <div className="flex items-center gap-2 mt-1">
//                     <Tag className="h-4 w-4 text-gray-500" />
//                     <span className="text-sm text-gray-600 font-mono">{equipements?.numRef}</span>
//                     {equipmentDomain && (
//                       <Badge 
//                         className={`ml-2 ${getDomainColor(equipmentDomain)}`}
//                       >
//                         {equipmentDomain}
//                       </Badge>
//                     )}
//                   </div>
//                 </div>
//               </div>
              
//               <DrawerClose asChild>
//                 <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
//                   <X className="h-5 w-5" />
//                 </button>
//               </DrawerClose>
//             </div>

//             {/* Onglets de navigation */}
//             <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//               <TabsList className="grid w-full grid-cols-4">
//                 <TabsTrigger value="overview">
//                   <HardDrive className="h-4 w-4 mr-2" />
//                   Vue d'ensemble
//                 </TabsTrigger>
//                 <TabsTrigger value="operations">
//                   <Cog className="h-4 w-4 mr-2" />
//                   Opérations
//                 </TabsTrigger>
//                 <TabsTrigger value="movements">
//                   <Factory className="h-4 w-4 mr-2" />
//                   Mouvements
//                 </TabsTrigger>
//                 <TabsTrigger value="maintenance">
//                   <Wrench className="h-4 w-4 mr-2" />
//                   Maintenance
//                 </TabsTrigger>
//               </TabsList>
//             </Tabs>
//           </div>

//           {/* Contenu principal avec défilement */}
//           <div className="py-4 max-h-[65vh] overflow-y-auto">
//             {/* Vue d'ensemble */}
//             <TabsContent value="overview" className="space-y-6 mt-0">
//               {/* Statut et informations principales */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Informations de base */}
//                 <div className="space-y-4">
//                   <h3 className="text-lg font-semibold flex items-center gap-2">
//                     <Shield className="h-5 w-5" />
//                     Informations générales
//                   </h3>
                  
//                   <div className="space-y-3">
//                     <div className="flex items-center justify-between">
//                       <span className="text-sm text-gray-600 flex items-center gap-2">
//                         <Tag className="h-4 w-4" />
//                         Référence
//                       </span>
//                       <span className="font-medium font-mono">{equipements?.numRef}</span>
//                     </div>
                    
//                     <div className="flex items-center justify-between">
//                       <span className="text-sm text-gray-600 flex items-center gap-2">
//                         <Cpu className="h-4 w-4" />
//                         Groupe d'équipement
//                       </span>
//                       <span className="font-medium">{equipements?.equipmentGroup?.name || '--'}</span>
//                     </div>
                    
//                     <div className="flex items-center justify-between">
//                       <span className="text-sm text-gray-600 flex items-center gap-2">
//                         <MapPin className="h-4 w-4" />
//                         Site
//                       </span>
//                       <span className="font-medium">
//                         {siteDetails?.name || equipements?.siteId || '--'}
//                         {siteDetails?.code && ` (${siteDetails.code})`}
//                       </span>
//                     </div>
                    
//                     <div className="flex items-center justify-between">
//                       <span className="text-sm text-gray-600 flex items-center gap-2">
//                         <Users className="h-4 w-4" />
//                         Créé par
//                       </span>
//                       <span className="font-medium">
//                         {employeeDetails?.name || equipements?.createdBy || '--'}
//                         {employeeDetails?.employeeId && ` (${employeeDetails.employeeId})`}
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Statut et métriques */}
//                 <div className="space-y-4">
//                   <h3 className="text-lg font-semibold flex items-center gap-2">
//                     <Gauge className="h-5 w-5" />
//                     Statut et métriques
//                   </h3>
                  
//                   <div className="space-y-3">
//                     <div className="flex items-center justify-between">
//                       <span className="text-sm text-gray-600">Statut</span>
//                       <Badge className={getStatusColor(equipements?.status)}>
//                         {getStatusLabel(equipements?.status)}
//                       </Badge>
//                     </div>
                    
//                     <div className="flex items-center justify-between">
//                       <span className="text-sm text-gray-600 flex items-center gap-2">
//                         <Clock className="h-4 w-4" />
//                         Mise en service
//                       </span>
//                       <span className="font-medium">{formatDate(equipements?.createdAt)}</span>
//                     </div>
                    
//                     <div className="space-y-2">
//                       <div className="flex items-center justify-between">
//                         <span className="text-sm text-gray-600">Durée de vie utilisée</span>
//                         <span className="text-sm font-medium">{lifePercentage.toFixed(1)}%</span>
//                       </div>
//                       <Progress value={lifePercentage} className="h-2" />
//                       <div className="text-xs text-gray-500 flex justify-between">
//                         <span>Création: {formatDate(equipements?.createdAt)}</span>
//                         <span>Durée de vie: {equipements?.lifeSpan || 0} jours</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Informations techniques */}
//               <div className="border-t pt-6">
//                 <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
//                   <Wrench className="h-5 w-5" />
//                   Informations techniques
//                 </h3>
                
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                   <div className="bg-gray-50 p-4 rounded-lg">
//                     <div className="flex items-center gap-2 mb-2">
//                       <Gauge className="h-4 w-4 text-blue-500" />
//                       <span className="text-sm font-medium">Régime nominal</span>
//                     </div>
//                     <p className="text-2xl font-bold text-blue-600">
//                       {equipements?.operatingMode || '0'}
//                       <span className="text-sm font-normal text-gray-600 ml-1">unités</span>
//                     </p>
//                   </div>
                  
//                   <div className="bg-gray-50 p-4 rounded-lg">
//                     <div className="flex items-center gap-2 mb-2">
//                       <Calendar className="h-4 w-4 text-green-500" />
//                       <span className="text-sm font-medium">Périodicité</span>
//                     </div>
//                     <p className="text-2xl font-bold text-green-600">
//                       {equipements?.periodicity || '0'}
//                       <span className="text-sm font-normal text-gray-600 ml-1">jours</span>
//                     </p>
//                   </div>
                  
//                   <div className="bg-gray-50 p-4 rounded-lg">
//                     <div className="flex items-center gap-2 mb-2">
//                       <RefreshCw className="h-4 w-4 text-purple-500" />
//                       <span className="text-sm font-medium">Durée de vie</span>
//                     </div>
//                     <p className="text-2xl font-bold text-purple-600">
//                       {equipements?.lifeSpan || '0'}
//                       <span className="text-sm font-normal text-gray-600 ml-1">jours</span>
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Informations supplémentaires sur le site */}
//               {siteDetails && (
//                 <div className="border-t pt-6">
//                   <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
//                     <MapPin className="h-5 w-5" />
//                     Détails du site
//                   </h3>
                  
//                   <div className="bg-gray-50 p-4 rounded-lg">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div>
//                         <div className="flex items-center gap-2 mb-1">
//                           <span className="text-sm font-medium">Nom du site:</span>
//                           <span className="font-semibold">{siteDetails.name}</span>
//                         </div>
//                         {siteDetails.code && (
//                           <div className="flex items-center gap-2">
//                             <span className="text-sm font-medium">Code:</span>
//                             <span className="font-mono">{siteDetails.code}</span>
//                           </div>
//                         )}
//                       </div>
//                       {siteDetails.address && (
//                         <div>
//                           <div className="text-sm font-medium mb-1">Adresse:</div>
//                           <div className="text-sm text-gray-600">{siteDetails.address}</div>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Planning de maintenance */}
//               <div className="border-t pt-6">
//                 <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
//                   <Wrench className="h-5 w-5" />
//                   Planning de maintenance
//                 </h3>
                
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className={`p-4 rounded-lg ${equipements?.lastMaintenance ? 'bg-green-50 border border-green-200' : 'bg-gray-50'}`}>
//                     <div className="flex items-center gap-2 mb-2">
//                       <Calendar className={`h-4 w-4 ${equipements?.lastMaintenance ? 'text-green-500' : 'text-gray-400'}`} />
//                       <span className={`text-sm font-medium ${equipements?.lastMaintenance ? 'text-green-700' : 'text-gray-600'}`}>
//                         Dernière maintenance
//                       </span>
//                     </div>
//                     <p className={`text-lg font-bold ${equipements?.lastMaintenance ? 'text-green-600' : 'text-gray-500'}`}>
//                       {equipements?.lastMaintenance ? formatDate(equipements.lastMaintenance) : 'Jamais réalisée'}
//                     </p>
//                   </div>
                  
//                   <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
//                     <div className="flex items-center gap-2 mb-2">
//                       <Calendar className="h-4 w-4 text-blue-500" />
//                       <span className="text-sm font-medium text-blue-700">Prochaine maintenance</span>
//                     </div>
//                     <p className="text-lg font-bold text-blue-600">
//                       {equipements?.nextMaintenance ? formatDate(equipements.nextMaintenance) : 'Non planifiée'}
//                     </p>
//                     {equipements?.nextMaintenance && (
//                       <p className="text-sm text-blue-500 mt-1">
//                         {Math.ceil((new Date(equipements.nextMaintenance) - new Date()) / (1000 * 60 * 60 * 24))} jours restants
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </TabsContent>

//             {/* Opérations */}
//             <TabsContent value="operations" className="mt-0">
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between">
//                   <h3 className="text-lg font-semibold">Historique des opérations</h3>
//                   <Badge className="border border-gray-300">
//                     {equipements?.operations?.length || 0} opération(s)
//                   </Badge>
//                 </div>
//                 <OperationsDataList data={equipements?.operations} />
//               </div>
//             </TabsContent>

//             {/* Mouvements */}
//             <TabsContent value="movements" className="mt-0">
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between">
//                   <h3 className="text-lg font-semibold">Historique des mouvements</h3>
//                   <Badge className="border border-gray-300">
//                     {equipements?.movement?.length || 0} mouvement(s)
//                   </Badge>
//                 </div>
//                 <MovementDataList data={equipements?.movement} />
//               </div>
//             </TabsContent>

//             {/* Maintenance */}
//             <TabsContent value="maintenance" className="mt-0">
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between">
//                   <h3 className="text-lg font-semibold">Historique de maintenance</h3>
//                   <Badge className="border border-gray-300">
//                     {equipements?.maintenance?.length || 0} intervention(s)
//                   </Badge>
//                 </div>
//                 <MaintenanceDataList data={equipements?.maintenance} />
//               </div>
//             </TabsContent>
//           </div>

//           {/* Footer */}
//           <DrawerFooter className="border-t pt-4">
//             <div className="flex items-center justify-between">
//               <div className="text-sm text-gray-500">
//                 Dernière mise à jour: {formatDate(equipements?.updatedAt || equipements?.createdAt)}
//               </div>
//               <div className="flex items-center gap-2">
//                 <DrawerClose asChild>
//                   <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center gap-2 text-sm">
//                     <X className="h-4 w-4" />
//                     Fermer
//                   </button>
//                 </DrawerClose>
//               </div>
//             </div>
//           </DrawerFooter>
//         </div>
//       </DrawerContent>
//     </Drawer>
//   );
// };

// export default EquipementDetails;