import Image from "next/image";

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-400 text-center py-4 mt-8 flex flex-col items-center fixed bottom-0 w-full">
            <Image
                src="/Spotify_Full_Logo_RGB_White.png"
                alt="Spotify Logo"
                width={200}
                height={50}
                className="max-w-full sm:w-48 md:w-56 lg:w-64"
            />
        </footer>
    );
};

export default Footer;
