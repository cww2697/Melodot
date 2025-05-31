'use client';

import {signIn, useSession} from "next-auth/react";
import { useState, useEffect } from "react";
import { Option, SingleSelect } from "@/app/components/form/SingleSelect";
import { ClipLoader } from "react-spinners";
import { MultiSelect } from "@/app/components/form/MultiSelect";
import { motion, AnimatePresence } from "framer-motion";
import {FaSpinner} from "react-icons/fa";

export default function Recommend() {
    const { data: session, status } = useSession();
    const [selectedOption, setSelectedOption] = useState("");
    const [showSecondQuestion, setShowSecondQuestion] = useState(false);
    const [showThirdQuestion, setShowThirdQuestion] = useState(false);
    const [songOptions, setSongOptions] = useState<Option[] | null>(null);
    const [artistOptions, setArtistOptions] = useState<Option[] | null>(null);
    const [selectedSongs, setSelectedSongs] = useState<string[]>([]);
    const [selectedArtists, setSelectedArtists] = useState<string[]>([]);
    const [editSongs, setEditSongs] = useState(false);
    const [editArtists, setEditArtists] = useState(false);

    useEffect(() => {
        // @ts-ignore
        if (session?.token?.access_token) {
            // @ts-ignore
            fetchTopTracks(session.token.access_token);
            // @ts-ignore
            fetchTopArtists(session.token.access_token);
        }
    }, [session]);

    const CACHE_EXPIRATION = 3600 * 1000;

    const fetchTopTracks = async (accessToken: string) => {
        const cachedTracks = localStorage.getItem("topTracks");
        const cachedTimestamp = localStorage.getItem("topTracksTimestamp");

        if (
            cachedTracks &&
            cachedTimestamp &&
            Date.now() - parseInt(cachedTimestamp) < CACHE_EXPIRATION
        ) {
            setSongOptions(JSON.parse(cachedTracks));
            return;
        }

        const response = await fetch(
            "https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=50",
            {
                headers: { Authorization: `Bearer ${accessToken}` },
            }
        );

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

        if (
            cachedArtists &&
            cachedTimestamp &&
            Date.now() - parseInt(cachedTimestamp) < CACHE_EXPIRATION
        ) {
            setArtistOptions(JSON.parse(cachedArtists));
            return;
        }

        const response = await fetch(
            "https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit=50",
            {
                headers: { Authorization: `Bearer ${accessToken}` },
            }
        );

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

    const showSubmitButton =
        selectedOption && (selectedSongs.length > 0 || selectedArtists.length > 0);

    const getSongsSummary = () => {
        if (!songOptions) return "";
        const selectedSongLabels = selectedSongs
            .map(id => {
                const fullLabel = songOptions.find(song => song.value === id)?.label;
                if (fullLabel) {
                    return fullLabel.includes(" - ") ? fullLabel.split(" - ")[0].trim() : fullLabel.trim();
                }
                return "";
            })
            .filter(Boolean) as string[];
        const displayed = selectedSongLabels.slice(0, 3).join(", ");
        const moreCount = selectedSongLabels.length - 3;
        return displayed + (moreCount > 0 ? `, +${moreCount} more` : "");
    };

    const getArtistsSummary = () => {
        if (!artistOptions) return "";
        const selectedArtistLabels = selectedArtists
            .map(id => artistOptions.find(artist => artist.value === id)?.label)
            .filter(Boolean) as string[];
        if (selectedArtistLabels.length === 1) {
            return selectedArtistLabels[0];
        }
        const displayed = selectedArtistLabels.slice(0, 3).join(", ");
        const moreCount = selectedArtistLabels.length - 3;
        return displayed + (moreCount > 0 ? `, +${moreCount} more` : "");
    };

    if (status !== 'authenticated') {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
                <div className="bg-white rounded-lg shadow-md w-3/4 p-6 flex flex-col justify-center items-center">
                    <h1 className="text-3xl text-gray-900 font-bold mb-4">So, what kind of music are you feeling today</h1>
                    <p className="text-gray-900">Please sign in to view your Spotify recommendations.</p>
                    <button
                        onClick={() => signIn()}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
                    >
                        Sign In
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
            <div className="bg-white rounded-lg shadow-md w-3/4 p-6 flex flex-col justify-center items-center">
                <div className="flex justify-center pb-10">
                    <h1 className="text-3xl font-bold text-gray-900">
                        So, what kind of music are you feeling today?
                    </h1>
                </div>

                {(!songOptions || !artistOptions) ? (
                    <ClipLoader size={50} color={"#123abc"} loading={true} />
                ) : (
                    <>
                        <div className="flex flex-col items-center gap-4">
                            <AnimatePresence mode="wait">
                                {selectedOption ? (
                                    <motion.p
                                        key="sentence"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="text-2xl text-gray-700 text-center"
                                    >
                                        I'll fetch recommendations based on{" "}
                                        <span
                                            className="font-bold text-blue-600 cursor-pointer"
                                            onClick={() => {
                                                setSelectedOption("");
                                                setShowSecondQuestion(false);
                                                setShowThirdQuestion(false);
                                            }}
                                        >
                                            {
                                                recommendTypeOptions.find(
                                                    (opt) => opt.value === selectedOption)?.label
                                            }
                                        </span>
                                    </motion.p>
                                ) : (
                                    <motion.div
                                        key="select"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="flex flex-col items-center gap-4"
                                    >
                                        <h2 className="text-2xl font-bold text-gray-700 text-center">
                                            Do you want to get recommendations by Track or Artist?
                                        </h2>
                                        <SingleSelect
                                            label="Choose an option"
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
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {showSecondQuestion && (
                            <div className="flex flex-col items-center gap-4 mt-6">
                                <AnimatePresence mode="wait">
                                    {(selectedSongs.length > 0 && !editSongs) ? (
                                        <motion.p
                                            key="song-summary"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="text-2xl text-gray-700 text-center"
                                        >
                                            {selectedSongs.length === 1 ? "With the song " : "With the songs "}
                                            <span
                                                className="font-bold text-blue-600 cursor-pointer"
                                                onClick={() => setEditSongs(true)}
                                            >
                                                {getSongsSummary()}
                                            </span>
                                            {" "}as a seed.
                                        </motion.p>
                                    ) : (
                                        <motion.div
                                            key="song-select"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="flex flex-col items-center gap-4 mt-6"
                                        >
                                            <h2 className="text-2xl font-bold text-gray-700 text-center">
                                                What songs do you prefer?
                                            </h2>
                                            <MultiSelect
                                                label={"Choose a Song"}
                                                options={songOptions}
                                                selectedValues={selectedSongs}
                                                onDropdownClose={(values) => {
                                                    setSelectedSongs(values);
                                                    setEditSongs(false);
                                                }}
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}

                        {showThirdQuestion && (
                            <div
                                className="flex flex-col items-center gap-4 mt-6"
                            >
                                <AnimatePresence mode="wait">
                                    {(selectedArtists.length > 0 && !editArtists) ? (
                                        <motion.p
                                            key="artist-summary"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.5 }}
                                            className="text-2xl text-gray-700 text-center"
                                        >
                                            {selectedArtists.length === 1 ? "With the artist " : "With the artists "}
                                            <span
                                                className="font-bold text-blue-600 cursor-pointer"
                                                onClick={() => setEditArtists(true)}
                                            >
                                                {getArtistsSummary()}
                                            </span>
                                            {" "}as a seed.
                                        </motion.p>
                                    ) : (
                                        <motion.div
                                            key="artist-select"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.5 }}
                                            className="flex flex-col items-center gap-4 mt-6"
                                        >
                                            <h2 className="text-2xl font-bold text-gray-700 text-center">
                                                What artists do you prefer?
                                            </h2>
                                            <MultiSelect
                                                label={"Choose an Artist"}
                                                options={artistOptions}
                                                selectedValues={selectedArtists}
                                                onDropdownClose={(values) => {
                                                    setSelectedArtists(values);
                                                    setEditArtists(false); // Switch back to summary after editing.
                                                }}
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}

                        <div className="mt-6 flex space-x-4">
                            <button
                                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-700 transition"
                                onClick={() => {
                                    setSelectedOption("");
                                    setShowSecondQuestion(false);
                                    setShowThirdQuestion(false);
                                    setSelectedSongs([]);
                                    setSelectedArtists([]);
                                }}
                            >
                                Clear
                            </button>

                            {showSubmitButton && (
                                <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                                    Submit
                                </button>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}