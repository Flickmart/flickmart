import presence from "@convex-dev/presence/convex.config";
import resend from "@convex-dev/resend/convex.config";
import persistentTextStreaming from "@convex-dev/persistent-text-streaming/convex.config";
import { defineApp } from "convex/server";

const app = defineApp();
app.use(resend);
app.use(presence);
app.use(persistentTextStreaming);

export default app;
