// import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
// import { Skeleton } from "../ui/skeleton";
// import { Button } from '../ui/button';
// import Preloader from '../Preloader';

// const AutoComplete = forwardRef(({
//   placeholder = "Type to search...",
//   isLoading = true,
//   dataList = [],
//   onSearch,
//   clearDependency = [],
//   onSelect,
//   register = {},
//   inputName,
//   validation = {},
//   error = false,
//   errorMessage
// }, ref) => {
//   const [value, setValue] = useState("");
//   const [showOptions, setShowOptions] = useState(false);
//   const autocompleteRef = useRef();
//   const autocompleteInputRef = useRef(null);
//   const [isFocused, setIsFocused] = useState(false);

//   const handleOnChange = (e) => {
//     const inputValue = e.target.value;
//     setValue(inputValue);
//     onSearch(inputValue);
//     if (inputValue === "") {
//       onSelect(null);
//     }
//   };

//   const handleSelect = (item) => {
//     setValue(item.name);
//     onSelect(item);
//     setShowOptions(false);
//   };

//   useImperativeHandle(ref, () => ({
//     clear: () => {
//       setValue("");
//       onSelect(null);
//     }
//   }));

//   const clearValue = () => {
//     setValue("");
//     onSelect(null);
//   };

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         autocompleteRef.current &&
//         !autocompleteRef.current.contains(event.target)
//       ) {
//         setShowOptions(false);
//         setIsFocused(false);
//       }
//     };

//     document.addEventListener("click", handleClickOutside);
//     return () => {
//       document.removeEventListener("click", handleClickOutside);
//     };
//   }, []);

//   useEffect(() => {
//     setValue("");
//   }, [...clearDependency]); 

//   useEffect(() => {
//     if (isFocused && autocompleteInputRef.current) {
//       autocompleteInputRef.current.focus();
//     }
//   }, [isLoading, isFocused]);

//   return (
//     <div className="w-full">
//         <div className="w-full p-2 bg-white relative" ref={autocompleteRef}>
//           <div className="relative">
//             <input
//                 className={`w-full p-2 rounded-md border text-sm ${error ? "outline-[2px] outline-red-500 ring-2 ring-red-500" : "outline-[1px] outline-blue-300"}`}
//                 placeholder={placeholder}
//                 value={value}
//                 ref={autocompleteInputRef}
//                 onFocus={() => {
//                   setShowOptions(true);
//                   setIsFocused(true);
//                 }}
//                 onChange={handleOnChange}
//                 register
//             />
//             {isLoading && (
//               <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
//                 <Preloader size={20} />
//               </div>
//             )}
//           </div>
//           {showOptions && (
//               <div className="bg-white shadow-xl border-[1px] rounded-sm p-2 absolute w-[97%] transition-all space-y-2 max-h-[100px] overflow-scroll z-[30] mr-3">
//               {dataList.map((item, index) => (
//                   <div
//                   key={index}
//                   className="w-full hover:bg-slate-100 p-2 transition-all cursor-pointer text-xs font-semibold rounded-sm capitalize"
//                   onClick={() => handleSelect(item)}
//                   >
//                   <span>{item.name}</span>
//                   </div>
//               ))}
//               </div>
//           )}
//           {errorMessage}
//         </div>
//     </div>
//   );
// });

// export default AutoComplete;


import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import { Skeleton } from "../ui/skeleton";
import { Button } from '../ui/button';
import Preloader from '../Preloader';

