'use client';

import { useMemo, useState } from 'react';
import {
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Clock,
  Download,
  Lightbulb,
  Play,
  Sparkles,
  Timer,
} from 'lucide-react';
import {
  buildProductionTasks,
  buildScript,
  createPublishingSchedule,
  createShotlist,
  generateIdeas,
  type AutomationPlan,
  type ChannelProfile,
  type ReleasePlan,
  type ShotPlan,
  type VideoIdea,
} from '@/lib/automation';

const defaultProfile: ChannelProfile = {
  channelName: 'Daily Shorts Lab',
  niche: 'AI tools for solo creators',
  audience: 'ambitious solo creators who want to grow with short-form video',
  tone: 'fast-paced, hype, but still practical',
  keywords: ['AI workflow', 'content strategy', 'viral hooks'],
  cadence: '3 shorts per week',
  goal: 'reach 50k subscribers in 90 days by shipping consistently',
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    weekday: 'short',
  }).format(new Date(date));
}

export function AutomationDashboard() {
  const [profile, setProfile] = useState<ChannelProfile>(defaultProfile);
  const [ideas, setIdeas] = useState<VideoIdea[]>([]);
  const [selectedIdea, setSelectedIdea] = useState<VideoIdea | null>(null);
  const [script, setScript] = useState<AutomationPlan['script'] | null>(null);
  const [shotlist, setShotlist] = useState<ShotPlan[]>([]);
  const [schedule, setSchedule] = useState<ReleasePlan[]>([]);
  const [tasks, setTasks] = useState<AutomationPlan['tasks']>([]);
  const [isWorking, setIsWorking] = useState(false);

  const automationPlan = useMemo<AutomationPlan | null>(() => {
    if (!profile || !selectedIdea || !script) return null;
    return {
      profile,
      idea: selectedIdea,
      script,
      shotlist,
      schedule,
      tasks,
    };
  }, [profile, selectedIdea, script, shotlist, schedule, tasks]);

  const handleGenerate = async () => {
    setIsWorking(true);
    await new Promise((resolve) => setTimeout(resolve, 300));

    const generatedIdeas = generateIdeas(profile);
    const primaryIdea = generatedIdeas[0];
    const generatedScript = buildScript(primaryIdea, profile);
    const generatedShotlist = createShotlist(generatedScript);
    const publishingSchedule = createPublishingSchedule(
      generatedIdeas,
      profile,
    );
    const productionTasks = buildProductionTasks(
      generatedScript,
      publishingSchedule,
      profile.channelName,
    );

    setIdeas(generatedIdeas);
    setSelectedIdea(primaryIdea);
    setScript(generatedScript);
    setShotlist(generatedShotlist);
    setSchedule(publishingSchedule);
    setTasks(productionTasks);
    setIsWorking(false);
  };

  const handleSelectIdea = (idea: VideoIdea) => {
    const generatedScript = buildScript(idea, profile);
    setSelectedIdea(idea);
    setScript(generatedScript);
    setShotlist(createShotlist(generatedScript));
    setTasks((prev) =>
      prev.map((stage) => ({
        ...stage,
        items: stage.items.map((item) => ({
          ...item,
          notes:
            item.type === 'script'
              ? `Craft script using idea "${idea.title}"`
              : item.notes,
        })),
      })),
    );
  };

  const handleDownloadPlan = () => {
    if (!automationPlan) return;
    const blob = new Blob([JSON.stringify(automationPlan, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${automationPlan.profile.channelName
      .toLowerCase()
      .replaceAll(' ', '-')}-shorts-automation.json`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8 text-white shadow-xl">
        <div className="flex items-center gap-3 text-slate-300">
          <Sparkles className="size-6 text-emerald-400" />
          <span className="text-sm uppercase tracking-[0.4em] text-slate-400">
            Shorts Automation Console
          </span>
        </div>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight lg:text-5xl">
              Build, schedule, and ship YouTube Shorts on autopilot
            </h1>
            <p className="mt-4 max-w-3xl text-lg text-slate-300">
              Drop in your channel profile once. The automation engine
              generates viral-ready ideas, outlines pacing-based scripts, smart
              shot lists, and a production schedule that keeps you shipping on
              time.
            </p>
          </div>
          <button
            type="button"
            onClick={handleGenerate}
            className="group inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-emerald-500 px-6 py-3 text-base font-semibold text-slate-950 shadow-lg transition hover:-translate-y-0.5 hover:bg-emerald-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
          >
            {isWorking ? (
              <>
                <span className="size-2 animate-ping rounded-full bg-slate-900" />
                Orchestrating automation…
              </>
            ) : (
              <>
                <Play className="size-4" />
                Launch automation
              </>
            )}
          </button>
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
          <div className="flex items-center gap-3 text-slate-600">
            <ClipboardList className="size-5 text-slate-900" />
            <h2 className="text-xl font-semibold text-slate-900">
              Channel Operating System
            </h2>
          </div>
          <p className="mt-2 text-sm text-slate-500">
            Calibrate once and reuse the profile for every future automation
            run. Adjust any fields and click launch again to regenerate a fresh
            drop of ideas, scripts, and schedules.
          </p>
          <form className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span className="text-xs font-medium uppercase text-slate-400">
                Channel name
              </span>
              <input
                value={profile.channelName}
                onChange={(event) =>
                  setProfile((prev) => ({
                    ...prev,
                    channelName: event.target.value,
                  }))
                }
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-xs font-medium uppercase text-slate-400">
                Primary niche
              </span>
              <input
                value={profile.niche}
                onChange={(event) =>
                  setProfile((prev) => ({
                    ...prev,
                    niche: event.target.value,
                  }))
                }
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              />
            </label>
            <label className="flex flex-col gap-2 sm:col-span-2">
              <span className="text-xs font-medium uppercase text-slate-400">
                Core audience
              </span>
              <textarea
                value={profile.audience}
                onChange={(event) =>
                  setProfile((prev) => ({
                    ...prev,
                    audience: event.target.value,
                  }))
                }
                className="min-h-[72px] rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              />
            </label>
            <label className="flex flex-col gap-2 sm:col-span-2">
              <span className="text-xs font-medium uppercase text-slate-400">
                Voice & energy
              </span>
              <input
                value={profile.tone}
                onChange={(event) =>
                  setProfile((prev) => ({
                    ...prev,
                    tone: event.target.value,
                  }))
                }
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-xs font-medium uppercase text-slate-400">
                Publishing cadence
              </span>
              <input
                value={profile.cadence}
                onChange={(event) =>
                  setProfile((prev) => ({
                    ...prev,
                    cadence: event.target.value,
                  }))
                }
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-xs font-medium uppercase text-slate-400">
                90-day target
              </span>
              <input
                value={profile.goal}
                onChange={(event) =>
                  setProfile((prev) => ({
                    ...prev,
                    goal: event.target.value,
                  }))
                }
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              />
            </label>
            <label className="flex flex-col gap-2 sm:col-span-2">
              <span className="text-xs font-medium uppercase text-slate-400">
                Keywords & hooks (comma separated)
              </span>
              <input
                value={profile.keywords.join(', ')}
                onChange={(event) =>
                  setProfile((prev) => ({
                    ...prev,
                    keywords: event.target.value
                      .split(',')
                      .map((keyword) => keyword.trim())
                      .filter(Boolean),
                  }))
                }
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              />
            </label>
          </form>
        </article>

        <aside className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-slate-700 shadow-inner">
          <h3 className="text-base font-semibold text-slate-900">
            Automation snapshot
          </h3>
          <div className="grid gap-3 text-sm">
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white/80 px-3 py-2 shadow-sm">
              <Lightbulb className="size-4 text-amber-500" />
              <div>
                <p className="font-medium text-slate-900">
                  Idea engine ready
                </p>
                <p className="text-xs text-slate-500">
                  Framework-weighted prompts tailored to your niche.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white/80 px-3 py-2 shadow-sm">
              <Timer className="size-4 text-emerald-500" />
              <div>
                <p className="font-medium text-slate-900">
                  Pace-aware script writer
                </p>
                <p className="text-xs text-slate-500">
                  Segments matched to 58s watch retention targets.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white/80 px-3 py-2 shadow-sm">
              <CalendarDays className="size-4 text-indigo-500" />
              <div>
                <p className="font-medium text-slate-900">
                  Auto scheduling in sync
                </p>
                <p className="text-xs text-slate-500">
                  Release windows optimized for US primetime scroll slots.
                </p>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleDownloadPlan}
            disabled={!automationPlan}
            className="mt-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-400 hover:text-slate-900 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400"
          >
            <Download className="size-4" />
            Export automation JSON
          </button>
        </aside>
      </section>

      {ideas.length > 0 && (
        <section className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-slate-700">
                <Sparkles className="size-5 text-emerald-500" />
                <h2 className="text-xl font-semibold text-slate-900">
                  Idea Pipeline
                </h2>
              </div>
              <span className="text-xs font-medium uppercase tracking-[0.3em] text-slate-400">
                {ideas.length} active prompts
              </span>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {ideas.map((idea) => {
                const isActive = selectedIdea?.id === idea.id;
                return (
                  <button
                    key={idea.id}
                    type="button"
                    onClick={() => handleSelectIdea(idea)}
                    className={`flex h-full flex-col gap-3 rounded-2xl border px-4 py-4 text-left transition ${
                      isActive
                        ? 'border-emerald-500 bg-emerald-50 shadow-lg'
                        : 'border-slate-200 bg-white hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                        {idea.framework}
                      </span>
                      <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600">
                        <Sparkles className="size-3 text-emerald-500" />
                        {Math.round(idea.potentialScore)} AI score
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      {idea.title}
                    </h3>
                    <p className="text-sm text-slate-600">{idea.hook}</p>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>{idea.trendPairing}</span>
                      <span className="inline-flex items-center gap-1 text-emerald-600">
                        Use script
                        <ChevronRight className="size-3" />
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </article>

          {script && (
            <article className="flex h-full flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-inner">
              <div className="flex items-center gap-3 text-slate-700">
                <Timer className="size-5 text-emerald-500" />
                <h2 className="text-lg font-semibold text-slate-900">
                  Retention Blueprint
                </h2>
              </div>
              <div className="flex flex-col gap-4">
                {script.segments.map((segment) => (
                  <div
                    key={segment.label}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
                  >
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="font-semibold uppercase tracking-[0.2em]">
                        {segment.label}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 font-medium text-slate-500">
                        <Clock className="size-3" />
                        {segment.duration}s · {segment.pace} pace
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-slate-700">
                      {segment.content}
                    </p>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl border border-dashed border-emerald-300 bg-emerald-50/60 px-4 py-3 text-sm text-emerald-700">
                <span className="font-medium text-emerald-900">
                  CTA & overlay cues:
                </span>{' '}
                {script.callToAction}
              </div>
            </article>
          )}
        </section>
      )}

      {shotlist.length > 0 && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3 text-slate-700">
              <CameraIcon />
              <h2 className="text-xl font-semibold text-slate-900">
                Smart Shot Planner
              </h2>
            </div>
            <span className="text-xs font-medium uppercase tracking-[0.3em] text-slate-400">
              Scene breakdown
            </span>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {shotlist.map((shot) => (
              <div
                key={shot.id}
                className="flex flex-col justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm"
              >
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold uppercase tracking-[0.2em] text-slate-400">
                    {shot.category}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-1 font-medium text-slate-600">
                    <Clock className="size-3 text-emerald-500" />
                    {shot.duration}s
                  </span>
                </div>
                <h3 className="text-base font-semibold text-slate-900">
                  {shot.headline}
                </h3>
                <p className="text-sm text-slate-600">{shot.direction}</p>
                <p className="text-xs font-medium uppercase tracking-[0.3em] text-emerald-700">
                  Overlay: {shot.overlay}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {schedule.length > 0 && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
          <div className="flex items-center gap-3 text-slate-700">
            <CalendarDays className="size-5 text-indigo-500" />
            <h2 className="text-xl font-semibold text-slate-900">
              Auto Publishing Schedule
            </h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {schedule.map((release) => (
              <div
                key={release.id}
                className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm"
              >
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Drop window
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-1 font-medium text-slate-600">
                    <Clock className="size-3 text-indigo-500" />
                    {release.optimalWindow}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {release.title}
                </h3>
                <p className="text-sm text-slate-600">{release.reasoning}</p>
                <div className="text-xs text-slate-500">
                  <p className="font-semibold text-slate-700">
                    {formatDate(release.date)}
                  </p>
                  <p>CTA: {release.cta}</p>
                  <p>Tags: {release.hashtags.join(' · ')}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {tasks.length > 0 && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
          <div className="flex items-center gap-3 text-slate-700">
            <CheckCircle2 className="size-5 text-emerald-500" />
            <h2 className="text-xl font-semibold text-slate-900">
              Automation Kanban
            </h2>
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {tasks.map((column) => (
              <div
                key={column.stage}
                className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm"
              >
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span className="font-semibold text-slate-900">
                    {column.stage}
                  </span>
                  <span className="rounded-full bg-white px-2 py-1 text-xs font-medium text-slate-500">
                    {column.items.length} tasks
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  {column.items.map((task) => (
                    <div
                      key={task.id}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-xs text-slate-600 shadow-sm"
                    >
                      <p className="text-sm font-semibold text-slate-900">
                        {task.label}
                      </p>
                      <p className="mt-1">{task.notes}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 font-medium text-emerald-600">
                          <Clock className="size-3" />
                          {formatDate(task.due)}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 font-medium text-slate-600">
                          <CalendarDays className="size-3" />
                          {task.owner}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function CameraIcon() {
  return (
    <div className="flex size-10 items-center justify-center rounded-full bg-slate-900 text-slate-100 shadow-lg shadow-slate-900/20">
      <span className="text-sm font-semibold">REC</span>
    </div>
  );
}
