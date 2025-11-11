export const metadata = {
  title: "Excel Service Hub - Cinematic Promo",
  description: "3D cinematic promo for Excel Service Hub"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
