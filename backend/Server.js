import express from 'express'
import cors from "cors"
import "dotenv/config"
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/Cloudinary.js'
import userRouter from './Routes/userRoute.js'
import productRouter from './Routes/productRoute.js'
import cartRouter from './Routes/cartRoute.js'
import orderRouter from './Routes/orderRoute.js'

// app config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

// middlewares
app.use(express.json())
app.use(cors())

// api endpoints
app.use('/api/user', userRouter);
app.use('/api/product',productRouter);
app.use('/api/cart',cartRouter);
app.use('/api/order',orderRouter);


app.get('/',(req,res)=>{
    res.send("API WORKING")
})

app.listen(port, ()=>console.log("server started on port: " + port))