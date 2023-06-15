interface Rank {
  id: number;
  team_id: number;
  season: string;
  wins: number;
  losses: number;
  drawns: number;
  scored: number;
  conceded: number;
  points: number;
};

export type RankProfile = Rank;