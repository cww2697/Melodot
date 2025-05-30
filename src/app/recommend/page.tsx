'use client';

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Option, SingleSelect } from "@/app/components/form/SingleSelect";
import { ClipLoader } from "react-spinners";
import {MultiSelect} from "@/app/components/form/MultiSelect";

export default function Recommend() {
    const { data: session } = useSession();
    const [selectedOption, setSelectedOption] = useState("");
    const [showSecondQuestion, setShowSecondQuestion] = useState(false);
    const [showThirdQuestion, setShowThirdQuestion] = useState(false);
    const [songOptions, setSongOptions] = useState<Option[] | null>(null);
    const [artistOptions, setArtistOptions] = useState<Option[] | null>(null);
    const [selectedSongs, setSelectedSongs] = useState<string[]>([]);
    const [selectedArtists, setSelectedArtists] = useState<string[]>([]);

    useEffect(() => {
        if (session?.token?.access_token) {
            fetchTopTracks(session.token.access_token);
            fetchTopArtists(session.token.access_token);
        }
    }, [session]);

    const CACHE_EXPIRATION = 3600 * 1000;

    const fetchTopTracks = async (accessToken: string) => {
        const cachedTracks = localStorage.getItem("topTracks");
        const cachedTimestamp = localStorage.getItem("topTracksTimestamp");

        if (cachedTracks && cachedTimestamp && Date.now() - parseInt(cachedTimestamp) < CACHE_EXPIRATION) {
            setSongOptions(JSON.parse(cachedTracks));
            return;
        }

        const response = await fetch("https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=50", {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        const data = await response.json();
        const formattedTracks = data.items.map((track: any) => ({
            value: track.id,
            label: `${track.name} - ${track.artists[0].name}`,
        }));

        localStorage.setItem("topTracks", JSON.stringify(formattedTracks));
        localStorage.setItem("topTracksTimestamp", Date.now().toString());
        setSongOptions(formattedTracks);
    };

    const fetchTopArtists = async (accessToken: string) => {
        const cachedArtists = localStorage.getItem("topArtists");
        const cachedTimestamp = localStorage.getItem("topArtistsTimestamp");

        if (cachedArtists && cachedTimestamp && Date.now() - parseInt(cachedTimestamp) < CACHE_EXPIRATION) {
            setArtistOptions(JSON.parse(cachedArtists));
            return;
        }

        const response = await fetch("https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit=50", {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        const data = await response.json();
        const formattedArtists = data.items.map((artist: any) => ({
            value: artist.id,
            label: artist.name,
        }));

        localStorage.setItem("topArtists", JSON.stringify(formattedArtists));
        localStorage.setItem("topArtistsTimestamp", Date.now().toString());
        setArtistOptions(formattedArtists);
    };

    const recommendTypeOptions: Option[] = [
        { value: "1", label: "Track" },
        { value: "2", label: "Artist" },
    ];

    const showSubmitButton = selectedOption && (selectedSongs.length > 0 || selectedArtists.length > 0);

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="bg-white rounded-lg shadow-md w-3/4 p-6 flex flex-col justify-center items-center">
                <div className="flex justify-center pb-10">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Let's get some recommendations!
                    </h1>
                </div>

                {(!songOptions || !artistOptions) ? (
                    <ClipLoader size={50} color={"#123abc"} loading={true} />
                ) : (
                    <>
                        <div className="flex flex-col items-center gap-4">
                            <h2 className="text-2xl font-bold text-gray-700 text-center">
                                Do you want to get recommendations by Track or Artist?
                            </h2>
                            <SingleSelect
                                label={"Choose an option"}
                                options={recommendTypeOptions}
                                selectedValue={selectedOption}
                                onChange={(value) => {
                                    setSelectedOption(value);
                                    if (value === "1") {
                                        setShowThirdQuestion(false);
                                        setShowSecondQuestion(true);
                                    } else if (value === "2") {
                                        setShowSecondQuestion(false);
                                        setShowThirdQuestion(true);
                                    }
                                }}
                            />
                        </div>

                        {showSecondQuestion && (
                            <div className="flex flex-col items-center gap-4 mt-6">
                                <h2 className="text-2xl font-bold text-gray-700 text-center">
                                    What songs do you prefer?
                                </h2>
                                <MultiSelect label={"Choose a Song"} options={songOptions} onDropdownClose={(values) => setSelectedSongs(values)} />
                            </div>
                        )}

                        {showThirdQuestion && (
                            <div className="flex flex-col items-center gap-4 mt-6">
                                <h2 className="text-2xl font-bold text-gray-700 text-center">
                                    What artists do you prefer?
                                </h2>
                                <MultiSelect label={"Choose an Artist"} options={artistOptions} onDropdownClose={(values) => setSelectedSongs(values)} />
                            </div>
                        )}

                        <div className="mt-6 flex space-x-4">
                            <button
                                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-700 transition"
                                onClick={() => {
                                    setSelectedOption("");   // Clear SingleSelect
                                    setSelectedSongs([]);    // Clear MultiSelect for Songs
                                    setSelectedArtists([]);  // Clear MultiSelect for Artists
                                }}
                            >
                                Clear
                            </button>

                            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                                Submit
                            </button>
                        </div>

                    </>
                )}
            </div>
        </div>
    );
}