"use client"

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";

interface Props {
    totalPages: number;
    currentPage: number;
    setPage: React.Dispatch<React.SetStateAction<number>>,
    setLimit: React.Dispatch<React.SetStateAction<number>>,

}

export const PaginationComponent = ({ totalPages, currentPage, setLimit, setPage }: Props) => {

    const onPageChange = (num: number) => {
        setPage(num)
    }

    const generatePageNumbers = () => {
        const pageNumbers: (number | string)[] = [];

        if (totalPages <= 4) {
            // If total pages are 4 or less, show all pages
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            pageNumbers.push(1);

            if (currentPage > 3) {
                pageNumbers.push("...");
            }

            const startPage = Math.max(2, currentPage - 1);
            const endPage = Math.min(totalPages - 1, currentPage + 1);

            for (let i = startPage; i <= endPage; i++) {
                pageNumbers.push(i);
            }

            if (currentPage < totalPages - 2) {
                pageNumbers.push("...");
            }
            pageNumbers.push(totalPages);
        }

        return pageNumbers;
    };

    return (
        <Pagination className="flex-wrap justify-end gap-2">
            {/* page size select */}
            <Select onValueChange={(val) => setLimit(+val)}>
                <SelectTrigger role="button" className="w-[80px] lg:w-[100px] h-8 bg-secondary/50 border border-slate-600 hover:bg-secondary transition-all duration-200">
                    <SelectValue placeholder="Limit.." />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="30">30</SelectItem>
                        <SelectItem value="40">40</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
            {/* page size select end */}
            <PaginationContent>
                {currentPage > 1 && (
                    <PaginationItem>
                        <PaginationPrevious size="sm" role="button" onClick={() => onPageChange(currentPage - 1)} />
                    </PaginationItem>
                )}
                {generatePageNumbers().map((page, index) => (
                    <PaginationItem key={index}>
                        {typeof page === "number" ? (
                            <PaginationLink
                                size="sm"
                                role="button"
                                isActive={currentPage === page}
                                onClick={() => onPageChange(page)}
                            >
                                {page}
                            </PaginationLink>
                        ) : (
                            <>..</>
                        )}
                    </PaginationItem>
                ))}
                {currentPage < totalPages && (
                    <PaginationItem>
                        <PaginationNext size="sm" role="button" onClick={() => onPageChange(currentPage + 1)} />
                    </PaginationItem>
                )}
            </PaginationContent>
        </Pagination>
    );
}
