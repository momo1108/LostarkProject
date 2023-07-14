module.exports = {
  apps: [
    {
      name: "buildstart",
      script: "npm run build && npm start",
    },
    {
      name: "dev",
      script: "npm run dev",
    },
    {
      name: "start",
      script: "npm run start",
    },
  ],
};
