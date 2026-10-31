// Learner progress, kept in localStorage for now. Every read and write goes
// through this module, so swapping in a backend later means replacing only
// the `store` object below.

const KEY = 'aerocore.progress.v1';

interface ProgressData {
  completed: string[]; // lesson slugs
  checked: Record<string, string[]>; // slug -> checked heading ids
  recent: { slug: string; title: string; at: number }[];
}

const empty = (): ProgressData => ({ completed: [], checked: {}, recent: [] });

const store = {
  load(): ProgressData {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? { ...empty(), ...JSON.parse(raw) } : empty();
    } catch {
      return empty();
    }
  },
  save(data: ProgressData) {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch {
      /* storage blocked: progress lasts for this page view only */
    }
  },
};

export const EVENT = 'aerocore:progress';

function update(fn: (d: ProgressData) => void) {
  const d = store.load();
  fn(d);
  store.save(d);
  document.dispatchEvent(new CustomEvent(EVENT));
}

export const progress = {
  get: () => store.load(),
  isComplete: (slug: string) => store.load().completed.includes(slug),
  setComplete(slug: string, done: boolean) {
    update((d) => {
      d.completed = d.completed.filter((s) => s !== slug);
      if (done) d.completed.push(slug);
    });
  },
  checked: (slug: string) => store.load().checked[slug] ?? [],
  setChecked(slug: string, id: string, on: boolean) {
    update((d) => {
      const set = new Set(d.checked[slug] ?? []);
      on ? set.add(id) : set.delete(id);
      d.checked[slug] = [...set];
    });
  },
  visit(slug: string, title: string) {
    update((d) => {
      d.recent = [{ slug, title, at: Date.now() }, ...d.recent.filter((r) => r.slug !== slug)].slice(0, 5);
    });
  },
};

/** Slug of the current page, matching the curriculum data (no base, no slashes). */
export function currentSlug(): string {
  const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
  return decodeURIComponent(location.pathname.slice(base.length)).replace(/^\/|\/$/g, '') || 'index';
}
