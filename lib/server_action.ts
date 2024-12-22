"use server"

import axios from "axios";

/** Delete Files From Upload Thing */
export const DeleteFiles = async (files: string[]) => {
    try {
        const options = {
            method: 'POST',
            url: 'https://api.uploadthing.com/v6/deleteFiles',
            headers: { 'Content-Type': 'application/json', 'X-Uploadthing-Api-Key': process.env.UPLOADTHING_SECRET },
            data: { fileKeys: files }
        };
        const { data } = await axios.request(options);
        return { success: true, message: 'Files deleted successfully', data }

    } catch (error: any) {
        return { success: false, message: error?.message || 'An error occurred while deleting files' }
    }
}