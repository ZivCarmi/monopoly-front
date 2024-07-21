import { getTimeValues } from "@/utils";
import { useEffect, useState } from "react";

const useCountdown = (date: Date) => {
  const [countdown, setCountdown] = useState(
    new Date(date).getTime() - new Date().getTime()
  );
  const { minutes, seconds } = getTimeValues(countdown);

  useEffect(() => {
    if (countdown <= 1000) return;

    const interval = setInterval(() => {
      setCountdown((prevTime) => prevTime - 1000);
    }, 1000);

    return () => clearInterval(interval);
  }, [countdown, date]);

  useEffect(() => {
    function calculateTimeLeft(date: Date) {
      const now = new Date();
      const difference = new Date(date).getTime() - now.getTime();
      return difference;
    }

    setCountdown(calculateTimeLeft(date));
  }, [date]);

  return { minutes, seconds };
};

export default useCountdown;
