import mongoose, { mongo } from 'mongoose'
import cors from 'cors'
import express from 'express'
import 'dotenv/config'
import usersRoute from './routes/usersRoute.js'
const app = express()
app.use(cors())
app.use(express.json())
app.use('/api/uploads', express.static('/uploads'))

app.use('/api/users', usersRoute)

app.use((error, req, res, next) => {
    console.log(error);
    return res.status(error.statusCode || 500).json({
        data: null,
        message: error.message,
        success: false
    })
})
app.listen(process.env.PORT, () => {
    console.log(`Server Listen On PORT ${process.env.PORT}`);
    mongoose.connect(process.env.DATABASE_URL).then(() => {
        console.log(`Database Connected`);

    })
})