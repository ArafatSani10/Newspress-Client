import Link from "next/link";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";

const categories = [
  { name: "National", slug: "national" },
  { name: "Politics", slug: "politics" },
  { name: "Economy", slug: "economy" },
  { name: "Sports", slug: "sports" },
  { name: "Entertainment", slug: "entertainment" },
  { name: "International", slug: "international" },
  { name: "Technology", slug: "technology" },
];

export default function Footer() {
  return (
    <footer className="bg-[#0f172a] text-gray-300 mt-12 pt-16 pb-8 font-sans">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          <div className="space-y-6">
            <Link href="/" className="text-2xl max-sm:text-xl font-black  text-white">
              NEWS<span className="text-red-500">PRESS</span>
            </Link>
            <p className="text-gray-400 text-sm  max-w-xs">
              An independent online news portal. We are committed to publishing objective and authentic news at all times. Leading the way in modern journalism.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all">
                <Youtube size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold text-lg mb-6 relative inline-block r">
              Categories
              <span className="absolute -bottom-2 left-0 w-10 h-1 bg-red-500"></span>
            </h4>
            <ul className="grid grid-cols-1 gap-3">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/category/${cat.slug}`} className="hover:text-red-500 transition-colors text-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-600"></span>
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-lg mb-6 relative inline-block ">
              Quick Links
              <span className="absolute -bottom-2 left-0 w-10 h-1 bg-red-500"></span>
            </h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/about" className="hover:text-red-500 transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-red-500 transition-colors">Contact Us</Link></li>
              <li><Link href="/privacy" className="hover:text-red-500 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-red-500 transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/archive" className="hover:text-red-500 transition-colors">News Archive</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-lg mb-6 relative inline-block ">
              Office Address
              <span className="absolute -bottom-2 left-0 w-10 h-1 bg-red-500"></span>
            </h4>
            <div className="space-y-4 text-sm text-gray-400">
              <div className="flex items-start gap-3">
                <MapPin size={20} className="text-red-500 shrink-0" />
                <p>Level-5, House-10, Road-02, Banani, Dhaka-1213, Bangladesh</p>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-red-500 shrink-0" />
                <p>+880 1234 567890</p>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-red-500 shrink-0" />
                <p>info@newspress.com</p>
              </div>
            </div>
          </div>

        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} NewsPress - All Rights Reserved.</p>
          <div className="flex gap-6 uppercase text-[11px] font-bold tracking-widest">
            <Link href="#" className="hover:text-white transition-colors">Support</Link>
            <Link href="#" className="hover:text-white transition-colors">Advertise</Link>
            <Link href="#" className="hover:text-white transition-colors">Developer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}