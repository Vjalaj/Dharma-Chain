export function DharmaChainIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            {/* Outer circle representing the wheel of dharma */}
            <circle cx="12" cy="12" r="10" />
            
            {/* Inner hub */}
            <circle cx="12" cy="12" r="2" />
            
            {/* Eight spokes of the dharma wheel */}
            <path d="M12 2v4" />
            <path d="M12 18v4" />
            <path d="M2 12h4" />
            <path d="M18 12h4" />
            <path d="M4.93 4.93l2.83 2.83" />
            <path d="M16.24 16.24l2.83 2.83" />
            <path d="M4.93 19.07l2.83-2.83" />
            <path d="M16.24 7.76l2.83-2.83" />
            
            {/* Chain links connecting the spokes */}
            <path d="M9.5 6.5a1.5 1.5 0 0 1 1.5 1.5" />
            <path d="M13 8a1.5 1.5 0 0 1 1.5-1.5" />
            <path d="M17.5 9.5a1.5 1.5 0 0 1-1.5 1.5" />
            <path d="M16 13a1.5 1.5 0 0 1 1.5 1.5" />
            <path d="M14.5 17.5a1.5 1.5 0 0 1-1.5-1.5" />
            <path d="M11 16a1.5 1.5 0 0 1-1.5 1.5" />
            <path d="M6.5 14.5a1.5 1.5 0 0 1 1.5-1.5" />
            <path d="M8 11a1.5 1.5 0 0 1-1.5-1.5" />
        </svg>
    );
}
