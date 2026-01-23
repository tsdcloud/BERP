// import React, {useEffect, useState} from 'react';
// import Header from '../../components/layout/Header';
// import Dialogue from '../../components/incidents/Dialogue';
// import InitiateForm from '../../components/incidents/EquipmentGroup/InitiateForm';
// import Tabs from '../../components/incidents/Tabs';
// import Datalist from '../../components/incidents/EquipmentGroup/Datalist';
// import { useFetch } from '../../hooks/useFetch';
// import { Pagination } from 'antd';
// import { URLS } from '../../../configUrl';
// import { Toaster } from 'react-hot-toast';


// const EquipmentGroup = () => {
//     const {handleFetch} = useFetch();
//     const [equipmentGroups, setEquipementGroups] = useState([]);
//     const [isOpenned, setIsOpenned] = useState(false);
//     const [isLoading, setIsLoading] = useState(false);
//     const [searchValue, setSearchValue] = useState("");
//     const [totalPages, setTotalPages] = useState(0);
//     const [total, setTotal] = useState(0);
//     const [page, setPage] = useState(0);
//     const [pageList, setPageList] = useState([]);

//     const fetchEquipmentGroups= async (url) => {
//         setIsLoading(true)
//         try {
//             const response = await handleFetch(url);
//             if(response.data){
//                 setEquipementGroups(response.data);
//                 setTotal(response.total);
//                 setTotalPages(response.totalPages);
//                 setPage(response.page);
//             }
//             } catch (error) {
//             console.log(error)
//         }finally{
//             setIsLoading(false);
//         }
//     }

//     const handleSubmit=()=>{
//         fetchEquipmentGroups(`${URLS.INCIDENT_API}/equipment-groups`);
//         document.getElementById("close-dialog").click();
//     }

//     const handleSearch = async(e)=>{
//         setSearchValue(e.target.value)
//         let url = `${URLS.INCIDENT_API}/equipment-groups?search=${e.target.value}`;
//         try {
//             const response = await handleFetch(url);
//             console.log(response)
//             if(response.data){
//                 setEquipementGroups(response.data.data);
//                 setTotalPages(response.totalPages);
//                 setPage(response.page);
//             }
//         } catch (error) {
//             console.log(error)
//         }
//     }

//     useEffect(()=>{
//         fetchEquipmentGroups(`${URLS.INCIDENT_API}/equipment-groups`);
//     }, []);


//   return (
//     <>
//         <Header />
//         <div className='px-6 space-y-4'>
//             <div className='flex items-center'>
//                 {/* Header */}
//                 <div className='overflow-x-auto'>
//                     <Tabs />
//                 </div>
                
//             </div>

//             {/* Table */}
//             <div className='w-full bg-white rounded-lg p-2 h-[70vh] flex flex-col'>
//                 <div className='px-4 w-full justify-between items-center flex flex-col gap-2 sm:flex-row'>
//                     <input 
//                         type="text"
//                         className='p-2 text-sm border rounded-lg w-full md:w-auto' 
//                         placeholder='Recherche...' 
//                         value={searchValue}
//                         onChange={handleSearch}
//                     />
//                     {/* Dialog */}
//                     <div className='flex gap-2 items-center w-full md:w-auto'>
//                         <Dialogue 
//                             buttonText={"Créer type equipement"}
//                             header={<h2 className='text-xl font-semibold'>Créer un nouveau type d'equipement</h2>}
//                             content={
//                             <InitiateForm 
//                                 onSucess={handleSubmit}
//                             />}
//                             isOpenned={isOpenned}
//                         />
//                     </div>
//                 </div>
//                 <Datalist 
//                     dataList={equipmentGroups}
//                     fetchData={()=>fetchEquipmentGroups(`${URLS.INCIDENT_API}/equipment-groups`)}
//                     searchValue={searchValue}
//                     loading={isLoading}
//                     pagination={
//                     <div className='flex flex-col w-full justify-end md:flex-row items-center px-6'>
//                         <p className='text-md text-black font-bold'>{equipmentGroups?.length} ligne(s)</p>
//                         <Pagination 
//                             total={total}
//                             pageSize={100}
//                             onChange={(page)=>{
//                                 totalPages > page && fetchEquipmentGroups(`${URLS.INCIDENT_API}/equipment-groups?page=${page}`)
//                             }}
//                         />
//                     </div>}
//                 />
//             </div>
//             <Toaster 
//               position="bottom-right"
//               reverseOrder={false}
//             />
//         </div>
//     </>
//   )
// }

