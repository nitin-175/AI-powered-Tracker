import { useEffect, useState } from "react";
import { jobAPI } from "../services/api";
import ApplicationsTable from "../components/ApplicationsTable";
import EditApplicationModal from "../components/EditApplicationModal";
import AutoApply from "./AutoApply"; // new for in-context apply

export default function Applications() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [editingJob, setEditingJob] = useState(null);
  const [showAutoApply, setShowAutoApply] = useState(false);

  const [showAIModal, setShowAIModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [aiResult, setAiResult] = useState(null);
  const [aiRaw, setAiRaw] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [analyzingJobId, setAnalyzingJobId] = useState(null);
  const [aiAvailable, setAiAvailable] = useState(true); // true = available, false = not available

  useEffect(() => {
    loadJobs();

    // Check AI health on mount
    (async function checkAI() {
      try {
        const res = await fetch("http://localhost:8080/api/ai/health");
        if (res.ok) {
          const json = await res.json();
          setAiAvailable(json.status === "ok");
        } else {
          setAiAvailable(false);
        }
      } catch {
        setAiAvailable(false);
      }
    })();

  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const data = await jobAPI.getAllJobs();
      setJobs(data);
      setError("");
    } catch {
      setError("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this application?")) return;
    await jobAPI.deleteJob(id);
    setJobs((prev) => prev.filter((j) => j.id !== id));
  };

  const handleSaveEdit = async (updatedJob) => {
    const saved = await jobAPI.updateJob(updatedJob.id, updatedJob);
    setJobs((prev) =>
      prev.map((j) => (j.id === saved.id ? saved : j))
    );
    setEditingJob(null);
  };

  const handleAutoApply = (job) => {
    setSelectedJob(job);
    setShowAutoApply(true);
  };

  // ✅ FIXED AI CALL (robust + safe)
  const analyzeJobAI = async (jobId) => {
    if (aiAvailable === false) {
      alert("AI features are currently unavailable.");
      return;
    }

    setAiLoading(true);
    setAiResult(null);
    setAiRaw("");
    setAnalyzingJobId(jobId);

    try {
      const res = await fetch(
        `http://localhost:8080/api/ai/analyze/${jobId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            resume:
              "Full-stack developer with Java, Spring Boot, tailwind css, rest api, MERN stack and React. Built AI powered job tracker."
          })
        }
      );

      if (!res.ok) {
        const errText = await res.text();
        let msg = errText;
        let status = res.status;

        try {
          const parsed = JSON.parse(errText);
          msg = parsed.error || JSON.stringify(parsed);
          if (parsed.status) status = parsed.status;
        } catch { /* ignore malformed JSON */ }

        if (status === 429) {
          alert("AI quota exceeded: " + msg);
          return;
        }

        if (status === 503) {
          alert("AI backend not configured.");
          setAiAvailable(false);
          return;
        }

        throw new Error(msg || ("HTTP " + res.status));
      }

      const data = await res.json();

      if (data.error) {
        alert(data.error);
        return;
      }

      const analysis = data.analysis;

      if (analysis && typeof analysis === "object") {

        const toArray = (v) => Array.isArray(v) ? v : v ? [v] : [];

        const normalized = {
          ...analysis,
          strengths: toArray(analysis.strengths),
          improvements: toArray(analysis.improvements),
          missingOrWeakSkills: toArray(analysis.missingOrWeakSkills),
          projectSuggestions: toArray(analysis.projectSuggestions),
          resumeLineExamples: toArray(analysis.resumeLineExamples),
          keySkillsToHighlight: toArray(analysis.keySkillsToHighlight)
        };

        setAiResult(normalized);
        setAiRaw("");
      } else {
        setAiResult(null);
        setAiRaw(analysis ? String(analysis) : "");
      }

      setSelectedJob(jobs.find((j) => j.id === jobId));
      setShowAIModal(true);

    } catch (e) {
      console.error(e);
      alert("AI request failed");
    } finally {
      setAiLoading(false);
      setAnalyzingJobId(null);
    }
  };


  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || job.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="p-6 ml-70 mt-10">
      <h1 className="text-3xl font-semibold mb-6">Applications</h1>

      <div className="flex gap-4 mb-6">
        <input
          className="flex-1 px-4 py-2 border rounded-lg"
          placeholder="Search company or role"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="px-4 py-2 border rounded-lg"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All</option>
          <option>Applied</option>
          <option>Interview</option>
          <option>Offer</option>
          <option>Rejected</option>
        </select>
      </div>

      {/* AI health banner */}
      {aiAvailable === false && (
        <div className="mb-4 p-3 rounded bg-red-100 border border-red-200 text-red-800 flex items-center justify-between">
          <div>
            <strong>AI features unavailable:</strong> GEMINI_API_KEY is not configured on the backend. AI analysis and cover-letter generation are disabled until configured.
          </div>
          <div className="ml-4">
            <button
              onClick={async () => {
                // recheck health
                try {
                  const r = await fetch("http://localhost:8080/api/ai/health");
                  if (r.ok) {
                    const j = await r.json();
                    setAiAvailable(j.status === "ok");
                  } else setAiAvailable(false);
                } catch {
                  setAiAvailable(false);
                }
              }}
              className="px-3 py-1 rounded bg-red-600 text-white"
            >
              Recheck
            </button>
          </div>
        </div>
      )}

      <ApplicationsTable
        jobs={filteredJobs}
        onEdit={setEditingJob}
        onDelete={handleDelete}
        onAnalyze={analyzeJobAI}
        onAutoApply={handleAutoApply}
        aiLoading={aiLoading}
        analyzingJobId={analyzingJobId}
        aiAvailable={aiAvailable}
      />

      {editingJob && (
        <EditApplicationModal
          job={editingJob}
          onClose={() => setEditingJob(null)}
          onSave={handleSaveEdit}
        />
      )}

      {/* ✅ AUTO-APPLY MODAL */}
      {showAutoApply && selectedJob && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-y-auto shadow-xl">
            <div className="bg-green-600 text-white p-5 rounded-t-2xl flex justify-between">
              <div className="text-xl font-semibold">Auto-Apply</div>
              <button onClick={() => setShowAutoApply(false)}>✕</button>
            </div>
            <div className="p-6">
              <AutoApply selectedJob={selectedJob} />
            </div>
          </div>
        </div>
      )}

      {/* ✅ AI MODAL */}
      {showAIModal && selectedJob && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full overflow-y-auto shadow-xl">

            <div className="bg-blue-600 text-white p-5 rounded-t-2xl flex justify-between">
              <div>
                <div className="text-xl font-semibold">AI Job Analysis</div>
                <div className="text-sm text-blue-100">
                  {selectedJob.company} – {selectedJob.role}
                </div>
              </div>
              <button onClick={() => setShowAIModal(false)}>✕</button>
            </div>

            <div className="p-6 space-y-6">

              {aiResult ? (
                <>
                  <div className="text-center">
                    <div className="text-5xl font-bold text-blue-600">
                      {aiResult.matchScore}%
                    </div>
                    <div className="text-gray-600">Match Score</div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Strengths</h3>
                    {aiResult.strengths?.map((s, i) => (
                      <div key={i} className="text-sm bg-green-50 p-2 rounded mb-2">
                        {s}
                      </div>
                    ))}
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Improvements</h3>
                    {aiResult.improvements?.map((s, i) => (
                      <div key={i} className="text-sm bg-amber-50 p-2 rounded mb-2">
                        {s}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                // ✅ fallback when Gemini did not return JSON
                <div>
                  <h3 className="font-semibold mb-3">AI Response</h3>
                  <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded">
                    {aiRaw}
                  </pre>
                </div>
              )}

            </div>

            <div className="p-4 border-t text-center">
              <button
                onClick={() => setShowAIModal(false)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
