const API_URL = "http://localhost:8080/api/jobs/";

export const fetchJobs = async () => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Fetch failed");
  return res.json();
};

export const addJob = async (job) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(job),
  });
  if (!res.ok) throw new Error("Add failed");
  return res.json();
};

export const updateJob = async (id, job) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(job),
  });
  if (!res.ok) throw new Error("Update failed");
  return res.json();
};

export const deleteJob = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Delete failed");
};
