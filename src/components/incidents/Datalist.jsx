import React, {useEffect, useState} from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import { useFetch } from '../../hooks/useFetch';
import { ExclamationTriangleIcon, PencilIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog"

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ChevronDown, MoreHorizontal } from "lucide-react"
import { Checkbox } from "../ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import { Input } from "../../components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table"
import { URLS } from '../../../configUrl';
import { INCIDENT_STATUS, INTERVENANT } from '../../utils/constant.utils';
import AutoComplete from '../common/AutoComplete';


const Datalist = ({dataList, fetchData}) => {

  const handleDelete = async (id) =>{
    if (window.confirm("Voulez vous supprimer l'incident ?")) {
      try {
        let url = `${URLS.INCIDENT_API}/incidents/${id}`;
        let response = await fetch(url, {
          method:"DELETE"
        });
        if(response.status === 200){
          alert("Deleted successfully");
          fetchData();
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  const [isOpen, setIsOpen] = useState(false);
  const [maintenanceType, setMaintenanceType] = useState("");
  const [supplierType, setSupplierType] = useState("");
  const [description, setDescription] = useState("");

  const handleClose = () => {
    setIsOpen(false);
  };

  const columns = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="text-"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "incidentId",
      header: "Type incident",
      cell: ({ row }) => (
        <div className="capitalize">{incidentTypes.find(item => row.getValue("incidentId") == item?.value)?.name}</div>
      ),
    },
    {
      accessorKey: "siteId",
      header: "Site",
      cell: ({ row }) => (
        <div className="capitalize">{sites.find(item => row.getValue("siteId") == item?.value)?.name}</div>
      ),
    },
    {
      accessorKey: "shiftId",
      header: "Shift",
      cell: ({ row }) => (
        <div className="capitalize">{shifts.find(item => row.getValue("shiftId") == item?.value)?.name}</div>
      ),
    },
    {
      accessorKey: "consomableId",
      header: "Consommables",
      cell: ({ row }) => (
        <div className="capitalize">{consommables.find(item => row.getValue("consomableId") == item?.value)?.name}</div>
      ),
    },
    {
      accessorKey: "equipementId",
      header: "Equipements",
      cell: ({ row }) => (
        <div className="capitalize">{equipements.find(item => row.getValue("equipementId") == item?.value)?.name}</div>
      ),
    },
    {
      accessorKey: "incidentCauseId",
      header: "Cause incident",
      cell: ({ row }) => (
        <div className="capitalize">{incidentCauses.find(item => row.getValue("incidentCauseId") == item?.value)?.name}</div>
      ),
    },
    {
      accessorKey: "status",
      header: "Etat",
      cell: ({ row }) => (
        <div className={`${
          row.getValue("status") === "UNDER_MAINTENANCE"?"border-yellow-500 bg-yellow-300":
          row.getValue("status") === "CLOSED" ? "border-green-500 bg-green-300" :""
        } p-2 rounded-lg border`}>{INCIDENT_STATUS[row.getValue("status")] || "Unknown Status"}</div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      enableHiding: false,
      cell: ({ row }) => {
        const incident = row.original;
   
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              {/* <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(payment.id)}
              >
                Copy payment ID
              </DropdownMenuItem> */}
              <DropdownMenuSeparator />
              {/* <DropdownMenuItem className="flex gap-2 items-center cursor-pointer">
                <PencilIcon className='h-4 w-6'/>
                <span className=''>Editer</span>
              </DropdownMenuItem> */}
              {
                incident.status === "PENDING" &&
                <DropdownMenuItem className="flex gap-2 items-center cursor-pointer">
                  <button className='flex items-center space-x-2'
                    onClick={()=>{
                      setSelectedSite(incident.siteId);
                      setSelectedIncident(incident.id);
                      setIsOpen(true);
                    }}
                  >
                    <ExclamationTriangleIcon />
                    <span>Mettre en maintenance</span>
                  </button>
                </DropdownMenuItem>
              }
              {
                (incident.status === "UNDER_MAINTENANCE" || incident.status === "PENDING") &&
                <DropdownMenuItem className="flex gap-2 items-center cursor-pointer">
                  <button className='flex items-center space-x-2'
                    onClick={async ()=>{
                      if (window.confirm("Voulez vous cloturer l'incident ?")) {
                        try {
                          let url = `${URLS.INCIDENT_API}/incidents/${incident.id}`;
                          let response = await fetch(url, {
                            method:"PATCH",
                            headers:{
                              "Content-Type":"application/json",
                            },
                            body:JSON.stringify({status: "CLOSED"})
                          });
                          if(response.status === 200){
                            fetchData();
                          }
                        } catch (error) {
                          console.log(error);
                        }
                      }
                    }}
                  >
                    <XMarkIcon />
                    <span>Cloturer l'incident</span>
                  </button>
                </DropdownMenuItem>
              }
              <DropdownMenuItem className="flex gap-2 items-center hover:bg-red-200 cursor-pointer" onClick={()=>handleDelete(consommable.id)}>
                <TrashIcon className='text-red-500 h-4 w-6'/>
                <span className='text-red-500'>Supprimer</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ];
  
  const {handleFetch, handlePost} = useFetch();
  const {register, handleSubmit, formState:{errors}, setValue} = useForm();

  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});

  const [isLoading, setIsLoading] = useState(true);
  const [incidentCauses, setIncidentCauses] = useState([]);
  const [incidentTypes, setIncidentTypes] = useState([]);
  const [consommables, setConsommables] = useState([]);
  const [equipements, setEquipments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [externalEntities, setExternalEntities] = useState([]);
  const [maintenanceTypes, setMaintenanceTypes] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [sites, setSites] = useState([]);

  const [selectedSite, setSelectedSite] = useState("")
  const [selectedIncident, setSelectedIncident] = useState("")

  // Handle Fetches
  const handleFetchConsommable = async (link) =>{
    try {
      let response = await handleFetch(link);     
      if(response?.status === 200){
        let formatedData = response?.data.map(item=>{
          return {
            name:item?.name,
            value: item?.id
          }
        });
        setConsommables(formatedData);
      }
    } catch (error) {
      console.error(error);
    } finally{
      setIsLoading(false);
    }
  }
  const handleFetchEquipements = async (link) =>{
      try {
        let response = await handleFetch(link);     
        if(response?.status === 200){
          let formatedData = response?.data.map(item=>{
            return {
              name:item?.name,
              value: item?.id
            }
          });
          setEquipments(formatedData);
        }
      } catch (error) {
        console.error(error);
      } finally{
        setIsLoading(false);
      }
    }
  const handleFetchCauses = async (link) =>{
      try {
        let response = await handleFetch(link);     
        if(response?.status === 200){
          let formatedData = response?.data.map(item=>{
            return {
              name:item?.name,
              value: item?.id
            }
          });
          setIncidentCauses(formatedData);
        }
      } catch (error) {
        console.error(error);
      } finally{
        setIsLoading(false);
      }
    }
  const handleFetchTypes = async (link) =>{
      try {
        let response = await handleFetch(link);     
        if(response?.status === 200){
          let formatedData = response?.data.map(item=>{
            return {
              name:item?.name,
              value: item?.id
            }
          });
          setIncidentTypes(formatedData);
        }
      } catch (error) {
        console.error(error);
      } finally{
        setIsLoading(false);
      }
    }
  const handleFetchSites = async (link) =>{
      try {
        let response = await handleFetch(link);     
        if(response?.status === 200){
          let formatedData = response?.data.map(item=>{
            return {
              name:item?.name,
              value: item?.id
            }
          });
          setSites(formatedData);
        }
      } catch (error) {
        console.error(error);
      } finally{
        setIsLoading(false);
      }
    }
  const handleFetchShifts = async (link) =>{
      try {
        let response = await handleFetch(link);     
        if(response?.status === 200){
          let formatedData = response?.data.map(item=>{
            return {
              name:item?.name,
              value: item?.id
            }
          });
          setShifts(formatedData);
        }
      } catch (error) {
        console.error(error);
      } finally{
        setIsLoading(false);
      }
    }
  const handleFetchMaintenanceTypes = async (link) =>{
    try {
      let response = await handleFetch(link);     
      if(response?.status === 200){
        let formatedData = response?.data.map(item=>{
          return {
            name:item?.name,
            value: item?.id
          }
        });
        setMaintenanceTypes(formatedData);
      }
    } catch (error) {
      console.error(error);
    } finally{
      setIsLoading(false);
    }
  }
  const handleFetchEmployees = async (link) =>{
    try {
      let response = await handleFetch(link);     
      if(response?.status === 200){
        let formatedData = response?.data.map(item=>{
          return {
            name:item?.name,
            value: item?.id
          }
        });
        setEmployees(formatedData);
      }
    } catch (error) {
      console.error(error);
    } finally{
      setIsLoading(false);
    }
  }
  const handleFetchExternalEntities = async (link) =>{
    try {
      let response = await handleFetch(link);     
      if(response?.status === 200){
        let formatedData = response?.data.map(item=>{
          return {
            name:item?.name,
            value: item?.id
          }
        });
        setExternalEntities(formatedData);
      }
    } catch (error) {
      console.error(error);
    } finally{
      setIsLoading(false);
    }
  }

  const handleSelectMaintenanceType=(item)=>{
    setValue("maintenanceId", item.value)
  }

  const handleSelectSupplier=(item)=>{
    setValue("supplierId", item.value)
  }

  const handleSearchEmployee=async(searchInput)=>{
    try{
      // handleFetchEmployee(`${import.meta.env.VITE_ENTITY_API}/employee?search=${searchInput}`);
    }catch(error){
      console.log(error);
    }
  }

  const handleSearchMaintenanceType=async(searchInput)=>{
    try{
      handleFetchMaintenanceTypes(`${import.meta.env.VITE_INCIDENT_API}/maintenance-types?search=${searchInput}`);
    }catch(error){
      console.log(error);
    }
  }
  
  const submitMaintenance = async(data) =>{
    data.userId = "user id";
    data.createdBy = "created id";
    data.description = description;
    data.siteId = selectedSite;
    data.incidentId = selectedIncident
    
    let url = `${import.meta.env.VITE_INCIDENT_API}/maintenances`
    try {
      let response = await handlePost(url, data);
      if(response.status !== 201){
        alert("Echec de la creation de la maintenance");
        return;
      }
      let incidentUrl = `${import.meta.env.VITE_INCIDENT_API}/incidents/${selectedIncident}`;
      let res = await fetch(incidentUrl,{
        headers:{
          "Content-Type":"application/json",
        },
        method:"PATCH",
        body: JSON.stringify({status:"UNDER_MAINTENANCE"})
      })
      if(res.status !== 200){
        alert("Echec de la mis a jour");
        return
      }
      fetchData();
      setIsOpen(false);
    } catch (error) {
      console.log(error)
    }
  }

  const table = useReactTable({
      data: dataList,
      columns,
      onSortingChange: setSorting,
      onColumnFiltersChange: setColumnFilters,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      onColumnVisibilityChange: setColumnVisibility,
      onRowSelectionChange: setRowSelection,
      state: {
        sorting,
        columnFilters,
        columnVisibility,
        rowSelection,
      },
  });


  useEffect(()=>{
    handleFetchConsommable(`${import.meta.env.VITE_INCIDENT_API}/consommables`);
    handleFetchEquipements(`${import.meta.env.VITE_INCIDENT_API}/equipements`);
    handleFetchCauses(`${import.meta.env.VITE_INCIDENT_API}/incident-causes`);
    handleFetchTypes(`${import.meta.env.VITE_INCIDENT_API}/incident-types`);
    handleFetchMaintenanceTypes(`${import.meta.env.VITE_INCIDENT_API}/maintenance-types`);
    handleFetchSites(`${import.meta.env.VITE_ENTITY_API}/sites`);
    handleFetchShifts(`${import.meta.env.VITE_ENTITY_API}/shifts`);
    handleFetchEmployees(`${import.meta.env.VITE_ENTITY_API}/employees`);
    handleFetchExternalEntities(`${import.meta.env.VITE_ENTITY_API}/suppliers`);
  },[]);

  return (
    <div className="w-full">
      <div className="flex items-center py-4 w-full">
        <Input
          placeholder="Recherche un incidents"
          value={(table.getColumn("status")?.getFilterValue()) ?? ""}
          onChange={(event) =>
            table.getColumn("status")?.setFilterValue(event.target.value)
          }
          className="max-w-sm text-xs py-1"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              <span className='text-xs'>Choisir les colonnes</span> <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border overflow-x-auto w-full">
        <div className='sticky top-0 z-10'>
          <Table className="bg-white">
            <TableHeader className="bg-gray-100 top-0">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} className="w-[100px] text-left">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
          </Table>
        </div>
        <div className='h-[500px] max-h-[30vh] overflow-y-auto flex'>
          <Table className="bg-white">
            <TableBody className="">
              {
                table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="w-[100px] text-left">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : 
                (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )
              }
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
                <DialogHeader>{"Mettre en maintenance"}</DialogHeader>
                {React.cloneElement(<form onSubmit={handleSubmit(submitMaintenance)}>
                  {/* Type maintenance selection */}
                  <div className='flex flex-col'>
                    <label htmlFor="" className='text-xs px-2'>Choisir le type de maintenance*:</label>
                    <AutoComplete
                      placeholder="Choisir le type de maintenance"
                      isLoading={isLoading}
                      dataList={maintenanceTypes}
                      onSearch={handleSearchMaintenanceType}
                      onSelect={handleSelectMaintenanceType}
                      // register={register}
                    />
                    {/* {errors.equipementId && <small className='text-xs my-2 text-red-500'>{errors.equipementId.message}</small>} */}
                  </div>
                  
                  {/* type selection */}
                  <label htmlFor="" className='text-xs px-2'>Choisir le type de maintenance*:</label>
                  <div 
                    className='flex flex-col mx-2'
                    onChange={(e)=>setSupplierType(e.target.value)}
                  >
                    <select name="" id="" className='border rounded-lg p-2' placeholder="Choisir le type d'intervenant">
                      <option value="">Choisir le type de maintenance</option>
                      <option value="EMPLOYEE">Employer</option>
                      <option value="SUPPLIER">Prestataire</option>
                    </select>
                    {/* {errors.equipementId && <small className='text-xs my-2 text-red-500'>{errors.equipementId.message}</small>} */}
                  </div>


                  {/* Supplier selection */}
                  {
                    supplierType === "SUPPLIER" &&
                    <div className='flex flex-col'>
                    <label htmlFor="" className='text-xs px-2'>Choisir le prestataire:</label>
                    <AutoComplete
                      placeholder="Choisir le prestataire"
                      isLoading={isLoading}
                      dataList={externalEntities}
                      onSearch={()=>{}}
                      onSelect={handleSelectSupplier}
                      // register={register}
                    />
                    {/* {errors.equipementId && <small className='text-xs my-2 text-red-500'>{errors.equipementId.message}</small>} */}
                    </div>
                  }

                  {/* Employer selection */}
                  {
                    supplierType === "EMPLOYEE" &&
                    <div className='flex flex-col'>
                      <label htmlFor="" className='text-xs px-2'>Choisir un employer:</label>
                      <AutoComplete
                        placeholder="Choisir un employer"
                        isLoading={isLoading}
                        dataList={employees}
                        onSearch={()=>{}}
                        onSelect={handleSelectSupplier}
                        // register={register}
                      />
                      {/* {errors.equipementId && <small className='text-xs my-2 text-red-500'>{errors.equipementId.message}</small>} */}
                    </div>
                  }

                  {/* Description */}
                  <div className='mx-2 mt-3'>
                    <textarea 
                      name="" 
                      id="" 
                      className='border rounded-lg p-2 w-full' 
                      placeholder='Description'
                      value={description}
                      onChange={(e)=>setDescription(e.target.value)}
                    ></textarea>
                  </div>
                  <Button className="text-white">
                    Mettre en maintenance
                  </Button>
                </form>, { onClose: handleClose })}
                <DialogFooter>{""}</DialogFooter>
            </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default Datalist