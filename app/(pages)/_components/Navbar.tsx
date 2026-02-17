"use client"

import { Button } from '@/components/ui/button'
import { GalleryVerticalEnd, User, Settings, LogOut, UserCircle, ShoppingBag, Menu, PackageSearch } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged, User as FirebaseUser, signOut } from 'firebase/auth'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useCartStore } from '@/app/store/useCartStore'

const Navbar = () => {
    const [user, setUser] = useState<FirebaseUser | null>(null)
    const [loading, setLoading] = useState(true)
    const [mounted, setMounted] = useState(false)
    const pathname = usePathname()
    
    const cart = useCartStore((state) => state.cart)
    const [cartCount, setCartCount] = useState(0)

    useEffect(() => {
        setMounted(true)
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser)
            setLoading(false)
        })
        return () => unsubscribe()
    }, [])

    useEffect(() => {
        if (mounted) {
            setCartCount(cart.length)
        }
    }, [cart, mounted])

    const handleLogout = async () => {
        try {
            await signOut(auth)
            toast.success("Si guul leh ayaad uga baxday")
        } catch (error) {
            toast.error("Wuu fashilmay logout-ku")
        }
    }

    const items = [
        { title: "Home", url: "/" },
        { title: "Products", url: "/products" },
        { title: "About", url: "/about" },
        { title: "Contact", url: "/contact" }
    ]

    return (
        <nav className="fixed top-0 z-50 w-full px-4 pt-4">
            <div className="flex items-center justify-between w-full max-w-6xl h-16 px-6 mx-auto rounded-md border border-foreground/10 shadow-sm bg-background/60 backdrop-blur-md transition-all duration-300 relative z-[60]">
                
                {/* Mobile Hamburger - Only visible on small screens */}
                <div className="flex md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <button className="p-2 outline-none">
                                <Menu className="size-6 text-foreground" />
                            </button>
                        </SheetTrigger>
                        <SheetContent side="left" className="bg-background/95 backdrop-blur-md border-r border-foreground/10">
                            <div className="flex flex-col gap-8 mt-12">
                                {items.map((item, index) => (
                                    <Link 
                                        key={index} 
                                        href={item.url} 
                                        className={cn(
                                            "text-lg font-medium",
                                            pathname === item.url ? "text-primary" : "text-foreground/60"
                                        )}
                                    >
                                        {item.title}
                                    </Link>
                                ))}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="flex size-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
                        <GalleryVerticalEnd className="size-6" />
                    </div>
                </Link>

                {/* Nav Items - Desktop */}
                <div className="hidden md:flex items-center gap-10">
                    {items.map((item, index) => {
                        const isActive = pathname === item.url
                        return (
                            <Link 
                                key={index} 
                                href={item.url} 
                                className={cn(
                                    "text-sm font-medium transition-all duration-200 relative py-1",
                                    isActive 
                                        ? "text-foreground font-bold" 
                                        : "text-foreground/60 hover:text-foreground"
                                )}
                            >
                                {item.title}
                                {isActive && (
                                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full" />
                                )}
                            </Link>
                        )
                    })}
                </div>

                {/* Right Side: Cart + Auth */}
                <div className="flex items-center gap-4">
                    
                    {/* CART BUTTON */}
                    <Link href="/cart" className="relative p-2 hover:bg-muted rounded-full transition-colors group">
                        <ShoppingBag className="size-5 text-foreground/70 group-hover:text-foreground transition-colors" />
                        {mounted && cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 size-5 bg-primary text-[10px] font-bold text-primary-foreground rounded-full flex items-center justify-center border-2 border-background animate-in zoom-in duration-300">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {/* Auth Section */}
                    <div className="flex items-center gap-3 border-l pl-4 border-foreground/10">
                        {loading ? (
                            <div className="size-9 rounded-full bg-muted animate-pulse" />
                        ) : user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="outline-none">
                                        <div className="size-9 rounded-full border-2 border-primary/20 hover:border-primary/50 transition-all overflow-hidden bg-muted flex items-center justify-center cursor-pointer">
                                            {user.photoURL ? (
                                                <img src={user.photoURL} alt="User" className="size-full object-cover" />
                                            ) : (
                                                <User className="size-5 text-muted-foreground" />
                                            )}
                                        </div>
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56 mt-2 shadow-xl" align="end">
                                    <DropdownMenuLabel className="flex flex-col">
                                        <span className="font-bold text-sm truncate">{user.displayName || 'User'}</span>
                                        <span className="text-xs text-muted-foreground font-normal truncate">{user.email}</span>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    
                                    {/* TRACK ORDER ITEM - CUSUB */}
                                    <DropdownMenuItem asChild>
                                        <Link href="/orders" className="cursor-pointer flex items-center gap-2 text-sm font-medium">
                                            <PackageSearch size={16} /> Track My Order
                                        </Link>
                                    </DropdownMenuItem>

                                    <DropdownMenuItem asChild>
                                        <Link href="/profile" className="cursor-pointer flex items-center gap-2 text-sm font-medium">
                                            <UserCircle size={16} /> Profile
                                        </Link>
                                    </DropdownMenuItem>
                                    
                                    <DropdownMenuItem asChild>
                                        <Link href="/admin/settings" className="cursor-pointer flex items-center gap-2 text-sm font-medium">
                                            <Settings size={16} /> Settings
                                        </Link>
                                    </DropdownMenuItem>
                                    
                                    <DropdownMenuSeparator />
                                    
                                    <DropdownMenuItem 
                                        className="text-red-600 focus:text-red-700 cursor-pointer flex items-center gap-2 font-bold text-sm"
                                        onClick={handleLogout}
                                    >
                                        <LogOut size={16} /> Logout
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link href="/login">
                                    <Button variant={'ghost'} className='text-xs h-8 px-3'>Login</Button>
                                </Link>
                                <Link href="/signup">
                                    <Button variant="default" className="text-xs h-8 px-3 shadow-sm">Sign Up</Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar