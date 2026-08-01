export function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-surface border border-border rounded-xl ${className}`}
    >
      {children}
    </div>
  );
}

export function StatCard({ label, value, sublabel }) {
  return (
    <Card className="p-5">
      <p className="text-xs uppercase tracking-wide text-muted font-medium">{label}</p>
      <p className="font-display text-3xl mt-2 text-ink">{value}</p>
      {sublabel && <p className="text-xs text-muted mt-1">{sublabel}</p>}
    </Card>
  );
}

const BADGE_STYLES = {
  applied: "bg-gray-100 text-gray-700",
  shortlisted: "bg-primary-soft text-primary",
  interview: "bg-accent-soft text-accent",
  selected: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-700",
  open: "bg-primary-soft text-primary",
  closed: "bg-gray-100 text-gray-500",
  pending: "bg-accent-soft text-accent",
  pass: "bg-emerald-100 text-emerald-700",
  fail: "bg-red-100 text-red-700",
};

export function Badge({ status }) {
  const style = BADGE_STYLES[status] || "bg-gray-100 text-gray-700";
  return (
    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium capitalize ${style}`}>
      {status}
    </span>
  );
}

export function Button({ children, variant = "primary", className = "", ...props }) {
  const base = "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-primary text-white hover:bg-primary/90",
    secondary: "bg-surface border border-border text-ink hover:bg-paper",
    accent: "bg-accent text-white hover:bg-accent/90",
    ghost: "text-ink hover:bg-paper",
    danger: "bg-red-50 text-red-600 hover:bg-red-100",
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function Input({ label, className = "", ...props }) {
  return (
    <label className="block">
      {label && <span className="block text-sm font-medium text-ink mb-1.5">{label}</span>}
      <input
        className={`w-full px-3 py-2 rounded-lg border border-border bg-surface text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary ${className}`}
        {...props}
      />
    </label>
  );
}

export function Textarea({ label, className = "", ...props }) {
  return (
    <label className="block">
      {label && <span className="block text-sm font-medium text-ink mb-1.5">{label}</span>}
      <textarea
        className={`w-full px-3 py-2 rounded-lg border border-border bg-surface text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary ${className}`}
        {...props}
      />
    </label>
  );
}

export function Select({ label, className = "", children, ...props }) {
  return (
    <label className="block">
      {label && <span className="block text-sm font-medium text-ink mb-1.5">{label}</span>}
      <select
        className={`w-full px-3 py-2 rounded-lg border border-border bg-surface text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary ${className}`}
        {...props}
      >
        {children}
      </select>
    </label>
  );
}

export function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink/40" onClick={onClose} />
      <div className="relative bg-surface rounded-xl border border-border w-full max-w-lg max-h-[85vh] overflow-y-auto p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-xl text-ink">{title}</h3>
          <button onClick={onClose} className="text-muted hover:text-ink text-xl leading-none">
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function EmptyState({ title, description }) {
  return (
    <div className="text-center py-16">
      <p className="font-display text-lg text-ink">{title}</p>
      {description && <p className="text-sm text-muted mt-1">{description}</p>}
    </div>
  );
}

export function PageHeader({ title, description, action }) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="font-display text-2xl text-ink">{title}</h1>
        {description && <p className="text-sm text-muted mt-1">{description}</p>}
      </div>
      {action}
    </div>
  );
}
