// src/services/api.js - COMPLETE API SERVICE

// Base API URL - your Spring Boot backend
const API_BASE_URL = 'http://localhost:8080/api';

// Generic API call function
const apiCall = async (endpoint, method = 'GET', data = null) => {
  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Add body for POST, PUT requests
  if (data) {
    config.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    // Check if response is OK
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    // Handle 204 No Content (for DELETE)
    if (response.status === 204) {
      return null;
    }
    
    // Parse and return JSON
    return await response.json();
    
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Job API endpoints
export const jobAPI = {
  // Get all jobs
  getAllJobs: () => apiCall('/jobs'),
  
  // Get single job by ID
  getJob: (id) => apiCall(`/jobs/${id}`),
  
  // Create new job
  createJob: (jobData) => apiCall('/jobs', 'POST', jobData),
  
  // Update existing job
  updateJob: (id, jobData) => apiCall(`/jobs/${id}`, 'PUT', jobData),
  
  // Delete job
  deleteJob: (id) => apiCall(`/jobs/${id}`, 'DELETE'),
};

// AI API endpoints
export const aiAPI = {
  // Analyze job match
  analyzeJob: (jobId, resume) => 
    apiCall(`/ai/analyze/${jobId}`, 'POST', { resume }),
  
  // Generate cover letter
  generateCoverLetter: (jobId, resume) => 
    apiCall(`/ai/cover-letter/${jobId}`, 'POST', { resume }),
  
  // Generate application email
  generateEmail: (jobId) => 
    apiCall(`/ai/email/${jobId}`, 'POST'),
};
