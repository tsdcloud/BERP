// import React, {useEffect, useState} from 'react';
// import Header from '../../components/layout/Header';
// import Dialogue from '../../components/incidents/Dialogue';
// import InitiateForm from '../../components/incidents/IncidentType/InitiateForm';
// import Tabs from '../../components/incidents/Tabs';
// import Datalist from '../../components/incidents/IncidentType/Datalist';
// import { useFetch } from '../../hooks/useFetch';
// import { URLS } from '../../../configUrl';
// import { Pagination } from 'antd';

// const IncidentType = () => {
//     const {handleFetch} = useFetch();
//     const [incidentTypes, setIncidentTypes] = useState([]);
//     const [isOpenned, setIsOpenned] = useState(false);
//     const [isLoading, setIsLoading] = useState(true);
//     const [totalPages, setTotalPages] = useState(0);
//     const [total, setTotal] = useState(0);
//     const [page, setPage] = useState(0);
//     const [searchValue, setSearchValue] = useState("");
//     const [pageList, setPageList] = useState([]);

//     const fetchMaintenanceTypes= async (url) => {
//         setIsLoading(true)
//         try {
//            const response = await handleFetch(url);
//            if(response.data){
//             setIncidentTypes(response.data);
//             setTotalPages(response.totalPages);
//             setTotal(response.total);
//             setPage(response.page);
//            }
//         } catch (error) {
//             console.log(error)
//         }finally{
//             setIsLoading(false);
//         }
//     }

//     const handleSubmit=()=>{
//         fetchMaintenanceTypes(`${URLS.INCIDENT_API}/incident-types`);
//         document.getElementById("close-dialog").click();
//     }

//     const handleSearch = async(e)=>{
//         setSearchValue(e.target.value)
//         let url = `${URLS.INCIDENT_API}/incident-types?search=${e.target.value}`;
//         try {
//            const response = await handleFetch(url);
//            if(response.data){
//             setIncidentTypes(response.data);
//             setTotalPages(response.totalPages);
//             setPage(response.page);
//            }
//         } catch (error) {
//             console.log(error)
//         }
//     }


//     useEffect(()=>{
//         fetchMaintenanceTypes(`${URLS.INCIDENT_API}/incident-types`);
//     }, []);

//   return (
//     <>
//         <Header />
//         <div className='px-6'>
//             <div className='flex items-center justify-between'>
//                 {/* Header */}
//                 <div className='max-w-2/3 overflow-x-auto'>
//                     <Tabs />
//                 </div>
                
//             </div>
//             {/* Table */}
//             <div className='w-full bg-white rounded-lg p-2'>
//                 <div className='px-4 flex items-center justify-between'>
//                     <input 
//                         type="text"
//                         className='p-2 text-sm border rounded-lg' 
//                         placeholder='Recherche...' 
//                         value={searchValue}
//                         onChange={handleSearch}
//                     />
//                     {/* Dialog */}
//                 <div className='flex gap-2 items-center'>
                    
//                     <Dialogue 
//                         buttonText={"Nouveau type d'incident"}
//                         header={<h2 className='text-xl font-semibold'>Nouveau type d'incident</h2>}
//                         content={
//                         <InitiateForm 
//                             onSucess={handleSubmit}
//                         />}
//                         isOpenned={isOpenned}
//                     />
//                 </div>
//                 </div>
//                 <Datalist 
//                     dataList={incidentTypes}
//                     fetchData={()=>fetchMaintenanceTypes(`${URLS.INCIDENT_API}/incident-types`)}
//                     loading={isLoading}
//                     pagination={
//                         <div className='flex items-center px-6'>
//                             <p className='text-sm font-bold'>{total} ligne(s)</p>
//                             <Pagination 
//                                 total={total}
//                                 pageSize={totalPages}
//                                 onChange={(page)=>{
//                                     totalPages > page && fetchIncidents(`${URLS.INCIDENT_API}/incident-types?page=${page}`)
//                                 }}
//                             />
//                         </div>
//                     }
//                 />
//             </div>

            
//         </div>
//     </>
//   )
// }

// export default IncidentType

// import React, {useEffect, useState} from 'react';
// import Header from '../../components/layout/Header';
// import Dialogue from '../../components/incidents/Dialogue';
// import InitiateForm from '../../components/incidents/IncidentType/InitiateForm';
// import Tabs from '../../components/incidents/Tabs';
// import Datalist from '../../components/incidents/IncidentType/Datalist';
// import { useFetch } from '../../hooks/useFetch';
// import { URLS } from '../../../configUrl';
// import { Pagination } from 'antd';
// import { Search } from 'lucide-react';
// import { Input } from 'antd';

