// app/services/session.server.ts
import { createCookieSessionStorage, redirect } from 'react-router';
import { type IUser } from '~/models';

// export the whole sessionStorage object
export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '_session', // use any name you want here
    sameSite: 'lax', // this helps with CSRF
    path: '/', // remember to add this so the cookie will work in all routes
    httpOnly: true, // for security reasons, make this cookie http only
    secrets: ["s3cret"], // replace this with an actual secret
    secure: process.env.NODE_ENV === 'production', // enable this in prod only
  },
});

// you can also export the methods individually for your own usage
export const { getSession, commitSession, destroySession } = sessionStorage;

const getUserSession = async (request: Request) => {
    return await sessionStorage.getSession(request.headers.get("Cookie"));
};

export async function logout(request: Request) {
    const session = await getUserSession(request);
    return redirect("/", {
        headers: {
            "Set-Cookie": await sessionStorage.destroySession(session),
        },
    });
}

const USER_SESSION_KEY = "userId";

export async function getUserId(
  request: Request
): Promise<IUser | undefined> {
  const session = await getUserSession(request);
  const userId = session.get(USER_SESSION_KEY);
  return userId;
}

export async function createUserSession({
    request,
    userId,
    remember = true,
    redirectUrl,
  }: {
    request: Request;
    userId: string;
    remember: boolean;
    redirectUrl?: string;
  }) {
    const session = await getUserSession(request);
    session.set(USER_SESSION_KEY, userId);
    return redirect(redirectUrl || "/", {
      headers: {
        "Set-Cookie": await sessionStorage.commitSession(session, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: remember
            ? 60 * 60 * 24 * 7 // 7 days
            : undefined,
        }),
      },
    });
  }