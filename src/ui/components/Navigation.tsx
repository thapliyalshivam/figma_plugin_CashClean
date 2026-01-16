import React from "react";
import "./Navigation.css";

export interface NavigationOption {
  id: string;
  label: string;
}

interface NavigationProps {
  options: NavigationOption[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  options,
  selectedId,
  onSelect,
}) => {
  return (
    <div className="navigation-container">
      <div className="navigation-scroll">
        {options.map((option) => (
          <button
            key={option.id}
            className={`navigation-pill ${
              selectedId === option.id ? "navigation-pill--active" : ""
            }`}
            onClick={() => onSelect(option.id)}
          >
            <span className="navigation-pill-text">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};







