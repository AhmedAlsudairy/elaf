// Since we have a root `not-found.tsx` page, a layout file
// is required, even if it's just passing children through.
// The [locale]/layout.tsx handles the html/body tags.

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
