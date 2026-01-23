// import React, {useEffect, useState} from 'react';
// import Header from '../../components/layout/Header';
// import Dialogue from '../../components/incidents/Dialogue';
// import InitiateForm from '../../components/incidents/Equipement/InitiateForm';
// import Tabs from '../../components/incidents/Tabs';
// import Datalist from '../../components/incidents/Equipement/Datalist';
// import { useFetch } from '../../hooks/useFetch';
// import { Pagination } from 'antd';
// import { URLS } from '../../../configUrl';
// import { Toaster } from 'react-hot-toast';


// const Equipement = () => {

//     const {handleFetch} = useFetch();
//     const [equipements, setEquipements] = useState([]);
//     const [isOpenned, setIsOpenned] = useState(false);
//     const [isLoading, setIsLoading] = useState(false);
//     const [searchValue, setSearchValue] = useState("");
//     const [totalPages, setTotalPages] = useState(0);
//     const [total, setTotal] = useState(0);
//     const [page, setPage] = useState(0);
//     const [pageList, setPageList] = useState([]);


//     const fetchEquipement= async (url) => {
//         setIsLoading(true)
//         try {
//            const response = await handleFetch(url);
//            if(response.data){
//             setEquipements(response.data);
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
//         fetchEquipement(`${URLS.INCIDENT_API}/equipements`);
//         document.getElementById("close-dialog").click();
//     }

//     const handleSearch = async(e)=>{
//         setSearchValue(e.target.value)
//         let url = `${URLS.INCIDENT_API}/equipements?search=${e.target.value}`;
//         try {
//            const response = await handleFetch(url);
//            if(response.data){
//             setEquipements(response.data);
//             setTotalPages(response.totalPages);
//             setPage(response.page);
//            }
//         } catch (error) {
//             console.log(error)
//         }
//     }

//     useEffect(()=>{
//         fetchEquipement(`${URLS.INCIDENT_API}/equipements`);
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
//                 <div className='px-4 flex flex-col gap-2 sm:flex-row items-center justify-between w-full'>
//                     <input 
//                         type="text"
//                         className='w-full md:w-auto p-2 text-sm border rounded-lg' 
//                         placeholder='Recherche...' 
//                         value={searchValue}
//                         onChange={handleSearch}
//                     />
//                     {/* Dialog */}
//                     <div className='flex gap-2 items-center w-full md:w-auto'>
//                         <Dialogue 
//                             buttonText={"Créer equipement"}
//                             header={<h2 className='text-xl font-semibold'>Créer equipement</h2>}
//                             content={
//                             <InitiateForm 
//                                 onSucess={handleSubmit}
//                             />}
//                             isOpenned={isOpenned}
//                         />
//                     </div>
//                 </div>
//                 <Datalist 
//                     dataList={equipements}
//                     fetchData={()=>fetchEquipement(`${URLS.INCIDENT_API}/equipements`)}
//                     searchValue={searchValue}
//                     loading={isLoading}
//                     pagination={
//                     <div className='flex flex-col md:flex-row w-full justify-end items-center px-6'>
//                         <p className='text-md text-black font-bold'>{total} ligne(s)</p>
//                         <Pagination 
//                             total={total}
//                             pageSize={100}
//                             onChange={(page)=>{
//                                 totalPages > page && fetchEquipement(`${URLS.INCIDENT_API}/equipements?page=${page}`)
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

// export default Equipement
import React, { useEffect, useState, useRef, useContext } from 'react';
import Header from '../../components/layout/Header';
import Dialogue from '../../components/incidents/Dialogue';
import InitiateForm from '../../components/incidents/Equipement/InitiateForm';
import Tabs from '../../components/incidents/Tabs';
import Datalist from '../../components/incidents/Equipement/Datalist';
import { useFetch } from '../../hooks/useFetch';
import { Pagination } from 'antd';
import { URLS } from '../../../configUrl';
import { Toaster } from 'react-hot-toast';
import { AUTHCONTEXT } from '../../contexts/AuthProvider';
import { getEmployee } from '../../utils/entity.utils';

