import { betterAuth } from "better-auth";
import { jwt, bearer } from "better-auth/plugins";
import { Pool } from "pg";

// Check better-auth docs for more info https://www.better-auth.com/docs/
export const auth = betterAuth({
	baseURL: process.env.BETTER_AUTH_URL || "https://notepad-auth.up.railway.app",
	emailAndPassword: {
		enabled: false,
	},
	socialProviders: {
        apple: { 
            clientId: process.env.APPLE_CLIENT_ID as string, 
            clientSecret: process.env.APPLE_CLIENT_SECRET as string,
        }, 
    },
    trustedOrigins: ["https://appleid.apple.com", "bbauman-notepad://"], 
	// Session config
	session: {
		cookieCache: {
			enabled: true,
			maxAge: 5 * 60,
		},
	},
	// Add your plugins here
	plugins: [
		bearer(),
		jwt({
			jwt: {
				audience: "convex",
				expirationTime: "7d",
			}
		}),
	],
	// DB config
	database: new Pool({
		connectionString: process.env.DATABASE_URL,
	}),
});
