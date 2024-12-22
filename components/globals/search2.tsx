import { Search, X } from "lucide-react"
import { Input } from "../ui/input"
import { useEffect, useState } from "react"

interface props{
    setSearch: React.Dispatch<React.SetStateAction<string>>,
    search: string
}
export const SearchComponent2 = ({setSearch, search}: props) => {
    const [q, setQ] = useState(search || '')
    
    useEffect(() => {
        const timeout = setTimeout(() => setSearch(q), 600)
        return () => clearTimeout(timeout)
    }, [q])

    useEffect(() => {
        if(search === ''){
            setQ('')
        }
    }, [search])

    return (
        <>
            <form className="min-w-32 relative flex-1 md:max-w-64">
                <Input type="text" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search..." className="rounded-lg bg-secondary/50 z-10 border border-slate-600" />
                {q === '' ? (
                    <Search className="absolute text-muted-foreground z-20 hover:text-foreground cursor-pointer w-5 h-5 right-3 top-[calc(50%-10px)] transition-all duration-300" />
                ): (
                    <X className="absolute text-muted-foreground z-20 hover:text-foreground cursor-pointer w-5 h-5 right-3 top-[calc(50%-10px)] transition-all duration-300" onClick={() => setQ('')} />
                )}
            </form>

        </>
    )
}