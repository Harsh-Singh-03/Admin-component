"use client"
import { authentication, catalog_api, general_action } from '@/lib/api';
import { KEYS } from '@/lib/query-key';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface commonType {
  data: any;
  permission: string | null
}

/** Hook for fetch sidebar */
export const useFetchSideMenu = () => {
  return useQuery({ queryKey: [KEYS.SIDEBAR_KEY], queryFn: general_action.getSideBar, enabled: true });
};
/** Use login hook */
export const useLogin = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: authentication.login,
    onSuccess: (data: any) => {
      if (data.success) {
        toast.success(data.message);
        router.replace("/");
      }
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });
};
/** Permission Hook */
export const usePermissions = (data: any) => {
  return useQuery({ queryKey: [KEYS.PERMISSION_KEY, data], queryFn: () => authentication.permissionList(data), enabled: true });
};
/** sidebar Hook */
export const useAdminMenu = ({ data, permission }: commonType) => {
  return useQuery({
    queryKey: [KEYS.ADMIN_MENU, data, permission],
    queryFn: () => general_action.sidebar_list(data, permission),
    enabled: true
  });
};

export const useCategories = {
  list: ({ data, permission }: commonType) =>
    useQuery({
      queryKey: [KEYS.CATEGORY_LIST, data, permission],
      queryFn: () => catalog_api.category_list({ data, permission }),
      enabled: true,
    }),

  getAll: ({data, permission}: commonType) => 
    useQuery({
      queryKey: [KEYS.ALL_CATEGORY, data, permission],
      queryFn: () => catalog_api.categoryAll({ data, permission }),
      enabled: true,
    }),
}