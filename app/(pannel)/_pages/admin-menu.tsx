"use client"

import { AdminMenuFrom } from "@/components/forms/admin_menu.form"
import { CommonDialog2 } from "@/components/globals/common_dialog2"
import { CommonHeader } from "@/components/globals/common_header"
import { SortComponent } from "@/components/globals/common_sort"
import { TableComponent } from "@/components/globals/common_table"
import { PaginationComponent } from "@/components/globals/pagination"
import { SearchComponent2 } from "@/components/globals/search2"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useAdminMenu } from "@/hooks/app-hooks"
import { useAuth } from "@/hooks/use-auth"
import { authentication, general_action } from "@/lib/api"
import { KEYS } from "@/lib/query-key"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ArrowUpDown, Download, Edit, PlusCircle, Trash2, X } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

const sortArr = [{ name: 'title', label: 'Title', type: 'text' }, { name: 'createdAt', label: 'Date of creation', type: 'date' }]

export const AdminMenu = () => {
    const { requiredPermissions } = useAuth()
    const [open, setOpne] = useState(false)
    const [sort, setSort] = useState<any>(null)
    const [search, setSearch] = useState<string>('')
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)

    const { data, isPending }: any = useAdminMenu({data: { keyword_search: search, sort: sort, page, limit }, permission: requiredPermissions })

    const [filtersArray, setFiltersArray] = useState<{ name: string, value: string, type: string }[]>([])
    const queryClient = useQueryClient();
    const [isEdit, setIsEdit] = useState(false)
    const [initialData, setInitialData] = useState<any>(null)

    const { mutate: deleteMenu } = useMutation({
        mutationFn: general_action.delete_menu,
        onSuccess: (data: any) => data.success ? onSuccess(data) : toast.warning(data.message),
        onError: (error) => toast.error(error?.message)
    });

    const onSuccess = (data: any) => {
        toast.success(data.message)
        queryClient.invalidateQueries({ queryKey: [KEYS.ADMIN_MENU] });
    }

    const onEdit = (data: any, i: number) => {
        setOpne(true)
        setInitialData(data)
        setIsEdit(true)
    }

    useEffect(() => {
        const checkFilter = filtersArray.find(filter => filter.type === 'search');
        if (search) {
            const str = `${search.slice(0, 15)}${search.length > 15 ? '...' : ''}`
            if (checkFilter) {
                setFiltersArray(prev => prev.map((el) => {
                    if (el.type === 'search') {
                        return { ...el, value: str }
                    } else {
                        return el;
                    }
                }))
            } else {
                setFiltersArray([...filtersArray, { name: 'Search', value: str, type: 'search' }])
            }
        } else {
            if (checkFilter) {
                setFiltersArray(prev => prev.filter((el) => el.type !== 'search'))
            }
        }
    }, [search])

    const onDelete = async (data: any, i: number) => {
        const isConfirm = await window.confirm('Are you sure you want to delete this menu?')
        if (isConfirm) {
            deleteMenu({id: data._id, permission: requiredPermissions})
        }
    }

    const onSortApplied = (data: any) => {
        setSort(data)
        const [fieldName, value] = Object.entries(data)[0];
        if (typeof data === 'object') {
            let sortInfo = sortArr.find(a => a.name === fieldName)
            if (sortInfo) {
                let checkFilterArr = filtersArray.find(a => a.type === 'sort')
                const key = sortInfo.label
                let pair = ''
                if (sortInfo.type === 'text') {
                    pair = value === -1 ? 'Z - A' : 'A - Z'
                }
                if (sortInfo.type === 'date') {
                    pair = value === -1 ? 'Newest first' : 'Oldest first'
                }
                if (checkFilterArr) {
                    setFiltersArray(prev => prev.map((el) => {
                        if (el.type === 'sort') {
                            return { ...el, value: pair, name: key }
                        } else {
                            return el;
                        }
                    }))
                } else {
                    setFiltersArray([...filtersArray, { name: key, value: pair, type: 'sort' }])
                }
            }
        }
    }

    const onFilterRemove = (element: { name: string, value: string, type: string }) => {
        const index = filtersArray.findIndex(a => a.name === element.name && a.value === element.value)
        if (index > -1) {
            filtersArray.splice(index, 1)
        }
        if (element.type === 'sort') {
            setSort(null)
        }
        if (element.type === 'search') {
            setSearch('')
        }
    }

    const onCreate = () => {
        setOpne(true)
        setInitialData(null)
        setIsEdit(false)
    }
   
    return (
        <div>
            <CommonHeader title="Permission Management" menu={[{ label: 'Permissions', path: '#' }]} />
            <Separator className="my-6 lg:my-6" />
            <div className="space-y-4 lg:space-y-6">

                <div className="flex justify-between items-center gap-2 flex-wrap">
            
                    <SearchComponent2 setSearch={setSearch} search={search} />
                    
                    <div className="flex items-center gap-2 lg:gap-4 justify-end flex-1">
                        <SortComponent data={sortArr} onApplied={onSortApplied} >
                            <Button variant="btn2" className="tracking-wider gap-1" size='sm'>
                                <ArrowUpDown />
                                <span className="hidden md:block">Sort</span>
                            </Button>
                        </SortComponent>

                        <Button variant="btn2" className="tracking-wider gap-1" size="sm">
                            <Download />
                            <span className="hidden md:block">Export</span>
                        </Button>

                        <Button variant="default" className="tracking-wider gap-1" size="sm" onClick={onCreate}>
                            <PlusCircle />
                            <span className="hidden md:block">Create</span>
                        </Button>
                    </div>
                </div>

                {filtersArray.length > 0 && (
                    <div className="flex items-center gap-2">
                        {filtersArray.map((filter, i) => (
                            <Button variant="btn2" className="tracking-wider px-2 rounded-full gap-0.5" size='sm' key={i} onClick={() => onFilterRemove(filter)}>
                                <X />
                                <span>{filter.name}: {filter.value}</span>
                            </Button>
                        ))}
                    </div>
                )}

                <TableComponent
                    data={data?.data || []}
                    labels={['Title', 'Type', 'Icon', 'Parent Menu', 'Permission', 'Url', 'Actions']}
                    isPending={isPending}
                    actions={[{ Icon: Edit, onAction: onEdit, label: 'Edit' }, { Icon: Trash2, onAction: onDelete, label: 'Delete' }]}
                    values={[
                        {
                            key: 'title',
                            component: 'default',
                            type: 'string',
                        },
                        {
                            key: 'type',
                            component: 'default',
                            type: 'string',
                        },
                        {
                            key: 'icon',
                            component: 'default',
                            type: 'icon',
                        },
                        {
                            key: 'parent_menu',
                            component: 'badge',
                            type: 'string',
                            defautBadge: true,
                        },
                        {
                            key: 'permission_name',
                            component: 'badge',
                            type: 'string',
                            defautBadge: true,
                        },
                        {
                            key: 'url',
                            component: 'default',
                            link: ':url',
                            type: 'link',
                        },
                        {
                            key: '',
                            component: 'default',
                            type: 'action',
                        },
                    ]}
                />

                <PaginationComponent currentPage={page} totalPages={data?.totalPages} setLimit={setLimit} setPage={setPage} />
            </div>

            {/* Dialogs */}
            <CommonDialog2
                open={open}
                setOpen={setOpne}
                title="Create new menu"
                description="Create a new menu to keep things organized"
                className="max-w-screen-sm"
            >
                <AdminMenuFrom isEdit={isEdit} initialData={initialData} />
            </CommonDialog2>
        </div>
    )
}