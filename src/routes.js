import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Login from './views/Login/Login';
import Welcome from './views/Welcome/Welcome';

import UsersList from './views/Users/UsersList';
import ProductsList from './views/Products/ProductsList';
import DiscountImage from './views/images/DiscountImage';
import OrdersList from './views/Orders/OrdersList';
import CategoryList from './views/Category/CategoryList';
import Convert2Excel from "./views/Convert2Excel";
import AddNotification from './views/AddNotification/AddNotification';
import Reports from './views/Reports/Reports';
// import Order_Details from './views/Reports/Order_Details';
import Reports_amount from './views/Reports/Reports_amount';
import Reports_product from './views/Reports/Reports_product';


const Routes = () => (
    <BrowserRouter>
        <Switch>
            <Route exact path='/' component={Login} />
            <Route path='/Welcome' component={Welcome} />
            <Route path='/UsersList' component={UsersList} />
            <Route path='/ProductsList' component={ProductsList} />
            <Route path='/DiscountImage' component={DiscountImage}/>
            <Route path='/OrdersList' component={OrdersList} />
            <Route path='/CategoryList' component={CategoryList} />
            <Route path='/Convert2Excel' component={Convert2Excel} />
            <Route path='/AddNotification' component={AddNotification} />
            <Route path='/Reports' component={Reports} />
            {/* <Route path='/Order_Details' component={Order_Details} /> */}
            <Route path='/Reports_amount' component={Reports_amount} />
            <Route path='/Reports_product' component={Reports_product} />
        </Switch>
    </BrowserRouter>
);

export default Routes;