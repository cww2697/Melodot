'use client'
import Image from "next/image";

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-400 text-center py-4 mt-8 flex flex-col items-center w-full relative">
            <Image
                src="/Spotify_Full_Logo_RGB_White.png"
                alt="Spotify Logo"
                width={200}
                height={50}
                className="max-w-full sm:w-48 md:w-56 lg:w-64"
            />
        </footer>
    );
}
