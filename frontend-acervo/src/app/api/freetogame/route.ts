// /app/api/freetogame/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch("https://www.freetogame.com/api/games");
    if (!response.ok) {
      return NextResponse.json(
        { error: "Erro ao buscar dados da API FreeToGame" },
        { status: response.status }
      );
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro no servidor ao buscar dados" },
      { status: 500 }
    );
  }
}
