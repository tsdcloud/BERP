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
import React, { useEffect, useState, useRef } from 'react';

import Header from '../../components/layout/Header';
import Dialogue from '../../components/incidents/Dialogue';
import InitiateForm from '../../components/incidents/Equipement/InitiateForm';
import Tabs from '../../components/incidents/Tabs';
import Datalist from '../../components/incidents/Equipement/Datalist';

import { useFetch } from '../../hooks/useFetch';
import { Pagination } from 'antd';
import { URLS } from '../../../configUrl';
import { Toaster } from 'react-hot-toast';


// ===============================
// Composant principal Equipement
// ===============================
const Equipement = () => {
  const { handleFetch } = useFetch();

  // -------------------------------
  // States
  // -------------------------------
  const [equipements, setEquipements] = useState([]);
  const [isOpenned, setIsOpenned] = useState(false); // ouverture/fermeture du modal
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // Pagination
  const [totalPages, setTotalPages] = useState(0);  // nb total de pages
  const [total, setTotal] = useState(0);            // nb total d'items
  const [page, setPage] = useState(1);              // page courante (1-based !)

  const searchTimeout = useRef(null); // pour gérer le debounce

  // -------------------------------
  // Fonction pour récupérer les équipements
  // -------------------------------
  const fetchEquipement = async (url) => {
    setIsLoading(true);
    try {
      const response = await handleFetch(url);

      // Sécurisation de la réponse (valeurs par défaut si undefined)
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
  // Après création d’un équipement → refetch + fermer modal
  // -------------------------------
  const handleSubmit = async () => {
    await fetchEquipement(`${URLS.INCIDENT_API}/equipements`);
    setIsOpenned(false); // on ferme le modal proprement via le state
  };

  // -------------------------------
  // Recherche avec debounce (300ms)
  // -------------------------------
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchValue(value);

    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      fetchEquipement(`${URLS.INCIDENT_API}/equipements?search=${encodeURIComponent(value)}`);
    }, 300);
  };

  // -------------------------------
  // useEffect : on charge la liste au montage
  // -------------------------------
  useEffect(() => {
    fetchEquipement(`${URLS.INCIDENT_API}/equipements`);
  }, []);

  // -------------------------------
  // Rendu JSX
  // -------------------------------
  return (
    <>
      {/* Header général */}
      <Header />

      <div className="px-6 space-y-4">
        {/* Tabs (navigation incidents/equipements/etc.) */}
        <div className="flex items-center">
          <div className="overflow-x-auto">
            <Tabs />
          </div>
        </div>

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
              <Dialogue
                buttonText={"Créer équipement"}
                header={<h2 className="text-xl font-semibold">Créer équipement</h2>}
                content={
                  <InitiateForm
                    onSucess={handleSubmit} // quand création réussie
                  />
                }
                isOpenned={isOpenned}
                onClose={() => setIsOpenned(false)}
                onOpen={() => setIsOpenned(true)}
              />
            </div>
          </div>

          {/* Liste des équipements */}
          <Datalist
            dataList={equipements}
            fetchData={() => fetchEquipement(`${URLS.INCIDENT_API}/equipements?page=${page}`)}
            searchValue={searchValue}
            loading={isLoading}
            pagination={
              <div className="flex flex-col md:flex-row w-full justify-end items-center px-6">
                <p className="text-md text-black font-bold">{total} ligne(s)</p>
                <Pagination
                  current={page}          // page courante
                  total={total}           // nb total d’items
                  pageSize={100}          // nb d’items par page
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
