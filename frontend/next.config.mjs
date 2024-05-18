// import million from 'million/compiler'; //It has some promlems with SSR
import 'dotenv/config.js';
import dotenv from 'dotenv';

const envConfig = dotenv.config({ path: '../.env-non-dev' });

// Merge process.env and the .env-non-dev file
for (const key in envConfig.parsed) {
  process.env[key] = envConfig.parsed[key];
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // images: {
  //   remotePatterns: ['images.unsplash.com'], // add some if needed
  // },
  experimental: {},
};

// const millionConfig = {
//   auto: true,
// };

// export default million.next(nextConfig, millionConfig);
export default nextConfig;
