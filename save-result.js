const fallbackDatabaseUrl = "https://help-for-study-default-rtdb.firebaseio.com/";

module.exports = async function handler(req, res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "POST 요청만 사용할 수 있습니다." });
  }

  const result = req.body;
  const databaseUrl = process.env.FIREBASE_DATABASE_URL || fallbackDatabaseUrl;
  const baseUrl = databaseUrl.endsWith("/") ? databaseUrl.slice(0, -1) : databaseUrl;

  try {
    const response = await fetch(`${baseUrl}/studyReports.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(result)
    });

    if (!response.ok) {
      const detail = await response.text();
      throw new Error(`Firebase 오류 ${response.status}: ${detail.slice(0, 300)}`);
    }

    const data = await response.json();
    return res.status(200).json({ ok: true, firebaseKey: data.name });
  } catch (error) {
    console.error("save-result failed:", error);
    return res.status(500).json({
      ok: false,
      error: error.message || "Firebase Realtime Database 저장에 실패했습니다."
    });
  }
};
