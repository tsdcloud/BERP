// import React, {useEffect, useState} from 'react';
// import Header from '../../components/layout/Header';
// import Dialogue from '../../components/incidents/Dialogue';
// import InitiateForm from '../../components/incidents/IncidentCauses/InitiateForm';
// import Tabs from '../../components/incidents/Tabs';
// import Datalist from '../../components/incidents/IncidentCauses/Datalist';
// import { useFetch } from '../../hooks/useFetch';
// import { URLS } from '../../../configUrl';
// import { Pagination } from 'antd';

// const IncidentCauses = () => {

//     const {handleFetch} = useFetch();
//     const [incidentCauses, setIncidentCauses] = useState([]);
//     const [isOpenned, setIsOpenned] = useState(false);
//     const [isLoading, setIsLoading] = useState(true);
//     const [totalPages, setTotalPages] = useState(0);
//     const [total, setTotal] = useState(0);
//     const [page, setPage] = useState(0);
//     const [searchValue, setSearchValue] = useState("");
//     const [pageList, setPageList] = useState([]);

//     const fetchIncidentCauses= async (url) => {
//         setIsLoading(true);
//         try {
//            const response = await handleFetch(url);
//            if(response.data){
//             setIncidentCauses(response.data);
//             setTotalPages(response.totalPages);
//             setTotal(response.total);
//             setPage(response.page);
//            }
//         } catch (error) {
//             console.log(error)
//         }finally{
//             setIsLoading(false)
//         }
//     }

//     const handleSubmit=()=>{
//         fetchIncidentCauses(`${URLS.INCIDENT_API}/incident-causes`);
//         document.getElementById("close-dialog").click();
//     }

//     const handleSearch =(e)=>{
//         setSearchValue(e.target.value)
//         try {
//             fetchIncidentCauses(`${URLS.INCIDENT_API}/incident-causes?search=${e.target.value}`)
//         } catch (error) {
//             console.log(error)
//         }
//     }
//     useEffect(()=>{
//         fetchIncidentCauses(`${URLS.INCIDENT_API}/incident-causes`);
//     }, []);

//   return (
//     <>
//         <Header />
//         <div className='px-6'>
//             <div className='flex items-center justify-between'>
//                 {/* Header */}
//                 <div className='overflow-x-auto'>
//                     <Tabs />
//                 </div>
//             </div>
//             {/* Table */}
//             <div className='w-full bg-white rounded-lg p-2'>
//                 <div className='px-4 flex items-center justify-between'>
//                     <input 
//                         type="text" 
//                         placeholder='Recherch' 
//                         className='p-2 rounded-lg border'
//                         value={searchValue}
//                         onChange={handleSearch}
//                     />
//                     {/* Dialog */}
//                     <div className='flex gap-2 items-center'>
//                         <Dialogue 
//                             buttonText={"Créer une cause d'incident"}
//                             header={<h2 className='text-xl font-semibold'>Créer une cause d'incident</h2>}
//                             content={
//                             <InitiateForm 
//                                 onSucess={handleSubmit}
//                             />}
//                             isOpenned={isOpenned}
//                         />
//                     </div>
//                 </div>
//                 <Datalist 
//                     dataList={incidentCauses}
//                     fetchData={()=>fetchIncidentCauses(`${URLS.INCIDENT_API}/incident-causes`)}
//                     loading={isLoading}
//                     searchValue={searchValue}
//                     pagination={
//                         <div className='flex items-center px-6'>
//                                 <p className='text-sm font-bold'>{total} ligne(s)</p>
//                                 <Pagination 
//                                     total={total}
//                                     pageSize={100}
//                                     onChange={(page)=>{
//                                         totalPages > page && fetchIncidentCauses(`${URLS.INCIDENT_API}/incident-causes?page=${page}`)
//                                     }}
//                                 />
//                         </div>
//                     }
//                 />
//             </div>

            
//         </div>
//     </>
//   )
// }

// export default IncidentCauses

