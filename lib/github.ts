const GITHUB_USERNAME = "siddhu12980";

export interface GitHubStats {
  repos: number;
  stars: number;
  commitsThisYear: number;
  prsMerged: number;
}

export interface GitHubData {
  contributions: number[][];
  stats: GitHubStats;
}

const FALLBACK: GitHubData = {
  contributions: generateFallbackContributions(),
  stats: { repos: 0, stars: 0, commitsThisYear: 0, prsMerged: 0 },
};

function generateFallbackContributions(): number[][] {
  const weeks: number[][] = [];
  let seed = 42;
  const rand = () => {
    seed = (seed * 16807 + 0) % 2147483647;
    return seed / 2147483647;
  };
  for (let w = 0; w < 52; w++) {
    const week: number[] = [];
    const boost = w > 35 ? 1.5 : w > 20 ? 1.0 : 0.6;
    for (let d = 0; d < 7; d++) {
      const r = rand();
      week.push(r < 0.3 * boost ? 0 : r < 0.55 ? 1 : r < 0.75 ? 2 : r < 0.9 ? 3 : 4);
    }
    weeks.push(week);
  }
  return weeks;
}

function countToLevel(count: number): number {
  if (count === 0) return 0;
  if (count <= 3) return 1;
  if (count <= 9) return 2;
  if (count <= 19) return 3;
  return 4;
}

export async function fetchGitHubData(): Promise<GitHubData> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return FALLBACK;

  try {
    const query = `
      query {
        user(login: "${GITHUB_USERNAME}") {
          repositories(first: 100, ownerAffiliations: OWNER) {
            totalCount
            nodes { stargazerCount }
          }
          contributionsCollection {
            totalCommitContributions
            totalPullRequestContributions
            contributionCalendar {
              weeks {
                contributionDays {
                  contributionCount
                }
              }
            }
          }
        }
      }
    `;

    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
      next: { revalidate: 3600 },
    });

    if (!res.ok) return FALLBACK;

    const json = await res.json();
    const user = json?.data?.user;
    if (!user) return FALLBACK;

    const repos = user.repositories.nodes as { stargazerCount: number }[];
    const stars = repos.reduce((s: number, r: { stargazerCount: number }) => s + r.stargazerCount, 0);
    const cc = user.contributionsCollection;

    const contributions: number[][] = cc.contributionCalendar.weeks.map(
      (week: { contributionDays: { contributionCount: number }[] }) =>
        week.contributionDays.map((d: { contributionCount: number }) => countToLevel(d.contributionCount)),
    );

    return {
      contributions,
      stats: {
        repos: user.repositories.totalCount,
        stars,
        commitsThisYear: cc.totalCommitContributions,
        prsMerged: cc.totalPullRequestContributions,
      },
    };
  } catch {
    return FALLBACK;
  }
}
