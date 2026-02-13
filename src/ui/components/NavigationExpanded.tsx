import React from "react";
import "./NavigationExpanded.css";
import { mainNavOptions, renderSubFeature } from "./toolRegistry";

interface NavigationExpandedProps {
  selectedMainId: string | null;
}

export const NavigationExpanded: React.FC<NavigationExpandedProps> = ({
  selectedMainId,
}) => {
  if (!selectedMainId) {
    return null;
  }

  const main = mainNavOptions.find((m) => m.id === selectedMainId);
  const subFeatures = main?.subFeatures ?? [];

  return (
    <div className="navigation-expanded">
      <div className="navigation-expanded-content">
        {subFeatures.map((sub) => (
          <React.Fragment key={sub.id}>
            {renderSubFeature(sub.id)}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
