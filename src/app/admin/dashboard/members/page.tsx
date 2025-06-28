import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function MembersAdminPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Manage Members</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Member List</CardTitle>
                    <CardDescription>
                        This list will populate with users who become members.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center text-muted-foreground py-12">
                         <p>No members yet.</p>
                         <p className="text-sm">As users sign up and become members, they will appear here.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
