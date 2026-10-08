/**
 * Search index for the command palette (Ctrl/⌘ K). Generated at build time
 * from the same collections as the pages, so it only ever contains what is
 * published. A few kilobytes, fetched on first open.
 */
import type { APIRoute } from 'astro';
import { published } from '@/lib/drafts';
import { href } from '@/lib/url';
import { hasVisible } from '@/lib/nav';
import { DOMAIN_LABELS } from '@/data/taxonomy';

interface Entry {
  title: string;
  url: string;
  type: string;
  summary: string;
  keywords: string;
}

export const GET: APIRoute = async () => {
  const pages: [string, string, string][] = [
    ['Home', '/', 'Overview of my work, story and writing'],
    ['About', '/about/', 'My story, values and the industries I have worked in'],
    ['Experience', '/experience/', 'Career timeline: roles, achievements and technologies'],
    ['Expertise', '/skills/', 'Skills by area, with context and evidence'],
    ['Projects', '/projects/', 'Side projects and client work'],
    ['Writing', '/writing/', 'Engineering articles on Medium'],
    ['Now', '/now/', "Changelog and tech radar — what I'm building now"],
    ['Contact', '/contact/', 'Email, availability and profiles'],
  ];
  if (await hasVisible('playbooks')) pages.splice(4, 0, ['Approach', '/approach/', 'How I solve problems, debug and review code']);
  if (await hasVisible('problems')) pages.splice(4, 0, ['Problems solved', '/problems/', 'Enterprise problems and how I solved them']);
  if (await hasVisible('caseStudies')) pages.splice(4, 0, ['Case studies', '/case-study/', 'In-depth engineering case studies']);

  const entries: Entry[] = pages.map(([title, url, summary]) => ({ title, url: href(url), type: 'Page', summary, keywords: '' }));

  for (const c of await published('caseStudies')) {
    entries.push({
      title: c.data.title,
      url: href(`/case-study/${c.id}/`),
      type: 'Case study',
      summary: c.data.summary,
      keywords: [c.data.company, c.data.industry, ...c.data.stack, ...c.data.domains.map((d) => DOMAIN_LABELS[d])].join(' '),
    });
  }

  for (const p of await published('problems')) {
    entries.push({
      title: p.data.title,
      url: href(`/problems/#${p.id}`),
      type: 'Problem',
      summary: p.data.problem,
      keywords: [DOMAIN_LABELS[p.data.domain], p.data.context, ...p.data.stack].join(' '),
    });
  }

  for (const p of await published('projects')) {
    entries.push({
      title: p.data.title,
      url: href(`/projects/${p.id}/`),
      type: 'Project',
      summary: p.data.summary,
      keywords: [p.data.category, p.data.industry, p.data.company, ...p.data.stack].filter(Boolean).join(' '),
    });
  }

  for (const p of await published('playbooks')) {
    entries.push({ title: p.data.title, url: href(`/approach/#${p.id}`), type: 'Playbook', summary: p.data.summary, keywords: '' });
  }

  for (const a of await published('articles')) {
    entries.push({
      title: a.data.title,
      url: a.data.url,
      type: 'Article',
      summary: a.data.excerpt,
      keywords: [...a.data.categories, ...a.data.tags].join(' '),
    });
  }

  for (const r of await published('experience')) {
    entries.push({
      title: `${r.data.role}, ${r.data.company}`,
      url: href(`/experience/#${r.id}`),
      type: 'Role',
      summary: r.data.summary,
      keywords: [r.data.industry, ...r.data.stack].join(' '),
    });
  }

  for (const area of await published('skills')) {
    entries.push({
      title: area.data.area,
      url: href(`/skills/#${area.id}`),
      type: 'Expertise',
      summary: area.data.summary,
      keywords: area.data.skills.map((s) => s.name).join(' '),
    });
  }

  return new Response(JSON.stringify(entries), { headers: { 'Content-Type': 'application/json' } });
};