import React, {useEffect, useState, useContext} from 'react';
import Header from '../../components/layout/Header';
import Dialogue from '../../components/incidents/Dialogue';
import InitiateForm from '../../components/incidents/IncidentCauses/InitiateForm';
import EditForm from '../../components/incidents/IncidentCauses/EditForm';
import Tabs from '../../components/incidents/Tabs';
import Datalist from '../../components/incidents/IncidentCauses/Datalist';
import { useFetch } from '../../hooks/useFetch';
import { URLS } from '../../../configUrl';
import { Pagination } from 'antd';
import { Button } from '../../components/ui/button';
import { XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { AUTHCONTEXT } from '../../contexts/AuthProvider';
import { getEmployee } from '../../utils/entity.utils';

const IncidentCauses = () => {
    const {handleFetch} = useFetch();
    const authContext = useContext(AUTHCONTEXT);
    
    const [incidentCauses, setIncidentCauses] = useState([]);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingCause, setEditingCause] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(0);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1); // Changez à 1 (première page)
    const [pageSize, setPageSize] = useState(10); // Ajoutez pageSize
    const [searchValue, setSearchValue] = useState("");
    const [currentFilter, setCurrentFilter] = useState(null);
    const [filterField, setFilterField] = useState('name');
    const [filterValue, setFilterValue] = useState('');
    const [selectedDomain, setSelectedDomain] = useState("ALL");
    const [userDomain, setUserDomain] = useState("");
    const [userPermissions, setUserPermissions] = useState([]);

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
            
            console.log("👤 Domaine utilisateur (causes):", domain);
            
        } catch (error) {
            console.error("Erreur chargement permissions:", error);
        }
    };

    const fetchIncidentCauses = async (params = {}) => {
        setIsLoading(true);
        try {
            let url = `${URLS.INCIDENT_API}/incident-causes`;
            const queryParams = new URLSearchParams();
            
            // Ajouter la pagination
            const currentPage = params.page || page;
            const currentPageSize = params.pageSize || pageSize;
            
            queryParams.append('page', currentPage);
            queryParams.append('limit', currentPageSize);
            
            // Ajouter la recherche si présente
            if (params.search !== undefined) {
                queryParams.append('search', params.search);
            } else if (searchValue) {
                queryParams.append('search', searchValue);
            }
            
            // Ajouter le filtre si présent
            if (params.filter && params.value) {
                queryParams.append(params.filter, params.value);
            }
            
            // Ajouter le filtre par domaine si sélectionné
            if (selectedDomain && selectedDomain !== "ALL") {
                queryParams.append('domain', selectedDomain);
            }
            
            // Construire l'URL finale
            const queryString = queryParams.toString();
            if (queryString) {
                url += `?${queryString}`;
            }
            
            console.log("Fetching causes with URL:", url);
            const response = await handleFetch(url);
            
            if(response && response.data){
                setIncidentCauses(response.data);
                setTotalPages(response.totalPages || 0);
                setTotal(response.total || 0);
                setPage(response.page || currentPage);
                if (response.limit) {
                    setPageSize(response.limit);
                }
            }
        } catch (error) {
            console.error("Erreur lors du chargement des causes d'incident:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = () => {
        // Réinitialiser à la première page après création
        setPage(1);
        fetchIncidentCauses({ page: 1 });
        setIsCreateOpen(false);
    };

    const handleEditSubmit = () => {
        fetchIncidentCauses();
        setIsEditOpen(false);
        setEditingCause(null);
    };

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchValue(value);
        
        // Réinitialiser à la première page lors d'une nouvelle recherche
        setPage(1);
        
        if (value) {
            setCurrentFilter({ filter: 'search', value });
            fetchIncidentCauses({ search: value, page: 1 });
        } else {
            setCurrentFilter(null);
            fetchIncidentCauses({ page: 1 });
        }
    };

    const handleFilterChange = (e) => {
        const value = e.target.value;
        setFilterField(value);
        setFilterValue('');
        setCurrentFilter(null);
        
        // Réinitialiser à la première page
        setPage(1);
        fetchIncidentCauses({ page: 1 });
    };

    const handleFilterValueChange = (e) => {
        const value = e.target.value;
        setFilterValue(value);
        
        // Réinitialiser à la première page
        setPage(1);
        
        if (value) {
            setCurrentFilter({ filter: filterField, value });
            
            // Construire l'objet de paramètres
            const params = { page: 1 };
            if (filterField === 'incidentTypeId') {
                params.incidentTypeId = value;
            } else if (filterField === 'createdBy') {
                params.createdBy = value;
            } else {
                params[filterField] = value;
            }
            
            fetchIncidentCauses(params);
        } else {
            setCurrentFilter(null);
            fetchIncidentCauses({ page: 1 });
        }
    };

    // Gestion du changement de domaine
    const handleDomainChange = (domain) => {
        setSelectedDomain(domain);
        setPage(1); // Réinitialiser à la première page
        fetchIncidentCauses({ page: 1 });
    };

    const handleOpenEdit = (cause) => {
        setEditingCause(cause);
        setIsEditOpen(true);
    };

    const resetFilters = () => {
        setSearchValue('');
        setFilterField('name');
        setFilterValue('');
        setCurrentFilter(null);
        setSelectedDomain("ALL");
        setPage(1); // Réinitialiser à la première page
        fetchIncidentCauses({ page: 1 });
    };

    // Gestion du changement de page
    const handlePageChange = (newPage, newPageSize) => {
        console.log("Changement de page:", newPage, "taille:", newPageSize);
        
        setPage(newPage);
        if (newPageSize && newPageSize !== pageSize) {
            setPageSize(newPageSize);
            setPage(1); // Retourner à la première page quand on change la taille
        }
        
        const params = { page: newPage, pageSize: newPageSize || pageSize };
        
        if (currentFilter) {
            // Utiliser le filtre actuel
            if (currentFilter.filter === 'search') {
                params.search = currentFilter.value;
            } else {
                params[currentFilter.filter] = currentFilter.value;
            }
        } else if (searchValue) {
            params.search = searchValue;
        }
        
        fetchIncidentCauses(params);
    };

    // Vérifier si l'utilisateur peut créer une cause d'incident
    const canCreateIncidentCause = () => {
        // Si l'utilisateur a la permission spécifique
        if (userPermissions.includes("incident__can_create_incident_cause")) {
            return true;
        }
        
        // Si l'utilisateur est privilégié
        if (userDomain === "PRIVILEGED") {
            return true;
        }
        
        // Si l'utilisateur a un domaine défini
        if (userDomain && userDomain !== "PRIVILEGED") {
            return true;
        }
        
        return false;
    };

    // Charger les données initiales
    useEffect(() => {
        loadUserPermissions();
        fetchIncidentCauses();
    }, []);

    useEffect(() => {
        fetchIncidentCauses();
    }, [selectedDomain]);

    const filterOptions = [
        { value: 'name', label: 'Nom' },
        { value: 'incidentTypeId', label: "Type d'incident" },
        { value: 'createdBy', label: 'Créé par' }
    ];

    const getCurrentFilterLabel = () => {
        const option = filterOptions.find(f => f.value === filterField);
        return option ? option.label.toLowerCase() : 'critère';
    };

    return (
        <>
            <Header />
            <div className='px-4 md:px-6'>
                {/* Tabs de navigation */}
                <div className='flex items-center justify-between mb-4'>
                    <Tabs />
                </div>
                
                {/* Section de filtrage par domaine */}
                {userDomain && (
                    <div className="mb-4 p-4 bg-gray-50 rounded-lg border">
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
                        </div>
                    </div>
                )}
                
                {/* Conteneur principal */}
                <div className='w-full bg-white rounded-lg p-4 shadow-sm'>
                    {/* Barre d'actions avec filtres */}
                    <div className='flex flex-col md:flex-row items-center justify-between gap-4 mb-6'>
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full">
                            {/* Barre de recherche principale */}
                            <div className="relative w-full md:w-64">
                                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input 
                                    type="text" 
                                    placeholder='Rechercher par nom...' 
                                    className='pl-10 pr-4 py-2 rounded-lg border w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                    value={searchValue}
                                    onChange={handleSearch}
                                />
                            </div>
                            
                            {/* Filtres avancés */}
                            <div className="flex flex-col md:flex-row items-start md:items-center gap-2 w-full md:w-auto">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600 whitespace-nowrap">Filtrer par:</span>
                                    <select 
                                        className="py-2 px-3 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={filterField}
                                        onChange={handleFilterChange}
                                    >
                                        {filterOptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div className="relative flex-1 md:w-48">
                                    <input 
                                        type="text" 
                                        placeholder={`Filtrer par ${getCurrentFilterLabel()}`}
                                        className='py-2 px-3 rounded-lg border w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                        value={filterValue}
                                        onChange={handleFilterValueChange}
                                    />
                                </div>
                            </div>
                            
                            {/* Bouton de réinitialisation */}
                            {(searchValue || filterValue || selectedDomain !== "ALL") && (
                                <Button
                                    variant="outline"
                                    onClick={resetFilters}
                                    className="flex items-center gap-2 h-10 text-sm"
                                >
                                    <XMarkIcon className="h-4 w-4" />
                                    Réinitialiser
                                </Button>
                            )}
                        </div>
                        
                        {/* Bouton de création */}
                        <div className='w-full md:w-auto'>
                            <Dialogue 
                                buttonText={"Créer une cause d'incident"}
                                header={<h2 className='text-xl font-semibold'>Créer une cause d'incident</h2>}
                                content={
                                    <InitiateForm 
                                        onSucess={handleSubmit}
                                        userDomain={userDomain}
                                    />
                                }
                                isOpenned={isCreateOpen}
                                onOpenChange={setIsCreateOpen}
                                disabled={!canCreateIncidentCause()}
                                tooltip={!canCreateIncidentCause() ? "Vous n'avez pas la permission de créer une cause d'incident" : ""}
                            />
                        </div>
                    </div>
                    
                    {/* Tableau des données */}
                    <div className="border rounded-lg overflow-hidden">
                        <Datalist 
                            dataList={incidentCauses}
                            fetchData={() => fetchIncidentCauses()}
                            loading={isLoading}
                            searchValue={searchValue}
                            onEdit={handleOpenEdit}
                            userDomain={userDomain}
                            userPermissions={userPermissions}
                            selectedDomain={selectedDomain}
                            currentPage={page}
                            pageSize={pageSize}
                            totalItems={total}
                            onPageChange={handlePageChange}
                        />
                        
                        {/* Pagination en bas */}
                        {total > 0 && (
                            <div className='flex flex-col md:flex-row items-center justify-between px-6 py-4 border-t bg-gray-50'>
                                <p className='text-sm font-medium text-gray-700 mb-2 md:mb-0'>
                                    Affichage de {((page - 1) * pageSize) + 1} à {Math.min(page * pageSize, total)} sur {total} ligne{total !== 1 ? 's' : ''}
                                    {selectedDomain !== "ALL" && (
                                        <span className="text-blue-600 ml-2">
                                            (Filtré par domaine: {selectedDomain})
                                        </span>
                                    )}
                                </p>
                                <div className="flex items-center">
                                    <Pagination 
                                        current={page}
                                        pageSize={pageSize}
                                        total={total}
                                        onChange={handlePageChange}
                                        onShowSizeChange={handlePageChange}
                                        showSizeChanger
                                        showQuickJumper
                                        showTotal={(total, range) => `${range[0]}-${range[1]} sur ${total}`}
                                        pageSizeOptions={['5', '10', '20', '50', '100']}
                                        size="small"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal d'édition */}
            {isEditOpen && (
                <Dialogue 
                    buttonText={null}
                    header={<h2 className='text-xl font-semibold'>Modifier la cause d'incident</h2>}
                    content={
                        editingCause ? (
                            <EditForm 
                                cause={editingCause}
                                onSucess={handleEditSubmit}
                                onCancel={() => {
                                    setIsEditOpen(false);
                                    setEditingCause(null);
                                }}
                                userDomain={userDomain}
                            />
                        ) : (
                            <div className="p-6 text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                                <p className="mt-2 text-gray-600">Chargement des données...</p>
                            </div>
                        )
                    }
                    isOpenned={isEditOpen}
                    onOpenChange={(open) => {
                        setIsEditOpen(open);
                        if (!open) {
                            setEditingCause(null);
                        }
                    }}
                />
            )}
            
            {/* Styles pour la pagination */}
            <style jsx>{`
                :global(.ant-pagination-custom .ant-pagination-item) {
                    border-radius: 6px;
                }
                :global(.ant-pagination-custom .ant-pagination-item-active) {
                    background-color: #3b82f6;
                    border-color: #3b82f6;
                }
                :global(.ant-pagination-custom .ant-pagination-item-active a) {
                    color: white;
                }
                :global(.ant-pagination-custom .ant-pagination-item:hover) {
                    border-color: #3b82f6;
                }
            `}</style>
        </>
    );
};

export default IncidentCauses;

// import React, {useEffect, useState, useContext} from 'react';
// import Header from '../../components/layout/Header';
// import Dialogue from '../../components/incidents/Dialogue';
// import InitiateForm from '../../components/incidents/IncidentCauses/InitiateForm';
// import EditForm from '../../components/incidents/IncidentCauses/EditForm';
// import Tabs from '../../components/incidents/Tabs';
// import Datalist from '../../components/incidents/IncidentCauses/Datalist';
// import { useFetch } from '../../hooks/useFetch';
// import { URLS } from '../../../configUrl';
// import { Pagination } from 'antd';
// import { Button } from '../../components/ui/button';
// import { XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
// import { AUTHCONTEXT } from '../../contexts/AuthProvider';
// import { getEmployee } from '../../utils/entity.utils';

// const IncidentCauses = () => {
//     const {handleFetch} = useFetch();
//     const authContext = useContext(AUTHCONTEXT);
    
//     const [incidentCauses, setIncidentCauses] = useState([]);
//     const [isCreateOpen, setIsCreateOpen] = useState(false);
//     const [isEditOpen, setIsEditOpen] = useState(false);
//     const [editingCause, setEditingCause] = useState(null);
//     const [isLoading, setIsLoading] = useState(true);
//     const [totalPages, setTotalPages] = useState(0);
//     const [total, setTotal] = useState(0);
//     const [page, setPage] = useState(0);
//     const [searchValue, setSearchValue] = useState("");
//     const [currentFilter, setCurrentFilter] = useState(null);
//     const [filterField, setFilterField] = useState('name');
//     const [filterValue, setFilterValue] = useState('');
//     const [selectedDomain, setSelectedDomain] = useState("ALL");
//     const [userDomain, setUserDomain] = useState("");
//     const [userPermissions, setUserPermissions] = useState([]);

//     // Fonction pour déterminer le domaine utilisateur
//     const getUserDomainFromRoles = (rolesArray) => {
//         if (!rolesArray || !Array.isArray(rolesArray)) return null;
        
//         const normalizedRoles = rolesArray.map(role => role.toLowerCase());
        
//         const privilegedRoles = ['admin', 'manager', 'dex'];
//         const hasPrivilegedRole = privilegedRoles.some(privilegedRole => 
//             normalizedRoles.some(role => role.includes(privilegedRole))
//         );
        
//         if (hasPrivilegedRole) return "PRIVILEGED";
//         if (normalizedRoles.some(role => role.includes('maintenancier'))) return "MAINTENANCE";
//         if (normalizedRoles.some(role => role.includes('it'))) return "IT";
//         if (normalizedRoles.some(role => ['rop', 'customer manager'].some(r => role.includes(r)))) return "OPERATIONS";
//         if (normalizedRoles.some(role => role.includes('hse'))) return "HSE";
        
//         return null;
//     };

//     // Charger les permissions utilisateur
//     const loadUserPermissions = async () => {
//         try {
//             const employee = await getEmployee();
//             if (!employee) return;
            
//             const employeeRoles = await handleFetch(`${URLS.ENTITY_API}/employees/${employee?.id}/roles`);
//             const employeePermissions = await handleFetch(`${URLS.ENTITY_API}/employees/${employee?.id}/permissions`);
            
//             const roleNames = employeeRoles?.employeeRoles?.map(r => r.role.roleName) || [];
//             const permissionNames = employeePermissions?.employeePermissions?.map(p => p.permission.permissionName) || [];
            
//             setUserPermissions(permissionNames);
            
//             const domain = getUserDomainFromRoles(roleNames);
//             setUserDomain(domain);
            
//             console.log("👤 Domaine utilisateur (causes):", domain);
            
//         } catch (error) {
//             console.error("Erreur chargement permissions:", error);
//         }
//     };

//     const fetchIncidentCauses = async (params = {}) => {
//         setIsLoading(true);
//         try {
//             let url = `${URLS.INCIDENT_API}/incident-causes`;
//             const queryParams = new URLSearchParams();
            
//             // Ajouter la pagination
//             if (params.page) {
//                 queryParams.append('page', params.page);
//             }
            
//             // Ajouter la recherche si présente
//             if (params.search) {
//                 queryParams.append('search', params.search);
//             }
            
//             // Ajouter le filtre si présent
//             if (params.filter && params.value) {
//                 queryParams.append(params.filter, params.value);
//             }
            
//             // Ajouter le filtre par domaine si sélectionné
//             if (selectedDomain && selectedDomain !== "ALL") {
//                 queryParams.append('domain', selectedDomain);
//             }
            
//             // Construire l'URL finale
//             const queryString = queryParams.toString();
//             if (queryString) {
//                 url += `?${queryString}`;
//             }
            
//             console.log("Fetching causes with URL:", url);
//             const response = await handleFetch(url);
            
//             if(response && response.data){
//                 setIncidentCauses(response.data);
//                 setTotalPages(response.totalPages || 0);
//                 setTotal(response.total || 0);
//                 setPage(response.page || 0);
//             }
//         } catch (error) {
//             console.error("Erreur lors du chargement des causes d'incident:", error);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const handleSubmit = () => {
//         fetchIncidentCauses();
//         setIsCreateOpen(false);
//     };

//     const handleEditSubmit = () => {
//         fetchIncidentCauses();
//         setIsEditOpen(false);
//         setEditingCause(null);
//     };

//     const handleSearch = (e) => {
//         const value = e.target.value;
//         setSearchValue(value);
        
//         if (value) {
//             setCurrentFilter({ filter: 'search', value });
//             fetchIncidentCauses({ search: value });
//         } else {
//             setCurrentFilter(null);
//             fetchIncidentCauses();
//         }
//     };

//     const handleFilterChange = (e) => {
//         const value = e.target.value;
//         setFilterField(value);
//         setFilterValue('');
//         setCurrentFilter(null);
        
//         // Si on change de filtre, réinitialiser la liste
//         fetchIncidentCauses();
//     };

//     const handleFilterValueChange = (e) => {
//         const value = e.target.value;
//         setFilterValue(value);
        
//         if (value) {
//             setCurrentFilter({ filter: filterField, value });
            
//             // Construire l'objet de paramètres
//             const params = {};
//             if (filterField === 'incidentTypeId') {
//                 params.incidentTypeId = value;
//             } else if (filterField === 'createdBy') {
//                 params.createdBy = value;
//             } else {
//                 params[filterField] = value;
//             }
            
//             fetchIncidentCauses(params);
//         } else {
//             setCurrentFilter(null);
//             fetchIncidentCauses();
//         }
//     };

//     // Gestion du changement de domaine
//     const handleDomainChange = (domain) => {
//         setSelectedDomain(domain);
//         setCurrentPage(1);
//         fetchIncidentCauses();
//     };

//     const handleOpenEdit = (cause) => {
//         setEditingCause(cause);
//         setIsEditOpen(true);
//     };

//     const resetFilters = () => {
//         setSearchValue('');
//         setFilterField('name');
//         setFilterValue('');
//         setCurrentFilter(null);
//         setSelectedDomain("ALL");
//         fetchIncidentCauses();
//     };

//     const handlePageChange = (newPage) => {
//         if (newPage <= totalPages) {
//             const params = { page: newPage };
//             if (currentFilter) {
//                 // Utiliser le filtre actuel
//                 if (currentFilter.filter === 'search') {
//                     params.search = currentFilter.value;
//                 } else {
//                     params[currentFilter.filter] = currentFilter.value;
//                 }
//             }
//             fetchIncidentCauses(params);
//         }
//     };

//     // Vérifier si l'utilisateur peut créer une cause d'incident
//     const canCreateIncidentCause = () => {
//         // Si l'utilisateur a la permission spécifique
//         if (userPermissions.includes("incident__can_create_incident_cause")) {
//             return true;
//         }
        
//         // Si l'utilisateur est privilégié
//         if (userDomain === "PRIVILEGED") {
//             return true;
//         }
        
//         // Si l'utilisateur a un domaine défini
//         if (userDomain && userDomain !== "PRIVILEGED") {
//             return true;
//         }
        
//         return false;
//     };

//     // Charger les données initiales
//     useEffect(() => {
//         loadUserPermissions();
//         fetchIncidentCauses();
//     }, []);

//     useEffect(() => {
//         fetchIncidentCauses();
//     }, [selectedDomain]);

//     const filterOptions = [
//         { value: 'name', label: 'Nom' },
//         { value: 'incidentTypeId', label: "Type d'incident" },
//         { value: 'createdBy', label: 'Créé par' }
//     ];

//     const getCurrentFilterLabel = () => {
//         const option = filterOptions.find(f => f.value === filterField);
//         return option ? option.label.toLowerCase() : 'critère';
//     };

//     return (
//         <>
//             <Header />
//             <div className='px-4 md:px-6'>
//                 {/* Tabs de navigation */}
//                 <div className='flex items-center justify-between mb-4'>
//                     <Tabs />
//                 </div>
                
//                 {/* Section de filtrage par domaine */}
//                 {userDomain && (
//                     <div className="mb-4 p-4 bg-gray-50 rounded-lg border">
//                         <div className="flex flex-wrap items-center gap-2">
//                             <label className="text-sm font-medium mr-2">Filtrer par domaine :</label>
//                             {["ALL", "IT", "HSE", "OPERATIONS", "MAINTENANCE"].map(domain => (
//                                 <button
//                                     key={domain}
//                                     onClick={() => handleDomainChange(domain)}
//                                     className={`px-3 py-1 rounded-full text-sm border transition-colors ${
//                                         selectedDomain === domain
//                                             ? domain === "ALL" ? "bg-gray-800 text-white" :
//                                             domain === "IT" ? "bg-blue-600 text-white" :
//                                             domain === "HSE" ? "bg-red-600 text-white" :
//                                             domain === "OPERATIONS" ? "bg-green-600 text-white" :
//                                             domain === "MAINTENANCE" ? "bg-yellow-600 text-white" :
//                                             "bg-gray-600 text-white"
//                                             : domain === "ALL" ? "bg-gray-100 text-gray-800 hover:bg-gray-200" :
//                                             domain === "IT" ? "bg-blue-100 text-blue-800 hover:bg-blue-200" :
//                                             domain === "HSE" ? "bg-red-100 text-red-800 hover:bg-red-200" :
//                                             domain === "OPERATIONS" ? "bg-green-100 text-green-800 hover:bg-green-200" :
//                                             domain === "MAINTENANCE" ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200" :
//                                             "bg-gray-100 text-gray-800 hover:bg-gray-200"
//                                     }`}
//                                 >
//                                     {domain === "ALL" ? "Tous les domaines" : domain}
//                                 </button>
//                             ))}
                            
//                             {/* Indicateur de domaine utilisateur */}
//                             {/* <div className="ml-auto flex items-center gap-2">
//                                 <span className="text-xs text-gray-500">
//                                     Domaine utilisateur : 
//                                 </span>
//                                 <span className={`px-2 py-1 rounded text-xs font-medium ${
//                                     userDomain === "PRIVILEGED" ? "bg-purple-100 text-purple-800" :
//                                     userDomain === "IT" ? "bg-blue-100 text-blue-800" :
//                                     userDomain === "HSE" ? "bg-red-100 text-red-800" :
//                                     userDomain === "OPERATIONS" ? "bg-green-100 text-green-800" :
//                                     userDomain === "MAINTENANCE" ? "bg-yellow-100 text-yellow-800" :
//                                     "bg-gray-100 text-gray-800"
//                                 }`}>
//                                     {userDomain === "PRIVILEGED" ? "Privilégié" : userDomain}
//                                 </span>
//                             </div> */}
//                         </div>
//                     </div>
//                 )}
                
//                 {/* Conteneur principal */}
//                 <div className='w-full bg-white rounded-lg p-4 shadow-sm'>
//                     {/* Barre d'actions avec filtres */}
//                     <div className='flex flex-col md:flex-row items-center justify-between gap-4 mb-6'>
//                         <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full">
//                             {/* Barre de recherche principale */}
//                             <div className="relative w-full md:w-64">
//                                 <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//                                 <input 
//                                     type="text" 
//                                     placeholder='Rechercher par nom...' 
//                                     className='pl-10 pr-4 py-2 rounded-lg border w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
//                                     value={searchValue}
//                                     onChange={handleSearch}
//                                 />
//                             </div>
                            
//                             {/* Filtres avancés */}
//                             <div className="flex flex-col md:flex-row items-start md:items-center gap-2 w-full md:w-auto">
//                                 <div className="flex items-center gap-2">
//                                     <span className="text-sm text-gray-600 whitespace-nowrap">Filtrer par:</span>
//                                     <select 
//                                         className="py-2 px-3 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                         value={filterField}
//                                         onChange={handleFilterChange}
//                                     >
//                                         {filterOptions.map(option => (
//                                             <option key={option.value} value={option.value}>
//                                                 {option.label}
//                                             </option>
//                                         ))}
//                                     </select>
//                                 </div>
                                
//                                 <div className="relative flex-1 md:w-48">
//                                     <input 
//                                         type="text" 
//                                         placeholder={`Filtrer par ${getCurrentFilterLabel()}`}
//                                         className='py-2 px-3 rounded-lg border w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
//                                         value={filterValue}
//                                         onChange={handleFilterValueChange}
//                                     />
//                                 </div>
//                             </div>
                            
//                             {/* Bouton de réinitialisation */}
//                             {(searchValue || filterValue || selectedDomain !== "ALL") && (
//                                 <Button
//                                     variant="outline"
//                                     onClick={resetFilters}
//                                     className="flex items-center gap-2 h-10 text-sm"
//                                 >
//                                     <XMarkIcon className="h-4 w-4" />
//                                     Réinitialiser
//                                 </Button>
//                             )}
//                         </div>
                        
//                         {/* Bouton de création */}
//                         <div className='w-full md:w-auto'>
//                             <Dialogue 
//                                 buttonText={"Créer une cause d'incident"}
//                                 header={<h2 className='text-xl font-semibold'>Créer une cause d'incident</h2>}
//                                 content={
//                                     <InitiateForm 
//                                         onSucess={handleSubmit}
//                                         userDomain={userDomain}
//                                     />
//                                 }
//                                 isOpenned={isCreateOpen}
//                                 onOpenChange={setIsCreateOpen}
//                                 disabled={!canCreateIncidentCause()}
//                                 tooltip={!canCreateIncidentCause() ? "Vous n'avez pas la permission de créer une cause d'incident" : ""}
//                             />
//                         </div>
//                     </div>
                    
//                     {/* Tableau des données */}
//                     <div className="border rounded-lg overflow-hidden">
//                         <Datalist 
//                             dataList={incidentCauses}
//                             fetchData={() => fetchIncidentCauses(currentFilter || {})}
//                             loading={isLoading}
//                             searchValue={searchValue}
//                             onEdit={handleOpenEdit}
//                             userDomain={userDomain}
//                             userPermissions={userPermissions}
//                             selectedDomain={selectedDomain}
//                             pagination={
//                                 <div className='flex flex-col md:flex-row items-center justify-between px-6 py-4 border-t bg-gray-50'>
//                                     <p className='text-sm font-medium text-gray-700 mb-2 md:mb-0'>
//                                         {total} ligne{total !== 1 ? 's' : ''} au total
//                                         {selectedDomain !== "ALL" && (
//                                             <span className="text-blue-600 ml-2">
//                                                 (Filtré par domaine: {selectedDomain})
//                                             </span>
//                                         )}
//                                     </p>
//                                     <div className="flex items-center">
//                                         <Pagination 
//                                             total={total}
//                                             pageSize={100}
//                                             current={page}
//                                             onChange={handlePageChange}
//                                             showSizeChanger={false}
//                                             showLessItems
//                                             className="ant-pagination-custom"
//                                         />
//                                     </div>
//                                 </div>
//                             }
//                         />
//                     </div>
//                 </div>
//             </div>

//             {/* Modal d'édition */}
//             {isEditOpen && (
//                 <Dialogue 
//                     buttonText={null}
//                     header={<h2 className='text-xl font-semibold'>Modifier la cause d'incident</h2>}
//                     content={
//                         editingCause ? (
//                             <EditForm 
//                                 cause={editingCause}
//                                 onSucess={handleEditSubmit}
//                                 onCancel={() => {
//                                     setIsEditOpen(false);
//                                     setEditingCause(null);
//                                 }}
//                                 userDomain={userDomain}
//                             />
//                         ) : (
//                             <div className="p-6 text-center">
//                                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
//                                 <p className="mt-2 text-gray-600">Chargement des données...</p>
//                             </div>
//                         )
//                     }
//                     isOpenned={isEditOpen}
//                     onOpenChange={(open) => {
//                         setIsEditOpen(open);
//                         if (!open) {
//                             setEditingCause(null);
//                         }
//                     }}
//                 />
//             )}
            
//             {/* Styles pour la pagination */}
//             <style jsx>{`
//                 :global(.ant-pagination-custom .ant-pagination-item) {
//                     border-radius: 6px;
//                 }
//                 :global(.ant-pagination-custom .ant-pagination-item-active) {
//                     background-color: #3b82f6;
//                     border-color: #3b82f6;
//                 }
//                 :global(.ant-pagination-custom .ant-pagination-item-active a) {
//                     color: white;
//                 }
//                 :global(.ant-pagination-custom .ant-pagination-item:hover) {
//                     border-color: #3b82f6;
//                 }
//             `}</style>
//         </>
//     );
// };

// export default IncidentCauses;