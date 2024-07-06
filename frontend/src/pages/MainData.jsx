import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import {
  ArrowDownIcon,
  MoreOptionsIcon,
  DownloadIcon,
  CopyIcon,
  DeleteIcon,
  ShareIcon,
  EditIcon,
} from "../common/SvgIcons";
import pic from "../assets/logo.png";
import { convertDates } from "../common/common";
import {
  EmailShareButton,
  FacebookShareButton,
  TelegramShareButton,
  WhatsappShareButton,
  EmailIcon,
  FacebookIcon,
  TelegramIcon,
  WhatsappIcon,
} from "react-share";
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBInput
} from 'mdb-react-ui-kit';
import { toast } from "react-toastify";
import LottieImage from "../common/LottieImage";
import apiInstance from "../utils/axios";
import useUserData from "../plugin/useUserData";
import Swal from "sweetalert2";


// MainData component renders the main data grid with file information and options
const MainData = ({
  handleOptionsClick,
  optionsVisible,
  handleDelete
}) => {
  const [showShareIcons, setShowShareIcons] = useState(false);
  const optionsMenuRef = useRef(null);
  const [files, setFiles] = useState([]);
  const userId = useUserData()?.user_id;
  const [basicModal, setBasicModal] = useState(false);
  const [fileId, setFileId] = useState([])
  const [newFileName, setNewFilename] = useState([])

  
  const toggleOpen = () => setBasicModal(!basicModal);
  console.log(fileId)
  console.log(newFileName)
  
  const handleChange = async() => {
    console.log(fileId)
    console.log(newFileName)
    const formData =  new FormData()
    formData.append("filename", newFileName)
    await apiInstance.patch(`file/edit/${fileId}`, formData, {
      headers: {
          "Content-Type": "multipart/form-data",
      }
    }).then((response)=>{
      Swal.fire({
        icon: "success",
        title: "file name changed successfully.",})
        console.log(response)
    }). catch((error)=> console.log(error))
    setBasicModal(!basicModal)
  }
  
  const fetchfiles = async () => {
      const file_res = await apiInstance.get(`files/${userId}/`);
      setFiles(file_res.data);
      console.log(file_res.data);
      console.log(file_res.data[0]);
  };

  useEffect(() => {
      fetchfiles();
  }, []);

 
  const downloadFile = async (uid, title) => {
    await apiInstance.get(`download/${uid}`,{
      responseType: 'blob'
    })
    .then((response)=>{
      console.log(response)
      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', title);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url)
    }). catch((error)=> console.log(error))
    }
  
  const handleShareClick = () => {
    setShowShareIcons(!showShareIcons);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        optionsMenuRef.current &&
        !optionsMenuRef.current.contains(event.target) &&
        !event.target.closest(".optionsContainer") &&
        !event.target.closest(".shareButton")
      ) {
        setShowShareIcons(false);
        handleOptionsClick(null); // Close options menu if open
      }      
    };

    const handleDocumentClick = (event) => {
      handleOutsideClick(event);
    };

    document.addEventListener("mousedown", handleDocumentClick);

    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
    };
  }, [handleOptionsClick]);

  return (
    <div>
      {/* Header row for the data list */}
      {files.length > 0 && (
        <DataListRow>
          <div>
            <b>
              <ArrowDownIcon /> Name
            </b>
          </div>
          <div className="comment">
            <b>Comment</b>
          </div>
          <div className="fileSize">
            <b>File Size</b>
          </div>
          <div className="upload">
            <b>Upload date</b>
          </div>
          <div>
            <b>Options</b>
          </div>
        </DataListRow>
      )}

      {/* Render each file in the data list */}
      {files.length > 0 ? (
        files?.map((file) => (
          <DataListRow key={file.id}>
            <div>  
              {/* File details and icon */}
              <a href={file.file} target="_blank">            

                <span title={file.filename}>{file.filename}</span>
              </a>
            </div>
            <div className="comment">{file.comment}</div>
            <div className="fileSize">{file.size}</div>
            <div className="modified">
              {/* Display last modified date */}
              {convertDates(file.upload_datetime)}
            </div>
            <div>
              {/* Options menu for each file */}
              <OptionsContainer
                className="optionsContainer"
                title="Options"
                onClick={() => handleOptionsClick(file.id)}
              >
                <MoreOptionsIcon />
              </OptionsContainer>
              {optionsVisible === file.id && (
                // Display options menu when optionsVisible matches file id
                <OptionsMenu ref={optionsMenuRef}>
                  {/* Various options available for each file */}
                  <span>
                    <span
                      onClick={() => {downloadFile(file.uid, file.filename)}}>
                      <DownloadIcon />
                      {" Download"}
                    </span>
                  </span>
                  <span
                    onClick={() => {
                      // Copy file URL to clipboard
                      navigator.clipboard.writeText(file.share_link);
                      toast.success("Link Copied");
                    }}
                  >
                    <CopyIcon />
                    {" Copy Link"}
                  </span>
                  {/* Share button with share icons */}
                  <ShareButton
                    className="shareButton"
                    onClick={handleShareClick}
                  >
                    <ShareIcon />
                    {" Share"}
                    <span className={showShareIcons ? "show" : ""}>
                      {/* Share icons for various platforms */}
                      <EmailShareButton
                        url={file.share_link}
                        subject={`This is ${file.filename} file link`}
                      >
                        <EmailIcon size={30} round={true} />
                      </EmailShareButton>

                      <FacebookShareButton
                        url={file.share_link}
                        hashtag={file.filename}
                      >
                        <FacebookIcon size={30} round={true} />
                      </FacebookShareButton>

                      <TelegramShareButton
                        url={file.share_link}
                        title={`This is ${file.filename} file link`}
                      >
                        <TelegramIcon size={30} round={true} />
                      </TelegramShareButton>

                      <WhatsappShareButton
                        url={file.share_link}
                        title={`This is ${file.filename} file link`}
                      >
                        <WhatsappIcon size={30} round={true} />
                      </WhatsappShareButton>
                    </span>
                  </ShareButton>
                  {/* Delete button */}
                  <span onClick={() => handleDelete(file.id)}>
                    <button>
                      <DeleteIcon />
                      {"Delete"}
                    </button>
                  </span>
                  <span onClick={() => setFileId(file.id)}>
                    <button onClick={toggleOpen} >
                    <EditIcon/>
                    {"Edit name"}
                    </button>       
                  </span>
                </OptionsMenu>
              )}
            </div>
          </DataListRow>
        ))
      ) : (
        // Render a Lottie animation if no files are available
        <LottieImage
          imagePath={pic}
          text1={"A place for all of your files"}
          text2={"Use the 'New' button to upload your files"}
        />
      )
      }
      <>      
      <MDBModal open={basicModal} onClose={() => setBasicModal(false)} tabIndex='-1'>
        <MDBModalDialog>
          <MDBModalContent>
          <form onSubmit={handleChange}>
            <MDBModalHeader>
              <MDBModalTitle>Set new filename</MDBModalTitle>
              <MDBBtn className='btn-close' color='none' onClick={toggleOpen}></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
            <MDBInput label="New file name" id="form1" type="text" onChange={(e)=>setNewFilename(e.target.value)} />
            </MDBModalBody>
            
            <MDBModalFooter>
              <MDBBtn color='secondary' onClick={toggleOpen}>
                Close
              </MDBBtn>
              <MDBBtn type="submit" className="modal__submit">Save changes</MDBBtn>
            </MDBModalFooter>
            </form>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
    </div>
  );
};

