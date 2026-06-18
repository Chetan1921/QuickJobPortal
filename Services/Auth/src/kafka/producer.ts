import { Kafka, Admin, Producer } from "kafkajs";
import TryCatch from "../middleware/TryCatch.js";
import ErrorHandler from "../utils/ErrorHandle.js";
let producer: Producer;
let admin: Admin;
import dotenv from 'dotenv'

dotenv.config();
const kafka = new Kafka({
    clientId: 'AuthService',
    brokers: [process.env.KAFKA_BROKER || 'localhost:9092'], // Update with your Kafka broker address
});


export const ProducerInit = async () => {

    try {
        producer = kafka.producer();
        if (!producer) {
            throw new ErrorHandler("Error In Connecting Producer", 400)
        }
        await producer.connect();
        console.log("Producer Connected Successfully");
    }
    catch (err) {
        console.log(err);
    }

}
export const SendMessage = async (topic: string, message: any) => {
    try {
        //  console.log("Sending Message:", message);

        await producer.send({
            topic,
            messages: [
                {
                    value: JSON.stringify(message)
                }
            ]
        });

        console.log("✅ Message sent to Kafka");
    }
    catch (err) {
        console.log("Producer Error:", err);
    }
}
export const disconnectProducer = async () => {

    try {
        if (producer) {
            await producer.disconnect()
        }
    }
    catch (err) {
        console.log(err);
    }

}