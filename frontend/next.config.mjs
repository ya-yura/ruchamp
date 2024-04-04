// import million from 'million/compiler'; //It has some promlems with SSR
import withBundleAnalyzer from '@next/bundle-analyzer';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // It may be so that I need to switch off strict mode for Fluent UI React
  experimental: {
    // fluentui-next-appdir-directive plugin with the paths for @griffel and @fluentui:
    swcPlugins: [
      ['fluentui-next-appdir-directive', { paths: ['@griffel', '@fluentui'] }],
    ],
  },
};

// const millionConfig = {
//   auto: false, // unfortunately, it looks like million.js does not work with Fluent at least in automode
// };

// export default million.next(nextConfig, millionConfig);

// export default nextConfig;

export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})(nextConfig);
