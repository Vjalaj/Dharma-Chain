import type { LucideIcon } from "lucide-react";

export interface DonationCategory {
    id: string;
    title: string;
    description: string;
    image: string;
    icon: LucideIcon | React.ComponentType<any>;
}
