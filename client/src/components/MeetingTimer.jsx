import { useEffect, useState } from "react";
import "../styles/MeetingTimer.css";

function MeetingTimer() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    if (!running) return;

    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [running]);

  const formatTime = () => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${String(hours).padStart(2, "0")}:${String(
      minutes
    ).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const resetTimer = () => {
    setSeconds(0);
    setRunning(true);
  };

  return (
    <div className="meeting-timer">
      <div className="timer-title">
        ⏱️ Meeting Time
      </div>

      <div className="timer-display">
        {formatTime()}
      </div>

      <div className="timer-buttons">
        <button onClick={() => setRunning(!running)}>
          {running ? "⏸ Pause" : "▶ Resume"}
        </button>

        <button onClick={resetTimer}>
          🔄 Reset
        </button>
      </div>
    </div>
  );
}

export default MeetingTimer;