import { getStore } from "@netlify/blobs";

const store = getStore("sehatak-data");

export default async (req) => {
  if (req.method !== "POST") {
    return Response.json(
      { message: "Method not allowed" },
      { status: 405 }
    );
  }

  try {
    const body = await req.json();

    const code = String(body.code || "")
      .trim()
      .toUpperCase();

    if (!code) {
      return Response.json(
        { message: "أدخل رمز الوصول." },
        { status: 400 }
      );
    }

    const customer = await store.get(
      `code:${code}`,
      { type: "json" }
    );

    if (!customer) {
      return Response.json(
        { message: "رمز الوصول غير صحيح." },
        { status: 401 }
      );
    }

    if (customer.active !== true) {
      return Response.json(
        { message: "هذا الرمز غير فعال." },
        { status: 403 }
      );
    }

    return Response.json({
      valid: true
    });

  } catch (error) {
    console.error(error);

    return Response.json(
      { message: "حدث خطأ في الخادم." },
      { status: 500 }
    );
  }
};
