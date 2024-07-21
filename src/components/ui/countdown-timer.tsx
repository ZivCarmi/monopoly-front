import useCountdown from "@/hooks/useCountdown";

const CountdownTimer = ({ date }: { date: Date }) => {
  const { minutes, seconds } = useCountdown(date);

  return (
    <time>
      {minutes}:{seconds}
    </time>
  );
};

export default CountdownTimer;
