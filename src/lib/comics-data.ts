// Comic metadata — sourced from comics-metadata.json
// YouTube URLs extracted from podcast transcripts + web search

export interface Comic {
  comic_id: string;
  slug: string;
  quote: string;
  speaker: string;
  episode_title: string;
  episode_file: string;
  youtube_url: string;
  timestamp: string;
  panels: number;
  theme: string;
  cover: string; // path to cover image (panel_1)
}

export const comics: Comic[] = [
  {
    comic_id: "comic_1",
    slug: "comic-1",
    quote: "Most adults in the corporate environment are really just babies in disguise.",
    speaker: "Lenny Rachitsky",
    episode_title: "A child psychologist's guide to working with difficult adults | Dr. Becky Kennedy",
    episode_file: "dr-becky-kennedy.md",
    youtube_url: "https://www.youtube.com/watch?v=Auxs8ZsHRI4",
    timestamp: "00:00:00",
    panels: 4,
    theme: "Office/workplace humor — PM daily life at the desk",
    cover: "/comics/comic_1/panel_1.webp",
  },
  {
    comic_id: "comic_2",
    slug: "comic-2",
    quote: "Sometimes you have the best idea and they just don't bite.",
    speaker: "Lenny Rachitsky",
    episode_title: "The art of influence | Jessica Fain (Webflow, ex-Slack)",
    episode_file: "jessica-fain.md",
    youtube_url: "https://www.youtube.com/watch?v=Ucc3_vvRERo",
    timestamp: "00:00:50",
    panels: 4,
    theme: "Meeting/presentation scenario — pitching ideas",
    cover: "/comics/comic_2/panel_1.webp",
  },
  {
    comic_id: "comic_3",
    slug: "comic-3",
    quote: "When someone offers you a rocket ship, don't ask which seat.",
    speaker: "Lenny Rachitsky",
    episode_title: "Inside ChatGPT | Nick Turley (Head of ChatGPT at OpenAI)",
    episode_file: "nick-turley.md",
    youtube_url: "https://www.youtube.com/watch?v=ixY2PvQJ0To",
    timestamp: "00:00:11",
    panels: 4,
    theme: "Two characters in conversation — mentor advice",
    cover: "/comics/comic_3/panel_1.webp",
  },
  {
    comic_id: "comic_4",
    slug: "comic-4",
    quote: "For engineers, I don't know what job has changed more in the past couple years.",
    speaker: "Lenny Rachitsky",
    episode_title: "Sherwin Wu V2",
    episode_file: "sherwin-wu-v2.md",
    youtube_url: "https://www.youtube.com/watch?v=B26CwKm5C1k",
    timestamp: "00:00:04",
    panels: 4,
    theme: "Character reacting to screen/phone — tech disruption",
    cover: "/comics/comic_4/panel_1.webp",
  },
  {
    comic_id: "comic_5",
    slug: "comic-5",
    quote: "You don't really have a choice. That's true.",
    speaker: "Ben Horowitz",
    episode_title: "$46B of hard truths from Ben Horowitz",
    episode_file: "ben-horowitz.md",
    youtube_url: "https://www.youtube.com/watch?v=KPxTekxQjzc",
    timestamp: "00:10:12",
    panels: 4,
    theme: "Two characters in discussion — hard truths",
    cover: "/comics/comic_5/panel_1.webp",
  },
  {
    comic_id: "comic_6",
    slug: "comic-6",
    quote: "The only way to create a word of mouth loop is just to blow their socks off.",
    speaker: "Elena Verna",
    episode_title: "Elena Verna 4.0",
    episode_file: "elena-verna-40.md",
    youtube_url: "https://www.youtube.com/watch?v=6qAB6aUMIeA",
    timestamp: "00:01:25",
    panels: 4,
    theme: "Character sequence with expressive reactions — growth excitement",
    cover: "/comics/comic_6/panel_1.webp",
  },
  {
    comic_id: "comic_7",
    slug: "comic-7",
    quote: "I have a very weird brain that for some odd reason just always thinks in metaphors.",
    speaker: "Molly Graham",
    episode_title: "Molly Graham's frameworks for leading through chaos, change, and scale",
    episode_file: "molly-graham.md",
    youtube_url: "https://www.youtube.com/watch?v=twzLDx9iers",
    timestamp: "00:15:06",
    panels: 4,
    theme: "Workplace scene with multiple characters — team dynamics",
    cover: "/comics/comic_7/panel_1.webp",
  },
  {
    comic_id: "comic_8",
    slug: "comic-8",
    quote: "People aren't fully grasping how much this is changing.",
    speaker: "Lenny Rachitsky",
    episode_title: "Marc Andreessen: The real AI boom hasn't even started yet",
    episode_file: "marc-andreessen.md",
    youtube_url: "https://www.youtube.com/watch?v=87Pm0SGTtN8",
    timestamp: "00:01:18",
    panels: 4,
    theme: "Character with thought bubble — realization/insight moment",
    cover: "/comics/comic_8/panel_1.webp",
  },
  {
    comic_id: "comic_9",
    slug: "comic-9",
    quote: "It's a very Buddhist way of thinking too. Just don't cling.",
    speaker: "Lenny Rachitsky",
    episode_title: "Molly Graham's frameworks for leading through chaos",
    episode_file: "molly-graham.md",
    youtube_url: "https://www.youtube.com/watch?v=twzLDx9iers",
    timestamp: "00:21:24",
    panels: 4,
    theme: "Characters in casual setting — life philosophy",
    cover: "/comics/comic_9/panel_1.webp",
  },
  {
    comic_id: "comic_10",
    slug: "comic-10",
    quote: "The implication there is if you want less despair, increase the meaning.",
    speaker: "Lenny Rachitsky",
    episode_title: "Brian Chesky's secret mentor | Chip Conley (founder of MEA)",
    episode_file: "chip-conley.md",
    youtube_url: "https://www.youtube.com/watch?v=R5_ypwiRIyo",
    timestamp: "01:12:01",
    panels: 4,
    theme: "Concluding/punchline panels — deep insight",
    cover: "/comics/comic_10/panel_1.webp",
  },
];

export function getComicBySlug(slug: string): Comic | undefined {
  return comics.find((c) => c.slug === slug);
}

export function getAdjacentComics(slug: string): { prev: Comic | null; next: Comic | null } {
  const idx = comics.findIndex((c) => c.slug === slug);
  return {
    prev: idx > 0 ? comics[idx - 1] : null,
    next: idx < comics.length - 1 ? comics[idx + 1] : null,
  };
}
