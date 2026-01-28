package com.nitin.jobtracker.service;

import com.nitin.jobtracker.model.Job;
import com.nitin.jobtracker.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobService {
    
    @Autowired
    private JobRepository jobRepository;
    
    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }
    
    public Job getJobById(Long id) {
        return jobRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Job not found with id: " + id));
    }
    
    public Job createJob(Job job) {
        return jobRepository.save(job);
    }
    
    public Job updateJob(Long id, Job jobDetails) {
        Job job = getJobById(id);
        job.setCompany(jobDetails.getCompany());
        job.setRole(jobDetails.getRole());
        job.setStatus(jobDetails.getStatus());
        return jobRepository.save(job);
    }
    
    public void deleteJob(Long id) {
        Job job = getJobById(id);
        jobRepository.delete(job);
    }
}

