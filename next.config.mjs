/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingIncludes: {
    '/*': ['./prisma/**/*'],
    '/**/*': ['./prisma/**/*'],
  },
};

export default nextConfig;
