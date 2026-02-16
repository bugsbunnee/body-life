import IORedis from 'ioredis';
import logger from './logger.service';

import { FEATURES } from '../utils/constants';

const client = new IORedis({
   username: process.env.REDIS_USERNAME,
   password: process.env.REDIS_PASSWORD,
   host: process.env.REDIS_HOST,
   port: Number(process.env.REDIS_PORT),
   retryStrategy: (times) => Math.min(times * 50, 500),
   connectTimeout: 10000,
});

client.on('connect', () => logger.error('Redis Client Connected...'));

client.on('error', (err) => logger.error('Redis Client Error...', err));

class RedisService {
   async addToList<T>(key: string, value: T) {
      if (!FEATURES.ENABLE_CACHE) {
         return;
      }

      try {
         client.sadd(key, JSON.stringify(value));
      } catch (error) {
         logger.error(`Failed to store record in list for key: ${key}`, error);
      }
   }

   async checkInList<T>(key: string, value: string): Promise<boolean> {
      if (!FEATURES.ENABLE_CACHE) {
         return false;
      }

      try {
         const exists = await client.sismember(key, value);

         return exists === 1;
      } catch (error) {
         logger.error('Failed to retrieve record from cache list', error);

         return false;
      }
   }

   async removeFromList<T>(key: string, value: string): Promise<void> {
      if (!FEATURES.ENABLE_CACHE) {
         return;
      }

      try {
         await client.srem(key, value);
      } catch (error) {
         logger.error('Failed to remove record from cache list', error);
      }
   }

   async storeItem<T>(key: string, value: T, expiryInSeconds: number) {
      if (!FEATURES.ENABLE_CACHE) {
         return;
      }

      try {
         await client.setex(key, expiryInSeconds, JSON.stringify(value));
      } catch (error) {
         logger.error(`Failed to store record in cache for key: ${key}`, error);
      }
   }

   async retrieveItem<T>(key: string): Promise<T | null> {
      if (!FEATURES.ENABLE_CACHE) {
         return null;
      }

      try {
         const data = await client.get(key);
         return data ? JSON.parse(data) : null;
      } catch (error) {
         logger.error('Failed to retrieve record from cache', error);
         return null;
      }
   }

   async removeItem(key: string): Promise<void> {
      if (!FEATURES.ENABLE_CACHE) {
         return;
      }

      try {
         await client.del(key);
      } catch (error) {
         logger.error('Failed to remove record from cache', error);
      }
   }
}

export default new RedisService();
