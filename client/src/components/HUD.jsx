import { useState, useEffect } from 'react';

export default function HUD() {
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowControls(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="hud">
      {/* Crosshair */}
      <div className="crosshair">+</div>

      {/* Title */}
      <div className="hud-title">OpenWorld</div>

      {/* Controls help */}
      {showControls && (
        <div className="controls-panel">
          <div className="controls-title">Controls</div>
          <div className="control-row"><kbd>W A S D</kbd> Move</div>
          <div className="control-row"><kbd>Mouse</kbd> Look around</div>
          <div className="control-row"><kbd>Shift</kbd> Sprint</div>
          <div className="control-row"><kbd>Space</kbd> Jump</div>
          <div className="control-row"><kbd>Click</kbd> Lock cursor</div>
          <div className="control-row"><kbd>Esc</kbd> Release cursor</div>
        </div>
      )}

      {/* Click to play prompt */}
      <div className="click-prompt" id="click-prompt">
        Click to start exploring
      </div>
    </div>
  );
}
