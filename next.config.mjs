/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "export",
    images: {
        domains: ['geeky.com.ar', 'i.abcnewsfe.com', 'c2.staticflickr.com', 's3.amazonaws.com/photos.theojoproject.com'],
      },
};

export default nextConfig;
