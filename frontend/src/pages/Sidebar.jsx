import React, { useState } from "react";
import styled from "styled-components";
import apiInstance from "../utils/axios";
import useUserData from "../plugin/useUserData";
import { useSelector } from "react-redux";
import { selectSidebarBool } from "../../store/BoolSlice";
import {FileUploadModal} from "./FileUploadModal";
import AddFile from "./AddFile";
import Swal from "sweetalert2";


const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [comment, setComment] = useState(null);
  const sidebarBool = useSelector(selectSidebarBool);
  const [selectedFile, setSelectedFile] = useState(null);
  const userId = useUserData()?.user_id
  console.log(userId)
  
  const handleFile = (e) => {
    if (e.target.files[0]) {
      setSelectedFile(e.target.files[0].name)
      setFile(e.target.files[0]);
    }
  };

  const handleComment = (e) => {
    if (e.target.value) {
      setComment(e.target.value);
      }
  };

 
  const handleUpload = async (e) => {
    e.preventDefault();
    setSelectedFile("");
    setUploading(true);
  const formdata = new FormData();

  formdata.append("by_user", userId);
  formdata.append("filename", file.name);
  formdata.append('file', file);
  formdata.append('comment', comment);

  console.log(file)
  console.log(formdata)
  try {
      const response = await apiInstance.post("file/upload/", formdata, {
          headers: {
              "Content-Type": "multipart/form-data",
          },
      });
      console.log(response.data);
      console.log("file Create");
      setUploading(false);
      Swal.fire({
          icon: "success",
          title: "file created successfully.",
      }).then(function(){location.reload()});
      setUploading(false);
      setFile(null);
      setOpen(false);
  } catch (error) {
      console.log(error);
      setUploading(false);
  }
  
};

  return (
    <>
      <FileUploadModal
        open={open}
        setOpen={setOpen}
        handleUpload={handleUpload}
        uploading={uploading}
        handleFile={handleFile}
        handleComment={handleComment}
        selectedFile={selectedFile}
      />

      <SidebarContainer sidebarbool={sidebarBool ? "true" : "false"}>
        <AddFile
          onClick={() => {
            setOpen(true);
          }}
        />
      </SidebarContainer>
    </>
  );
};

const SidebarContainer = styled.div`
  width: 180px;
  padding-top: 10px;
  border-right: 1px solid lightgray;
  transition: all 0.1s linear;
  position: ${(props) =>
    props.sidebarbool === "true" ? `relative` : "absolute"};
  left: ${(props) => (props.sidebarbool === "true" ? `0` : "-100%")};

  @media screen and (max-width: 768px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 65px;
  }
`;

export default Sidebar;