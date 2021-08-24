import React, { useState } from 'react';
import ReactDom from 'react-dom';
import { HashRouter, Route, Switch, withRouter } from 'react-router-dom';
// start the Stimulus application
import './bootstrap';
import "react-toastify/dist/ReactToastify.css";
import Navbar from './js/components/Navbar';
import PrivateRoute from './js/components/PrivateRoute';
import AuthContext from './js/contexts/AuthContext';
import EmployePage from './js/pages/EmployePage';
import EmployesPage from './js/pages/EmployesPage';
import HomePage from './js/pages/HomePage';
import ExperiencePage from './js/pages/ExperiencePage';
import ExperiencesPage from './js/pages/ExperiencesPage';
import LoginPage from './js/pages/LoginPage';
import RegisterPage from './js/pages/RegisterPage';
import AuthAPI from './js/services/authAPI';
import { ToastContainer, toast } from 'react-toastify';


AuthAPI.setup();

const App = () => {

    const [isAuthenticated, setIsAuthenticated] = useState(AuthAPI.isAuthenticated());
    const NavbarWithRouter = withRouter(Navbar);

    const contextValue = {
        isAuthenticated,
        setIsAuthenticated
    };

    return (
        <AuthContext.Provider value={contextValue}>
            <HashRouter>
                <NavbarWithRouter />
                <main className="container mt-4">
                    <Switch>
                        <Route path="/register" component={RegisterPage} />
                        <Route path="/login" component={LoginPage} />
                        <PrivateRoute path="/experiences/:id" component={ExperiencePage} />
                        <PrivateRoute path="/employes/:id" component={EmployePage} />
                        <PrivateRoute path="/employes" component={EmployesPage} />
                        <PrivateRoute path="/experiences" component={ExperiencesPage} />
                        <Route path="/" component={HomePage} />
                    </Switch>
                </main>
            </HashRouter>
            <ToastContainer position={toast.POSITION.BOTTOM_RIGHT} />
        </AuthContext.Provider>
    );
}
const rootElement = document.querySelector('#app');
ReactDom.render(<App />, rootElement);