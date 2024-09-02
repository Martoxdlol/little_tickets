import { Outlet, createBrowserRouter, redirect } from 'react-router-dom'
import { OrganizationLayout } from '../layouts/organization-layout'
import { HomeScreen } from '../screens/home'

export const router = createBrowserRouter([
    {
        path: '/',
        loader: () => redirect('/home'),
    },
    {
        path: '/home',
        element: <HomeScreen />,
    },
    {
        path: '/orgs/:org',
        element: (
            <OrganizationLayout>
                <Outlet />
            </OrganizationLayout>
        ),
    },
])
