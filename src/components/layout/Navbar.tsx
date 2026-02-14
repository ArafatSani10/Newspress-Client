"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet";
import { ChevronDown, Languages, Search, Menu } from "lucide-react";

const translations = {
    BN: {
        home: "প্রচ্ছদ",
        more: "আরও",
        today: "আজকের খবর",
        login: "লগইন",
        menu: "মেনু",
        categories: [
            { id: "1", name: "জাতীয়", slug: "national" },
            { id: "2", name: "রাজনীতি", slug: "politics" },
            { id: "3", name: "অর্থনীতি", slug: "economy" },
            { id: "4", name: "খেলাধুলা", slug: "sports" },
            { id: "5", name: "বিনোদন", slug: "entertainment" },
            { id: "6", name: "আন্তর্জাতিক", slug: "international" },
            { id: "7", name: "প্রযুক্তি", slug: "technology" },
        ]
    },
    EN: {
        home: "Home",
        more: "More",
        today: "Today's News",
        login: "Login",
        menu: "Menu",
        categories: [
            { id: "1", name: "National", slug: "national" },
            { id: "2", name: "Politics", slug: "politics" },
            { id: "3", name: "Economy", slug: "economy" },
            { id: "4", name: "Sports", slug: "sports" },
            { id: "5", name: "Entertainment", slug: "entertainment" },
            { id: "6", name: "International", slug: "international" },
            { id: "7", name: "Technology", slug: "technology" },
        ]
    }
};

export default function Navbar() {
    const [lang, setLang] = useState<"BN" | "EN">("BN");
    const [currentTime, setCurrentTime] = useState("");

    const content = translations[lang];
    const mainCategories = content.categories.slice(0, 5);
    const extraCategories = content.categories.slice(5);

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setCurrentTime(now.toLocaleDateString(lang === "BN" ? 'bn-BD' : 'en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            }));
        };

        updateTime();
        const timer = setInterval(updateTime, 1000);
        return () => clearInterval(timer);
    }, [lang]);

    return (
        <header className="border-b sticky top-0 bg-white/95 backdrop-blur-md z-50">
            <div className="bg-gray-50 py-1.5 border-b hidden sm:block">
                <div className="container mx-auto px-4 flex justify-between items-center text-[12px] text-gray-600 font-medium">
                    <div className="min-w-[200px]">{currentTime}</div>
                    <div>{content.today}</div>
                </div>
            </div>

            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">

                    <Link href="/" className="text-2xl font-black text-red-600 tracking-tighter shrink-0">
                        NEWS<span className="text-black">PRESS</span>
                    </Link>

                    <nav className="hidden lg:flex items-center gap-6">
                        <Link href="/" className="font-bold hover:text-red-600 transition-colors">
                            {content.home}
                        </Link>

                        {mainCategories.map((cat) => (
                            <Link
                                key={cat.id}
                                href={`/category/${cat.slug}`}
                                className="font-medium hover:text-red-600 transition-colors whitespace-nowrap"
                            >
                                {cat.name}
                            </Link>
                        ))}

                        {extraCategories.length > 0 && (
                            <DropdownMenu>
                                <DropdownMenuTrigger className="flex items-center gap-1 font-medium hover:text-red-600 outline-none">
                                    {content.more} <ChevronDown size={16} />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" className="w-48">
                                    {extraCategories.map((cat) => (
                                        <DropdownMenuItem key={cat.id} asChild>
                                            <Link href={`/category/${cat.slug}`} className="w-full cursor-pointer">
                                                {cat.name}
                                            </Link>
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </nav>

                    <div className="flex items-center gap-2 sm:gap-3">
                        <DropdownMenu>
                            <DropdownMenuTrigger className="flex items-center gap-2 px-2 sm:px-3 py-1.5 border rounded-md hover:bg-gray-50 transition-all outline-none">
                                <Languages size={16} className="text-gray-600" />
                                <span className="text-xs font-bold">{lang}</span>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setLang("BN")} className="cursor-pointer font-medium">বাংলা</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setLang("EN")} className="cursor-pointer font-medium">English</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <Search size={20} />
                        </button>

                        <Sheet>
                            <SheetTrigger asChild>
                                <button className="lg:hidden p-2 hover:bg-gray-100 rounded-md">
                                    <Menu size={24} />
                                </button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-[350px]">
                                <SheetHeader className="text-left border-b pb-4">
                                    <SheetTitle className="text-red-600 font-black">NEWSPRESS</SheetTitle>
                                </SheetHeader>
                                <div className="flex flex-col gap-4 p-5 mt-6">
                                    <Link href="/" className="text-lg font-bold border-b pb-2">{content.home}</Link>
                                    {content.categories.map((cat) => (
                                        <Link key={cat.id} href={`/category/${cat.slug}`} className="text-lg font-medium border-b pb-2 hover:text-red-600">
                                            {cat.name}
                                        </Link>
                                    ))}
                                    <button className="mt-4 bg-black text-white px-5 py-3 rounded-lg font-bold">
                                        {content.login}
                                    </button>
                                </div>
                            </SheetContent>
                        </Sheet>

                        <button className="hidden md:block bg-black text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-gray-800 transition-all">
                            {content.login}
                        </button>
                    </div>

                </div>
            </div>
        </header>
    );
}