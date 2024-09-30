import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/taskmanager.css"; // Import the shared CSS file

const TaskDetail = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const token = localStorage.getItem("access_token");
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:8000/api/tasks/${id}/`, axiosConfig)
      .then((res) => setTask(res.data))
      .catch((err) => console.log(err));
  }, [id]);

  if (!task) return <p>Loading...</p>;

  return (
    <main className="content container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card p-4 shadow-sm">
            <h1 className="text-center text-uppercase mb-4">{task.title}</h1>
            <div className="card-body">
              <p><strong>Description:</strong> {task.description}</p>
              <p><strong>Status:</strong> {task.status ? "Completed" : "Incomplete"}</p>
            </div>
            <div className="d-flex justify-content-end">
              <button
                className="btn btn-secondary"
                onClick={() => navigate("/tasks")}
              >
                Back to Task List
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default TaskDetail;


