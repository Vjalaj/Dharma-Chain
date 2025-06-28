'use client';

import { useState, useEffect } from "react";
import { MapPin, ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getAboutContent } from "@/lib/firebase-service";

interface AboutSection {
    id: string;
    heading: string;
    content: string;
    image?: string;
    order: number;
}

interface AboutContent {
    mainHeading?: string;
    mainDescription?: string;
    locationLink?: string;
    sections?: AboutSection[];
}

export function AboutSection() {
    const [aboutContent, setAboutContent] = useState<AboutContent | null>(null);
    const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadContent() {
            try {
                const content = await getAboutContent();
                setAboutContent(content);
            } catch (error) {
                console.error('Failed to load about content:', error);
                // Fallback content
                setAboutContent({
                    mainHeading: 'About DharmaChain',
                    mainDescription: 'Learn more about our mission and impact.',
                    locationLink: 'https://www.google.com/maps',
                    sections: [
                        {
                            id: 'main',
                            heading: 'Our Mission',
                            content: 'DharmaChain was founded on the principles of selfless service and compassion. We believe in creating a transparent and direct line between donors and beneficiaries, ensuring that every contribution makes a meaningful impact.',
                            order: 0,
                        }
                    ]
                });
            } finally {
                setIsLoading(false);
            }
        }
        loadContent();
    }, []);

    const toggleSection = (sectionId: string) => {
        setExpandedSections(prev => {
            const newSet = new Set(prev);
            if (newSet.has(sectionId)) {
                newSet.delete(sectionId);
            } else {
                newSet.add(sectionId);
            }
            return newSet;
        });
    };

    if (isLoading) {
        return (
            <section id="about" className="container py-24 sm:py-32">
                <div className="bg-card p-8 rounded-lg shadow-md">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-300 rounded w-64 mb-4"></div>
                        <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                        <div className="h-4 bg-gray-300 rounded w-3/4 mb-6"></div>
                        <div className="h-6 bg-gray-300 rounded w-48"></div>
                    </div>
                </div>
            </section>
        );
    }

    const galleryImages = [
        { src: "https://placehold.co/500x500.png", alt: "Gallery image 1", hint: "community gathering" },
        { src: "https://placehold.co/500x500.png", alt: "Gallery image 2", hint: "charity event" },
        { src: "https://placehold.co/500x500.png", alt: "Gallery image 3", hint: "volunteers working" },
        { src: "https://placehold.co/500x500.png", alt: "Gallery image 4", hint: "happy children" },
    ];

    return (
        <section id="about" className="container py-24 sm:py-32">
            <div className="bg-card p-8 rounded-lg shadow-md">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        {aboutContent?.mainHeading || 'About DharmaChain'}
                    </h2>
                    {aboutContent?.mainDescription && (
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            {aboutContent.mainDescription}
                        </p>
                    )}
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    <div className="space-y-6">
                        {aboutContent?.sections?.sort((a, b) => a.order - b.order).map((section) => (
                            <Card key={section.id} className="transition-all duration-200 hover:shadow-md">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-xl font-semibold">{section.heading}</h3>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => toggleSection(section.id)}
                                            className="flex items-center gap-2"
                                        >
                                            {expandedSections.has(section.id) ? (
                                                <>
                                                    Less
                                                    <ChevronUp className="h-4 w-4" />
                                                </>
                                            ) : (
                                                <>
                                                    Read More
                                                    <ChevronDown className="h-4 w-4" />
                                                </>
                                            )}
                                        </Button>
                                    </div>

                                    {section.image && (
                                        <div className="mb-4">
                                            <Image
                                                src={section.image}
                                                alt={section.heading}
                                                width={400}
                                                height={200}
                                                className="rounded-lg object-cover w-full h-48"
                                            />
                                        </div>
                                    )}

                                    <div className={`rich-text-content transition-all duration-300 ${
                                        expandedSections.has(section.id) 
                                            ? 'opacity-100 max-h-none' 
                                            : 'opacity-70 max-h-20 overflow-hidden relative'
                                    }`}>
                                        <div dangerouslySetInnerHTML={{ __html: section.content }} />
                                        {!expandedSections.has(section.id) && (
                                            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent"></div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {aboutContent?.locationLink && (
                            <div className="mt-8">
                                <Link 
                                    href={aboutContent.locationLink} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="inline-flex items-center gap-2 text-primary hover:underline font-semibold"
                                >
                                    <MapPin className="w-5 h-5" />
                                    Visit Our Location
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {galleryImages.map((image, index) => (
                             <div key={index} className="relative aspect-square">
                                <Image
                                    src={image.src}
                                    alt={image.alt}
                                    fill
                                    className="rounded-lg object-cover shadow-lg"
                                    data-ai-hint={image.hint}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}