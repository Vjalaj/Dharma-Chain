'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import RichTextEditor from '@/components/ui/rich-text-editor';
import { Upload, Image as ImageIcon, Trash2 } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const donationCategorySchema = z.object({
    title: z.string().min(1, 'Title is required.'),
    description: z.string().min(10, 'Description must be at least 10 characters.'),
    targetAmount: z.number().min(1, 'Target amount must be greater than 0.'),
    currentAmount: z.number().min(0, 'Current amount must be 0 or greater.').default(0),
});

type DonationCategoryFormValues = z.infer<typeof donationCategorySchema>;

interface DonationCategory {
    id: string;
    title: string;
    description: string;
    image?: string;
    targetAmount: number;
    currentAmount: number;
}

export default function DonationsAdminPage() {
    const [categories, setCategories] = useState<DonationCategory[]>([]);
    const [editingCategory, setEditingCategory] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [uploadingImages, setUploadingImages] = useState<Set<string>>(new Set());
    const { toast } = useToast();

    const form = useForm<DonationCategoryFormValues>({
        resolver: zodResolver(donationCategorySchema),
        defaultValues: {
            title: '',
            description: '',
            targetAmount: 0,
            currentAmount: 0,
        },
    });

    // Load existing categories (placeholder - replace with actual Firebase call)
    useEffect(() => {
        // TODO: Load categories from Firebase
        setCategories([
            {
                id: '1',
                title: 'Medical Care',
                description: 'Providing essential medical care and treatment for those in need.',
                targetAmount: 100000,
                currentAmount: 25000,
            },
            {
                id: '2', 
                title: 'Education Support',
                description: 'Supporting education and learning opportunities for underprivileged children.',
                targetAmount: 50000,
                currentAmount: 12000,
            }
        ]);
    }, []);

    const onSubmit = async (data: DonationCategoryFormValues) => {
        setIsLoading(true);
        try {
            if (editingCategory) {
                // Update existing category
                setCategories(prev => prev.map(cat => 
                    cat.id === editingCategory ? { ...cat, ...data } : cat
                ));
                setEditingCategory(null);
                toast({
                    title: 'Success!',
                    description: 'Donation category updated successfully.',
                });
            } else {
                // Add new category
                const newCategory: DonationCategory = {
                    id: Date.now().toString(),
                    ...data,
                };
                setCategories(prev => [...prev, newCategory]);
                toast({
                    title: 'Success!',
                    description: 'New donation category created successfully.',
                });
            }
            form.reset();
        } catch (error) {
            console.error('Error saving category:', error);
            toast({
                variant: 'destructive',
                title: 'Save Failed',
                description: 'Could not save the donation category. Please try again.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (category: DonationCategory) => {
        setEditingCategory(category.id);
        form.reset({
            title: category.title,
            description: category.description,
            targetAmount: category.targetAmount,
            currentAmount: category.currentAmount,
        });
    };

    const handleDelete = (categoryId: string) => {
        if (confirm('Are you sure you want to delete this donation category?')) {
            setCategories(prev => prev.filter(cat => cat.id !== categoryId));
            toast({
                title: 'Deleted',
                description: 'Donation category deleted successfully.',
            });
        }
    };

    const handleImageUpload = async (categoryId: string, event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast({
                variant: 'destructive',
                title: 'Invalid file type',
                description: 'Please select an image file.',
            });
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast({
                variant: 'destructive',
                title: 'File too large',
                description: 'Image size should be less than 5MB.',
            });
            return;
        }

        setUploadingImages(prev => new Set(prev).add(categoryId));

        try {
            // TODO: Implement actual image upload to Firebase Storage
            // For now, create a local object URL
            const imageUrl = URL.createObjectURL(file);
            
            setCategories(prev => prev.map(cat => 
                cat.id === categoryId ? { ...cat, image: imageUrl } : cat
            ));

            toast({
                title: 'Success!',
                description: 'Image uploaded successfully.',
            });
        } catch (error) {
            console.error('Failed to upload image:', error);
            toast({
                variant: 'destructive',
                title: 'Upload Failed',
                description: 'Failed to upload image. Please try again.',
            });
        } finally {
            setUploadingImages(prev => {
                const newSet = new Set(prev);
                newSet.delete(categoryId);
                return newSet;
            });
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Manage Donation Categories</h1>
            
            {/* Add/Edit Category Form */}
            <Card>
                <CardHeader>
                    <CardTitle>
                        {editingCategory ? 'Edit Donation Category' : 'Add New Donation Category'}
                    </CardTitle>
                    <CardDescription>
                        Create and manage donation categories for your website.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Category Title</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g., Medical Care" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="targetAmount"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Target Amount (₹)</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    type="number" 
                                                    placeholder="100000" 
                                                    {...field}
                                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="currentAmount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Current Amount Raised (₹)</FormLabel>
                                        <FormControl>
                                            <Input 
                                                type="number" 
                                                placeholder="25000" 
                                                {...field}
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <RichTextEditor
                                                content={field.value}
                                                onChange={field.onChange}
                                                placeholder="Enter a detailed description of this donation category..."
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex gap-2">
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? 'Saving...' : (editingCategory ? 'Update Category' : 'Create Category')}
                                </Button>
                                {editingCategory && (
                                    <Button 
                                        type="button" 
                                        variant="outline" 
                                        onClick={() => {
                                            setEditingCategory(null);
                                            form.reset();
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                )}
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            {/* Existing Categories */}
            <Card>
                <CardHeader>
                    <CardTitle>Existing Categories</CardTitle>
                    <CardDescription>
                        Manage your current donation categories.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {categories.length === 0 ? (
                        <p className="text-muted-foreground">No donation categories yet. Create one above to get started.</p>
                    ) : (
                        <div className="space-y-4">
                            {categories.map((category) => (
                                <div key={category.id} className="border rounded-lg p-4">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="font-semibold text-lg">{category.title}</h3>
                                            <p className="text-sm text-muted-foreground">
                                                ₹{category.currentAmount.toLocaleString()} / ₹{category.targetAmount.toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" onClick={() => handleEdit(category)}>
                                                Edit
                                            </Button>
                                            <Button variant="destructive" size="sm" onClick={() => handleDelete(category.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Image Upload */}
                                    <div className="mb-4">
                                        <Label>Category Image</Label>
                                        <div className="mt-1 space-y-2">
                                            <input
                                                id={`image-${category.id}`}
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleImageUpload(category.id, e)}
                                                className="hidden"
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => document.getElementById(`image-${category.id}`)?.click()}
                                                disabled={uploadingImages.has(category.id)}
                                                className="flex items-center gap-2"
                                            >
                                                {uploadingImages.has(category.id) ? (
                                                    <>Uploading...</>
                                                ) : (
                                                    <>
                                                        <Upload className="h-4 w-4" />
                                                        {category.image ? 'Change Image' : 'Upload Image'}
                                                    </>
                                                )}
                                            </Button>
                                            {category.image && (
                                                <div className="mt-2">
                                                    <img
                                                        src={category.image}
                                                        alt={category.title}
                                                        className="max-w-xs h-auto rounded border"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div dangerouslySetInnerHTML={{ __html: category.description }} />
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
