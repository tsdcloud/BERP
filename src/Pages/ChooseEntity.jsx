import React from 'react';
import Footer from '../components/layout/Footer';
import Preloader from '../components/Preloader';
// import { useHistory } from 'react-router-dom';

export default function ChooseEntity() {
    // const history = useHistory();
    document.title = "Choisir une entité";

    const handleEntitySelection = (entity) => {
      // Logique pour gérer la sélection de l'entité
      console.log("Entité sélectionnée :", entity);
      // Rediriger vers le tableau de bord après la sélection
      history.push('/dashboard');
    };
  
    return (
        <>
        <div className="bg-gradient-to-t from-blue-200 to-white-100 min-h-screen py-12 px-4 text-center">
          <div className="max-w-4xl mx-auto">
            {/* Top Section */}
            <div className="mb-6">
              <div className="flex justify-center items-center space-x-2 text-sm text-gray-600">
                <span className="flex items-center space-x-1">
                  <span className="text-center font-mono font-bold text-blue-900">Business Entreprise Resource Planning</span>
                </span>
              </div>
            </div>
    
            {/* Title Section */}
            <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-800">
              Choisissez <span className="text-green-700">l'entité</span> avec laquelle vous voulez intéragir.
            </h1>
    
            {/* Subtitle */}
            <p className="mt-4 text-gray-600 text-sm">
              Définissez une entité pour accéder à vos applications métiers.
            </p>
    
            {/* Buttons */}
            <div className="mt-8 flex justify-center items-center space-x-4">
              <button
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700"
              >
                Bfc
              </button>
              <button
                className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg shadow-lg hover:bg-gray-300"
                >
                DPWS
              </button>
            </div>
          </div>
        </div>
                  {/* <Preloader className="w-10 h-5"/> */}
        
        </>
      );
};
