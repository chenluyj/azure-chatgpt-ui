import { NextRequest, NextResponse } from "next/server";
import { ACCESS_CODES } from "./app/api/access";
import md5 from "spark-md5";

export const config = {
  matcher: ["/api/openai", "/api/chat-stream", "/api/minimax"],
};

export function middleware(req: NextRequest) {
  var url = req.url
  console.log('middleware url',url)
  if(url.includes(config.matcher[2])){
    return NextResponse.next({
      request: {
        headers: req.headers,
      },
    });
  }
  const accessCode = req.headers.get("access-code");
  const token = req.headers.get("token");
  const hashedCode = md5.hash(accessCode ?? "").trim();

  console.log("[Auth] allowed hashed codes: ", [...ACCESS_CODES]);
  console.log("[Auth] got access code:", accessCode);
  console.log("[Auth] hashed access code:", hashedCode);


  //Use access code to protect the connection
  if (ACCESS_CODES.size > 0 && !ACCESS_CODES.has(hashedCode) && !token) {
    return NextResponse.json(
      {
        error: true,
        needAccessCode: true,
        msg: "Please go settings page and fill your access code.",
      },
      {
        status: 401,
      },
    );
  }

  // inject api key
  if (!token) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey) {
      console.log("[Auth] set system token");
      req.headers.set("token", apiKey);
    } else {
      return NextResponse.json(
        {
          error: true,
          msg: "Empty Api Key",
        },
        {
          status: 401,
        },
      );
    }
  } else {
    console.log("[Auth] set user token");
  }

  return NextResponse.next({
    request: {
      headers: req.headers,
    },
  });
}
