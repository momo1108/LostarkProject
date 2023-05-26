/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    CLIENT_TOKEN:
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IktYMk40TkRDSTJ5NTA5NWpjTWk5TllqY2lyZyIsImtpZCI6IktYMk40TkRDSTJ5NTA5NWpjTWk5TllqY2lyZyJ9.eyJpc3MiOiJodHRwczovL2x1ZHkuZ2FtZS5vbnN0b3ZlLmNvbSIsImF1ZCI6Imh0dHBzOi8vbHVkeS5nYW1lLm9uc3RvdmUuY29tL3Jlc291cmNlcyIsImNsaWVudF9pZCI6IjEwMDAwMDAwMDAyMzI5ODkifQ.N5oLptIyWnqMmBKdVejTZTJ_bKDZHKA57huKsbVNBPA0BgsThZ-WDM19EZqaXIpzdORnW0F2aH9dXwUecySqgKNYZMJsBG0YVhPbQyHWSKCuCSl0Sv6nznb0sfKb06oVidKnOr2h1qikUoCadTKWkZqIjZQpbqIPC1QgISyiePoIUQPHGojII3YnFwJdoYpSUuuc3oUYBKSzqgV400O3toWyO7MalEKt1dAw58xYnxnLjxq0wNf8F-NUqNI0bfEepWFBptK1beWzKDeklXBK8dUZZsYEZOvRyRf8jONNK6dgvuyK1HQq7nxcoxZPCeg5rYNhfdalVLcpJo6E8D7YuQ",
  },
  async rewrites() {
    return [
      {
        source: "/reqimg/:name*",
        destination:
          "https://lostark.game.onstove.com/Profile/Character/:name*",
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.lostark.co.kr",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
