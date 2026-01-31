const API_BASE_URL = "http://localhost:8080/api";

const apiCall = async (endpoint, method = "GET", data) => {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (data !== undefined) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

  if (!response.ok) {
    let errorText = "";

    try {
      errorText = await response.text();
    } catch {
      errorText = response.statusText;
    }

    throw new Error(errorText || `HTTP ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type");

  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }

  return null;
};

/* -------------------- JOB API -------------------- */

export const jobAPI = {
  getAllJobs() {
    return apiCall("/jobs");
  },

  getJob(id) {
    return apiCall(`/jobs/${id}`);
  },

  createJob(jobData) {
    return apiCall("/jobs", "POST", jobData);
  },

  updateJob(id, jobData) {
    return apiCall(`/jobs/${id}`, "PUT", jobData);
  },

  deleteJob(id) {
    return apiCall(`/jobs/${id}`, "DELETE");
  },
};

/* -------------------- AI API -------------------- */

export const aiAPI = {
  analyzeJob(jobId, resume) {
    return apiCall(`/ai/analyze/${jobId}`, "POST", { resume });
  },

  generateCoverLetter(jobId, resume) {
    return apiCall(`/ai/cover-letter/${jobId}`, "POST", { resume });
  },

  generateEmail(jobId) {
    return apiCall(`/ai/email/${jobId}`, "POST");
  },
};
