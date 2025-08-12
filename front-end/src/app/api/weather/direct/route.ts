// API route lấy thông tin vị trí thời tiết theo thành phố
// /api/weather/direct?city=cityName
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city");

  if (!city) {
    return new Response(JSON.stringify({ error: "City is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${city},VN&limit=1&appid=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    // data là array, nếu không tìm thấy sẽ là []
    if (!Array.isArray(data) || data.length === 0) {
      return new Response(JSON.stringify({ error: "City not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(data[0]), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
