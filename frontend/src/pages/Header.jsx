import React from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/auth";
import logo from "../assets/logo.svg"
import label from "../assets/mycloud.svg"

function Header() {
    const [isLoggedIn, user] = useAuthStore((state) => [state.isLoggedIn, state.user]);
    return (
        <header className="navbar-dark bg-dark navbar-sticky header-static">
            <nav className="navbar navbar-expand-lg">
                <div className="container">
                    <Link className="navbar-brand" to="/">
                        <img className="navbar-brand-item dark-mode-item" src={logo} style={{ width: "200px" }} alt="logo" />
                        <img className="navbar-brand-item dark-mode-item" src={label} style={{ width: "200px" }} alt="logo" /> 
                    </Link>
                        <ul className="navbar-nav navbar-nav-scroll ms-auto">
                            <li className="nav-item">
                                {isLoggedIn() ? (
                                    <>
                                        <Link to={"/profile/"} className="btn btn-secondary" >
                                            Profile <i className="bi bi-grid-fill"></i>
                                        </Link>
                                        <Link to={"logout/"} className="btn btn-danger ms-2" >
                                            Logout <i className="fas fa-sign-out-alt"></i>
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Link to={"register/"} className="btn btn-success" >
                                            Register <i className="fas fa-user-plus"></i>
                                        </Link>
                                        <Link to={"login/"} className="btn btn-success ms-2">                              
                                            Login <i className="fas fa-sign-in-alt"></i>
                                        </Link>
                                    </>
                                )}
                            </li>
                        </ul>
                </div>
            </nav>
        </header>
    );
}

export default Header;