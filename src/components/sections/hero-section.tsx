import { Button } from "@/components/ui/button";
import { DonationDialog } from "../donation-dialog";

export function HeroSection() {
    return (
        <section className="container grid lg:grid-cols-2 place-items-center py-20 md:py-32 gap-10">
            <div className="text-center lg:text-start space-y-6">
                <main className="text-5xl md:text-6xl font-bold">
                    <h1 className="inline">
                        <span className="inline bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                            Compassionate
                        </span>{" "}
                        Giving,
                    </h1>{" "}
                    for a{" "}
                    <h2 className="inline">
                        <span className="inline bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                            Better
                        </span>{" "}
                        World
                    </h2>
                </main>

                <p className="text-xl text-muted-foreground md:w-10/12 mx-auto lg:mx-0">
                    Join DharmaChain in our mission to support communities in need. Your contribution, big or small, can create a wave of positive change.
                </p>

                <div className="space-y-4 md:space-y-0 md:space-x-4">
                    <DonationDialog categoryTitle="General Fund">
                        <Button className="w-full md:w-1/3">Donate Now</Button>
                    </DonationDialog>
                </div>
            </div>

            <div className="hidden lg:block">
                <img
                    src="https://placehold.co/600x400.png"
                    data-ai-hint="community charity"
                    alt="Hero Image"
                    className="w-full md:w-11/12 mx-auto rounded-lg object-cover shadow-lg"
                />
            </div>
        </section>
    );
}
