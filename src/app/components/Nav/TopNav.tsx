'use client'
import {signIn, signOut, useSession} from "next-auth/react";
import Image from "next/image";
import {useEffect, useState} from "react";
import DropdownLink from "@/app/components/Nav/DropdownLink";
import NavLink from "@/app/components/Nav/NavLink";

const useTokenValidation = (session: any) => {
    useEffect(() => {
        if (!session?.token?.expTime) return;

        const checkExpiration = () => {
            const currentTime = Date.now();
            if (currentTime >= session.token.expTime) {
                signOut();
            }
        };

        const timer = setTimeout(checkExpiration, 5000);

        return () => clearTimeout(timer);
    }, [session?.token?.expTime]);
};

const TopNav = () => {
    const { data: session } = useSession();
    const [openSongsDropdown, setOpenSongsDropdown] = useState<string | null>(null);
    const [openArtistsDropdown, setOpenArtistsDropdown] = useState<string | null>(null);

    useTokenValidation(session);

    return (
        <nav className="bg-gray-800 text-white py-3 px-6 flex justify-between items-center" style={{ height: '64px' }}>
            <div className="text-xl font-bold">
                <Image
                    src="/melodot_logo.png"
                    alt="Melodot Logo"
                    width={50}
                    height={50}
                />
            </div>
            {session && (
                <div className="flex space-x-6">
                    <DropdownLink
                        title="Top Songs"
                        options={["All Time", "Last 6 Months", "Last Month"]}
                        links={["/top-songs#all-time", "/top-songs#last-6-months", "/top-songs#last-month"]}
                        isOpen={openSongsDropdown === "Top Songs"}
                        setOpen={setOpenSongsDropdown}
                    />
                    <DropdownLink
                        title="Top Artists"
                        options={["All Time", "Last 6 Months", "Last Month"]}
                        links={["/top-artists#all-time", "/top-artists#last-6-months", "/top-artists#last-month"]}
                        isOpen={openArtistsDropdown === "Top Artists"}
                        setOpen={setOpenArtistsDropdown}
                    />
                    <NavLink
                        route="/recommend"
                        title="Get Recommendations" />
                </div>

            )}
            <div className="flex items-center space-x-4">
                {session ? (
                    <>
                        <button
                            onClick={() => signOut()}
                            className="shadow-primary rounded-xl border-0 bg-gray-400 text-black text-xl active:scale-[0.99] px-3 py-1"
                        >
                            Sign Out
                        </button>
                        <Image
                            src={session?.user?.image || ''}
                            alt="User profile image"
                            width={50}
                            height={50}
                            className="rounded-full"
                        />
                    </>
                ) : (
                    <button
                        onClick={() => signIn()}
                        className="shadow-primary rounded-xl bg-white border-0 text-black text-xl active:scale-[0.99] px-6 py-3"
                    >
                        Sign In
                    </button>
                )}
            </div>
        </nav>
    );
};

export default TopNav;