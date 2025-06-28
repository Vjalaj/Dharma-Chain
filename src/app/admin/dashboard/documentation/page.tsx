import { promises as fs } from 'fs';
import path from 'path';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

async function getReadmeContent() {
    const readmePath = path.join(process.cwd(), 'README.md');
    try {
        const content = await fs.readFile(readmePath, 'utf-8');
        return content;
    } catch (error) {
        console.error('Failed to read README.md:', error);
        return 'Could not load README.md content.';
    }
}

export default async function DocumentationPage() {
    const readmeContent = await getReadmeContent();

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Project Documentation</h1>
            <Card>
                <CardHeader>
                    <CardTitle>README.md</CardTitle>
                    <CardDescription>
                        This is the setup and integration guide for the project.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <pre className="whitespace-pre-wrap font-code text-sm bg-muted p-4 rounded-md overflow-x-auto">
                        {readmeContent}
                    </pre>
                </CardContent>
            </Card>
        </div>
    );
}
