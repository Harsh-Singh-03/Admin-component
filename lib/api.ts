"use client"

import { http_request } from "./axios-instance";

const h = (p: string | null, a: string) => {
    return {
        'X-Required-Permission': p,
        'X-Required-Action': a,
    }
}

/** For General Action */
export const general_action = {
    getSideBar: async () => {
        try {
            const response = await http_request({method: "POST", url: "/admin/menu/getAll"})
            return response;
        } catch (error) {
            return error
        }
    },
    sidebar_list: async (data: any, permission: string | null) => {
        try {
            const response = await http_request({method: "POST", url: "/admin/menu/list", data, headers: h(permission, 'Read') })
            return response;
        } catch (error) {
            return error
        }
    },
    create_menu: async (data: any) => {
        try {
            const response = await http_request({method: "POST", url: "/admin/menu/create", data})
            return response;
        } catch (error) {
            return error
        }
    },
    update_menu: async ({id, data}: any) => {
        try {
            const response = await http_request({method: "PUT", url: `/admin/menu/update/${id}`, data})
            return response;
        } catch (error) {
            return error
        }
    },
    delete_menu: async ({id, permission}: any) => {
        try {
            const response = await http_request({method: "DELETE", url: `/admin/menu/delete/${id}`, headers: h(permission, 'Delete')})
            return response;
        } catch (error) {
            return error
        }
    }
}
/** For Authentication with permission role sub admin & menu all */
export const authentication = {
    login: async (data: {email: string, password: string}) => {
        try {
            const response = await http_request({method: "POST", url: "/admin/log-in", data})
            return response;
        } catch (error) {
            return error
        }
    },
    token_verify: async () => {
        try {
            const response = await http_request({method: "POST", url: "/admin/validate"})
            return response;
        } catch (error) {
            return error
        }
    },
    permissionList: async (data: any) => {
        try {
            const response = await http_request({method: "POST", url: "/permission/list", data})
            return response;
        } catch (error) {
            return error
        }
    },
    create_permission: async (data: any) => {
        try {
            const response = await http_request({method: "POST", url: "/permission/create", data: data})
            return response;
        } catch (error) {
            return error
        }
    },
    update_permission: async ({id, data}: {id: string, data:any}) => {
        try {
            const response = await http_request({method: "PUT", url: `/permission/update/${id}`, data: data})
            return response;
        } catch (error) {
            return error
        }
    },
    delete_permission: async (id: string) => {
        try {
            const response = await http_request({method: "DELETE", url: `/permission/delete/${id}`})
            return response;
        } catch (error) {
            return error
        }
    },
}
/** Catalogs */
export const catalog_api = {
    category_list: async ({data, permission}: any) => {
        try {
            const response = await http_request({method: "POST", url: `/admin/category/list`, data, headers: h(permission, 'Read')})
            return response;
        } catch (error) {
            return error
        }
    },
    categoryAll: async ({data, permission}: any) => {
        try {
            const response = await http_request({method: "POST", url: `/admin/category/getAll`, data, headers: h(permission, 'Read')})
            return response;
        } catch (error) {
            return error
        }
    },
    create_category: async ({data, permission}: any) => {
        try {
            const response = await http_request({method: "POST", url: `/admin/category/create`, data, headers: h(permission, 'Create')})
            return response;
        } catch (error) {
            return error
        }
    },
    update_category: async ({id, data, permission}: any) => {
        try {
            const response = await http_request({method: "PUT", url: `/admin/category/update/${id}`, data, headers: h(permission, 'Update')})
            return response;
        } catch (error) {
            return error
        }
    }
}