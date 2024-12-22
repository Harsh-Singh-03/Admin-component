import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import Link from "next/link"
import { Fragment } from "react"

interface menuProps{
    menu: {
        label: string
        path: string
    }[]
}
export function BreadcrumbDemo({menu} : menuProps) {
    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem className="hover:text-foreground transition-all duration-300">
                    <Link href="/">Home</Link>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                {menu.map((item, i) => (
                    <Fragment key={i}>
                        {(i+1) < menu.length ? (
                            <BreadcrumbItem>
                                <Link href={item.path}>{item.label}</Link>
                            </BreadcrumbItem>
                        ) : (
                            <BreadcrumbPage>{item.label}</BreadcrumbPage>
                        )}
                        {i < menu.length - 1 && <BreadcrumbSeparator />}
                    </Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    )
}
