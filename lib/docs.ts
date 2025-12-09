import { google } from "googleapis";

const scopes = ["https://www.googleapis.com/auth/documents.readonly"];

const auth = new google.auth.JWT({
	email: process.env.CLIENT_EMAIL,
	key: atob(process.env.PRIVATE_KEY!),
	scopes
});

export const getGoogleDocs = () => google.docs({version: 'v1', auth});
export const accessToken = () => auth.getAccessToken();
