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
        <div className="bg-gradient-to-b from-green-100 to-transparent min-h-screen py-12 px-4 text-center">
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
                className="px-9 py-3 border outline outline-blue-900 font-semibold rounded-lg shadow-sm hover:bg-blue-600 hover:text-white"
              >
                Bfc
              </button>
              <button
                className="px-9 py-3 border outline outline-green-700 text-green-900 font-semibold rounded-lg shadow-sm hover:bg-green-700 hover:text-white"
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