// const IncidentType = () => {
//     const {handleFetch} = useFetch();
//     const [incidentTypes, setIncidentTypes] = useState([]);
//     const [isOpenned, setIsOpenned] = useState(false);
//     const [isLoading, setIsLoading] = useState(true);
//     const [totalItems, setTotalItems] = useState(0);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [pageSize, setPageSize] = useState(10);
//     const [searchValue, setSearchValue] = useState("");
//     const [editData, setEditData] = useState(null);

//     // Fonction pour construire l'URL avec pagination
//     const buildUrl = (page = currentPage, limit = pageSize, search = searchValue) => {
//         let url = `${URLS.INCIDENT_API}/incident-types?page=${page}&limit=${limit}`;
        
//         if (search && search.trim() !== "") {
//             url += `&search=${encodeURIComponent(search)}`;
//         }
        
//         return url;
//     };

//     const fetchIncidentTypes = async (page = currentPage, size = pageSize) => {
//         setIsLoading(true);
//         try {
//             const url = buildUrl(page, size, searchValue);
//             const response = await handleFetch(url);
            
//             // Vérifier la structure de la réponse
//             // Option 1: Votre API retourne response.data pour les données
//             if (response.data) {
//                 setIncidentTypes(response.data);
                
//                 // Si votre API retourne ces valeurs
//                 if (response.total !== undefined) {
//                     setTotalItems(response.total);
//                 } else {
//                     // Si pas de total, utiliser la longueur des données
//                     setTotalItems(response.data.length);
//                 }
                
//                 if (response.page !== undefined) {
//                     setCurrentPage(response.page);
//                 }
                
//                 if (response.limit !== undefined) {
//                     setPageSize(response.limit);
//                 }
//             }
            
//         } catch (error) {
//             console.error("Erreur lors du chargement:", error);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     // Fonction de recherche
//     const handleSearch = async (e) => {
//         const value = e.target.value;
//         setSearchValue(value);
//         // Réinitialiser à la première page lors d'une recherche
//         await fetchIncidentTypes(1, pageSize);
//     };

//     // Fonction appelée après création/modification
//     const handleSubmit = () => {
//         fetchIncidentTypes(currentPage, pageSize);
//         document.getElementById("close-dialog")?.click();
//         setIsOpenned(false);
//         setEditData(null);
//     };

//     // Fonction pour ouvrir le dialogue d'édition
//     const openEditDialog = (record) => {
//         setEditData(record);
//         setIsOpenned(true);
//     };

//     // Fonction pour ouvrir le dialogue de création
//     const openCreateDialog = () => {
//         setEditData(null);
//         setIsOpenned(true);
//     };

//     // Fonction pour annuler l'édition
//     const handleCancelEdit = () => {
//         setEditData(null);
//         setIsOpenned(false);
//     };

//     // Gestion du changement de page
//     const handlePageChange = (page, size) => {
//         setCurrentPage(page);
//         setPageSize(size);
//         fetchIncidentTypes(page, size);
//     };

//     // Gestion du changement de taille de page
//     const handlePageSizeChange = (current, size) => {
//         setCurrentPage(1);
//         setPageSize(size);
//         fetchIncidentTypes(1, size);
//     };

//     useEffect(() => {
//         fetchIncidentTypes();
//     }, []);

//     // Composant de pagination
//     const paginationComponent = totalItems > 0 ? (
//         <div className='flex flex-col sm:flex-row justify-between items-center px-6 py-4'>
//             <p className='text-sm text-gray-600 mb-2 sm:mb-0'>
//                 {totalItems} ligne{totalItems > 1 ? 's' : ''} trouvée{totalItems > 1 ? 's' : ''}
//             </p>
//             <Pagination 
//                 current={currentPage}
//                 pageSize={pageSize}
//                 total={totalItems}
//                 onChange={handlePageChange}
//                 onShowSizeChange={handlePageSizeChange}
//                 showSizeChanger
//                 showQuickJumper
//                 showTotal={(total, range) => `${range[0]}-${range[1]} sur ${total}`}
//                 pageSizeOptions={['5', '10', '20', '50', '100']}
//                 size="small"
//             />
//         </div>
//     ) : null;

//     return (
//         <>
//             <Header />
//             <div className='px-6'>
//                 <div className='flex items-center justify-between'>
//                     <div className='max-w-2/3 overflow-x-auto'>
//                         <Tabs />
//                     </div>
//                 </div>
                
