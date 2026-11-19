/* ============================================================
   精细 SVG 手机渲染图（按各品牌最新款真实外观特征绘制）
   每款含：机身、屏幕、屏幕特征、后置摄像头模组、品牌 logo 文字、侧边按钮
   ============================================================ */
export function phoneSVG(opts){
  const w=140,h=270;
  const body=opts.body||"#1c1c1e";
  const bodyHi=opts.bodyHi||shadeColor(body,25);
  const screen=opts.screen||"#000000";
  const accent=opts.accent||"#4cc2ff";
  const id=opts.id||"x";
  // 屏幕特征
  let feat="";
  if(opts.island){ // iPhone 灵动岛
    feat+=`<rect x="50" y="20" width="40" height="12" rx="6" fill="#000"/>`;
    feat+=`<circle cx="80" cy="26" r="2.5" fill="#0a1428"/>`;
  }
  if(opts.notch){ // iPhone 刘海
    feat+=`<path d="M54 18 Q70 14 86 18 L86 34 Q70 38 54 34 Z" fill="#000"/>`;
    feat+=`<circle cx="62" cy="26" r="3" fill="#1a1a2a"/><circle cx="74" cy="26" r="2" fill="#0a1a2a"/>`;
  }
  if(opts.hole){ // 居中打孔
    feat+=`<circle cx="70" cy="28" r="5" fill="#000"/><circle cx="70" cy="28" r="3" fill="#050510"/>`;
  }
  if(opts.holeLeft){ // 左上打孔
    feat+=`<circle cx="34" cy="28" r="5" fill="#000"/><circle cx="34" cy="28" r="3" fill="#050510"/>`;
  }
  // 后置摄像头模组（按品牌特征）
  let cam="";
  if(opts.cam==="appleSquare"){ // iPhone 三摄方阵（左上）
    cam=`<rect x="22" y="42" width="38" height="38" rx="10" fill="${shadeColor(body,-12)}" opacity="0.95"/>`;
    cam+=`<circle cx="33" cy="53" r="7" fill="#0a0a0a"/><circle cx="49" cy="53" r="7" fill="#0a0a0a"/><circle cx="41" cy="69" r="7" fill="#0a0a0a"/>`;
    cam+=`<circle cx="33" cy="53" r="3.5" fill="${accent}" opacity="0.4"/><circle cx="49" cy="53" r="3.5" fill="${accent}" opacity="0.4"/><circle cx="41" cy="69" r="3.5" fill="${accent}" opacity="0.4"/>`;
    cam+=`<circle cx="55" cy="70" r="2" fill="${accent}" opacity="0.6"/>`;
  }
  if(opts.cam==="huaweiRing"){ // 华为星环
    cam=`<circle cx="70" cy="120" r="34" fill="none" stroke="${shadeColor(body,-15)}" stroke-width="4" opacity="0.8"/>`;
    cam+=`<circle cx="70" cy="86" r="9" fill="#0a0a0a"/><circle cx="104" cy="120" r="9" fill="#0a0a0a"/><circle cx="70" cy="154" r="9" fill="#0a0a0a"/><circle cx="36" cy="120" r="9" fill="#0a0a0a"/>`;
    cam+=`<circle cx="70" cy="86" r="4.5" fill="${accent}" opacity="0.5"/><circle cx="104" cy="120" r="4.5" fill="${accent}" opacity="0.5"/>`;
  }
  if(opts.cam==="xiaiaoSquare"){ // 小米大圆角方块
    cam=`<rect x="22" y="44" width="42" height="52" rx="12" fill="${shadeColor(body,-12)}" opacity="0.9"/>`;
    cam+=`<circle cx="38" cy="58" r="8" fill="#0a0a0a"/><circle cx="54" cy="58" r="8" fill="#0a0a0a"/><circle cx="43" cy="78" r="9" fill="#0a0a0a"/>`;
    cam+=`<circle cx="38" cy="58" r="4" fill="${accent}" opacity="0.4"/>`;
  }
  if(opts.cam==="samsungVertical"){ // 三星竖排三摄
    cam=`<rect x="24" y="44" width="28" height="64" rx="12" fill="${shadeColor(body,-15)}" opacity="0.9"/>`;
    cam+=`<circle cx="38" cy="56" r="7" fill="#0a0a0a"/><circle cx="38" cy="76" r="7" fill="#0a0a0a"/><circle cx="38" cy="96" r="7" fill="#0a0a0a"/>`;
    cam+=`<circle cx="38" cy="56" r="3.5" fill="${accent}" opacity="0.4"/><circle cx="38" cy="76" r="3.5" fill="${accent}" opacity="0.4"/>`;
  }
  if(opts.cam==="circleBig"){ // OPPO/vivo 大圆环
    cam=`<circle cx="42" cy="120" r="26" fill="${shadeColor(body,-15)}" opacity="0.9"/>`;
    cam+=`<circle cx="42" cy="108" r="8" fill="#0a0a0a"/><circle cx="42" cy="132" r="8" fill="#0a0a0a"/>`;
    cam+=`<circle cx="42" cy="108" r="4" fill="${accent}" opacity="0.5"/>`;
  }
  if(opts.cam==="honorMuse"){ // 荣耀缪斯之眼
    cam=`<circle cx="70" cy="120" r="30" fill="${shadeColor(body,-15)}" opacity="0.85"/>`;
    cam+=`<circle cx="70" cy="120" r="22" fill="none" stroke="${shadeColor(body,-5)}" stroke-width="2"/>`;
    cam+=`<circle cx="70" cy="108" r="7" fill="#0a0a0a"/><circle cx="70" cy="132" r="7" fill="#0a0a0a"/>`;
  }
  if(opts.cam==="pixelBar"){ // 谷歌横向相机条
    cam=`<rect x="18" y="60" width="104" height="18" rx="9" fill="${shadeColor(body,-15)}" opacity="0.95"/>`;
    cam+=`<circle cx="38" cy="69" r="6" fill="#0a0a0a"/><circle cx="58" cy="69" r="6" fill="#0a0a0a"/><circle cx="78" cy="69" r="6" fill="#0a0a0a"/><circle cx="98" cy="69" r="6" fill="#0a0a0a"/>`;
    cam+=`<circle cx="38" cy="69" r="3" fill="${accent}" opacity="0.4"/>`;
  }
  if(opts.cam==="rogLogo"){ // ROG 败家之眼
    cam=`<text x="70" y="130" text-anchor="middle" font-size="22" font-weight="900" fill="${accent}" opacity="0.6" font-family="Arial">ROG</text>`;
  }
  if(opts.cam==="verticalDual"){ // 竖排双摄
    cam=`<rect x="32" y="50" width="20" height="40" rx="8" fill="${shadeColor(body,-12)}" opacity="0.9"/>`;
    cam+=`<circle cx="42" cy="60" r="6" fill="#0a0a0a"/><circle cx="42" cy="80" r="6" fill="#0a0a0a"/>`;
  }
  // 品牌 logo 文字（屏幕下方）
  const logo=opts.logo||"";
  const logoEl = logo?`<text x="70" y="248" text-anchor="middle" font-size="13" font-weight="800" fill="#fff" opacity="0.5" font-family="Arial,sans-serif">${logo}</text>`:"";
  // 侧边按钮
  const buttons=`<rect x="${w-3}" y="68" width="3" height="24" rx="1.5" fill="${bodyHi}"/><rect x="${w-3}" y="100" width="3" height="32" rx="1.5" fill="${bodyHi}"/><rect x="0" y="80" width="3" height="44" rx="1.5" fill="${bodyHi}"/>`;
  // 屏幕反光高光
  const highlight=`<path d="M18 22 Q40 18 40 50 L40 90 Q30 95 22 80 Z" fill="#fff" opacity="0.06"/>`;
  return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg${id}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${screen}"/><stop offset="1" stop-color="${opts.screen2||'#040408'}"/>
      </linearGradient>
      <linearGradient id="body${id}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${bodyHi}"/><stop offset="0.5" stop-color="${body}"/><stop offset="1" stop-color="${shadeColor(body,-15)}"/>
      </linearGradient>
    </defs>
    <rect x="8" y="8" width="${w-16}" height="${h-16}" rx="26" fill="url(#body${id})"/>
    <rect x="10" y="10" width="${w-20}" height="${h-20}" rx="24" fill="none" stroke="${bodyHi}" stroke-width="0.5" opacity="0.5"/>
    <rect x="13" y="16" width="${w-26}" height="${h-32}" rx="18" fill="url(#bg${id})"/>
    ${highlight}
    ${feat}
    ${cam}
    ${buttons}
    ${logoEl}
  </svg>`;
}

/* 颜色加深/变亮工具 */
export function shadeColor(hex,percent){
  hex=hex.replace('#','');
  let r=parseInt(hex.substr(0,2),16),g=parseInt(hex.substr(2,2),16),b=parseInt(hex.substr(4,2),16);
  r=Math.max(0,Math.min(255,r+Math.round(255*percent/100)));
  g=Math.max(0,Math.min(255,g+Math.round(255*percent/100)));
  b=Math.max(0,Math.min(255,b+Math.round(255*percent/100)));
  return '#'+r.toString(16).padStart(2,'0')+g.toString(16).padStart(2,'0')+b.toString(16).padStart(2,'0');
}