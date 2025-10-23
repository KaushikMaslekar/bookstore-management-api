import React from "react";

interface LoadingSpinnerProps {
  size?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "3rem",
}) => {
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "200px" }}
    >
      <div
        className="spinner-border text-primary"
        role="status"
        style={{ width: size, height: size }}
      >
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};
