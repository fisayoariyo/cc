import type { Metadata } from 'next';
import Link from 'next/link';
import {
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  Building2,
  CheckCircle2,
  ClipboardList,
  Clock3,
  FileClock,
  FileText,
  Hammer,
  LineChart,
  MessageSquareText,
  Wallet,
} from 'lucide-react';
import {
  getConstructionHistoryByProjectIds,
  getConstructionProjectsForClient,
  getNotificationsForUser,
} from '@/lib/supabase/data';
import { getViewerContext } from '@/lib/supabase/dashboard-access';
import { constructionStageLabel, CONSTRUCTION_STAGES } from '@/lib/construction-stages';
import { CONSTRUCTION_CONSULTATION_URL } from '@/lib/consultation';

export const metadata: Metadata = {
  title: 'Construction dashboard',
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
const WORKFLOW_STEPS = [
  { key: 'consultation', title: 'Consultation Booked' },
  { key: 'boq', title: 'BOQ Reviewed' },
  { key: 'agreement', title: 'Agreement Signed' },
  { key: 'payment', title: 'Initial Payment' },
  { key: 'construction', title: 'Construction Tracking' },
] as const;

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('en-NG', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function stageProgress(stage: string) {
  const index = CONSTRUCTION_STAGES.findIndex((item) => item.value === stage);
  if (index < 0) return 12;
  return Math.round(((index + 1) / CONSTRUCTION_STAGES.length) * 100);
}

function stageIndex(stage: string) {
  const index = CONSTRUCTION_STAGES.findIndex((item) => item.value === stage);
  return index < 0 ? 0 : index;
}

function isStepDone(step: (typeof WORKFLOW_STEPS)[number]['key'], furthestStageIndex: number) {
  switch (step) {
    case 'consultation':
      return furthestStageIndex >= stageIndex('consultation_scheduled');
    case 'boq':
      return furthestStageIndex >= stageIndex('quotation_sent');
    case 'agreement':
      return furthestStageIndex >= stageIndex('agreement_signed');
    case 'payment':
      return furthestStageIndex >= stageIndex('construction_in_progress');
    case 'construction':
      return furthestStageIndex >= stageIndex('milestone_update');
    default:
      return false;
  }
}

function statusTone(status: string) {
  if (status === 'completed' || status === 'handover_complete') return 'bg-[#dcfce7] text-[#166534]';
  if (status === 'on_hold') return 'bg-[#fef3c7] text-[#92400e]';
  return 'bg-[#efe8f7] text-[#500085]';
}

function stageTone(current: string, stageValue: string) {
  if (current === stageValue) return 'bg-[#f3ebfa] text-[#500085]';
  return 'bg-[#f8f8fb] text-[#6b7280]';
}

export default async function ConstructionDashboardPage() {
  const viewer = await getViewerContext();
  if (!viewer) return null;

  const [projects, notifications] = await Promise.all([
    getConstructionProjectsForClient(viewer.userId),
    getNotificationsForUser(viewer.userId, 6),
  ]);
  const history = await getConstructionHistoryByProjectIds(projects.map((project) => project.id));

  const activeProjects = projects.filter((project) => project.status !== 'completed').length;
  const boqReadyCount = projects.filter((project) =>
    ['quotation_sent', 'agreement_signed'].includes(project.current_stage),
  ).length;
  const pendingConsultation = projects.filter((project) =>
    ['inquiry_received'].includes(project.current_stage),
  ).length;
  const completedProjects = projects.filter((project) => project.current_stage === 'handover_complete').length;
  const totalUpdates = Object.values(history).flat().length;
  const avgProgress = projects.length
    ? Math.round(projects.reduce((total, project) => total + stageProgress(project.current_stage), 0) / projects.length)
    : 0;
  const updatesByMonth = MONTHS.map((month, index) => {
    const count = Object.values(history)
      .flat()
      .filter((item) => new Date(item.changed_at).getMonth() === index).length;
    return { month, count };
  });
  const peakUpdates = Math.max(1, ...updatesByMonth.map((item) => item.count));

  const stageCounts = CONSTRUCTION_STAGES.map((stage) => ({
    ...stage,
    count: projects.filter((project) => project.current_stage === stage.value).length,
  }));

  const workflowIndex = projects.length
    ? Math.max(...projects.map((project) => stageIndex(project.current_stage)))
    : 0;
  const completedWorkflowSteps = WORKFLOW_STEPS.filter((step) =>
    isStepDone(step.key, workflowIndex),
  ).length;
  const hasAgreement = projects.some((project) =>
    ['agreement_signed', 'construction_in_progress', 'milestone_update', 'nearing_completion', 'handover_complete'].includes(
      project.current_stage,
    ),
  );
  const hasConstructionStarted = projects.some((project) =>
    ['construction_in_progress', 'milestone_update', 'nearing_completion', 'handover_complete'].includes(
      project.current_stage,
    ),
  );
  const nextAction = !projects.length
    ? 'Book your first consultation to kickstart BOQ planning.'
    : !isStepDone('consultation', workflowIndex)
      ? 'Book consultation to unlock BOQ review and project planning.'
      : !isStepDone('boq', workflowIndex)
        ? 'Review BOQ with admin and approve quotation terms.'
        : !isStepDone('agreement', workflowIndex)
          ? 'Sign agreement to move into payment and kickoff.'
          : !isStepDone('payment', workflowIndex)
            ? 'Complete initial payment to start site mobilization.'
            : 'Track milestones and approve stage-based updates.';

  const staleProjects = projects.filter((project) => {
    const latestChanged = history[project.id]?.[0]?.changed_at ?? project.updated_at;
    const daysSince = Math.floor((Date.now() - new Date(latestChanged).getTime()) / (1000 * 60 * 60 * 24));
    return daysSince > 14;
  });

  const metrics = [
    {
      label: 'Live Projects',
      value: activeProjects,
      helper: `${projects.length} total projects`,
      icon: Building2,
    },
    {
      label: 'BOQ Ready',
      value: boqReadyCount,
      helper: `${pendingConsultation} awaiting consultation`,
      icon: FileText,
    },
    {
      label: 'Admin Updates',
      value: totalUpdates,
      helper: `${avgProgress}% average progress`,
      icon: Hammer,
    },
    {
      label: 'Approvals Pending',
      value: Math.max(0, projects.length - completedProjects - (hasAgreement ? 1 : 0)),
      helper: hasAgreement ? 'Agreement signed on at least one project' : 'Awaiting agreement',
      icon: Wallet,
    },
  ] as const;

  return (
    <div className="space-y-5">
      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <div key={metric.label} className="rounded-[18px] border border-border/70 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[13px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
                    {metric.label}
                  </p>
                  <p className="mt-5 text-[2.35rem] font-semibold leading-none tracking-[-0.04em] text-foreground">
                    {metric.value}
                  </p>
                </div>
                <metric.icon className="h-5 w-5 text-[#500085]" />
              </div>
              <p className="mt-4 text-sm text-muted-foreground">{metric.helper}</p>
            </div>
          ))}
        </div>

        <aside className="rounded-[18px] border border-border/70 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
              Client Workflow
            </p>
            <FileClock className="h-4 w-4 text-[#500085]" />
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            {completedWorkflowSteps}/{WORKFLOW_STEPS.length} stages completed
          </p>
          <div className="mt-4 space-y-2">
            {WORKFLOW_STEPS.map((step, idx) => {
              const done = isStepDone(step.key, workflowIndex);
              return (
                <div key={step.key} className="flex items-center gap-3 rounded-xl bg-[#fbfafc] px-3 py-2">
                  <span
                    className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                      done ? 'bg-[#500085] text-white' : 'bg-[#e7e7ee] text-[#6b7280]'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <p className={`text-sm ${done ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                    {step.title}
                  </p>
                </div>
              );
            })}
          </div>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">{nextAction}</p>
          <div className="mt-4 flex gap-2">
            <a
              href={CONSTRUCTION_CONSULTATION_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 items-center rounded-full bg-[#500085] px-4 text-sm font-medium text-white hover:bg-[#3B0063]"
            >
              Book consultation
            </a>
            {hasConstructionStarted ? (
              <Link
                href="/real-estate/construction"
                className="inline-flex h-10 items-center rounded-full border border-border px-4 text-sm font-medium text-foreground hover:bg-muted"
              >
                View service page
              </Link>
            ) : null}
          </div>
        </aside>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="rounded-[18px] border border-border/70 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Admin update velocity (last 6 months)</p>
              <h2 className="mt-2 text-[2rem] font-semibold tracking-[-0.05em] text-foreground">{totalUpdates}</h2>
            </div>
            <LineChart className="h-5 w-5 text-[#500085]" />
          </div>

          <div className="mt-8 flex h-[190px] items-end gap-4 overflow-hidden rounded-2xl bg-[#fbfafc] px-4 py-5">
            {updatesByMonth.map(({ month, count }) => {
              const height = 44 + (count / peakUpdates) * 112;
              return (
                <div key={month} className="flex flex-1 flex-col items-center gap-3">
                  <div
                    className={`w-full max-w-[70px] rounded-2xl border border-border/70 ${
                      count ? 'bg-[#500085]' : 'bg-white'
                    }`}
                    style={{ height }}
                    title={`${count} update${count === 1 ? '' : 's'}`}
                  />
                  <span className="text-xs font-medium text-muted-foreground">{month}</span>
                </div>
              );
            })}
          </div>
        </div>

        <aside className="rounded-[18px] border border-border/70 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-[-0.03em]">Risk & Exceptions</h2>
            <AlertTriangle className="h-5 w-5 text-[#500085]" />
          </div>
          <div className="mt-4 grid gap-3">
            <div className="rounded-2xl border border-border/70 bg-[#fbfafc] p-4">
              <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">Stale project updates</p>
              <p className="mt-2 text-2xl font-semibold text-[#92400e]">{staleProjects.length}</p>
              <p className="mt-1 text-xs text-muted-foreground">No stage note in 14+ days</p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-[#fbfafc] p-4">
              <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">Avg progress</p>
              <p className="mt-2 text-2xl font-semibold text-[#166534]">{avgProgress}%</p>
              <p className="mt-1 text-xs text-muted-foreground">Across all active projects</p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-[#fbfafc] p-4">
              <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">Completion count</p>
              <p className="mt-2 text-2xl font-semibold text-[#500085]">{completedProjects}</p>
              <p className="mt-1 text-xs text-muted-foreground">Handover complete</p>
            </div>
          </div>
        </aside>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="rounded-[18px] border border-border/70 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-[-0.03em]">Stage Distribution</h2>
            <BarChart3 className="h-5 w-5 text-[#500085]" />
          </div>
          <div className="mt-5 space-y-3">
            {stageCounts.map((stage) => {
              const width = projects.length ? (stage.count / projects.length) * 100 : 0;
              return (
                <div key={stage.value}>
                  <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{stage.label}</span>
                    <span>{stage.count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#efedf4]">
                    <div className="h-full rounded-full bg-[#500085]" style={{ width: `${width}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <aside className="rounded-[18px] border border-border/70 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-[-0.03em]">Latest Activity</h2>
            <MessageSquareText className="h-5 w-5 text-[#500085]" />
          </div>
          {notifications.length === 0 ? (
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              Construction updates from the admin team will appear here.
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {notifications.map((notice) => (
                <li key={notice.id} className="rounded-2xl border border-border/70 bg-[#fbfafc] p-4">
                  <p className="text-sm font-semibold text-foreground">{notice.title}</p>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">{notice.body}</p>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </section>

      <section id="projects" className="rounded-[18px] border border-border/70 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 border-b border-border/70 pb-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-[-0.03em]">Construction Projects</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Follow stage, evidence notes, consultation status, and approvals from the admin team.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a
              href={CONSTRUCTION_CONSULTATION_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-[14px] bg-[#500085] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#3B0063]"
            >
              Book consultation
              <ArrowUpRight className="h-4 w-4" />
            </a>
            <Link
              href="/real-estate/construction"
              className="inline-flex items-center gap-2 rounded-[14px] border border-border bg-white px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
            >
              Start new project
            </Link>
          </div>
        </div>

        {projects.length === 0 ? (
          <div className="py-12 text-center">
            <ClipboardList className="mx-auto h-10 w-10 text-[#500085]" />
            <h3 className="mt-4 text-xl font-semibold tracking-[-0.03em]">No construction project yet</h3>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
              Start from the construction page or book a consultation. Once admin creates your project,
              BOQ and milestone progress will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="mt-4 w-full min-w-[760px] text-left text-sm">
              <thead className="text-xs uppercase tracking-[0.08em] text-muted-foreground">
                <tr className="border-b border-border/70">
                  <th className="py-3 pr-4 font-medium">Project</th>
                  <th className="py-3 pr-4 font-medium">Stage</th>
                  <th className="py-3 pr-4 font-medium">Progress</th>
                  <th className="py-3 pr-4 font-medium">Workflow</th>
                  <th className="py-3 pr-4 font-medium">Latest Note</th>
                  <th className="py-3 pr-4 font-medium">Started</th>
                  <th className="py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => {
                  const progress = stageProgress(project.current_stage);
                  const latestNote = history[project.id]?.[0]?.note_to_client;
                  return (
                    <tr key={project.id} className="border-b border-border/60 last:border-b-0">
                      <td className="py-4 pr-4">
                        <p className="font-semibold text-foreground">{project.title}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {project.project_type} · {project.location}
                        </p>
                      </td>
                      <td className="py-4 pr-4">
                        <span className="inline-flex rounded-full bg-[#efe8f7] px-3 py-1 text-xs font-medium text-[#500085]">
                          {constructionStageLabel(project.current_stage)}
                        </span>
                      </td>
                      <td className="py-4 pr-4">
                        <div className="h-2 w-32 rounded-full bg-muted">
                          <div className="h-full rounded-full bg-[#500085]" style={{ width: `${progress}%` }} />
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">{progress}%</p>
                      </td>
                      <td className="py-4 pr-4">
                        <div className="flex flex-wrap gap-1">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-medium ${
                              isStepDone('consultation', stageIndex(project.current_stage))
                                ? 'bg-[#dcfce7] text-[#166534]'
                                : 'bg-[#f1f1f4] text-[#6b7280]'
                            }`}
                          >
                            consult
                          </span>
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-medium ${
                              isStepDone('boq', stageIndex(project.current_stage))
                                ? 'bg-[#ede9fe] text-[#500085]'
                                : 'bg-[#f1f1f4] text-[#6b7280]'
                            }`}
                          >
                            boq
                          </span>
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-medium ${
                              isStepDone('payment', stageIndex(project.current_stage))
                                ? 'bg-[#dbeafe] text-[#1d4ed8]'
                                : 'bg-[#f1f1f4] text-[#6b7280]'
                            }`}
                          >
                            payment
                          </span>
                        </div>
                      </td>
                      <td className="max-w-[240px] py-4 pr-4 text-muted-foreground">
                        {latestNote || 'No client-facing note yet.'}
                      </td>
                      <td className="py-4 pr-4 text-muted-foreground">{formatDate(project.created_at)}</td>
                      <td className="py-4">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusTone(project.status)}`}>
                          {project.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="rounded-[18px] border border-border/70 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold tracking-[-0.03em]">Construction Stage Board</h2>
          <Clock3 className="h-5 w-5 text-[#500085]" />
        </div>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {projects.map((project) => (
            <div key={project.id} className="rounded-xl border border-border/70 bg-[#fbfafc] p-4">
              <p className="font-semibold text-foreground">{project.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {project.project_type} · {project.location}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {CONSTRUCTION_STAGES.slice(0, 6).map((stage) => (
                  <span
                    key={`${project.id}-${stage.value}`}
                    className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-medium ${stageTone(
                      project.current_stage,
                      stage.value,
                    )}`}
                  >
                    {stage.label}
                  </span>
                ))}
              </div>
            </div>
          ))}
          {!projects.length ? (
            <div className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
              No projects available to visualize stage board.
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
