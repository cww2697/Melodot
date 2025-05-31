'use client';
import Image from "next/image";
import React from "react";

interface SongCardProps {
    rank: number
    albumArt: string;
    title: string;
    album: string;
    artist: string;
    spotifyUrl: string;
}

const SongCard: React.FC<SongCardProps> = ({rank, albumArt, title, album, artist, spotifyUrl}) => {

    return (
        <div
            className="max-w-sm bg-gray-800 text-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition duration-300 hover:scale-105 group"
            onClick={() => window.open(spotifyUrl, "_blank")}
        >
            <div className="absolute top-2 right-2 bg-[#f35a4b] text-white text-xl font-bold px-2 py-1 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                {rank}
            </div>

            <Image src={albumArt} alt={title} width={400} height={400} className="w-full h-[300px] object-cover"/>
            <div className="p-4">
                <h2 className="text-xl font-bold">{title}</h2>
                <p className="text-gray-400">{album}</p>
                <p className="text-gray-400">{artist}</p>
            </div>
        </div>
    );
};

export default SongCard;