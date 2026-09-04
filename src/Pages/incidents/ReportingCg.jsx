// import React, { useEffect, useState, useCallback, useContext } from 'react';
// import Header from '../../components/layout/Header';
// import Dialogue from '../../components/incidents/Dialogue';
// import InitiateForm from '../../components/incidents/ReportingCg/InitiateForm';
// import Tabs from '../../components/incidents/Tabs';
// import Datalist from '../../components/incidents/ReportingCg/Datalist';
// import { useFetch } from '../../hooks/useFetch';
// import { Pagination } from 'antd';
// import { URLS } from '../../../configUrl';
// import { Toaster } from 'react-hot-toast';
// import { AUTHCONTEXT } from '../../contexts/AuthProvider';
// import { getEmployee } from '../../utils/entity.utils';
// import {
//   MagnifyingGlassIcon,
//   XMarkIcon,
// } from '@heroicons/react/24/outline';
// import ActionHeaders from '../../components/common/ActionHeaders';
// import { Button } from '../../components/ui/button';

// // Rôles pour lesquels on restreint la vue (actuellement désactivé)
// const RESTRICTED_ROLES = ['OP', 'head guard'];

// const ReportingCg = () => {
//   const { handleFetch } = useFetch();
//   const authContext = useContext(AUTHCONTEXT);

//   // États principaux
//   const [reportingCgs, setReportingCgs] = useState([]);
//   const [isOpenned, setIsOpenned] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [totalPages, setTotalPages] = useState(0);
//   const [total, setTotal] = useState(0);
//   const [page, setPage] = useState(1);
//   const [userPermissions, setUserPermissions] = useState([]);
//   const [editData, setEditData] = useState(null);
//   const [currentFilter, setCurrentFilter] = useState(null);

//   const [references, setReferences] = useState({
//     sites: [],
//     shifts: [],
//     employees: [],
//   });

//   // Rôles et identité de l'utilisateur connecté
//   const [currentUserRoles, setCurrentUserRoles] = useState(null);
//   const [currentUserId, setCurrentUserId] = useState(null);

//   // Permission d'édition
//   const canEdit =
//     currentUserRoles?.some((role) =>
//       ['ADMIN', 'DEX', 'ROP'].includes(role)
//     ) ?? false;

//   // États des filtres
//   const [selectValue, setSelectValue] = useState('');
//   const [inputValue, setInputValue] = useState('');
//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');

//   // Options de filtrage
//   const allFilterOptions = [
//     { value: 'siteId', name: 'Site' },
//     { value: 'shiftId', name: 'Quart' },
//     { value: 'incomingCgId', name: 'CG entrant' },
//     { value: 'numRef', name: 'N° Réf' },
//     { value: 'createdBy', name: 'Créé par' },
//     { value: 'updatedBy', name: 'Modifié par' },
//     { value: 'isActive', name: 'Statut' },
//     { value: 'createdAt', name: 'Date de création' },
//     { value: 'updatedAt', name: 'Date de modification' },
//   ];

//   const DATE_FILTERS = ['createdAt', 'updatedAt'];

//   const loadReferences = async () => {
//     try {
//       const [sitesRes, shiftsRes, employeesRes] = await Promise.all([
//         handleFetch(`${URLS.ENTITY_API}/sites`),
//         handleFetch(`${URLS.ENTITY_API}/shifts`),
//         handleFetch(`${URLS.ENTITY_API}/employees`),
//       ]);

//       const extractArray = (response) => {
//         const data = response?.data;

//         if (!data) return [];

//         if (Array.isArray(data?.data)) {
//           return data.data;
//         }

//         if (Array.isArray(data)) {
//           return data;
//         }

//         return [];
//       };

//       setReferences({
//         sites: extractArray(sitesRes),
//         shifts: extractArray(shiftsRes),
//         employees: extractArray(employeesRes),
//       });
//     } catch (error) {
//       console.error('Erreur chargement références :', error);
//     }
//   };

