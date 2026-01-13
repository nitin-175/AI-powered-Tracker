import org.springframework.web.bind.annotation.*;




@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "http://localhost:5173") // or 3000
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
}
