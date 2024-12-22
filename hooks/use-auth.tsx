"use client";

import React, { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { authentication } from "@/lib/api";
import { usePathname, useRouter } from "next/navigation";
import { LoadingComponent } from "@/components/globals/loading";

type AuthContextType = {
    isAuthenticated: boolean;
    isLoading: boolean;
    error: unknown;
    user: any,
    requiredPermissions: string | null
    setRequiredPermissions: React.Dispatch<React.SetStateAction<string | null>>,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const router = useRouter();
    const pathname = usePathname()
    const [user, setUser] = useState<any>(null)
    const [requiredPermissions, setRequiredPermissions] = useState<string | null>(null)

    const { data, isLoading, error }: any = useQuery({
        queryKey: ["token_verify"],
        queryFn: authentication.token_verify,
        retry: 1,
        staleTime: 5 * 60 * 1000,
    });

    const isAuthenticated = data?.success || false;

    useEffect(() => {
        if(!isLoading){
            setUser(data?.data)
        }
    }, [isLoading])

    if (isLoading) {
        return (
            <LoadingComponent />        
        );
    }

    if (pathname === '/login' && isAuthenticated) {
        router.replace("/");
        return null;
    }

    if (!isLoading && (error || !isAuthenticated) && pathname !== '/login') {
        router.replace("/login");
        return null;
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoading, error, user, setRequiredPermissions, requiredPermissions }}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
