import express from 'express'
import fileUpload from 'express-fileupload'
import fs from 'fs'
import path from 'path'

const PORT = process.env.PORT || 5000
const app = express()


import userRouter from './routers/user.js'
import videoRouter from './routers/video.js'

app.use( express.json() )
app.use( fileUpload() )

app.use( express.static(path.join(process.cwd(), 'uploads')) )


app.use(userRouter)
app.use( videoRouter )


app.use((error, req, res, next) => {
    if(error.status != 500){
        return res.status(error.status).json({
            status: error.status,
            message: error.message
        })
    }
    fs.appendFileSync(path.join(process.cwd(), 'src', 'log.txt'),
    `${req.url}___${error.name}___${Date.now()}___${error.status}___${error.message}\n`
    )

    res.status(error.status).json({
        status: error.status,
        message: 'InternalServerError'
    })

    process.exit()
})

app.listen(PORT , () => console.log(`${PORT}`))
console.log('test');