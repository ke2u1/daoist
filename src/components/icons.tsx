import type { SVGProps } from "react";

export function BrainCircuit(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 0 0 8 22a3 3 0 0 0 5.196-2.023c.17-.67.358-1.325.56-1.956.198-.62.42-1.22.68-1.777.26-.546.556-.93.89-1.163a3 3 0 0 0 1.13-4.444C15.5 8.78 14.28 6.57 12 5Z" />
            <path d="M16 8a1 1 0 0 0-1-1" />
            <path d="M18 13a1 1 0 0 0-1-1" />
            <path d="M12 13a1 1 0 0 0-1-1" />
            <path d="M12 20a1 1 0 0 0-1-1" />
            <path d="M12 8a1 1 0 0 0-1-1" />
            <path d="M4 13a1 1 0 0 0-1-1" />
        </svg>
    )
}
