import React from "react";

export const RectangleControls: React.FC = () => {
  const handleCreate = () => {
    parent.postMessage(
      { pluginMessage: { type: "create-rectangles" } },
      "*"
    );
  };

  return (
    <section className="card">
      <h2 className="card-title">Create rectangles</h2>
      <p className="card-description">
        Click the button below to insert two rectangles side by side on the
        current page.
      </p>
      <button className="primary-button" onClick={handleCreate}>
        Insert 2 rectangles
      </button>
    </section>
  );
};