// ===============================
// Composant principal Equipement
// ===============================
const Equipement = () => {
  const { handleFetch } = useFetch();
  const authContext = useContext(AUTHCONTEXT);
  
  // -------------------------------
  // States
  // -------------------------------
  const [equipements, setEquipements] = useState([]);
  const [isOpenned, setIsOpenned] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [userDomain, setUserDomain] = useState("");
  const [userRoles, setUserRoles] = useState([]);
  const [userPermissions, setUserPermissions] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState("ALL");

  // Pagination
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const searchTimeout = useRef(null);

  // -------------------------------
  // Fonction pour déterminer le domaine utilisateur
  // -------------------------------
  const getUserDomainFromRoles = (rolesArray) => {
    if (!rolesArray || !Array.isArray(rolesArray)) return null;
    
    const normalizedRoles = rolesArray.map(role => role.toLowerCase());
    
    const privilegedRoles = ['admin', 'manager', 'dex'];
    const hasPrivilegedRole = privilegedRoles.some(privilegedRole => 
      normalizedRoles.some(role => role.includes(privilegedRole))
    );
    
    if (hasPrivilegedRole) {
      return "PRIVILEGED";
    }
    
    if (normalizedRoles.some(role => role.includes('maintenancier'))) return "MAINTENANCE";
    if (normalizedRoles.some(role => role.includes('it'))) return "IT";
    if (normalizedRoles.some(role => ['rop', 'customer manager'].some(r => role.includes(r)))) return "OPERATIONS";
    if (normalizedRoles.some(role => role.includes('hse'))) return "HSE";
    
    return null;
  };

  // -------------------------------
  // Charger les rôles et permissions utilisateur
  // -------------------------------
  const loadUserPermissions = async () => {
    try {
      const employee = await getEmployee();
      if (!employee) return;
      
      const employeeRoles = await handleFetch(`${URLS.ENTITY_API}/employees/${employee?.id}/roles`);
      const employeePermissions = await handleFetch(`${URLS.ENTITY_API}/employees/${employee?.id}/permissions`);
      
      const roleNames = employeeRoles?.employeeRoles?.map(r => r.role.roleName) || [];
      const permissionNames = employeePermissions?.employeePermissions?.map(p => p.permission.permissionName) || [];
      
      setUserRoles(roleNames);
      setUserPermissions(permissionNames);
      
      const domain = getUserDomainFromRoles(roleNames);
      setUserDomain(domain);
      
      console.log("👤 Rôles utilisateur Équipements:", roleNames);
      console.log("👤 Domaine utilisateur Équipements:", domain);
      
    } catch (error) {
      console.error("Erreur chargement permissions:", error);
    }
  };

  // -------------------------------
  // Fonction pour récupérer les équipements
  // -------------------------------
  const fetchEquipement = async (url) => {
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
      console.log("Fetch URL:", finalUrl);
      
      const response = await handleFetch(finalUrl);
      
      const data = response?.data ?? [];
      setEquipements(data);
      setTotal(response?.total ?? 0);
      setTotalPages(response?.totalPages ?? 0);
      setPage(response?.page ?? 1);
    } catch (error) {
      console.error("Erreur lors du fetch des équipements:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // -------------------------------
  // Après création/modification d'un équipement
  // -------------------------------
  const handleSubmit = async () => {
    await fetchEquipement(`${URLS.INCIDENT_API}/equipements`);
    setIsOpenned(false);
  };

  // -------------------------------
  // Recherche avec debounce (300ms)
  // -------------------------------
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchValue(value);

    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      fetchEquipement(`${URLS.INCIDENT_API}/equipements`);
    }, 300);
  };

  // -------------------------------
  // Changer le filtre domaine
  // -------------------------------
  const handleDomainChange = (domain) => {
    setSelectedDomain(domain);
    setPage(1);
  };

  // -------------------------------
  // useEffect : on charge la liste au montage
  // -------------------------------
  useEffect(() => {
    loadUserPermissions();
    fetchEquipement(`${URLS.INCIDENT_API}/equipements`);
  }, []);

  // Re-fetch quand le filtre domaine change
  useEffect(() => {
    fetchEquipement(`${URLS.INCIDENT_API}/equipements`);
  }, [selectedDomain]);

  // Re-fetch quand la recherche change
  useEffect(() => {
    if (searchValue !== "") {
      const timeoutId = setTimeout(() => {
        fetchEquipement(`${URLS.INCIDENT_API}/equipements`);
      }, 300);
      
      return () => clearTimeout(timeoutId);
    }
  }, [searchValue]);

  // -------------------------------
  // Rendu JSX
  // -------------------------------
  return (
    <>
      <Header />

      <div className="px-6 space-y-4">
        {/* Tabs navigation */}
        <div className="flex items-center">
          <div className="overflow-x-auto">
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

        {/* Table principale */}
        <div className="w-full bg-white rounded-lg p-2 h-[70vh] flex flex-col">
          {/* Barre de recherche + bouton créer */}
          <div className="px-4 flex flex-col gap-2 sm:flex-row items-center justify-between w-full">
            
            {/* Input recherche */}
            <input
              type="text"
              className="w-full md:w-auto p-2 text-sm border rounded-lg"
              placeholder="Recherche..."
              value={searchValue}
              onChange={handleSearch}
            />

            {/* Modal de création */}
            <div className="flex gap-2 items-center w-full md:w-auto">
              {/* {userPermissions.includes("equipment__can_create_equipment") && ( */}
                <Dialogue
                  buttonText={"Créer équipement"}
                  header={<h2 className="text-xl font-semibold">Créer équipement</h2>}
                  content={
                    <InitiateForm
                      onSucess={handleSubmit}
                      userDomain={userDomain}
                    />
                  }
                  isOpenned={isOpenned}
                  onClose={() => setIsOpenned(false)}
                  onOpen={() => setIsOpenned(true)}
                />
              {/* )} */}
            </div>
          </div>

          {/* Liste des équipements */}
          <Datalist
            dataList={equipements}
            fetchData={() => fetchEquipement(`${URLS.INCIDENT_API}/equipements?page=${page}`)}
            searchValue={searchValue}
            loading={isLoading}
            userDomain={userDomain}
            userPermissions={userPermissions}
            pagination={
              <div className="flex flex-col md:flex-row w-full justify-end items-center px-6">
                <p className="text-md text-black font-bold">{total} ligne(s)</p>
                <Pagination
                  current={page}
                  total={total}
                  pageSize={100}
                  onChange={(pageNumber) => {
                    if (pageNumber <= totalPages) {
                      fetchEquipement(`${URLS.INCIDENT_API}/equipements?page=${pageNumber}`);
                      setPage(pageNumber);
                    }
                  }}
                />
              </div>
            }
          />
        </div>

        {/* Toasts de notifications */}
        <Toaster
          position="bottom-right"
          reverseOrder={false}
        />
      </div>
    </>
  );
};

export default Equipement;
