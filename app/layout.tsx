import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist } from "next/font/google";
import { JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/shell/theme-provider";
import { Sidebar } from "@/components/shell/sidebar";
import { getAllProjects } from "@/lib/content";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Siddhant Acharya",
  description: "Backend & distributed systems engineer",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const projects = await getAllProjects();
  const projectFrontmatters = projects.map((p) => p.frontmatter);

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full">
        <ThemeProvider>
          {/* Background overlays */}
          <div className="bg-grid fixed inset-0 pointer-events-none opacity-40" />
          <div className="bg-noise fixed inset-0 pointer-events-none" />

          {/* Shell */}
          <div className="relative flex min-h-screen flex-col">
            <Suspense>
              <Sidebar projects={projectFrontmatters} />
            </Suspense>
            <div className="flex flex-1 flex-col lg:ml-[260px]">
              <main className="flex-1">
                {children}
              </main>
              <footer className="border-t border-app-border px-5 py-8 sm:px-8 lg:px-12">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="font-sans text-sm font-medium text-app-text">
                      Siddhant Acharya
                    </p>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-app-text-muted">
                      Backend &amp; distributed systems engineer · Bangalore
                    </p>
                    <div className="mt-3 flex items-center gap-3">
                      <a href="https://github.com/siddhu12980" target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-app-text-muted transition-colors hover:text-app-accent">GitHub</a>
                      <span className="text-app-text-muted">·</span>
                      <a href="https://linkedin.com/in/siddhanta-acharya" target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-app-text-muted transition-colors hover:text-app-accent">LinkedIn</a>
                      <span className="text-app-text-muted">·</span>
                      <a href="https://twitter.com/siddhu12980" target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-app-text-muted transition-colors hover:text-app-accent">Twitter</a>
                      <span className="text-app-text-muted">·</span>
                      <a href="mailto:dipendrabhatta.gdscfetju@gmail.com" className="font-mono text-xs text-app-text-muted transition-colors hover:text-app-accent">Email</a>
                    </div>
                  </div>
                  <p className="font-mono text-[10px] text-app-text-muted">
                    &copy; {new Date().getFullYear()} Siddhant Acharya. Built with Next.js.
                  </p>
                </div>
              </footer>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
