import type { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TravelApplicationForm } from '@/app/(site)/dashboard/travel-form';
import { DocumentUploadForm } from '@/app/(site)/dashboard/document-upload-form';
import {
  getDocumentsForClient,
  getNotificationsForUser,
  getStageHistoryForApplications,
  getTravelApplicationsForClient,
} from '@/lib/supabase/data';
import { getStageLabel } from '@/lib/travel-stages';

export const metadata: Metadata = {
  title: 'Travel dashboard',
};

export default async function TravelClientDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [profileRes, applications, docs, notices] = await Promise.all([
    supabase
      .from('profiles')
      .select('id, full_name, email, role, status, onboarding_paid, phone_number, passport_number, created_at, updated_at')
      .eq('id', user.id)
      .maybeSingle(),
    getTravelApplicationsForClient(user.id),
    getDocumentsForClient(user.id),
    getNotificationsForUser(user.id, 5),
  ]);
  const profile = profileRes.data;
  const historyMap = await getStageHistoryForApplications(applications.map((a) => a.id));
  const docsByApplication = docs.reduce<Record<string, typeof docs>>((acc, d) => {
    if (!acc[d.application_id]) acc[d.application_id] = [];
    acc[d.application_id].push(d);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-background pt-20 sm:pt-24 px-4 sm:px-6 pb-16">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-light text-foreground">Travel client dashboard</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Welcome back{profile?.full_name ? `, ${profile.full_name}` : ''}. Manage only your travel applications,
            documents, and stage updates here.
          </p>
          <Link href="/dashboard" className="inline-block mt-2 text-xs text-primary underline-offset-4 hover:underline">
            Switch service
          </Link>
        </div>

        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Travel profile</CardTitle>
            <CardDescription>Account details used for travel applications.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm space-y-1 text-muted-foreground">
            <p>
              <span className="text-foreground font-medium">Email:</span> {profile?.email ?? user.email}
            </p>
            <p>
              <span className="text-foreground font-medium">Role:</span> Travel Client
            </p>
            <Link href="/contact" className="inline-block mt-2 text-primary text-sm underline-offset-4 hover:underline">
              Need help? Contact support
            </Link>
          </CardContent>
        </Card>

        <TravelApplicationForm />

        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Recent updates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {notices.length === 0 ? (
              <p className="text-sm text-muted-foreground">No notifications yet.</p>
            ) : (
              notices.map((n) => (
                <div key={n.id} className="rounded-md border border-border p-2">
                  <p className="text-sm text-foreground">{n.title}</p>
                  <p className="text-xs text-muted-foreground">{n.body}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <div>
          <h2 className="text-lg font-medium text-foreground mb-3">My travel applications</h2>
          {applications.length === 0 ? (
            <p className="text-sm text-muted-foreground rounded-2xl border border-dashed border-border p-8 text-center">
              No applications yet. Submit one above.
            </p>
          ) : (
            <ul className="space-y-3">
              {applications.map((a) => (
                <li key={a.id} className="rounded-2xl border border-border bg-card p-4 shadow-sm space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <p className="font-medium text-foreground">{a.service_type ?? 'Application'}</p>
                      <p className="text-sm text-muted-foreground">{a.destination}</p>
                      {a.notes ? <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{a.notes}</p> : null}
                    </div>
                    <Badge variant="secondary" className="capitalize w-fit shrink-0">
                      {getStageLabel(a.service_type, a.current_stage)}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">
                      Uploaded docs: {docsByApplication[a.id]?.length ?? 0}
                    </p>
                    {historyMap[a.id]?.length ? (
                      <div className="rounded-md border border-border bg-muted/30 p-2">
                        <p className="text-xs text-foreground">
                          Latest update: {historyMap[a.id][0].stage_label}
                        </p>
                        {historyMap[a.id][0].note_to_client ? (
                          <p className="text-xs text-muted-foreground mt-1">{historyMap[a.id][0].note_to_client}</p>
                        ) : null}
                      </div>
                    ) : null}
                    {(docsByApplication[a.id] ?? []).length ? (
                      <div className="space-y-1">
                        {(docsByApplication[a.id] ?? []).map((d) => (
                          <div key={d.id} className="text-xs text-muted-foreground">
                            {(d.document_type ?? 'Document') + ': '}
                            <span className="text-foreground">{d.status}</span>
                            {d.admin_note ? <span className="text-muted-foreground"> - {d.admin_note}</span> : null}
                          </div>
                        ))}
                      </div>
                    ) : null}
                    <DocumentUploadForm applicationId={a.id} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
