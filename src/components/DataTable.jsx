import { useState } from "react";
import PropTypes from 'prop-types'; // Ajout de l'importation de PropTypes
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "./ui/table";

  import {
    flexRender,


    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    useReactTable,
  } from "@tanstack/react-table";

  import { Input } from "./ui/input";




// export default function DataTable({columns, data, Action, className}) {
//   return (
//     <div className={className}>
//         <Table>
//             <TableHeader>
//                 <TableRow>
//                        { columns?.map((item, index)=> 
//                             <TableHead key={index}>
//                                 {item?.header}
//                             </TableHead>
//                             )
//                         }
                   
//                 </TableRow>
//             </TableHeader>
//             <TableBody>
//                     { 
//                         data?.map((item, index)=>
//                             <TableRow key={index}>
//                                 {
//                                     Object.values(item).map((cell, index)=>
//                                         <TableCell key={index}>
//                                             {cell.toString()}
//                                         </TableCell>
//                                     )
//                                 }
//                                 <>{Action}</>
//                             </TableRow>
//                         )
//                     }
//             </TableBody>
//         </Table>
//     </div>
//   );
// }


export default function DataTable({columns, data, Action, className}) {

    const [globalFilter, setGlobalFilter] = useState([]);

    // Ajout de la validation des props
    DataTable.propTypes = {
        columns: PropTypes.array.isRequired,
        data: PropTypes.array.isRequired,
        Action: PropTypes.node,
        className: PropTypes.string,
    };

    const tableModel = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state:{
            globalFilter,
        },
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: (row, columnId, filterValue) => {
            const rowValue = row.getValue(columnId);
            const filterString = String(filterValue || '').toLowerCase();
            return String(rowValue).toLowerCase().includes(filterString);
        },
    });


  return (
    <div className={className}>
       
        <Input
          placeholder="Effectuer une recherche..."
          value={globalFilter}
          onChange={e => tableModel.setGlobalFilter(String(e.target.value))}
          className="max-w-md m-2 text-xs"
        />

        <Table className="text-xs">

            <TableHeader>
                    <TableRow>
                        { columns?.map((item, index)=> 
                                <TableHead key={index} className="text-bold bg-blue-900 text-white">
                                    {flexRender(item?.header)}
                                </TableHead>
                                )
                            }
                    
                    </TableRow>
            </TableHeader>
                    <TableBody>
                        {
                            tableModel.getRowModel().rows?.length ? (
                                tableModel.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                    ))}
                                </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    Pas de résultats.
                                </TableCell>
                                </TableRow>
                            )
                        }
                   </TableBody>
            



        </Table>
    </div>
  );
}
