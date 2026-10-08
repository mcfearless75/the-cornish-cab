import { createServerFn } from "@tanstack/react-start";
import { getRequestUrl } from "@tanstack/react-start/server";

export const getSiteOrigin = createServerFn({ method: "GET" }).handler(async () => {
  const configured = process.env.SITE_ORIGIN?.replace(/\/$/, "");
  if (configured) return configured;
  try {
    return getRequestUrl({ xForwardedHost: true, xForwardedProto: true }).origin;
  } catch {
    return "";
  }
});
