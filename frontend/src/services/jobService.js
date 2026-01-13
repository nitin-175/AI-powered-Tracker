

const API_URL = "http://localhost:8080/api/jobs";

export const getJobs = async () => {
  const res = await fetch(API_URL);
  return res.json();
};

export const addJob = async (job) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(job),
  });
  return res.json();
};



