import React from 'react';

const Dashboard = React.lazy(() => import('./views/Dashboard/Dashboard'));
const UsersList = React.lazy(() => import('./views/Users/UsersList'));
const ProductsList = React.lazy(() => import('./views/Products/ProductsList'));
const OrdersList = React.lazy(() => import('./views/Orders/OrdersList'));
const CategoryList = React.lazy(() => import('./views/Category/CategoryList'));
const Convert2Excel = React.lazy(() => import('./views/Convert2Excel'));
const AddNotification = React.lazy(() => import('./views/AddNotification/AddNotification'));


const routesDrawer = [
    { path: '/', exact: true, name: 'Home' },
    { path: '/dashboard', name: 'Dashboard', component: Dashboard },
    { path: '/UsersList', name: 'UsersList', component: UsersList },
    { path: '/ProductsList', name: 'ProductsList', component: ProductsList },
    { path: '/OrdersList', name: 'OrdersList', component: OrdersList },
    { path: '/CategoryList', name: 'CategoryList', component: CategoryList },
    { path: '/Convert2Excel', name: 'Convert2Excel', component: Convert2Excel },
    { path: '/AddNotification', name: 'AddNotification', component: AddNotification },
];

export default routesDrawer;