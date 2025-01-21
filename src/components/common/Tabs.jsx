import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useLocation , useNavigate } from "react-router-dom";


const Tabs = ({ links }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [activeTab, setActiveTab] = useState(pathname);

  useEffect(() => {
    setActiveTab(pathname);
  }, [pathname]);

  const handleTabClick = (link) => {
    if (link !== activeTab) {
      setActiveTab(link);
      navigate(link);
    }
  };

  // const entryLink = links.map(link => ({
  //   ...link,
  //   isActive: activeTab.includes(link.link) ? true : false,
  // }));
    
  return (
    <div className='flex gap-2 items-center whitespace-nowrap overflow-x-auto no-scrollbar'>
      {
        links.map((link, index) => (
          <div 
            key={index} 
            className={`px-2 p-1 rounded-full cursor-pointer text-xs font-semibold ${
              activeTab === link.link ? "bg-secondary text-white" : "border-[1px] border-gray-300"
            }`} 
            onClick={() => handleTabClick(link.link)}
          >
            {link.name}
          </div>
        ))
      }
    </div>
  );
  
};

export default Tabs;


Tabs.propTypes = {
  links: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired,
    })
  ).isRequired,
};

