import { Outlet, createBrowserRouter, redirect } from 'react-router-dom'
import { OrganizationLayout } from '../organizations/layout'
import PageLayout from '../scaffolding/page-layout'
import { HomeScreen } from '../screens/home'
import { ChannelScreen } from '../screens/org/channel'
import { OrgHome } from '../screens/org/home'
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
        ],
    },
])
