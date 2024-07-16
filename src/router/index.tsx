import { Outlet, Route } from "react-router-dom";
import { Fragment, LazyExoticComponent, Suspense, lazy } from "react";
import AuthGuard from "../utils/Auth";

interface RouteProps {
    path?: string;
    element?: LazyExoticComponent<() => JSX.Element> | null;
    layout?: LazyExoticComponent<(props: { children: React.ReactNode }) => JSX.Element> | ((props: { children: React.ReactNode }) => JSX.Element) | null;
    children?: RouteProps[];
    name?: string;
    authorization?: {
        allowedRoles: string[]
      } | null;
}

export const renderRoutes = (routes: RouteProps[]) => {
    return routes.map((route, index) => {
        const Component = route.element || Fragment;
        const LayoutComponent = route.layout !== null && route.layout !== undefined ? route.layout : Fragment;
        const allowedRoles = route.authorization?.allowedRoles || [];

        return (
            <Route
                key={index}
                path={route.path}
                element={
                    <Suspense fallback={<h1>Loading...</h1>}>
                        {route.authorization ? (
                            <AuthGuard allowedRoles={allowedRoles}>
                                <LayoutComponent>
                                    {route.children ? <Outlet /> : <Component />}
                                </LayoutComponent>
                            </AuthGuard>
                        ) : (
                            <LayoutComponent>
                                {route.children ? <Outlet /> : <Component />}
                            </LayoutComponent>
                        )}
                    </Suspense>
                }
            >
                {route.children && renderRoutes(route.children)}
            </Route>
        );
    });
};

export const routes: RouteProps[] = [
    {
        path: "/",
        element: lazy(async () => await import("../pages/HomePage")),
        name: "Home",
        layout: lazy(async () => await import("../pages/Layout/layout"))
    },
    {
        path: "/login",
        element: lazy(async () => await import("../pages/Login")),
        name: "Login"
    },
    {
        path: "/register",
        element: lazy(async () => await import("../pages/Register")),
        name: "Register"
    },
    {
        path: "/home",
        element: lazy(async () => await import("../pages/HomePage")),
        name: "Home",
        layout: lazy(async () => await import("../pages/Layout/layout"))
    },
    {
        path: "/profile",
        element: lazy(async () => await import("../pages/UserProfile")),
        name: "UserProfile",
        layout: lazy(async () => await import("../pages/Layout/layout")),
        authorization: {
            allowedRoles: ['Admin', 'Turista', 'Comercio']
        }
    }
];
