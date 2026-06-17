import { Gutter } from '@payloadcms/ui'
import React from 'react'

import './index.scss'

type BlockDoc = {
  name: string
  use: string
  place: string
  supports: string
  limits?: string
}

type Section = {
  title: string
  blocks: BlockDoc[]
}

// 區塊說明資料：彙整自各區塊設定，與後台欄位內的提示一致。
const sections: Section[] = [
  {
    title: '版面開場',
    blocks: [
      {
        name: '首頁主視覺（Hero）',
        use: '首頁最上方的滿版大圖輪播，每張圖搭配自己的標題、副標與按鈕，自動切換。',
        place: '首頁最頂端的開場橫幅。',
        supports: '多張輪播圖 ＋ 每張的主標題、副標題、按鈕文字與連結。',
        limits: '主標題 30 字、副標 60 字、按鈕文字 12 字；圖片建議寬度 1920px 以上、橫式、主體置中。',
      },
      {
        name: '內頁頁首（Page Header）',
        use: '內頁最上方的綠帶，顯示頁面大標題與英文小字。',
        place: '各內頁（如認識創照、服務）的最上方。',
        supports: '標題（必填）、英文眉標、背景照片（可不放，留空為純綠底）。',
        limits: '標題 20 字、英文眉標 24 字；背景照片建議寬度 1920px 以上、重點放右半邊。',
      },
      {
        name: '最新消息跑馬燈（News Ticker）',
        use: '一條自動向上輪播的最新消息列。',
        place: '首頁主視覺下方的消息列。',
        supports: '多則消息，每則含文字、可選連結、單獨的顯示開關。',
        limits: '每則消息 50 字（電腦版單行，過長會被切）。',
      },
    ],
  },
  {
    title: '圖文內容',
    blocks: [
      {
        name: '內文段落（Content）',
        use: '通用圖文段落，可放眉標、標題、內文，並選擇配一張圖或多張拼貼圖。',
        place: '各頁的文字／圖文說明區，例如品牌簡介、服務介紹。',
        supports: '眉標、標題、內文（可排版）、按鈕、單張配圖或多張拼貼圖、配圖位置。',
        limits: '眉標 24 字、標題 30 字、按鈕 12 字；單張配圖建議 768px 以上、拼貼每張 768px 以上接近 4:3。',
      },
      {
        name: '左右二欄（Two Column）',
        use: '圖文左右二欄，可切換標準二欄、大圖引言、引言卡、置中項目卡等版型。',
        place: '需要一張圖搭一段說明的段落，例如關於我們、課程模組。',
        supports: '版型、前導標題、眉標、主圖或斜疊雙圖、內文、按鈕、重點項目卡。',
        limits: '前導 60 字、標題 40 字、按鈕 12 字、項目標題 20 字、項目說明 80 字；圖片建議 768px 以上（大圖引言 1920px 以上）。',
      },
      {
        name: '內文圖片（Media Block）',
        use: '在文章或頁面內文中間插入一張圖片，圖片下方可顯示圖說。',
        place: '文章內文、段落之間需要配圖的地方。',
        supports: '一張圖片（圖說來自媒體庫該圖的說明欄）。',
        limits: '圖片建議寬度 1200px 以上。',
      },
      {
        name: '引言（Quote）',
        use: '置中放大的一句引言或推薦語，可搭配說話者圓形頭像與署名。',
        place: '關於我們、案例頁中想凸顯一句話的段落。',
        supports: '引言內容、出處署名、頭像照片。',
        limits: '引言 120 字、署名 30 字；頭像建議正方形、600px 以上。',
      },
      {
        name: '提示框（Banner）',
        use: '有底色與外框的醒目提示框，用來強調一段重要訊息。',
        place: '文章或頁面內文中，需要提醒、公告的地方。',
        supports: '樣式（資訊／提醒／錯誤／成功）＋提示文字。',
      },
    ],
  },
  {
    title: '特色與條列',
    blocks: [
      {
        name: '圖示特色卡（Icon Features）',
        use: '一排卡片並列呈現幾個功能、特色或服務，每張卡有圖示、標題、說明。',
        place: '服務介紹頁或首頁中段。',
        supports: '版型 ＋ 多張卡片（圖示、標題、說明）。',
        limits: '卡片標題 16 字、說明 60 字；圖示建議 SVG 或去背 PNG。',
      },
      {
        name: '編號特色（Numbered Features）',
        use: '帶 01／02／03 大序號的特色介紹，項目自動左右交錯排版。',
        place: '首頁或服務頁，依序介紹三項主要服務。',
        supports: '眉標 ＋ 多個項目（序號、標題、內文、圖片）。',
        limits: '眉標 24 字、序號 4 字、項目標題 24 字；圖片建議 768px 以上、接近 3:2。',
      },
      {
        name: '步驟流程（Steps）',
        use: '把一個流程拆成幾個步驟，橫向排列並用箭頭相連。',
        place: '服務流程、發展路徑說明，通常放 3 個步驟。',
        supports: '版型 ＋ 前導標題 ＋ 多個步驟（圖示、標題、說明）。',
        limits: '前導 30 字、步驟標題 16 字、說明 50 字；圖示建議 SVG 或去背 PNG。',
      },
      {
        name: '數字成果卡（Stats Cards）',
        use: '一排凸顯成果數字的卡片，例如服務家庭數、合作鄉鎮數。',
        place: '關於我們、成果影響力區段。',
        supports: '多張卡片（數值、說明、單位後綴）。',
        limits: '數值 8 字、說明 16 字、後綴 6 字。',
      },
      {
        name: '支柱色卡（Pillar Cards）',
        use: '四張高低交錯的直立色卡，呈現一套系統的幾大支柱。',
        place: '強調「四大面向／四大地圖」這類成體系內容。',
        supports: '眉標、標題、副標、導言 ＋ 卡片（標籤、圖示、主標、說明）。',
        limits: '眉標 30 字、標題 20 字、卡片標籤 10 字、說明 40 字；圖示建議 SVG 或去背 PNG。',
      },
      {
        name: '分頁切換（Tabs）',
        use: '用上方分頁按鈕切換不同內容面板，每面板有大圖、標題、內文、特色清單。',
        place: '內容較多、想分類呈現的頁面，例如課程地圖，最適合 4 個分頁。',
        supports: '標題、導言 ＋ 多個分頁（名稱、大圖、標籤、標題、內文、特色清單）。',
        limits: '標題 40 字、導言 80 字、分頁名稱 10 字；面板大圖建議 1075px 以上、接近 16:9。',
      },
      {
        name: '資訊圖（Infographic）',
        use: '用圖形化方式呈現現況痛點或多個面向，含兩圓數據、環形照片、菱形四圓三種樣式。',
        place: '想用視覺數據或圖解說明問題的段落，例如「我們看見的問題」。',
        supports: '樣式 ＋ 眉標／標題／內文 ＋ 各樣式的數據、照片或節點。',
        limits: '眉標 30 字、標題 30 字、節點標題 16 字；照片建議正方形 600px 以上、圖示建議 SVG 或去背 PNG。',
      },
    ],
  },
  {
    title: '行動呼籲',
    blocks: [
      {
        name: 'TA 導流磚卡（TA CTA）',
        use: '對不同對象的導流卡，可做三磚卡、照片連結卡、全幅照片帶或深底雙按鈕帶。',
        place: '頁面中段或頁尾，引導不同對象點進對應頁面。',
        supports: '版型 ＋ 導言 ＋ 多張卡片（插圖或照片、標語、按鈕文字、連結）。',
        limits: '導言 80 字、卡片標題 24 字、按鈕 12 字；三磚用 SVG 線稿、照片卡建議 768px 以上、全幅帶 1920px 以上。',
      },
      {
        name: '行動橫幅（CTA Banner）',
        use: '有底色的行動呼籲橫幅，帶主標、副標和一顆按鈕。',
        place: '頁面中段或結尾，引導聯絡或前往下一步。',
        supports: '主標（必填）、副標、按鈕（文字＋連結）、背景色四選一。',
        limits: '主標 30 字、副標 60 字、按鈕 12 字。',
      },
      {
        name: '圖文行動區（CTA）',
        use: '左側放一段可排版文字、右側放最多兩顆按鈕的行動呼籲。',
        place: '內容頁面中需要引導點擊的段落。',
        supports: '一段圖文 ＋ 最多兩顆按鈕。',
      },
      {
        name: '使命三圓（Mission Circles）',
        use: '使命三圓區塊，可做滿版照片底的宣言帶，或白底的行動三圓。',
        place: '關於我們的願景帶，或頁面收尾邀請行動的段落。',
        supports: '版型、標題、標語、背景照片 ＋ 三個圓（圓內文字、圓下說明）。',
        limits: '標題 24 字、標語 60 字、圓內 12 字、圓下說明 60 字；背景照片建議 1920px 以上。',
      },
    ],
  },
  {
    title: '列表與動態內容',
    blocks: [
      {
        name: '文章／報導卡（Article Cards）',
        use: '一組文章或報導卡片，可自動抓案例故事、媒體報導資料庫，也可手動填，支援載入更多。',
        place: '案例故事列表、媒體報導區段。',
        supports: '來源切換、版型、每批顯示數、載入更多 ＋ 手動卡片（圖、標題、摘要、連結）。',
        limits: '眉標 24 字、區塊標題 30 字、卡片標題 40 字、摘要 80 字；代表圖建議 1920px 以上、卡片圖 768px 以上接近 4:3。',
      },
      {
        name: '自動列表（Archive）',
        use: '自動把最新消息或文章列成一個列表區塊。',
        place: '首頁或內頁的「最新消息／文章列表」。',
        supports: '開頭文字、挑選方式、來源、分類、數量、手動指定文章。',
      },
      {
        name: '時間軸大事紀（Timeline）',
        use: '中央直線、左右交錯的時間軸，年份配綠色事件標籤。',
        place: '認識創照／關於頁的歷程區段。',
        supports: '手動輸入或引用大事紀資料庫；每筆含年份、標題、描述。',
        limits: '年份／日期 12 字、標題 24 字、描述 50 字。',
      },
      {
        name: '獲獎記錄（Awards）',
        use: '條列式獲獎記錄，左側清單搭配右側一張代表照片。',
        place: '關於我們、信任佐證區段。',
        supports: '手動輸入或引用獎項資料庫；每筆含年、月、名稱、別稱、照片。',
        limits: '名稱 40 字、別稱 20 字；代表照片建議 1920px 以上、橫式。',
      },
      {
        name: '合作夥伴牆（Logo Wall）',
        use: '並排顯示合作夥伴 Logo，可點擊連到對方網站。',
        place: '合作夥伴、支持單位區段。',
        supports: '夥伴資料庫或手動 ＋ 每筆含 Logo、名稱、連結。',
        limits: '夥伴類型 20 字、名稱 30 字；Logo 建議 SVG 或去背 PNG。',
      },
    ],
  },
  {
    title: '照片、地圖與影片',
    blocks: [
      {
        name: '照片帶（Photo Strip）',
        use: '把多張照片排成一條滿版的橫向照片帶。',
        place: '兩個內容區段之間做視覺串場。',
        supports: '橫向視差開關 ＋ 多張照片（每筆一張圖，必填）。',
        limits: '無文字欄位；每張建議寬度 1200px 以上、方向一致，會以接近 4:3 置中裁切。',
      },
      {
        name: '據點地圖（Map Locations）',
        use: '在一張地圖插畫上標出多個服務據點，搭配標題與說明。',
        place: '介紹服務範圍或培訓場域的區段。',
        supports: '眉標、標題、副標、內文 ＋ 地圖插畫 ＋ 據點清單（中文名、英文名）。',
        limits: '標題 24 字、副標 40 字、據點名 16 字；地圖插畫建議寬度 600px 以上、橫式（留空用內建地形圖）。圖釘依加入順序排列，不需填地址。',
      },
      {
        name: '影片（Video）',
        use: '滿版影片區，未播放時顯示封面與播放鈕，點擊後內嵌播放。',
        place: '首頁或品牌頁需要放一支形象影片的段落。',
        supports: '影片網址（YouTube 連結或 mp4 檔網址）＋封面圖。',
        limits: '封面圖建議 1920px 以上、接近 16:9。',
      },
    ],
  },
  {
    title: '進階',
    blocks: [
      {
        name: '程式碼（Code）',
        use: '給開發人員放程式碼或嵌入碼的技術性區塊，多數情況用不到。',
        place: '需要展示程式碼或貼嵌入碼的技術性頁面。',
        supports: '語言選單 ＋ 程式碼欄位。',
      },
    ],
  },
]

