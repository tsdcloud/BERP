// import React, {useEffect, useState} from 'react';
// import Header from '../../components/layout/Header';
// import Dialogue from '../../components/incidents/Dialogue';
// import InitiateForm from '../../components/incidents/EquipmentGroupFamily/InitiateForm';
// import Tabs from '../../components/incidents/Tabs';
// import Datalist from '../../components/incidents/EquipmentGroupFamily/Datalist';
// import { useFetch } from '../../hooks/useFetch';
// import { Pagination } from 'antd';
// import { URLS } from '../../../configUrl';
// import { Toaster } from 'react-hot-toast';


// const EquipmentGroupFamily = () => {
//     const {handleFetch} = useFetch();
//     const [equipmentGroupFamilies, setEquipementGroupFamilies] = useState([]);
//     const [isOpenned, setIsOpenned] = useState(false);
//     const [isLoading, setIsLoading] = useState(false);
//     const [searchValue, setSearchValue] = useState("");
//     const [totalPages, setTotalPages] = useState(0);
//     const [total, setTotal] = useState(0);
//     const [page, setPage] = useState(0);
//     const [pageList, setPageList] = useState([]);

//     const fetchEquipmentGroupFamilies= async (url) => {
//         setIsLoading(true)
//         try {
//            const response = await handleFetch(url);
//            if(response.data){
//             setEquipementGroupFamilies(response.data);
//             setTotal(response.total);
//             setTotalPages(response.totalPages);
//             setPage(response.page);
//            }
//         } catch (error) {
//             console.log(error)
//         }finally{
//             setIsLoading(false);
//         }
//     }

//     const handleSubmit=()=>{
//         fetchEquipmentGroupFamilies(`${URLS.INCIDENT_API}/equipment-group-families`);
//         document.getElementById("close-dialog").click();
//     }

//     const handleSearch = async(e)=>{
//         setSearchValue(e.target.value)
//         let url = `${URLS.INCIDENT_API}/equipment-group-families?search=${e.target.value}`;
//         try {
//            const response = await handleFetch(url);
//            if(response.data){
//             setEquipementGroupFamilies(response?.data.data);
//             setTotalPages(response.totalPages);
//             setPage(response.page);
//            }
//         } catch (error) {
//             console.log(error)
//         }
//     }

//     useEffect(()=>{
//         fetchEquipmentGroupFamilies(`${URLS.INCIDENT_API}/equipment-group-families`);
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
//                 <div className='px-4 w-full justify-between items-center  flex flex-col gap-2 sm:flex-row'>
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
//                             buttonText={"Créer une nouveau domaine"}
//                             header={<h2 className='text-xl font-semibold'>Créer une nouveau domaine</h2>}
//                             content={
//                             <InitiateForm 
//                                 onSucess={handleSubmit}
//                             />}
//                             isOpenned={isOpenned}
//                         />
//                     </div>
//                 </div>
//                 <Datalist 
//                     dataList={equipmentGroupFamilies}
//                     fetchData={()=>fetchEquipmentGroupFamilies(`${URLS.INCIDENT_API}/equipment-group-families`)}
//                     searchValue={searchValue}
//                     loading={isLoading}
//                     pagination={
//                     <div className='flex flex-col md:flex-row items-center w-full justify-end px-6'>
//                         <p className='text-md text-black font-bold'>{equipmentGroupFamilies?.length} ligne(s)</p>
//                         <Pagination 
//                             total={total}
//                             pageSize={100}
//                             onChange={(page)=>{
//                                 totalPages > page && fetchEquipmentGroupFamilies(`${URLS.INCIDENT_API}/equipment-group-families?page=${page}`)
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

// export default EquipmentGroupFamily
import React, { useEffect, useState, useContext } from 'react';
import Header from '../../components/layout/Header';
import Dialogue from '../../components/incidents/Dialogue';
import InitiateForm from '../../components/incidents/EquipmentGroupFamily/InitiateForm';
import Tabs from '../../components/incidents/Tabs';
import Datalist from '../../components/incidents/EquipmentGroupFamily/Datalist';
import { useFetch } from '../../hooks/useFetch';
import { Pagination } from 'antd';
import { URLS } from '../../../configUrl';
import { Toaster } from 'react-hot-toast';
import { AUTHCONTEXT } from '../../contexts/AuthProvider';
import { getEmployee } from '../../utils/entity.utils';

