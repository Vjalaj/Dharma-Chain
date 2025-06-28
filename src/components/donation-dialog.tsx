'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { IndianRupee } from 'lucide-react';

interface DonationDialogProps {
    children: React.ReactNode;
    categoryTitle?: string;
}

const formSchema = z.object({
    amount: z.coerce.number().min(10, { message: "Donation must be at least ₹10." }),
    anonymous: z.boolean().default(false),
    name: z.string().optional(),
    email: z.string().optional(),
    message: z.string().optional(),
}).refine(data => data.anonymous || (data.name && data.name.trim().length > 0), {
    message: "Name is required for non-anonymous donations.",
    path: ["name"],
}).refine(data => data.anonymous || (data.email && z.string().email().safeParse(data.email).success), {
    message: "A valid email is required for non-anonymous donations.",
    path: ["email"],
});

/**
 * Sends a confirmation email using FormSubmit.co.
 * This is a client-side function for demonstration.
 * @param details - The donation details to include in the email.
 */
async function sendConfirmationEmail(details: { name?: string; amount: number; category: string }) {
    const formData = new FormData();
    formData.append('name', details.name || 'Anonymous Donor');
    formData.append('amount', `₹${details.amount}`);
    formData.append('category', details.category);
    formData.append('message', `Thank you for your generous donation of ₹${details.amount} to ${details.category}!`);
    formData.append('_subject', `New Donation to DharmaChain!`);
    
    // IMPORTANT: Replace with your FormSubmit email in a real application.
    // You will need to activate it by submitting a form once from your website.
    const formSubmitEndpoint = 'https://formsubmit.co/your@email.com';

    try {
        const response = await fetch(formSubmitEndpoint, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json' // Prevents redirect
            }
        });
        const data = await response.json();
        console.log('FormSubmit Response:', data);
    } catch (error) {
        console.error('Failed to send confirmation email:', error);
    }
}

export function DonationDialog({ children, categoryTitle = 'the cause' }: DonationDialogProps) {
    const [open, setOpen] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
            amount: undefined,
            message: '',
            anonymous: false,
        },
    });

    const presetAmounts = [101, 501, 1111, 2501];

    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log('Form submitted:', values);
        
        // This is the testing mode behavior.
        // In a real app, this block would be replaced with Razorpay integration.
        // After successful payment confirmation from Razorpay, you would call sendConfirmationEmail.
        await sendConfirmationEmail({
            name: values.name,
            amount: values.amount,
            category: categoryTitle,
        });
        
        alert(`Thank you for your donation of ₹${values.amount}! A confirmation email has been sent (check console for details).`);
        form.reset();
        setOpen(false);
    }

    const isAnonymous = form.watch('anonymous');

    useEffect(() => {
        if (isAnonymous) {
            form.clearErrors(['name', 'email']);
            form.setValue('name', '');
            form.setValue('email', '');
        }
    }, [isAnonymous, form]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl">Donate to {categoryTitle}</DialogTitle>
                    <DialogDescription>
                        Your generosity makes a world of difference. Thank you for your support.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Select an amount</Label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {presetAmounts.map(amount => (
                                    <Button
                                        key={amount}
                                        type="button"
                                        variant="outline"
                                        onClick={() => form.setValue('amount', amount, { shouldValidate: true })}
                                        className={form.watch('amount') === amount ? 'border-primary' : ''}
                                    >
                                        ₹{amount}
                                    </Button>
                                ))}
                            </div>
                            <FormField
                                control={form.control}
                                name="amount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <div className="relative">
                                                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    type="number"
                                                    placeholder="Or enter a custom amount"
                                                    className="pl-8"
                                                    {...field}
                                                    onChange={e => field.onChange(e.target.value)}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="anonymous"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center space-x-3 space-y-0 pt-2">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            id="anonymous-check"
                                        />
                                    </FormControl>
                                    <Label htmlFor="anonymous-check" className="font-normal cursor-pointer">
                                        I want to donate anonymously.
                                    </Label>
                                </FormItem>
                            )}
                        />

                        {!isAnonymous && (
                            <div className="space-y-4 pt-4 border-t">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Full Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Aarav Sharma" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email Address</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="aarav.sharma@example.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="message"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Message (Optional)</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="A few words of encouragement..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        )}

                        <DialogFooter className="pt-4">
                            <Button type="submit" className="w-full">
                                Proceed to Pay
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
