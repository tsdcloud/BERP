// import React, { useCallback, useMemo, useState } from 'react';
// import { Button } from '../../ui/button';
// import { PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
// import { Table, Form } from 'antd';
// import { MoreHorizontal } from 'lucide-react';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from '../../../components/ui/dropdown-menu';
// import { URLS } from '../../../../configUrl';
// import { useFetch } from '../../../hooks/useFetch';
// import toast from 'react-hot-toast';
// import ReportingCgDetails from './ReportingCgDetails';

// const Datalist = ({
//   dataList = [],
//   fetchData,
//   searchValue = '',
//   pagination,
//   loading = false,
//   onEdit,
//   canEdit = false,
//   references = {},
//   userPermissions = [],
//   currentUserRoles = [],
// }) => {
//   const { handleFetch } = useFetch();

//   const [detailsOpen, setDetailsOpen] = useState(false);
//   const [selectedRecord, setSelectedRecord] = useState(null);
//   const [deletingId, setDeletingId] = useState(null);

//   const { sites = [], shifts = [], employees = [] } = references;

//   const getSiteName = useCallback(
//     (id) => sites.find((site) => site.id === id)?.name || id || '-',
//     [sites]
//   );

//   const getShiftName = useCallback(
//     (id) => shifts.find((shift) => shift.id === id)?.name || id || '-',
//     [shifts]
//   );

//   const getEmployeeName = useCallback(
//     (id) => employees.find((employee) => employee.id === id)?.name || id || '-',
//     [employees]
//   );

//   const formatDate = useCallback((date) => {
//     if (!date) return '-';

//     const parsedDate = new Date(date);

//     if (Number.isNaN(parsedDate.getTime())) {
//       return '-';
//     }

//     return parsedDate.toLocaleDateString('fr-FR');
//   }, []);

//   const formatAmount = useCallback((value) => {
//     const amount = Number(value);

//     if (!Number.isFinite(amount)) {
//       return '-';
//     }

//     return amount.toFixed(2);
//   }, []);

//   const escapeRegExp = useCallback((value) => {
//     return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
//   }, []);

//   const highlightText = useCallback(
//     (text) => {
//       if (text === null || text === undefined) {
//         return '-';
//       }

//       const textValue = String(text);

//       if (!searchValue?.trim()) {
//         return textValue;
//       }

//       const escapedSearch = escapeRegExp(searchValue.trim());

//       if (!escapedSearch) {
//         return textValue;
//       }

//       const regex = new RegExp(`(${escapedSearch})`, 'gi');
//       const parts = textValue.split(regex);

//       return (
//         <>
//           {parts.map((part, index) =>
//             regex.test(part) ? (
//               <mark key={`${part}-${index}`}>{part}</mark>
//             ) : (
//               <React.Fragment key={`${part}-${index}`}>
//                 {part}
//               </React.Fragment>
//             )
//           )}
//         </>
//       );
//     },
//     [escapeRegExp, searchValue]
//   );

//   const openDetails = useCallback((record) => {
//     if (!record) return;

//     setSelectedRecord(record);
//     setDetailsOpen(true);
//   }, []);

//   const closeDetails = useCallback((isOpen) => {
//     setDetailsOpen(isOpen);

//     if (!isOpen) {
//       setSelectedRecord(null);
//     }
//   }, []);

//   const handleEdit = useCallback(
//     (record) => {
//       if (!record || !onEdit) return;

//       setDetailsOpen(false);
//       setSelectedRecord(null);
//       onEdit(record);
//     },
//     [onEdit]
//   );

//   const handleDelete = useCallback(
//     async (id) => {
//       if (!id || deletingId) return;

//       const confirmed = window.confirm(
//         'Voulez-vous réellement supprimer ce rapport ?'
//       );

//       if (!confirmed) return;

//       setDeletingId(id);

//       try {
//         const response = await handleFetch(
//           `${URLS.INCIDENT_API}/reporting-cgs/${id}`,
//           { method: 'DELETE' }
//         );

//         if (response && !response.error) {
//           toast.success('Rapport supprimé avec succès');

