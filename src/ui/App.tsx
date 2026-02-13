import React, { useState } from "react";
import { Header } from "./components/Header";
import { Navigation } from "./components/Navigation";
import { NavigationExpanded } from "./components/NavigationExpanded";
import { mainNavOptions } from "./components/toolRegistry";

export const App: React.FC = () => {
  const [selectedMainId, setSelectedMainId] = useState<string | null>("copy");

  const mainOptions = mainNavOptions.map((m) => ({ id: m.id, label: m.label }));

  return (
    <div className="plugin-root">
      <Header />
      <Navigation
        options={mainOptions}
        selectedId={selectedMainId}
        onSelect={setSelectedMainId}
      />
      <NavigationExpanded selectedMainId={selectedMainId} />
    </div>
  );
};
