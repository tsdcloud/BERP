import React, { useEffect, useRef, useState } from "react";
import { useFormContext, Controller } from 'react-hook-form';
import { Skeleton } from "../ui/skeleton";
import { Button } from '../ui/button';


const AutoCompleteSelect = ({
  placeholder = "Type to search...",
  isLoading = false,
  dataList = [],
  onSearch,
  clearDependency=[],
  onSelect,
  register,
  inputName,
  validation = {},
  name, 
  label,
  type = 'text', 
  rules = {} 
}) => {
  const [value, setValue] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const autocompleteRef = useRef();
  const autocompleteInputRef = useRef(null);

  const { control } = useFormContext();

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

  useEffect(() => {
    setValue("");
  }, [...clearDependency]); 

  return isLoading ? (
    <Skeleton className="h-4 w-full p-2" />
  ) : (
    <div className="w-full">
        <Controller 
            name={name}
            control={control}
            rules={rules}
            render={({ field, fieldState: { error } })=>(
                <div className="w-full p-2 bg-white relative" ref={autocompleteRef}>
                {error && <span className="text-red-500 text-xs">{error.message}</span>}
                <input
                    className="w-full p-2 rounded-md border text-sm outline-[1px] outline-blue-300"
                    placeholder={placeholder}
                    value={value}
                    ref={autocompleteInputRef}
                    onFocus={() => setShowOptions(true)}
                    onChange={handleOnChange}
                    type={type}
                    id={name}
                    aria-invalid={error ? "true" : "false"}
                    register
                />
                {showOptions && (
                    <div className="bg-white shadow-lg rounded-sm p-2 absolute w-[97%] transition-all space-y-2 max-h-[100px] overflow-scroll z-[30] mr-3">
                    {dataList.map((item, index) => (
                        <div
                        key={index}
                        className="w-full hover:bg-slate-100 p-2 transition-all cursor-pointer text-xs rounded-sm capitalize"
                        onClick={() => handleSelect(item)}
                        >
                        {item.name}
                        </div>
                    ))}
                    </div>
                )}
                </div>
            )}
        />
    </div>
  );
};

export default AutoCompleteSelect;
