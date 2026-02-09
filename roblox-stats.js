// BASE URL — kendi sunucunda /api/rollup endpoint’i olmalı
const API_BASE = "https://ta-studios.com";

// JSON fetch helper
async function j(u) {
    const r = await fetch(u, { headers: { "accept": "application/json" } });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
}

// Roblox istatistik fonksiyonu
window.initRobloxStats = async (opts = {}) => {
    const { groupIds = [], universes = [], placeIds = [] } = opts;
    try {
        // URL oluştur
        const url = new URL("/api/rollup", API_BASE);
        if (placeIds.length) url.searchParams.set("placeIds", placeIds.join(","));
        if (groupIds.length) url.searchParams.set("groupIds", groupIds.join(","));
        if (universes.length) url.searchParams.set("universes", universes.join(","));

        // Veriyi çek
        const data = await j(url.href);

        // Sayıları Türkçe formatla
        const n = v => Number(v || 0).toLocaleString("tr-TR");

        // Toplam istatistikleri DOM’a yaz
        const gTotEl = document.getElementById("groupsTotal");
        if (gTotEl) gTotEl.textContent = n(data.groups?.totalMembers);

        const pTotEl = document.getElementById("gamesPlayingTotal");
        if (pTotEl) pTotEl.textContent = n(data.games?.totals?.playing);

        const vTotEl = document.getElementById("gamesVisitsTotal");
        if (vTotEl) vTotEl.textContent = n(data.games?.totals?.visits);

        // data-stat attribute’larına yaz
        const gTot = document.querySelector('[data-stat="group-total"]');
        if (gTot) gTot.textContent = n(data.groups?.totalMembers);

        const pTot = document.querySelector('[data-stat="games-total-playing"]');
        if (pTot) pTot.textContent = n(data.games?.totals?.playing);

        const vTot = document.querySelector('[data-stat="games-total-visits"]');
        if (vTot) vTot.textContent = n(data.games?.totals?.visits);

        // Tek tek grup istatistikleri
        document.querySelectorAll("[data-group-id]").forEach(el => {
            const id = el.getAttribute("data-group-id");
            const mc = data.groups?.byId?.[id]?.memberCount;
            if (mc != null) el.textContent = n(mc);
        });

        // Tek tek universe / oyun istatistikleri
        document.querySelectorAll("[data-universe-id]").forEach(el => {
            const id = el.getAttribute("data-universe-id");
            const type = el.getAttribute("data-stat-type") || "playing";
            const entry = data.games?.byId?.[id];
            if (!entry) return;
            const val = type === "visits" ? entry.visits : entry.playing;
            el.textContent = n(val);
        });
    } catch (e) {
        console.error("Roblox istatistik hatası:", e);
    }
};

// Sayfa DOM hazır olduğunda otomatik çalıştır
window.addEventListener("DOMContentLoaded", () => {
    initRobloxStats({
        groupIds: [341712681],   // kendi grup ID’lerini yaz
        universes: [89578655387785],  // kendi oyun/universe ID’lerini yaz
        placeIds: [89578655387785]    // varsa place ID’leri
    });
});