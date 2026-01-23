const API_URL = "http://localhost:8080/api/jobs";

export const fetchJobs = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error("Failed to fetch jobs");
  }
  return response.json();
};
