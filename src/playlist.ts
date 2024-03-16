import { Comment } from "./comment";
import { Track } from "./track";

export interface Playlist {
    format: 'M3U' | 'M3A';
    title?: string;
    encoding?: string;
    tracks: Track[];
    comments: Comment[];
}
