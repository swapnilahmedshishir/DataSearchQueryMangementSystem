import { useState, useEffect } from "react";
const Clock = () => {
  const [time, updateTime] = useState(new Date());
  useEffect(() => {
    // timer updation logic
    const timer = setInterval(() => {
      updateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, [time]);
  return (
    <>
      <span className="time">{time.toLocaleTimeString()}</span>
    </>
  );
};

export default Clock;
