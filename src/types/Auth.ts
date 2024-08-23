export type User = {
  user_id: string;
  name: string;
  oauth_original_name: string;
  avatar_url: string;
};

export type UserProfile = User & {
  oauth_id: string;
  oauth_provider: "google" | "discord";
  oauth_original_name: string;
  statistics: {
    gamesPlayed: number;
    gamesWon: number;
  };
  created_at: Date;
  updated_at: Date;
};
