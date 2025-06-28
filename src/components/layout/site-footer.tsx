export function SiteFooter() {
    return (
        <footer className="py-6 md:px-8 md:py-0 border-t">
            <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
                <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
                    © {new Date().getFullYear()} DharmaChain. All rights reserved.
                </p>
                <div className="flex items-center gap-4">
                     <a href="#causes" className="text-sm text-muted-foreground hover:text-foreground">Causes</a>
                    <a href="#membership" className="text-sm text-muted-foreground hover:text-foreground">Membership</a>
                </div>
            </div>
        </footer>
    );
}
