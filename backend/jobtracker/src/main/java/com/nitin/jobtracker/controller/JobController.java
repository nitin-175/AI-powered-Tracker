package com.nitin.jobtracker.controller;

import com.nitin.jobtracker.model.Job;
import com.nitin.jobtracker.repository.JobRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs/")
@CrossOrigin(origins = "http://localhost:5173")
public class JobController {

    private final JobRepository jobRepository;

    public JobController(JobRepository jobRepository) {
        this.jobRepository = jobRepository;
    }

    @GetMapping
    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    @PostMapping
    public Job addJob(@RequestBody Job job) {
        return jobRepository.save(job);
    }

    @DeleteMapping("/{id}")
    public void deleteJob(@PathVariable Long id) {
        jobRepository.deleteById(id);
    }
}
