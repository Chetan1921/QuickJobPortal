import express, { urlencoded } from 'express'
import dotenv from 'dotenv'
import { ConnectDB } from './utils/db.js';
dotenv.config();
import jobroutes from './routes/index.js'
import { ProducerInit } from './kafka/producer.js'






const app = express();


// middelware
import cors from 'cors'


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/v1/jobs', jobroutes)

// Port 

const PORT = process.env.PORT || 5003

// DB Coonect

ConnectDB();
// Connect Kafka Producer
// ProducerInit();
app.listen(PORT, () => {
    console.log(`Job Service is Listening on the Port ${PORT}`);
})

