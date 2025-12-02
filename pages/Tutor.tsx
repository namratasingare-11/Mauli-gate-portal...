
import React from 'react';
import { Navigate } from 'react-router-dom';

// AI Tutor feature has been removed.
// Redirecting to dashboard if accessed directly.

export const Tutor: React.FC = () => {
  return <Navigate to="/" replace />;
};
