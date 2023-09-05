type formatTimestampProps = {
  timestamp: number;
};

export const formatTimestamp = ({ timestamp }: formatTimestampProps) => {
  const now = Date.now();
  const timeDifferenceInMilliseconds = now - timestamp;
  const timeDifferenceInSeconds = Math.floor(
    timeDifferenceInMilliseconds / 1000
  );
  const timeDifferenceInMinutes = Math.floor(timeDifferenceInSeconds / 60);
  const timeDifferenceInHours = Math.floor(timeDifferenceInMinutes / 60);
  const timeDifferenceInDays = Math.floor(timeDifferenceInHours / 24);

  if (timeDifferenceInMinutes < 2) {
    return "Just now";
  } else if (timeDifferenceInMinutes < 60) {
    return `${timeDifferenceInMinutes} minutes ago`;
  } else if (timeDifferenceInHours < 24) {
    return `${timeDifferenceInHours} hours ago`;
  } else {
    return `${timeDifferenceInDays} days ago`;
  }
};
