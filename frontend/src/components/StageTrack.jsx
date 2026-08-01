const STAGES = ["applied", "shortlisted", "interview", "selected"];

export default function StageTrack({ status }) {
  if (status === "rejected") {
    return (
      <div className="flex items-center gap-2 text-xs text-red-600 font-medium">
        <span className="stage-node" style={{ background: "#dc2626" }} />
        Rejected
      </div>
    );
  }

  const activeIndex = STAGES.indexOf(status);

  return (
    <div className="stage-track w-full max-w-[220px]">
      {STAGES.map((stage, i) => (
        <div key={stage} className="flex items-center flex-1 last:flex-none">
          <div
            className={`stage-node ${
              i < activeIndex ? "is-done" : i === activeIndex ? "is-active" : ""
            }`}
            title={stage}
          />
          {i < STAGES.length - 1 && (
            <div className={`stage-line ${i < activeIndex ? "is-done" : ""}`} />
          )}
        </div>
      ))}
    </div>
  );
}
