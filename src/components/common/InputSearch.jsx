import React, {useState, useEffect} from 'react'

const InputSearch = ({placeholder, link, data=[], }) => {
    const [search, setSearch] = useState("");

    const handleSearch = async (event)=>{
        setSearch(event.target.value);
        let response = await fetch()
    }
    useEffect(()=>{
    }, [search]);
  return (
    <div>
        <input 
            className={`p-2 rounded-lg border m-2 text-sm`} 
            placeholder={placeholder || "Recherche"}
            value={search}
            onChange={handleSearch}
        />
    </div>
  )
}

export default InputSearch


 