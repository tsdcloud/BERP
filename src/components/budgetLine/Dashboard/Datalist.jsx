import React, {useEffect, useState, useContext} from 'react';
import { Button } from '../../ui/button';
import { useForm } from 'react-hook-form';
import { INCIDENT_STATUS } from '../../../utils/constant.utils';
import { XMarkIcon, TrashIcon, ExclamationTriangleIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline';
import { Form, Progress, Table } from 'antd';
import { useFetch } from '../../../hooks/useFetch';
import { URLS } from '../../../../configUrl';
import AutoComplete from '../../common/AutoComplete';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { CheckCircle, ChevronDown, MoreHorizontal } from "lucide-react";
import CustomPagination from '../../common/Pagination';
import VerifyPermission from '../../../utils/verifyPermission';
import { PERMISSION_CONTEXT } from '../../../contexts/PermissionsProvider';
import { Cog6ToothIcon } from '@heroicons/react/24/solid';
import Preloader from '../../Preloader';
import { getEmployee } from '../../../utils/entity.utils';




const Datalist = ({dataList, fetchData, searchValue, pagination, loading, currentYear, startMonthFooter, endMonthFooter, dateFooter}) => {

  // const {roles, permissions} = useContext(PERMISSION_CONTEXT);

  let countServices = 0

  const highlightText = (text) => {
    if (!searchValue) return text;

    const regex = new RegExp(searchValue, 'gi');
    return <span dangerouslySetInnerHTML={{ __html: text?.replace(
      new RegExp(searchValue, 'gi'),
      (match) => `<mark style="background-color: yellow;">${match}</mark>`
    )}} />
  };

  const CalcRest = (real, estimated, bcAmount) => {
    let diff = (estimated - real) - bcAmount

    return diff
  };

  const  flattenData = (rawData) => {
    const rows = [];
    let key = 0;
  
    rawData.forEach((serviceObj) => {
      const { serviceName, data } = serviceObj;
      const totalFamilleLignes = data.reduce((acc, f) => acc + f.budgetLineNames.length, 0);
  
      let serviceRowSpan = totalFamilleLignes;
      let serviceFirst = true;

      let familles = data
  
      familles.forEach((familleObj) => {
        const { name: name, budgetLineNames } = familleObj;
  
        let familleRowSpan = budgetLineNames.length;
        let familleFirst = true;
  
        budgetLineNames.forEach((ligneObj) => {
          rows.push({
            key: key++,
            service: serviceFirst ? serviceName : "",
            famille: familleFirst ? name : "",
            ligne: ligneObj.name,
            estimatedAmount: ligneObj.budgetLineOfs[0]?.estimatedAmount ? ligneObj.budgetLineOfs[0]?.estimatedAmount : 0, 
            realAmount: ligneObj.budgetLineOfs[0]?.realAmount ? ligneObj.budgetLineOfs[0]?.realAmount : 0,
            purchaseOrderAmount: ligneObj.budgetLineOfs[0]?.purchaseOrderAmount ? ligneObj.budgetLineOfs[0]?.purchaseOrderAmount : 0,
            serviceRowSpan: serviceFirst ? serviceRowSpan : 0,
            familleRowSpan: familleFirst ? familleRowSpan : 0,
          });
  
          serviceFirst = false;
          familleFirst = false;
        });
      });
    });
  
    // console.log("rows", rows);

    countServices = rows.reduce((count, el) => {
      if (el?.service !== "") {
        return count + 1;
      }
      return count;
    }, 0);
    
  
    return rows;
  }

  
  // Configuration des colonnes pour le tableau principal
  const columns = [
    {
      title: "Service",
      dataIndex: "service",
      // render: (text, row) => ({
      //   children: <span style={{ fontWeight: "bold" }}>{text}</span>,
      //   props: {
      //     rowSpan: row.serviceRowSpan,
      //   },
      // }),
      onCell: (record) => ({
        rowSpan: record.serviceRowSpan,
        // style: {
        //   backgroundColor: "#f0f8ff",
        // },
      }),
      render: (text) => (
        <span style={{ fontWeight: "bold" }}>{text.toUpperCase()}</span>
      ),
    },
    {
      title: "Famille",
      dataIndex: "famille",
      onCell: (record) => ({
        rowSpan: record.familleRowSpan
      }),
      render: (text) => (
        <span style={{ fontWeight: "bold" }}>{text}</span>
      ),
    },
    {
        title: "Ligne Budgétaire",
        dataIndex: "ligne"
    },
    {
        title: "État",
        dataIndex: "status",
        key: "status",
        width: "17%",
        render: (_, record) => (
            <div>
                {/* Barre de progression pour l'estimation */}
                <span style={{ color: "#1890ff" }}>
                    Estimé : {record.estimatedAmount.toLocaleString()}F
                </span>
                <Progress
                    percent={(record.estimatedAmount) * 100}
                    // percent={(record.estimatedAmount / record.realAmount) * 100}
                    status="active"
                    showInfo={false}
                    strokeColor="#1890ff"
                    size="small"
                />

                {/* Barre de progression pour la consommation */}
                {record.realAmount > record.estimatedAmount ? (
                  <div>
                    <span className='text-red-500'>
                        Consommé : {record.realAmount.toLocaleString()}F
                    </span>
                    <Progress
                      percent={(record.realAmount) * 100}
                      status="exception"
                      showInfo={true}
                      strokeColor="#ef4444"
                      size="small"
                      format={(percent) => <div className='text-red-500 mb-1'>+{percent.toFixed(1)}%</div>}
                    />
                  </div>
                ) : (
                  <div>
                    <span className='text-green-500'>
                        Consommé : (Reel + BC)
                    </span>
                    <Progress
                      percent={((record.realAmount + record.purchaseOrderAmount) / record.estimatedAmount) * 100}
                      status="exception"
                      // showInfo={true}
                      strokeColor="#22c55e"
                      size="small"
                      format={(percent) => <div className='text-green-500 mb-1'>{percent.toFixed(1)}%</div>}
                    />
                  </div>
                )}

                <hr className='my-2'/> 

                {
                  <div className=''>
                    <div className=''>
                      Consommation Réel : {record.realAmount.toLocaleString()}F
                    </div>
                    <div className=''>
                      Consommation par BC : {record.purchaseOrderAmount.toLocaleString()}F
                    </div>
                </div>
                }

                <hr className='my-2'/>

                {<div className='font-bold'>
                  <span className={`${CalcRest(record.realAmount, record.estimatedAmount, record.purchaseOrderAmount) >= 0 ? '' : 'text-red-500'}`}>
                      Reste : {CalcRest(record.realAmount, record.estimatedAmount, record.purchaseOrderAmount).toLocaleString()}F
                  </span>
                </div>}
                {/* <Progress
                    percent={(record.realAmount / record.estimatedAmount) * 100}
                    status="exception"
                    showInfo={false}
                    strokeColor="#22c55e"
                    size="small"
                /> */}
            </div>
        )
      }
    ];

  const transformedData = flattenData(dataList);

  console.log("transformedData", transformedData)

  const { totalEstimatedAmount, totalRealAmount, purchaseOrderAmount } = transformedData.reduce(
    (totals, item) => {
        totals.totalEstimatedAmount += item.estimatedAmount;
        totals.totalRealAmount += item.realAmount;
        totals.purchaseOrderAmount += item.purchaseOrderAmount
        return totals;
    },
    { totalEstimatedAmount: 0, totalRealAmount: 0, purchaseOrderAmount: 0}
  );

  
  return (
    <div className="w-full">
      {/* <div className="py-2 px-4 w-full max-h-[50vh] h-[50vh]"> */}
      <div className="">
        <Form>
          <Table 
            footer={() => 
              <div className='flex w-full justify-between'>
                <div>
                  {countServices === 1 && <span>Service : <span className='font-bold'>{transformedData[0]?.service}</span> | </span>}
                  <span>Année : <span className='font-bold'>{dateFooter ? dateFooter : currentYear}</span> | </span>
                  {(startMonthFooter && endMonthFooter ) && <span>Intervale : <span className='font-bold'>{startMonthFooter} {"-"} {endMonthFooter} </span> | </span>}
                  <span>Total Estimé : <span className='font-bold'>{totalEstimatedAmount.toLocaleString()}F</span> | </span>
                  <span>Total Réel : <span className='font-bold'>{totalRealAmount.toLocaleString()}F</span> | </span>
                  <span>Total BC : <span className='font-bold'>{purchaseOrderAmount.toLocaleString()}F</span></span>
                </div>
                <div>
                  Total : <span className='font-bold'>{countServices} service(s)</span>
                </div>
              </div>
            }
            dataSource={transformedData}
            columns={columns}
            bordered
            scroll={{
                x: 500,
                y: "45vh"
            }}
            pagination={false}
            loading={loading}
            rowKey="key"
            size="small"
          />
        </Form>
      </div>
    </div>
  )
}

export default Datalist

