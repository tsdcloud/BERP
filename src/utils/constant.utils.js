export const INCIDENT_STATUS = {
    PENDING:"En Attente",
    CLOSED:"Cloturé",
    UNDER_MAINTENANCE:"En maintenance"
}

export const INTERVENANT = [
  {
    name:"Prestataire",
    value:"SUPPLIER"
  },
  {
    name:"Employer",
    value:"EMPLOYEE"
  }
]

export const OPERATIONS = [
  {
    value: "IMPORT",
    name:"IMPORT"
  },
  {
    value:"EXPORT",
    name:"EXPORT"
  },
  {
    value:"TRANSIT",
    name:"TRANSIT"
  },
  {
    value:"OTHERS",
    name:"AUTRES"
  }
]

export const DECLARATION_TYPES = [
  {
    value: "CONTAINER",
    name:"CONTENEURISE"
  },
  {
    value:"BULK",
    name:"VRAC"
  },
  {
    value:"CONVENTIONAL_WOOD_LOG",
    name:"BOIS CONVENTIONNEL GRUME"
  },
  {
    value:"HEAVY_BULK",
    name:"COLLIS LOURDS"
  },
  {
    value:"CONVENTIONAL_LUMBER",
    name:"BOIS CONVENTIONNEL DEBITE"
  },
]

export const FACTURATION_TYPES = [
  {
    value: "MOBILE",
    name:"MOBILE"
  },
  {
    value:"CASH",
    name:"ESPECE"
  },
  {
    value:"BILLABLE",
    name:"A FACTURES"
  },
]

export const INCIDENT_CATEGORY = [
  {
    value: "PORTUARY",
    name:"PORTUARY"
  },
  {
    value:"ADMINISTRATIVE",
    name:"ADMINISTRATIVE"
  }
]

export const SITE_TYPE = {
  FIELD:"FIELD",
  HEADQUARTER:"HEADQUARTER"
}