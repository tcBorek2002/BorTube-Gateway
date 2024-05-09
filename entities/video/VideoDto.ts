import { VideoState } from "./VideoState";

export type VideoDto = {
    id: string;
    user: {
        id: string;
        displayName: string;
    };
    title: string;
    description: string;
    videoState: VideoState;
    videoFileId: string | null;
}