const AdminGuide: React.FC = () => {
  return (
    <Gutter className="cms-guide">
      <a className="cms-guide__back" href="/admin">
        ← 返回後台首頁
      </a>

      <h1 className="cms-guide__h1">網站內容管理使用說明</h1>
      <p className="cms-guide__lead">
        這份說明介紹後台怎麼操作、每個內容區塊的用途、適合放在哪裡、可以填什麼，以及建議的圖片尺寸與字數。編輯時，每個欄位下方也都會看到對應的提示。
      </p>

      <section className="cms-guide__section">
        <h2 className="cms-guide__h2">基本操作流程</h2>
        <ol className="cms-guide__steps">
          <li>從左側選單選擇要編輯的內容，例如「Pages（頁面）」。</li>
          <li>點開一筆頁面，在「Content」分頁裡用「區塊」一塊一塊組合版面。</li>
          <li>每個區塊都可以拖曳調整上下順序，點區塊標題可以收合。</li>
          <li>右側會即時顯示「預覽」，可切換手機／平板／電腦三種尺寸檢視。</li>
          <li>編輯時系統會自動存成草稿，確認沒問題後再按「Publish（發布）」才會更新到網站。</li>
        </ol>
      </section>

      <section className="cms-guide__section">
        <h2 className="cms-guide__h2">中英雙語</h2>
        <p>
          內容支援繁體中文與英文。編輯畫面上方可以切換語言，分別填寫兩種語系的文字；圖片與版面共用，文字各自獨立。
        </p>
      </section>

      <section className="cms-guide__section">
        <h2 className="cms-guide__h2">顯示或隱藏一個區塊</h2>
        <p>
          每個區塊最上方都有一個「在網站上顯示此區塊」的勾選框。取消勾選就會在網站上隱藏這個區塊，內容仍然保留，隨時可以再次勾選顯示——不需要把整個區塊刪掉。
        </p>
      </section>

      <section className="cms-guide__section">
        <h2 className="cms-guide__h2">發布前先預覽</h2>
        <p>
          編輯頁面時，右側的即時預覽會同步呈現實際畫面，也可以存成草稿先不上線。確認無誤後按「發布」才會更新到正式網站；之後若想改回舊版本，系統也保留了過去的版本記錄。
        </p>
      </section>

      <section className="cms-guide__section">
        <h2 className="cms-guide__h2">圖片建議尺寸總覽</h2>
        <p className="cms-guide__note">
          每個位置只要上傳一張圖就好。系統會自動為平板、手機產生較小的尺寸，不需要另外準備多張。建議「上傳大一點」比較清晰，系統不會因為檔案大而變慢。下表的「電腦／平板／手機顯示」是實際呈現的大約寬度，數字為近似值，會依版面而略有不同。
        </p>
        <table className="cms-guide__table">
          <thead>
            <tr>
              <th>用途</th>
              <th>建議上傳（一張）</th>
              <th>電腦顯示</th>
              <th>平板顯示</th>
              <th>手機顯示</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>滿版主視覺、背景大圖</td>
              <td>寬 ≥ 2400px，橫式</td>
              <td>~1920px</td>
              <td>~1024px</td>
              <td>~430px</td>
            </tr>
            <tr>
              <td>卡片、列表縮圖</td>
              <td>寬 ≥ 1000px，接近 4:3</td>
              <td>~420px</td>
              <td>~340px</td>
              <td>滿寬</td>
            </tr>
            <tr>
              <td>內文圖片、照片帶</td>
              <td>寬 ≥ 1600px</td>
              <td>~860px</td>
              <td>~700px</td>
              <td>滿寬</td>
            </tr>
            <tr>
              <td>人物大頭照</td>
              <td>正方形 ≥ 800px</td>
              <td>~200px</td>
              <td>~200px</td>
              <td>~120px</td>
            </tr>
            <tr>
              <td>Logo、圖示</td>
              <td>SVG 或去背 PNG</td>
              <td colSpan={3}>向量／去背圖，各尺寸自動適應</td>
            </tr>
          </tbody>
        </table>
        <p className="cms-guide__note">
          注意：滿版主視覺、背景大圖、照片帶這類「整片填滿」的圖片，在手機上畫面會變窄變高，左右兩側可能被裁掉。請把重要的人或字放在畫面中央，邊緣多留一些空間。
        </p>
      </section>

      {sections.map((section) => (
        <section className="cms-guide__section" key={section.title}>
          <h2 className="cms-guide__h2">{section.title}</h2>
          <div className="cms-guide__cards">
            {section.blocks.map((block) => (
              <div className="cms-guide__card" key={block.name}>
                <h3 className="cms-guide__card-title">{block.name}</h3>
                <p className="cms-guide__row">
                  <span className="cms-guide__tag">用途</span>
                  {block.use}
                </p>
                <p className="cms-guide__row">
                  <span className="cms-guide__tag">適合放在</span>
                  {block.place}
                </p>
                <p className="cms-guide__row">
                  <span className="cms-guide__tag">可填內容</span>
                  {block.supports}
                </p>
                {block.limits ? (
                  <p className="cms-guide__row">
                    <span className="cms-guide__tag">尺寸／字數</span>
                    {block.limits}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ))}
    </Gutter>
  )
}

export default AdminGuide
