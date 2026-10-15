const ads = [
  { "Ad ID": "A101", "Brand Name": "Nike", "Clicks": 120, "Conversions": 24, "Reputation": 90, "Famous Brand": "Yes", "Ad Status": "Trusted Ad" },
  { "Ad ID": "A102", "Brand Name": "Unknown Brand", "Clicks": 90, "Conversions": 8, "Reputation": 40, "Famous Brand": "No", "Ad Status": "Fake Ad" },
  { "Ad ID": "A103", "Brand Name": "Apple", "Clicks": 250, "Conversions": 65, "Reputation": 95, "Famous Brand": "Yes", "Ad Status": "Trusted Ad" },
  { "Ad ID": "A104", "Brand Name": "Unknown Brand", "Clicks": 30, "Conversions": 2, "Reputation": 25, "Famous Brand": "No", "Ad Status": "Fake Ad" }
];

// Add your deployed API Gateway /ask endpoint here when ready.
const API_URL = "";

function renderRows(data) {
  const tbody = document.getElementById("results");
  tbody.replaceChildren();

  data.forEach(ad => {
    const tr = document.createElement("tr");
    ["Ad ID", "Brand Name", "Clicks", "Conversions", "Reputation", "Famous Brand", "Ad Status"].forEach(key => {
      const td = document.createElement("td");
      td.textContent = ad[key] ?? "";
      if (key === "Ad Status") {
        td.className = "status " +
          (String(ad[key]).toLowerCase().includes("trusted") ? "trusted" : "fake");
      }
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });

  document.getElementById("total").textContent = data.length;
  document.getElementById("trusted").textContent =
    data.filter(x => String(x["Ad Status"]).toLowerCase().includes("trusted")).length;
  document.getElementById("fake").textContent =
    data.filter(x => String(x["Ad Status"]).toLowerCase().includes("fake")).length;
}

function loadDemo() {
  renderRows(ads);
  document.getElementById("message").textContent =
    "Sample results displayed. Live AWS connection has not been configured yet.";
}

async function loadLive() {
  if (!API_URL) {
    document.getElementById("message").textContent =
      "Add your deployed API Gateway /ask URL in app.js to enable live results.";
    return;
  }

  try {
    document.getElementById("message").textContent = "Loading results from AWS...";
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({})
    });
    if (!response.ok) throw new Error("HTTP " + response.status);

    const result = await response.json();
    const payload = typeof result.body === "string" ? JSON.parse(result.body) : result.body;
    if (payload && Array.isArray(payload.results)) {
      renderRows(payload.results);
      document.getElementById("message").textContent =
        "Live results loaded from AWS.";
    } else {
      throw new Error("API response did not contain a results array.");
    }
  } catch (error) {
    document.getElementById("message").textContent =
      "Could not load live results: " + error.message +
      ". Check API URL, CORS, and API deployment.";
  }
}

function downloadCSV() {
  const rows = [...document.querySelectorAll("table tr")];
  const csv = rows.map(row =>
    [...row.querySelectorAll("th, td")].map(cell =>
      '"' + cell.innerText.replace(/"/g, '""') + '"'
    ).join(",")
  ).join("\r\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "ad_detection_result.csv";
  a.click();
  URL.revokeObjectURL(url);
}

loadDemo();
