
import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { PlusIcon } from "lucide-react";

const Dialogue = ({ header, content, footer, buttonText, isOpenned }) => {
  const [isOpen, setIsOpen] = useState(isOpenned || false);

  // Synchroniser avec la prop externe
  useEffect(() => {
    setIsOpen(isOpenned || false);
  }, [isOpenned]);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {buttonText && (
        <DialogTrigger asChild>
          <Button
            className="bg-primary hover:bg-secondary text-white font-semibold outline-none text-sm w-full md:w-auto"
            onClick={() => setIsOpen(true)}
            id="open-dialog"
          >
            <PlusIcon className="h-3 mr-2" />
            <span>{buttonText}</span>
          </Button>
        </DialogTrigger>
      )}
      
      <DialogContent>
        {header && (
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {typeof header === 'string' ? header : header}
            </DialogTitle>
          </DialogHeader>
        )}
        
        {content && React.isValidElement(content) 
          ? React.cloneElement(content, { onClose: handleClose })
          : content
        }
        
        {footer && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
};

export default Dialogue;

// import React, { useState, useEffect } from "react";
// import { Button } from "../ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "../ui/dialog";
// import { PlusIcon } from "lucide-react";
// import { WrenchScrewdriverIcon } from "@heroicons/react/24/outline";
// import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

// const Dialogue = ({ 
//   header, 
//   content, 
//   footer, 
//   buttonText, 
//   isOpenned = false,
//   onOpenChange, // Nouvelle prop optionnelle
//   buttonVariant = "default", // Nouvelle prop optionnelle
//   buttonClassName = "", // Nouvelle prop optionnelle
//   dialogClassName = "", // Nouvelle prop optionnelle
//   children, // Pour la compatibilité future
//   ...props // Pour capturer toutes les autres props
// }) => {
//   const [isOpen, setIsOpen] = useState(isOpenned);

//   // Synchroniser avec la prop externe isOpenned
//   useEffect(() => {
//     setIsOpen(isOpenned);
//   }, [isOpenned]);

//   const handleOpenChange = (open) => {
//     setIsOpen(open);
//     if (onOpenChange) {
//       onOpenChange(open);
//     }
//   };

//   const handleClose = () => {
//     handleOpenChange(false);
//   };

//   // Vérifier si content est un élément React valide
//   const renderContent = () => {
//     if (!content) {
//       return <div className="p-4">Aucun contenu fourni</div>;
//     }

//     if (React.isValidElement(content)) {
//       // Vérifier si l'élément accepte une prop onClose
//       try {
//         return React.cloneElement(content, { onClose: handleClose });
//       } catch (error) {
//         console.warn("Erreur lors du clonage du contenu:", error);
//         return content;
//       }
//     }

//     // Si content n'est pas un élément React, l'afficher tel quel
//     return <div className="p-4">{content}</div>;
//   };

//   // Déterminer le bouton à afficher
//   const renderButton = () => {
//     const baseClasses = "font-semibold outline-none text-sm w-full md:w-auto";
//     const variantClasses = {
//       default: "bg-primary hover:bg-secondary text-white",
//       outline: "bg-white hover:bg-gray-100 text-primary border border-primary",
//       ghost: "bg-transparent hover:bg-gray-100 text-primary",
//     };

//     return (
//       <Button
//         className={`${baseClasses} ${variantClasses[buttonVariant]} ${buttonClassName}`}
//         onClick={() => handleOpenChange(true)}
//         id="open-dialog"
//         {...props}
//       >
//         <PlusIcon className="h-3" />
//         <span>{buttonText || "Ouvrir"}</span>
//       </Button>
//     );
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={handleOpenChange}>
//       {buttonText && <DialogTrigger asChild>{renderButton()}</DialogTrigger>}
      
//       <DialogContent className={dialogClassName}>
//         {/* ✅ Un vrai titre pour l’accessibilité */}
//         <VisuallyHidden>
//           <DialogTitle>{buttonText || "Dialogue"}</DialogTitle>
//         </VisuallyHidden>

//         {/* Header visuel (si fourni) */}
//         {header && (
//           <DialogHeader>
//             {typeof header === 'string' ? (
//               <DialogTitle>{header}</DialogTitle>
//             ) : (
//               header
//             )}
//           </DialogHeader>
//         )}

//         {/* Le contenu principal */}
//         {renderContent()}

//         {/* Children (pour les cas où on passe le contenu comme enfants) */}
//         {children}

//         {/* Footer si présent */}
//         {footer && <DialogFooter>{footer}</DialogFooter>}
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default Dialogue;


// import React, { useState } from "react";
// import { Button } from "../ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "../ui/dialog";
// import { PlusIcon } from "lucide-react";
// import { WrenchScrewdriverIcon } from "@heroicons/react/24/outline";
// import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

// const Dialogue = ({ header, content, footer, buttonText, isOpenned }) => {
//   const [isOpen, setIsOpen] = useState(isOpenned);

//   const handleClose = () => {
//     setIsOpen(false);
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={setIsOpen}>
//       <DialogTrigger asChild>
//         <Button
//           className="bg-primary hover:bg-secondary text-white font-semibold outline-none text-sm w-full md:w-auto"
//           onClick={() => setIsOpen(!isOpenned)}
//           id="open-dialog"
//         >
//           <PlusIcon className="h-3" />
//           <span>{buttonText}</span>
//         </Button>
//       </DialogTrigger>

//       <DialogContent>
//         {/* ✅ Un vrai titre pour l’accessibilité */}
//         <VisuallyHidden>
//           <DialogTitle>{buttonText || "Dialogue"}</DialogTitle>
//         </VisuallyHidden>

//         {/* Ton header visuel (si tu en passes un en props) */}
//         {header && <DialogHeader>{header}</DialogHeader>}

//         {/* Le contenu, auquel on injecte une prop onClose */}
//         {React.cloneElement(content, { onClose: handleClose })}

//         {/* Footer si présent */}
//         {footer && <DialogFooter>{footer}</DialogFooter>}
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default Dialogue;
