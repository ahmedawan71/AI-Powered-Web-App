import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Resume Tailor App</title>
      </head>
      <body className="flex flex-col min-h-screen">
        <header className="bg-glass p-4">
          <div className="max-w-6xl mx-auto flex items-center">
            <svg className="w-8 h-8 text-white mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h1 className="text-2xl font-bold text-white">Resume Tailor App</h1>
          </div>
        </header>
        <main className="flex-grow">{children}</main>
        <footer className="bg-glass p-4">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-white">&copy; 2025 Resume Tailor App. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}