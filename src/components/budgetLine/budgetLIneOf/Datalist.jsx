import React, {useEffect, useState, useContext} from 'react';
import { Table, Form, Button, Input, Dropdown, Menu, message } from "antd";
import { useFetch } from '../../../hooks/useFetch';
import { URLS } from '../../../../configUrl';




const Datalist = ({dataList, fetchData, searchValue, pagination, loading}) => {

  // const {roles, permissions} = useContext(PERMISSION_CONTEXT);

  const highlightText = (text) => {

   if (!searchValue) return text;

    const regex = new RegExp(searchValue, 'gi');
    return <span dangerouslySetInnerHTML={{ __html: text?.replace(
      new RegExp(searchValue, 'gi'),
      (match) => `<mark style="background-color: yellow;">${match}</mark>`
    )}} />
  };

  const monthOrder = [
    "JANVIER", "FEVRIER", "MARS", "AVRIL", "MAI", "JUIN",
    "JUILLET", "AOUT", "SEPTEMBRE", "OCTOBRE", "NOVEMBRE", "DECEMBRE"
  ];

  const totals = {};

  const totalPerYear = (data) => {
    // const totals = {};
    data.forEach((record) => {
      record.breakdowns?.forEach((monthData) => {
        const month = monthData.month;
        if (!totals[month]) {
          totals[month] = { realAmount: 0, estimatedAmount: 0 , purchaseOrderAmount: 0};
        }
        if(monthData.realAmount !== null) totals[month].realAmount += parseInt(monthData.realAmount, 10);
        if(monthData.estimatedAmount !== null) totals[month].estimatedAmount += parseInt(monthData.estimatedAmount, 10);
        if(monthData.purchaseOrderAmount !== null) totals[month].purchaseOrderAmount += parseInt(monthData.purchaseOrderAmount, 10);
      });
    });

    console.log("totals", totals);
    
    return totals;
  }

  let idPermoth = ""
  

  const sortByMonth = (data, month, estimation) => {

    if (!Array.isArray(data)) return "0";

    let sortedData = data?.sort((a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month));

    // Filtrer les données valides avec un mois reconnu
    // const filteredData = data.filter(item => monthOrder.includes(item?.month));

    // console.log("sortedData", sortedData);

    // Trouver la donnée correspondant au mois donné
    const target = sortedData.find(item => item?.month === month);

    if (!target) return "0";

    return highlightText(estimation ? target.estimatedAmount : target.realAmount);
  }

  const sortByMonthPurchaseOrderAmount = (data, month) => {
    if (!Array.isArray(data)) return "0";

    let sortedData = data?.sort((a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month));

    // Trouver la donnée correspondant au mois donné
    const target = sortedData.find(item => item?.month === month);

    if (!target) return "0";

    return highlightText(target.purchaseOrderAmount);
  }

  const getRestByMont = (data, month) => {

    if (!Array.isArray(data)) return "0";

    let sortedData = data?.sort((a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month));

    // Trouver la donnée correspondant au mois donné
    const target = sortedData.find(item => item?.month === month);

    // console.log("target", target);
    
    // let rest = ((target?.estimatedAmount === null ? 0 : target?.estimatedAmount - target?.realAmount === null ? 0 : target?.realAmount) - target?.purchaseOrderAmount === null ? 0 : target?.purchaseOrderAmount)
    let rest = (((target?.estimatedAmount === null ? 0 : target?.estimatedAmount) - (target?.realAmount === null ? 0 : target?.realAmount)) - (target?.purchaseOrderAmount === null ? 0 : target?.purchaseOrderAmount))

    if (!target) return "0";

    return rest;
  }

  const getRestPayBcByMont = (data, month) => {

    if (!Array.isArray(data)) return "0";

    let sortedData = data?.sort((a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month));

    // Trouver la donnée correspondant au mois donné
    const target = sortedData.find(item => item?.month === month);

    // console.log("target", target);
    
    let rest = target?.purchaseOrderAmount

    console.log("rest", rest);

    if (!target) return "0";

    if (rest){
      return Number(rest).toLocaleString()
    } else {
      return "0"
    }

  }


  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);

  const { handlePatch, handlePost, handleFetch } = useFetch()

  const handleDelete = async (id) =>{
    if (window.confirm("Voulez vous supprimer la Ligne ?")) {
      try {
        let url = `${URLS.API_BUDGETLINE}/budget-line-ofs/delete/${id}`;
        let response = await fetch(url, {
          method:"PATCH",
          headers:{
            "Content-Type":"application/json",
            'authorization': `Bearer ${localStorage.getItem('token')}` || ''
          }
        });
        if(response.status === 204){
          alert("Deleted successfully");
          fetchData();
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  const sharedOnCell = (_, index) => {
    if (index === 1) {
      return { colSpan: 0 };
    }
    return {};
  };

  totalPerYear(dataList)

  const months = [
    {month: "JANVIER"},
    {month: "FEVRIER"},
    {month: "MARS"},
    {month: "AVRIL"},
    {month: "MAI"},
    {month: "JUIN"},
    {month: "JUILLET"},
    {month: "AOUT"},
    {month: "SEPTEMBRE"},
    {month: "OCTOBRE"},
    {month: "NOVEMBRE"},
    {month: "DECEMBRE"}
  ];

  const [month, setMonth] = useState(null);

  const [dropdownOpenKey, setDropdownOpenKey] = useState(null);
  const [dropdownOpenDcConso, setDropdownOpenDcConso] = useState(null);
  const [dropdownOpenDcPay, setDropdownOpenDcPay] = useState(null);

  const [inputValue, setInputValue] = useState("");
  const [inputValueConsoBc, setInputValueConsoBc] = useState("");
  const [inputValuePayBc, setInputValuePayBc] = useState("");

  const handleButtonClick = (id, month) => {
    setMonth(month)
    setDropdownOpenKey(id);
    setInputValue("");
    // console.log("record.id", id);
  };

  const handleButtonClickPayBc = (id, month) => {
    setMonth(month)
    setDropdownOpenDcPay(id);
    setInputValuePayBc("");
    // console.log("record.id", id);
  };

  const handleButtonClickConsoBc = (id, month) => {
    setMonth(month)
    setDropdownOpenDcConso(id);
    setInputValueConsoBc("");
    // console.log("record.id", id);
  };

  const handleCancel = () => {
    setDropdownOpenKey(null)
  };

  const handleCancelConsoDc = () => {
    setDropdownOpenDcConso(null)
  };

  const handleCancelPayDc = () => {
    setDropdownOpenDcPay(null)
  };

  const handleOk = async (id, month) => {
    let urlBudgetLineOfs = URLS.API_BUDGETLINE + `/budget-line-ofs/${id}`

    const parsedValue = parseInt(inputValue, 10);

    if(!Number.isInteger(parsedValue)){
      message.warning(`Veuillez entrer un nombre !`);
      return
    }

    if(!parsedValue || parsedValue <= 0) {
      message.warning(`Veuillez entrer un correct montant !`);
      // setDropdownOpenKey(null);
      return
    }

    const oldValue = await handleFetch(urlBudgetLineOfs)

    // console.log("value to change", oldValue?.breakdowns);

    const currentMonthAmount = oldValue?.breakdowns.filter((item => item.month === month))
    
    if (currentMonthAmount.length !== 0){

      let urlBreakdownBudgetLineOfs = URLS.API_BUDGETLINE + `/breakdown-budget-lineOfs/${currentMonthAmount[0].id}`

      let realAmount = parseInt(currentMonthAmount[0].realAmount, 10)
      let purchaseOrderAmount = parseInt(currentMonthAmount[0].purchaseOrderAmount, 10)
      let estimatedAmount = parseInt(currentMonthAmount[0].estimatedAmount, 10)

      if (!purchaseOrderAmount) {
        purchaseOrderAmount = 0
      }

      if (!realAmount) {
        realAmount = 0
      }

      if (!estimatedAmount) {
        estimatedAmount = 0
      }

      let rest = ((estimatedAmount - realAmount) - purchaseOrderAmount)

      console.log("rest to sonsume", rest)
      
      if (parsedValue > rest) return message.error(`l'argent a consommer ne peux pas etre superieur au montant restant.`);

      let newRealAmount = realAmount + parsedValue

      let data = {
        realAmount: newRealAmount
      }

      const response = await handlePatch(urlBreakdownBudgetLineOfs, data)

      if (response.success){
        setDropdownOpenKey(null);
        message.success(`Mois: ${currentMonthAmount[0].month}, Nouvelle consommation: ${parsedValue} F.`);

        fetchData();
      }

      if (!response.success){
        message.error(`La date de consommation de cette ligne n'est pas encore arrivée !`);
        setDropdownOpenKey(null);
      }
      
    } else {
      message.warning(`ce mois n'a pas de budget prévu pour cette ligne`);
      setDropdownOpenKey(null);
    }




    
    // if (isNaN(parsedValue) || parsedValue <= 0) {
    //   message.error("Veuillez entrer un montant valide.");
    //   return;
    // }

    // Mettre à jour le montant dans les données
    // setData((prevData) =>
    //   prevData.map((item) =>
    //     item.key === key ? { ...item, amount: item.amount - parsedValue } : item
    //   )
    // );

    // Fermer le dropdown
    // setDropdownOpenKey(null);
    // message.success(`Montant diminué de ${parsedValue} F.`);
  };

  const handleOkConsoBc = async (id, month) => {
    let urlBudgetLineOfs = URLS.API_BUDGETLINE + `/budget-line-ofs/${id}`

    const parsedValue = parseInt(inputValueConsoBc, 10);

    if(!Number.isInteger(parsedValue)){
      message.warning(`Veuillez entrer un nombre !`);
      return
    }

    if(!parsedValue || parsedValue <= 0) {
      message.warning(`Veuillez entrer un correct montant !`);
      // setDropdownOpenKey(null);
      return
    }

    const oldValue = await handleFetch(urlBudgetLineOfs)

    // console.log("value to change", oldValue?.breakdowns);

    const currentMonthAmount = oldValue?.breakdowns.filter((item => item.month === month))

    // console.log("currentMonthAmount", currentMonthAmount);
    
    if (currentMonthAmount.length !== 0){

      let urlBreakdownBudgetLineOfs = URLS.API_BUDGETLINE + `/breakdown-budget-lineOfs/${currentMonthAmount[0].id}`

      let purchaseOrderAmount = parseInt(currentMonthAmount[0].purchaseOrderAmount, 10)
      let realAmount = parseInt(currentMonthAmount[0].realAmount, 10)
      let estimatedAmount = parseInt(currentMonthAmount[0].estimatedAmount, 10)

      if (!purchaseOrderAmount) {
        purchaseOrderAmount = 0
      }

      if (!realAmount) {
        realAmount = 0
      }

      if (!estimatedAmount) {
        estimatedAmount = 0
      }

      let rest = ((estimatedAmount - realAmount) - purchaseOrderAmount)

      console.log("rest to sonsume", rest)

      let newPurchaseOrderAmount = purchaseOrderAmount + parsedValue
      

      if (parsedValue > rest) return message.error(`l'argent pour le bon de commande ne peux pas etre superieur au montant restant.`);

      let data = {
        purchaseOrderAmount: newPurchaseOrderAmount
      }

      const response = await handlePatch(urlBreakdownBudgetLineOfs, data)

      if (response.success){
        setDropdownOpenDcConso(null);
        message.success(`Mois: ${currentMonthAmount[0].month}, Nouvelle consommation par Bon de commande : ${parsedValue} F.`);

        fetchData();
      }

      if (!response.success){
        message.error(`La date de consommation de cette ligne n'est pas encore arrivée !`);
        setDropdownOpenDcConso(null);
      }
      
    } else {
      message.warning(`ce mois n'a pas de budget prévu pour cette ligne`);
      setDropdownOpenDcConso(null);
    }
  };

  const handleOkPayBc = async (id, month) => {
    let urlBudgetLineOfs = URLS.API_BUDGETLINE + `/budget-line-ofs/${id}`

    const parsedValue = parseInt(inputValuePayBc, 10);

    if(!Number.isInteger(parsedValue)){
      message.warning(`Veuillez entrer un nombre !`);
      return
    }

    if(!parsedValue || parsedValue <= 0) {
      message.warning(`Veuillez entrer un correct montant !`);
      // setDropdownOpenKey(null);
      return
    }

    const oldValue = await handleFetch(urlBudgetLineOfs)

    // console.log("value to change", oldValue?.breakdowns);

    const currentMonthAmount = oldValue?.breakdowns.filter((item => item.month === month))

    // console.log("currentMonthAmount", currentMonthAmount);
    
    if (currentMonthAmount.length !== 0){

      let urlBreakdownBudgetLineOfs = URLS.API_BUDGETLINE + `/breakdown-budget-lineOfs/${currentMonthAmount[0].id}`

      let purchaseOrderAmount = parseInt(currentMonthAmount[0].purchaseOrderAmount, 10)

      if (!purchaseOrderAmount) {
        purchaseOrderAmount = 0
      }
      
      if (parsedValue > purchaseOrderAmount) return message.error(`l'argent du bon de commande a payer est superieur a celui prévu.`);

      let confirm = window.confirm("Voulez-vous vraiment proceder au paiement de ce Bon de commande ?")

      if(!confirm) return console.log("paiement annulé");

      let data = {
        amount: parsedValue
      }

      const response = await handlePatch(urlBreakdownBudgetLineOfs, data)

      if (response.success){
        setDropdownOpenDcPay(null);
        message.success(`Mois: ${currentMonthAmount[0].month}, Paiement du Bon de commande validé, montant : ${parsedValue} F.`);

        fetchData();
      }

      if (!response.success){
        message.error(`La date de consommation de cette ligne n'est pas encore arrivée !`);
        setDropdownOpenDcPay(null);
      }
      
    } else {
      message.warning(`ce mois n'a pas de budget prévu pour cette ligne`);
      setDropdownOpenDcPay(null);
    }
  };



  const columns=[
    {
      title:"No ref",
      dataIndex:"numRef",
      width:"100px",
      render:(value, record) => <p className='text-sm'>{highlightText(value)}</p>
    },
    {
      title:"Libellé Ligne Budgetaire",
      dataIndex:"budgetLineName",
      width:"200px",
      render:(value)=><p className='text-sm'>{highlightText(value.name)}</p>
    },
    {
      title:"JANVIER",
      dataIndex:"breakdowns",
      width:"200px",
      children: [
        {
          title: 'montant estimé',
          dataIndex: 'breakdowns',
          key: 'estimatedAmount',
          width: 150,
          render:(value)=><p className='text-sm'>{sortByMonth(value, "JANVIER", true)  || "0"}</p>
        },
        {
          title: 'montant réel',
          dataIndex: 'breakdowns',
          key: 'realAmount',
          width: 250,
          // render:(value)=><p className='text-sm'>{sortByMonth(value, "JANVIER") || "0"}</p>
          render: (value, record) => (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {/* Affichage du montant */}
              <strong style={{ width: "200px" }}>{sortByMonth(value, "JANVIER") || "0"}</strong>
    
              {/* Bouton pour ouvrir le dropdown */}
              <Button className='bg-yellow-200' onClick={() => handleButtonClick(record.id , "JANVIER")}>Consommer</Button>
    
              {/* Dropdown */}
              {(dropdownOpenKey === record.id && month === "JANVIER") && (
                <Dropdown
                  // overlay={
                  //   <Menu>
                  //     <Menu.Item>
                  //       <Input
                  //         placeholder="Entrez le montant à consommer"
                  //         value={inputValue}
                  //         onChange={(e) => setInputValue(e.target.value)}
                  //         style={{ marginBottom: 8 }}
                  //       />
                  //       <div className='bg-gray-300 rounded p-1'>
                  //         <span>Reste: {getRestByMont(value, "JANVIER").toLocaleString()}F</span>
                  //       </div>
                  //     </Menu.Item>
                  //     <Menu.Item>
                  //       <Button
                  //         type="primary"
                  //         onClick={() => handleOk(record.id, "JANVIER")}
                  //         style={{ marginRight: 8 }}
                  //       >
                  //         OK
                  //       </Button>
                  //       <Button onClick={handleCancel}>Annuler</Button>
                  //     </Menu.Item>
                  //   </Menu>
                  // }
                  menu={{
                    items: [
                      {
                        key: "input",
                        label: (
                          <div>
                            <Input
                              placeholder="Entrez le montant à consommer"
                              value={inputValue}
                              onChange={(e) => setInputValue(e.target.value)}
                              style={{ marginBottom: 8 }}
                            />
                            <div className="bg-gray-300 rounded p-1">
                              <span>
                                Reste: {getRestByMont(value, "JANVIER").toLocaleString()} F
                              </span>
                            </div>
                          </div>
                        ),
                      },
                      {
                        key: "actions",
                        label: (
                          <div>
                            <Button
                              type="primary"
                              onClick={() => handleOk(record.id, "JANVIER")}
                              style={{ marginRight: 8 }}
                            >
                              OK
                            </Button>
                            <Button onClick={handleCancel}>Annuler</Button>
                          </div>
                        ),
                      },
                    ]
                  }}
                  open={true}
                  trigger={[]} // Désactiver les triggers par défaut (click, hover, etc.)
                >
                  {/* Ce span est utilisé pour déclencher le dropdown */}
                  <span></span>
                </Dropdown>
              )}
            </div>
          ),    
        },
        {
          title: 'montant BC',
          dataIndex: 'breakdowns',
          key: 'purchaseOrderAmount',
          width: 320,
          // render:(value)=><p className='text-sm'>{sortByMonth(value, "JANVIER") || "0"}</p>
          render: (value, record) => (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {/* Affichage du montant */}
              <strong style={{ width: "200px" }}>{sortByMonthPurchaseOrderAmount(value, "JANVIER") || "0"}</strong>
    
              {/* Bouton pour ouvrir le dropdown */}
              <Button className='bg-yellow-200' onClick={() => handleButtonClickConsoBc(record.id , "JANVIER")}>Consommer</Button>
              <Button className='bg-blue-500 text-white' onClick={() => handleButtonClickPayBc(record.id , "JANVIER")}>Payer</Button>
    
              {/* Dropdown */}
              {(dropdownOpenDcConso === record.id && month === "JANVIER") && (
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: "input",
                        label: (
                          <div>
                            <Input
                              placeholder="Entrez le montant à consommer"
                              value={inputValueConsoBc}
                              onChange={(e) => setInputValueConsoBc(e.target.value)}
                              style={{ marginBottom: 8 }}
                            />
                            <div className='bg-gray-300 rounded p-1'>
                              <span>Reste: {getRestByMont(value, "JANVIER").toLocaleString()}F</span>
                            </div>
                          </div>
                        ),
                      },
                      {
                        key: "actions",
                        label: (
                          <div>
                            <Button
                              type="primary"
                              onClick={() => handleOkConsoBc(record.id, "JANVIER")}
                              style={{ marginRight: 8 }}
                            >
                              OK
                            </Button>
                            <Button onClick={handleCancelConsoDc}>Annuler</Button>
                          </div>
                        ),
                      },
                    ]
                  }}

                  open={true}
                  trigger={[]} // Désactiver les triggers par défaut (click, hover, etc.)
                >
                  {/* Ce span est utilisé pour déclencher le dropdown */}
                  <span></span>
                </Dropdown>
              )}
              {(dropdownOpenDcPay === record.id && month === "JANVIER") && (
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: "input",
                        label: (
                          <div>
                            <Input
                                placeholder="Entrez le montant à payer"
                                value={inputValuePayBc}
                                onChange={(e) => setInputValuePayBc(e.target.value)}
                                style={{ marginBottom: 8 }}
                              />
                              <div className='bg-gray-300 rounded p-1'>
                                <span>BC disponible: {getRestPayBcByMont(value, "JANVIER")}F</span>
                              </div>
                          </div>
                        ),
                      },
                      {
                        key: "actions",
                        label: (
                          <div>
                            <Button
                              type="primary"
                              onClick={() => handleOkPayBc(record.id, "JANVIER")}
                              style={{ marginRight: 8 }}
                            >
                              OK
                            </Button>
                            <Button onClick={handleCancelPayDc}>Annuler</Button>
                          </div>
                        ),
                      },
                    ]
                  }}
                  open={true}
                  trigger={[]} // Désactiver les triggers par défaut (click, hover, etc.)
                >
                  {/* Ce span est utilisé pour déclencher le dropdown */}
                  <span></span>
                </Dropdown>
              )}
            </div>
          ),    
        }
      ],
      // render:(value)=><p className='text-sm'>{sortByMonth(value, "JANVIER") || "--"}</p>
    },
    {
      title:"FEVRIER",
      dataIndex:"breakdowns",
      width:"200px",
      children: [
        {
          title: 'montant estimé',
          dataIndex: 'breakdowns',
          key: 'estimatedAmount',
          width: 150,
          render:(value)=><p className='text-sm'>{sortByMonth(value, "FEVRIER", true) || "0"}</p>
        },
        {
          title: 'montant réel',
          dataIndex: 'breakdowns',
          key: 'realAmount',
          width: 250,
          // render:(value)=><p className='text-sm'>{sortByMonth(value, "FEVRIER") || "0"}</p>
          render: (value, record) => (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {/* Affichage du montant */}
              <strong style={{ width: "200px" }}>{sortByMonth(value, "FEVRIER") || "0"}</strong>
    
              {/* Bouton pour ouvrir le dropdown */}
              <Button className='bg-yellow-200' onClick={() => handleButtonClick(record.id , "FEVRIER")}>Consommer</Button>
    
              {/* Dropdown */}
              {(dropdownOpenKey === record.id && month === "FEVRIER") && (
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: "input",
                        label: (
                          <div>
                            <Input
                              placeholder="Entrez le montant à consommer"
                              value={inputValue}
                              onChange={(e) => setInputValue(e.target.value)}
                              style={{ marginBottom: 8 }}
                            />
                            <div className="bg-gray-300 rounded p-1">
                              <span>
                                Reste: {getRestByMont(value, "FEVRIER").toLocaleString()} F
                              </span>
                            </div>
                          </div>
                        ),
                      },
                      {
                        key: "actions",
                        label: (
                          <div>
                            <Button
                              type="primary"
                              onClick={() => handleOk(record.id, "FEVRIER")}
                              style={{ marginRight: 8 }}
                            >
                              OK
                            </Button>
                            <Button onClick={handleCancel}>Annuler</Button>
                          </div>
                        ),
                      },
                    ]
                  }}
                  open={true}
                  trigger={[]} // Désactiver les triggers par défaut (click, hover, etc.)
                >
                  {/* Ce span est utilisé pour déclencher le dropdown */}
                  <span></span>
                </Dropdown>
              )}
            </div>
          ),
        },
        {
          title: 'montant BC',
          dataIndex: 'breakdowns',
          key: 'purchaseOrderAmount',
          width: 320,
          // render:(value)=><p className='text-sm'>{sortByMonth(value, "JANVIER") || "0"}</p>
          render: (value, record) => (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {/* Affichage du montant */}
              <strong style={{ width: "200px" }}>{sortByMonthPurchaseOrderAmount(value, "FEVRIER") || "0"}</strong>
    
              {/* Bouton pour ouvrir le dropdown */}
              <Button className='bg-yellow-200' onClick={() => handleButtonClickConsoBc(record.id , "FEVRIER")}>Consommer</Button>
              <Button className='bg-blue-500 text-white' onClick={() => handleButtonClickPayBc(record.id , "FEVRIER")}>Payer</Button>
    
              {/* Dropdown */}
              {(dropdownOpenDcConso === record.id && month === "FEVRIER") && (
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: "input",
                        label: (
                          <div>
                            <Input
                              placeholder="Entrez le montant à consommer"
                              value={inputValueConsoBc}
                              onChange={(e) => setInputValueConsoBc(e.target.value)}
                              style={{ marginBottom: 8 }}
                            />
                            <div className='bg-gray-300 rounded p-1'>
                              <span>Reste: {getRestByMont(value, "FEVRIER").toLocaleString()}F</span>
                            </div>
                          </div>
                        ),
                      },
                      {
                        key: "actions",
                        label: (
                          <div>
                            <Button
                              type="primary"
                              onClick={() => handleOkConsoBc(record.id, "FEVRIER")}
                              style={{ marginRight: 8 }}
                            >
                              OK
                            </Button>
                            <Button onClick={handleCancelConsoDc}>Annuler</Button>
                          </div>
                        ),
                      },
                    ]
                  }}
                  
                  open={true}
                  trigger={[]} // Désactiver les triggers par défaut (click, hover, etc.)
                >
                  {/* Ce span est utilisé pour déclencher le dropdown */}
                  <span></span>
                </Dropdown>
              )}
              {(dropdownOpenDcPay === record.id && month === "FEVRIER") && (
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: "input",
                        label: (
                          <div>
                            <Input
                                placeholder="Entrez le montant à payer"
                                value={inputValuePayBc}
                                onChange={(e) => setInputValuePayBc(e.target.value)}
                                style={{ marginBottom: 8 }}
                              />
                              <div className='bg-gray-300 rounded p-1'>
                                <span>BC disponible: {getRestPayBcByMont(value, "FEVRIER")}F</span>
                              </div>
                          </div>
                        ),
                      },
                      {
                        key: "actions",
                        label: (
                          <div>
                            <Button
                              type="primary"
                              onClick={() => handleOkPayBc(record.id, "FEVRIER")}
                              style={{ marginRight: 8 }}
                            >
                              OK
                            </Button>
                            <Button onClick={handleCancelPayDc}>Annuler</Button>
                          </div>
                        ),
                      },
                    ]
                  }}
                  open={true}
                  trigger={[]} // Désactiver les triggers par défaut (click, hover, etc.)
                >
                  {/* Ce span est utilisé pour déclencher le dropdown */}
                  <span></span>
                </Dropdown>
              )}
            </div>
          ),    
        }
      ],
      // render:(value)=><p className='text-sm'>{sortByMonth(value, "FEVRIER") || "--"}</p>
    },
    {
      title:"MARS",
      dataIndex:"breakdowns",
      width:"200px",
      children: [
        {
          title: 'montant estimé',
          dataIndex: 'breakdowns',
          key: 'estimatedAmount',
          width: 150,
          render:(value)=><p className='text-sm'>{sortByMonth(value, "MARS", true) || "0"}</p>
        },
        {
          title: 'montant réel',
          dataIndex: 'breakdowns',
          key: 'realAmount',
          width: 250,
          // render:(value)=><p className='text-sm'>{sortByMonth(value, "MARS") || "0"}</p>
          render: (value, record) => (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {/* Affichage du montant */}
              <strong style={{ width: "200px" }}>{sortByMonth(value, "MARS") || "0"}</strong>
    
              {/* Bouton pour ouvrir le dropdown */}
              <Button className='bg-yellow-200' onClick={() => handleButtonClick(record.id , "MARS")}>Consommer</Button>
    
              {/* Dropdown */}
              {(dropdownOpenKey === record.id && month === "MARS") && (
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: "input",
                        label: (
                          <div>
                            <Input
                              placeholder="Entrez le montant à consommer"
                              value={inputValue}
                              onChange={(e) => setInputValue(e.target.value)}
                              style={{ marginBottom: 8 }}
                            />
                            <div className="bg-gray-300 rounded p-1">
                              <span>
                                Reste: {getRestByMont(value, "MARS").toLocaleString()} F
                              </span>
                            </div>
                          </div>
                        ),
                      },
                      {
                        key: "actions",
                        label: (
                          <div>
                            <Button
                              type="primary"
                              onClick={() => handleOk(record.id, "MARS")}
                              style={{ marginRight: 8 }}
                            >
                              OK
                            </Button>
                            <Button onClick={handleCancel}>Annuler</Button>
                          </div>
                        ),
                      },
                    ]
                  }}
                  open={true}
                  trigger={[]} // Désactiver les triggers par défaut (click, hover, etc.)
                >
                  {/* Ce span est utilisé pour déclencher le dropdown */}
                  <span></span>
                </Dropdown>
              )}
            </div>
          ),
        },
        {
          title: 'montant BC',
          dataIndex: 'breakdowns',
          key: 'purchaseOrderAmount',
          width: 320,
          // render:(value)=><p className='text-sm'>{sortByMonth(value, "MARS") || "0"}</p>
          render: (value, record) => (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {/* Affichage du montant */}
              <strong style={{ width: "200px" }}>{sortByMonthPurchaseOrderAmount(value, "MARS") || "0"}</strong>
    
              {/* Bouton pour ouvrir le dropdown */}
              <Button className='bg-yellow-200' onClick={() => handleButtonClickConsoBc(record.id , "MARS")}>Consommer</Button>
              <Button className='bg-blue-500 text-white' onClick={() => handleButtonClickPayBc(record.id , "MARS")}>Payer</Button>
    
              {/* Dropdown */}
              {(dropdownOpenDcConso === record.id && month === "MARS") && (
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: "input",
                        label: (
                          <div>
                            <Input
                              placeholder="Entrez le montant à consommer"
                              value={inputValueConsoBc}
                              onChange={(e) => setInputValueConsoBc(e.target.value)}
                              style={{ marginBottom: 8 }}
                            />
                            <div className='bg-gray-300 rounded p-1'>
                              <span>Reste: {getRestByMont(value, "MARS").toLocaleString()}F</span>
                            </div>
                          </div>
                        ),
                      },
                      {
                        key: "actions",
                        label: (
                          <div>
                            <Button
                              type="primary"
                              onClick={() => handleOkConsoBc(record.id, "MARS")}
                              style={{ marginRight: 8 }}
                            >
                              OK
                            </Button>
                            <Button onClick={handleCancelConsoDc}>Annuler</Button>
                          </div>
                        ),
                      },
                    ]
                  }}
                  open={true}
                  trigger={[]} // Désactiver les triggers par défaut (click, hover, etc.)
                >
                  {/* Ce span est utilisé pour déclencher le dropdown */}
                  <span></span>
                </Dropdown>
              )}
              {(dropdownOpenDcPay === record.id && month === "MARS") && (
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: "input",
                        label: (
                          <div>
                            <Input
                                placeholder="Entrez le montant à payer"
                                value={inputValuePayBc}
                                onChange={(e) => setInputValuePayBc(e.target.value)}
                                style={{ marginBottom: 8 }}
                              />
                              <div className='bg-gray-300 rounded p-1'>
                                <span>BC disponible: {getRestPayBcByMont(value, "MARS")}F</span>
                              </div>
                          </div>
                        ),
                      },
                      {
                        key: "actions",
                        label: (
                          <div>
                            <Button
                              type="primary"
                              onClick={() => handleOkPayBc(record.id, "MARS")}
                              style={{ marginRight: 8 }}
                            >
                              OK
                            </Button>
                            <Button onClick={handleCancelPayDc}>Annuler</Button>
                          </div>
                        ),
                      },
                    ]
                  }}
                  open={true}
                  trigger={[]} // Désactiver les triggers par défaut (click, hover, etc.)
                >
                  {/* Ce span est utilisé pour déclencher le dropdown */}
                  <span></span>
                </Dropdown>
              )}
            </div>
          ),    
        }
      ],
      // render:(value)=><p className='text-sm'>{sortByMonth(value, "MARS") || "--"}</p>
    },
    {
      title:"AVRIL",
      dataIndex:"breakdowns",
      width:"200px",
      children: [
        {
          title: 'montant estimé',
          dataIndex: 'breakdowns',
          key: 'estimatedAmount',
          width: 150,
          render:(value)=><p className='text-sm'>{sortByMonth(value, "AVRIL", true) || "0"}</p>
        },
        {
          title: 'montant réel',
          dataIndex: 'breakdowns',
          key: 'realAmount',
          width: 250,
          // render:(value)=><p className='text-sm'>{sortByMonth(value, "AVRIL") || "0"}</p>
          render: (value, record) => (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {/* Affichage du montant */}
              <strong style={{ width: "200px" }}>{sortByMonth(value, "AVRIL") || "0"}</strong>
    
              {/* Bouton pour ouvrir le dropdown */}
              <Button className='bg-yellow-200' onClick={() => handleButtonClick(record.id , "AVRIL")}>Consommer</Button>
    
              {/* Dropdown */}
              {(dropdownOpenKey === record.id && month === "AVRIL") && (
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: "input",
                        label: (
                          <div>
                            <Input
                              placeholder="Entrez le montant à consommer"
                              value={inputValue}
                              onChange={(e) => setInputValue(e.target.value)}
                              style={{ marginBottom: 8 }}
                            />
                            <div className="bg-gray-300 rounded p-1">
                              <span>
                                Reste: {getRestByMont(value, "AVRIL").toLocaleString()} F
                              </span>
                            </div>
                          </div>
                        ),
                      },
                      {
                        key: "actions",
                        label: (
                          <div>
                            <Button
                              type="primary"
                              onClick={() => handleOk(record.id, "AVRIL")}
                              style={{ marginRight: 8 }}
                            >
                              OK
                            </Button>
                            <Button onClick={handleCancel}>Annuler</Button>
                          </div>
                        ),
                      },
                    ]
                  }}
                  open={true}
                  trigger={[]} // Désactiver les triggers par défaut (click, hover, etc.)
                >
                  {/* Ce span est utilisé pour déclencher le dropdown */}
                  <span></span>
                </Dropdown>
              )}
            </div>
          ),
        },
        {
          title: 'montant BC',
          dataIndex: 'breakdowns',
          key: 'purchaseOrderAmount',
          width: 320,
          // render:(value)=><p className='text-sm'>{sortByMonth(value, "AVRIL") || "0"}</p>
          render: (value, record) => (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {/* Affichage du montant */}
              <strong style={{ width: "200px" }}>{sortByMonthPurchaseOrderAmount(value, "AVRIL") || "0"}</strong>
    
              {/* Bouton pour ouvrir le dropdown */}
              <Button className='bg-yellow-200' onClick={() => handleButtonClickConsoBc(record.id , "AVRIL")}>Consommer</Button>
              <Button className='bg-blue-500 text-white' onClick={() => handleButtonClickPayBc(record.id , "AVRIL")}>Payer</Button>
    
              {/* Dropdown */}
              {(dropdownOpenDcConso === record.id && month === "AVRIL") && (
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: "input",
                        label: (
                          <div>
                            <Input
                              placeholder="Entrez le montant à consommer"
                              value={inputValueConsoBc}
                              onChange={(e) => setInputValueConsoBc(e.target.value)}
                              style={{ marginBottom: 8 }}
                            />
                            <div className='bg-gray-300 rounded p-1'>
                              <span>Reste: {getRestByMont(value, "AVRIL").toLocaleString()}F</span>
                            </div>
                          </div>
                        ),
                      },
                      {
                        key: "actions",
                        label: (
                          <div>
                            <Button
                              type="primary"
                              onClick={() => handleOkConsoBc(record.id, "AVRIL")}
                              style={{ marginRight: 8 }}
                            >
                              OK
                            </Button>
                            <Button onClick={handleCancelConsoDc}>Annuler</Button>
                          </div>
                        ),
                      },
                    ]
                  }}
                  open={true}
                  trigger={[]} // Désactiver les triggers par défaut (click, hover, etc.)
                >
                  {/* Ce span est utilisé pour déclencher le dropdown */}
                  <span></span>
                </Dropdown>
              )}
              {(dropdownOpenDcPay === record.id && month === "AVRIL") && (
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: "input",
                        label: (
                          <div>
                            <Input
                                placeholder="Entrez le montant à payer"
                                value={inputValuePayBc}
                                onChange={(e) => setInputValuePayBc(e.target.value)}
                                style={{ marginBottom: 8 }}
                              />
                              <div className='bg-gray-300 rounded p-1'>
                                <span>BC disponible: {getRestPayBcByMont(value, "AVRIL")}F</span>
                              </div>
                          </div>
                        ),
                      },
                      {
                        key: "actions",
                        label: (
                          <div>
                            <Button
                              type="primary"
                              onClick={() => handleOkPayBc(record.id, "AVRIL")}
                              style={{ marginRight: 8 }}
                            >
                              OK
                            </Button>
                            <Button onClick={handleCancelPayDc}>Annuler</Button>
                          </div>
                        ),
                      },
                    ]
                  }}
                  open={true}
                  trigger={[]} // Désactiver les triggers par défaut (click, hover, etc.)
                >
                  {/* Ce span est utilisé pour déclencher le dropdown */}
                  <span></span>
                </Dropdown>
              )}
            </div>
          ),    
        }
      ],
      // render:(value)=><p className='text-sm'>{sortByMonth(value, "AVRIL") || "--"}</p>
    },
    {
      title:"MAI",
      dataIndex:"breakdowns",
      width:"200px",
      children: [
        {
          title: 'montant estimé',
          dataIndex: 'breakdowns',
          key: 'estimatedAmount',
          width: 150,
          render:(value)=><p className='text-sm'>{sortByMonth(value, "MAI", true) || "0"}</p>
        },
        {
          title: 'montant réel',
          dataIndex: 'breakdowns',
          key: 'realAmount',
          width: 250,
          // render:(value)=><p className='text-sm'>{sortByMonth(value, "MAI") || "0"}</p>
          render: (value, record) => (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {/* Affichage du montant */}
              <strong style={{ width: "200px" }}>{sortByMonth(value, "MAI") || "0"}</strong>
    
              {/* Bouton pour ouvrir le dropdown */}
              <Button className='bg-yellow-200' onClick={() => handleButtonClick(record.id , "MAI")}>Consommer</Button>
    
              {/* Dropdown */}
              {(dropdownOpenKey === record.id && month === "MAI") && (
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: "input",
                        label: (
                          <div>
                            <Input
                              placeholder="Entrez le montant à consommer"
                              value={inputValue}
                              onChange={(e) => setInputValue(e.target.value)}
                              style={{ marginBottom: 8 }}
                            />
                            <div className="bg-gray-300 rounded p-1">
                              <span>
                                Reste: {getRestByMont(value, "MAI").toLocaleString()} F
                              </span>
                            </div>
                          </div>
                        ),
                      },
                      {
                        key: "actions",
                        label: (
                          <div>
                            <Button
                              type="primary"
                              onClick={() => handleOk(record.id, "MAI")}
                              style={{ marginRight: 8 }}
                            >
                              OK
                            </Button>
                            <Button onClick={handleCancel}>Annuler</Button>
                          </div>
                        ),
                      },
                    ]
                  }}
                  open={true}
                  trigger={[]} // Désactiver les triggers par défaut (click, hover, etc.)
                >
                  {/* Ce span est utilisé pour déclencher le dropdown */}
                  <span></span>
                </Dropdown>
              )}
            </div>
          ),
        },
        {
          title: 'montant BC',
          dataIndex: 'breakdowns',
          key: 'purchaseOrderAmount',
          width: 320,
          // render:(value)=><p className='text-sm'>{sortByMonth(value, "MAI") || "0"}</p>
          render: (value, record) => (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {/* Affichage du montant */}
              <strong style={{ width: "200px" }}>{sortByMonthPurchaseOrderAmount(value, "MAI") || "0"}</strong>
    
              {/* Bouton pour ouvrir le dropdown */}
              <Button className='bg-yellow-200' onClick={() => handleButtonClickConsoBc(record.id , "MAI")}>Consommer</Button>
              <Button className='bg-blue-500 text-white' onClick={() => handleButtonClickPayBc(record.id , "MAI")}>Payer</Button>
    
              {/* Dropdown */}
              {(dropdownOpenDcConso === record.id && month === "MAI") && (
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: "input",
                        label: (
                          <div>
                            <Input
                              placeholder="Entrez le montant à consommer"
                              value={inputValueConsoBc}
                              onChange={(e) => setInputValueConsoBc(e.target.value)}
                              style={{ marginBottom: 8 }}
                            />
                            <div className='bg-gray-300 rounded p-1'>
                              <span>Reste: {getRestByMont(value, "MAI").toLocaleString()}F</span>
                            </div>
                          </div>
                        ),
                      },
                      {
                        key: "actions",
                        label: (
                          <div>
                            <Button
                              type="primary"
                              onClick={() => handleOkConsoBc(record.id, "MAI")}
                              style={{ marginRight: 8 }}
                            >
                              OK
                            </Button>
                            <Button onClick={handleCancelConsoDc}>Annuler</Button>
                          </div>
                        ),
                      },
                    ]
                  }}
                  open={true}
                  trigger={[]} // Désactiver les triggers par défaut (click, hover, etc.)
                >
                  {/* Ce span est utilisé pour déclencher le dropdown */}
                  <span></span>
                </Dropdown>
              )}
              {(dropdownOpenDcPay === record.id && month === "MAI") && (
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: "input",
                        label: (
                          <div>
                            <Input
                                placeholder="Entrez le montant à payer"
                                value={inputValuePayBc}
                                onChange={(e) => setInputValuePayBc(e.target.value)}
                                style={{ marginBottom: 8 }}
                              />
                              <div className='bg-gray-300 rounded p-1'>
                                <span>BC disponible: {getRestPayBcByMont(value, "MAI")}F</span>
                              </div>
                          </div>
                        ),
                      },
                      {
                        key: "actions",
                        label: (
                          <div>
                            <Button
                              type="primary"
                              onClick={() => handleOkPayBc(record.id, "MAI")}
                              style={{ marginRight: 8 }}
                            >
                              OK
                            </Button>
                            <Button onClick={handleCancelPayDc}>Annuler</Button>
                          </div>
                        ),
                      },
                    ]
                  }}
                  open={true}
                  trigger={[]} // Désactiver les triggers par défaut (click, hover, etc.)
                >
                  {/* Ce span est utilisé pour déclencher le dropdown */}
                  <span></span>
                </Dropdown>
              )}
            </div>
          ),    
        }
      ],
      // render:(value)=><p className='text-sm'>{sortByMonth(value, "MAI") || "--"}</p>
    },
    {
      title:"JUIN",
      dataIndex:"breakdowns",
      width:"200px",
      children: [
        {
          title: 'montant estimé',
          dataIndex: 'breakdowns',
          key: 'estimatedAmount',
          width: 150,
          render:(value)=><p className='text-sm'>{sortByMonth(value, "JUIN", true) || "0"}</p>
        },
        {
          title: 'montant réel',
          dataIndex: 'breakdowns',
          key: 'realAmount',
          width: 250,
          // render:(value)=><p className='text-sm'>{sortByMonth(value, "JUIN") || "0"}</p>
          render: (value, record) => (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {/* Affichage du montant */}
              <strong style={{ width: "200px" }}>{sortByMonth(value, "JUIN") || "0"}</strong>
    
              {/* Bouton pour ouvrir le dropdown */}
              <Button className='bg-yellow-200' onClick={() => handleButtonClick(record.id , "JUIN")}>Consommer</Button>
    
              {/* Dropdown */}
              {(dropdownOpenKey === record.id && month === "JUIN") && (
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: "input",
                        label: (
                          <div>
                            <Input
                              placeholder="Entrez le montant à consommer"
                              value={inputValue}
                              onChange={(e) => setInputValue(e.target.value)}
                              style={{ marginBottom: 8 }}
                            />
                            <div className="bg-gray-300 rounded p-1">
                              <span>
                                Reste: {getRestByMont(value, "JUIN").toLocaleString()} F
                              </span>
                            </div>
                          </div>
                        ),
                      },
                      {
                        key: "actions",
                        label: (
                          <div>
                            <Button
                              type="primary"
                              onClick={() => handleOk(record.id, "JUIN")}
                              style={{ marginRight: 8 }}
                            >
                              OK
                            </Button>
                            <Button onClick={handleCancel}>Annuler</Button>
                          </div>
                        ),
                      },
                    ]
                  }}
                  open={true}
                  trigger={[]} // Désactiver les triggers par défaut (click, hover, etc.)
                >
                  {/* Ce span est utilisé pour déclencher le dropdown */}
                  <span></span>
                </Dropdown>
              )}
            </div>
          ),
        },
        {
          title: 'montant BC',
          dataIndex: 'breakdowns',
          key: 'purchaseOrderAmount',
          width: 320,
          // render:(value)=><p className='text-sm'>{sortByMonth(value, "JUIN") || "0"}</p>
          render: (value, record) => (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {/* Affichage du montant */}
              <strong style={{ width: "200px" }}>{sortByMonthPurchaseOrderAmount(value, "JUIN") || "0"}</strong>
    
              {/* Bouton pour ouvrir le dropdown */}
              <Button className='bg-yellow-200' onClick={() => handleButtonClickConsoBc(record.id , "JUIN")}>Consommer</Button>
              <Button className='bg-blue-500 text-white' onClick={() => handleButtonClickPayBc(record.id , "JUIN")}>Payer</Button>
    
              {/* Dropdown */}
              {(dropdownOpenDcConso === record.id && month === "JUIN") && (
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: "input",
                        label: (
                          <div>
                            <Input
                              placeholder="Entrez le montant à consommer"
                              value={inputValueConsoBc}
                              onChange={(e) => setInputValueConsoBc(e.target.value)}
                              style={{ marginBottom: 8 }}
                            />
                            <div className='bg-gray-300 rounded p-1'>
                              <span>Reste: {getRestByMont(value, "JUIN").toLocaleString()}F</span>
                            </div>
                          </div>
                        ),
                      },
                      {
                        key: "actions",
                        label: (
                          <div>
                            <Button
                              type="primary"
                              onClick={() => handleOkConsoBc(record.id, "JUIN")}
                              style={{ marginRight: 8 }}
                            >
                              OK
                            </Button>
                            <Button onClick={handleCancelConsoDc}>Annuler</Button>
                          </div>
                        ),
                      },
                    ]
                  }}
                  open={true}
                  trigger={[]} // Désactiver les triggers par défaut (click, hover, etc.)
                >
                  {/* Ce span est utilisé pour déclencher le dropdown */}
                  <span></span>
                </Dropdown>
              )}
              {(dropdownOpenDcPay === record.id && month === "JUIN") && (
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: "input",
                        label: (
                          <div>
                            <Input
                                placeholder="Entrez le montant à payer"
                                value={inputValuePayBc}
                                onChange={(e) => setInputValuePayBc(e.target.value)}
                                style={{ marginBottom: 8 }}
                              />
                              <div className='bg-gray-300 rounded p-1'>
                                <span>BC disponible: {getRestPayBcByMont(value, "JUIN")}F</span>
                              </div>
                          </div>
                        ),
                      },
                      {
                        key: "actions",
                        label: (
                          <div>
                            <Button
                              type="primary"
                              onClick={() => handleOkPayBc(record.id, "JUIN")}
                              style={{ marginRight: 8 }}
                            >
                              OK
                            </Button>
                            <Button onClick={handleCancelPayDc}>Annuler</Button>
                          </div>
                        ),
                      },
                    ]
                  }}
                  open={true}
                  trigger={[]} // Désactiver les triggers par défaut (click, hover, etc.)
                >
                  {/* Ce span est utilisé pour déclencher le dropdown */}
                  <span></span>
                </Dropdown>
              )}
            </div>
          ),    
        }
      ],
      // render:(value)=><p className='text-sm'>{sortByMonth(value, "JUIN") || "--"}</p>
    },
    {
      title:"JUILLET",
      dataIndex:"breakdowns",
      width:"200px",
      children: [
        {
          title: 'montant estimé',
          dataIndex: 'breakdowns',
          key: 'estimatedAmount',
          width: 150,
          render:(value)=><p className='text-sm'>{sortByMonth(value, "JUILLET", true) || "0"}</p>
        },
        {
          title: 'montant réel',
          dataIndex: 'breakdowns',
          key: 'realAmount',
          width: 250,
          // render:(value)=><p className='text-sm'>{sortByMonth(value, "JUILLET") || "0"}</p>
          render: (value, record) => (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {/* Affichage du montant */}
              <strong style={{ width: "200px" }}>{sortByMonth(value, "JUILLET") || "0"}</strong>
    
              {/* Bouton pour ouvrir le dropdown */}
              <Button className='bg-yellow-200' onClick={() => handleButtonClick(record.id , "JUILLET")}>Consommer</Button>
    
              {/* Dropdown */}
              {(dropdownOpenKey === record.id && month === "JUILLET") && (
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: "input",
                        label: (
                          <div>
                            <Input
                              placeholder="Entrez le montant à consommer"
                              value={inputValue}
                              onChange={(e) => setInputValue(e.target.value)}
                              style={{ marginBottom: 8 }}
                            />
                            <div className="bg-gray-300 rounded p-1">
                              <span>
                                Reste: {getRestByMont(value, "JUILLET").toLocaleString()} F
                              </span>
                            </div>
                          </div>
                        ),
                      },
                      {
                        key: "actions",
                        label: (
                          <div>
                            <Button
                              type="primary"
                              onClick={() => handleOk(record.id, "JUILLET")}
                              style={{ marginRight: 8 }}
                            >
                              OK
                            </Button>
                            <Button onClick={handleCancel}>Annuler</Button>
                          </div>
                        ),
                      },
                    ]
                  }}
                  open={true}
                  trigger={[]} // Désactiver les triggers par défaut (click, hover, etc.)
                >
                  {/* Ce span est utilisé pour déclencher le dropdown */}
                  <span></span>
                </Dropdown>
              )}
            </div>
          ),
        },
        {
          title: 'montant BC',
          dataIndex: 'breakdowns',
          key: 'purchaseOrderAmount',
          width: 320,
          // render:(value)=><p className='text-sm'>{sortByMonth(value, "JUILLET") || "0"}</p>
          render: (value, record) => (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {/* Affichage du montant */}
              <strong style={{ width: "200px" }}>{sortByMonthPurchaseOrderAmount(value, "JUILLET") || "0"}</strong>
    
              {/* Bouton pour ouvrir le dropdown */}
              <Button className='bg-yellow-200' onClick={() => handleButtonClickConsoBc(record.id , "JUILLET")}>Consommer</Button>
              <Button className='bg-blue-500 text-white' onClick={() => handleButtonClickPayBc(record.id , "JUILLET")}>Payer</Button>
    
              {/* Dropdown */}
              {(dropdownOpenDcConso === record.id && month === "JUILLET") && (
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: "input",
                        label: (
                          <div>
                            <Input
                              placeholder="Entrez le montant à consommer"
                              value={inputValueConsoBc}
                              onChange={(e) => setInputValueConsoBc(e.target.value)}
                              style={{ marginBottom: 8 }}
                            />
                            <div className='bg-gray-300 rounded p-1'>
                              <span>Reste: {getRestByMont(value, "JUILLET").toLocaleString()}F</span>
                            </div>
                          </div>
                        ),
                      },
                      {
                        key: "actions",
                        label: (
                          <div>
                            <Button
                              type="primary"
                              onClick={() => handleOkConsoBc(record.id, "JUILLET")}
                              style={{ marginRight: 8 }}
                            >
                              OK
                            </Button>
                            <Button onClick={handleCancelConsoDc}>Annuler</Button>
                          </div>
                        ),
                      },
                    ]
                  }}
                  open={true}
                  trigger={[]} // Désactiver les triggers par défaut (click, hover, etc.)
                >
                  {/* Ce span est utilisé pour déclencher le dropdown */}
                  <span></span>
                </Dropdown>
              )}
              {(dropdownOpenDcPay === record.id && month === "JUILLET") && (
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: "input",
                        label: (
                          <div>
                            <Input
                                placeholder="Entrez le montant à payer"
                                value={inputValuePayBc}
                                onChange={(e) => setInputValuePayBc(e.target.value)}
                                style={{ marginBottom: 8 }}
                              />
                              <div className='bg-gray-300 rounded p-1'>
                                <span>BC disponible: {getRestPayBcByMont(value, "JUILLET")}F</span>
                              </div>
                          </div>
                        ),
                      },
                      {
                        key: "actions",
                        label: (
                          <div>
                            <Button
                              type="primary"
                              onClick={() => handleOkPayBc(record.id, "JUILLET")}
                              style={{ marginRight: 8 }}
                            >
                              OK
                            </Button>
                            <Button onClick={handleCancelPayDc}>Annuler</Button>
                          </div>
                        ),
                      },
                    ]
                  }}
                  open={true}
                  trigger={[]} // Désactiver les triggers par défaut (click, hover, etc.)
                >
                  {/* Ce span est utilisé pour déclencher le dropdown */}
                  <span></span>
                </Dropdown>
              )}
            </div>
          ),    
        }
      ],
      // render:(value)=><p className='text-sm'>{sortByMonth(value, "JUILLET") || "--"}</p>
    },
    {
      title:"AOUT",
      dataIndex:"breakdowns",
      width:"200px",
      children: [
        {
          title: 'montant estimé',
          dataIndex: 'breakdowns',
          key: 'estimatedAmount',
          width: 150,
          render:(value)=><p className='text-sm'>{sortByMonth(value, "AOUT", true) || "0"}</p>
        },
        {
          title: 'montant réel',
          dataIndex: 'breakdowns',
          key: 'realAmount',
          width: 250,
          // render:(value)=><p className='text-sm'>{sortByMonth(value, "AOUT") || "0"}</p>
          render: (value, record) => (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {/* Affichage du montant */}
              <strong style={{ width: "200px" }}>{sortByMonth(value, "AOUT") || "0"}</strong>
    
              {/* Bouton pour ouvrir le dropdown */}
              <Button className='bg-yellow-200' onClick={() => handleButtonClick(record.id , "AOUT")}>Consommer</Button>
    
              {/* Dropdown */}
              {(dropdownOpenKey === record.id && month === "AOUT") && (
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: "input",
                        label: (
                          <div>
                            <Input
                              placeholder="Entrez le montant à consommer"
                              value={inputValue}
                              onChange={(e) => setInputValue(e.target.value)}
                              style={{ marginBottom: 8 }}
                            />
                            <div className="bg-gray-300 rounded p-1">
                              <span>
                                Reste: {getRestByMont(value, "AOUT").toLocaleString()} F
                              </span>
                            </div>
                          </div>
                        ),
                      },
                      {
                        key: "actions",
                        label: (
                          <div>
                            <Button
                              type="primary"
                              onClick={() => handleOk(record.id, "AOUT")}
                              style={{ marginRight: 8 }}
                            >
                              OK
                            </Button>
                            <Button onClick={handleCancel}>Annuler</Button>
                          </div>
                        ),
                      },
                    ]
                  }}
                  open={true}
                  trigger={[]} // Désactiver les triggers par défaut (click, hover, etc.)
                >
                  {/* Ce span est utilisé pour déclencher le dropdown */}
                  <span></span>
                </Dropdown>
              )}
            </div>
          ),
        },
        {
          title: 'montant BC',
          dataIndex: 'breakdowns',
          key: 'purchaseOrderAmount',
          width: 320,
          // render:(value)=><p className='text-sm'>{sortByMonth(value, "AOUT") || "0"}</p>
          render: (value, record) => (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {/* Affichage du montant */}
              <strong style={{ width: "200px" }}>{sortByMonthPurchaseOrderAmount(value, "AOUT") || "0"}</strong>
    
              {/* Bouton pour ouvrir le dropdown */}
              <Button className='bg-yellow-200' onClick={() => handleButtonClickConsoBc(record.id , "AOUT")}>Consommer</Button>
              <Button className='bg-blue-500 text-white' onClick={() => handleButtonClickPayBc(record.id , "AOUT")}>Payer</Button>
    
              {/* Dropdown */}
              {(dropdownOpenDcConso === record.id && month === "AOUT") && (
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: "input",
                        label: (
                          <div>
                            <Input
                              placeholder="Entrez le montant à consommer"
                              value={inputValueConsoBc}
                              onChange={(e) => setInputValueConsoBc(e.target.value)}
                              style={{ marginBottom: 8 }}
                            />
                            <div className='bg-gray-300 rounded p-1'>
                              <span>Reste: {getRestByMont(value, "AOUT").toLocaleString()}F</span>
                            </div>
                          </div>
                        ),
                      },
                      {
                        key: "actions",
                        label: (
                          <div>
                            <Button
                              type="primary"
                              onClick={() => handleOkConsoBc(record.id, "AOUT")}
                              style={{ marginRight: 8 }}
                            >
                              OK
                            </Button>
                            <Button onClick={handleCancelConsoDc}>Annuler</Button>
                          </div>
                        ),
                      },
                    ]
                  }}
                  open={true}
                  trigger={[]} // Désactiver les triggers par défaut (click, hover, etc.)
                >
                  {/* Ce span est utilisé pour déclencher le dropdown */}
                  <span></span>
                </Dropdown>
              )}
              {(dropdownOpenDcPay === record.id && month === "AOUT") && (
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: "input",
                        label: (
                          <div>
                            <Input
                                placeholder="Entrez le montant à payer"
                                value={inputValuePayBc}
                                onChange={(e) => setInputValuePayBc(e.target.value)}
                                style={{ marginBottom: 8 }}
                              />
                              <div className='bg-gray-300 rounded p-1'>
                                <span>BC disponible: {getRestPayBcByMont(value, "AOUT")}F</span>
                              </div>
                          </div>
                        ),
                      },
                      {
                        key: "actions",
                        label: (
                          <div>
                            <Button
                              type="primary"
                              onClick={() => handleOkPayBc(record.id, "AOUT")}
                              style={{ marginRight: 8 }}
                            >
                              OK
                            </Button>
                            <Button onClick={handleCancelPayDc}>Annuler</Button>
                          </div>
                        ),
                      },
                    ]
                  }}
                  open={true}
                  trigger={[]} // Désactiver les triggers par défaut (click, hover, etc.)
                >
                  {/* Ce span est utilisé pour déclencher le dropdown */}
                  <span></span>
                </Dropdown>
              )}
            </div>
          ),    
        }
      ],
      // render:(value)=><p className='text-sm'>{sortByMonth(value, "AOUT") || "--"}</p>
    },
    {
      title:"SEPTEMBRE",
      dataIndex:"breakdowns",
      width:"200px",
      children: [
        {
          title: 'montant estimé',
          dataIndex: 'breakdowns',
          key: 'estimatedAmount',
          width: 150,
          render:(value)=><p className='text-sm'>{sortByMonth(value, "SEPTEMBRE", true) || "0"}</p>
        },
        {
          title: 'montant réel',
          dataIndex: 'breakdowns',
          key: 'realAmount',
          width: 250,
          // render:(value)=><p className='text-sm'>{sortByMonth(value, "SEPTEMBRE") || "0"}</p>
          render: (value, record) => (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {/* Affichage du montant */}
              <strong style={{ width: "200px" }}>{sortByMonth(value, "SEPTEMBRE") || "0"}</strong>
    
              {/* Bouton pour ouvrir le dropdown */}
              <Button className='bg-yellow-200' onClick={() => handleButtonClick(record.id , "SEPTEMBRE")}>Consommer</Button>
    
              {/* Dropdown */}
              {(dropdownOpenKey === record.id && month === "SEPTEMBRE") && (
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: "input",
                        label: (
                          <div>
                            <Input
                              placeholder="Entrez le montant à consommer"
                              value={inputValue}
                              onChange={(e) => setInputValue(e.target.value)}
                              style={{ marginBottom: 8 }}
                            />
                            <div className="bg-gray-300 rounded p-1">
                              <span>
                                Reste: {getRestByMont(value, "SEPTEMBRE").toLocaleString()} F
                              </span>
                            </div>
                          </div>
                        ),
                      },
                      {
                        key: "actions",
                        label: (
                          <div>
                            <Button
                              type="primary"
                              onClick={() => handleOk(record.id, "SEPTEMBRE")}
                              style={{ marginRight: 8 }}
                            >
                              OK
                            </Button>
                            <Button onClick={handleCancel}>Annuler</Button>
                          </div>
                        ),
                      },
                    ]
                  }}
                  open={true}
                  trigger={[]} // Désactiver les triggers par défaut (click, hover, etc.)
                >
                  {/* Ce span est utilisé pour déclencher le dropdown */}
                  <span></span>
                </Dropdown>
              )}
            </div>
          ),
        },
        {
          title: 'montant BC',
          dataIndex: 'breakdowns',
          key: 'purchaseOrderAmount',
          width: 320,
          // render:(value)=><p className='text-sm'>{sortByMonth(value, "SEPTEMBRE") || "0"}</p>
          render: (value, record) => (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {/* Affichage du montant */}
              <strong style={{ width: "200px" }}>{sortByMonthPurchaseOrderAmount(value, "SEPTEMBRE") || "0"}</strong>
    
              {/* Bouton pour ouvrir le dropdown */}
              <Button className='bg-yellow-200' onClick={() => handleButtonClickConsoBc(record.id , "SEPTEMBRE")}>Consommer</Button>
              <Button className='bg-blue-500 text-white' onClick={() => handleButtonClickPayBc(record.id , "SEPTEMBRE")}>Payer</Button>
    
              {/* Dropdown */}
              {(dropdownOpenDcConso === record.id && month === "SEPTEMBRE") && (
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: "input",
                        label: (
                          <div>
                            <Input
                              placeholder="Entrez le montant à consommer"
                              value={inputValueConsoBc}
                              onChange={(e) => setInputValueConsoBc(e.target.value)}
                              style={{ marginBottom: 8 }}
                            />
                            <div className='bg-gray-300 rounded p-1'>
                              <span>Reste: {getRestByMont(value, "SEPTEMBRE").toLocaleString()}F</span>
                            </div>
                          </div>
                        ),
                      },
                      {
                        key: "actions",
                        label: (
                          <div>
                            <Button
                              type="primary"
                              onClick={() => handleOkConsoBc(record.id, "SEPTEMBRE")}
                              style={{ marginRight: 8 }}
                            >
                              OK
                            </Button>
                            <Button onClick={handleCancelConsoDc}>Annuler</Button>
                          </div>
                        ),
                      },
                    ]
                  }}
                  open={true}
                  trigger={[]} // Désactiver les triggers par défaut (click, hover, etc.)
                >
                  {/* Ce span est utilisé pour déclencher le dropdown */}
                  <span></span>
                </Dropdown>
              )}
              {(dropdownOpenDcPay === record.id && month === "SEPTEMBRE") && (
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: "input",
                        label: (
                          <div>
                            <Input
                                placeholder="Entrez le montant à payer"
                                value={inputValuePayBc}
                                onChange={(e) => setInputValuePayBc(e.target.value)}
                                style={{ marginBottom: 8 }}
                              />
                              <div className='bg-gray-300 rounded p-1'>
                                <span>BC disponible: {getRestPayBcByMont(value, "SEPTEMBRE")}F</span>
                              </div>
                          </div>
                        ),
                      },
                      {
                        key: "actions",
                        label: (
                          <div>
                            <Button
                              type="primary"
                              onClick={() => handleOkPayBc(record.id, "SEPTEMBRE")}
                              style={{ marginRight: 8 }}
                            >
                              OK
                            </Button>
                            <Button onClick={handleCancelPayDc}>Annuler</Button>
                          </div>
                        ),
                      },
                    ]
                  }}
                  open={true}
                  trigger={[]} // Désactiver les triggers par défaut (click, hover, etc.)
                >
                  {/* Ce span est utilisé pour déclencher le dropdown */}
                  <span></span>
                </Dropdown>
              )}
            </div>
          ),    
        }
      ],
      // render:(value)=><p className='text-sm'>{sortByMonth(value, "SEPTEMBRE") || "--"}</p>
    },
    {
      title:"OCTOBRE",
      dataIndex:"breakdowns",
      width:"200px",
      children: [
        {
          title: 'montant estimé',
          dataIndex: 'breakdowns',
          key: 'estimatedAmount',
          width: 150,
          render:(value)=><p className='text-sm'>{sortByMonth(value, "OCTOBRE", true) || "0"}</p>
        },
        {
          title: 'montant réel',
          dataIndex: 'breakdowns',
          key: 'realAmount',
          width: 250,
          // render:(value)=><p className='text-sm'>{sortByMonth(value, "OCTOBRE") || "0"}</p>
          render: (value, record) => (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {/* Affichage du montant */}
              <strong style={{ width: "200px" }}>{sortByMonth(value, "OCTOBRE") || "0"}</strong>
    
              {/* Bouton pour ouvrir le dropdown */}
              <Button className='bg-yellow-200' onClick={() => handleButtonClick(record.id , "OCTOBRE")}>Consommer</Button>
    
              {/* Dropdown */}
              {(dropdownOpenKey === record.id && month === "OCTOBRE") && (
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: "input",
                        label: (
                          <div>
                            <Input
                              placeholder="Entrez le montant à consommer"
                              value={inputValue}
                              onChange={(e) => setInputValue(e.target.value)}
                              style={{ marginBottom: 8 }}
                            />
                            <div className="bg-gray-300 rounded p-1">
                              <span>
                                Reste: {getRestByMont(value, "OCTOBRE").toLocaleString()} F
                              </span>
                            </div>
                          </div>
                        ),
                      },
                      {
                        key: "actions",
                        label: (
                          <div>
                            <Button
                              type="primary"
                              onClick={() => handleOk(record.id, "OCTOBRE")}
                              style={{ marginRight: 8 }}
                            >
                              OK
                            </Button>
                            <Button onClick={handleCancel}>Annuler</Button>
                          </div>
                        ),
                      },
                    ]
                  }}
                  open={true}
                  trigger={[]} // Désactiver les triggers par défaut (click, hover, etc.)
                >
                  {/* Ce span est utilisé pour déclencher le dropdown */}
                  <span></span>
                </Dropdown>
              )}
            </div>
          ), 
        },
        {
          title: 'montant BC',
          dataIndex: 'breakdowns',
          key: 'purchaseOrderAmount',
          width: 320,
          // render:(value)=><p className='text-sm'>{sortByMonth(value, "OCTOBRE") || "0"}</p>
          render: (value, record) => (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {/* Affichage du montant */}
              <strong style={{ width: "200px" }}>{sortByMonthPurchaseOrderAmount(value, "OCTOBRE") || "0"}</strong>
    
              {/* Bouton pour ouvrir le dropdown */}
              <Button className='bg-yellow-200' onClick={() => handleButtonClickConsoBc(record.id , "OCTOBRE")}>Consommer</Button>
              <Button className='bg-blue-500 text-white' onClick={() => handleButtonClickPayBc(record.id , "OCTOBRE")}>Payer</Button>
    
              {/* Dropdown */}
              {(dropdownOpenDcConso === record.id && month === "OCTOBRE") && (
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: "input",
                        label: (
                          <div>
                            <Input
                              placeholder="Entrez le montant à consommer"
                              value={inputValueConsoBc}
                              onChange={(e) => setInputValueConsoBc(e.target.value)}
                              style={{ marginBottom: 8 }}
                            />
                            <div className='bg-gray-300 rounded p-1'>
                              <span>Reste: {getRestByMont(value, "OCTOBRE").toLocaleString()}F</span>
                            </div>
                          </div>
                        ),
                      },
                      {
                        key: "actions",
                        label: (
                          <div>
                            <Button
                              type="primary"
                              onClick={() => handleOkConsoBc(record.id, "OCTOBRE")}
                              style={{ marginRight: 8 }}
                            >
                              OK
                            </Button>
                            <Button onClick={handleCancelConsoDc}>Annuler</Button>
                          </div>
                        ),
                      },
                    ]
                  }}
                  open={true}
                  trigger={[]} // Désactiver les triggers par défaut (click, hover, etc.)
                >
                  {/* Ce span est utilisé pour déclencher le dropdown */}
                  <span></span>
                </Dropdown>
              )}
              {(dropdownOpenDcPay === record.id && month === "OCTOBRE") && (
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: "input",
                        label: (
                          <div>
                            <Input
                                placeholder="Entrez le montant à payer"
                                value={inputValuePayBc}
                                onChange={(e) => setInputValuePayBc(e.target.value)}
                                style={{ marginBottom: 8 }}
                              />
                              <div className='bg-gray-300 rounded p-1'>
                                <span>BC disponible: {getRestPayBcByMont(value, "OCTOBRE")}F</span>
                              </div>
                          </div>
                        ),
                      },
                      {
                        key: "actions",
                        label: (
                          <div>
                            <Button
                              type="primary"
                              onClick={() => handleOkPayBc(record.id, "OCTOBRE")}
                              style={{ marginRight: 8 }}
                            >
                              OK
                            </Button>
                            <Button onClick={handleCancelPayDc}>Annuler</Button>
                          </div>
                        ),
                      },
                    ]
                  }}
                  open={true}
                  trigger={[]} // Désactiver les triggers par défaut (click, hover, etc.)
                >
                  {/* Ce span est utilisé pour déclencher le dropdown */}
                  <span></span>
                </Dropdown>
              )}
            </div>
          ),    
        }
      ],
      // render:(value)=><p className='text-sm'>{sortByMonth(value, "OCTOBRE") || "--"}</p>
    },
    {
      title:"NOVEMBRE",
      dataIndex:"breakdowns",
      width:"200px",
      children: [
        {
          title: 'montant estimé',
          dataIndex: 'breakdowns',
          key: 'estimatedAmount',
          width: 150,
          render:(value)=><p className='text-sm'>{sortByMonth(value, "NOVEMBRE", true) || "0"}</p>
        },
        {
          title: 'montant réel',
          dataIndex: 'breakdowns',
          key: 'realAmount',
          width: 250,
          // render:(value)=><p className='text-sm'>{sortByMonth(value, "NOVEMBRE") || "0"}</p>
          render: (value, record) => (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {/* Affichage du montant */}
              <strong style={{ width: "200px" }}>{sortByMonth(value, "NOVEMBRE") || "0"}</strong>
    
              {/* Bouton pour ouvrir le dropdown */}
              <Button className='bg-yellow-200' onClick={() => handleButtonClick(record.id , "NOVEMBRE")}>Consommer</Button>
    
              {/* Dropdown */}
              {(dropdownOpenKey === record.id && month === "NOVEMBRE") && (
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: "input",
                        label: (
                          <div>
                            <Input
                              placeholder="Entrez le montant à consommer"
                              value={inputValue}
                              onChange={(e) => setInputValue(e.target.value)}
                              style={{ marginBottom: 8 }}
                            />
                            <div className="bg-gray-300 rounded p-1">
                              <span>
                                Reste: {getRestByMont(value, "NOVEMBRE").toLocaleString()} F
                              </span>
                            </div>
                          </div>
                        ),
                      },
                      {
                        key: "actions",
                        label: (
                          <div>
                            <Button
                              type="primary"
                              onClick={() => handleOk(record.id, "NOVEMBRE")}
                              style={{ marginRight: 8 }}
                            >
                              OK
                            </Button>
                            <Button onClick={handleCancel}>Annuler</Button>
                          </div>
                        ),
                      },
                    ]
                  }}
                  open={true}
                  trigger={[]} // Désactiver les triggers par défaut (click, hover, etc.)
                >
                  {/* Ce span est utilisé pour déclencher le dropdown */}
                  <span></span>
                </Dropdown>
              )}
            </div>
          ),
        },
        {
          title: 'montant BC',
          dataIndex: 'breakdowns',
          key: 'purchaseOrderAmount',
          width: 320,
          // render:(value)=><p className='text-sm'>{sortByMonth(value, "NOVEMBRE") || "0"}</p>
          render: (value, record) => (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {/* Affichage du montant */}
              <strong style={{ width: "200px" }}>{sortByMonthPurchaseOrderAmount(value, "NOVEMBRE") || "0"}</strong>
    
              {/* Bouton pour ouvrir le dropdown */}
              <Button className='bg-yellow-200' onClick={() => handleButtonClickConsoBc(record.id , "NOVEMBRE")}>Consommer</Button>
              <Button className='bg-blue-500 text-white' onClick={() => handleButtonClickPayBc(record.id , "NOVEMBRE")}>Payer</Button>
    
              {/* Dropdown */}
              {(dropdownOpenDcConso === record.id && month === "NOVEMBRE") && (
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: "input",
                        label: (
                          <div>
                            <Input
                              placeholder="Entrez le montant à consommer"
                              value={inputValueConsoBc}
                              onChange={(e) => setInputValueConsoBc(e.target.value)}
                              style={{ marginBottom: 8 }}
                            />
                            <div className='bg-gray-300 rounded p-1'>
                              <span>Reste: {getRestByMont(value, "NOVEMBRE").toLocaleString()}F</span>
                            </div>
                          </div>
                        ),
                      },
                      {
                        key: "actions",
                        label: (
                          <div>
                            <Button
                              type="primary"
                              onClick={() => handleOkConsoBc(record.id, "NOVEMBRE")}
                              style={{ marginRight: 8 }}
                            >
                              OK
                            </Button>
                            <Button onClick={handleCancelConsoDc}>Annuler</Button>
                          </div>
                        ),
                      },
                    ]
                  }}
                  open={true}
                  trigger={[]} // Désactiver les triggers par défaut (click, hover, etc.)
                >
                  {/* Ce span est utilisé pour déclencher le dropdown */}
                  <span></span>
                </Dropdown>
              )}
              {(dropdownOpenDcPay === record.id && month === "NOVEMBRE") && (
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: "input",
                        label: (
                          <div>
                            <Input
                                placeholder="Entrez le montant à payer"
                                value={inputValuePayBc}
                                onChange={(e) => setInputValuePayBc(e.target.value)}
                                style={{ marginBottom: 8 }}
                              />
                              <div className='bg-gray-300 rounded p-1'>
                                <span>BC disponible: {getRestPayBcByMont(value, "NOVEMBRE")}F</span>
                              </div>
                          </div>
                        ),
                      },
                      {
                        key: "actions",
                        label: (
                          <div>
                            <Button
                              type="primary"
                              onClick={() => handleOkPayBc(record.id, "NOVEMBRE")}
                              style={{ marginRight: 8 }}
                            >
                              OK
                            </Button>
                            <Button onClick={handleCancelPayDc}>Annuler</Button>
                          </div>
                        ),
                      },
                    ]
                  }}
                  open={true}
                  trigger={[]} // Désactiver les triggers par défaut (click, hover, etc.)
                >
                  {/* Ce span est utilisé pour déclencher le dropdown */}
                  <span></span>
                </Dropdown>
              )}
            </div>
          ),    
        }
      ],
      // render:(value)=><p className='text-sm'>{sortByMonth(value, "NOVEMBRE") || "--"}</p>
    },
    {
      title:"DECEMBRE",
      dataIndex:"breakdowns",
      width:"200px",
      children: [
        {
          title: 'montant estimé',
          dataIndex: 'breakdowns',
          key: 'estimatedAmount',
          width: 150,
          render:(value)=><p className='text-sm'>{sortByMonth(value, "DECEMBRE", true) || "0"}</p>
        },
        {
          title: 'montant réel',
          dataIndex: 'breakdowns',
          key: 'realAmount',
          width: 250,
          // render:(value)=><p className='text-sm'>{sortByMonth(value, "DECEMBRE") || "0"}</p>
          render: (value, record) => (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {/* Affichage du montant */}
              <strong style={{ width: "200px" }}>{sortByMonth(value, "DECEMBRE") || "0"}</strong>
    
              {/* Bouton pour ouvrir le dropdown */}
              <Button className='bg-yellow-200' onClick={() => handleButtonClick(record.id, "DECEMBRE")}>Consommer</Button>
    
              {/* Dropdown */}
              {(dropdownOpenKey === record.id && month === "DECEMBRE") && (
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: "input",
                        label: (
                          <div>
                            <Input
                              placeholder="Entrez le montant à consommer"
                              value={inputValue}
                              onChange={(e) => setInputValue(e.target.value)}
                              style={{ marginBottom: 8 }}
                            />
                            <div className="bg-gray-300 rounded p-1">
                              <span>
                                Reste: {getRestByMont(value, "DECEMBRE").toLocaleString()} F
                              </span>
                            </div>
                          </div>
                        ),
                      },
                      {
                        key: "actions",
                        label: (
                          <div>
                            <Button
                              type="primary"
                              onClick={() => handleOk(record.id, "DECEMBRE")}
                              style={{ marginRight: 8 }}
                            >
                              OK
                            </Button>
                            <Button onClick={handleCancel}>Annuler</Button>
                          </div>
                        ),
                      },
                    ]
                  }}
                  open={true}
                  trigger={[]} // Désactiver les triggers par défaut (click, hover, etc.)
                >
                  {/* Ce span est utilisé pour déclencher le dropdown */}
                  <span></span>
                </Dropdown>
              )}
            </div>
          ),
        },
        {
          title: 'montant BC',
          dataIndex: 'breakdowns',
          key: 'purchaseOrderAmount',
          width: 320,
          // render:(value)=><p className='text-sm'>{sortByMonth(value, "DECEMBRE") || "0"}</p>
          render: (value, record) => (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {/* Affichage du montant */}
              <strong style={{ width: "200px" }}>{sortByMonthPurchaseOrderAmount(value, "DECEMBRE") || "0"}</strong>
    
              {/* Bouton pour ouvrir le dropdown */}
              <Button className='bg-yellow-200' onClick={() => handleButtonClickConsoBc(record.id , "DECEMBRE")}>Consommer</Button>
              <Button className='bg-blue-500 text-white' onClick={() => handleButtonClickPayBc(record.id , "DECEMBRE")}>Payer</Button>
    
              {/* Dropdown */}
              {(dropdownOpenDcConso === record.id && month === "DECEMBRE") && (
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: "input",
                        label: (
                          <div>
                            <Input
                              placeholder="Entrez le montant à consommer"
                              value={inputValueConsoBc}
                              onChange={(e) => setInputValueConsoBc(e.target.value)}
                              style={{ marginBottom: 8 }}
                            />
                            <div className='bg-gray-300 rounded p-1'>
                              <span>Reste: {getRestByMont(value, "DECEMBRE").toLocaleString()}F</span>
                            </div>
                          </div>
                        ),
                      },
                      {
                        key: "actions",
                        label: (
                          <div>
                            <Button
                              type="primary"
                              onClick={() => handleOkConsoBc(record.id, "DECEMBRE")}
                              style={{ marginRight: 8 }}
                            >
                              OK
                            </Button>
                            <Button onClick={handleCancelConsoDc}>Annuler</Button>
                          </div>
                        ),
                      },
                    ]
                  }}
                  open={true}
                  trigger={[]} // Désactiver les triggers par défaut (click, hover, etc.)
                >
                  {/* Ce span est utilisé pour déclencher le dropdown */}
                  <span></span>
                </Dropdown>
              )}
              {(dropdownOpenDcPay === record.id && month === "DECEMBRE") && (
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: "input",
                        label: (
                          <div>
                            <Input
                                placeholder="Entrez le montant à payer"
                                value={inputValuePayBc}
                                onChange={(e) => setInputValuePayBc(e.target.value)}
                                style={{ marginBottom: 8 }}
                              />
                              <div className='bg-gray-300 rounded p-1'>
                                <span>BC disponible: {getRestPayBcByMont(value, "DECEMBRE")}F</span>
                              </div>
                          </div>
                        ),
                      },
                      {
                        key: "actions",
                        label: (
                          <div>
                            <Button
                              type="primary"
                              onClick={() => handleOkPayBc(record.id, "DECEMBRE")}
                              style={{ marginRight: 8 }}
                            >
                              OK
                            </Button>
                            <Button onClick={handleCancelPayDc}>Annuler</Button>
                          </div>
                        ),
                      },
                    ]
                  }}
                  open={true}
                  trigger={[]} // Désactiver les triggers par défaut (click, hover, etc.)
                >
                  {/* Ce span est utilisé pour déclencher le dropdown */}
                  <span></span>
                </Dropdown>
              )}
            </div>
          ),    
        }
      ],
      // render:(value)=><p className='text-sm'>{sortByMonth(value, "DECEMBRE") || "--"}</p>
    },
    // {
    //   title:"Total",
    //   dataIndex:"",
    //   fixed:"end",
    //   width:"100px",
    //   align: "center",
    //   // render:()=><p className='text-sm'>{totalPerYear(dataList)}</p>
    // },
    // {
    //   title:"Action",
    //   dataIndex:"",
    //   fixed:"right",
    //   width:"75px",
    //   render:(value, record)=>
    //     <DropdownMenu>
    //       <DropdownMenuTrigger asChild>
    //         <Button variant="ghost" className="h-8 w-8 p-0">
    //           <span className="sr-only">Open menu</span>
    //           <MoreHorizontal />
    //         </Button>
    //       </DropdownMenuTrigger>
    //       <DropdownMenuContent align="end">
    //         <DropdownMenuLabel>Actions</DropdownMenuLabel>

    //         <DropdownMenuSeparator />
            
    //         <VerifyPermission functions={permissions} roles={roles} expected={['']}>
    //           <DropdownMenuItem className="flex gap-2 items-center hover:bg-red-200 cursor-pointer" onClick={()=>handleDelete(record.id)}>
    //             <TrashIcon className='text-red-500 h-4 w-6'/>
    //             <span className='text-red-500'>Supprimer</span>
    //           </DropdownMenuItem>
    //         </VerifyPermission>
    //       </DropdownMenuContent>
    //     </DropdownMenu>
    // },
  ]
  
  return (
    <div className="w-full">
      <div className="py-2 px-4 w-full max-h-[50vh] h-[50vh]">
        <Form>
          <Table 
            footer={() => <div className='flex w-full justify-end'>{pagination}</div>}
            dataSource={dataList}
            columns={columns}
            bordered={true}
            scroll={{
                x: 500,
                y: "40vh"
            }}
            pagination={false}
            loading={loading}
            summary={() => (
              <Table.Summary fixed>
                <Table.Summary.Row>
                  {/* Première cellule : Titre "Total" */}
                  <Table.Summary.Cell index={0}>
                    <strong>Total</strong>
                  </Table.Summary.Cell>
      
                  {/* Deuxième cellule : Vide */}
                  <Table.Summary.Cell index={1}>
                    <strong></strong>
                  </Table.Summary.Cell>
      
                  {/* Cellules générées dynamiquement avec map */}
                  {months.map((item, index) => (
                    <React.Fragment key={index}>
                      <Table.Summary.Cell index={index * 2 + 2}>
                        <strong>{totals[item.month]?.estimatedAmount.toLocaleString()}F</strong>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={index * 2 + 3}>
                        <strong>{totals[item.month]?.realAmount.toLocaleString()}F</strong>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={index * 2 + 4}>
                        <strong>{totals[item.month]?.purchaseOrderAmount != null ? totals[item.month]?.purchaseOrderAmount.toLocaleString() : 0}F</strong>
                      </Table.Summary.Cell>
                    </React.Fragment>
                  ))}
                </Table.Summary.Row>
              </Table.Summary>
            )}
            rowKey="key"
          />
        </Form>
      </div>
    </div>
  )
}

export default Datalist