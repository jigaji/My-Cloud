import React, { useState, useEffect} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { convertDates } from "../../common/common";
import Swal from "sweetalert2";

import apiInstance from '../../utils/axios';



function AdminFiles() {
    const [files, setfiles] = useState([]);
    const [optionsVisible, setOptionsVisible] = useState(null);

    const { code } = useParams();


    const fetchfiles = async () => {
        const file_res = await apiInstance.get(`files/${code}/`);
        setfiles(file_res.data);
        console.log(file_res.data[0]);
    };

    useEffect(() => {
        fetchfiles();
    }, []);

    const handleDelete = async (id) => {
        console.log(id)

        try {
            // Confirm deletion with a window prompt
            const confirmed = window.confirm(
            "Are you sure you want to delete this file?"
            );

            if (confirmed) {
            // Reference to the document in Firestore
            await apiInstance.delete(`file/delete/${id}`)
            Swal.fire({
                icon: "success",
                title: "File has been deleted",
            }).then(function(){location.reload()});
            }
        } catch (error) {
            // Log any errors that occur during the deletion processs
            console.error("Error deleting document: ", error);
        } finally {
            // Set options visibility after deletion attempt
            setOptionsVisible(id);
            
        }
        };


    return (
        <>
        
        <div >
            <h5 className="mb-2 mb-sm-0">
                All files <span className="badge bg-primary bg-opacity-10 text-primary">{files?.length}</span>
            </h5>                                      
        </div>
    
        <div className="card-body">                                              
        {/* Search and select END */}
        {/* Blog list table START */}
            <div className="table-responsive border-0">
                <table className="table align-middle p-4 mb-0 table-hover table-shrink">
                    <tbody className="border-top-0">
                        {files?.map((p) => (
                            <tr>                                            
                                <td>
                                    <a href={p.file} target="_blank">          
                                    <span title={p.filename}>{p.filename}</span>
                                    </a>
                                </td>   
                                <td>
                                    <h6 className="mt-2 mt-md-0 mb-0 ">                                                               
                                            {p?.size}
                                        
                                    </h6>
                                </td>  
                                <td>
                                    <h6 className="mt-2 mt-md-0 mb-0 ">
                                    
                                            {convertDates(p?.upload_datetime)}
                                        
                                    </h6>
                                </td>                                                        
                
                                <td>
                                    <div className="d-flex gap-2">
                                        <span className="btn-round mb-0 btn btn-danger" data-bs-toggle="tooltip" 
                                            data-bs-placement="top"  title="Delete" onClick={() => handleDelete(p.id)}>
                                            Delete
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
        </>
    );
}

export default AdminFiles;