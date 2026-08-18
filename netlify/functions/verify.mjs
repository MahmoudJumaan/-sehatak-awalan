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

     if (code !== "mh-26-6") {
      return Response.json(
        { message: "رمز الوصول غير صحيح." },
        { status: 401 }
      );
    }

    return Response.json({
      valid: true
    });

  } catch (error) {
    return Response.json(
      { message: "حدث خطأ في الخادم." },
      { status: 500 }
    );
  }
};
