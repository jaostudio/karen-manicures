import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { uploadImage, deleteImage } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const dataUri = `data:${file.type};base64,${buffer.toString("base64")}`;
    const result = await uploadImage(dataUri, "karen-manicures");

    await prisma.galleryImage.create({
      data: {
        url: result.url,
        publicId: result.publicId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    const image = await prisma.galleryImage.findUnique({ where: { id } });
    if (!image) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    await deleteImage(image.publicId);
    await prisma.galleryImage.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
