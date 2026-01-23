// utils/equipment.utils.js
export const getEquipmentDomain = (equipement) => {
    if (!equipement) {
        return null;
    }
    
    const equipmentObj = Array.isArray(equipement) ? equipement[0] : equipement;
    
    if (equipmentObj && equipmentObj.equipmentGroup && equipmentObj.equipmentGroup.equipmentGroupFamily) {
        return equipmentObj.equipmentGroup.equipmentGroupFamily.domain;
    }
    
    // Alternative si la structure est différente
    if (equipmentObj && equipmentObj.domain) {
        return equipmentObj.domain;
    }
    
    return null;
};