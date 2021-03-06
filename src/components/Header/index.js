import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import Logo from '../img/logo_3.svg';
import Navigation from '../App/navigation.js';
import './header.css';

// other page used
class Navbar extends Component {
    render() {
        return (
            <div className="navbar">
                <Link to={ROUTES.HOME}>
                    <div className="logo">
                        <img className="logo-img" src={Logo} alt="Logo" />
                        <h3>&nbsp;SouLFun</h3>
                    </div>
                </Link>
                <div className="dropdown">
                    <Navigation />
                </div>
            </div>
        )
    }
}
// account page used
class Navbar_Account extends Component {
    render() {
        return (
            <div className="navbar">
                <a>
                    <div className="logo">
                        <img className="logo-img" src={Logo} alt="Logo" />
                        <h3>&nbsp;SouLFun</h3>
                    </div>
                </a>
            </div>
        )
    }
}
// landing page has its own unique page
class NavLogo_Landing extends Component {
    render() {
        return (
            <div className="logo-landing">
                <img className="logo-img" src={Logo} alt="Logo" />
                <h3>&nbsp;SouLFun</h3>
            </div>
        )
    }
}

export default Navbar;
export { Navbar_Account };
export { NavLogo_Landing };