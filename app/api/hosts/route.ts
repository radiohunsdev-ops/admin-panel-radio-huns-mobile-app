import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Host from "@/models/host";

// GET ALL HOSTS
export async function GET() {
  try {
    await connectDB();

    const hosts = await Host.find().sort({
      createdAt: -1,
    });

    return NextResponse.json({
      success: true,
      count: hosts.length,
      data: hosts,
    });
  } catch (error) {
    console.error("GET Hosts Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch hosts",
      },
      {
        status: 500,
      }
    );
  }
}

// CREATE HOST
export async function POST(
  request: NextRequest
) {
  try {
    await connectDB();

    const body = await request.json();

    const host = await Host.create({
      fullName: body.fullName,
      bio: body.bio || "",
      profileImage:
        body.profileImage || "",
      coverImage:
        body.coverImage || "",
      email: body.email || "",
      phone: body.phone || "",
      city: body.city || "",
      languages:
        body.languages || [],
      specialties:
        body.specialties || [],
      socialLinks: {
        instagram:
          body.socialLinks
            ?.instagram || "",
        facebook:
          body.socialLinks
            ?.facebook || "",
        twitter:
          body.socialLinks
            ?.twitter || "",
        youtube:
          body.socialLinks
            ?.youtube || "",
        website:
          body.socialLinks
            ?.website || "",
      },
      isFeatured:
        body.isFeatured || false,
      isActive:
        body.isActive ?? true,
    });

    return NextResponse.json(
      {
        success: true,
        message:
          "Host created successfully",
        data: host,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "CREATE Host Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create host",
      },
      {
        status: 500,
      }
    );
  }
}