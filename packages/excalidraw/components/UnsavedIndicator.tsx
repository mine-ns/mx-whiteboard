import { Button } from "./Button";

import "./UnsavedIndicator.scss";

export const UnsavedIndicator = ({
  isModified,
  onSelect,
}: {
  isModified: boolean;
  onSelect: () => void;
}) => {
  if (!isModified) {
    return null;
  }

  return (
    <Button
      className="unsaved-button"
      onSelect={onSelect}
      title="You have unsaved changes. Click to save (Ctrl+S)"
    >
      <span className="unsaved-button__dot" />
      Unsaved
    </Button>
  );
};
