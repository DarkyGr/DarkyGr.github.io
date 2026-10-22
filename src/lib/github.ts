export interface Repo {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  pushed_at: string;
  fork: boolean;
  archived: boolean;
}

/**
 * Fetches public repos at build time. Returns [] on any failure so the
 * build never breaks because of GitHub rate limits or being offline.
 */
export async function getRepos(user: string, limit = 6): Promise<Repo[]> {
  try {
    const headers: Record<string, string> = { Accept: 'application/vnd.github+json' };
    const token = import.meta.env.GITHUB_TOKEN;
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(
      `https://api.github.com/users/${user}/repos?per_page=100&sort=pushed`,
      { headers },
    );
    if (!res.ok) return [];

    const repos = (await res.json()) as Repo[];
    return repos
      .filter((r) => !r.fork && !r.archived && r.name.toLowerCase() !== `${user}.github.io`.toLowerCase())
      .sort((a, b) => b.stargazers_count - a.stargazers_count || Date.parse(b.pushed_at) - Date.parse(a.pushed_at))
      .slice(0, limit);
  } catch {
    return [];
  }
}
