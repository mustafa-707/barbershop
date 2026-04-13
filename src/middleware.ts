import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'ar'],
  defaultLocale: 'ar',
  localeDetection: false
});

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(ar|en)/:path*']
};
