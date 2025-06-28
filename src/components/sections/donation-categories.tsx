import { DonationCard } from "@/components/donation-card";
import { DONATION_CATEGORIES } from "@/lib/constants";

export function DonationCategories() {
    return (
        <section id="causes" className="container py-24 sm:py-32">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold">Our Causes</h2>
                <p className="md:w-1/2 mx-auto mt-4 text-muted-foreground">
                    Your contribution supports a wide range of initiatives. Choose a cause that resonates with you.
                </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {DONATION_CATEGORIES.map((category) => (
                    <DonationCard key={category.id} category={category} />
                ))}
            </div>
        </section>
    );
}
