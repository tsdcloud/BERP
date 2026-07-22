// import { useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
// import { useLocation , useNavigate } from "react-router-dom";


// const Tabs = ({ links }) => {
//   const navigate = useNavigate();
//   const { pathname } = useLocation();

//   const [activeTab, setActiveTab] = useState(pathname);

//   useEffect(() => {
//     setActiveTab(pathname);
//   }, [pathname]);

//   const handleTabClick = (link) => {
//     if (link !== activeTab) {
//       setActiveTab(link);
//       navigate(link);
//     }
//   };
    
//   return (
//     <div className='flex gap-2 items-center whitespace-nowrap overflow-x-auto no-scrollbar'>
//       {
//         links.map((link, index) => (
//           <div
//             key={index} 
//             className={`px-2 p-1 rounded-full cursor-pointer text-xs font-semibold ${
//               activeTab === link.link ? "bg-secondary text-white" : "border-[1px] border-gray-300"
//             }`}
//             onClick={() => handleTabClick(link.link)}
//           >
//             {link.name}
//           </div>
//         ))
//       }
//     </div>
//   );
  
// };

// export default Tabs;


// Tabs.propTypes = {
//   links: PropTypes.arrayOf(
//     PropTypes.shape({
//       name: PropTypes.string.isRequired,
//       link: PropTypes.string.isRequired,
//     })
//   ).isRequired,
// };


import { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const Tabs = ({ links }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [activeTab, setActiveTab] = useState(pathname);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const tabsContainerRef = useRef(null);
  const activeTabRef = useRef(null);

  useEffect(() => {
    setActiveTab(pathname);
  }, [pathname]);

  const handleTabClick = (link) => {
    if (link !== activeTab) {
      setActiveTab(link);
      navigate(link);
    }
  };

  const checkScroll = () => {
    if (tabsContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scrollLeft = () => {
    if (tabsContainerRef.current) {
      tabsContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (tabsContainerRef.current) {
      tabsContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  const scrollToActiveTab = () => {
    if (activeTabRef.current && tabsContainerRef.current) {
      const container = tabsContainerRef.current;
      const activeTabElement = activeTabRef.current;
      const containerWidth = container.clientWidth;
      const activeTabLeft = activeTabElement.offsetLeft;
      const activeTabWidth = activeTabElement.offsetWidth;

      const scrollPosition = activeTabLeft - (containerWidth / 2) + (activeTabWidth / 2);
      container.scrollTo({ left: scrollPosition, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    checkScroll();
    scrollToActiveTab();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [activeTab, links]); // Recalcule quand l'onglet actif change

  return (
    <div className="relative overflow-y-hidden">
      <div className="flex items-center">
        {showLeftArrow && (
          <button
            onClick={scrollLeft}
            className="absolute left-0 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-md"
          >
            <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
          </button>
        )}

        <div
          ref={tabsContainerRef}
          className="flex gap-2 items-center whitespace-nowrap overflow-x-auto overflow-y-hidden no-scrollbar px-8"
          onScroll={checkScroll}
        >
          {links.map((link, index) => (
            <div
              key={index}
              ref={activeTab === link.link ? activeTabRef : null}
              className={`px-2 p-1 rounded-full cursor-pointer text-xs font-semibold ${
                activeTab === link.link ? 'bg-secondary text-white' : 'border-[1px] border-gray-300'
              }`}
              onClick={() => handleTabClick(link.link)}
            >
              {link.name}
            </div>
          ))}
        </div>

        {showRightArrow && (
          <button
            onClick={scrollRight}
            className="absolute right-0 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-md"
          >
            <ChevronRightIcon className="h-5 w-5 text-gray-600" />
          </button>
        )}
      </div>
    </div>
  );
};

Tabs.propTypes = {
  links: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default Tabs;