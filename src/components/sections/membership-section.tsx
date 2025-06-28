import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Handshake } from "lucide-react";

export function MembershipSection() {
    return (
        <section id="membership" className="container py-24 sm:py-32">
            <Card className="bg-card/80 backdrop-blur-sm">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div className="p-8">
                        <div className="flex items-center gap-4 mb-4">
                            <Handshake className="w-10 h-10 text-primary" />
                            <h2 className="text-3xl md:text-4xl font-bold">Become a Member</h2>
                        </div>
                        <p className="text-lg text-muted-foreground mt-4">
                            Join the DharmaChain family and become a pillar of support for all our causes. As a member, you are a part of every life we touch and every future we build.
                        </p>
                        <div className="mt-8 flex items-baseline gap-4">
                             <span className="text-5xl font-bold text-primary">₹1111</span>
                            <span className="text-muted-foreground">/ One-Time</span>
                        </div>
                        <Button className="w-full md:w-1/2 mt-6 text-lg py-6">Become a Member</Button>
                    </div>
                    <div className="hidden md:block">
                        <img
                            src="https://placehold.co/600x600.png"
                            data-ai-hint="community membership"
                            alt="Membership"
                            className="w-full h-full object-cover rounded-r-lg"
                        />
                    </div>
                </div>
            </Card>
        </section>
    );
}
