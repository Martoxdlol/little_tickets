import { createBrowserRouter, redirect } from 'react-router-dom'
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
])
