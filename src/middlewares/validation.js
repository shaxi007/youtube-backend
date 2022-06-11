import { loginSchema, registerSchema, videoSchemaPut } from "../utils/validations.js";
import { ValidationError } from "../utils/errors.js";

export default (req, res, next) => {
    try {

        if(req.method == 'POST' && req.url == '/login'){
            let {error} = loginSchema.validate(req.body)
            if(error) throw error
        }

        if(req.method == 'POST' && req.url == '/register'){
            let {error} = registerSchema.validate(req.body)
            if(error) throw error
        }
        
        if(req.method == 'PUT' && req.url == `/admin/videos/${req.params.videoId}`){
            let {error} = videoSchemaPut.validate({body: req.body, params: req.params})
            if(error) throw error
        }

        return next()

    } catch (error) {
        return next( new ValidationError(401, error.message) )
    }

}