//           if (selectedRecord?.id === id) {
//             setDetailsOpen(false);
//             setSelectedRecord(null);
//           }

//           if (fetchData) {
//             await fetchData();
//           }

//           return;
//         }

//         toast.error(response?.message || 'Échec de la suppression du rapport');
//       } catch (error) {
//         console.error('Erreur lors de la suppression du rapport CG :', error);
//         toast.error('Une erreur réseau est survenue lors de la suppression');
//       } finally {
//         setDeletingId(null);
//       }
//     },
//     [deletingId, fetchData, handleFetch, selectedRecord?.id]
//   );

//   const columns = useMemo(
//     () => [
//       {
//         title: 'N° Réf',
//         dataIndex: 'numRef',
//         width: 120,
//         render: (value) => highlightText(value),
//       },
//       {
//         title: 'Créé par',
//         dataIndex: 'createdBy',
//         width: 150,
//         render: (value) => getEmployeeName(value),
//       },
//       {
//         title: 'Créé le',
//         dataIndex: 'createdAt',
//         width: 120,
//         render: (value) => formatDate(value),
//       },
//       {
//         title: 'Quart',
//         dataIndex: 'shiftId',
//         width: 120,
//         render: (value) => getShiftName(value),
//       },
//       {
//         title: 'Site',
//         dataIndex: 'siteId',
//         width: 110,
//         render: (value) => getSiteName(value),
//       },
//       {
//         title: 'N° recette',
//         dataIndex: 'recipeCardNumber',
//         width: 120,
//         render: (value) => value || '-',
//       },
//       {
//         title: 'CG entrant',
//         dataIndex: 'incomingCgId',
//         width: 150,
//         render: (value) => getEmployeeName(value),
//       },
//       {
//         title: 'Pesées compl. F',
//         dataIndex: 'completeNumberWeighingsToBeBilled',
//         width: 130,
//         align: 'center',
//         render: (value) => value ?? 0,
//       },
//       {
//         title: 'Pesées compl. E',
//         dataIndex: 'completeNumberWeighingsBySpecies',
//         width: 130,
//         align: 'center',
//         render: (value) => value ?? 0,
//       },
//       {
//         title: 'Pesées incomp. F',
//         dataIndex: 'incompleteNumberWeighingsToBeBilled',
//         width: 140,
//         align: 'center',
//         render: (value) => value ?? 0,
//       },
//       {
//         title: 'Pesées incomp. E',
//         dataIndex: 'incompleteNumberWeighingsBySpecies',
//         width: 140,
//         align: 'center',
//         render: (value) => value ?? 0,
//       },
//       {
//         title: 'Tests E',
//         dataIndex: 'testNumberWeighingsBySpecies',
//         width: 100,
//         align: 'center',
//         render: (value) => value ?? 0,
//       },
//       {
//         title: 'Hors-pont',
//         dataIndex: 'offBridgeNumber',
//         width: 100,
//         align: 'center',
//         render: (value) => value ?? 0,
//       },
//       {
//         title: 'Mt pesée',
//         dataIndex: 'totalWeightAmount',
//         width: 110,
//         align: 'right',
//         render: (value) => formatAmount(value),
//       },
//       {
//         title: 'Incidents',
//         dataIndex: 'numberIncidents',
//         width: 100,
//         align: 'center',
//         render: (value) => value ?? 0,
//       },
//       {
//         title: 'Mis à jour par',
//         dataIndex: 'updatedBy',
//         width: 150,
//         render: (value) => getEmployeeName(value),
//       },
//       {
//         title: 'Mis à jour le',
//         dataIndex: 'updatedAt',
//         width: 130,
//         render: (value) => formatDate(value),
//       },
//       {
//         title: 'Actions',
//         width: 100,
//         fixed: 'right',
//         align: 'center',
//         render: (_, record) => (
//           <div onClick={(event) => event.stopPropagation()}>
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button
//                   type="button"
//                   variant="ghost"
//                   className="h-8 w-8 p-0"
//                   aria-label={`Actions pour le rapport ${record?.numRef || ''}`}
//                 >
//                   <MoreHorizontal className="h-4 w-4" />
//                 </Button>
//               </DropdownMenuTrigger>

