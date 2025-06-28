import { Eye, Gem, Hand, HeartHandshake, HeartPulse, Users } from "lucide-react";
import type { DonationCategory } from "./types";
import { GowshalaIcon } from "@/components/icons/gowshala-icon";

export const DONATION_CATEGORIES: DonationCategory[] = [
    {
        id: "orphanage",
        title: "Orphanage",
        description: "Provide a safe and nurturing home for children in need. Your support helps with food, education, and care.",
        image: "https://placehold.co/600x400.png",
        icon: HeartHandshake,
    },
    {
        id: "gowshala",
        title: "Gowshala (Cow Shelter)",
        description: "Help care for and protect sacred cows. Your donation provides shelter, food, and medical attention.",
        image: "https://placehold.co/600x400.png",
        icon: GowshalaIcon,
    },
    {
        id: "vridha-ashram",
        title: "Vridha Ashram (Old Age Home)",
        description: "Support our elderly with dignity and care. Contributions ensure they have a comfortable and respectful life.",
        image: "https://placehold.co/600x400.png",
        icon: Users,
    },
    {
        id: "health-centre",
        title: "Help Health Centre",
        description: "Fund essential medical supplies and services for underprivileged communities. Your help saves lives.",
        image: "https://placehold.co/600x400.png",
        icon: HeartPulse,
    },
    {
        id: "samuhik-vivah",
        title: "Samuhik Vivah (Mass Marriages)",
        description: "Sponsor weddings for young couples from low-income families, helping them start their new lives together.",
        image: "https://placehold.co/600x400.png",
        icon: Gem,
    },
    {
        id: "pooja-path",
        title: "Pooja-Path (Religious Services)",
        description: "Contribute to religious ceremonies and services that bring peace and spiritual well-being to the community.",
        image: "https://placehold.co/600x400.png",
        icon: Hand,
    },
    {
        id: "eye-camps",
        title: "Eye Camps",
        description: "Sponsor free eye check-ups and cataract surgeries to restore sight and hope for those who cannot afford it.",
        image: "https://placehold.co/600x400.png",
        icon: Eye,
    },
];