//   const loadUserPermissions = async () => {
//     try {
//       const employee = await getEmployee();

//       if (!employee) {
//         setCurrentUserRoles([]);
//         setCurrentUserId(null);
//         setUserPermissions([]);
//         return;
//       }

//       const roles = Array.isArray(employee?.employeeRoles)
//         ? employee.employeeRoles
//             .map((employeeRole) => employeeRole?.role?.roleName)
//             .filter(Boolean)
//         : [];

//       setCurrentUserRoles(roles);
//       setCurrentUserId(employee?.id || null);

//       const response = await handleFetch(
//         `${URLS.ENTITY_API}/employees/${employee.id}/permissions`
//       );

//       const permissionNames =
//         response?.employeePermissions
//           ?.map((permission) => permission?.permission?.permissionName)
//           .filter(Boolean) || [];

//       setUserPermissions(permissionNames);
//     } catch (error) {
//       console.error('Erreur chargement permissions :', error);
//       setCurrentUserRoles([]);
//       setUserPermissions([]);
//     }
//   };

//   const fetchReportingCgs = useCallback(
//     async (params = {}) => {
//       setIsLoading(true);

//       try {
//         let url = `${URLS.INCIDENT_API}/reporting-cgs`;
//         const queryParams = new URLSearchParams();

//         if (params.page) {
//           queryParams.append('page', String(params.page));
//         }

//         if (
//           params.filter &&
//           params.value !== undefined &&
//           params.value !== null &&
//           params.value !== ''
//         ) {
//           queryParams.append('filter', params.filter);
//           queryParams.append('value', String(params.value));
//         }

//         const qs = queryParams.toString();

//         if (qs) {
//           url += `?${qs}`;
//         }

//         const response = await handleFetch(url);

//         if (!response) {
//           setReportingCgs([]);
//           setTotal(0);
//           setTotalPages(1);
//           return;
//         }

//         const payload = response?.data;

//         const data = Array.isArray(payload?.data)
//           ? payload.data
//           : Array.isArray(payload)
//             ? payload
//             : [];

//         setReportingCgs(data);
//         setTotal(payload?.total ?? data.length);
//         setTotalPages(payload?.totalPages ?? 1);
//         setPage(payload?.page ?? params.page ?? 1);
//       } catch (error) {
//         console.error('Erreur fetch reportingCgs :', error);
//         setReportingCgs([]);
//         setTotal(0);
//         setTotalPages(1);
//       } finally {
//         setIsLoading(false);
//       }
//     },
//     [handleFetch]
//   );

//   const handleOnSelectChange = (event) => {
//     const value = event.target.value;

//     setSelectValue(value);
//     setInputValue('');
//     setStartDate('');
//     setEndDate('');
//     setCurrentFilter(null);

//     if (!value) {
//       fetchReportingCgs();
//     }
//   };

//   const handleInputChange = useCallback(
//     (event) => {
//       const value = event.target.value;

//       setInputValue(value);

//       if (selectValue && value) {
//         const filter = {
//           filter: selectValue,
//           value,
//         };

//         setCurrentFilter(filter);
//         fetchReportingCgs(filter);
//         return;
//       }

//       if (!value) {
//         setCurrentFilter(null);
//         fetchReportingCgs();
//       }
//     },
//     [selectValue, fetchReportingCgs]
//   );

//   const handleStartDateChange = (event) => {
//     const value = event.target.value;

//     setStartDate(value);

//     if (value && endDate) {
//       const dateValue = `${value},${endDate}`;
//       const filter = {
//         filter: selectValue,
//         value: dateValue,
//       };

//       setInputValue(dateValue);
//       setCurrentFilter(filter);
//       fetchReportingCgs(filter);
//       return;
//     }

//     if (!value && endDate) {
//       setCurrentFilter(null);
//       fetchReportingCgs();
//     }
//   };

//   const handleEndDateChange = (event) => {
//     const value = event.target.value;

//     setEndDate(value);

