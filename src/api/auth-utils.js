import Cookie from "js-cookie";
import SSRCookie from "cookie";
import { AUTH_CRED, PERMISSIONS, TOKEN } from "./constants";

export function setAuthCredentials(token, permissions) {
  Cookie.set(AUTH_CRED, JSON.stringify({ token, permissions }));
}

export function getAuthCredentials(context) {
  let authCred;
  if (context) {
    authCred = parseSSRCookie(context)[AUTH_CRED];
  } else {
    authCred = Cookie.get(AUTH_CRED);
  }
  if (authCred) {
    return JSON.parse(authCred);
  }
  return { token: null, permissions: null };
}

export function parseSSRCookie(context) {
  return SSRCookie.parse(context.req.headers.cookie ?? "");
}

export function isAuthenticated(_cookies) {
  return !!_cookies[TOKEN];
}
