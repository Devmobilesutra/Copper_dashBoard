import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
// import DefaultLayout from '../../containers/DefaultLayout';
// Containers
const DefaultLayout = React.lazy(() => import('../../containers/DefaultLayout'));
const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;


class Welcome extends Component {
    state = {  }
    render() { 
        return ( 
            // <DefaultLayout/>
            <HashRouter>
            <React.Suspense fallback={loading()}>
              <Switch>
              <Route path="/" name="Home" render={props => <DefaultLayout {...props}/>} />
              </Switch>
            </React.Suspense>
        </HashRouter>
         );
    }
}
 
export default Welcome;