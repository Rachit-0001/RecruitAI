import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { jobService } from "../services";
import { Button, Input, Textarea, Modal, PageHeader, EmptyState, Card, Badge } from "../components/ui";

const EMPTY_FORM = { title: "", description: "", required_skills: "", location: "", salary: "" };

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    jobService.list().then((res) => setJobs(res.data)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await jobService.create(form);
      setModalOpen(false);
      setForm(EMPTY_FORM);
      load();
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (job) => {
    await jobService.update(job.id, { status: job.status === "open" ? "closed" : "open" });
    load();
  };

  return (
    <div>
      <PageHeader
        title="Jobs"
        description="Open roles you're hiring for."
        action={
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="w-4 h-4" /> New job
          </Button>
        }
      />

      {loading ? (
        <p className="text-muted text-sm font-mono">Loading…</p>
      ) : jobs.length === 0 ? (
        <EmptyState title="No jobs posted yet" description="Create your first job posting." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <Card key={job.id} className="p-5">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-display text-lg text-ink">{job.title}</h3>
                <button onClick={() => toggleStatus(job)}>
                  <Badge status={job.status} />
                </button>
              </div>
              <p className="text-sm text-muted mb-3 line-clamp-2">{job.description}</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted font-mono">
                <span>{job.location || "Remote"}</span>
                <span>{job.salary || "—"}</span>
              </div>
              {job.required_skills && (
                <p className="text-xs text-ink mt-3 pt-3 border-t border-border">
                  {job.required_skills}
                </p>
              )}
            </Card>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New job">
        <form onSubmit={handleCreate} className="space-y-3">
          <Input label="Title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Textarea label="Description" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <Input label="Required skills" value={form.required_skills} onChange={(e) => setForm({ ...form, required_skills: e.target.value })} />
          <Input label="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          <Input label="Salary" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Create job"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
