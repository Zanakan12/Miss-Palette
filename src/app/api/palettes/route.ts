import { NextResponse } from "next/server";
import { PrismaClient, Palette } from "@prisma/client";

const prisma = new PrismaClient();

type PaletteRow = Palette & { colors: string };

export async function GET() {
  try {
    const palettes = await prisma.palette.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    const data = palettes.map((p: PaletteRow) => ({
      id: p.id,
      name: p.name ?? undefined,
      colors: JSON.parse(p.colors) as string[],
    }));
    return NextResponse.json(data);
  } catch (e) {
    console.error("GET /api/palettes error:", e);
    return new NextResponse("Database not available", { status: 503 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      id?: string;
      name?: string;
      colors: string[];
    };
    const id = body.id ?? `user-${Date.now()}`;
    await prisma.palette.create({
      data: {
        id,
        name: body.name ?? null,
        colors: JSON.stringify(body.colors),
      },
    });
    return new NextResponse(null, { status: 201 });
  } catch (e) {
    console.error("POST /api/palettes error:", e);
    return new NextResponse("Could not save", { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    if (!id) return new NextResponse("Missing id", { status: 400 });
    await prisma.palette.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (e) {
    console.error("DELETE /api/palettes error:", e);
    return new NextResponse("Could not delete", { status: 500 });
  }
}