// export default EquipmentGroup

import React, { useEffect, useState, useContext } from 'react';
import Header from '../../components/layout/Header';
import Dialogue from '../../components/incidents/Dialogue';
import InitiateForm from '../../components/incidents/EquipmentGroup/InitiateForm';
import Tabs from '../../components/incidents/Tabs';
import Datalist from '../../components/incidents/EquipmentGroup/Datalist';
import { useFetch } from '../../hooks/useFetch';
import { Pagination } from 'antd';
import { URLS } from '../../../configUrl';
import { Toaster } from 'react-hot-toast';
import { AUTHCONTEXT } from '../../contexts/AuthProvider';
import { getEmployee } from '../../utils/entity.utils';

const EquipmentGroup = () => {
    const { handleFetch } = useFetch();
    const authContext = useContext(AUTHCONTEXT);
    
    const [equipmentGroups, setEquipmentGroups] = useState([]);
    const [isOpenned, setIsOpenned] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [totalPages, setTotalPages] = useState(0);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
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
            
            console.log("👤 Domaine utilisateur Groupes:", domain);
            
        } catch (error) {
            console.error("Erreur chargement permissions:", error);
        }
    };

    const fetchEquipmentGroups = async (url) => {
        setIsLoading(true);
        try {
            const urlObj = new URL(url, window.location.origin);
            
            if (selectedDomain !== "ALL") {
                urlObj.searchParams.set('domain', selectedDomain);
            }
            
            if (searchValue) {
                urlObj.searchParams.set('search', searchValue);
            }
            
            const finalUrl = urlObj.toString();
            console.log("Fetch URL Groupes:", finalUrl);
            
            const response = await handleFetch(finalUrl);
            
            console.log("Réponse API complète:", response); // DEBUG
            
            // CORRECTION : Votre API renvoie apiResponse({ error, errors, data })
            // Le tableau de données est dans response.data.data
            let groupsData = [];
            
            if (response?.data) {
                // Si response.data a une propriété data (structure paginée)
                if (response.data.data && Array.isArray(response.data.data)) {
                    groupsData = response.data.data;
                    setTotal(response.data.total || response.data.data.length);
                    setTotalPages(response.data.totalPages || 1);
                    setPage(response.data.page || 1);
                } 
                // Si response.data est directement un tableau
                else if (Array.isArray(response.data)) {
                    groupsData = response.data;
                    setTotal(response.data.length);
                    setTotalPages(1);
                    setPage(1);
                }
                // Sinon, c'est peut-être un objet avec les données
                else if (response.data && typeof response.data === 'object') {
                    // Essayons d'extraire les données de différentes structures possibles
                    if (response.data.groups && Array.isArray(response.data.groups)) {
                        groupsData = response.data.groups;
                    } else if (Array.isArray(response.data)) {
                        groupsData = response.data;
                    } else {
                        // Essayer d'accéder directement aux propriétés de l'objet
                        const values = Object.values(response.data);
                        if (values.length > 0 && Array.isArray(values[0])) {
                            groupsData = values[0];
                        }
                    }
                    
                    setTotal(groupsData.length);
                    setTotalPages(1);
                    setPage(1);
                }
            }
            
            // Assurez-vous que groupsData est un tableau
            if (!Array.isArray(groupsData)) {
                console.error("Les données ne sont pas un tableau:", groupsData);
                groupsData = [];
            }
            
            console.log("Données à afficher:", groupsData);
            setEquipmentGroups(groupsData);
            
        } catch (error) {
            console.error("Erreur fetch:", error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleSubmit = () => {
        fetchEquipmentGroups(`${URLS.INCIDENT_API}/equipment-groups`);
        setIsOpenned(false);
    }

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchValue(value);
        
        setTimeout(() => {
            fetchEquipmentGroups(`${URLS.INCIDENT_API}/equipment-groups`);
        }, 300);
    }

    const handleDomainChange = (domain) => {
        setSelectedDomain(domain);
        setPage(1);
    };

    useEffect(() => {
        loadUserPermissions();
        fetchEquipmentGroups(`${URLS.INCIDENT_API}/equipment-groups`);
    }, []);

    useEffect(() => {
        fetchEquipmentGroups(`${URLS.INCIDENT_API}/equipment-groups`);
    }, [selectedDomain]);

    return (
        <>
            <Header />
            <div className='px-6 space-y-4'>
                <div className='flex items-center'>
                    <div className='overflow-x-auto'>
                        <Tabs />
                    </div>
                </div>

                {/* Indicateur de domaine utilisateur */}
                {userDomain && (
                    <div className="mb-4 p-4 bg-gray-50 rounded-lg border">
                        {/* <div className="flex items-center gap-2 mb-2">
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
                        </div> */}
                        
                        {/* Filtre par domaine */}
                        <div className="flex flex-wrap gap-2 mt-3">
                            <label className="text-sm font-medium mr-2">Filtrer par domaine :</label>
                            {["ALL", "IT", "HSE", "OPERATIONS", "MAINTENANCE"].map(domain => (
                                <button
                                    key={domain}
                                    onClick={() => handleDomainChange(domain)}
                                    className={`px-3 py-1 rounded-full text-sm border ${
                                        selectedDomain === domain
                                            ? domain === "ALL" ? "bg-gray-800 text-white" :
                                            domain === "IT" ? "bg-blue-600 text-white" :
                                            domain === "HSE" ? "bg-red-600 text-white" :
                                            domain === "OPERATIONS" ? "bg-green-600 text-white" :
                                            domain === "MAINTENANCE" ? "bg-yellow-600 text-white" :
                                            "bg-gray-600 text-white"
                                            : domain === "ALL" ? "bg-gray-100 text-gray-800" :
                                            domain === "IT" ? "bg-blue-100 text-blue-800" :
                                            domain === "HSE" ? "bg-red-100 text-red-800" :
                                            domain === "OPERATIONS" ? "bg-green-100 text-green-800" :
                                            domain === "MAINTENANCE" ? "bg-yellow-100 text-yellow-800" :
                                            "bg-gray-100 text-gray-800"
                                    }`}
                                >
                                    {domain === "ALL" ? "Tous les domaines" : domain}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Table */}
                <div className='w-full bg-white rounded-lg p-2 h-[70vh] flex flex-col'>
                    <div className='px-4 w-full justify-between items-center flex flex-col gap-2 sm:flex-row'>
                        <input 
                            type="text"
                            className='p-2 text-sm border rounded-lg w-full md:w-auto' 
                            placeholder='Recherche...' 
                            value={searchValue}
                            onChange={handleSearch}
                        />
                        {/* Dialog */}
                        <div className='flex gap-2 items-center w-full md:w-auto'>
                            {/* {userPermissions.includes("equipment__can_create_equipment_group") && ( */}
                                <Dialogue 
                                    buttonText={"Créer type equipement"}
                                    header={<h2 className='text-xl font-semibold'>Créer un nouveau type d'equipement</h2>}
                                    content={
                                    <InitiateForm 
                                        onSucess={handleSubmit}
                                        userDomain={userDomain}
                                    />}
                                    isOpenned={isOpenned}
                                    onOpen={() => setIsOpenned(true)}
                                    onClose={() => setIsOpenned(false)}
                                />
                            {/* )} */}
                        </div>
                    </div>
                    <Datalist 
                        dataList={equipmentGroups}
                        fetchData={() => fetchEquipmentGroups(`${URLS.INCIDENT_API}/equipment-groups`)}
                        searchValue={searchValue}
                        loading={isLoading}
                        // userDomain={userDomain}
                        // userPermissions={userPermissions}
                        pagination={
                        <div className='flex flex-col w-full justify-end md:flex-row items-center px-6'>
                            <p className='text-md text-black font-bold'>{total} ligne(s)</p>
                            <Pagination 
                                total={total}
                                pageSize={100}
                                onChange={(page) => {
                                    fetchEquipmentGroups(`${URLS.INCIDENT_API}/equipment-groups?page=${page}`);
                                }}
                            />
                        </div>}
                    />
                </div>
                <Toaster 
                    position="bottom-right"
                    reverseOrder={false}
                />
            </div>
        </>
    )
}

export default EquipmentGroup;