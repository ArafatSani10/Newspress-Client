import Link from "next/link";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";

const categories = [
  { name: "জাতীয়", slug: "national" },
  { name: "রাজনীতি", slug: "politics" },
  { name: "অর্থনীতি", slug: "economy" },
  { name: "খেলাধুলা", slug: "sports" },
  { name: "বিনোদন", slug: "entertainment" },
  { name: "আন্তর্জাতিক", slug: "international" },
  { name: "প্রযুক্তি", slug: "technology" },
];

export default function Footer() {
  return (
    <footer className="bg-[#0f172a] text-gray-300 mt-12 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          <div className="space-y-6">
            <Link href="/" className="text-3xl font-black tracking-tighter text-white">
              NEWS<span className="text-red-500">PRESS</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              একটি নিরপেক্ষ অনলাইন নিউজ পোর্টাল। আমরা সব সময় সত্য ও বস্তুনিষ্ঠ সংবাদ প্রকাশে অঙ্গীকারবদ্ধ। আধুনিক সাংবাদিকতায় আমরাই সবার আগে।
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
            <h4 className="text-white font-bold text-lg mb-6 relative inline-block">
              বিভাগসমূহ
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
            <h4 className="text-white font-bold text-lg mb-6 relative inline-block">
              প্রয়োজনীয় লিংক
              <span className="absolute -bottom-2 left-0 w-10 h-1 bg-red-500"></span>
            </h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/about" className="hover:text-red-500 transition-colors">আমাদের সম্পর্কে</Link></li>
              <li><Link href="/contact" className="hover:text-red-500 transition-colors">যোগাযোগ</Link></li>
              <li><Link href="/privacy" className="hover:text-red-500 transition-colors">গোপনীয়তা নীতি</Link></li>
              <li><Link href="/terms" className="hover:text-red-500 transition-colors">শর্তাবলী</Link></li>
              <li><Link href="/archive" className="hover:text-red-500 transition-colors">আর্কাইভ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-lg mb-6 relative inline-block">
              অফিস ঠিকানা
              <span className="absolute -bottom-2 left-0 w-10 h-1 bg-red-500"></span>
            </h4>
            <div className="space-y-4 text-sm text-gray-400">
              <div className="flex items-start gap-3">
                <MapPin size={20} className="text-red-500 shrink-0" />
                <p>লেভেল-৫, হাউজ-১০, রোড-০২, বনানী, ঢাকা-১২১৩</p>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-red-500 shrink-0" />
                <p>+৮৮০ ১২৩৪ ৫৬৭৮৯০</p>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-red-500 shrink-0" />
                <p>info@newspress.com</p>
              </div>
            </div>
          </div>

        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} নিউজপ্রেস - সর্বস্বত্ব সংরক্ষিত।</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-white transition-colors">সাপোর্ট</Link>
            <Link href="#" className="hover:text-white transition-colors">বিজ্ঞাপন</Link>
            <Link href="#" className="hover:text-white transition-colors">ডেভেলপার</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}