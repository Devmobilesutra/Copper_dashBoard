import React from 'react';

const Dashboard = React.lazy(() => import('./views/Dashboard/Dashboard'));
const UsersList = React.lazy(() => import('./views/Users/UsersList'));
const ProductsList = React.lazy(() => import('./views/Products/ProductsList'));
const OrdersList = React.lazy(() => import('./views/Orders/OrdersList'));
const CategoryList = React.lazy(() => import('./views/Category/CategoryList'));
const Convert2Excel = React.lazy(() => import('./views/Convert2Excel'));
const AddNotification = React.lazy(() => import('./views/AddNotification/AddNotification'));
const Reports = React.lazy(() => import('./views/Reports/Reports'));
const Order_Details = React.lazy(() => import('./views/Reports/Order_Details'));


const routesDrawer = [
    { path: '/', exact: true, name: 'Home' },
    { path: '/dashboard', name: 'Dashboard', component: Dashboard },
    { path: '/UsersList', name: 'UsersList', component: UsersList },
    { path: '/ProductsList', name: 'ProductsList', component: ProductsList },
    { path: '/OrdersList', name: 'OrdersList', component: OrdersList },
    { path: '/CategoryList', name: 'CategoryList', component: CategoryList },
    { path: '/Convert2Excel', name: 'Convert2Excel', component: Convert2Excel },
    { path: '/AddNotification', name: 'AddNotification', component: AddNotification },
    { path: '/Reports', name: 'Reports', component: Reports },
    { path: '/Order_Details', name: 'Order_Details', component: Order_Details },
];

export default routesDrawer;