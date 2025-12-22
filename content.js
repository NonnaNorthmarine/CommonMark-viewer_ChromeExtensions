// ライブラリの初期化 (CommonMark準拠モード)
const md = window.markdownit('commonmark');

// 元のテキスト（ChromeがMDを開いた時に生成するpreタグ）を取得
const rawContent = document.querySelector('pre');

if (rawContent) {
    const markdownText = rawContent.innerText;

    // 1. プレビュー用コンテナの作成
    const previewContainer = document.createElement('div');
    previewContainer.id = 'md-preview-container';
    previewContainer.innerHTML = md.render(markdownText);
    previewContainer.style.display = 'block'; // 初期状態はプレビュー
    document.body.appendChild(previewContainer);

    // 元のテキストは初期状態で非表示に
    rawContent.style.display = 'none';

    // 2. 切り替えボタンの作成
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'md-toggle-button';
    toggleBtn.innerText = 'Code View';
    document.body.appendChild(toggleBtn);

    // 3. 切り替えイベント
    toggleBtn.addEventListener('click', () => {
        const isPreview = previewContainer.style.display === 'block';
        if (isPreview) {
            previewContainer.style.display = 'none';
            rawContent.style.display = 'block';
            toggleBtn.innerText = 'Preview View';
        } else {
            previewContainer.style.display = 'block';
            rawContent.style.display = 'none';
            toggleBtn.innerText = 'Code View';
        }
    });
}