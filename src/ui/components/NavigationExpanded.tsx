import React from "react";
import "./NavigationExpanded.css";

interface NavigationExpandedProps {
  selectedOptionId: string | null;
  children?: React.ReactNode;
}

export const NavigationExpanded: React.FC<NavigationExpandedProps> = ({
  selectedOptionId,
  children,
}) => {
  if (!selectedOptionId) {
    return null;
  }

  return (
    <div className="navigation-expanded">
      <div className="navigation-expanded-content">{children}</div>
    </div>
  );
};







