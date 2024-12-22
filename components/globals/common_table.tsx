"use client"

import { cn } from "@/lib/utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { format } from 'date-fns';
import { Badge } from "../ui/badge";
import { icons, LucideIcon, MoreVerticalIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";
import Image from "next/image";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface props {
    data: any[],
    labels: any[],
    isPending: boolean,
    values: {
        key: string,
        type: 'string' | 'date' | 'action' | 'link' | 'icon' | 'image'
        link?: string
        component: 'default' | 'badge' | 'custom'
        defautBadge?: boolean
        successBadge?: any,
        infoBadge?: any,
        warningBadge?: any,
        dangerBadge?: any,
        action?: boolean,
        onAction?: (data: any) => void
    }[],
    actions?: {
        Icon: LucideIcon,
        onAction: (data: any, index: number) => void,
        label: string
    }[]
}

/** Will add custom component here.. */

const DATE_FORMAT = "dd MMM yyyy"

export const TableComponent = ({ data, labels, values, isPending, actions }: props) => {

    const getLucideIcon = (iconName: string) => {
        if (!iconName) return null;
        const IconComponent = icons[iconName as keyof typeof icons];
        return IconComponent ? <IconComponent className="text-blue-400 mx-auto" /> : null;
    };

    function getNestedValue(obj: any, path: string) {
        return path.split('.').reduce((acc, key) => acc && acc[key], obj);
    }

    const getBadgeVariants = (element: typeof values[0], value: string) => {
        if (element.successBadge === value) return 'successStatus'
        if (element.infoBadge === value) return 'infoStatus'
        if (element.dangerBadge === value) return 'dangerStatus'
        if (element.warningBadge === value) return 'warningStatus'
        return 'secondary2'
    }

    const TableSkeleton = () => {
        return (
            <TableBody>
                {[...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                        {[...Array(labels.length)].map((_, j) => (
                            <TableCell key={j}>
                                <Skeleton className="h-12" />
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        )
    }

    const TableBodyComponent = () => (
        <TableBody className="">
            {data.map((item, index) => {
                return (
                    <TableRow key={index}>
                        {values.map((value, i) => {
                            return (
                                <TableCell
                                    key={i}
                                    className={cn(
                                        "border text-center",
                                        i === values.length - 1 && 'text-right',
                                        i === 0 && 'text-left',
                                        value.action && "hover:underline cursor-pointer"
                                    )}
                                    onClick={() => value?.action && value?.onAction ? value?.onAction(item) : {}}
                                >
                                    {/*  Type date  */}
                                    {value.type === "date" && value.component === 'badge' && (
                                        <Badge variant="secondary2">
                                            {getNestedValue(item, value.key) ? format(new Date(getNestedValue(item, value.key)), DATE_FORMAT) : ''}
                                        </Badge>
                                    )}

                                    {value.type === "date" && value.component === 'default' &&
                                        getNestedValue(item, value.key) ? format(new Date(getNestedValue(item, value.key)), DATE_FORMAT) : ''
                                    }
                                    {/* Type link */}
                                    {value.type === "link" && getNestedValue(item, value.key) && (
                                        <Link href={`${value.link?.split(':')[0]}${getNestedValue(item, value.link?.split(':')[1] || '')}`}>
                                            <Badge variant="link">
                                                {getNestedValue(item, value.key)}
                                            </Badge>
                                        </Link>
                                    )}
                                    {/* Type string */}
                                    {value.type === "string" && value.component === 'default' && getNestedValue(item, value.key)}

                                    {value.type === "string" && value.component === 'badge' && getNestedValue(item, value.key) && (
                                        <Badge
                                            variant={value.defautBadge ? 'secondary2' : getBadgeVariants(value, getNestedValue(item, value.key))}
                                        >
                                            {getNestedValue(item, value.key)}
                                        </Badge>
                                    )}

                                    {/* Type icon */}
                                    {value.type === 'icon' && getLucideIcon(getNestedValue(item, value.key))}

                                    {/* Type action */}
                                    {value.type === 'action' && (
                                        actions && actions?.length < 3 ? (
                                            <div className="flex items-center gap-2 justify-end">
                                                {actions?.map((action, j) => (
                                                    <TooltipProvider key={j} delayDuration={300}>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button className="rounded-full h-8 w-8" variant='btn2' size='sm' onClick={() => action.onAction(item, index)} >
                                                                    <action.Icon width={16} height={16} />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                {action.label}
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>

                                                ))}
                                            </div>
                                        ) : (
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button className="rounded-full h-8 w-8" variant='btn2' size='sm'  >
                                                        <MoreVerticalIcon width={16} height={16} />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="space-y-1 w-max p-2" side="left">
                                                    {actions?.map((action, index) => (
                                                        <Button className="w-full justify-start text-muted-foreground hover:text-foreground gap-3" variant='link' onClick={() => action.onAction(item, index)} key={index} >
                                                            <action.Icon width={20} height={20} />
                                                            {action.label}
                                                        </Button>
                                                    ))}
                                                </PopoverContent>
                                            </Popover>
                                        )
                                    )}

                                    {value.type === 'image' && (
                                        getNestedValue(item, value.key) && (
                                            <div className="border-2 border-gray-300 p-0.5 rounded-md w-16 h-12 relative mx-auto">
                                                <Image src={getNestedValue(item, value.key)} alt="file" width={80} height={40} className="w-full h-full rounded object-cover overflow-hidden" />
                                            </div>
                                        )
                                    )}

                                </TableCell>
                            )
                        })}
                    </TableRow>
                )
            })}
        </TableBody>
    )

    return (
        <>
            <Table className="border">
                {/* Table labels */}
                <TableHeader>
                    <TableRow>
                        {labels.map((row, index) => (
                            <TableHead
                                key={index}
                                className={cn(
                                    "border text-center",
                                    labels.length - 1 === index && 'text-right',
                                    index === 0 && 'text-left',
                                )}
                            >
                                {row}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                {/* Table body */}
                {isPending && <TableSkeleton />}
                {!isPending && <TableBodyComponent />}
                {/* end */}
            </Table>
            {!isPending && data.length === 0 && <p className="text-center text-muted-foreground">No Data Found</p>}
        </>
    )
}

