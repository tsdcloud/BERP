import React, { useEffect } from 'react'
import { useFetch } from '../../hooks/useFetch'
import { Button } from '../ui/button';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "../ui/pagination"

const CustomPagination = ({onNext, onPrev, totalPages}) => {
    const [currentPage, setCurrentPage] = React.useState(1);

    const handlePageClick = (page) => {
        setCurrentPage(page);
        // Call onNext or onPrev based on the page clicked
        if (page > currentPage) {
            onNext();
        } else {
            onPrev();
        }
    };

    const renderPaginationItems = () => {
        const items = [];
        for (let i = 1; i <= totalPages; i++) {
            if (i <= 5 || i === totalPages || (currentPage <= 5 && i < currentPage + 1) || (currentPage > totalPages - 5 && i > totalPages - 5)) {
                items.push(
                    <PaginationItem key={i} className="w-[50] p-1 rounded-lg border">
                        <button className="" onClick={() => handlePageClick(i)}>{i}</button>
                    </PaginationItem>
                );
            } else if (i === 6 || i === totalPages - 4) {
                items.push(<PaginationEllipsis key={`ellipsis-${i}`} />);
            }
        }
        return items;
    };

    useEffect(()=>{
        console.log(totalPages)
    }, []);
    return(
        <div>
            <Pagination>
                <PaginationContent>
                    {renderPaginationItems()}
                </PaginationContent>
            </Pagination>
        </div>
    )
}

export default CustomPagination