//     if (startDate && value) {
//       const dateValue = `${startDate},${value}`;
//       const filter = {
//         filter: selectValue,
//         value: dateValue,
//       };

//       setInputValue(dateValue);
//       setCurrentFilter(filter);
//       fetchReportingCgs(filter);
//       return;
//     }

//     if (startDate && !value) {
//       setCurrentFilter(null);
//       fetchReportingCgs();
//     }
//   };

//   const handlePageChange = (newPage) => {
//     if (newPage > totalPages && totalPages > 0) {
//       return;
//     }

//     const params = {
//       page: newPage,
//     };

//     if (currentFilter) {
//       params.filter = currentFilter.filter;
//       params.value = currentFilter.value;
//     }

//     fetchReportingCgs(params);
//   };

//   const resetFilters = () => {
//     setSelectValue('');
//     setInputValue('');
//     setStartDate('');
//     setEndDate('');
//     setCurrentFilter(null);

//     fetchReportingCgs();
//   };

//   const handleDisplayInput = (criteria) => {
//     const disabled = !criteria;

//     const baseClass = `
//       p-1
//       text-sm
//       w-full
//       focus:outline-blue-300
//       ${disabled ? 'cursor-not-allowed bg-gray-200' : ''}
//     `;

//     const wrapClass = `
//       border
//       p-1
//       rounded-lg
//       w-full
//       md:max-w-[300px]
//       relative
//       flex
//       items-center
//       my-2
//       ${disabled ? 'cursor-not-allowed bg-gray-200' : ''}
//     `;

//     if (criteria === 'siteId') {
//       return (
//         <div className={wrapClass}>
//           <MagnifyingGlassIcon className="h-4 text-gray-400 px-2" />

//           <select
//             className={baseClass}
//             value={inputValue}
//             onChange={handleInputChange}
//           >
//             <option value="">Sélectionner un site</option>

//             {references.sites.map((site) => (
//               <option key={site.id} value={site.id}>
//                 {site.name}
//               </option>
//             ))}
//           </select>
//         </div>
//       );
//     }

//     if (criteria === 'shiftId') {
//       return (
//         <div className={wrapClass}>
//           <MagnifyingGlassIcon className="h-4 text-gray-400 px-2" />

//           <select
//             className={baseClass}
//             value={inputValue}
//             onChange={handleInputChange}
//           >
//             <option value="">Sélectionner un quart</option>

//             {references.shifts.map((shift) => (
//               <option key={shift.id} value={shift.id}>
//                 {shift.name}
//               </option>
//             ))}
//           </select>
//         </div>
//       );
//     }

//     if (criteria === 'incomingCgId') {
//       const uniqueIncomingCgs = reportingCgs.filter(
//         (report, index, array) =>
//           report?.incomingCgId &&
//           array.findIndex(
//             (item) => item?.incomingCgId === report?.incomingCgId
//           ) === index
//       );

//       return (
//         <div className={wrapClass}>
//           <MagnifyingGlassIcon className="h-4 text-gray-400 px-2" />

//           <select
//             className={baseClass}
//             value={inputValue}
//             onChange={handleInputChange}
//           >
//             <option value="">Sélectionner un CG entrant</option>

//             {uniqueIncomingCgs.map((report) => (
//               <option
//                 key={report.incomingCgId}
//                 value={report.incomingCgId}
//               >
//                 {report.incomingCgId}
//               </option>
//             ))}
//           </select>
//         </div>
//       );
//     }

//     if (criteria === 'isActive') {
//       return (
//         <div className={wrapClass}>
//           <MagnifyingGlassIcon className="h-4 text-gray-400 px-2" />

//           <select
//             className={baseClass}
//             value={inputValue}
//             onChange={handleInputChange}
//           >
//             <option value="">Sélectionner un statut</option>
//             <option value="true">Actif</option>
//             <option value="false">Inactif</option>
//           </select>
//         </div>
//       );
//     }

