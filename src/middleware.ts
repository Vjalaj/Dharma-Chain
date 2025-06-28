import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Check if user is trying to access admin routes
    if (req.nextUrl.pathname.startsWith('/admin/dashboard')) {
      // Check if user is authenticated and is admin
      const token = req.nextauth.token;
      
      if (!token) {
        return NextResponse.redirect(new URL('/admin', req.url));
      }
      
      // Check if user has admin privileges
      const isAdmin = (token as any)?.isAdmin;
      if (!isAdmin) {
        return NextResponse.redirect(new URL('/admin?error=access_denied', req.url));
      }
    }
    
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to login page
        if (req.nextUrl.pathname === '/admin') {
          return true;
        }
        
        // For admin dashboard routes, require authentication and admin status
        if (req.nextUrl.pathname.startsWith('/admin/dashboard')) {
          return !!token && !!(token as any)?.isAdmin;
        }
        
        // Allow all other routes
        return true;
      },
    },
  }
);

export const config = {
  matcher: ['/admin/:path*']
};
