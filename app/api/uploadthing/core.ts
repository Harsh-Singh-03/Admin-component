import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  // Uploader for a single image
  singleImage: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .onUploadComplete(async ({ metadata, file }) => {
      return file;
    }),

  multipleImage: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 5,
    },
  })
    .onUploadComplete(async ({ metadata, file }) => {
      return file;
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
