import React, { useEffect, useRef, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { Button } from '../ui/button';


const AutoComplete = ({
  placeholder = "Type to search...",
  isLoading = false,
  dataList = [],
  onSearch,
  onSelect,
  register,
  inputName,
  validation = {},
}) => {
  const [value, setValue] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const autocompleteRef = useRef();

  const handleOnChange = (e) => {
    const inputValue = e.target.value;
    setValue(inputValue);
    onSearch(inputValue);
    if (inputValue === "") {
      onSelect(null);
    }
  };

  const handleSelect = (item) => {
    setValue(item.name);
    onSelect(item);
    setShowOptions(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        autocompleteRef.current &&
        !autocompleteRef.current.contains(event.target)
      ) {
        setShowOptions(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return isLoading ? (
    <Skeleton className="h-4 w-full p-2" />
  ) : (
    <div className="w-full">
        <div className="w-full p-2 bg-white relative" ref={autocompleteRef}>
          <input
              className="w-full p-1 rounded-md border"
              placeholder={placeholder}
              value={value}
              onFocus={() => setShowOptions(true)}
              onChange={handleOnChange}
              {...(register && register(inputName, validation))}
          />
        {showOptions && (
            <div className="bg-white shadow-lg rounded-sm p-2 absolute w-[97%] transition-all space-y-2 max-h-[100px] overflow-scroll z-[30] mr-3">
            {dataList.map((item, index) => (
                <div
                key={index}
                className="w-full hover:bg-slate-100 p-2 transition-all cursor-pointer text-sm rounded-sm capitalize"
                onClick={() => handleSelect(item)}
                >
                {item.name}
                </div>
            ))}
            </div>
        )}
        </div>
    </div>
  );
};

export default AutoComplete;
