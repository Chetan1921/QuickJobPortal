import { Kafka } from 'kafkajs';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
dotenv.config();
const kafka = new Kafka({
    clientId: 'MailService',
    brokers: [process.env.KAFKA_BROKER || 'localhost:9092'], // Update with your Kafka broker address
});
// Create Consumer  
const consumer = kafka.consumer({ groupId: 'mail-service-group' });
export const InitConsumer = async () => {
    try {
        await consumer.connect();
        console.log('✅ Consumer connected');
        await consumer.subscribe({
            topic: 'send-mail',
            fromBeginning: true, // Consume from the beginning
        });
        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                // console.log("================================");
                // console.log("Topic:", topic);
                // console.log("Partition:", partition);
                // console.log("Offset:", message.offset);
                // console.log("Raw Message:", message.value?.toString());
                // console.log("================================");
                try {
                    if (!message.value) {
                        console.warn('⚠️ Received empty message value');
                        return;
                    }
                    const { to, subject, html } = JSON.parse(message.value.toString() || "{}");
                    //  const { to, subject, html } = parsed as { to?: string; subject?: string; html?: string };
                    // Check if message already exists
                    const transporter = nodemailer.createTransport({
                        host: "smtp.gmail.com",
                        port: 465,
                        secure: true,
                        auth: {
                            user: process.env.EMAIL,
                            pass: process.env.GMAIL_PASSWORD
                        }
                    });
                    await transporter.sendMail({
                        from: 'chetan.sharma200104022@gmail.com',
                        to,
                        subject,
                        html
                    });
                    console.log("Mail Sent to ", to);
                }
                catch (error) {
                    console.error('❌ Error parsing message:', error);
                }
            },
        });
    }
    catch (err) {
        console.log(err);
    }
};
