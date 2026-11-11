import type { NextConfig } from 'next';
const config: NextConfig = {output:'export',images:{unoptimized:true},trailingSlash:true,reactStrictMode:true,devIndicators:false,outputFileTracingRoot:process.cwd(),turbopack:{root:process.cwd()}};
export default config;
