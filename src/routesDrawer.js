import React from 'react';

const Dashboard = React.lazy(() => import('./views/Dashboard/Dashboard'));
const UsersList = React.lazy(() => import('./views/Users/UsersList'));
const Admin=React.lazy(()=>import('./views/Users/Admin'));
const ProductsList = React.lazy(() => import('./views/Products/ProductsList'));
const CategoryImage=React.lazy(() => import('./views/images/CategoryImage'));
const DiscountImage=React.lazy(() => import('./views/images/DiscountImage'));
const OrdersList = React.lazy(() => import('./views/Orders/OrdersList'));
const CategoryList = React.lazy(() => import('./views/Category/CategoryList'));
const Convert2Excel = React.lazy(() => import('./views/Convert2Excel'));
const AddNotification = React.lazy(() => import('./views/AddNotification/AddNotification'));
// const Reports = React.lazy(() => import('./views/Reports/Reports'));
// const Order_Details = React.lazy(() => import('./views/Reports/Order_Details'));
const Reports_reconciliation = React.lazy(() => import('./views/Reports/Reports_reconciliation'));
const Reports_amount = React.lazy(() => import('./views/Reports/Reports_amount'));
const Reports_product = React.lazy(() => import('./views/Reports/Reports_product'));


const routesDrawer = [
    { path: '/', exact: true, name: 'Home' },
    { path: '/dashboard', name: 'Dashboard', component: Dashboard },
    { path: '/Admin',name: 'Admin',component:Admin},
    { path: '/UsersList', name: 'UsersList', component: UsersList },
    { path: '/ProductsList', name: 'ProductsList', component: ProductsList },
    { path: '/CategoryImage', name:'CategoryImage',component: CategoryImage},
    { path: '/DiscountImage',name: 'DiscoutImage', component:DiscountImage},
    { path: '/OrdersList', name: 'OrdersList', component: OrdersList },
    { path: '/CategoryList', name: 'CategoryList', component: CategoryList },
    { path: '/Convert2Excel', name: 'Convert2Excel', component: Convert2Excel },
    { path: '/AddNotification', name: 'AddNotification', component: AddNotification },
    // { path: '/Reports', name: 'Reports', component: Reports },
    // { path: '/Order_Details', name: 'Order_Details', component: Order_Details },
    { path: '/Reports_reconciliation', name: 'Reports_reconciliation', component: Reports_reconciliation },
    { path: '/Reports_amount', name: 'Reports_amount', component: Reports_amount },
    { path: '/Reports_product', name: 'Reports_amount', component: Reports_product},
];

export default routesDrawer;