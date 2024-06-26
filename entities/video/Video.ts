import { VideoState } from "./VideoState";

export type Video = {
    id: string;
    userId: string;
    title: string;
    description: string;
    videoState: VideoState;
    videoFileId: string | null;
}