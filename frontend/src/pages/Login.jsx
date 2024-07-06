import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../utils/auth";
import {MDBBtn, MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBInput} from 'mdb-react-ui-kit';
import LoadingIndicator from "../layouts/LoadingIndicator";
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";

function Login() {
    const [bioData, setBioData] = useState({ email: "", password: "" });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleBioDataChange = (event) => {
        setBioData({
            ...bioData,
            [event.target.name]: event.target.value,
        });
    };

    const resetForm = () => {
        setBioData({
            email: "",
            password: "",
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const { error } = await login(bioData.email, bioData.password);
        if (error) {
            alert(JSON.stringify(error));
            resetForm();
        }
         else {
            navigate("/home");
        }

        setIsLoading(false);
    };

    return (
        <MDBContainer fluid>
            <form className="needs-validation" noValidate="" onSubmit={handleLogin}>

                <MDBRow className='d-flex justify-content-center align-items-center h-100'>
                <MDBCol col='12'>

                    <MDBCard className='bg-dark text-white my-5 mx-auto' style={{borderRadius: '1rem', maxWidth: '400px'}}>
                    <MDBCardBody className='p-5 d-flex flex-column align-items-center mx-auto w-100'>
                        
                        <h2 className="fw-bold mb-2 text-uppercase">Login</h2>
                        <p className="text-white-50 mb-5">Please enter your login and password!</p>
                        
                            <MDBInput wrapperClass='mb-4 mx-5 w-100' labelClass='text-white' label='Email' type='text' size="lg" 
                            onChange={handleBioDataChange} value={bioData.email} id="email" className="form-control" name="email" required=""/>
                            <MDBInput wrapperClass='mb-4 mx-5 w-100' labelClass='text-white' label='Password'  type='password' size="lg" 
                            onChange={handleBioDataChange} value={bioData.password} id="password" className="form-control" name="password" placeholder="**************" required=""/>

                            {isLoading && <LoadingIndicator />}
                            <MDBBtn outline className='mx-2 px-5' color='white' size='lg'>
                            Login
                            </MDBBtn>
            

                        <div>
                        <p className="mb-0">Don't have an account? <Link to="/register" className="text-white-50 fw-bold">Sign Up</Link></p>
                        </div>
                    </MDBCardBody>
                    </MDBCard>
            
                </MDBCol>
                </MDBRow>
            </form>
        </MDBContainer>
    );
}

export default Login;