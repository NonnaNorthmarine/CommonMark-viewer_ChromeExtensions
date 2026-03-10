// ライブラリの初期化 (CommonMark準拠モード)
const md = window.markdownit("commonmark");

// 元のテキスト（ChromeがMDを開いた時に生成するpreタグ）を取得
const rawContent = document.querySelector("pre");

if (rawContent) {
  const markdownText = rawContent.innerText;

  // 1. プレビュー用コンテナの作成
  const previewContainer = document.createElement("div");
  previewContainer.id = "md-preview-container";
  previewContainer.innerHTML = md.render(markdownText);
  previewContainer.style.display = "block"; // 初期状態はプレビュー
  document.body.appendChild(previewContainer);

  // 元のテキストは初期状態で非表示に
  rawContent.style.display = "none";

  // 2. 切り替えボタンの作成
  const toggleBtn = document.createElement("button");
  toggleBtn.id = "md-toggle-button";
  toggleBtn.innerText = "Code View";
  document.body.appendChild(toggleBtn);

  // 2.5 Printボタン（旧PDFボタン）の作成
  const pdfBtn = document.createElement("button");
  pdfBtn.id = "md-pdf-button";
  pdfBtn.innerText = "Print";
  document.body.appendChild(pdfBtn);

    // PDFボタンのイベント
    pdfBtn.addEventListener("click", () => {
        const isPreview = previewContainer.style.display === "block";
        if (!isPreview) {
            alert("PDF変換はプレビュー画面でのみ実行可能です。");
            return;
        }

        let basePath = window.location.pathname.split("/").pop() || "document";
        
        // ローカルファイルを開いた場合、URLがエンコードされている（%E3%83...など）ためデコードする
        try {
            basePath = decodeURIComponent(basePath);
        } catch (e) {
            console.warn("Filename decoding failed", e);
        }

        const rawFileName = document.title ? document.title : basePath;
        const fileName = rawFileName.replace(/\.md$/i, "").replace(/\.markdown$/i, "");

        // 印刷時のデフォルトファイル名をファイル名に揃えるため、一時的に title を変更
        const originalTitle = document.title;
        document.title = fileName;

        // ブラウザ標準の印刷ダイアログ（PDFに保存可能）を呼び出す
        window.print();

        // 印刷ダイアログが閉じられたら title を元に戻す
        document.title = originalTitle;
    });

  // 3. 切り替えイベント
  toggleBtn.addEventListener("click", () => {
    const isPreview = previewContainer.style.display === "block";
    if (isPreview) {
      previewContainer.style.display = "none";
      rawContent.style.display = "block";
      toggleBtn.innerText = "Preview View";
    } else {
      previewContainer.style.display = "block";
      rawContent.style.display = "none";
      toggleBtn.innerText = "Code View";
    }
  });
}
