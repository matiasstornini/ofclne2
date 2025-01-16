/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
	  remotePatterns: [{ hostname: "res.cloudinary.com" }],
	},
	experimental: {
	  appDir: true,
	},
	async headers() {
	  return [
		{
		  source: "/api/socket",
		  headers: [
			{
			  key: "Access-Control-Allow-Origin",
			  value: "*",
			},
			{
			  key: "Cache-Control",
			  value: "no-cache",
			},
		  ],
		},
	  ];
	},
  };
  
  export default nextConfig;
  