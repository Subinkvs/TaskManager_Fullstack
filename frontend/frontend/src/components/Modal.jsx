import React, { useState, useEffect } from "react";
// importing all of these classes from reactstrap module
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Input,
  Label
} from "reactstrap";

const CustomModal = ({ activeItem: initialActiveItem, toggle, onSave }) => {
  // Set initial state from props
  const [activeItem, setActiveItem] = useState(initialActiveItem);

  // Handle changes to input fields
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    console.log("Handle Change:", { name, value, type, checked }); // Debugging
    setActiveItem((prevItem) => ({
      ...prevItem,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Use useEffect to update local state if props change
  useEffect(() => {
    setActiveItem(initialActiveItem);
  }, [initialActiveItem]);

  // Debugging: Log the activeItem state
  useEffect(() => {
    console.log("Active Item State:", activeItem);
  }, [activeItem]);

  return (
    <Modal isOpen={true} toggle={toggle}>
      <ModalHeader toggle={toggle}>Task Item</ModalHeader>
      <ModalBody>
        <Form>
          {/* Title input */}
          <FormGroup>
            <Label for="title">Title</Label>
            <Input
              type="text"
              name="title"
              value={activeItem.title}
              onChange={handleChange}
              placeholder="Enter Task Title"
            />
          </FormGroup>

          {/* Description input */}
          <FormGroup>
            <Label for="description">Description</Label>
            <Input
              type="text"
              name="description"
              value={activeItem.description}
              onChange={handleChange}
              placeholder="Enter Task Description"
            />
          </FormGroup>

          {/* Completed checkbox */}
          <FormGroup check>
            <Label for="completed">
              <Input
                type="checkbox"
                name="status"
                checked={activeItem.status}
                onChange={handleChange}
              />
              Completed
            </Label>
          </FormGroup>
        </Form>
      </ModalBody>
      {/* Modal footer */}
      <ModalFooter>
        <Button color="success" onClick={() => onSave(activeItem)}>
          Save
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default CustomModal;

