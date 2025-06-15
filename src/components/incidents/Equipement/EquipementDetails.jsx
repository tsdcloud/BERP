import React, { useState, useEffect } from 'react';
import { Archive, Minus, Plus } from "lucide-react";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
} from "../../ui/drawer";
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Table } from 'antd';
import MovementDataList from './MovementDataList';
import OperationsDataList from './OperationsDataList';
import MaintenanceDataList from './MaintenanceDataList';

const EquipementDetails = ({open, setOpen, equipements}) => {
  useEffect(()=>{
    console.log(equipements);
  }, [])

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent>
        <div className="mx-12">
          {/* <DrawerHeader>
            <DrawerTitle>Detail de l'équipement</DrawerTitle>
            <DrawerDescription>Obtenir tous les détails de l'équipement sélectionné.</DrawerDescription>
          </DrawerHeader> */}
          <div className='min-h-[80vh] max-h-[80vh] w-full overflow-y-auto overflow-x-hidden'>
            {/* Equipment Details */}
            <div className='h-1/3 w-full space-y-3 sticky top-0 bg-gray-50 p-4 z-30 border rounded-t-xl'>
            
              {/* Equipment name */}
              <div className='flex items-center gap-3'>
                <Archive className='text-4xl'/>
                <h4 className='text-4xl'>{equipements?.title}</h4>
              </div>

              {/* Equipment information */}
              <div className='flex md:items-center gap-3 flex-wrap flex-col md:flex-row text-xs'>
                  <div>
                    <p className='space-x-4'><span>Numéro de ref. : </span>{equipements?.numRef}</p>
                    <p className='space-x-4'><span>Régime : </span>{equipements?.operatingMode}</p>
                    <p className='space-x-4'><span>Mise en service : </span>{new Date(equipements?.createdAt).toLocaleString()}</p>
                    <div className='flex items-center gap-4 mt-2 flex-wrap'>
                      <p className='space-x-4 p-2 rounded-lg bg-orange-300 border border-orange-400'><span>Dernière maintenance : </span>{equipements?.lastMaintenance ? new Date(equipements?.lastMaintenance).toLocaleString() : "Not maintained"}</p>
                      <p className='space-x-4 p-2 rounded-lg bg-orange-300 border border-orange-400'><span>Prochaine maintenance : </span>{new Date(equipements?.nextMaintenance).toLocaleString()}</p>
                    </div>
                  </div>
              </div>

            </div>
            {/* Content */}
            <div className='w-full h-2/3 space-y-4 mt-8 overflow-y-auto'>
              <div>
                <OperationsDataList data={equipements?.operations}/>
              </div>
              <hr />
              <div>
                <MovementDataList data={equipements?.movement}/>
              </div>
              <hr />
              <div>
                <MaintenanceDataList data={equipements?.maintenance}/>
              </div>
            </div>
          </div>

          {/* Footer */}
          <DrawerFooter>
            <div className='flex items-center gap-4 justify-end'>
                <DrawerClose asChild>
                    <button className='px-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-900 transition-all flex items-center gap-2 text-sm' variant="outline">
                        <XMarkIcon className='h-5'/>
                        <span>Fermer</span>
                    </button>
                </DrawerClose>
            </div>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export default EquipementDetails