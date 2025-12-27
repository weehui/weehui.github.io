import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  // 1) 产出纯静态文件（会生成 out/ 目录）
  output: 'export',

  // 2) 让 Next 生成的所有构建产物（_next/static/** 等）使用相对前缀
  //    这样 `<script src="./_next/...">` 不走绝对根路径
  assetPrefix: isProd ? './' : undefined,

  // 3) 路由以目录形式导出，避免 about.html 链接问题
  trailingSlash: true,

  // 4) 关闭图片优化（否则需要 Image Optimizer 服务）
  images: { unoptimized: true },

  // 5)（可选）如果用到了 `next/script` 外链，确保不会要求跨域
};

export default nextConfig;
