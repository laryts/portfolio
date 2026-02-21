import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

const RESUME_FILENAME = "CV - Larissa Soares - Senior Software Engineer - 2026.pdf";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "public", RESUME_FILENAME);
    const buffer = await readFile(filePath);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${RESUME_FILENAME}"`,
        "Content-Length": String(buffer.length),
      },
    });
  } catch (error) {
    console.error("Error serving resume:", error);
    return NextResponse.json(
      { error: "Currículo não encontrado" },
      { status: 404 }
    );
  }
}
