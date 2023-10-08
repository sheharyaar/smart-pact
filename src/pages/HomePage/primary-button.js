import React from "react";
import PropTypes from "prop-types";
import "./primary-button.css";
import { useNavigate } from "react-router-dom";

const PrimaryButton = (props) => {
  const navigate = useNavigate();
  return (
    <div className="primary-button-container">
      <button
        className="primary-button-button MediumLabel button"
        onClick={() => navigate(`/login`)}
      >
        {props.button}
      </button>
    </div>
  );
};

PrimaryButton.defaultProps = {
  button: "Button",
};

PrimaryButton.propTypes = {
  button: PropTypes.string,
};

export default PrimaryButton;