const AutoComplete = forwardRef(({
  placeholder = "Type to search...",
  isLoading = false, // Changé à false par défaut
  dataList = [],
  onSearch,
  clearDependency = [],
  onSelect,
  register = {},
  inputName,
  validation = {},
  error = false,
  errorMessage,
  initialValue = null, // Nouvelle prop optionnelle
  allowClear = true, // Nouvelle prop pour gérer l'effacement
  onClear, // Nouvelle prop callback pour l'effacement
  className = "", // Nouvelle prop pour les classes CSS personnalisées
  disabled = false, // Nouvelle prop pour désactiver
  ...props // Pour capturer toutes les autres props
}, ref) => {
  const [value, setValue] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const autocompleteRef = useRef();
  const autocompleteInputRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [initialValueSet, setInitialValueSet] = useState(false);

  // Initialiser avec la valeur initiale
  useEffect(() => {
    if (initialValue && !initialValueSet) {
      if (typeof initialValue === 'object' && initialValue.name) {
        setValue(initialValue.name);
        // Appeler onSelect avec la valeur initiale si elle n'est pas déjà sélectionnée
        setTimeout(() => {
          if (onSelect && initialValue.value) {
            onSelect(initialValue);
          }
        }, 0);
      } else if (typeof initialValue === 'string') {
        setValue(initialValue);
      }
      setInitialValueSet(true);
    }
  }, [initialValue, initialValueSet, onSelect]);

  // Gérer le changement d'initialValue externe
  useEffect(() => {
    if (initialValue) {
      if (typeof initialValue === 'object' && initialValue.name) {
        setValue(initialValue.name);
      } else if (typeof initialValue === 'string') {
        setValue(initialValue);
      }
    } else if (initialValue === null || initialValue === '') {
      setValue("");
    }
  }, [initialValue]);

  const handleOnChange = (e) => {
    const inputValue = e.target.value;
    setValue(inputValue);
    
    // Appeler onSearch seulement si onSearch est défini
    if (onSearch) {
      onSearch(inputValue);
    }
    
    if (inputValue === "") {
      if (onSelect) {
        onSelect(null);
      }
    }
  };

  const handleSelect = (item) => {
    if (item) {
      setValue(item.name);
      if (onSelect) {
        onSelect(item);
      }
    }
    setShowOptions(false);
    setIsFocused(false);
  };

  // Exposer des méthodes via ref
  useImperativeHandle(ref, () => ({
    clear: () => {
      setValue("");
      if (onSelect) {
        onSelect(null);
      }
      if (onClear) {
        onClear();
      }
      setInitialValueSet(false);
    },
    setValue: (newValue) => {
      if (typeof newValue === 'object' && newValue.name) {
        setValue(newValue.name);
        if (onSelect) {
          onSelect(newValue);
        }
      } else if (typeof newValue === 'string') {
        setValue(newValue);
      }
    },
    getValue: () => value,
    focus: () => {
      if (autocompleteInputRef.current) {
        autocompleteInputRef.current.focus();
      }
    },
    blur: () => {
      if (autocompleteInputRef.current) {
        autocompleteInputRef.current.blur();
      }
    }
  }));

  const clearValue = () => {
    setValue("");
    if (onSelect) {
      onSelect(null);
    }
    if (onClear) {
      onClear();
    }
    setInitialValueSet(false);
  };

  // Gérer le clic à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        autocompleteRef.current &&
        !autocompleteRef.current.contains(event.target)
      ) {
        setShowOptions(false);
        setIsFocused(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Effacer la valeur selon les dépendances
  useEffect(() => {
    setValue("");
  }, [...clearDependency]);

  // Focus sur l'input quand il est activé
  useEffect(() => {
    if (isFocused && autocompleteInputRef.current && !disabled) {
      autocompleteInputRef.current.focus();
    }
  }, [isLoading, isFocused, disabled]);

  // Gérer le register de react-hook-form si fourni
  const registerProps = register && typeof register === 'function' 
    ? register(inputName || 'autocomplete', validation) 
    : {};

  return (
    <div className={`w-full ${className}`} {...props}>
      <div className="w-full p-2 bg-white relative" ref={autocompleteRef}>
        <div className="relative">
          <input
            className={`w-full p-2 rounded-md border text-sm ${error ? "outline-[2px] outline-red-500 ring-2 ring-red-500" : "outline-[1px] outline-blue-300"} ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
            placeholder={placeholder}
            value={value}
            ref={(node) => {
              autocompleteInputRef.current = node;
              // Gérer la ref pour react-hook-form
              if (register && typeof register === 'function' && node) {
                const { ref, ...rest } = register(inputName || 'autocomplete', validation);
                if (ref) {
                  ref(node);
                }
              }
            }}
            onFocus={() => {
              if (!disabled) {
                setShowOptions(true);
                setIsFocused(true);
                // Lancer une recherche vide pour charger les options
                if (onSearch && value === "") {
                  onSearch("");
                }
              }
            }}
            onChange={handleOnChange}
            disabled={disabled}
            {...(register && typeof register === 'object' ? register : registerProps)}
          />
          
          {/* Bouton d'effacement */}
          {allowClear && value && !isLoading && (
            <button
              type="button"
              className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={clearValue}
              disabled={disabled}
            >
              ✕
            </button>
          )}
          
          {/* Indicateur de chargement */}
          {isLoading && (
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <Preloader size={20} />
            </div>
          )}
        </div>
        
        {/* Options de l'autocomplete */}
        {showOptions && dataList.length > 0 && !disabled && (
          <div className="bg-white shadow-xl border-[1px] rounded-sm p-2 absolute w-full transition-all space-y-2 max-h-[200px] overflow-y-auto z-[30] mt-1">
            {dataList.map((item, index) => (
              <div
                key={`${item.value}-${index}`}
                className="w-full hover:bg-slate-100 p-2 transition-all cursor-pointer text-xs font-semibold rounded-sm capitalize"
                onClick={() => handleSelect(item)}
              >
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        )}
        
        {/* Message d'erreur */}
        {error && errorMessage && (
          <p className="text-xs text-red-500 mt-1">{errorMessage}</p>
        )}
        
        {/* Aucun résultat */}
        {showOptions && dataList.length === 0 && !isLoading && !disabled && (
          <div className="bg-white shadow-xl border-[1px] rounded-sm p-2 absolute w-full transition-all z-[30] mt-1">
            <p className="text-xs text-gray-500 text-center p-2">Aucun résultat</p>
          </div>
        )}
      </div>
    </div>
  );
});

// Ajout d'un nom pour le composant (utile pour le débogage)
AutoComplete.displayName = "AutoComplete";

export default AutoComplete;
