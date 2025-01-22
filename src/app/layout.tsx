import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: 'Emergency Preparedness Guide',
  description: 'Your comprehensive resource for disaster preparedness and emergency planning.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Navigation Header */}
        <header className="bg-white border-b">
    <nav className="container mx-auto px-4 py-4">
      <div className="flex items-center justify-between">
        {/* Left Section with Home and Resources */}
        <div className="flex items-center space-x-6">
          <Link href="/" className="text-xl font-bold text-[#004D40]">
            DisasterPrep
          </Link>
          <Link href="/resources" className="text-gray-60 hover:text-[#004D40]">
            Resources
          </Link>
        </div>

        {/* Right Section with Analyze Button */}
        <div>
          <Link 
            href="/analyze"
            className="bg-[#004D40] text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-opacity-90 transition-all"
          >
            Start Prep Plan
          </Link>
        </div>
      </div>
    </nav>
  </header>
        {children}

        {/* Footer */}
      
      </body>
    </html>
  );
}
