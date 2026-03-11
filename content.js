// ライブラリの初期化 (CommonMark準拠モード)
const md = window.markdownit("commonmark");

// 元のテキスト（ChromeがMDを開いた時に生成するpreタグ）を取得
const rawContent = document.querySelector("pre");

const markdownText = rawContent ? rawContent.innerText : "";

// --- ダークモード対応 ---
// デフォルトでdark-modeをONにする
document.body.classList.add("dark-mode");

// 1. プレビュー用コンテナの作成
const previewContainer = document.createElement("div");
previewContainer.id = "md-preview-container";
previewContainer.innerHTML = md.render(markdownText);
previewContainer.style.display = "block"; // 初期状態はプレビュー
document.body.appendChild(previewContainer);

// 元のテキストは初期状態で非表示に
if (rawContent) {
  rawContent.style.display = "none";
}

// 1.5 編集可能なテキストエリア (エディタ) の作成
const editorArea = document.createElement("textarea");
editorArea.id = "md-editor";
editorArea.value = markdownText;
editorArea.style.display = "none"; // 初期状態はプレビューなので非表示
document.body.appendChild(editorArea);

// 2. 切り替えボタンの作成
const toggleBtn = document.createElement("button");
toggleBtn.id = "md-toggle-button";
toggleBtn.innerText = "Code";
document.body.appendChild(toggleBtn);

// 2.5 Printボタン（旧PDFボタン）の作成
const pdfBtn = document.createElement("button");
pdfBtn.id = "md-pdf-button";
pdfBtn.innerText = "Print";
document.body.appendChild(pdfBtn);

// 2.6 Downloadボタンの作成
const downloadBtn = document.createElement("button");
downloadBtn.id = "md-download-button";
downloadBtn.innerText = "Download";
document.body.appendChild(downloadBtn);

// 2.7 テーマ切り替え(太陽/月)ボタンの作成
const themeBtn = document.createElement("button");
themeBtn.id = "md-theme-toggle";
themeBtn.innerText = "🌙"; // 初期はダークモードなので月マーク
document.body.appendChild(themeBtn);

// PDFボタンのイベント
pdfBtn.addEventListener("click", () => {
  const isPreview = previewContainer.style.display === "block";
  if (!isPreview) {
    // もしCode画面だったら最新の内容でプレビューを更新してから印刷
    previewContainer.innerHTML = md.render(editorArea.value);
    previewContainer.style.display = "block";
    editorArea.style.display = "none";
    toggleBtn.innerText = "Code";
  }

  let basePath = window.location.pathname.split("/").pop() || "document";

  // ローカルファイルを開いた場合、URLがエンコードされている（%E3%83...など）ためデコードする
  try {
    basePath = decodeURIComponent(basePath);
  } catch (e) {
    console.warn("Filename decoding failed", e);
  }

  const rawFileName = document.title ? document.title : basePath;
  const fileName = rawFileName
    .replace(/\.md$/i, "")
    .replace(/\.markdown$/i, "");

  // 印刷時のデフォルトファイル名をファイル名に揃えるため、一時的に title を変更
  const originalTitle = document.title;
  document.title = fileName;

  // ブラウザ標準の印刷ダイアログ（PDFに保存可能）を呼び出す
  window.print();

  // 印刷ダイアログが閉じられたら title を元に戻す
  document.title = originalTitle;
});

// Downloadボタンのイベント
downloadBtn.addEventListener("click", () => {
  let basePath = window.location.pathname.split("/").pop() || "document";
  try {
    basePath = decodeURIComponent(basePath);
  } catch (e) {}

  const rawFileName = document.title ? document.title : basePath;
  const fileName =
    rawFileName.replace(/\.md$/i, "").replace(/\.markdown$/i, "") + ".md";

  // 最新のテキスト内容を取得
  const currentText = editorArea.value;
  const blob = new Blob([currentText], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();

  // クリーンアップ
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

// 3. 切り替えイベント
toggleBtn.addEventListener("click", () => {
  const isPreview = previewContainer.style.display === "block";
  if (isPreview) {
    // プレビュー画面からCode画面へ（エディタを表示）
    previewContainer.style.display = "none";
    editorArea.style.display = "block";
    toggleBtn.innerText = "Preview";
  } else {
    // Code画面からプレビュー画面へ（最新のテキストで再描画）
    previewContainer.innerHTML = md.render(editorArea.value);
    previewContainer.style.display = "block";
    editorArea.style.display = "none";
    toggleBtn.innerText = "Code";
  }
});

// 4. テーマ切り替えイベント
themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  themeBtn.innerText = isDark ? "🌙" : "☀️";
});
