import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { DonationCategory } from "@/lib/types";
import Image from "next/image";
import { DonationDialog } from "./donation-dialog";

interface DonationCardProps {
    category: DonationCategory;
}

export function DonationCard({ category }: DonationCardProps) {
    const Icon = category.icon;
    return (
        <Card className="flex flex-col">
            <CardHeader className="flex-grow">
                <div className="flex items-center gap-4 mb-4">
                    <Icon className="w-8 h-8 text-primary" />
                    <CardTitle className="text-2xl">{category.title}</CardTitle>
                </div>
                <div className="aspect-video relative">
                    <Image
                        src={category.image}
                        alt={category.title}
                        fill
                        className="rounded-md object-cover"
                        data-ai-hint={`${category.id.replace('-', ' ')}`}
                    />
                </div>
            </CardHeader>
            <CardContent className="flex-grow">
                <CardDescription>{category.description}</CardDescription>
            </CardContent>
            <CardFooter>
                <DonationDialog categoryTitle={category.title}>
                    <Button className="w-full">Donate</Button>
                </DonationDialog>
            </CardFooter>
        </Card>
    );
}
