// import million from 'million/compiler'; //It has some promlems with SSR
import { config as loadEnv } from 'dotenv';

loadEnv({ path: '../.env-non-dev' });

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
