import { getStore } from "@netlify/blobs";

const store = getStore("sehatak-data");

const allowedGenders = ["men", "women"];
const allowedLocations = ["home", "gym"];
const allowedDays = [3, 4, 5];

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

    const gender = String(body.gender || "");
    const location = String(body.location || "");
    const days = Number(body.days);

    if (!code) {
      return Response.json(
        { message: "رمز الوصول مطلوب." },
        { status: 400 }
      );
    }

    if (!allowedGenders.includes(gender)) {
      return Response.json(
        { message: "اختيار غير صالح." },
        { status: 400 }
      );
    }

    if (!allowedLocations.includes(location)) {
      return Response.json(
        { message: "اختيار غير صالح." },
        { status: 400 }
      );
    }

    if (!allowedDays.includes(days)) {
      return Response.json(
        { message: "اختيار غير صالح." },
        { status: 400 }
      );
    }

    const customer = await store.get(
      `code:${code}`,
      { type: "json" }
    );

    if (!customer || customer.active !== true) {
      return Response.json(
        { message: "رمز الوصول غير صحيح أو غير فعال." },
        { status: 403 }
      );
    }

    const fileKey =
      `pdf:${gender}_${location}_${days}`;

    const pdf = await store.get(
      fileKey,
      { type: "arrayBuffer" }
    );

    if (!pdf) {
      return Response.json(
        { message: "الملف غير موجود حاليًا." },
        { status: 404 }
      );
    }

    customer.lastDownload =
      new Date().toISOString();

    customer.downloads =
      Number(customer.downloads || 0) + 1;

    await store.setJSON(
      `code:${code}`,
      customer
    );

    return new Response(pdf, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition":
          `attachment; filename="${fileKey.replace("pdf:", "")}.pdf"`,
        "Cache-Control":
          "private, no-store, max-age=0"
      }
    });

  } catch (error) {
    console.error(error);

    return Response.json(
      { message: "حدث خطأ أثناء تجهيز الملف." },
      { status: 500 }
    );
  }
};
