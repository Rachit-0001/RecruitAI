import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Sparkles, Trash2 } from "lucide-react";
import { candidateService, aiService } from "../services";
import { Card, Button } from "../components/ui";

export default function CandidateDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [summary, setSummary] = useState("");
  const [summarizing, setSummarizing] = useState(false);

  useEffect(() => {
    candidateService.get(id).then((res) => setCandidate(res.data));
  }, [id]);

  const handleSummarize = async () => {
    if (!candidate?.resume) return;
    setSummarizing(true);
    try {
      const res = await aiService.resumeSummary({
        resumeText: candidate.resume,
        candidateId: candidate.id,
      });
      setSummary(res.data.summary);
    } finally {
      setSummarizing(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this candidate?")) return;
    await candidateService.remove(id);
    navigate("/candidates");
  };

  if (!candidate) return <p className="text-muted text-sm font-mono">Loading…</p>;

  return (
    <div>
      <button
        onClick={() => navigate("/candidates")}
        className="flex items-center gap-1.5 text-sm text-muted hover:text-ink mb-5"
      >
        <ArrowLeft className="w-4 h-4" /> Back to candidates
      </button>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl text-ink">{candidate.name}</h1>
          <p className="text-sm text-muted mt-1">{candidate.email} · {candidate.phone || "no phone"}</p>
        </div>
        <Button variant="danger" onClick={handleDelete}>
          <Trash2 className="w-4 h-4" /> Delete
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-5">
          <p className="text-xs uppercase tracking-wide text-muted font-medium mb-3">Profile</p>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Experience</dt>
              <dd className="text-ink font-medium">{candidate.experience || "—"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Education</dt>
              <dd className="text-ink font-medium text-right">{candidate.education || "—"}</dd>
            </div>
            <div>
              <dt className="text-muted mb-1">Skills</dt>
              <dd className="text-ink">{candidate.skills || "—"}</dd>
            </div>
          </dl>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs uppercase tracking-wide text-muted font-medium">Resume</p>
            <Button variant="accent" onClick={handleSummarize} disabled={summarizing || !candidate.resume}>
              <Sparkles className="w-4 h-4" /> {summarizing ? "Summarizing…" : "AI summary"}
            </Button>
          </div>
          <p className="text-sm text-ink whitespace-pre-wrap leading-relaxed max-h-40 overflow-y-auto">
            {candidate.resume || "No resume text on file."}
          </p>
          {summary && (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs uppercase tracking-wide text-accent font-medium mb-2">AI Summary</p>
              <p className="text-sm text-ink leading-relaxed">{summary}</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