//               <DropdownMenuContent align="end">
//                 <DropdownMenuLabel>Actions</DropdownMenuLabel>
//                 <DropdownMenuSeparator />

//                 <DropdownMenuItem onClick={() => openDetails(record)}>
//                   <EyeIcon className="h-4 w-4 mr-2" />
//                   Voir les détails
//                 </DropdownMenuItem>

//                 {canEdit && (
//                   <>
//                     <DropdownMenuItem onClick={() => handleEdit(record)}>
//                       <PencilIcon className="h-4 w-4 mr-2" />
//                       Éditer
//                     </DropdownMenuItem>

//                     <DropdownMenuItem
//                       onClick={() => handleDelete(record?.id)}
//                       disabled={deletingId === record?.id}
//                       className="text-red-600 focus:text-red-600"
//                     >
//                       <TrashIcon className="h-4 w-4 mr-2" />
//                       {deletingId === record?.id
//                         ? 'Suppression...'
//                         : 'Supprimer'}
//                     </DropdownMenuItem>
//                   </>
//                 )}
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>
//         ),
//       },
//     ],
//     [
//       canEdit,
//       deletingId,
//       formatAmount,
//       formatDate,
//       getEmployeeName,
//       getShiftName,
//       getSiteName,
//       handleDelete,
//       handleEdit,
//       highlightText,
//       openDetails,
//     ]
//   );

//   return (
//     <div className="w-full">
//       <div className="py-2 px-4 w-full max-h-[500px]">
//         <Form>
//           <Table
//             dataSource={Array.isArray(dataList) ? dataList : []}
//             columns={columns}
//             rowKey={(record) => record?.id || record?.numRef}
//             pagination={false}
//             loading={loading}
//             locale={{
//               emptyText: loading
//                 ? 'Chargement des rapports...'
//                 : 'Aucun rapport CG trouvé',
//             }}
//             onRow={(record) => ({
//               onClick: () => openDetails(record),
//               style: { cursor: 'pointer' },
//             })}
//             scroll={{ x: 2200, y: '40vh' }}
//             footer={() => (
//               <div className="flex justify-end">
//                 {pagination}
//               </div>
//             )}
//           />
//         </Form>
//       </div>

//       {selectedRecord && (
//         <ReportingCgDetails
//           open={detailsOpen}
//           setOpen={closeDetails}
//           reporting={selectedRecord}
//           references={references}
//           type="cg"
//           userPermissions={userPermissions}
//           currentUserRoles={currentUserRoles}
//         />
//       )}
//     </div>
//   );
// };

// export default Datalist;

