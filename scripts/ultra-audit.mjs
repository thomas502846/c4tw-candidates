import { chromium } from '@playwright/test';
import fs from 'fs';

const BASE = process.env.BASE || 'http://52.78.36.24';
const OUT = 'docs/review-20260612';
const pages = ['home','about','care','training','school','contact'];
const pathFor = { home:'/', about:'/about', care:'/care', training:'/training', school:'/school', contact:'/contact' };
// breakpoints for overflow/screenshot: 375 / 768 / 1440 ; images checked at 1440 desktop + 390 mobile
const bps = [ {name:'375', w:375, h:812}, {name:'768', w:768, h:1024}, {name:'1440', w:1440, h:900} ];
const imgBps = [ {name:'1440', w:1440, h:900}, {name:'390', w:390, h:844} ];

async function autoScroll(page){
  await page.evaluate(async () => {
    await new Promise(res => {
      let y=0; const step=()=>{ window.scrollBy(0, 600); y+=600;
        if (y < document.body.scrollHeight + 1200) setTimeout(step, 120); else res(); };
      step();
    });
  });
  await page.waitForTimeout(800);
  await page.evaluate(()=>window.scrollTo(0,0));
  await page.waitForTimeout(400);
}

const report = { images:{}, fonts:{}, overflow:{}, anim:{} };

const browser = await chromium.launch({ args:['--no-sandbox'] });