//     if (DATE_FILTERS.includes(criteria)) {
//       return (
//         <div className={wrapClass}>
//           <div className="flex items-center gap-2 w-full px-1">
//             <input
//               type="date"
//               value={startDate}
//               onChange={handleStartDateChange}
//               className={baseClass}
//             />

//             <span className="text-gray-400 shrink-0">à</span>

//             <input
//               type="date"
//               value={endDate}
//               onChange={handleEndDateChange}
//               className={baseClass}
//             />
//           </div>
//         </div>
//       );
//     }

//     return (
//       <div className={wrapClass}>
//         <MagnifyingGlassIcon className="h-4 text-gray-400 px-2" />

//         <input
//           placeholder={
//             criteria
//               ? `Rechercher par ${
//                   allFilterOptions
//                     .find((filter) => filter.value === criteria)
//                     ?.name?.toLowerCase() || criteria
//                 }`
//               : 'Choisir le filtre'
//           }
//           className={baseClass}
//           value={inputValue}
//           onChange={handleInputChange}
//           disabled={disabled}
//         />
//       </div>
//     );
//   };

//   const handleSubmit = () => {
//     fetchReportingCgs(currentFilter || {});
//     document.getElementById('close-dialog')?.click();
//     setIsOpenned(false);
//     setEditData(null);
//   };

//   const handleCancelEdit = () => {
//     setEditData(null);
//     setIsOpenned(false);
//   };

//   const handleEdit = (record) => {
//     if (!record) return;

//     setEditData(record);
//     setIsOpenned(true);
//   };

//   /*
//    * Chargement unique au montage :
//    * - Références : sites, quarts, employés
//    * - Permissions et rôles utilisateur
//    *
//    * On ne met volontairement pas handleFetch, loadReferences
//    * ou loadUserPermissions dans les dépendances parce que useFetch
//    * crée de nouvelles fonctions à chaque render.
//    */
//   useEffect(() => {
//     loadReferences();
//     loadUserPermissions();

//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   /*
//    * Chargement unique de la liste au montage.
//    *
//    * Ne pas écrire [fetchReportingCgs] ici :
//    * fetchReportingCgs est recréée à chaque render car handleFetch
//    * est recréée dans useFetch.
//    */
//   useEffect(() => {
//     fetchReportingCgs();

//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   return (
//     <>
//       <Header />

//       <div className="px-6 space-y-4">
//         <div className="flex items-center">
//           <div className="overflow-x-auto">
//             <Tabs />
//           </div>
//         </div>

//         <div className="w-full bg-white rounded-lg p-2 h-[70vh] flex flex-col">
//           <div className="flex flex-col md:flex-row items-center justify-between mb-4 px-4">
//             <div className="flex flex-col md:flex-row items-center gap-4 w-full">
//               <ActionHeaders
//                 filterOptions={allFilterOptions}
//                 selectChange={handleOnSelectChange}
//                 selectValue={selectValue}
//                 input={handleDisplayInput(selectValue)}
//               />

//               {(selectValue || inputValue || startDate || endDate) && (
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={resetFilters}
//                   className="flex items-center gap-2 h-10"
//                 >
//                   <XMarkIcon className="h-4 w-4" />
//                   Réinitialiser
//                 </Button>
//               )}
//             </div>

//             <Dialogue
//               buttonText={
//                 editData
//                   ? 'Modifier le rapport'
//                   : 'Nouveau rapport CG'
//               }
//               header={
//                 <h2 className="text-xl font-semibold">
//                   {editData
//                     ? 'Modifier le rapport'
//                     : 'Nouveau rapport CG'}
//                 </h2>
//               }
//               content={
//                 <InitiateForm
//                   onSuccess={handleSubmit}
//                   onCancelEdit={handleCancelEdit}
//                   editData={editData}
//                 />
//               }
//               isOpenned={isOpenned}
//               onOpen={() => setIsOpenned(true)}
//               onClose={() => {
//                 setIsOpenned(false);
//                 setEditData(null);
//               }}
//             />
//           </div>

