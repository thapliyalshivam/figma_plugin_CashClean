import React, { useState } from "react";
import { Header } from "./components/Header";
import { Navigation } from "./components/Navigation";
import { NavigationExpanded } from "./components/NavigationExpanded";
import { navigationOptions, renderTool } from "./components/toolRegistry";

export const App: React.FC = () => {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(
    "option1"
  );

  const handleNavigationSelect = (id: string) => {
    setSelectedOptionId(id);
  };

  return (
    <div className="plugin-root">
      <Header />
      <Navigation
        options={navigationOptions}
        selectedId={selectedOptionId}
        onSelect={handleNavigationSelect}
      />
      <NavigationExpanded selectedOptionId={selectedOptionId}>
        {renderTool(selectedOptionId)}
      </NavigationExpanded>
    </div>
  );
};





