import React, { useEffect, useRef, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { Button } from '../ui/button';


const AutoComplete = ({
  placeholder = "Type to search...",
  isLoading = true,
  dataList = [],
  onSearch,
  clearDependency=[],
  onSelect,
  register={},
  inputName,
  validation = {},
  error= false,
  errorMessage
}) => {
  const [value, setValue] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const autocompleteRef = useRef();
  const autocompleteInputRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

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
        setIsFocused(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setValue("");
  }, [...clearDependency]); 

  useEffect(() => {
    if (isFocused && autocompleteInputRef.current) {
      autocompleteInputRef.current.focus();
    }
  }, [isLoading, isFocused]);

  return isLoading ? (
    <div className="w-full p-2 relative flex items-center">
      <Skeleton className="w-full p-2 h-[40px] border" />
      <p className="absolute text-sm text-gray-500 animated-fade animated-infinite mx-4">Chargement...</p>
    </div>
  ) : (
    <div className="w-full">
        <div className="w-full p-2 bg-white relative" ref={autocompleteRef}>
          <input
              className={`w-full p-2 rounded-md border text-sm ${error ? "outline-[2px] outline-red-500 ring-2 ring-red-500" : "outline-[1px] outline-blue-300"}`}
              placeholder={placeholder}
              value={value}
              ref={autocompleteInputRef}
              onFocus={() => {
                setShowOptions(true);
                setIsFocused(true);
              }}
              onChange={handleOnChange}
              register
          />
        {showOptions && (
            <div className="bg-white shadow-xl border-[1px] rounded-sm p-2 absolute w-[97%] transition-all space-y-2 max-h-[100px] overflow-scroll z-[30] mr-3">
            {dataList.map((item, index) => (
                <div
                key={index}
                className="w-full hover:bg-slate-100 p-2 transition-all cursor-pointer text-xs font-semibold rounded-sm capitalize"
                onClick={() => handleSelect(item)}
                >
                <span>{item.name}</span>
                </div>
            ))}
            </div>
        )}
        {errorMessage}
        </div>
    </div>
  );
};

export default AutoComplete;
