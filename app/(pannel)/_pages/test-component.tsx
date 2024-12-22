"use client"

import { FileUploader } from "@/components/globals/file-uploader";
import { UploadButton, UploadDropzone } from "@/lib/uploadthing";

export const TestComponent = () => {
    return (
        <div>
            <main className="flex min-h-screen flex-col items-center justify-between p-24">
                {/* <UploadButton
                    endpoint="singleImage"
                    onClientUploadComplete={(res) => {
                        // Do something with the response
                        console.log("Files: ", res);
                        alert("Upload Completed");
                    }}
                    onUploadError={(error: Error) => {
                        // Do something with the error.
                        alert(`ERROR! ${error.message}`);
                    }}
                /> */}
                {/* <UploadDropzone 
                    endpoint='multipleImage'
                    appearance={{
                        container: "border-2 border-slate-500 py-4 px-4"
                    }}
                    onClientUploadComplete={(res) => {
                        // Do something with the response
                        console.log("Files: ", res);
                        alert("Upload Completed");
                    }}

                /> */}
            </main>
            <FileUploader multiple onMultipleChange={(data) => console.log(data)}  />
        </div>
    )
}