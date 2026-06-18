import { Kafka } from 'kafkajs';

const kafka = new Kafka({
    clientId: 'MailService',
    brokers: ['127.0.0.1:9092'], // Update with your Kafka broker address
});

const init = async () => {
  const admin = kafka.admin();
  
  try {
    console.log('🔗 Connecting Admin...');
    await admin.connect();

    console.log('📝 Creating topic: ');
    await admin.createTopics({
      topics: [
        {
          topic: 'send-mail',
          numPartitions: 1,
          replicationFactor: 1,
        },
      ],
      validateOnly: false,
      timeout: 5000,
    });

    console.log('✅ Topic created successfully!');
  } catch (error) {
    if (error.message.includes('Topic already exists')) {
      console.log('ℹ️  Topic already exists, skipping creation.');
    } else {
      console.error('❌ Error creating topic:', error.message);
    }
  } finally {
    await admin.disconnect();
    console.log('🔌 Admin disconnected.');
  }
};

init();

export default kafka;
