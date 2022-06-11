import { Router } from "express";
import controller from '../controllers/video.js'
import checkToken from "../middlewares/checkToken.js";
import videoSchemaPut from "../middlewares/validation.js";

const router = Router()

router.get('/videos', controller.GET)
router.get('/admin/videos', checkToken,  controller.GET)
router.post('/admin/videos', checkToken, controller.POST)
router.put('/admin/videos/:videoId',checkToken, videoSchemaPut, controller.PUT)
router.delete('/admin/videos/:videoId',checkToken, controller.DELETE)




export default router