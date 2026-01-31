import { useEffect, useState } from "react";
import { jobAPI } from "../services/api";
import ApplicationsTable from "../components/ApplicationsTable";
import EditApplicationModal from "../components/EditApplicationModal";

export default function Applications() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [editingJob, setEditingJob] = useState(null);

  const [showAIModal, setShowAIModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [aiResult, setAiResult] = useState(null);
  const [aiRaw, setAiRaw] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    loadJobs();
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

  // ✅ FIXED AI CALL (robust + safe)
  const analyzeJobAI = async (jobId) => {
    setAiLoading(true);
    setAiResult(null);
    setAiRaw("");
    try {
      const res = await fetch(
        `http://localhost:8080/api/ai/analyze/${jobId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            resume:
              "Full-stack developer with Java, Spring Boot and React. Built AI powered job tracker."
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
        } catch (err) {
          // ignore
        }

        if (status === 429) {
          // Quota exceeded — show friendly message
          let details = msg;
          try {
            const bodyParsed = JSON.parse(errText);
            details = bodyParsed.body || msg;
          } catch {}
          alert("AI quota exceeded: " + details);
          return;
        }

        throw new Error(msg || ("HTTP " + res.status));
      }

      const data = await res.json();

      if (data.error) {
        alert(data.error);
        return;
      }

      const raw = data.analysis || "";
      setAiRaw(raw);

      let parsed = null;

      try {
        const clean = raw.replace(/```json|```/g, "").trim();
        parsed = JSON.parse(clean);
      } catch {
        // Gemini sometimes returns plain text
        parsed = null;
      }

      setAiResult(parsed);
      setSelectedJob(jobs.find((j) => j.id === jobId));
      setShowAIModal(true);

    } catch (e) {
      console.error(e);
      alert("AI request failed");
    } finally {
      setAiLoading(false);
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

      <ApplicationsTable
        jobs={filteredJobs}
        onEdit={setEditingJob}
        onDelete={handleDelete}
        onAnalyze={analyzeJobAI}
        aiLoading={aiLoading}
      />

      {editingJob && (
        <EditApplicationModal
          job={editingJob}
          onClose={() => setEditingJob(null)}
          onSave={handleSaveEdit}
        />
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
