import express from  "express";

import { addShow, getNowPlayingMovies, getShow, getShows } from "../controllers/showControllers.js";
import { getLatestMovie } from "../controllers/showControllers.js";
import { protectAdmin } from "../middleware/auth.js";

const showoRouter = express.Router();

showoRouter.get('/now-playing', protectAdmin, getNowPlayingMovies)
showoRouter.post('/add', addShow)
showoRouter.get("/all", getShows)
showoRouter.get("/latest", getLatestMovie)
showoRouter.get("/:movieId", getShow)

export default showoRouter;