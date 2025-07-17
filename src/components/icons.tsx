import type { SVGProps } from "react";

export function YinYang(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 100 100"
            {...props}
        >
            <circle cx="50" cy="50" r="50" fill="currentColor"/>
            <path d="M50,0 A50,50 0 0,1 50,100 A25,25 0 0,0 50,50 A25,25 0 0,1 50,0 Z" fill="white"/>
            <circle cx="50" cy="25" r="12" fill="currentColor"/>
            <circle cx="50" cy="75" r="12" fill="white"/>
        </svg>
    )
}
