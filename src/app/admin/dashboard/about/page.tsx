'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { getAboutContent, updateAboutContent } from '@/lib/firebase-service';
import { Skeleton } from '@/components/ui/skeleton';
import AboutSectionManager, { AboutSection } from '@/components/ui/about-section-manager';

// Form data can differ slightly from database model if we have fields for UI purposes only
type AboutFormData = {
    mainHeading: string;
    mainDescription: string;
    locationLink: string;
    sections: AboutSection[];
};

export default function AboutAdminPage() {
    const { register, handleSubmit, reset, formState: { isSubmitting }, setValue, watch } = useForm<AboutFormData>();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [sections, setSections] = useState<AboutSection[]>([]);

    const watchedSections = watch('sections') || [];

    useEffect(() => {
        async function loadContent() {
            setIsLoading(true);
            try {
                const content = await getAboutContent();
                
                // Convert the simple content to the new sections format if needed
                const initialSections: AboutSection[] = content.sections || [
                    {
                        id: 'main-section',
                        heading: content.heading || 'About Us',
                        content: content.text || '',
                        order: 0,
                    }
                ];

                reset({
                    mainHeading: content.mainHeading || 'Welcome to DharmaChain',
                    mainDescription: content.mainDescription || 'Learn more about our mission and impact.',
                    locationLink: content.locationLink || '',
                    sections: initialSections,
                });
                setSections(initialSections);
            } catch (error) {
                console.error(error);
                toast({
                    variant: 'destructive',
                    title: 'Failed to load content',
                    description: 'Could not fetch the current about page content.',
                });
            } finally {
                setIsLoading(false);
            }
        }
        loadContent();
    }, [reset, toast]);

    const onSubmit = async (data: AboutFormData) => {
        try {
            // Prepare data for Firebase
            const contentToSave = {
                mainHeading: data.mainHeading,
                mainDescription: data.mainDescription,
                locationLink: data.locationLink,
                sections: sections, // Use the state sections which are more up-to-date
            };
            
            await updateAboutContent(contentToSave);
            toast({
                title: 'Success!',
                description: 'About section has been updated.',
            });
        } catch (error) {
            console.error(error);
            toast({
                variant: 'destructive',
                title: 'Update Failed',
                description: 'Could not save the changes to the database.',
            });
        }
    };

    const handleSectionsChange = (updatedSections: AboutSection[]) => {
        setSections(updatedSections);
        setValue('sections', updatedSections);
    };

    const handleImageUpload = async (sectionId: string, file: File): Promise<string> => {
        // TODO: Implement actual Firebase Storage upload
        // For now, return a blob URL
        return new Promise((resolve, reject) => {
            try {
                const url = URL.createObjectURL(file);
                setTimeout(() => resolve(url), 1000); // Simulate upload delay
            } catch (error) {
                reject(error);
            }
        });
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-10 w-64" />
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-64" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-32 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Manage About Section</h1>
            
            {/* Main About Info */}
            <Card>
                <CardHeader>
                    <CardTitle>Main About Information</CardTitle>
                    <CardDescription>
                        Update the main heading, description, and location link for your about page.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div>
                            <Label htmlFor="mainHeading">Main Heading</Label>
                            <Input
                                id="mainHeading"
                                {...register('mainHeading', { required: 'Main heading is required' })}
                                placeholder="e.g., Welcome to DharmaChain"
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <Label htmlFor="mainDescription">Main Description</Label>
                            <Input
                                id="mainDescription"
                                {...register('mainDescription')}
                                placeholder="Brief description that appears at the top"
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <Label htmlFor="locationLink">Location/Google Maps Link</Label>
                            <Input
                                id="locationLink"
                                {...register('locationLink')}
                                placeholder="https://maps.google.com/..."
                                className="mt-1"
                            />
                        </div>

                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Save Main Information'}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* About Sections Manager */}
            <Card>
                <CardHeader>
                    <CardTitle>Content Sections</CardTitle>
                    <CardDescription>
                        Manage individual sections of your about page. Each section can have its own heading, 
                        rich text content, and optional image. Visitors can click "Read More" to expand sections.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <AboutSectionManager
                        sections={sections}
                        onSectionsChange={handleSectionsChange}
                        onImageUpload={handleImageUpload}
                    />
                </CardContent>
            </Card>

            {/* Save All Changes */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="font-semibold">Save All Changes</h3>
                            <p className="text-sm text-muted-foreground">
                                Save all your changes to the about page content.
                            </p>
                        </div>
                        <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Save All Changes'}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Preview Note */}
            <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Preview Your Changes</AlertTitle>
                <AlertDescription>
                    To see how your changes look, visit the main website and navigate to the About section. 
                    Users will be able to click "Read More" buttons to expand individual sections.
                </AlertDescription>
            </Alert>
        </div>
    );
}
