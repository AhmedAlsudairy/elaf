import { Client, Account } from 'appwrite';

export const appwriteconfig = {
endpoint:process.env.ENDPOINT,
projectId:process.env.PROJECT_ID


}


export const client = new Client();

client
    .setEndpoint( appwriteconfig.endpoint||"")
    .setProject(appwriteconfig.projectId||""); // Replace with your project ID

export const account = new Account(client);

export { ID } from 'appwrite';