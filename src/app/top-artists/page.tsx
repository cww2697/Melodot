'use client';
import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { FaSpinner } from "react-icons/fa";
import ArtistCard from "@/app/components/ArtistCard/ArtistCard"; // Import spinner icon

const tabNames = ['All Time', 'Last 6 Months', 'Last Month'] as const;
type TabName = typeof tabNames[number];

export default function TopArtists() {
    const { data: session, status } = useSession(); // Get session status
    const [activeTab, setActiveTab] = useState<TabName>('All Time');
    const [artists, setArtists] = useState([]);
    const [lastFetchedTime, setLastFetchedTime] = useState<number | null>(null);

    const fetchTopSongs = async (accessToken: string) => {
        const timeRange =
            activeTab === "Last 6 Months" ? "medium_term" :
            activeTab === "Last Month" ? "short_term" :
                "long_term";

        const cacheKey = `spotifyTopArtists_${activeTab}`;
        const cachedData = localStorage.getItem(cacheKey);
        const cacheTimestamp = localStorage.getItem(`${cacheKey}_timestamp`);
        const currentTime = Date.now();

        if (cachedData && cacheTimestamp && currentTime - Number(cacheTimestamp) < 3600) {
            setArtists(JSON.parse(cachedData)); // Use cached data
            return;
        }

        try {
            const response = await fetch(`https://api.spotify.com/v1/me/top/artists?time_range=${timeRange}&limit=50`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const data = await response.json();
            setArtists(data.items || []);
            localStorage.setItem(cacheKey, JSON.stringify(data.items));
            localStorage.setItem(`${cacheKey}_timestamp`, currentTime.toString());
            setLastFetchedTime(currentTime);
        } catch (error) {
            console.error("Error fetching Spotify data:", error);
        }
    };



    useEffect(() => {
            // @ts-ignore
            if (session?.token?.access_token) {
                // @ts-ignore
                fetchTopSongs(session?.token?.access_token);
            }
        },
        // @ts-ignore
        [activeTab, session?.token?.access_token]);


    useEffect(() => {
        const hash = window.location.hash.replace('#', '');
        const formattedTab = tabNames.find(tab => tab.toLowerCase().replace(/\s/g, '-') === hash);
        if (formattedTab) setActiveTab(formattedTab);
    }, []);

    if (status === 'loading') {
        return (<div className="flex justify-center items-center h-screen">
                <FaSpinner className="text-blue-500 text-4xl animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Top Artists</h1>
            {status !== 'authenticated' ? (
                <p>Please sign in to view your top Spotify Artists.</p>
            ) : (
                <>
                    <div className="flex space-x-4 border-b border-gray-400 pb-2">
                        {tabNames.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => {
                                    setActiveTab(tab);
                                    window.location.hash = tab.toLowerCase().replace(/\s/g, '-');
                                }}
                                className={`px-4 py-2 ${activeTab === tab ? 'font-bold border-b-2 border-blue-500' : 'text-gray-500'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    <div className="mt-4">
                        {artists.length > 0 ? (
                            <div className="mt-4 flex justify-center items-center min-h-[50vh]">
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-6">
                                    {artists.map((artist: any, i: number) => (
                                        <ArtistCard
                                            key={artist.id}
                                            rank={i+1}
                                            artistArt={artist.images[0]?.url}
                                            artistName={artist.name}
                                            spotifyUrl={artist.external_urls.spotify}
                                        />
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <p>{artists.length === 0 ? "No top artists found." : `Here will be data for ${activeTab}.`}</p>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}