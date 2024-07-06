import styled from "styled-components";
import { useEffect, useState } from "react";
import MainData from "./MainData";
import PageHeader from "../common/PageHeader";
import Swal from "sweetalert2";
import apiInstance from "../utils/axios";
import useUserData from "../plugin/useUserData";


const Data = () => {
    const [files, setFiles] = useState([]);
    const [optionsVisible, setOptionsVisible] = useState(null);
    const userId = useUserData()?.user_id;

    console.log(useUserData());

    const fetchFiles = async () => {
        const file_res = await apiInstance.get(`files/${userId}/`);
        setFiles(file_res.data);        
    };
  
    useEffect(() => {
        fetchFiles();
    }, []);


    const handleDelete = async (id) => {
        console.log(id)

        try {
            const confirmed = window.confirm(
            "Are you sure you want to delete this file?"
            );
            if (confirmed) {
            await apiInstance.delete(`file/delete/${id}`)
            Swal.fire({
                icon: "success",
                title: "File has been deleted",
            }).then(function(){location.reload()});
            }
        } catch (error) {
            console.error("Error deleting document: ", error);
        } finally {
            setOptionsVisible(id);    
        }
        };


    const handleOptionsClick = (id) => {
        setOptionsVisible((prevVisible) => (prevVisible === id ? null : id));
        };

        return (
        <DataContainer>
            <PageHeader pageTitle={"My Cloud"} />
            <div>
                <MainData
                files={files}
                handleOptionsClick={handleOptionsClick}
                optionsVisible={optionsVisible}
                handleDelete={handleDelete}
                />
            </div>
        </DataContainer>
        );
        };


const DataContainer = styled.div`
flex: 1;
padding: 10px 0px 0px 20px;

h4 {
font-size: 14px;
margin-top: 30px;
margin-bottom: -20px;

@media screen and (max-width: 768px) {
    display: none;
}
}
`;


export default Data;