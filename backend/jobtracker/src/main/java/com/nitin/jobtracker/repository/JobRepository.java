package com.nitin.jobtracker.repository;

import com.nitin.jobtracker.model.Job;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JobRepository extends JpaRepository<Job, Long> {
}
