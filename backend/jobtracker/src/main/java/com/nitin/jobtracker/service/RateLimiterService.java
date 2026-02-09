package com.nitin.jobtracker.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class RateLimiterService {

    private final int maxRequests;
    private final long windowMs;

    private static class Bucket {
        private final int max;
        private final long windowMs;
        private long windowStart;
        private final AtomicInteger count = new AtomicInteger(0);

        Bucket(int max, long windowMs) {
            this.max = max;
            this.windowMs = windowMs;
            this.windowStart = System.currentTimeMillis();
        }

        synchronized boolean allow() {
            long now = System.currentTimeMillis();
            if (now - windowStart >= windowMs) {
                windowStart = now;
                count.set(0);
            }
            if (count.incrementAndGet() <= max) {
                return true;
            }
            return false;
        }
    }

    private final ConcurrentHashMap<String, Bucket> buckets = new ConcurrentHashMap<>();

    public RateLimiterService(@Value("${gemini.max.requests.per.minute:60}") int maxRequests) {
        this.maxRequests = maxRequests;
        this.windowMs = 60_000L; // 1 minute window
    }

    public boolean allow(String clientKey) {
        Bucket b = buckets.computeIfAbsent(clientKey, k -> new Bucket(maxRequests, windowMs));
        return b.allow();
    }
}
