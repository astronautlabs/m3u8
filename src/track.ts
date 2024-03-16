import { Comment } from "./comment";

export interface Track {
    comments: Comment[];
    title?: string;
    album?: string;
    artist?: string;
    metadata: Record<string, string>;
    genre?: string;
    fileSize?: number;
    duration?: number;
    image?: string;
    group?: string;
    url: string;
}
