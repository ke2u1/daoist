import type { SVGProps } from "react";

export function YinYang(props: SVGProps<SVGSVGElement>) {
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
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a10 10 0 0 0-10 10c0 4.42 2.866 8.114 6.837 9.488A10 10 0 0 1 12 2v10z" fill="currentColor" />
            <path d="M12 2a10 10 0 0 1 10 10c0-4.42-2.866-8.114-6.837-9.488A10 10 0 0 0 12 2v10z" />
            <circle cx="12" cy="7" r="2" fill="white" stroke="none" />
            <circle cx="12" cy="17" r="2" fill="currentColor" stroke="none" />
        </svg>
    )
}
