export default {
  providers: [
    {
      domain: process.env.NEXT_PUBLIC_CLERK_SERVER_CONFIG,
      applicationID: "convex",
    },
  ],
};
