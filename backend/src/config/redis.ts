import { createClient } from 'redis';
import { config } from './environment';

const isTest = config.env === 'test' || process.env.NODE_ENV === 'test';

let redisClient: any = null;
let connectRedis: () => Promise<void>;

if (isTest) {
  // lightweight no-op mock for tests
  redisClient = {
    connect: async () => undefined,
    disconnect: async () => undefined,
    on: (_: string, __: any) => undefined,
    get: async (_key: string) => null,
    set: async (_key: string, _value: any) => 'OK',
    del: async (_key: string) => 1,
    quit: async () => undefined
  } as any;

  connectRedis = async () => {
    // no-op in tests
    return;
  };
} else {
  redisClient = createClient({
    url: `redis://${config.redis.password ? ':' + config.redis.password + '@' : ''}${config.redis.host}:${config.redis.port}`,
    socket: {
      reconnectStrategy: (retries: number) => {
        if (retries > 10) {
          console.error('❌ Redis connection failed after 10 retries');
          return new Error('Redis connection failed');
        }
        return retries * 100; // Exponential backoff
      }
    }
  });

  redisClient.on('error', (err: any) => {
    console.error('❌ Redis Client Error:', err);
  });

  redisClient.on('connect', () => {
    console.log('✅ Redis connected successfully');
  });

  redisClient.on('disconnect', () => {
    console.warn('⚠️  Redis disconnected');
  });

  connectRedis = async (): Promise<void> => {
    try {
      await redisClient.connect();
    } catch (error) {
      console.error('❌ Redis connection error:', error);
    }
  };
}

export { connectRedis };
export default redisClient;

