export interface AnimeImage {
  image_url: string;
  small_image_url?: string;
  large_image_url?: string;
}

export interface AnimeImages {
  jpg?: AnimeImage;
}

export interface BaseGeneric {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

export interface RelationEntry {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

export interface Relation {
  relation: string;
  entry: RelationEntry[];
}

export interface Broadcast {
  day?: string;
  time?: string;
  timezone?: string;
  string?: string;
}

export interface Aired {
  from?: string;
  to?: string;
  string?: string;
}

export interface TrailerImages {
  image_url?: string;
  small_image_url?: string;
  medium_image_url?: string;
  large_image_url?: string;
  maximum_image_url?: string;
}

export interface Trailer {
  youtube_id?: string;
  url?: string;
  embed_url?: string;
  images?: TrailerImages;
}

export interface Anime {
  mal_id: number;
  url?: string;
  images?: AnimeImages;
  trailer?: Trailer;
  approved?: boolean;
  titles?: Array<{ type: string; title: string }>;
  title: string;
  title_english?: string;
  title_japanese?: string;
  type?: string;
  source?: string;
  episodes?: number;
  status?: string;
  airing?: boolean;
  aired?: Aired;
  duration?: string;
  rating?: string;
  score?: number;
  scored_by?: number;
  rank?: number;
  popularity?: number;
  members?: number;
  favorites?: number;
  synopsis?: string;
  background?: string;
  season?: string;
  year?: number;
  broadcast?: Broadcast;
  producers?: BaseGeneric[];
  licensors?: BaseGeneric[];
  studios?: BaseGeneric[];
  genres?: BaseGeneric[];
  explicit_genres?: BaseGeneric[];
  themes?: BaseGeneric[];
  demographics?: BaseGeneric[];
  relations?: Relation[];
}

export interface CharacterItem {
  mal_id: number;
  url: string;
  images?: {
    jpg?: {
      image_url: string;
    };
  };
  name: string;
}

export interface PersonItem {
  mal_id: number;
  url: string;
  images?: {
    jpg?: {
      image_url: string;
    };
  };
  name: string;
}

export interface VoiceActor {
  person: PersonItem;
  language: string;
}

export interface Character {
  character: CharacterItem;
  role: string;
  favorites?: number;
  voice_actors?: VoiceActor[];
}

export interface Recommendation {
  entry: Anime;
  votes: number;
}

export interface ReviewUser {
  username: string;
  url?: string;
  images?: {
    jpg?: {
      image_url: string;
    };
  };
}

export interface Review {
  mal_id: number;
  url: string;
  type: string;
  reactions?: {
    overall: number;
    nice: number;
    love_it?: number;
    funny?: number;
    confusing?: number;
    informative?: number;
    creative?: number;
    well_written?: number;
  };
  date: string;
  review: string;
  score: number;
  tags?: string[];
  is_spoiler?: boolean;
  is_preliminary?: boolean;
  episodes_watched?: number;
  user?: ReviewUser;
}

export interface Platform {
  id: string;
  name: string;
  rank?: number;
  logo?: string;
  tier: string; // "official" | "unofficial"
  price: string;
  badge?: string;
  badgeColor?: string;
  note: string;
  sub: boolean;
  dub: boolean;
  hindi: boolean;
  catalog?: number;
  bg?: string;
  border?: string;
  color?: string;
}

export interface ToastConfig {
  msg: string;
  type: "success" | "error" | "info";
}

export interface NavigationState {
  page: string;
  browseMode?: string;
  genreFilter?: { id: number; name: string; color: string } | null;
}
