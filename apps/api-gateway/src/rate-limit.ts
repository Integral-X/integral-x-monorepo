import rateLimit from 'express-rate-limit';
// import RedisStore from 'rate-limit-redis'; // Uncomment for Redis integration

export const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    statusCode: 429,
    message: 'Too many requests, please try again later.'
  },
  // store: new RedisStore({
  //   sendCommand: ... // Provide Redis client for distributed rate limiting
  // })
}); 