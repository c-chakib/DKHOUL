import { createClient } from 'redis';
import { config } from './environment';

const redisClient = createClient({
  url: `redis://${config.redis.password ? ':' + config.redis.password + '@' : ''}${config.redis.host}:${config.redis.port}`,
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        console.error('❌ Redis connection failed after 10 retries');
        return new Error('Redis connection failed');
      }
      return retries * 100; // Exponential backoff
    }
  }
});

redisClient.on('error', (err) => {
  console.error('❌ Redis Client Error:', err);
});

redisClient.on('connect', () => {
  console.log('✅ Redis connected successfully');
});

redisClient.on('disconnect', () => {
  console.warn('⚠️  Redis disconnected');
});

export const connectRedis = async (): Promise<void> => {
  try {
    await redisClient.connect();
  } catch (error) {
    console.error('❌ Redis connection error:', error);
  }
};

export default redisClient;

