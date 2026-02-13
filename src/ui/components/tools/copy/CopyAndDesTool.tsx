import React, { useState } from "react";
import { SubFeatureLayout } from "../../SubFeatureLayout";
import "./CopyAndDesTool.css";

export const CopyAndDesTool: React.FC = () => {
  const [docUrl, setDocUrl] = useState("");
  const [docContent, setDocContent] = useState("");

  const handleSubmit = () => {
    parent.postMessage(
      {
        pluginMessage: {
          type: "copyanddes-action",
          docUrl: docUrl.trim() || undefined,
          docContent: docContent.trim() || undefined,
        },
      },
      "*"
    );
  };

  return (
    <SubFeatureLayout
      headline="Copy and Des"
      copy="Select a frame or group with text in Figma, then add your document copy. We use Gemini to map doc content to your design by font size, bold, italics, and colour (titles → larger text, body → smaller)."
      actionRow={
        <div className="copyanddes-form">
          <label className="copyanddes-label">Google Doc URL (optional)</label>
          <input
            type="url"
            className="copyanddes-input"
            placeholder="https://docs.google.com/document/d/..."
            value={docUrl}
            onChange={(e) => setDocUrl(e.target.value)}
          />
          <label className="copyanddes-label">Document content (paste from Google Doc)</label>
          <textarea
            className="copyanddes-textarea"
            placeholder="Paste your copy here. If the URL above can't be fetched, this content is used."
            value={docContent}
            onChange={(e) => setDocContent(e.target.value)}
            rows={8}
          />
          <button
            className="subfeature-btn"
            onClick={handleSubmit}
            disabled={!docContent.trim() && !docUrl.trim()}
          >
            Apply to design
          </button>
        </div>
      }
    />
  );
};