//                 {/* Table */}
//                 <div className='w-full bg-white rounded-lg p-2 mt-4'>
//                     <div className='px-4 flex items-center justify-between mb-4'>
//                         <div className="relative w-full max-w-md">
//                             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//                             <Input
//                                 type="text"
//                                 className="pl-10 p-2 text-sm border rounded-lg w-full"
//                                 placeholder="Rechercher un type d\'incident..."
//                                 value={searchValue}
//                                 onChange={handleSearch}
//                                 allowClear
//                             />
//                         </div>
                        
//                         {/* Dialog */}
//                         <div className='flex gap-2 items-center'>
//                             <Dialogue 
//                                 buttonText={editData ? "Modifier" : "Nouveau type d'incident"}
//                                 header={
//                                     <h2 className='text-xl font-semibold'>
//                                         {editData ? "Modifier le type d'incident" : "Nouveau type d'incident"}
//                                     </h2>
//                                 }
//                                 content={
//                                     <InitiateForm 
//                                         onSucess={handleSubmit}
//                                         editData={editData}
//                                         onCancelEdit={handleCancelEdit}
//                                     />
//                                 }
//                                 isOpenned={isOpenned}
//                                 onOpenChange={setIsOpenned}
//                                 onTriggerClick={openCreateDialog}
//                             />
//                         </div>
//                     </div>
                    
//                     {/* Datalist */}
//                     <Datalist 
//                         dataList={incidentTypes}
//                         fetchData={() => fetchIncidentTypes(currentPage, pageSize)}
//                         searchValue={searchValue}
//                         loading={isLoading}
//                         totalItems={totalItems}
//                         currentPage={currentPage}
//                         pageSize={pageSize}
//                         onPageChange={handlePageChange}
//                         onPageSizeChange={handlePageSizeChange}
//                         onEditRequest={openEditDialog}
//                     />
                    
//                     {/* Pagination */}
//                     {paginationComponent}
//                 </div>
//             </div>
//         </>
//     );
// }

// export default IncidentType;

import React, {useEffect, useState, useContext} from 'react';
import Header from '../../components/layout/Header';
import Dialogue from '../../components/incidents/Dialogue';
import InitiateForm from '../../components/incidents/IncidentType/InitiateForm';
import Tabs from '../../components/incidents/Tabs';
import Datalist from '../../components/incidents/IncidentType/Datalist';
import { useFetch } from '../../hooks/useFetch';
import { URLS } from '../../../configUrl';
import { Pagination, Input } from 'antd';
import { Search } from 'lucide-react';
import { AUTHCONTEXT } from '../../contexts/AuthProvider';
import { getEmployee } from '../../utils/entity.utils';

