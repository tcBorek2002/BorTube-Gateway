import express, { Router, Request, Response } from 'express'
import multer from 'multer';
import { IVideoService } from '../services/IVideoService';
import e from 'express';
import { InternalServerError } from '../errors/InternalServerError';
import { InvalidInputError } from '../errors/InvalidInputError';
import { NotFoundError } from '../errors/NotFoundError';
import { IVideoUploadService } from '../services/IVideoUploadService';

export class VideoRouter {
    private videosRouter: Router;
    private videoService: IVideoService;
    private uploadService: IVideoUploadService;
    private upload: multer.Multer;

    constructor(videoService: IVideoService, uploadService: IVideoUploadService) {
        this.videosRouter = express.Router();
        this.upload = multer({ storage: multer.memoryStorage() });
        this.videoService = videoService;
        this.uploadService = uploadService;

        // add prefix to all routes
        this.videosRouter.get('/temp', this.temp);
        this.videosRouter.get('/videos', this.getAllVideos);
        this.videosRouter.get('/videos/:id', this.getVideoById);
        this.videosRouter.put('/videos/:id', this.updateVideo);
        this.videosRouter.post('/videos', this.upload.single('video'), this.createVideo);
        this.videosRouter.delete('/videos/:id', this.deleteVideo);
    }

    private temp = (req: Request, res: Response) => {
        let videoId = "ssdf";
        let fileName = "cool.mp4";

        this.uploadService.getUploadUrl(videoId, fileName, 10).then((url) => {
            res.send(url);
        }).catch((error) => {
            console.error('Error getting upload url:', error);
            if (error instanceof InternalServerError) {
                return res.status(error.code).json({ error: error.message });
            }
            else {
                return res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    }

    private getAllVideos = (_req: Request, res: Response) => {
        try {
            this.videoService.getAllVisibleVideos().then((videos) => res.send(videos));
        } catch (error) {
            if (error instanceof InternalServerError) {
                res.status(error.code).json({ error: error.message });
            }
            else {
                res.status(500).json({ error: 'Internal Server Error' });
            }
        }
    }

    private getVideoById = (req: Request, res: Response) => {
        //  #swagger.description = 'Get a video by its ID'
        const videoId = Number(req.params.id);

        // Check if the video ID is a valid number
        if (isNaN(videoId)) {
            res.status(400).send('Invalid video ID. Must be a number.');
            return;
        }

        this.videoService.getVideoById(videoId).then((video) => {
            if (!video) {
                res.status(500).send("Internal server error.");
            }
            else {
                res.send(video);
            }
        }).catch((error) => {
            console.error('Error getting video by ID:', error);
            if (error instanceof InvalidInputError) {
                res.status(400).json({ error: 'Invalid video ID' });
            }
            else if (error instanceof NotFoundError) {
                res.status(404).json({ error: 'Video not found' });
            }
            else {
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    }

    private updateVideo = (req: Request, res: Response) => {
        //  #swagger.description = 'Update a video by its ID'
        const videoId = Number(req.params.id);

        // Check if the video ID is a valid number
        if (isNaN(videoId)) {
            res.status(400).send('Invalid video ID. Must be a number.');
            return;
        }
        const { title, description, videoState } = req.body;

        // Update the video in the database
        this.videoService.updateVideo({ id: videoId, title: title, description: description, videoState: videoState }).then((updatedVideo) => {
            if (updatedVideo != null) { res.status(200).json(updatedVideo) }
            else {
                res.status(404).send("Video not found");
            }
        }).catch((error) => {
            console.error('Error updating video:', error);
            if (error instanceof InvalidInputError) {
                return res.status(400).json({ error: error.message });
            }
            else if (error instanceof NotFoundError) {
                return res.status(404).json({ error: 'Video not found' });
            }
            else {
                return res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    }

    private createVideo = (req: Request, res: Response) => {
        //  #swagger.description = 'Create a new video'
        if (req.body == null) { return res.status(400).json({ error: 'Title, duration and fileName are required' }); }
        // const videoFile = req.file;

        // if (videoFile == undefined) {
        //     res.status(400).send("No file was sent or misformed file was sent.");
        //     return;
        // }
        const { title, description, fileName, duration } = req.body;
        if (title == undefined || description == undefined || fileName == undefined || duration == undefined || isNaN(duration)) {
            res.status(400).json({ error: 'Title, description, fileName and duration are required' });
            return;
        }

        this.videoService.createVideo(title, description, fileName, duration).then((returnObj) => {
            return res.status(201).json(returnObj);
        }).catch((error) => {
            console.error('Error creating video:', error);
            if (error instanceof InternalServerError) {
                return res.status(500).json({ error: error.message });
            }
            else if (error instanceof InvalidInputError) {
                return res.status(400).json({ error: 'Invalid input' });
            }
            else {
                return res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    }

    private deleteVideo = (req: Request, res: Response) => {
        //  #swagger.description = 'Delete a video by its ID'
        const videoId = Number(req.params.id);

        // Check if the video ID is a valid number
        if (isNaN(videoId)) {
            res.status(400).send('Invalid video ID. Must be a number.');
            return;
        }

        this.videoService.deleteVideoByID(videoId).then((deleted) => {
            return res.status(204).send();
        }).catch((error) => {
            console.error('Error deleting video:', error);
            if (error instanceof InvalidInputError) {
                return res.status(400).json({ error: 'Invalid video ID' });
            }
            else if (error instanceof NotFoundError) {
                return res.status(404).json({ error: 'Video not found' });
            }
            else {
                return res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    }

    public getRouter(): Router {
        return this.videosRouter;
    }
}