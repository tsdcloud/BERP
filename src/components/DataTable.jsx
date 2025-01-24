import { useState, useEffect, useRef } from "react";
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
  import { Button } from "./ui/button";
//   import { Checkbox } from "./ui/checkbox";


export default function DataTable({ columns, data, className }) {

    const [globalFilter, setGlobalFilter] = useState([]);
    

    // Adding props validation
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
        initialState: {
            pagination: {
              pageSize: 5, //custom default page size
            },
          },
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
          className="w-[250px] m-2 text-xs"
        />

        <div className="relative">
            <div className="absolute top-0 right-0 h-full w-4 bg-gradient-to-l from-gray-300 via-transparent pointer-events-none sm:hidden"></div>

            <Table className="text-xs">

                <TableHeader>
                        <TableRow>
                            { 
                                columns?.map((item, index)=> 
                                <TableHead key={index} className="text-bold bg-blue-900 text-white">
                                    {flexRender(item?.header)}
                                </TableHead>
                                )
                            }
                        
                        </TableRow>
                </TableHeader>
                        <TableBody className="">
                            {
                                tableModel.getRowModel().rows?.length ? (
                                    tableModel.getRowModel()?.rows?.map((row) => (
                                        <TableRow
                                            key={row.id}
                                            data-state={row.getIsSelected() && "selected"}
                                        >
                                            {row.getVisibleCells()?.map((cell) => (
                                            <TableCell key={cell.id} >
                                                {
                                                    cell.column.columnDef.accessorKey === "is_active" ?
                                                    cell.row.original.is_active === true ? "Activé" : "Desactivé"
                                                    :
                                                        cell.column.columnDef.accessorKey === "email" ?
                                                        (cell.row.original.email.length > 6 ? 
                                                        `${cell.row.original.email.slice(0, 6)}...` : 
                                                        cell.row.original.email) 
                                                    :
                                                    flexRender(cell.column.columnDef.cell, cell.getContext()) 
                                                }
                                            </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                            <TableCell colSpan={columns?.length} className="h-24 text-center">
                                                Pas de résultats.
                                            </TableCell>
                                    </TableRow>
                                )
                            }
                    </TableBody>

            </Table>
        </div>


        <div className="flex items-center justify-end space-x-2 m-2 pb-1">

            {/* show selected rowa */}
            {/* <div className="flex-1 text-xs text-muted-foreground">
            {tableModel.getFilteredSelectedRowModel().rows.length} de{" "}
            {tableModel.getFilteredRowModel().rows.length} ligne(s) sélectionné(s).
            </div> */}

            <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => tableModel.previousPage()}
                        disabled={!tableModel.getCanPreviousPage()}
                    >
                        Précédent
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => tableModel.nextPage()}
                        disabled={!tableModel.getCanNextPage()}
                    >
                        Suivant
                    </Button>
            </div>
      </div>
    </div>
  );
}
