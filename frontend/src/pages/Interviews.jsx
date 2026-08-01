import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { interviewService, applicationService } from "../services";
import { Button, Select, Input, Modal, PageHeader, EmptyState, Card, Badge } from "../components/ui";

export default function Interviews() {
  const [interviews, setInterviews] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ application_id: "", interview_date: "", interviewer: "" });
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    interviewService.list().then((res) => setInterviews(res.data)).finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    applicationService.list().then((res) => setApplications(res.data));
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await interviewService.create(form);
      setModalOpen(false);
      setForm({ application_id: "", interview_date: "", interviewer: "" });
      load();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Interviews"
        description="Scheduled and completed interviews."
        action={
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="w-4 h-4" /> Schedule interview
          </Button>
        }
      />

      {loading ? (
        <p className="text-muted text-sm font-mono">Loading…</p>
      ) : interviews.length === 0 ? (
        <EmptyState title="No interviews scheduled" description="Schedule one from an active application." />
      ) : (
        <Card>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-muted border-b border-border">
                <th className="px-5 py-3 font-medium">Candidate</th>
                <th className="px-5 py-3 font-medium">Job</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Interviewer</th>
                <th className="px-5 py-3 font-medium">Result</th>
              </tr>
            </thead>
            <tbody>
              {interviews.map((iv) => (
                <tr key={iv.id} className="border-b border-border last:border-0">
                  <td className="px-5 py-3 font-medium text-ink">{iv.candidate_name}</td>
                  <td className="px-5 py-3 text-muted">{iv.job_title}</td>
                  <td className="px-5 py-3 text-muted font-mono text-xs">
                    {new Date(iv.interview_date).toLocaleString()}
                  </td>
                  <td className="px-5 py-3 text-muted">{iv.interviewer || "—"}</td>
                  <td className="px-5 py-3"><Badge status={iv.result} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Schedule interview">
        <form onSubmit={handleCreate} className="space-y-3">
          <Select
            label="Application"
            required
            value={form.application_id}
            onChange={(e) => setForm({ ...form, application_id: e.target.value })}
          >
            <option value="">Select application…</option>
            {applications.map((a) => (
              <option key={a.id} value={a.id}>
                {a.candidate_name} → {a.job_title}
              </option>
            ))}
          </Select>
          <Input
            label="Date & time"
            type="datetime-local"
            required
            value={form.interview_date}
            onChange={(e) => setForm({ ...form, interview_date: e.target.value })}
          />
          <Input
            label="Interviewer"
            value={form.interviewer}
            onChange={(e) => setForm({ ...form, interviewer: e.target.value })}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Schedule"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
