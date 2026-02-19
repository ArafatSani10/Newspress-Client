"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown, Search, Menu, Clock, LogOut, User, Settings, Loader2 } from "lucide-react";
import { userService } from "@/services/user.service";
import { categoryService, Category } from "@/services/category.service";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function Navbar() {
    const [mounted, setMounted] = useState(false);
    const [currentTime, setCurrentTime] = useState("");
    const [session, setSession] = useState<any>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    const mainCategories = categories.slice(0, 5);
    const extraCategories = categories.slice(5);

    useEffect(() => {
        setMounted(true);
        const updateTime = () => {
            const now = new Date();
            setCurrentTime(
                now.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true,
                })
            );
        };

        const initNavbar = async () => {
            try {
                const [sessionRes, categoryRes] = await Promise.all([
                    userService.getSession(),
                    categoryService.getAll()
                ]);
                setSession(sessionRes.data);
                setCategories(categoryRes.data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        updateTime();
        initNavbar();
        const timer = setInterval(updateTime, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleLogout = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    toast.success("Logged out successfully");
                    setSession(null);
                    router.push("/login");
                    router.refresh();
                },
            },
        });
    };

    const isActive = (path: string) => pathname === path;

    const NavSkeleton = () => (
        <div className="flex items-center gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-4 w-16 animate-pulse rounded bg-gray-200"></div>
            ))}
        </div>
    );

    if (!mounted) {
        return <header className="sticky top-0 z-50 h-20 w-full bg-white border-b" />;
    }

    return (
        <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-md">
            <div className="hidden border-b border-gray-100 bg-gray-50/80 py-2 sm:hidden">
                <div className="container mx-auto flex items-center justify-between px-4 text-xs font-medium text-gray-500">
                    <div className="flex items-center gap-1.5">
                        <Clock size={14} className="text-gray-400" />
                        <span>{currentTime}</span>
                    </div>
                    <div className=" text-red-600 font-bold tracking-wide">📰 TODAY&apos;S HEADLINES</div>
                </div>
            </div>

            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between md:h-20">
                    <Link
                        href="/"
                        className="text-xl font-black text-red-600 md:text-2xl tracking-tighter"
                    >
                        NEWS<span className="text-gray-900">PRESS</span>
                    </Link>

                    <nav className="hidden lg:flex lg:items-center lg:gap-1">
                        <Link
                            href="/"
                            className={`relative rounded-md px-4 py-2 text-sm font-semibold transition-colors hover:text-red-600 ${
                                isActive("/") ? "text-red-600" : "text-gray-700"
                            }`}
                        >
                            Home
                            {isActive("/") && (
                                <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-red-600" />
                            )}
                        </Link>

                        {loading ? (
                            <NavSkeleton />
                        ) : (
                            <>
                                {mainCategories.map((cat) => {
                                    const catPath = `/category/${cat.slug}`;
                                    return (
                                        <Link
                                            key={cat.id}
                                            href={catPath}
                                            className={`relative rounded-md px-4 py-2 text-sm font-medium transition-colors hover:text-red-600 ${
                                                isActive(catPath) ? "text-red-600" : "text-gray-700"
                                            }`}
                                        >
                                            {cat.name}
                                            {isActive(catPath) && (
                                                <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-red-600" />
                                            )}
                                        </Link>
                                    );
                                })}

                                {extraCategories.length > 0 && (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger className="flex items-center gap-1 rounded-md px-4 py-2 text-sm font-medium text-gray-700 outline-none transition-colors hover:bg-gray-100 hover:text-red-600">
                                            More <ChevronDown size={16} />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                            align="start"
                                            className="w-48 rounded-xl border border-gray-200 bg-white p-1 shadow-xl"
                                        >
                                            {extraCategories.map((cat) => (
                                                <DropdownMenuItem key={cat.id} asChild>
                                                    <Link
                                                        href={`/category/${cat.slug}`}
                                                        className={`w-full cursor-pointer rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-red-600 ${
                                                            isActive(`/category/${cat.slug}`) ? "text-red-600 bg-red-50" : "text-gray-700"
                                                        }`}
                                                    >
                                                        {cat.name}
                                                    </Link>
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )}
                            </>
                        )}
                    </nav>

                    <div className="flex items-center gap-2">
                        <button
                            className="rounded-full p-2.5 text-gray-600 transition-colors hover:bg-gray-100 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20"
                            aria-label="Search"
                        >
                            <Search size={22} />
                        </button>

                        {loading ? (
                            <div className="h-10 w-10 flex items-center justify-center">
                                <Loader2 size={20} className="animate-spin text-gray-400" />
                            </div>
                        ) : session ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger className="outline-none">
                                    <Avatar className="h-10 w-10 border border-gray-200 transition-transform ">
                                        <AvatarImage src={session.user.image || ""} />
                                        <AvatarFallback className="bg-red-600 text-white font-bold">
                                            {session.user.name.substring(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-64 rounded-xl p-2 shadow-2xl">
                                    <DropdownMenuLabel className="p-3">
                                        <div className="flex flex-col gap-1">
                                            <p className="text-sm font-bold text-gray-900">{session.user.name}</p>
                                            <p className="text-xs text-gray-500 font-medium truncate">{session.user.email}</p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild className="rounded-lg cursor-pointer py-2.5">
                                        <Link href="/dashboard" className="flex items-center gap-2">
                                            <User size={16} /> Dashboard
                                        </Link>
                                    </DropdownMenuItem>
                                    
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={handleLogout}
                                        className="rounded-lg cursor-pointer py-2.5 text-red-600 focus:bg-red-50 focus:text-red-700"
                                    >
                                        <div className="flex items-center gap-2 font-semibold">
                                            <LogOut size={16} /> Logout
                                        </div>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Link href="/login" className="hidden md:block">
                                <button className="rounded-md bg-gray-900 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-red-600">
                                    Sign In
                                </button>
                            </Link>
                        )}

                        <Sheet>
                            <SheetTrigger asChild>
                                <button className="rounded-md p-2 text-gray-600 transition-colors hover:bg-gray-100 lg:hidden">
                                    <Menu size={26} />
                                </button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[300px] p-0 shadow-2xl">
                                <SheetHeader className="border-b p-6 text-left">
                                    <SheetTitle className="text-xl font-black text-red-600">
                                        NEWS<span className="text-gray-900">PRESS</span>
                                    </SheetTitle>
                                </SheetHeader>
                                <div className="flex flex-col py-2 overflow-y-auto max-h-[calc(100vh-100px)]">
                                    <Link 
                                        href="/" 
                                        className={`border-b px-6 py-4 text-sm font-semibold hover:bg-gray-50 ${isActive("/") ? "text-red-600 bg-red-50" : "text-gray-700"}`}
                                    >
                                        Home
                                    </Link>
                                    
                                    {loading ? (
                                        <div className="space-y-4 p-6">
                                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                                <div key={i} className="h-4 w-full animate-pulse rounded bg-gray-100"></div>
                                            ))}
                                        </div>
                                    ) : (
                                        categories.map((cat) => {
                                            const mobilePath = `/category/${cat.slug}`;
                                            return (
                                                <Link 
                                                    key={cat.id} 
                                                    href={mobilePath} 
                                                    className={`border-b px-6 py-4 text-sm font-medium hover:bg-gray-50 ${isActive(mobilePath) ? "text-red-600 bg-red-50" : "text-gray-700"}`}
                                                >
                                                    {cat.name}
                                                </Link>
                                            );
                                        })
                                    )}

                                    {!session && !loading && (
                                        <div className="p-6">
                                            <Link href="/login">
                                                <button className="w-full rounded-md bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-red-600">
                                                    Sign In
                                                </button>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>
    );
}