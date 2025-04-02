import React, { useState, useEffect } from "react";
import axios from "axios";


const CourseManagement = () => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({ name: "", description: "", duration: "" });
  const [editingCourseId, setEditingCourseId] = useState(null); // Track which course is being edited

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${apiUrl}/admin/list-courses`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setCourses(response.data.courses);
    } catch (error) {
      console.error("Error fetching courses:", error.response?.data || error.message);
    }
  };


  const handleAddCourse = async () => {
    try {
      if (editingCourseId) {
        await axios.put(`${apiUrl}/admin/update-course/${editingCourseId}`, newCourse, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

    } else {
        await axios.post(`${apiUrl}/admin/add-course`, newCourse, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
      }
      fetchCourses();
      setNewCourse({ name: "", description: "", duration: "" });
      setEditingCourseId(null); // Reset editing mode
    } catch (error) {
      console.error("Error saving course:", error.response?.data || error.message);
    }
  };


    // Delete Course
    const handleDeleteCourse = async (id) => {
        try {
          await axios.delete(`${apiUrl}/admin/delete-course/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          });
          fetchCourses();
        } catch (error) {
          console.error("Error deleting course:", error.response?.data || error.message);
        }
      };
    
      // Edit Course (Pre-fill input fields)
      const handleEditCourse = (course) => {
        setNewCourse({ name: course.name, description: course.description, duration: course.duration });
        setEditingCourseId(course._id);
      };




  return (
    <div className="users-container">
      <div className="page-header">
        <h2>Course Management</h2>
      </div>

      <div className="content-wrapper">
        <div className="form-section">
          {/* Add Course Form */}
          <div className="card">
            <h3>{editingCourseId ? "Edit Course" : "Add New Course"}</h3>
            <form className="user-form" onSubmit={(e) => {
              e.preventDefault();
              handleAddCourse();
            }}>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Course Name"
                  value={newCourse.name}
                  onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <input
                  type="text"
                  placeholder="Description"
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <input
                  type="text"
                  placeholder="Duration"
                  value={newCourse.duration}
                  onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}
                  required
                />
              </div>

              <div className="button-group">
                <button type="submit" className="btn-primary">
                  {editingCourseId ? "Save Changes" : "Add Course"}
                </button>
                {editingCourseId && (
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => {
                      setEditingCourseId(null);
                      setNewCourse({ name: "", description: "", duration: "" });
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Course List */}
        <div className="card table-card">
          <div className="table-responsive">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Course Name</th>
                  <th>Description</th>
                  <th>Duration</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course._id}>
                    <td>{course.name}</td>
                    <td>{course.description}</td>
                    <td>{course.duration}</td>
                    <td className="action-buttons">
                      <button
                        className="btn-edit"
                        onClick={() => handleEditCourse(course)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDeleteCourse(course._id)}
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

export default CourseManagement;


