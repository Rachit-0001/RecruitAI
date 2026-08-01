import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import { candidateService } from "../services";
import { Button, Input, Modal, Textarea, PageHeader, EmptyState, Card } from "../components/ui";

const EMPTY_FORM = {
  name: "",
  email: "",
  phone: "",
  skills: "",
  experience: "",
  education: "",
  resume: "",
};

export default function Candidates() {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const load = (q) => {
    setLoading(true);
    candidateService
      .list(q)
      .then((res) => setCandidates(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => load(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await candidateService.create(form);
      setModalOpen(false);
      setForm(EMPTY_FORM);
      load(search);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Candidates"
        description="Everyone in your talent pool."
        action={
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="w-4 h-4" /> Add candidate
          </Button>
        }
      />

      <div className="relative mb-5 max-w-sm">
        <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, or skill…"
          className="w-full pl-9 pr-3 py-2 rounded-lg border border-border bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
        />
      </div>

      {loading ? (
        <p className="text-muted text-sm font-mono">Loading…</p>
      ) : candidates.length === 0 ? (
        <EmptyState title="No candidates yet" description="Add your first candidate to get started." />
      ) : (
        <Card>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-muted border-b border-border">
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Skills</th>
                <th className="px-5 py-3 font-medium">Experience</th>
                <th className="px-5 py-3 font-medium">Contact</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => navigate(`/candidates/${c.id}`)}
                  className="border-b border-border last:border-0 hover:bg-paper cursor-pointer transition-colors"
                >
                  <td className="px-5 py-3 font-medium text-ink">{c.name}</td>
                  <td className="px-5 py-3 text-muted max-w-xs truncate">{c.skills || "—"}</td>
                  <td className="px-5 py-3 text-muted">{c.experience || "—"}</td>
                  <td className="px-5 py-3 text-muted">{c.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add candidate">
        <form onSubmit={handleCreate} className="space-y-3">
          <Input label="Full name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Input label="Skills (comma separated)" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} />
          <Input label="Experience" placeholder="e.g. 3 years" value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} />
          <Input label="Education" value={form.education} onChange={(e) => setForm({ ...form, education: e.target.value })} />
          <Textarea label="Resume text" rows={4} value={form.resume} onChange={(e) => setForm({ ...form, resume: e.target.value })} />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Add candidate"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
