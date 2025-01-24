import React, { useEffect } from 'react'
import { useFetch } from '../../hooks/useFetch'
import { Button } from '../ui/button';

const Pagination = ({handleNext, handlePrev, totalPages, link, setList}) => {

    const { handleFetch } = useFetch();

    const onPageClicked=async(page)=>{
        let url = `${link}?page=${page}`;
        try {
            const response = await handleFetch(url);
            if(!response.error){
                setList(response.data);
                return;
            }
            console.log(response);
        } catch (error) {
            alert("Error. Erreur lors de la requete");
        }
    }

    const handlePages=()=>{
        const items = [];
        for(let i = 1; i <= totalPages; i++){
            items.push(<li key={i}>{i}</li>);
        }
        return (
            items.map((item, index)=>{
                return <li 
                    key={index} 
                    className='p-2 rounded-lg border text-sm cursor-pointer' 
                    onClick={()=>onPageClicked(item.props.children)}
                >{item}
                </li>}
            )
        )
    }

    const pagesArray = Array(totalPages).fill().map((_, index)=>index+1);
  return (
    <div className='flex items-center gap-2 justify-end px-3'>
        <Button className='bg-primary text-white font-bold text-xs'>Prev</Button>
        <ul className='flex items-center gap-2'>
            {pagesArray.map((item, index)=><li 
                    key={index} 
                    className='p-2 rounded-lg border text-sm cursor-pointer' 
                    onClick={()=>onPageClicked(item)}>{item}
                </li>)}
        </ul>
        <Button className='bg-primary text-white font-bold text-xs'>Next</Button>
    </div>
  )
}

export default Pagination