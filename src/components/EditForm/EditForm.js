import React from 'react';
import {Button, Modal, InputGroup, FormControl} from 'react-bootstrap';
import {AiOutlineEdit} from 'react-icons/ai';
import style from './style.module.css'


function EditForm({show, handleClose, formData, handleChangeItem, onHandleUpdateItem, title,name, value}) {
    return (
      <Modal show={show} onHide={handleClose}>
        <Modal.Header >
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Edit {title} Title</h5>
          <InputGroup>
              <InputGroup.Text id="basic-addon1"><AiOutlineEdit /></InputGroup.Text>
              <FormControl
              placeholder={`Please Edit ${title}`}
              name={name}
              aria-describedby="basic-addon1"
              required
              value={value}
              onChange={handleChangeItem}
              />
              {/* <Button type="submit"  className={style['btn']} variant="outline-secondary" id="button-addon2">
              Update
              </Button> */}
          </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={onHandleUpdateItem} variant="primary">
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    );
}


export default EditForm;