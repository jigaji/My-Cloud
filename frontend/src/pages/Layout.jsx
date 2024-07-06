// Layout.js

import React from 'react';
import Header from './Header';
import { Outlet } from 'react-router-dom';
import styled from "styled-components";


const Layout = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Page>
        <p className='text'>
            Hello, guys!
            This is cloud storage to keep and share files.
            I hope you will enjoy it💗<br/>
            To use it please sign up or login.
        </p>
      </Page>
      
    </>
  );
};

const Page = styled.div`
.text {
    font-size: 55px;
    font-weight : 700;
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 50px;
    line-height: 0.9;
    color:#9370DB;
    
  }`
export default Layout;