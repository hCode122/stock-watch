'use client';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter, usePathname } from 'next/navigation';
import { authorize, selectAuthState } from '@/state/slices/authSlice';

export const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const pathname = usePathname();
    const isAuthorized = useSelector(selectAuthState);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const publicRoutes = ['/', '/sign-in', '/sign-up'];
        const isPublicRoute = publicRoutes.includes(pathname);

        if (token && !isAuthorized) {
            const savedUser = localStorage.getItem('user');
            if (savedUser) {
                const user = JSON.parse(savedUser);
                dispatch(authorize({ 
                    user: user,
                    token: token
                }));
            } else {
                localStorage.removeItem('token');
                if (!isPublicRoute) router.push('/sign-in');
            }
        } else if (!token && !isPublicRoute) {
            router.push('/sign-in');
        }
    }, [dispatch, isAuthorized, pathname, router]);

    return <>{children}</>;
};