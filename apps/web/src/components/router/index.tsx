import { Outlet, createBrowserRouter, redirect } from 'react-router-dom'
import { OrganizationLayout } from '../organizations/layout'
import PageLayout from '../scaffolding/page-layout'
import { ErrorScreen } from '../screens/error'
import { HomeScreen } from '../screens/home'
import { ChannelScreen } from '../screens/org/channel'
import { OrgHome } from '../screens/org/home'
import { OrgSettingsPage } from '../screens/org/settings'
import { TicketScreen } from '../screens/org/ticket'

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
        errorElement: <ErrorScreen />,
        children: [
            {
                path: '',
                element: (
                    <PageLayout>
                        <OrgHome />
                    </PageLayout>
                ),
            },
            {
                path: 'c/:channel',
                element: <ChannelScreen />,
            },
            {
                path: 'c/:channel/t/:ticket',
                element: <TicketScreen />,
            },
            {
                path: 'settings',
                element: <OrgSettingsPage />,
            },
        ],
    },
])
