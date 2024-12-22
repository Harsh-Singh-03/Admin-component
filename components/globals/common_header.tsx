import { BreadcrumbDemo } from "./bread_crumb"

interface HeaderProps {
    title: string,
    menu: {
        label: string
        path: string
    }[]
}
export const CommonHeader = ({title, menu} : HeaderProps) => {
    return (
        <div className="flex justify-between items-center flex-wrap gap-2">
            <h4 className="uppercase text-xl font-bold tracking-wide">{title}</h4>
            <div>
                <BreadcrumbDemo menu={menu} />
            </div>
        </div>
    )
}