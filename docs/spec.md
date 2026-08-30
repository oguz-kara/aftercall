# AfterCall — Spec (v1, 2026-08-30)

Portfolyo projesi #3 (strateji: upwork-strategy Bölüm 04/11). Kozmetik
klinik için overflow + mesai dışı sesli resepsiyonist. Konum: ön masayı
DEĞİŞTİRMEZ — 4 çalıştan sonra ve kapanıştan sonra devralır (Bölüm 11 §3:
"ön masa korkusu" ve "Weave'i değiştirme" itirazlarının cevabı).

## Persona (kurgusal)

Velora Aesthetics — iki pratisyenli kozmetik klinik (`data/clinic.md`).
Tetik: koordinatör istifası + öğle/akşam saatlerinde kaçan aramalar;
Google Ads harcaması artarken randevu düz.

## Neden LiveKit / neden bu mimari

- LiveKit Build tier ücretsiz: 1.000 ajan-dakikası/ay + 1 ABD numarası +
  50 gelen dakika — **voice tarafı kartsız test edilebilir** (Anthropic'in
  aksine).
- Ses hattı: STT → LLM → TTS pipeline (starter'da hazır). LLM önce LiveKit
  Inference varsayılanıyla çalışır; Anthropic anahtarı gelince
  `@livekit/agents-plugin-anthropic` ile Claude'a geçilir (tek satır) —
  "Claude" kanıtı.
- **Ölçüm/mock stratejisi:** starter'ın `agent.test.ts` deseni — ajan
  METİN seviyesinde test edilir (ses yok, kredi yok): senaryo transkriptleri
  → beklenen tool çağrıları/refüzler. Acil-kelime test seti buradan ölçülür.

## Kapsam

**v1 — ajan çekirdeği (metin seviyesinde test edilebilir)**
- [ ] Instructions: `data/clinic.md`'den derlenen klinik bilgisi + overflow
      duruşu ("ön masa sabah dönecek")
- [ ] Tools: `check_availability` / `book_appointment` (v1: mock takvim —
      `data/out/appointments.json`; v2: Cal.com API), `take_message`,
      `emergency_transfer` (v1: kayıt + "transferring now" yanıtı)
- [ ] Acil kelime tespiti: clinic.md listesi → anında transfer yolu
- [ ] Çağrı kaydı: oturum transcript'i + sonuç (booked/message/escalated/
      info) → `data/out/calls.json`
- [x] `agent.test.ts` genişletmesi — **2026-08-30 GERÇEK koşu: 6/6 geçti**
      (LiveKit Inference, ücretsiz kota; Anthropic'siz): acil →
      emergencyTransfer tool çağrısı ✓, kesin fiyat reddi ✓, tıbbi tavsiye
      reddi ✓, grounding ✓; taban selamlama testi resepsiyonist personasına
      hizalandı. Senaryo seti 20+'ya genişletilecek (gerçek ölçüm raporu
      öncesi)
- [ ] AFTERCALL_MOCK gerekmez: metin testleri zaten modelsiz/ucuz koşar;
      LLM'li testler LiveKit Inference ücretsiz kotasıyla

**v2 — web + telefon**
- [ ] `web/` rebrand (ledger primitive dili) + `/calls` inceleme sayfası
      (transcript + sonuç + sabah raporu görünümü)
- [ ] LiveKit Cloud projesi + ücretsiz ABD numarası → gerçek telefon demosu
- [ ] Claude'a geçiş (`agents-plugin-anthropic`) — Anthropic kredisiyle
- [ ] Cal.com gerçek booking + SMS teyit (stub → gerçek)

**v3 — dashboard**
- [ ] Sabah raporu: dünkü çağrılar, sonuç dağılımı, kaçırılan → yakalanan

## Ölçüm protokolü

Metin-seviyesi senaryo seti (20+ senaryo): acil kelime tespit oranı,
"kesin fiyat vermeme" kural ihlali sayısı (hedef 0), booking akışı tamamlama
oranı; gerçek aramada: ilk yanıt süresi. Yalnız gerçek koşular README
"Measured"a girer.

## Portfolyo varlıkları (3 kart)

1. `/calls` sabah raporu ekranı (transcript'li)
2. Mimari: telefon → LiveKit → STT → Claude → tools (takvim/acil) → TTS
3. Loom: split-screen — telefon bir yanda, canlı transcript öbür yanda;
   acil senaryosunda warm transfer

## Attribution

livekit-examples/agent-starter-node@2045cc4 + agent-starter-react@46f51a6
(MIT, LICENSE'lar korundu). Kaynak repo'lar CLAUDE.md/AGENTS.md ile geliyor.
