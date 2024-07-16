import { account } from "@/src/lib/appwrite";
import { OAuthProvider } from "appwrite";


export const login =  () => {
 const session =account.createOAuth2Session(
    OAuthProvider.Google, // provider
    'https://example.com', // success (optional)
    'https://example.com', // failure (optional)
    [] // scopes (optional)
);

return session

}


