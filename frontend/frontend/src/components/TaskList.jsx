import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CustomModal from "./Modal";
import axios from "axios";
import "../styles/taskmanager.css"; // Add your own custom styles here

const TaskList = () => {
  const [viewCompleted, setViewCompleted] = useState(false);
  const [activeItem, setActiveItem] = useState({
    title: "",
    description: "",
    status: false,
  });
  const [taskList, setTaskList] = useState([]);
  const [modal, setModal] = useState(false);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("access_token");

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    refreshList();
  }, []);

  const refreshList = (url = "http://localhost:8000/api/tasks/?limit=5&offset=0") => {
    setLoading(true);
    axios
      .get(url, axiosConfig)
      .then((res) => {
        setTaskList(res.data.results);  // Use 'results' to access task data
        setNextPage(res.data.next);      // URL for the next page
        setPrevPage(res.data.previous);  // URL for the previous page
      })
      .catch((err) => {
        if (err.response.status === 401) {
          alert("You are not authorized. Please log in.");
          navigate("/login");
        }
        console.log(err);
      })
      .finally(() => setLoading(false));
  };

  const displayCompleted = (status) => {
    setViewCompleted(status);
  };

  const renderTabList = () => (
    <div className="d-flex justify-content-center mb-4">
      <button
        className={`btn btn-outline-${viewCompleted ? "primary" : "secondary"} mx-2`}
        onClick={() => displayCompleted(true)}
      >
        Completed
      </button>
      <button
        className={`btn btn-outline-${!viewCompleted ? "primary" : "secondary"} mx-2`}
        onClick={() => displayCompleted(false)}
      >
        Incomplete
      </button>
    </div>
  );

  const viewDetails = (id) => {
    navigate(`/task/${id}`); // Navigate to task detail page
  };

  const renderItems = () => {
    const filteredTasks = taskList.filter((item) => item.status === viewCompleted);
    return filteredTasks.map((item) => (
      <div key={item.id} className="card my-3 shadow-sm">
        <div className="card-body d-flex justify-content-between align-items-center">
          <span
            className={`todo-title ${viewCompleted ? "completed-todo" : ""}`}
            title={item.description}
            onClick={() => viewDetails(item.id)} 
          >
            {item.title}
          </span>
          <div>
            <button
              onClick={() => editItem(item)}
              className="btn btn-sm btn-outline-secondary mr-2"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(item)}
              className="btn btn-sm btn-outline-danger"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    ));
  };

  const toggle = () => {
    setModal(!modal);
  };

  const handleSubmit = (item) => {
    toggle();
    if (item.id) {
      axios
        .put(`http://localhost:8000/api/tasks/${item.id}/`, item, axiosConfig)
        .then(() => refreshList())
        .catch((err) => console.log(err));
      return;
    }
    axios
      .post("http://localhost:8000/api/tasks/", item, axiosConfig)
      .then(() => refreshList())
      .catch((err) => console.log(err));
  };

  const handleDelete = (item) => {
    axios
      .delete(`http://localhost:8000/api/tasks/${item.id}/`, axiosConfig)
      .then(() => refreshList())
      .catch((err) => console.log(err));
  };

  const createItem = () => {
    const item = { title: "", description: "", completed: false };
    setActiveItem(item);
    toggle();
  };

  const editItem = (item) => {
    setActiveItem(item);
    toggle();
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/");
  };

  const renderPaginationButtons = () => (
    <div className="d-flex justify-content-between mt-4">
      {prevPage && (
        <button
          onClick={() => refreshList(prevPage)}
          className="btn btn-secondary"
        >
          Previous
        </button>
      )}
      {nextPage && (
        <button
          onClick={() => refreshList(nextPage)}
          className="btn btn-primary"
        >
          Next
        </button>
      )}
    </div>
  );

  return (
    <main className="content container mt-5">
      <h1 className="text-center text-uppercase mb-4">Task Manager</h1>
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card p-4 shadow-sm">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="text-primary">Tasks</h5>
              <div>
                <button onClick={createItem} className="btn btn-warning mx-2">
                  Add Task
                </button>
                <button onClick={handleLogout} className="btn btn-secondary">
                  Logout
                </button>
              </div>
            </div>
            {renderTabList()}
            <div>{loading ? <p>Loading tasks...</p> : renderItems()}</div>
            {renderPaginationButtons()}
          </div>
        </div>
      </div>
      {modal && (
        <CustomModal
          activeItem={activeItem}
          toggle={toggle}
          onSave={handleSubmit}
        />
      )}
    </main>
  );
};

export default TaskList;







