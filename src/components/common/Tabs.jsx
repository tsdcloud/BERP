import { useState } from 'react';
import PropTypes from 'prop-types';
import { useLocation , useNavigate } from "react-router-dom";


const Tabs = ({ links }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [activeTab, setActiveTab] = useState(pathname);

  const handleTabClick = (link) => {
    setActiveTab(link);
    navigate(link);
  };

  const entryLink = links.map(link => ({
    ...link,
    isActive: activeTab.includes(link.link) ? true : false,
  }));
    
  return (
    <div className='flex gap-2 items-center'>
        {
            entryLink.map((link, index) => (
              <div 
                key={index} 
                className={`text-xs px-2 p-1 ${link?.isActive ? "bg-secondary text-white" : "border-[1px] border-gray-300"} rounded-full cursor-pointer text-xs font-semibold`} 
                onClick={() => handleTabClick(link.link)}
                >
                  {link?.name}
              </div>
              ))}
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