const EquipmentGroupFamily = () => {
    const { handleFetch } = useFetch();
    const authContext = useContext(AUTHCONTEXT);
    
    const [equipmentGroupFamilies, setEquipementGroupFamilies] = useState([]);
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
            
            console.log("👤 Domaine utilisateur Familles:", domain);
            
        } catch (error) {
            console.error("Erreur chargement permissions:", error);
        }
    };

    const fetchEquipmentGroupFamilies = async (url) => {
        setIsLoading(true);
        try {
            const urlObj = new URL(url, window.location.origin);
            
            // Ajouter le filtre de domaine si différent de "ALL"
            if (selectedDomain !== "ALL") {
                urlObj.searchParams.set('domain', selectedDomain);
            }
            
            // Ajouter la recherche si présente
            if (searchValue) {
                urlObj.searchParams.set('search', searchValue);
            }
            
            const finalUrl = urlObj.toString();
            console.log("Fetch URL Familles:", finalUrl);
            
            const response = await handleFetch(finalUrl);
            
            console.log("Réponse API familles:", response);
            
            // Gérer la réponse selon la structure de votre API
            let familiesData = [];
            
            if (response?.data) {
                // Structure paginée
                if (response.data.data && Array.isArray(response.data.data)) {
                    familiesData = response.data.data;
                    setTotal(response.data.total || response.data.data.length);
                    setTotalPages(response.data.totalPages || 1);
                    setPage(response.data.page || 1);
                } 
                // Structure directe (sans pagination)
                else if (Array.isArray(response.data)) {
                    familiesData = response.data;
                    setTotal(response.data.length);
                    setTotalPages(1);
                    setPage(1);
                }
                // Autre structure
                else if (response.data && typeof response.data === 'object') {
                    const values = Object.values(response.data);
                    if (values.length > 0 && Array.isArray(values[0])) {
                        familiesData = values[0];
                    }
                    setTotal(familiesData.length);
                    setTotalPages(1);
                    setPage(1);
                }
            }
            
            // S'assurer que c'est un tableau
            if (!Array.isArray(familiesData)) {
                console.error("Les données ne sont pas un tableau:", familiesData);
                familiesData = [];
            }
            
            console.log("Données à afficher:", familiesData);
            setEquipementGroupFamilies(familiesData);
            
        } catch (error) {
            console.error("Erreur fetch familles:", error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleSubmit = () => {
        fetchEquipmentGroupFamilies(`${URLS.INCIDENT_API}/equipment-group-families`);
        document.getElementById("close-dialog")?.click();
        setIsOpenned(false);
    }

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchValue(value);
        
        // Debounce pour éviter trop d'appels API
        setTimeout(() => {
            fetchEquipmentGroupFamilies(`${URLS.INCIDENT_API}/equipment-group-families`);
        }, 300);
    }

    const handleDomainChange = (domain) => {
        setSelectedDomain(domain);
        setPage(1);
        fetchEquipmentGroupFamilies(`${URLS.INCIDENT_API}/equipment-group-families`);
    };

    useEffect(() => {
        loadUserPermissions();
        fetchEquipmentGroupFamilies(`${URLS.INCIDENT_API}/equipment-group-families`);
    }, []);

    useEffect(() => {
        fetchEquipmentGroupFamilies(`${URLS.INCIDENT_API}/equipment-group-families`);
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

                {/* Indicateur de domaine utilisateur et filtres */}
                {userDomain && (
                    <div className="mb-4 p-4 bg-gray-50 rounded-lg border">
                        <div className="flex items-center gap-2 mb-3">
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
                        
                        {/* Filtre par domaine */}
                        <div className="flex flex-wrap gap-2 mt-3">
                            <label className="text-sm font-medium mr-2">Filtrer par domaine :</label>
                            {["ALL", "IT", "HSE", "OPERATIONS", "MAINTENANCE"].map(domain => (
                                <button
                                    key={domain}
                                    onClick={() => handleDomainChange(domain)}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                                        selectedDomain === domain
                                            ? domain === "ALL" ? "bg-gray-800 text-white hover:bg-gray-900" :
                                            domain === "IT" ? "bg-blue-600 text-white hover:bg-blue-700" :
                                            domain === "HSE" ? "bg-red-600 text-white hover:bg-red-700" :
                                            domain === "OPERATIONS" ? "bg-green-600 text-white hover:bg-green-700" :
                                            domain === "MAINTENANCE" ? "bg-yellow-600 text-white hover:bg-yellow-700" :
                                            "bg-gray-600 text-white hover:bg-gray-700"
                                            : domain === "ALL" ? "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300" :
                                            domain === "IT" ? "bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200" :
                                            domain === "HSE" ? "bg-red-50 text-red-700 hover:bg-red-100 border-red-200" :
                                            domain === "OPERATIONS" ? "bg-green-50 text-green-700 hover:bg-green-100 border-green-200" :
                                            domain === "MAINTENANCE" ? "bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border-yellow-200" :
                                            "bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200"
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
                            className='p-2 text-sm border rounded-lg w-full md:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                            placeholder='Recherche...' 
                            value={searchValue}
                            onChange={handleSearch}
                        />
                        {/* Dialog */}
                        <div className='flex gap-2 items-center w-full md:w-auto'>
                            {/* Vérification des permissions si nécessaire */}
                            {/* {userPermissions.includes("equipment__can_create_equipment_group_family") && ( */}
                                <Dialogue 
                                    buttonText={"Créer une nouvelle famille"}
                                    header={<h2 className='text-xl font-semibold'>Créer une nouvelle famille</h2>}
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
                        dataList={equipmentGroupFamilies}
                        fetchData={() => fetchEquipmentGroupFamilies(`${URLS.INCIDENT_API}/equipment-group-families`)}
                        searchValue={searchValue}
                        loading={isLoading}
                        userDomain={userDomain}
                        userPermissions={userPermissions}
                        pagination={
                        <div className='flex flex-col md:flex-row items-center w-full justify-end px-6'>
                            <p className='text-md text-black font-bold'>{total} ligne(s)</p>
                            <Pagination 
                                total={total}
                                pageSize={100}
                                current={page}
                                onChange={(page) => {
                                    fetchEquipmentGroupFamilies(`${URLS.INCIDENT_API}/equipment-group-families?page=${page}`);
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

export default EquipmentGroupFamily