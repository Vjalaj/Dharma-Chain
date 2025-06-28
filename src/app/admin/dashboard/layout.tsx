'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { BookText, Cog, Handshake, HeartHandshake, LayoutDashboard, LogOut, Users } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { Skeleton } from '@/components/ui/skeleton';

const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/dashboard/donations', label: 'Donations', icon: HeartHandshake },
    { href: '/admin/dashboard/about', label: 'About Section', icon: Cog },
    { href: '/admin/dashboard/members', label: 'Members', icon: Users },
    { href: '/admin/dashboard/documentation', label: 'Documentation', icon: BookText },
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const { status } = useSession({
        required: true,
        onUnauthenticated() {
            router.push('/admin');
        },
    });

    if (status === 'loading') {
        return (
            <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
                <div className="hidden border-r bg-muted/40 md:block">
                    <div className="flex h-full max-h-screen flex-col gap-2">
                        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                            <Skeleton className="h-6 w-32" />
                        </div>
                        <div className="flex-1 p-2 lg:p-4 space-y-2">
                            <Skeleton className="h-8" />
                            <Skeleton className="h-8" />
                            <Skeleton className="h-8" />
                            <Skeleton className="h-8" />
                            <Skeleton className="h-8" />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col">
                    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
                         <Skeleton className="h-8 w-1/4 mb-6" />
                         <Skeleton className="h-96 w-full" />
                    </main>
                </div>
            </div>
        );
    }


    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <div className="hidden border-r bg-muted/40 md:block">
                <div className="flex h-full max-h-screen flex-col gap-2">
                    <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                        <Link href="/admin/dashboard" className="flex items-center gap-2 font-semibold font-headline">
                            <Handshake className="h-6 w-6 text-primary" />
                            <span>DharmaChain</span>
                        </Link>
                    </div>
                    <div className="flex-1">
                        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                                        pathname === item.href && 'bg-muted text-primary'
                                    )}
                                >
                                    <item.icon className="h-4 w-4" />
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                     <div className="mt-auto p-4">
                        <Button variant="ghost" className="w-full justify-start gap-3" onClick={() => signOut({ callbackUrl: '/' })}>
                           <LogOut className="h-4 w-4" />
                           Sign Out
                        </Button>
                    </div>
                </div>
            </div>
            <div className="flex flex-col">
                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
                    {children}
                </main>
            </div>
        </div>
    );
}
