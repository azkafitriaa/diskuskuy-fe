import React, { useState, useEffect } from "react";

export default function ServerTime() {
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const [second, setSecond] = useState(0);

  useEffect(() => {
    startTime();
  }, []);

  const startTime = () => {
    const today = new Date();
    let min = today.getMinutes();
    let sec = today.getSeconds();
    setHour(today.getHours())
    setMinute(checkTime(min))
    setSecond(checkTime(sec))
    setTimeout(startTime, 1000);
  }
  
  const checkTime = (i) => {
    if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
    return i;
  }
  return (
    <p>{hour}:{minute}:{second}</p>
  )
}
