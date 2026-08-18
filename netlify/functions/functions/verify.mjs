export default async () => {
  return new Response(
    JSON.stringify({
      valid: true,
      message: "Function works"
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    }
  );
};