const IncidentType = () => {
    const { handleFetch } = useFetch();
    const authContext = useContext(AUTHCONTEXT);
    
    const [incidentTypes, setIncidentTypes] = useState([]);
    const [isOpenned, setIsOpenned] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchValue, setSearchValue] = useState("");
    const [editData, setEditData] = useState(null);
    const [userDomain, setUserDomain] = useState("");
    const [userPermissions, setUserPermissions] = useState([]);
    const [selectedDomain, setSelectedDomain] = useState("ALL");

    // Fonction pour déterminer le domaine utilisateur
    const getUserDomainFromRoles = (rolesArray) => {
        if (!rolesArray || !Array.isArray(rolesArray)) return null;
        
        const normalizedRoles = rolesArray.map(role => role.toLowerCase());
        
        const privilegedRoles = ['admin', 'manager', 'dex'];
        const hasPrivilegedRole = privilegedRoles.some(privilegedRole => 
            normalizedRoles.some(role => role.includes(privilegedRole))
        );
        
        if (hasPrivilegedRole) return "PRIVILEGED";
        if (normalizedRoles.some(role => role.includes('maintenancier'))) return "MAINTENANCE";
        if (normalizedRoles.some(role => role.includes('it'))) return "IT";
        if (normalizedRoles.some(role => ['rop', 'customer manager'].some(r => role.includes(r)))) return "OPERATIONS";
        if (normalizedRoles.some(role => role.includes('hse'))) return "HSE";
        
        return null;
    };

    // Charger les permissions utilisateur
    const loadUserPermissions = async () => {
        try {
            const employee = await getEmployee();
            if (!employee) return;
            
            const employeeRoles = await handleFetch(`${URLS.ENTITY_API}/employees/${employee?.id}/roles`);
            const employeePermissions = await handleFetch(`${URLS.ENTITY_API}/employees/${employee?.id}/permissions`);
            
            const roleNames = employeeRoles?.employeeRoles?.map(r => r.role.roleName) || [];
            const permissionNames = employeePermissions?.employeePermissions?.map(p => p.permission.permissionName) || [];
            
            setUserPermissions(permissionNames);
            
            const domain = getUserDomainFromRoles(roleNames);
            setUserDomain(domain);
            
            console.log("👤 Domaine utilisateur:", domain);
            
        } catch (error) {
            console.error("Erreur chargement permissions:", error);
        }
    };

    // Fonction pour construire l'URL avec pagination, recherche et filtre de domaine
    const buildUrl = (page = currentPage, limit = pageSize, search = searchValue) => {
        let url = `${URLS.INCIDENT_API}/incident-types?page=${page}&limit=${limit}`;
        
        if (search && search.trim() !== "") {
            url += `&search=${encodeURIComponent(search)}`;
        }
        
        // Ajouter le filtre par domaine si sélectionné
        if (selectedDomain && selectedDomain !== "ALL") {
            url += `&domain=${selectedDomain}`;
        }
        
        return url;
    };

    const fetchIncidentTypes = async (page = currentPage, size = pageSize) => {
        setIsLoading(true);
        try {
            const url = buildUrl(page, size, searchValue);
            const response = await handleFetch(url);
            
            if (response.data) {
                setIncidentTypes(response.data);
                
                if (response.total !== undefined) {
                    setTotalItems(response.total);
                } else {
                    setTotalItems(response.data.length);
                }
                
                if (response.page !== undefined) {
                    setCurrentPage(response.page);
                }
                
                if (response.limit !== undefined) {
                    setPageSize(response.limit);
                }
            }
            
        } catch (error) {
            console.error("Erreur lors du chargement:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Fonction de recherche
    const handleSearch = async (e) => {
        const value = e.target.value;
        setSearchValue(value);
        // Réinitialiser à la première page lors d'une recherche
        await fetchIncidentTypes(1, pageSize);
    };

    // Fonction appelée après création/modification
    const handleSubmit = () => {
        fetchIncidentTypes(currentPage, pageSize);
        document.getElementById("close-dialog")?.click();
        setIsOpenned(false);
        setEditData(null);
    };

    // Fonction pour ouvrir le dialogue d'édition
    const openEditDialog = (record) => {
        setEditData(record);
        setIsOpenned(true);
    };

    // Fonction pour ouvrir le dialogue de création
    const openCreateDialog = () => {
        setEditData(null);
        setIsOpenned(true);
    };

    // Fonction pour annuler l'édition
    const handleCancelEdit = () => {
        setEditData(null);
        setIsOpenned(false);
    };

    // Gestion du changement de page
    const handlePageChange = (page, size) => {
        setCurrentPage(page);
        setPageSize(size);
        fetchIncidentTypes(page, size);
    };

    // Gestion du changement de taille de page
    const handlePageSizeChange = (current, size) => {
        setCurrentPage(1);
        setPageSize(size);
        fetchIncidentTypes(1, size);
    };

    // Gestion du changement de domaine
    const handleDomainChange = (domain) => {
        setSelectedDomain(domain);
        setCurrentPage(1); // Réinitialiser à la première page
        fetchIncidentTypes(1, pageSize);
    };

    useEffect(() => {
        loadUserPermissions();
        fetchIncidentTypes();
    }, []);

    useEffect(() => {
        fetchIncidentTypes();
    }, [selectedDomain]);

    // Composant de pagination
    const paginationComponent = totalItems > 0 ? (
        <div className='flex flex-col sm:flex-row justify-between items-center px-6 py-4'>
            <p className='text-sm text-gray-600 mb-2 sm:mb-0'>
                {totalItems} ligne{totalItems > 1 ? 's' : ''} trouvée{totalItems > 1 ? 's' : ''}
            </p>
            <Pagination 
                current={currentPage}
                pageSize={pageSize}
                total={totalItems}
                onChange={handlePageChange}
                onShowSizeChange={handlePageSizeChange}
                showSizeChanger
                showQuickJumper
                showTotal={(total, range) => `${range[0]}-${range[1]} sur ${total}`}
                pageSizeOptions={['5', '10', '20', '50', '100']}
                size="small"
            />
        </div>
    ) : null;

    return (
        <>
            <Header />
            <div className='px-6'>
                <div className='flex items-center justify-between'>
                    <div className='max-w-2/3 overflow-x-auto'>
                        <Tabs />
                    </div>
                </div>
                
                {/* Section d'information et de filtrage */}
                {userDomain && (
                    <div className="mb-4 p-4 bg-gray-50 rounded-lg border mt-4">
                        {/* Filtre par domaine */}
                        <div className="flex flex-wrap items-center gap-2">
                            <label className="text-sm font-medium mr-2">Filtrer par domaine :</label>
                            {["ALL", "IT", "HSE", "OPERATIONS", "MAINTENANCE"].map(domain => (
                                <button
                                    key={domain}
                                    onClick={() => handleDomainChange(domain)}
                                    className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                                        selectedDomain === domain
                                            ? domain === "ALL" ? "bg-gray-800 text-white" :
                                            domain === "IT" ? "bg-blue-600 text-white" :
                                            domain === "HSE" ? "bg-red-600 text-white" :
                                            domain === "OPERATIONS" ? "bg-green-600 text-white" :
                                            domain === "MAINTENANCE" ? "bg-yellow-600 text-white" :
                                            "bg-gray-600 text-white"
                                            : domain === "ALL" ? "bg-gray-100 text-gray-800 hover:bg-gray-200" :
                                            domain === "IT" ? "bg-blue-100 text-blue-800 hover:bg-blue-200" :
                                            domain === "HSE" ? "bg-red-100 text-red-800 hover:bg-red-200" :
                                            domain === "OPERATIONS" ? "bg-green-100 text-green-800 hover:bg-green-200" :
                                            domain === "MAINTENANCE" ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200" :
                                            "bg-gray-100 text-gray-800 hover:bg-gray-200"
                                    }`}
                                >
                                    {domain === "ALL" ? "Tous les domaines" : domain}
                                </button>
                            ))}
                            
                            {/* Indicateur de domaine utilisateur */}
                            {/* <div className="ml-auto flex items-center gap-2">
                                <span className="text-xs text-gray-500">
                                    Domaine utilisateur : 
                                </span>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                    userDomain === "PRIVILEGED" ? "bg-purple-100 text-purple-800" :
                                    userDomain === "IT" ? "bg-blue-100 text-blue-800" :
                                    userDomain === "HSE" ? "bg-red-100 text-red-800" :
                                    userDomain === "OPERATIONS" ? "bg-green-100 text-green-800" :
                                    userDomain === "MAINTENANCE" ? "bg-yellow-100 text-yellow-800" :
                                    "bg-gray-100 text-gray-800"
                                }`}>
                                    {userDomain === "PRIVILEGED" ? "Privilégié" : userDomain}
                                </span>
                            </div> */}
                        </div>
                    </div>
                )}
                
                {/* Table */}
                <div className='w-full bg-white rounded-lg p-2 mt-2'>
                    <div className='px-4 flex items-center justify-between mb-4'>
                        <div className="relative w-full max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                type="text"
                                className="pl-10 p-2 text-sm border rounded-lg w-full"
                                placeholder="Rechercher un type d'incident..."
                                value={searchValue}
                                onChange={handleSearch}
                                allowClear
                            />
                        </div>
                        
                        {/* Dialog */}
                        <div className='flex gap-2 items-center'>
                            {/* {userPermissions.includes("incident__can_create_incident_type") && ( */}
                                <Dialogue 
                                    buttonText={editData ? "Modifier" : "Nouveau type d'incident"}
                                    header={
                                        <h2 className='text-xl font-semibold'>
                                            {editData ? "Modifier le type d'incident" : "Nouveau type d'incident"}
                                        </h2>
                                    }
                                    content={
                                        <InitiateForm 
                                            onSucess={handleSubmit}
                                            editData={editData}
                                            onCancelEdit={handleCancelEdit}
                                            userDomain={userDomain}
                                        />
                                    }
                                    isOpenned={isOpenned}
                                    onOpenChange={setIsOpenned}
                                    onTriggerClick={openCreateDialog}
                                />
                            {/* )} */}
                        </div>
                    </div>
                    
                    {/* Datalist */}
                    <Datalist 
                        dataList={incidentTypes}
                        fetchData={() => fetchIncidentTypes(currentPage, pageSize)}
                        searchValue={searchValue}
                        loading={isLoading}
                        totalItems={totalItems}
                        currentPage={currentPage}
                        pageSize={pageSize}
                        onPageChange={handlePageChange}
                        onPageSizeChange={handlePageSizeChange}
                        onEditRequest={openEditDialog}
                        userDomain={userDomain}
                        userPermissions={userPermissions}
                        selectedDomain={selectedDomain}
                    />
                    
                    {/* Pagination */}
                    {paginationComponent}
                </div>
            </div>
        </>
    );
}

export default IncidentType;