import { Account, Avatars, Client, OAuthProvider } from "react-native-appwrite"
import * as Linking from 'expo-linking';
import { openAuthSessionAsync } from "expo-web-browser";

export const config ={
    platform:'com.jsm.restate', // nama bebas
    endpoint:process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
    projectId:process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
}

export const client = new Client();

client
  .setEndpoint(config.endpoint!)
  .setProject(config.projectId!)
  .setPlatform(config.platform!)

export const avatar = new Avatars(client); //generate image ava from appwrite
export const account = new Account(client); //react native appwrite
export async function login() {
    console.log('Login function called'); // Tambahkan log
    try {
        console.log('Creating redirect URI'); // Log tambahan
        const redirectUri = Linking.createURL('/');
        console.log('Redirect URI:', redirectUri);

        console.log('Creating OAuth2 Token');
        const response = await account.createOAuth2Token(
            OAuthProvider.Google,
            redirectUri
        );

        console.log('OAuth2 Token Response:', response);

        if (!response) {
            console.error('Failed to get OAuth Token');
            throw new Error('Failed to Login');
        }

        console.log('Opening Auth Session');
        const browserResult = await openAuthSessionAsync(
            response.toString(),
            redirectUri
        );

        console.log('Browser Result:', browserResult);

        if (browserResult.type !== "success") {
            console.error('Browser login failed');
            throw new Error('Failed To Login');
        }

        const url = new URL(browserResult.url);

        const secret = url.searchParams.get("secret")?.toString();
        const userId = url.searchParams.get("userId")?.toString();

        console.log('Secret:', secret);
        console.log('UserId:', userId);

        if (!secret || !userId) {
            console.error('No secret or userId');
            throw new Error('User Tidak Tersedia!');
        }

        console.log('Creating Session');
        const session = await account.createSession(userId, secret);

        console.log('Session created:', session);

        return true;

    } catch (error) {
        console.error('Login Error:', error);
        // Tambahkan log detail error
        if (error instanceof Error) {
            console.error('Error Name:', error.name);
            console.error('Error Message:', error.message);
            console.error('Error Stack:', error.stack);
        }
        return false;
    }
}


export async function logout(){
    try{
    await account.deleteSession("current");
    return true;

    }catch(error){
        console.error(error);
        return false;
    }
}

export async function getUser(){
    try{
        const response = await account.get()

        if (response.$id){ 
            const userAvatar = avatar.getInitials(response.name); // fetch dari appwrite

            return {
                ...response, 
                avatar:userAvatar.toString(),
            }
        }
    }catch(error){
        console.error(error);
        return null;
    }
}