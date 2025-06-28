import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Info, MapPin } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { getAboutContent } from '@/lib/firebase-service';

export async function SiteHeader() {
  const aboutContent = await getAboutContent();

  // The gallery images are still placeholders. Connecting this to the admin panel
  // requires setting up Firebase Storage, which is a great next step.
  const galleryImages = [
      { src: "https://placehold.co/500x500.png", alt: "Gallery image 1", hint: "community gathering" },
      { src: "https://placehold.co/500x500.png", alt: "Gallery image 2", hint: "charity event" },
      { src: "https://placehold.co/500x500.png", alt: "Gallery image 3", hint: "volunteers working" },
      { src: "https://placehold.co/500x500.png", alt: "Gallery image 4", hint: "happy children" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="font-bold text-lg font-headline">DharmaChain</span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Info className="h-5 w-5" />
                <span className="sr-only">About</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle className="text-2xl">{aboutContent.heading}</DialogTitle>
              </DialogHeader>
              <div className="grid lg:grid-cols-2 gap-8 items-center mt-4">
                  <div>
                      <p className="text-muted-foreground mb-6">
                          {aboutContent.text}
                      </p>
                      {aboutContent.locationLink && aboutContent.locationLink.trim() !== '' && (
                          <Link href={aboutContent.locationLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary hover:underline font-semibold">
                              <MapPin className="w-5 h-5" />
                              Visit Us
                          </Link>
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
            </DialogContent>
          </Dialog>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
