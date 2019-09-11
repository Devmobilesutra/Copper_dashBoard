import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';

import Login from './views/Login/Login';
import Welcome from './views/Welcome/Welcome';
// import Dashboard from './views/Dashboard/Dashboard';



const Routes = () => (
    <BrowserRouter>
    <Switch>
    <Route exact path='/' component={Login}/>
    <Route  path='/Welcome' component={ Welcome} />
    {/* <Route  path='/dashboard' component={ Dashboard} /> */}
    
    </Switch>
    </BrowserRouter>
    
    
    );
    
    export default Routes;