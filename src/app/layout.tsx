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
              <Link href="/" className="text-xl font-bold text-[#004D40]">
                DisasterPrep
              </Link>
              <div className="hidden md:flex space-x-6">
                <Link href="/natural-disasters" className="text-gray-600 hover:text-[#004D40]">
                  Natural Disasters
                </Link>
                <Link href="/resources" className="text-gray-600 hover:text-[#004D40]">
                  Resources
                </Link>
              </div>
              <Link 
                href="/analyze"
                className="bg-[#004D40] text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-opacity-90 transition-all"
              >
                Start Prep Plan
              </Link>
            </div>
          </nav>
        </header>

        {children}

        {/* Footer */}
        <footer className="bg-gray-50 border-t">
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">DisasterPrep</h3>
                <p className="text-gray-600">Your comprehensive resource for emergency preparedness and disaster planning.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2">
                  <li><Link href="/about" className="text-gray-600 hover:text-[#004D40]">About Us</Link></li>
                  <li><Link href="/contact" className="text-gray-600 hover:text-[#004D40]">Contact</Link></li>
                  <li><Link href="/blog" className="text-gray-600 hover:text-[#004D40]">Blog</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Resources</h4>
                <ul className="space-y-2">
                  <li><Link href="/guides" className="text-gray-600 hover:text-[#004D40]">Guides</Link></li>
                  <li><Link href="/checklists" className="text-gray-600 hover:text-[#004D40]">Checklists</Link></li>
                  <li><Link href="/faq" className="text-gray-600 hover:text-[#004D40]">FAQ</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Connect</h4>
                <ul className="space-y-2">
                  <li><Link href="/newsletter" className="text-gray-600 hover:text-[#004D40]">Newsletter</Link></li>
                  <li><Link href="https://twitter.com" className="text-gray-600 hover:text-[#004D40]">Twitter</Link></li>
                  <li><Link href="https://facebook.com" className="text-gray-600 hover:text-[#004D40]">Facebook</Link></li>
                </ul>
              </div>
            </div>
            <div className="border-t mt-12 pt-8 text-center text-gray-600">
              <p>&copy; {new Date().getFullYear()} DisasterPrep. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
