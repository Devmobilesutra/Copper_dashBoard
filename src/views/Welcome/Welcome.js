import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
// import Login from '../Login/Login';
// import DefaultLayout from '../../containers/DefaultLayout';
// Containers
const DefaultLayout = React.lazy(() => import('../../containers/DefaultLayout'));
const Login = React.lazy(() => import('../Login/Login'));
const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;


class Welcome extends Component {
    state = {
        loggedIn: true
    }
    logout() {
        console.log('logout()');
        // this.setState({ loggedIn: false });
        this.props.history.push('/')
    }
    render() {
        return (
            // <DefaultLayout/>
            <HashRouter>
                <React.Suspense fallback={loading()}>
                    <Switch>
                        <Route path="/" name="Home" render={props => this.state.loggedIn ? <DefaultLayout Logout={() => this.logout()} {...props} /> : <Login {...props} />} />
                        {/* <Route path="/Login" name="Login" render={props => <Login />} /> */}
                    </Switch>
                </React.Suspense>
            </HashRouter>
        );
    }
}

export default Welcome;