for (const p of pages){
  const url = BASE + pathFor[p];

  // ---- OVERFLOW + SCREENSHOT across 375/768/1440 ----
  for (const bp of bps){
    const ctx = await browser.newContext({ viewport:{width:bp.w,height:bp.h}, deviceScaleFactor:1 });
    const page = await ctx.newPage();
    await page.goto(url, { waitUntil:'networkidle', timeout:60000 }).catch(()=>{});
    await autoScroll(page);
    const ov = await page.evaluate((vw) => {
      const docW = document.documentElement.scrollWidth;
      const offenders = [];
      const all = document.querySelectorAll('*');
      for (const el of all){
        const r = el.getBoundingClientRect();
        if (r.right > vw + 2 && r.width > 4 && r.width <= vw*3){
          const tag = el.tagName.toLowerCase();
          const cls = (el.className && el.className.toString().slice(0,40))||'';
          offenders.push({ tag, cls, right: Math.round(r.right), w: Math.round(r.width) });
        }
      }
      // dedupe by tag+cls keep worst
      const seen={}; for(const o of offenders){ const k=o.tag+'|'+o.cls; if(!seen[k]||o.right>seen[k].right) seen[k]=o; }
      return { docW, vw, overflow: docW > vw + 2, offenders: Object.values(seen).sort((a,b)=>b.right-a.right).slice(0,6) };
    }, bp.w);
    report.overflow[`${p}-${bp.name}`] = ov;
    await page.screenshot({ path: `${OUT}/ultra-${p}-${bp.name}.png`, fullPage: true }).catch(async()=>{
      await page.screenshot({ path: `${OUT}/ultra-${p}-${bp.name}.png` });
    });
    await ctx.close();
  }

  // ---- IMAGES: desktop 1440 + mobile 390 ----
  for (const bp of imgBps){
    const ctx = await browser.newContext({ viewport:{width:bp.w,height:bp.h}, deviceScaleFactor:1 });
    const page = await ctx.newPage();
    await page.goto(url, { waitUntil:'networkidle', timeout:60000 }).catch(()=>{});
    await autoScroll(page);
    const imgs = await page.evaluate(() => {
      const out = { total:0, broken:[], zero:[] };
      const list = Array.from(document.images);
      out.total = list.length;
      for (const im of list){
        const src = (im.currentSrc||im.src||'').slice(-60);
        if (!im.complete || im.naturalWidth === 0){
          // ignore intentionally empty/placeholder data uris
          if (im.naturalWidth===0 && (im.src==='' )) continue;
          out.broken.push({ src, nW: im.naturalWidth, dispW: Math.round(im.getBoundingClientRect().width) });
        }
      }
      // CSS background-images
      const bgBroken=[];
      return { ...out, bgBroken };
    });
    report.images[`${p}-${bp.name}`] = imgs;
    await ctx.close();
  }

  // ---- FONTS: key text nodes at 1440 ----
  {
    const ctx = await browser.newContext({ viewport:{width:1440,height:900} });
    const page = await ctx.newPage();
    await page.goto(url, { waitUntil:'networkidle', timeout:60000 }).catch(()=>{});
    await page.waitForTimeout(600);
    const fonts = await page.evaluate(() => {
      function probe(el){
        if(!el) return null;
        const cs = getComputedStyle(el);
        return {
          text: (el.textContent||'').trim().slice(0,24),
          family: cs.fontFamily.split(',')[0].replace(/["']/g,''),
          weight: cs.fontWeight,
          size: parseFloat(cs.fontSize),
          lh: cs.lineHeight,
          ls: cs.letterSpacing,
        };
      }
      // grab h1,h2,h3 and a few representative nodes
      const picks=[];
      for (const sel of ['h1','h2','h3','h4']){
        const el = document.querySelector(sel);
        if (el) picks.push({ sel, ...probe(el) });
      }
      // first paragraph-ish body text
      const p = Array.from(document.querySelectorAll('p')).find(e=>(e.textContent||'').trim().length>20);
      if (p) picks.push({ sel:'p', ...probe(p) });
      return picks;
    });
    report.fonts[p] = fonts;
    await ctx.close();
  }
}

// ---- ANIMATION: ScrollReveal mid-state on mobile, non-reduced ----
{
  const ctx = await browser.newContext({ viewport:{width:390,height:844}, reducedMotion:'no-preference' });
  const page = await ctx.newPage();
  await page.goto(BASE + '/about', { waitUntil:'networkidle', timeout:60000 }).catch(()=>{});
  // sample opacity of reveal elements over time while scrolling slowly
  const samples = await page.evaluate(async () => {
    const els = Array.from(document.querySelectorAll('[class*="reveal"],[data-reveal],[style*="opacity"]')).slice(0,40);
    // fallback: any element starting hidden
    const tracked = els.length ? els : Array.from(document.querySelectorAll('section *')).slice(0,40);
    const seenMid = new Set();
    let midCount = 0, anyHidden=0;
    for (let s=0; s<14; s++){
      window.scrollBy(0, 220);
      await new Promise(r=>setTimeout(r, 90));
      for (let i=0;i<tracked.length;i++){
        const o = parseFloat(getComputedStyle(tracked[i]).opacity);
        if (o === 0) anyHidden++;
        if (o > 0.02 && o < 0.98 && !seenMid.has(i)){ seenMid.add(i); midCount++; }
      }
    }
    return { tracked: tracked.length, midCount, anyHidden };
  });
  report.anim.about = samples;
  await ctx.close();
}

// hero/news rotation check on home
{
  const ctx = await browser.newContext({ viewport:{width:1440,height:900} });
  const page = await ctx.newPage();
  await page.goto(BASE + '/', { waitUntil:'networkidle', timeout:60000 }).catch(()=>{});
  const heroNews = await page.evaluate(async () => {
    // capture hero slide indicator / news ticker movement
    function grab(sel){ const e=document.querySelector(sel); return e?e.getBoundingClientRect().top:null; }
    const hero1 = document.querySelector('[class*="hero"],[class*="Hero"]')?.textContent?.slice(0,30)||null;
    const news1 = document.querySelector('[class*="news"],[class*="News"],[class*="ticker"],[class*="Ticker"]')?.textContent?.slice(0,30)||null;
    await new Promise(r=>setTimeout(r, 4500));
    const hero2 = document.querySelector('[class*="hero"],[class*="Hero"]')?.textContent?.slice(0,30)||null;
    const news2 = document.querySelector('[class*="news"],[class*="News"],[class*="ticker"],[class*="Ticker"]')?.textContent?.slice(0,30)||null;
    return { heroChanged: hero1!==hero2, newsChanged: news1!==news2, hero1, hero2, news1, news2 };
  });
  report.anim.home = heroNews;
  await ctx.close();
}

await browser.close();
fs.writeFileSync(`${OUT}/ultra-audit.json`, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
