import { Search } from "lucide-react"
import { Input } from "../ui/input"


export const SearchComponent = () => {
    return (
        <>
            <div className="hidden md:block">
                <form className="relative">
                    <Input type="text" placeholder="Search..." className="rounded-full bg-slate-700 lg:min-w-64 z-10" />
                    <Search className="absolute text-muted-foreground z-20 hover:text-foreground cursor-pointer w-5 h-5 right-3 top-[calc(50%-10px)] transition-all duration-300" />
                </form>
            </div>

            <div className="md:hidden">
                <Search className="text-muted-foreground z-20 hover:text-foreground cursor-pointer w-5 h-5 transition-all duration-300" />
            </div>
        </>
    )
}