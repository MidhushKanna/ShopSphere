import React, { useState } from "react";
import "../styles/PriceCheckBox.css";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";

const PriceCheckBox = (props) => {
  const [selectedId, setSelectedId] = useState(0);

  const handleSelect = (id) => {
    setSelectedId(id);
    props.handleFilters(id);
  };

  return (
    <div className="price-filters-list">
      {props.list.map((price) => {
        const isSelected = selectedId === price.id;
        return (
          <button
            key={price.id}
            type="button"
            className={`price-filter-item-btn ${isSelected ? "selected" : ""}`}
            onClick={() => handleSelect(price.id)}
          >
            <div className="filter-radio-icon">
              {isSelected ? (
                <CheckCircleIcon fontSize="small" className="radio-checked" />
              ) : (
                <RadioButtonUncheckedIcon
                  fontSize="small"
                  className="radio-unchecked"
                />
              )}
            </div>
            <span className="price-filter-label">{price.name}</span>
          </button>
        );
      })}
    </div>
  );
};

export default PriceCheckBox;
