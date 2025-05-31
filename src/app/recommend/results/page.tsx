'use client';
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";

export default function Results() {
    const { data: session, status } = useSession();
    const searchParams = useSearchParams();

    // Local state for parsed query parameters:
    const [selectedOption, setSelectedOption] = useState("");
    const [selectedSongs, setSelectedSongs] = useState<string[]>([]);
    const [selectedArtists, setSelectedArtists] = useState<string[]>([]);

    // Loading states: one for query parsing and one for recommendations fetching.
    const [isQueryLoading, setIsQueryLoading] = useState(true);
    const [isRecLoading, setIsRecLoading] = useState(true);

    // State for error messages and recommendations:
    const [recError, setRecError] = useState("");
    const [recommendations, setRecommendations] = useState<any[]>([]);

    // First useEffect: Parse query parameters.
    useEffect(() => {
        try {
            const option = searchParams.get("selectedOption") || "";
            const songs = JSON.parse(
                decodeURIComponent(searchParams.get("selectedSongs") || "[]")
            );
            const artists = JSON.parse(
                decodeURIComponent(searchParams.get("selectedArtists") || "[]")
            );

            setSelectedOption(option);
            setSelectedSongs(songs);
            setSelectedArtists(artists);

            // If missing required parameters, set an error.
            if (option === "" && (songs.length === 0 || artists.length === 0)) {
                setRecError("An error occurred. Please try again.");
                // Mark both query and recommendations as finished.
                setIsQueryLoading(false);
                setIsRecLoading(false);
                return;
            }

            setIsQueryLoading(false);
        } catch (error) {
            setRecError("An error occurred. Please try again.");
            setIsQueryLoading(false);
            setIsRecLoading(false);
        }
    }, [searchParams]);

    useEffect(() => {
        if (!isQueryLoading) {
            if (status === "authenticated" && session) {

                // @ts-ignore
                const accessToken = session?.token?.access_token;
                if (!accessToken) {
                    setRecError("Access token is missing.");
                    setIsRecLoading(false);
                    return;
                }

                const fetchRecommendations = async () => {
                    try {
                        const url = new URL("https://api.spotify.com/v1/recommendations");
                        if (selectedArtists.length > 0) {
                            url.searchParams.append("seed_artists", selectedArtists.join(","));
                        }
                        if (selectedSongs.length > 0) {
                            url.searchParams.append("seed_tracks", "0c6xIDDpzE81m2q797ordA");
                        }
                        const response = await fetch(url.toString(), {
                            headers: {
                                "Authorization": `Bearer ${accessToken}`,
                                "Content-Type": "application/json",
                            },
                        });

                        if (!response.ok) {
                            throw new Error("Failed to fetch recommendations.");
                        }

                        const data = await response.json();
                        setRecommendations(data.tracks || []);
                    } catch (err: any) {
                        console.error("Error fetching recommendations:", err);
                        setRecError(err.message);
                    } finally {
                        setIsRecLoading(false);
                    }
                };

                fetchRecommendations();
            } else {
                setRecError("Invalid session.");
                setIsRecLoading(false);
            }
        }
    }, [isQueryLoading, status, session, selectedArtists, selectedSongs]);

    const isLoading = isQueryLoading || isRecLoading;

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
            <div className="bg-gray-100 rounded-lg shadow-md w-3/4 p-6 flex flex-col justify-center items-center">
                {isLoading ? (
                    <ClipLoader size={50} color={"#f35a4b"} loading={true} />
                ) : recError ? (
                    <h1 className="text-2xl font-bold text-gray-900">{recError}</h1>
                ) : recommendations.length > 0 ? (
                    <>
                        <h1 className="text-3xl font-bold text-gray-900 pb-10">
                            Recommendations:
                        </h1>
                        <div className="w-full">
                            {recommendations.map((track, index) => (
                                <div key={index} className="border-b border-gray-300 py-2">
                                    <p className="text-xl">{track.name}</p>
                                    <p className="text-sm text-gray-600">
                                        {track.artists.map((artist: any) => artist.name).join(", ")}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <p>No recommendations found.</p>
                )}
            </div>
        </div>
    );
}