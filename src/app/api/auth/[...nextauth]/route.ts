import NextAuth from "next-auth/next";
import { type NextAuthOptions } from "next-auth";
import SpotifyProvider from 'next-auth/providers/spotify';

const options: NextAuthOptions = {
    providers: [
        SpotifyProvider({
            authorization:
                'https://accounts.spotify.com/authorize?scope=user-read-email,user-top-read',
            clientId: process.env.SPOTIFY_CLIENT_ID || '',
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET || '',
        })
    ],
    callbacks: {
        async jwt({ token, account}) {
            if (account) {
                token.access_token = account.access_token;
                token.expTime = Date.now()+3600000;
            }
            return token;
        },
        async session({ session, token }){
            return {
                ...session,
                token
            };
        },
    }
}

const handler = NextAuth(options);

export { handler as GET, handler as POST }