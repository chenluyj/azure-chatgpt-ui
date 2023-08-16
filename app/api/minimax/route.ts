import { createParser } from "eventsource-parser";
import { NextRequest } from "next/server";
import { requestMinimax } from "../common";
import { log } from "console";
import { connect } from "http2";

async function createStream(req: NextRequest) {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const res = await requestMinimax(req);

  const contentType = res.headers.get("Content-Type") ?? "";

  console.log('contentType',contentType)

  const content = await (
    await res.text()
  ).replace(/provided:.*. You/, "provided: ***. You");
  const reply = JSON.parse(content).reply;
  // 使用TextEncoder将字符串编码为Uint8Array
  const textEncoder = new TextEncoder();
  const requestBodyData = textEncoder.encode(reply);

  // 将Uint8Array数据创建为可读流
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(requestBodyData);
      controller.close();
    }
  });
  return stream;
}

export async function POST(req: NextRequest) {
  console.log('minimax post')
  try {
    const stream = await createStream(req);
    return new Response(stream);
  } catch (error) {
    console.error("[Chat Stream]", error);
    return new Response(
      ["```json\n", JSON.stringify(error, null, "  "), "\n```"].join(""),
    );
  }
}

export const config = {
  runtime: "edge",
};