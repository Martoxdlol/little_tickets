import { Outlet, createBrowserRouter, redirect } from 'react-router-dom'
import { OrganizationLayout } from '../organizations/layout'
import PageLayout from '../scaffolding/page-layout'
import { ErrorScreen } from '../screens/error'
import { HomeScreen } from '../screens/home'
import { InvitationsScreen } from '../screens/invitations'
import { NotFoundScreen } from '../screens/not-found'
import { ChannelScreen } from '../screens/org/channel'
import { ChannelManageScreen } from '../screens/org/channel-manage'
import { ChannelMembersPage } from '../screens/org/channel-members'
import { OrgHome } from '../screens/org/home'
import { OrgMembersPage } from '../screens/org/members'
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
        path: '/invitations',
        element: <InvitationsScreen />,
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
                path: 'c/:channel/manage',
                element: <ChannelManageScreen />,
            },
            {
                path: 'c/:channel/members',
                element: <ChannelMembersPage />,
            },
            {
                path: 'members',
                element: <OrgMembersPage />,
            },
            {
                path: 'settings',
                element: <OrgSettingsPage />,
            },
        ],
    },
    {
        path: '*',
        element: <NotFoundScreen />,
    },
])
