import React, { useState, useEffect } from "react";
import axios from "axios";

const BatchManagement = () => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [batches, setBatches] = useState([]);
  const [newBatch, setNewBatch] = useState({ batchName: "", startDate: "", trainerId: "", courseId: "" });
  const [editingBatchId, setEditingBatchId] = useState(null);
  const [trainers, setTrainers] = useState([]); // Store trainers list
  const [courses, setCourses] = useState([]); // Store courses list

  useEffect(() => {
    fetchBatches();
    fetchAvailableOptions();
  }, []);

  // Fetch Batches
  const fetchBatches = async () => {
    try {
      const response = await axios.get(`${apiUrl}/admin/list-batches`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setBatches(response.data.batches);
    } catch (error) {
      console.error("Error fetching batches:", error.response?.data || error.message);
    }
  };

  // Fetch available trainers and courses for the dropdown
  const fetchAvailableOptions = async () => {
    try {
      const response = await axios.get(`${apiUrl}/admin/get-trainers`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const responsecourse = await axios.get(`${apiUrl}/admin/get-courses`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      console.log(response.data)
      setTrainers(response.data); // Trainers list
      console.log(trainers)
      setCourses(responsecourse.data); // Courses list
    } catch (error) {
      console.error("Error fetching options:", error.response?.data || error.message);
    }
  };

  // Add or Update Batch
  const handleSaveBatch = async () => {
    try {
      if (editingBatchId) {
        await axios.put(`${apiUrl}/admin/update-batch/${editingBatchId}`, newBatch, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
      } else {
        await axios.post(`${apiUrl}/admin/add-batch`, newBatch, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
      }
      fetchBatches();
      setNewBatch({ batchName: "", startDate: "", trainerId: "", courseId: "" });
      setEditingBatchId(null);
    } catch (error) {
      console.error("Error saving batch:", error.response?.data || error.message);
    }
  };

  // Delete Batch
  const handleDeleteBatch = async (id) => {
    try {
      await axios.delete(`${apiUrl}/admin/delete-batch/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchBatches();
    } catch (error) {
      console.error("Error deleting batch:", error.response?.data || error.message);
    }
  };

  // Edit Batch (Pre-fill input fields)
  const handleEditBatch = (batch) => {
    console.log('Batch data:', batch); // Add this line to debug
    setNewBatch({
      batchName: batch.batchName,
      startDate: batch.startDate,
      trainerId: batch.trainerId?._id || batch.trainerId, // Handle both object and direct ID
      courseId: batch.courseId?._id || batch.courseId,    // Handle both object and direct ID
    });
    setEditingBatchId(batch._id);
  };

  return (
    <div className="users-container">
      <div className="page-header">
        <h2>Batch Management</h2>
      </div>

      <div className="content-wrapper">
        {/* Batch Form */}
        <div className="card">
          <h3>{editingBatchId ? "Edit Batch" : "Add New Batch"}</h3>
          <form className="user-form" onSubmit={(e) => {
            e.preventDefault();
            handleSaveBatch();
          }}>
            <div className="form-group">
              <input
                type="text"
                placeholder="Batch Name"
                value={newBatch.batchName}
                onChange={(e) => setNewBatch({ ...newBatch, batchName: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <input
                type="date"
                placeholder="Start Date"
                value={newBatch.startDate}
                onChange={(e) => setNewBatch({ ...newBatch, startDate: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <select
                value={newBatch.trainerId}
                onChange={(e) => setNewBatch({ ...newBatch, trainerId: e.target.value })}
                required
              >
                <option value="">Select Trainer</option>
                {trainers.map((trainer) => (
                  <option key={trainer._id} value={trainer._id}>
                    {trainer.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <select
                value={newBatch.courseId}
                onChange={(e) => setNewBatch({ ...newBatch, courseId: e.target.value })}
                required
              >
                <option value="">Select Course</option>
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="button-group">
              <button type="submit" className="btn-primary">
                {editingBatchId ? "Save Changes" : "Add Batch"}
              </button>
              {editingBatchId && (
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    setEditingBatchId(null);
                    setNewBatch({ batchName: "", startDate: "", trainerId: "", courseId: "" });
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Batches List */}
        <div className="card table-card">
          <div className="table-responsive">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Batch Name</th>
                  <th>Start Date</th>
                  <th>Trainer</th>
                  <th>Course</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {batches.map((batch) => (
                  <tr key={batch._id}>
                    <td>{batch.batchName}</td>
                    <td>{new Date(batch.startDate).toLocaleDateString()}</td>
                    <td>{batch.trainerId?.name || "Unknown"}</td>
                    <td>{batch.courseId?.name || "Unknown"}</td>
                    <td className="action-buttons">
                      <button
                        className="btn-edit"
                        onClick={() => handleEditBatch(batch)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDeleteBatch(batch._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchManagement;
