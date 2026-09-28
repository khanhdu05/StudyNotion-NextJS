import { NextResponse } from "next/server";
import { createClient } from "redis";

export async function GET() {
  const redisUrl = process.env.REDIS_URL;

  if (!redisUrl) {
    return NextResponse.json(
      { success: false, message: "REDIS_URL is not configured" },
      { status: 500 }
    );
  }

  const client = createClient({
    url: redisUrl,
  });

  try {
    await client.connect();

    await client.set(
      "studynotion:redis-test",
      "Redis connected successfully"
    );

    const value = await client.get("studynotion:redis-test");

    return NextResponse.json({
      success: true,
      message: "Next.js connected to Redis successfully",
      value,
    });
  } catch (error) {
    console.error("Redis error:", error);

    return NextResponse.json(
      { success: false, message: "Redis connection failed" },
      { status: 500 }
    );
  } finally {
    if (client.isOpen) {
      await client.quit();
    }
  }
}
