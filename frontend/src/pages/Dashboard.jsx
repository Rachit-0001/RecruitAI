import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from "recharts";
import { dashboardService } from "../services";
import { Card, StatCard, PageHeader } from "../components/ui";

const PIE_COLORS = ["#9ca3af", "#2f6f5e", "#b8622e", "#059669", "#dc2626"];

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService
      .get()
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-muted text-sm font-mono">Loading dashboard…</p>;
  }

  if (!data) {
    return <p className="text-muted text-sm">Could not load dashboard data.</p>;
  }

  const monthData = data.charts.applicationsPerMonth.map((m) => ({
    month: m.month,
    applications: Number(m.count),
  }));

  const statusData = data.charts.candidateStatus.map((s) => ({
    name: s.status,
    value: Number(s.count),
  }));

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Hiring pipeline at a glance."
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Candidates" value={data.totalCandidates} />
        <StatCard label="Open Jobs" value={data.openJobs} />
        <StatCard label="Applications" value={data.totalApplications} />
        <StatCard label="Interviews" value={data.totalInterviews} />
        <StatCard label="Selected" value={data.selectedCandidates} />
        <StatCard label="Rejected" value={data.rejectedCandidates} />
        <StatCard label="Hiring Rate" value={`${data.hiringRate}%`} className="col-span-2" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <Card className="p-5 lg:col-span-3">
          <p className="text-sm font-medium text-ink mb-4">Applications per month</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e3dfd6" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e3dfd6", fontSize: 13 }} />
              <Bar dataKey="applications" fill="#2f6f5e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5 lg:col-span-2">
          <p className="text-sm font-medium text-ink mb-4">Candidate status</p>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={2}>
                {statusData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e3dfd6", fontSize: 13 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 mt-2">
            {statusData.map((s, i) => (
              <div key={s.name} className="flex items-center gap-1.5 text-xs text-muted capitalize">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}
                />
                {s.name}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
