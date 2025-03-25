import React from "react";

function StudentDashboard({ user }) {
  return (
    <div className="dashboard">
      <h2>Welcome Student, {user.name}</h2>
    </div>
  );
}

export default StudentDashboard;