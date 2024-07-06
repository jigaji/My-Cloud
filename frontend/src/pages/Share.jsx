import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiInstance from "../utils/axios";


export default function SharePage() {
  const navigate = useNavigate();
  const [fileData, setFileData] = useState("");
  const { code } = useParams();
  console.log(code)

  const openFile = async () => {
    await apiInstance.get(`/share/${code}/`,{
      responseType: 'blob'})
      .then((response)=>{
        console.log(response.data)
        const url = window.URL.createObjectURL(response.data);
        const link = document.createElement('a');
        link.href = url
        link.click();})

};

  useEffect(() => {
      openFile();
  }, []);
  
  
}