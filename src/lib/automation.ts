export interface ChannelProfile {
  channelName: string;
  niche: string;
  audience: string;
  tone: string;
  keywords: string[];
  cadence: string;
  goal: string;
}

export interface VideoIdea {
  id: string;
  title: string;
  hook: string;
  framework: string;
  trendPairing: string;
  potentialScore: number;
}

export interface ScriptSegment {
  label: 'HOOK' | 'PAYOFF' | 'PROOF' | 'CTA';
  duration: number;
  pace: 'fast' | 'punchy' | 'dynamic';
  content: string;
}

export interface ScriptPlan {
  ideaId: string;
  title: string;
  promise: string;
  segments: ScriptSegment[];
  callToAction: string;
}

export interface ShotPlan {
  id: string;
  headline: string;
  direction: string;
  category: 'Hook' | 'Value Hit' | 'Social Proof' | 'Call to Action';
  overlay: string;
  duration: number;
}

export interface ReleasePlan {
  id: string;
  title: string;
  date: string;
  optimalWindow: string;
  cta: string;
  hashtags: string[];
  reasoning: string;
}

export interface AutomationTask {
  id: string;
  label: string;
  owner: string;
  due: string;
  notes: string;
  type: 'script' | 'shoot' | 'edit' | 'publish';
}

export interface TaskColumn {
  stage: 'Pre-production' | 'Production' | 'Post-production';
  items: AutomationTask[];
}

export interface AutomationPlan {
  profile: ChannelProfile;
  idea: VideoIdea;
  script: ScriptPlan;
  shotlist: ShotPlan[];
  schedule: ReleasePlan[];
  tasks: TaskColumn[];
}

const VIRAL_FRAMES = [
  {
    label: 'Paradigm Shift',
    hookTemplate: (topic: string) =>
      `Everyone is doing ${topic} wrong. Here is the new playbook.`,
  },
  {
    label: 'Rapid Challenge',
    hookTemplate: (topic: string) =>
      `Try this ${topic} challenge for 3 days and watch your numbers explode.`,
  },
  {
    label: 'AI vs Human',
    hookTemplate: (topic: string) =>
      `I asked AI to build the perfect ${topic} workflow. You need to see this.`,
  },
  {
    label: 'Zero to Mastery',
    hookTemplate: (topic: string) =>
      `Beginner to pro in 45 seconds: ${topic} edition.`,
  },
  {
    label: 'Before / After',
    hookTemplate: (topic: string) =>
      `I swapped my old ${topic} process for this. The difference? Insane.`,
  },
];

const TREND_PAIRINGS = [
  'trendjack: “faceless creator grind”',
  'pattern interrupt: b-roll swap every 0.7s',
  'algorithm boost: story gap at 40%',
  'community proof: stitch invite CTA',
  'loop trigger: watch to the end for template drop',
  'creator economy: monetization angle',
  'data-driven: retention chart overlay',
];

const CTA_LIBRARY = [
  'Comment “SHORTS” and I’ll DM you the notion template.',
  'Save this so you can rebuild the workflow tonight.',
  'DM this clip to your accountability partner and build together.',
  'Drop a ⚡ if you want the automation checklist.',
  'Screenshot the final shot—this is your content sprint board.',
];

const RELEASE_WINDOWS = [
  { label: '12:05 PM PST', reason: 'Lunch scroll spike for US west coast.' },
  { label: '3:40 PM EST', reason: 'Post-school short-form binge window.' },
  { label: '8:10 PM EST', reason: 'Prime couch scroll with high session times.' },
];

const OWNER_ROLES = ['You', 'Editor', 'Automation Bot', 'Community Manager'];

function sample<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function makeId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return Array.from({ length: 8 })
    .map(() => Math.floor(Math.random() * 36).toString(36))
    .join('');
}

function seededScore(seed: string) {
  let score = 0;
  for (const char of seed) {
    score += char.charCodeAt(0);
  }
  return 78 + (score % 22);
}

function buildTitle(profile: ChannelProfile, framework: string) {
  const keyword = sample(profile.keywords);
  const niche = profile.niche.split(' ')[0] ?? 'Creators';
  return `${framework}: ${keyword} for ${niche}`;
}

export function generateIdeas(profile: ChannelProfile): VideoIdea[] {
  const baseKeyword = profile.keywords[0] ?? profile.niche;
  return Array.from({ length: 6 }).map(() => {
    const framework = sample(VIRAL_FRAMES);
    const trendPairing = sample(TREND_PAIRINGS);
    const title = buildTitle(profile, framework.label);
    const hook = framework.hookTemplate(baseKeyword);
    return {
      id: makeId(),
      title,
      hook,
      framework: framework.label,
      trendPairing,
      potentialScore: seededScore(title + trendPairing),
    };
  });
}

