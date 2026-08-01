import { useState } from "react";
import { Sparkles } from "lucide-react";
import { aiService } from "../services";
import { Card, Button, Textarea, Input, PageHeader } from "../components/ui";

function Tab({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
        active ? "bg-ink text-white" : "text-muted hover:text-ink hover:bg-paper"
      }`}
    >
      {children}
    </button>
  );
}

export default function AiResumeAnalyzer() {
  const [tab, setTab] = useState("summary");

  return (
    <div>
      <PageHeader title="AI Resume Analyzer" description="Gemini-powered tools for faster screening." />

      <div className="flex gap-1 mb-6 bg-surface border border-border rounded-lg p-1 w-fit">
        <Tab active={tab === "summary"} onClick={() => setTab("summary")}>Resume summary</Tab>
        <Tab active={tab === "match"} onClick={() => setTab("match")}>Job match</Tab>
        <Tab active={tab === "questions"} onClick={() => setTab("questions")}>Interview questions</Tab>
      </div>

      {tab === "summary" && <SummaryTool />}
      {tab === "match" && <MatchTool />}
      {tab === "questions" && <QuestionsTool />}
    </div>
  );
}

function SummaryTool() {
  const [resumeText, setResumeText] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const run = async () => {
    setLoading(true);
    try {
      const res = await aiService.resumeSummary({ resumeText });
      setResult(res.data.summary);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 max-w-2xl">
      <Textarea
        label="Resume text"
        rows={8}
        placeholder="Paste the candidate's resume text here…"
        value={resumeText}
        onChange={(e) => setResumeText(e.target.value)}
      />
      <Button className="mt-4" onClick={run} disabled={loading || !resumeText.trim()}>
        <Sparkles className="w-4 h-4" /> {loading ? "Generating…" : "Generate summary"}
      </Button>
      {result && (
        <div className="mt-5 pt-5 border-t border-border">
          <p className="text-xs uppercase tracking-wide text-accent font-medium mb-2">Summary</p>
          <p className="text-sm text-ink leading-relaxed">{result}</p>
        </div>
      )}
    </Card>
  );
}

function MatchTool() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const run = async () => {
    setLoading(true);
    try {
      const res = await aiService.jobMatch({ resumeText, jobDescription });
      setResult(res.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 max-w-2xl">
      <div className="space-y-4">
        <Textarea label="Resume text" rows={6} value={resumeText} onChange={(e) => setResumeText(e.target.value)} />
        <Textarea label="Job description" rows={6} value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} />
      </div>
      <Button className="mt-4" onClick={run} disabled={loading || !resumeText.trim() || !jobDescription.trim()}>
        <Sparkles className="w-4 h-4" /> {loading ? "Matching…" : "Analyze match"}
      </Button>
      {result && (
        <div className="mt-5 pt-5 border-t border-border space-y-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted font-medium mb-1">Match score</p>
            <p className="font-display text-3xl text-primary">{result.matchPercentage}%</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted font-medium mb-2">Matching skills</p>
            <div className="flex flex-wrap gap-2">
              {(result.matchingSkills || []).map((s) => (
                <span key={s} className="px-2.5 py-1 rounded-full text-xs bg-primary-soft text-primary">{s}</span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted font-medium mb-2">Missing skills</p>
            <div className="flex flex-wrap gap-2">
              {(result.missingSkills || []).map((s) => (
                <span key={s} className="px-2.5 py-1 rounded-full text-xs bg-accent-soft text-accent">{s}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

function QuestionsTool() {
  const [jobRole, setJobRole] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const run = async () => {
    setLoading(true);
    try {
      const res = await aiService.interviewQuestions({ jobRole });
      setQuestions(res.data.questions || []);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 max-w-2xl">
      <Input label="Job role" placeholder="e.g. Backend Developer" value={jobRole} onChange={(e) => setJobRole(e.target.value)} />
      <Button className="mt-4" onClick={run} disabled={loading || !jobRole.trim()}>
        <Sparkles className="w-4 h-4" /> {loading ? "Generating…" : "Generate questions"}
      </Button>
      {questions.length > 0 && (
        <ol className="mt-5 pt-5 border-t border-border space-y-2 list-decimal list-inside">
          {questions.map((q, i) => (
            <li key={i} className="text-sm text-ink leading-relaxed">{q}</li>
          ))}
        </ol>
      )}
    </Card>
  );
}
