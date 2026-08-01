import { useAuth } from "../context/AuthContext";
import { Card, PageHeader } from "../components/ui";

export default function Settings() {
  const { user } = useAuth();

  return (
    <div>
      <PageHeader title="Settings" description="Your account details." />
      <Card className="p-6 max-w-md">
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">Name</dt>
            <dd className="text-ink font-medium">{user?.name}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Email</dt>
            <dd className="text-ink font-medium">{user?.email}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Role</dt>
            <dd className="text-ink font-medium capitalize">{user?.role}</dd>
          </div>
        </dl>
      </Card>
    </div>
  );
}
