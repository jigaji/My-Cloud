import React, { useState } from "react";
import {  useNavigate } from "react-router-dom";
import { register } from "../utils/auth";
import LoadingIndicator from "../layouts/LoadingIndicator";
import {MDBBtn, MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBInput} from 'mdb-react-ui-kit';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";

function Register() {
    const [bioData, setBioData] = useState({full_name: "", username: "", email: "", password: "", password2: "" });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleBioDataChange = (event) => {
        setBioData({
            ...bioData,
            [event.target.name]: event.target.value,
        });
        console.log(bioData)
    };

    const resetForm = () => {
        setBioData({
            full_name: "",
            username: "",
            email: "",
            password: "",
            password2: "",

        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const { error } = await register(bioData.full_name, bioData.username, bioData.email, bioData.password, bioData.password2, );
        if (error) {
            alert(JSON.stringify(error));
            resetForm();
        } else {
            navigate("/login");
        }

        // Reset isLoading to false when the operation is complete
        setIsLoading(false);
    };

    return (
        
        <MDBContainer fluid>
            <form onSubmit={handleRegister} className="form-container">

                <MDBRow className='d-flex justify-content-center align-items-center h-100'>
                <MDBCol col='12'>

                    <MDBCard className='bg-dark text-white my-5 mx-auto' style={{borderRadius: '1rem', maxWidth: '400px'}}>
                    <MDBCardBody className='p-5 d-flex flex-column align-items-center mx-auto w-100'>
                    
                        <h2 className="fw-bold mb-2 text-uppercase">Registration</h2>
                        <p className="text-white-50 mb-5">Please enter your information!</p>    
                        
                        <MDBCol md='12'>

                            <MDBInput wrapperClass='mb-4' label='full name'  type='text'
                                onChange={handleBioDataChange} value={bioData.full_name} id="full_name" className="form-control" name="full_name"/>

                            <MDBInput wrapperClass='mb-4' label='Login' type='text'
                            onChange={handleBioDataChange} value={bioData.username} id="username" className="form-control" name="username" required=""/>
                            
                            <MDBInput wrapperClass='mb-4' label='Email' type='email'
                            onChange={handleBioDataChange} value={bioData.email} id="email" className="form-control" name="email" required=""/>
                            
                            <MDBInput wrapperClass='mb-4' label='Password' type='password'
                            onChange={handleBioDataChange} value={bioData.password} id="password" className="form-control" name="password" placeholder="**************" required=""/>

                            <MDBInput wrapperClass='mb-4' label='Confirm password' type='password'
                            onChange={handleBioDataChange} value={bioData.password2} id="password2" className="form-control" name="password2" placeholder="**************" required=""/>

                        
                                {isLoading && <LoadingIndicator />}
                                <MDBBtn outline className='mx-2 px-5' color='white' size='lg'>
                                Register
                                </MDBBtn>
            
                            </MDBCol>
                    </MDBCardBody>
                    </MDBCard>
            
                </MDBCol>
                </MDBRow>
            </form>
        </MDBContainer>
    );
}

export default Register;