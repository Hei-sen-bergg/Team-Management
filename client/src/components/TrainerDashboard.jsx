
import React from 'react';

function TrainerDashboard({ user }) {
  return (
    <div className="dashboard">
      <h2>Welcome Trainer, {user.name}</h2>
    </div>
  );
}

export default TrainerDashboard;