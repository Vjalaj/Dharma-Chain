import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

// This file contains functions to interact with your Firestore database.

/**
 * Defines the structure for an individual about section.
 */
export interface AboutSection {
    id: string;
    heading: string;
    content: string;
    image?: string;
    order: number;
}

/**
 * Defines the structure for the complete 'About Us' page content.
 */
export interface AboutContent {
    mainHeading?: string;
    mainDescription?: string;
    locationLink?: string;
    sections?: AboutSection[];
    // Legacy fields for backward compatibility
    heading?: string;
    text?: string;
}

// We'll store the 'About' content in a single, predictable document.
const aboutContentRef = doc(db, "about-content", "main");

// Default content to display if no data is found in the database.
const defaultContent: AboutContent = {
    mainHeading: 'About DharmaChain',
    mainDescription: 'Learn more about our mission and impact.',
    locationLink: 'https://www.google.com/maps',
    sections: [
        {
            id: 'main-section',
            heading: 'Our Mission',
            content: 'DharmaChain was founded on the principles of selfless service and compassion. We believe in creating a transparent and direct line between donors and beneficiaries, ensuring that every contribution makes a meaningful impact. Our team is driven by a shared vision of a world where everyone has the opportunity to live a life of dignity and hope.',
            order: 0,
        },
        {
            id: 'our-approach',
            heading: 'Our Approach',
            content: 'We focus on transparency, accountability, and direct impact. Every donation is tracked and reported, ensuring that our supporters can see exactly how their contributions are making a difference in the lives of those we serve.',
            order: 1,
        }
    ],
};

/**
 * Fetches the 'About Us' content from Firestore.
 * If the document doesn't exist, it returns hardcoded default content.
 * @returns {Promise<AboutContent>} A promise that resolves to the about content.
 */
export async function getAboutContent(): Promise<AboutContent> {
    try {
        const docSnap = await getDoc(aboutContentRef);
        if (docSnap.exists()) {
            const data = docSnap.data() as AboutContent;
            
            // Handle legacy format conversion
            if (data.heading && data.text && !data.sections) {
                return {
                    mainHeading: data.heading,
                    mainDescription: data.mainDescription || 'Learn more about our mission and impact.',
                    locationLink: data.locationLink || 'https://www.google.com/maps',
                    sections: [
                        {
                            id: 'legacy-section',
                            heading: data.heading,
                            content: data.text,
                            order: 0,
                        }
                    ],
                };
            }
            
            return data;
        } else {
            // The document doesn't exist, so return the hardcoded default content.
            return defaultContent;
        }
    } catch (error) {
        console.error("Error fetching about content:", error);
        // Return default content on error to ensure the site still renders.
        return defaultContent;
    }
}

/**
 * Updates the 'About Us' content in Firestore.
 * @param {Partial<AboutContent>} content - An object containing the fields to update.
 */
export async function updateAboutContent(content: Partial<AboutContent>): Promise<void> {
    try {
        // Using { merge: true } ensures we only update the fields provided
        // and don't overwrite the entire document.
        await setDoc(aboutContentRef, content, { merge: true });
        console.log("Content updated successfully");
    } catch (error) {
        console.error("Error updating about content:", error);
        throw new Error("Failed to update content: " + (error as Error).message);
    }
}
