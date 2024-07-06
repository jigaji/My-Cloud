import React, { useEffect } from "react";
import { logout } from "../utils/auth";

function Logout() {
    useEffect(() => {
        logout();
    }, []);

    return (
        <>
            <section className="container d-flex flex-column vh-100" style={{ marginTop: "150px" }}>
                <div className="row align-items-center justify-content-center g-0 h-lg-100 py-8">
                    <div className="col-lg-5 col-md-8 py-8 py-xl-0">
                        <div className="card shadow">
                            <div className="card-body p-6">
                                <div className="mb-4">
                                    <h1 className="mb-1 fw-bold">You have been logged out</h1>
                                    <span>Thanks for visiing our website, come back anytime!</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Logout;