export function buildScript(
  idea: VideoIdea,
  profile: ChannelProfile,
): ScriptPlan {
  const segments: ScriptSegment[] = [
    {
      label: 'HOOK',
      duration: 6,
      pace: 'fast',
      content: idea.hook.replace('Here is', 'Here’s'),
    },
    {
      label: 'PAYOFF',
      duration: 18,
      pace: 'dynamic',
      content: `Step 1: Capture raw inputs. Drop your daily ideas into the “${profile.channelName} Inbox” using voice notes or the AI capture widget.`,
    },
    {
      label: 'PROOF',
      duration: 22,
      pace: 'punchy',
      content: `Watch how the automation stitches a script, captions, and b-roll markers in under 90 seconds. Overlay the growth spike screenshot to validate.`,
    },
    {
      label: 'CTA',
      duration: 12,
      pace: 'fast',
      content: `Remind them the workflow is built for ${profile.audience}. Flash the three-step checklist while you prime the CTA.`,
    },
  ];

  return {
    ideaId: idea.id,
    title: idea.title,
    promise: `Ship a ${profile.niche} short in under 15 minutes.`,
    segments,
    callToAction: sample(CTA_LIBRARY),
  };
}

export function createShotlist(script: ScriptPlan): ShotPlan[] {
  const overlays = [
    'Caption: “Hook them in 2.7s”',
    'Overlay timer countdown',
    'Retention chart pops in',
    'CTA banner + subscribe sticker',
  ];

  const base: ShotPlan[] = script.segments.map((segment, idx) => ({
    id: makeId(),
    headline: segment.content.split('.').at(0) ?? segment.content,
    direction:
      idx === 0
        ? 'Start with a tight crop, aggressive energy, punch-in on every hook beat.'
        : idx === 1
          ? 'Screen record automation dashboard, highlight the drag-and-drop workflow.'
          : idx === 2
            ? 'Cut to testimonial overlay, drop in retention chart with smooth zoom.'
            : 'End with direct eye contact and gesture to the subscribe sticker.',
    category:
      idx === 0
        ? 'Hook'
        : idx === 1
          ? 'Value Hit'
          : idx === 2
            ? 'Social Proof'
            : 'Call to Action',
    overlay: overlays[idx] ?? 'Sticker: “watch again”',
    duration: segment.duration,
  }));

  return base;
}

function formatHashtag(input: string) {
  return `#${input
    .replace(/[^a-z0-9 ]/gi, '')
    .trim()
    .split(' ')
    .filter(Boolean)
    .slice(0, 3)
    .map((part, index) =>
      index === 0
        ? part.toLowerCase()
        : part.charAt(0).toUpperCase() + part.slice(1).toLowerCase(),
    )
    .join('')}`;
}

export function createPublishingSchedule(
  ideas: VideoIdea[],
  profile: ChannelProfile,
): ReleasePlan[] {
  return ideas.slice(0, 4).map((idea, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index * 2 + 1);
    const window = RELEASE_WINDOWS[index % RELEASE_WINDOWS.length];
    return {
      id: makeId(),
      title: idea.title,
      date: date.toISOString(),
      optimalWindow: window.label,
      cta: sample(CTA_LIBRARY),
      hashtags: [
        formatHashtag(profile.niche),
        formatHashtag(idea.framework),
        formatHashtag(sample(profile.keywords)),
      ],
      reasoning: window.reason,
    };
  });
}

export function buildProductionTasks(
  script: ScriptPlan,
  schedule: ReleasePlan[],
  owner: string,
): TaskColumn[] {
  const releasesById = new Map(schedule.map((entry) => [entry.id, entry]));
  const dueDate = (daysBeforePublish: number, releaseId: string) => {
    const release = releasesById.get(releaseId);
    if (!release) return new Date().toISOString();
    const date = new Date(release.date);
    date.setDate(date.getDate() - daysBeforePublish);
    return date.toISOString();
  };

  return [
    {
      stage: 'Pre-production',
      items: [
        {
          id: makeId(),
          label: 'Outline final hook & promise',
          owner,
          due: dueDate(3, schedule[0]?.id ?? ''),
          notes: `Refine messaging for “${script.title}” and align with the ${script.promise} angle.`,
          type: 'script',
        },
        {
          id: makeId(),
          label: 'Source social proof assets',
          owner: sample(OWNER_ROLES),
          due: dueDate(2, schedule[0]?.id ?? ''),
          notes: 'Pull retention charts, testimonial overlays, and before/after metrics.',
          type: 'script',
        },
      ],
    },
    {
      stage: 'Production',
      items: [
        {
          id: makeId(),
          label: 'Record hook variants',
          owner,
          due: dueDate(1, schedule[0]?.id ?? ''),
          notes:
            'Capture 3 takes with different punch-in speeds. Keep energy above baseline.',
          type: 'shoot',
        },
        {
          id: makeId(),
          label: 'Layer b-roll and overlays',
          owner: sample(OWNER_ROLES),
          due: dueDate(0, schedule[0]?.id ?? ''),
          notes:
            'Sync automation dashboard recordings with dynamic zoom transitions.',
          type: 'edit',
        },
      ],
    },
    {
      stage: 'Post-production',
      items: [
        {
          id: makeId(),
          label: 'Upload & schedule publish',
          owner: owner,
          due: schedule[0]?.date ?? new Date().toISOString(),
          notes: `Queue inside YouTube Studio with ${schedule[0]?.optimalWindow ?? 'prime time'} slot.`,
          type: 'publish',
        },
        {
          id: makeId(),
          label: 'Prep community activation',
          owner: sample(OWNER_ROLES),
          due: schedule[0]
            ? dueDate(-1, schedule[0].id)
            : new Date().toISOString(),
          notes:
            'Draft pinned comment, community tab teaser, and Discord prompt.',
          type: 'publish',
        },
      ],
    },
  ];
}