// Styled components for the data list row and options menu
const DataListRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 2fr 1fr 1.5fr 1fr;
  border-bottom: 1px solid #ccc;
  padding: 10px;

  div:last-child {
    justify-self: flex-end;
    padding-right: 10px;
    font-size: 13px;
    position: relative;
  }

  div,
  a {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-size: 13px;
    b {
      display: flex;
      align-items: center;
    }
    svg {
      font-size: 22px;
      margin: 10px;
    }

    .starr {
      color: #ffc700;
    }
  }

  div {
    text-decoration: none;

    a {
      color: gray;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0;
      span {
        color: #000;
        font-weight: 600;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        word-wrap: break-word;
        width: 20ch;

        @media screen and (max-width: 768px) {
          width: 10ch;
        }
      }
    }
  }

  @media screen and (max-width: 768px) {
    grid-template-columns: 2fr 1fr 1fr;
    .modified {
      display: none;
    }
  }

  @media screen and (max-width: 319px) {
    grid-template-columns: 2fr 1fr;
    .fileSize {
      display: none;
    }
  }
`;

const OptionsContainer = styled.span`
  cursor: pointer;
`;

const OptionsMenu = styled.span`
  display: flex;
  align-items: center;
  flex-direction: column;
  position: absolute;
  background-color: #fff;
  border: 2px solid #ccc;
  top: -200%;
  right: 100%;
  cursor: pointer;
  z-index: 10;
  width: max-content;
  min-width: 120px;
  border-radius: 10px;

  &::before {
    content: "";
    position: absolute;
    width: 15px;
    height: 15px;
    background-color: #fff;
    top: 100px;
    right: -8px;
    transform: rotate(45deg);
    border-right: 1px solid #ccc;
    border-top: 1px solid #ccc;
  }

  span {
    width: 100%;
    border-bottom: 2px solid #ccc;
    padding: 10px;
    display: flex;
    align-items: center;

    a {
      color: #000;
    }

    &:last-child {
      border-bottom: none;
    }

    &:hover {
      background-color: #ccc;
      z-index: 11;
    }
  }

  button {
    background-color: transparent;
    border: none;
    color: red;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  a {
    color: #000;
    background-color: transparent;
  }

  .fileSize,
  .uploaded {
    background-color: #f0f0f0;
    cursor: default;
  }
`;

const ShareButton = styled.span`
  position: relative;
  cursor: pointer;

  span {
    width: max-content;
    height: max-content;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 0;
    position: absolute;
    top: -80px;
    left: -60px;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease-in-out;
  }

  .show {
    opacity: 1;
    visibility: visible;
  }

  &:hover {
    span {
      background-color: transparent;
    }
  }
`;

export default MainData;