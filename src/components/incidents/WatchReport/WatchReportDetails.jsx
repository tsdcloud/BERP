// Ce composant est un wrapper qui utilise ReportingCgDetails avec type="watch"
// Il permet de réutiliser le même composant pour l'affichage des détails d'un Watch Report.
import React from 'react';
import ReportingCgDetails from '../ReportingCg/ReportingCgDetails';

const WatchReportDetails = (props) => {
    // On passe type="watch" et embedded={false} par défaut (ou on laisse l'appelant décider)
    return <ReportingCgDetails {...props} type="watch" />;
};

export default WatchReportDetails;