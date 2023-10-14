type formatTimestampProps = {
  timestamp: number;
};

export const formatTimestampExact = ({ timestamp }: formatTimestampProps) => {
  const now = Date.now();
  const timeDifferenceInMilliseconds = now - timestamp;
  const timeDifferenceInSeconds = Math.floor(
    timeDifferenceInMilliseconds / 1000
  );
  const timeDifferenceInMinutes = Math.floor(timeDifferenceInSeconds / 60);
  const timeDifferenceInHours = Math.floor(timeDifferenceInMinutes / 60);
  const timeDifferenceInDays = Math.floor(timeDifferenceInHours / 24);

  if (timeDifferenceInMinutes < 1) {
    return `${timeDifferenceInSeconds} seconds ago`;
  } else if (timeDifferenceInMinutes < 60) {
    return `${timeDifferenceInMinutes} minutes ago`;
  } else if (timeDifferenceInHours < 24) {
    return `${timeDifferenceInHours} hours ago`;
  } else {
    return `${timeDifferenceInDays} days ago`;
  }
};
