'use client';

import { signIn, useSession } from 'next-auth/react';
import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

function AdminLoginContent() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const error = searchParams.get('error');

    useEffect(() => {
        if (session?.user && (session.user as any).isAdmin) {
            router.push('/admin/dashboard');
        }
    }, [session, router]);

    const handleLogin = () => {
        signIn('google', { callbackUrl: '/admin/dashboard' });
    };

    if (status === 'loading') {
        return (
            <div className="flex items-center justify-center min-h-screen bg-muted/40">
                <div>Loading...</div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-muted/40">
            <Card className="w-full max-w-sm">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">DharmaChain Admin</CardTitle>
                    <CardDescription>
                        Please sign in to manage the website.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {error === 'access_denied' && (
                        <Alert variant="destructive">
                            <AlertDescription>
                                Access denied. You are not authorized to access the admin panel.
                            </AlertDescription>
                        </Alert>
                    )}
                    {error === 'Callback' && (
                        <Alert variant="destructive">
                            <AlertDescription>
                                Authentication failed. Please try again.
                            </AlertDescription>
                        </Alert>
                    )}
                    <Button className="w-full" onClick={handleLogin}>
                        <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 61.9l-72.2 68.7C297.6 114.5 274.3 104 248 104c-70.7 0-128.3 57.5-128.3 128s57.6 128 128.3 128c80.5 0 115.3-59.3 119.8-89.9h-120v-93.9h215.8c4.4 23.6 6.8 48.1 6.8 74.9z"></path></svg>
                        Sign in with Google
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

export default function AdminLoginPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen bg-muted/40">
                <div>Loading...</div>
            </div>
        }>
            <AdminLoginContent />
        </Suspense>
    );
}
