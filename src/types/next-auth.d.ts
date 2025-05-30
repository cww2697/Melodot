declare module "next-auth" {
    interface Session {
        token?: {
            access_token: string;
        };
    }
}