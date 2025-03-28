import { type NextRequest } from "next/server";
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'


const isProtectedRoute = createRouteMatcher(['/home(.*)', '/post-ad(.*)', '/chats(.*)', '/'])

export default clerkMiddleware(async (auth, request)=>{
  console.log("hello from here")
  if (isProtectedRoute(request)) {
    await auth.protect()
  }
})
// export async function middleware(request: NextRequest) {
//   console.log(request);
//   // return await updateSession(request);
// }


export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
