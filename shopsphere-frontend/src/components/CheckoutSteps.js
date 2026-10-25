import React from "react";
import "../styles/CheckoutSteps.css";
import CheckIcon from "@material-ui/icons/Check";

const CheckoutSteps = (props) => {
  const steps = [
    { num: 1, label: "Sign-In", active: props.step1, completed: props.step2 },
    { num: 2, label: "Shipping", active: props.step2, completed: props.step3 },
    { num: 3, label: "Payment", active: props.step3, completed: props.step4 },
    { num: 4, label: "Place Order", active: props.step4, completed: false },
  ];

  return (
    <nav className="checkout-stepper-nav" aria-label="Checkout Progress">
      <div className="stepper-track-wrapper">
        {steps.map((step, index) => (
          <React.Fragment key={step.num}>
            <div
              className={`step-bubble-cell ${
                step.completed ? "completed" : step.active ? "active" : ""
              }`}
            >
              <div className="step-circle">
                {step.completed ? (
                  <CheckIcon fontSize="small" />
                ) : (
                  <span>{step.num}</span>
                )}
              </div>
              <span className="step-title-text">{step.label}</span>
            </div>

            {index < steps.length - 1 && (
              <div
                className={`step-connector-line ${
                  step.completed ? "completed" : ""
                }`}
              ></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </nav>
  );
};

export default CheckoutSteps;