import React, { useCallback, useMemo, useState } from 'react';
import { Button } from '../../ui/button';
import { PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import { Table, Form } from 'antd';
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';
import { URLS } from '../../../../configUrl';
import { useFetch } from '../../../hooks/useFetch';
import toast from 'react-hot-toast';
import ReportingCgDetails from './ReportingCgDetails';

const Datalist = ({
  dataList = [],
  fetchData,
  searchValue = '',
  pagination,
  loading = false,
  onEdit,
  canEdit = false,
  references = {},
  userPermissions = [],
  currentUserRoles = [],
  onWatchReportChange,
}) => {
  const { handleFetch } = useFetch();

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const { sites = [], shifts = [], employees = [] } = references;

  const getSiteName = useCallback(
    (id) => sites.find((site) => site.id === id)?.name || id || '-',
    [sites]
  );

  const getShiftName = useCallback(
    (id) => shifts.find((shift) => shift.id === id)?.name || id || '-',
    [shifts]
  );

  const getEmployeeName = useCallback(
    (id) => employees.find((employee) => employee.id === id)?.name || id || '-',
    [employees]
  );

  const formatDate = useCallback((date) => {
    if (!date) return '-';
    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) return '-';
    return parsedDate.toLocaleDateString('fr-FR');
  }, []);

  const formatAmount = useCallback((value) => {
    const amount = Number(value);
    if (!Number.isFinite(amount)) return '-';
    return amount.toFixed(2);
  }, []);

  const escapeRegExp = useCallback((value) => {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }, []);

  const highlightText = useCallback(
    (text) => {
      if (text === null || text === undefined) return '-';
      const textValue = String(text);
      if (!searchValue?.trim()) return textValue;
      const escapedSearch = escapeRegExp(searchValue.trim());
      if (!escapedSearch) return textValue;
      const regex = new RegExp(`(${escapedSearch})`, 'gi');
      const parts = textValue.split(regex);
      return (
        <>
          {parts.map((part, index) =>
            regex.test(part) ? (
              <mark key={`${part}-${index}`}>{part}</mark>
            ) : (
              <React.Fragment key={`${part}-${index}`}>{part}</React.Fragment>
            )
          )}
        </>
      );
    },
    [escapeRegExp, searchValue]
  );

  // ✅ Relation 1-1 : watchReport
  const hasWatchReport = useCallback((record) => {
    return Boolean(record?.watchReport);
  }, []);

  const openDetails = useCallback((record) => {
    if (!record) return;
    setSelectedRecord(record);
    setDetailsOpen(true);
  }, []);

  const closeDetails = useCallback((isOpen) => {
    setDetailsOpen(isOpen);
    if (!isOpen) setSelectedRecord(null);
  }, []);

  const handleEdit = useCallback(
    (record) => {
      if (!record || !onEdit) return;
      setDetailsOpen(false);
      setSelectedRecord(null);
      onEdit(record);
    },
    [onEdit]
  );

  const handleDelete = useCallback(
    async (id) => {
      if (!id || deletingId) return;
      const confirmed = window.confirm(
        'Voulez-vous réellement supprimer ce rapport ?'
      );
      if (!confirmed) return;

      setDeletingId(id);
      try {
        const response = await handleFetch(
          `${URLS.INCIDENT_API}/reporting-cgs/${id}`,
          { method: 'DELETE' }
        );

        if (response && !response.error) {
          toast.success('Rapport supprimé avec succès');
          if (selectedRecord?.id === id) {
            setDetailsOpen(false);
            setSelectedRecord(null);
          }
          if (fetchData) await fetchData();
          return;
        }
        toast.error(response?.message || 'Échec de la suppression du rapport');
      } catch (error) {
        console.error('Erreur lors de la suppression du rapport CG :', error);
        toast.error('Une erreur réseau est survenue lors de la suppression');
      } finally {
        setDeletingId(null);
      }
    },
    [deletingId, fetchData, handleFetch, selectedRecord?.id]
  );

  const columns = useMemo(
    () => [
      {
        title: 'N° Réf',
        dataIndex: 'numRef',
        width: 120,
        render: (value) => highlightText(value),
      },
      // ✅ Colonne badge Watch Report
      {
        title: 'Rapport de Quart',
        key: 'watchReportStatus',
        width: 150,
        align: 'center',
        render: (_, record) => {
          const exists = hasWatchReport(record);
          return exists ? (
            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800">
              Traité 
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-800">
              Transmis
            </span>
          );
        },
      },
      {
        title: 'Créé par',
        dataIndex: 'createdBy',
        width: 150,
        render: (value) => getEmployeeName(value),
      },
      {
        title: 'Créé le',
        dataIndex: 'createdAt',
        width: 120,
        render: (value) => formatDate(value),
      },
      {
        title: 'Quart',
        dataIndex: 'shiftId',
        width: 120,
        render: (value) => getShiftName(value),
      },
      {
        title: 'Site',
        dataIndex: 'siteId',
        width: 110,
        render: (value) => getSiteName(value),
      },
      {
        title: 'N° recette',
        dataIndex: 'recipeCardNumber',
        width: 120,
        render: (value) => value || '-',
      },
      {
        title: 'CG entrant',
        dataIndex: 'incomingCgId',
        width: 150,
        render: (value) => getEmployeeName(value),
      },
      {
        title: 'Pesées compl. F',
        dataIndex: 'completeNumberWeighingsToBeBilled',
        width: 130,
        align: 'center',
        render: (value) => value ?? 0,
      },
      {
        title: 'Pesées compl. E',
        dataIndex: 'completeNumberWeighingsBySpecies',
        width: 130,
        align: 'center',
        render: (value) => value ?? 0,
      },
      {
        title: 'Pesées incomp. F',
        dataIndex: 'incompleteNumberWeighingsToBeBilled',
        width: 140,
        align: 'center',
        render: (value) => value ?? 0,
      },
      {
        title: 'Pesées incomp. E',
        dataIndex: 'incompleteNumberWeighingsBySpecies',
        width: 140,
        align: 'center',
        render: (value) => value ?? 0,
      },
      {
        title: 'Tests E',
        dataIndex: 'testNumberWeighingsBySpecies',
        width: 100,
        align: 'center',
        render: (value) => value ?? 0,
      },
      {
        title: 'Hors-pont',
        dataIndex: 'offBridgeNumber',
        width: 100,
        align: 'center',
        render: (value) => value ?? 0,
      },
      {
        title: 'Mt pesée',
        dataIndex: 'totalWeightAmount',
        width: 110,
        align: 'right',
        render: (value) => formatAmount(value),
      },
      {
        title: 'Incidents',
        dataIndex: 'numberIncidents',
        width: 100,
        align: 'center',
        render: (value) => value ?? 0,
      },
      {
        title: 'Mis à jour par',
        dataIndex: 'updatedBy',
        width: 150,
        render: (value) => getEmployeeName(value),
      },
      {
        title: 'Mis à jour le',
        dataIndex: 'updatedAt',
        width: 130,
        render: (value) => formatDate(value),
      },
      {
        title: 'Actions',
        width: 100,
        fixed: 'right',
        align: 'center',
        render: (_, record) => (
          <div onClick={(event) => event.stopPropagation()}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  className="h-8 w-8 p-0"
                  aria-label={`Actions pour le rapport ${record?.numRef || ''}`}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => openDetails(record)}>
                  <EyeIcon className="h-4 w-4 mr-2" />
                  Voir les détails
                </DropdownMenuItem>
                {canEdit && (
                  <>
                    <DropdownMenuItem onClick={() => handleEdit(record)}>
                      <PencilIcon className="h-4 w-4 mr-2" />
                      Éditer
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(record?.id)}
                      disabled={deletingId === record?.id}
                      className="text-red-600 focus:text-red-600"
                    >
                      <TrashIcon className="h-4 w-4 mr-2" />
                      {deletingId === record?.id ? 'Suppression...' : 'Supprimer'}
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
      },
    ],
    [
      canEdit,
      deletingId,
      formatAmount,
      formatDate,
      getEmployeeName,
      getShiftName,
      getSiteName,
      handleDelete,
      handleEdit,
      highlightText,
      openDetails,
      hasWatchReport,
    ]
  );

  return (
    <div className="w-full">
      <div className="py-2 px-4 w-full max-h-[500px]">
        <Form>
          <Table
            dataSource={Array.isArray(dataList) ? dataList : []}
            columns={columns}
            rowKey={(record) => record?.id || record?.numRef}
            pagination={false}
            loading={loading}
            locale={{
              emptyText: loading
                ? 'Chargement des rapports...'
                : 'Aucun rapport CG trouvé',
            }}
            onRow={(record) => ({
              onClick: () => openDetails(record),
              style: { cursor: 'pointer' },
            })}
            scroll={{ x: 2350, y: '40vh' }}
            footer={() => <div className="flex justify-end">{pagination}</div>}
          />
        </Form>
      </div>

      {selectedRecord && (
        <ReportingCgDetails
          open={detailsOpen}
          setOpen={closeDetails}
          reporting={selectedRecord}
          references={references}
          type="cg"
          userPermissions={userPermissions}
          currentUserRoles={currentUserRoles}
          onWatchReportChange={() => {
            if (typeof fetchData === 'function') {
              fetchData();
            }
            if (typeof onWatchReportChange === 'function') {
              onWatchReportChange();
            }
          }}
        />
      )}
    </div>
  );
};

export default Datalist;