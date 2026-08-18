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

    // رمز الدخول
     if (code !== "MH-26-6") {
      return Response.json(
        { message: "رمز الوصول غير صحيح." },
        { status: 401 }
      );
    }

    // ربط الاختيارات بأسماء الملفات
    const files = {
      "men_home_3": "/files/men_home_3.pdf",
      "men_home_4": "/files/men_home_4.pdf",
      "men_home_5": "/files/men_home_5.pdf",

      "men_gym_3": "/files/men_gym_3.pdf",
      "men_gym_4": "/files/men_gym_4.pdf",
      "men_gym_5": "/files/men_gym_5.pdf",

      "women_home_3": "/files/women_home_3.pdf",
      "women_home_4": "/files/women_home_4.pdf",
      "women_home_5": "/files/women_home_5.pdf",

      "women_gym_3": "/files/women_gym_3.pdf",
      "women_gym_4": "/files/women_gym_4.pdf",
      "women_gym_5": "/files/women_gym_5.pdf"
    };

    const key = `${gender}_${location}_${days}`;
    const fileUrl = files[key];

    if (!fileUrl) {
      return Response.json(
        { message: "هذا البرنامج غير مضاف حاليًا." },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      url: fileUrl
    });

  } catch (error) {
    return Response.json(
      { message: "حدث خطأ في الخادم." },
      { status: 500 }
    );
  }
};
