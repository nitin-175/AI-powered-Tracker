const API_URL = "http://localhost:8080/api/jobs";

export const fetchJobs = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error("Failed to fetch jobs");
  }
  return response.json();
};


export const addJob = async (job) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(job),
  });

  if (!response.ok) {
    throw new Error("Failed to add job");
  }

  return response.json();
};