import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { applicationService, candidateService, jobService } from "../services";
import { Button, Select, Modal, PageHeader, EmptyState, Card } from "../components/ui";
import StageTrack from "../components/StageTrack";

const STATUSES = ["applied", "shortlisted", "interview", "selected", "rejected"];

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ candidate_id: "", job_id: "" });
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    applicationService.list().then((res) => setApplications(res.data)).finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    candidateService.list().then((res) => setCandidates(res.data));
    jobService.list().then((res) => setJobs(res.data));
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await applicationService.create(form);
      setModalOpen(false);
      setForm({ candidate_id: "", job_id: "" });
      load();
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (app, status) => {
    await applicationService.update(app.id, { status });
    load();
  };

  return (
    <div>
      <PageHeader
        title="Applications"
        description="Track candidates through your hiring pipeline."
        action={
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="w-4 h-4" /> New application
          </Button>
        }
      />

      {loading ? (
        <p className="text-muted text-sm font-mono">Loading…</p>
      ) : applications.length === 0 ? (
        <EmptyState title="No applications yet" description="Link a candidate to a job to get started." />
      ) : (
        <Card>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-muted border-b border-border">
                <th className="px-5 py-3 font-medium">Candidate</th>
                <th className="px-5 py-3 font-medium">Job</th>
                <th className="px-5 py-3 font-medium">Pipeline</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id} className="border-b border-border last:border-0">
                  <td className="px-5 py-3 font-medium text-ink">{app.candidate_name}</td>
                  <td className="px-5 py-3 text-muted">{app.job_title}</td>
                  <td className="px-5 py-3">
                    <StageTrack status={app.status} />
                  </td>
                  <td className="px-5 py-3">
                    <select
                      value={app.status}
                      onChange={(e) => handleStatusChange(app, e.target.value)}
                      className="text-xs border border-border rounded-md px-2 py-1 capitalize bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New application">
        <form onSubmit={handleCreate} className="space-y-3">
          <Select
            label="Candidate"
            required
            value={form.candidate_id}
            onChange={(e) => setForm({ ...form, candidate_id: e.target.value })}
          >
            <option value="">Select candidate…</option>
            {candidates.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </Select>
          <Select
            label="Job"
            required
            value={form.job_id}
            onChange={(e) => setForm({ ...form, job_id: e.target.value })}
          >
            <option value="">Select job…</option>
            {jobs.map((j) => (
              <option key={j.id} value={j.id}>{j.title}</option>
            ))}
          </Select>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Create"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
