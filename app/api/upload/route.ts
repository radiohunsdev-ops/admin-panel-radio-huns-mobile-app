import { NextRequest, NextResponse } from "next/server";


import { UploadApiResponse } from "cloudinary";
import cloudinary from "@/lib/cloudinary";

export async function POST(
  req: NextRequest,
) {
  try {
    const formData =
      await req.formData();

    const file = formData.get(
      "file",
    ) as File;

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: "No file uploaded",
        },
        {
          status: 400,
        },
      );
    }

    const bytes =
      await file.arrayBuffer();

    const buffer =
      Buffer.from(bytes);

    const result: UploadApiResponse =
      await new Promise(
        (resolve, reject) => {
          const uploadStream =
            cloudinary.uploader.upload_stream(
              {
                folder: "live-radio",
              },

              (
                error,
                result,
              ) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(
                    result as UploadApiResponse,
                  );
                }
              },
            );

          uploadStream.end(buffer);
        },
      );

    return NextResponse.json({
      success: true,
      url: result.secure_url,
    });
  } catch (error) {
    console.error(
      "UPLOAD ERROR:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error: "Upload failed",
      },
      {
        status: 500,
      },
    );
  }
}