//           <Datalist
//             dataList={reportingCgs}
//             fetchData={() => fetchReportingCgs(currentFilter || {})}
//             searchValue={inputValue}
//             loading={isLoading}
//             userPermissions={userPermissions}
//             onEditSuccess={() => fetchReportingCgs(currentFilter || {})}
//             onEdit={handleEdit}
//             references={references}
//             canEdit={canEdit}
//             currentUserRoles={currentUserRoles}
//             pagination={
//               <div className="flex flex-col md:flex-row items-center w-full justify-end px-6">
//                 <p className="text-md text-black font-bold">
//                   {total} ligne(s)
//                 </p>

//                 <Pagination
//                   total={total}
//                   pageSize={100}
//                   current={page}
//                   onChange={handlePageChange}
//                   showSizeChanger={false}
//                 />
//               </div>
//             }
//           />
//         </div>

//         <Toaster position="bottom-right" reverseOrder={false} />
//       </div>
//     </>
//   );
// };

// export default ReportingCg;


import React, { useEffect, useState, useCallback, useContext } from 'react';
import Header from '../../components/layout/Header';
import Dialogue from '../../components/incidents/Dialogue';
import InitiateForm from '../../components/incidents/ReportingCg/InitiateForm';
import Tabs from '../../components/incidents/Tabs';
import Datalist from '../../components/incidents/ReportingCg/Datalist';
import { useFetch } from '../../hooks/useFetch';
import { Pagination } from 'antd';
import { URLS } from '../../../configUrl';
import { Toaster } from 'react-hot-toast';
import { AUTHCONTEXT } from '../../contexts/AuthProvider';
import { getEmployee } from '../../utils/entity.utils';
import {
  MagnifyingGlassIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import ActionHeaders from '../../components/common/ActionHeaders';
import { Button } from '../../components/ui/button';

// Rôles pour lesquels on restreint la vue (actuellement désactivé)
const RESTRICTED_ROLES = ['OP', 'head guard'];

const ReportingCg = () => {
  const { handleFetch } = useFetch();
  const authContext = useContext(AUTHCONTEXT);

  // États principaux
  const [reportingCgs, setReportingCgs] = useState([]);
  const [isOpenned, setIsOpenned] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [userPermissions, setUserPermissions] = useState([]);
  const [editData, setEditData] = useState(null);
  const [currentFilter, setCurrentFilter] = useState(null);

  const [references, setReferences] = useState({
    sites: [],
    shifts: [],
    employees: [],
  });

  // Rôles et identité de l'utilisateur connecté
  const [currentUserRoles, setCurrentUserRoles] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  // Permission d'édition
  const canEdit =
    currentUserRoles?.some((role) =>
      ['ADMIN', 'DEX', 'ROP'].includes(role)
    ) ?? false;

  // États des filtres
  const [selectValue, setSelectValue] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Options de filtrage
  const allFilterOptions = [
    { value: 'siteId', name: 'Site' },
    { value: 'shiftId', name: 'Quart' },
    { value: 'incomingCgId', name: 'CG entrant' },
    { value: 'numRef', name: 'N° Réf' },
    { value: 'createdBy', name: 'Créé par' },
    { value: 'updatedBy', name: 'Modifié par' },
    { value: 'isActive', name: 'Statut' },
    { value: 'createdAt', name: 'Date de création' },
    { value: 'updatedAt', name: 'Date de modification' },
  ];

  const DATE_FILTERS = ['createdAt', 'updatedAt'];

  const loadReferences = async () => {
    try {
      const [sitesRes, shiftsRes, employeesRes] = await Promise.all([
        handleFetch(`${URLS.ENTITY_API}/sites`),
        handleFetch(`${URLS.ENTITY_API}/shifts`),
        handleFetch(`${URLS.ENTITY_API}/employees`),
      ]);

      const extractArray = (response) => {
        const data = response?.data;

        if (!data) return [];

        if (Array.isArray(data?.data)) {
          return data.data;
        }

        if (Array.isArray(data)) {
          return data;
        }

        return [];
      };

      setReferences({
        sites: extractArray(sitesRes),
        shifts: extractArray(shiftsRes),
        employees: extractArray(employeesRes),
      });
    } catch (error) {
      console.error('Erreur chargement références :', error);
    }
  };

  const loadUserPermissions = async () => {
    try {
      const employee = await getEmployee();

      if (!employee) {
        setCurrentUserRoles([]);
        setCurrentUserId(null);
        setUserPermissions([]);
        return;
      }

      const roles = Array.isArray(employee?.employeeRoles)
        ? employee.employeeRoles
            .map((employeeRole) => employeeRole?.role?.roleName)
            .filter(Boolean)
        : [];

      setCurrentUserRoles(roles);
      setCurrentUserId(employee?.id || null);

      const response = await handleFetch(
        `${URLS.ENTITY_API}/employees/${employee.id}/permissions`
      );

      const permissionNames =
        response?.employeePermissions
          ?.map((permission) => permission?.permission?.permissionName)
          .filter(Boolean) || [];

      setUserPermissions(permissionNames);
    } catch (error) {
      console.error('Erreur chargement permissions :', error);
      setCurrentUserRoles([]);
      setUserPermissions([]);
    }
  };

  const fetchReportingCgs = useCallback(
    async (params = {}) => {
      setIsLoading(true);

      try {
        let url = `${URLS.INCIDENT_API}/reporting-cgs`;
        const queryParams = new URLSearchParams();

        if (params.page) {
          queryParams.append('page', String(params.page));
        }

        if (
          params.filter &&
          params.value !== undefined &&
          params.value !== null &&
          params.value !== ''
        ) {
          queryParams.append('filter', params.filter);
          queryParams.append('value', String(params.value));
        }

        const qs = queryParams.toString();

        if (qs) {
          url += `?${qs}`;
        }

        const response = await handleFetch(url);

        if (!response) {
          setReportingCgs([]);
          setTotal(0);
          setTotalPages(1);
          return;
        }

        const payload = response?.data;

        const data = Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload)
            ? payload
            : [];

        setReportingCgs(data);
        setTotal(payload?.total ?? data.length);
        setTotalPages(payload?.totalPages ?? 1);
        setPage(payload?.page ?? params.page ?? 1);
      } catch (error) {
        console.error('Erreur fetch reportingCgs :', error);
        setReportingCgs([]);
        setTotal(0);
        setTotalPages(1);
      } finally {
        setIsLoading(false);
      }
    },
    [handleFetch]
  );

  const handleOnSelectChange = (event) => {
    const value = event.target.value;

    setSelectValue(value);
    setInputValue('');
    setStartDate('');
    setEndDate('');
    setCurrentFilter(null);

    if (!value) {
      fetchReportingCgs();
    }
  };

  const handleInputChange = useCallback(
    (event) => {
      const value = event.target.value;

      setInputValue(value);

      if (selectValue && value) {
        const filter = {
          filter: selectValue,
          value,
        };

        setCurrentFilter(filter);
        fetchReportingCgs(filter);
        return;
      }

      if (!value) {
        setCurrentFilter(null);
        fetchReportingCgs();
      }
    },
    [selectValue, fetchReportingCgs]
  );

  const handleStartDateChange = (event) => {
    const value = event.target.value;

    setStartDate(value);

    if (value && endDate) {
      const dateValue = `${value},${endDate}`;
      const filter = {
        filter: selectValue,
        value: dateValue,
      };

      setInputValue(dateValue);
      setCurrentFilter(filter);
      fetchReportingCgs(filter);
      return;
    }

    if (!value && endDate) {
      setCurrentFilter(null);
      fetchReportingCgs();
    }
  };

  const handleEndDateChange = (event) => {
    const value = event.target.value;

    setEndDate(value);

    if (startDate && value) {
      const dateValue = `${startDate},${value}`;
      const filter = {
        filter: selectValue,
        value: dateValue,
      };

      setInputValue(dateValue);
      setCurrentFilter(filter);
      fetchReportingCgs(filter);
      return;
    }

    if (startDate && !value) {
      setCurrentFilter(null);
      fetchReportingCgs();
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > totalPages && totalPages > 0) {
      return;
    }

    const params = {
      page: newPage,
    };

    if (currentFilter) {
      params.filter = currentFilter.filter;
      params.value = currentFilter.value;
    }

    fetchReportingCgs(params);
  };

  const resetFilters = () => {
    setSelectValue('');
    setInputValue('');
    setStartDate('');
    setEndDate('');
    setCurrentFilter(null);

    fetchReportingCgs();
  };

  const handleDisplayInput = (criteria) => {
    const disabled = !criteria;

    const baseClass = `
      p-1
      text-sm
      w-full
      focus:outline-blue-300
      ${disabled ? 'cursor-not-allowed bg-gray-200' : ''}
    `;

    const wrapClass = `
      border
      p-1
      rounded-lg
      w-full
      md:max-w-[300px]
      relative
      flex
      items-center
      my-2
      ${disabled ? 'cursor-not-allowed bg-gray-200' : ''}
    `;

    if (criteria === 'siteId') {
      return (
        <div className={wrapClass}>
          <MagnifyingGlassIcon className="h-4 text-gray-400 px-2" />

          <select
            className={baseClass}
            value={inputValue}
            onChange={handleInputChange}
          >
            <option value="">Sélectionner un site</option>

            {references.sites.map((site) => (
              <option key={site.id} value={site.id}>
                {site.name}
              </option>
            ))}
          </select>
        </div>
      );
    }

    if (criteria === 'shiftId') {
      return (
        <div className={wrapClass}>
          <MagnifyingGlassIcon className="h-4 text-gray-400 px-2" />

          <select
            className={baseClass}
            value={inputValue}
            onChange={handleInputChange}
          >
            <option value="">Sélectionner un quart</option>

            {references.shifts.map((shift) => (
              <option key={shift.id} value={shift.id}>
                {shift.name}
              </option>
            ))}
          </select>
        </div>
      );
    }

    if (criteria === 'incomingCgId') {
      const uniqueIncomingCgs = reportingCgs.filter(
        (report, index, array) =>
          report?.incomingCgId &&
          array.findIndex(
            (item) => item?.incomingCgId === report?.incomingCgId
          ) === index
      );

      return (
        <div className={wrapClass}>
          <MagnifyingGlassIcon className="h-4 text-gray-400 px-2" />

          <select
            className={baseClass}
            value={inputValue}
            onChange={handleInputChange}
          >
            <option value="">Sélectionner un CG entrant</option>

            {uniqueIncomingCgs.map((report) => (
              <option
                key={report.incomingCgId}
                value={report.incomingCgId}
              >
                {report.incomingCgId}
              </option>
            ))}
          </select>
        </div>
      );
    }

    if (criteria === 'isActive') {
      return (
        <div className={wrapClass}>
          <MagnifyingGlassIcon className="h-4 text-gray-400 px-2" />

          <select
            className={baseClass}
            value={inputValue}
            onChange={handleInputChange}
          >
            <option value="">Sélectionner un statut</option>
            <option value="true">Actif</option>
            <option value="false">Inactif</option>
          </select>
        </div>
      );
    }

    if (DATE_FILTERS.includes(criteria)) {
      return (
        <div className={wrapClass}>
          <div className="flex items-center gap-2 w-full px-1">
            <input
              type="date"
              value={startDate}
              onChange={handleStartDateChange}
              className={baseClass}
            />

            <span className="text-gray-400 shrink-0">à</span>

            <input
              type="date"
              value={endDate}
              onChange={handleEndDateChange}
              className={baseClass}
            />
          </div>
        </div>
      );
    }

    return (
      <div className={wrapClass}>
        <MagnifyingGlassIcon className="h-4 text-gray-400 px-2" />

        <input
          placeholder={
            criteria
              ? `Rechercher par ${
                  allFilterOptions
                    .find((filter) => filter.value === criteria)
                    ?.name?.toLowerCase() || criteria
                }`
              : 'Choisir le filtre'
          }
          className={baseClass}
          value={inputValue}
          onChange={handleInputChange}
          disabled={disabled}
        />
      </div>
    );
  };

  const handleSubmit = () => {
    // Recharge la liste (avec le filtre courant s'il y en a un)
    fetchReportingCgs(currentFilter || {});
    document.getElementById('close-dialog')?.click();
    setIsOpenned(false);
    setEditData(null);
  };

  const handleCancelEdit = () => {
    setEditData(null);
    setIsOpenned(false);
  };

  const handleEdit = (record) => {
    if (!record) return;

    setEditData(record);
    setIsOpenned(true);
  };

  /*
   * Chargement unique au montage :
   * - Références : sites, quarts, employés
   * - Permissions et rôles utilisateur
   *
   * On ne met volontairement pas handleFetch, loadReferences
   * ou loadUserPermissions dans les dépendances parce que useFetch
   * crée de nouvelles fonctions à chaque render.
   */
  useEffect(() => {
    loadReferences();
    loadUserPermissions();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /*
   * Chargement unique de la liste au montage.
   *
   * Ne pas écrire [fetchReportingCgs] ici :
   * fetchReportingCgs est recréée à chaque render car handleFetch
   * est recréée dans useFetch.
   */
  useEffect(() => {
    fetchReportingCgs();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Header />

      <div className="px-6 space-y-4">
        <div className="flex items-center">
          <div className="overflow-x-auto">
            <Tabs />
          </div>
        </div>

        <div className="w-full bg-white rounded-lg p-2 h-[70vh] flex flex-col">
          <div className="flex flex-col md:flex-row items-center justify-between mb-4 px-4">
            <div className="flex flex-col md:flex-row items-center gap-4 w-full">
              <ActionHeaders
                filterOptions={allFilterOptions}
                selectChange={handleOnSelectChange}
                selectValue={selectValue}
                input={handleDisplayInput(selectValue)}
              />

              {(selectValue || inputValue || startDate || endDate) && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetFilters}
                  className="flex items-center gap-2 h-10"
                >
                  <XMarkIcon className="h-4 w-4" />
                  Réinitialiser
                </Button>
              )}
            </div>

            <Dialogue
              buttonText={
                editData
                  ? 'Modifier le rapport'
                  : 'Nouveau rapport CG'
              }
              header={
                <h2 className="text-xl font-semibold">
                  {editData
                    ? 'Modifier le rapport'
                    : 'Nouveau rapport CG'}
                </h2>
              }
              content={
                <InitiateForm
                  onSuccess={handleSubmit}
                  onCancelEdit={handleCancelEdit}
                  editData={editData}
                />
              }
              isOpenned={isOpenned}
              onOpen={() => setIsOpenned(true)}
              onClose={() => {
                setIsOpenned(false);
                setEditData(null);
              }}
            />
          </div>

          <Datalist
            dataList={reportingCgs}
            fetchData={() => fetchReportingCgs(currentFilter || {})}
            searchValue={inputValue}
            loading={isLoading}
            userPermissions={userPermissions}
            onEditSuccess={() => fetchReportingCgs(currentFilter || {})}
            onEdit={handleEdit}
            references={references}
            canEdit={canEdit}
            currentUserRoles={currentUserRoles}
            onWatchReportChange={() => fetchReportingCgs(currentFilter || {})}
            pagination={
              <div className="flex flex-col md:flex-row items-center w-full justify-end px-6">
                <p className="text-md text-black font-bold">{total} ligne(s)</p>
                <Pagination
                  total={total}
                  pageSize={100}
                  current={page}
                  onChange={handlePageChange}
                  showSizeChanger={false}
                />
              </div>
            }
          />
        </div>

        <Toaster position="bottom-right" reverseOrder={false} />
      </div>
    </>
  );
};

export default ReportingCg;