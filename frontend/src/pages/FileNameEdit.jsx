import React, { useState } from 'react';
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
import apiInstance from '../utils/axios';
import { EditIcon } from '../common/SvgIcons';

export default function FileNameEdit(id) {
  const [basicModal, setBasicModal] = useState(false);
  const [newFilename, setNewFilename] = useState('');



  const toggleOpen = () => setBasicModal(!basicModal);
  const handleChange = async() => {
    console.log(id)
    console.log(newFilename)
    const formData =  new FormData()
    formData.append("filename", newFilename)
    await apiInstance.patch(`admin/edit/file/${id}`, formData, {
      headers: {
          "Content-Type": "multipart/form-data",
      }
    })
  }


  return (
    <>
      <MDBBtn onClick={toggleOpen}><EditIcon />{"Edit name"}</MDBBtn>
      <MDBModal open={basicModal} onClose={() => setBasicModal(false)} tabIndex='-1'>
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Set new filename</MDBModalTitle>
              <MDBBtn className='btn-close' color='none' onClick={toggleOpen}></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
            <MDBInput label="New file name" id="form1" type="text" 
                value={newFilename} onChange={(e) => setNewFilename(e.target.value)} />
            </MDBModalBody>

            <MDBModalFooter>
              <MDBBtn color='secondary' onClick={toggleOpen}>
                Close
              </MDBBtn>
              <MDBBtn type="submit"  onChange={handleChange}>Save changes</MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
}