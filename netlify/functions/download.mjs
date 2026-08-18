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

    // رمز الدخول التجريبي
    if (code !== "SZ-78421") {
      return Response.json(
        { message: "رمز الوصول غير صحيح." },
        { status: 401 }
      );
    }

    // أول ملف نختبره
    if (
      gender === "men" &&
      location === "home" &&
      days === 3
    ) {
      return Response.json({
        success: true,
        url: "/files/men_home_3.pdf"
      });
    }

    return Response.json(
      {
        message:
          "هذا البرنامج غير مضاف حاليًا."
      },
      { status: 404 }
    );

  } catch (error) {
    return Response.json(
      { message: "حدث خطأ في الخادم." },
      { status: 500 }
    );
  }
};
