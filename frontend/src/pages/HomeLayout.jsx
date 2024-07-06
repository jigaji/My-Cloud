import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import styled from "styled-components";
import Header from "./Header";
import ProtectedRoute from "../layouts/PrivateRoute";
import MainWrapper from "../layouts/MainWrapper";

const HomeLayout = () => {
  return (
    <>
      
      <MainWrapper>
        <ProtectedRoute>
          <Header />
            <HomeContainer>
                <Sidebar />
                <Outlet />
            </HomeContainer>
        </ProtectedRoute>
      </MainWrapper> 
    </>
  );
};

const HomeContainer = styled.div`
  width: 100%;
  display: flex;
  flex: 1;
  position: relative;
`;

export default HomeLayout;