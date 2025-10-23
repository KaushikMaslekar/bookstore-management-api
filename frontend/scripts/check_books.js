(async () => {
  try {
    const res = await fetch(
      "http://localhost:8080/api/books?page=0&size=10&sortBy=title&sortDir=asc",
      { method: "GET" }
    );
    console.log("STATUS:", res.status);
    const ct = res.headers.get("content-type") || "";
    if (ct.includes("application/json")) {
      const body = await res.json();
      console.log("BODY:", JSON.stringify(body, null, 2));
    } else {
      const text = await res.text();
      console.log("BODY (text):", text);
    }
  } catch (err) {
    console.error("FETCH ERROR:", err);
  }
})();
