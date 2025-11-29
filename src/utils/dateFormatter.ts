export const dateFormatter = (value: string) => {
  const date = new Date(value);
  // Extract year, month, and day
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Adding 1 because getMonth() returns zero-based month index
  const day = date.getDate().toString().padStart(2, "0");
  // Construct the desired format
  const formattedDate = `${year}-${month}-${day}`;

  return formattedDate;
};


// utils/dateTimeFormatters.ts
export const getTimeIn12HourFormat = (dateTimeString: string): string => {
  const date = new Date(dateTimeString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};