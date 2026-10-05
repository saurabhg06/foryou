/* ============================================
   FOR YOU 🤍 — INTERACTIVE MYSTERY ENGINE
   Secret words, mystery orbs, gift boxes,
   lockboxes, typewriter, confetti, page nav
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {

    // ═══════ CURSOR GLOW ═══════
    const glow = document.getElementById('cursor-glow');
    let mx=0,my=0,gx=0,gy=0;
    document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;glow.classList.add('active');});
    (function ag(){gx+=(mx-gx)*.08;gy+=(my-gy)*.08;glow.style.left=gx+'px';glow.style.top=gy+'px';requestAnimationFrame(ag)})();
    if('ontouchstart' in window) glow.style.display='none';

    // ═══════ STARS ═══════
    const cvs=document.getElementById('stars-canvas'),ctx=cvs.getContext('2d');
    let stars=[],pts=[],shoots=[];
    function rCvs(){cvs.width=innerWidth;cvs.height=innerHeight}
    function iStars(){const n=Math.min(180,Math.floor(cvs.width*cvs.height/8000));stars=[];for(let i=0;i<n;i++)stars.push({x:Math.random()*cvs.width,y:Math.random()*cvs.height,r:Math.random()*1.3+.3,a:Math.random()*.5+.2,sp:Math.random()*.015+.005,ph:Math.random()*Math.PI*2});pts=[];for(let i=0;i<18;i++)pts.push({x:Math.random()*cvs.width,y:Math.random()*cvs.height,r:Math.random()*1.8+.5,a:Math.random()*.1+.03,vy:-(Math.random()*.2+.08),vx:(Math.random()-.5)*.12,c:Math.random()>.5?'212,165,116':'196,132,154'})}
    function shoot(){if(shoots.length>1)return;shoots.push({x:Math.random()*cvs.width*.6,y:Math.random()*cvs.height*.3,l:Math.random()*45+25,s:Math.random()*3+2,a:Math.PI/6+Math.random()*Math.PI/5,life:1})}
    function dCvs(t){ctx.clearRect(0,0,cvs.width,cvs.height);for(const s of stars){const tw=Math.sin(t*s.sp+s.ph);ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fillStyle=`rgba(240,235,227,${Math.max(0,s.a+tw*.2)})`;ctx.fill()}for(const p of pts){p.x+=p.vx;p.y+=p.vy;if(p.y<-10){p.y=cvs.height+10;p.x=Math.random()*cvs.width}if(p.x<-10)p.x=cvs.width+10;if(p.x>cvs.width+10)p.x=-10;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=`rgba(${p.c},${p.a})`;ctx.fill()}for(let i=shoots.length-1;i>=0;i--){const s=shoots[i];s.x+=Math.cos(s.a)*s.s;s.y+=Math.sin(s.a)*s.s;s.life-=.01;if(s.life<=0){shoots.splice(i,1);continue}const tx=s.x-Math.cos(s.a)*s.l,ty=s.y-Math.sin(s.a)*s.l;const g=ctx.createLinearGradient(tx,ty,s.x,s.y);g.addColorStop(0,'rgba(240,235,227,0)');g.addColorStop(1,`rgba(240,235,227,${s.life*.45})`);ctx.beginPath();ctx.moveTo(tx,ty);ctx.lineTo(s.x,s.y);ctx.strokeStyle=g;ctx.lineWidth=1.2;ctx.stroke()}requestAnimationFrame(dCvs)}
    rCvs();iStars();dCvs(0);setInterval(()=>{if(Math.random()>.45)shoot()},5000);addEventListener('resize',()=>{rCvs();iStars()});

    // ═══════ CONFETTI HEARTS ═══════
    const cCvs=document.getElementById('confetti-canvas'),cCtx=cCvs.getContext('2d');
    let conf=[],cRun=false;
    function rConf(){cCvs.width=innerWidth;cCvs.height=innerHeight}rConf();addEventListener('resize',rConf);
    function spawnConf(cx,cy,n){for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,sp=Math.random()*6+2;conf.push({x:cx,y:cy,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-3,sz:Math.random()*16+10,life:1,dc:Math.random()*.012+.006,rot:Math.random()*360,rs:(Math.random()-.5)*8,em:Math.random()>.3?'🤍':'✦'})}if(!cRun){cRun=true;aC()}}
    function aC(){cCtx.clearRect(0,0,cCvs.width,cCvs.height);for(let i=conf.length-1;i>=0;i--){const c=conf[i];c.x+=c.vx;c.y+=c.vy;c.vy+=.12;c.vx*=.99;c.life-=c.dc;c.rot+=c.rs;if(c.life<=0){conf.splice(i,1);continue}cCtx.save();cCtx.translate(c.x,c.y);cCtx.rotate(c.rot*Math.PI/180);cCtx.globalAlpha=c.life;cCtx.font=c.sz+'px sans-serif';cCtx.textAlign='center';cCtx.textBaseline='middle';cCtx.fillText(c.em,0,0);cCtx.restore()}if(conf.length>0)requestAnimationFrame(aC);else{cCtx.clearRect(0,0,cCvs.width,cCvs.height);cRun=false}}

    // ═══════ SECRET WORD POPUPS ═══════
    const popup = document.getElementById('secret-popup');
    const popupText = document.getElementById('secret-popup-text');
    let popupTimer = null;

    document.querySelectorAll('.secret-word').forEach(w => {
        w.addEventListener('click', (e) => {
            e.stopPropagation();
            const msg = w.dataset.msg;
            popupText.textContent = msg;
            const rect = w.getBoundingClientRect();
            popup.style.left = Math.min(rect.left, innerWidth - 300) + 'px';
            popup.style.top = (rect.bottom + 10) + 'px';
            popup.classList.add('show');
            // small confetti
            spawnConf(rect.left + rect.width/2, rect.top, 8);
            clearTimeout(popupTimer);
            popupTimer = setTimeout(() => popup.classList.remove('show'), 3500);
        });
    });
    document.addEventListener('click', () => { popup.classList.remove('show'); });

    // ═══════ PAGE NAVIGATION ═══════
    const pages = document.querySelectorAll('.page');
    const TOTAL = pages.length;
    let currentPage = 0, transitioning = false;
    const bottomNav=document.getElementById('bottom-nav'),navDots=document.getElementById('nav-dots'),navPrev=document.getElementById('nav-prev'),navNext=document.getElementById('nav-next'),navCur=document.getElementById('nav-cur'),navTotal=document.getElementById('nav-total'),ambientBtn=document.getElementById('ambient-toggle'),envBtn=document.getElementById('envelope-btn');
    navTotal.textContent = TOTAL - 1;

    // AMBIENT AUDIO SETUP
    const ambAu = document.getElementById('ambient-audio');
    const icOn = ambientBtn ? ambientBtn.querySelector('.ic-on') : null;
    const icOff = ambientBtn ? ambientBtn.querySelector('.ic-off') : null;
    let ambP = false;

    async function startAmbientAudio() {
        if (!ambAu) return;
        if (curA) {
            curA.pause();
            const p = curA.closest('.song-card');
            if (p) {
                p.classList.remove('playing');
                p.querySelector('.ic-play').style.display = '';
                p.querySelector('.ic-pause').style.display = 'none';
            }
            curA = null;
        }
        ambAu.volume = 0.3;
        try {
            await ambAu.play();
            if (icOn && icOff) {
                icOn.style.display = 'none';
                icOff.style.display = '';
            }
            ambP = true;
        } catch (err) {
            console.error('Ambient audio error:', err);
        }
    }

    function stopAmbientAudio() {
        if (!ambAu) return;
        ambAu.pause();
        if (icOn && icOff) {
            icOn.style.display = '';
            icOff.style.display = 'none';
        }
        ambP = false;
    }

    for(let i=1;i<TOTAL;i++){const d=document.createElement('div');d.className='nav-dot'+(i===1?' active':'');d.dataset.page=i;d.addEventListener('click',()=>goTo(i));navDots.appendChild(d)}
    const dots=navDots.querySelectorAll('.nav-dot');

    function updateNav(){navCur.textContent=currentPage;dots.forEach((d,i)=>d.classList.toggle('active',i+1===currentPage));navPrev.disabled=currentPage<=1;navNext.disabled=currentPage>=TOTAL-1}

    function goTo(idx,dir){
        if(transitioning||idx===currentPage||idx<0||idx>=TOTAL)return;
        transitioning=true;
        const ad=dir||(idx>currentPage?'next':'prev');
        const old=pages[currentPage],nw=pages[idx];
        old.classList.remove('active');old.classList.add(ad==='next'?'exit-left':'exit-right');
        nw.style.transition='none';nw.classList.remove('exit-left','exit-right');
        nw.style.transform=ad==='next'?'translateX(60px)':'translateX(-60px)';nw.style.opacity='0';
        void nw.offsetWidth;
        nw.style.transition='';nw.classList.add('active');nw.style.transform='';nw.style.opacity='';
        const sc=nw.querySelector('.pg-scroll');if(sc)sc.scrollTop=0;
        currentPage=idx;updateNav();triggerPage(idx);
        setTimeout(()=>{old.classList.remove('exit-left','exit-right');transitioning=false},700);
    }

    function triggerPage(idx) {
        // Typewriter on page 1
        if (idx === 1) {
            const lines = document.querySelectorAll('#tw-sorry .tw-line');
            lines.forEach((l, i) => setTimeout(() => l.classList.add('show'), i * 350 + 200));
        }
        // Timeline on page 5
        if (idx === 5) {
            const tl = document.getElementById('timeline');
            if (tl) setTimeout(() => tl.classList.add('anim-tl'), 400);
            // Strike-through animation
            document.querySelectorAll('.strike-item').forEach((item, i) => {
                setTimeout(() => item.classList.add('struck'), i * 500 + 300);
            });
        }
    }

    navPrev.addEventListener('click',()=>goTo(currentPage-1,'prev'));
    navNext.addEventListener('click',()=>goTo(currentPage+1,'next'));
    document.addEventListener('keydown',e=>{if(currentPage===0)return;if(e.key==='ArrowRight'||e.key==='ArrowDown'){e.preventDefault();goTo(currentPage+1,'next')}if(e.key==='ArrowLeft'||e.key==='ArrowUp'){e.preventDefault();goTo(currentPage-1,'prev')}});

    let tx0=0,ty0=0;
    document.addEventListener('touchstart',e=>{tx0=e.touches[0].clientX;ty0=e.touches[0].clientY},{passive:true});
    document.addEventListener('touchend',e=>{if(currentPage===0)return;const dx=e.changedTouches[0].clientX-tx0,dy=e.changedTouches[0].clientY-ty0;if(Math.abs(dx)>Math.abs(dy)&&Math.abs(dx)>60){if(dx<0)goTo(currentPage+1,'next');else goTo(currentPage-1,'prev')}},{passive:true});

    // ═══════ LANDING ═══════
    document.getElementById('enter-btn').addEventListener('click',()=>{
        bottomNav.classList.remove('hidden');
        ambientBtn.classList.remove('hidden');
        envBtn.classList.remove('hidden');
        goTo(1,'next');
        startAmbientAudio();
    });

    // ═══════ MYSTERY ORBS (Page 2) ═══════
    const orbAnswer = document.getElementById('orb-answer');
    const orbEmojis = ['🏠','🔥','💧','🤫','🌊','🤐'];
    document.querySelectorAll('.mystery-orb').forEach((orb, i) => {
        orb.addEventListener('click', () => {
            orb.classList.add('revealed');
            orb.querySelector('span').textContent = orbEmojis[i];
            orbAnswer.textContent = orb.dataset.reveal;
            orbAnswer.classList.add('show');
            spawnConf(orb.getBoundingClientRect().left + orb.offsetWidth/2, orb.getBoundingClientRect().top + orb.offsetHeight/2, 10);
        });
    });

    // Typewriter for "You know me"
    const twEl = document.querySelector('.typewrite');
    if (twEl) {
        const txt = twEl.dataset.text;
        let ti = 0;
        function typeIt() {
            if (ti <= txt.length) { twEl.textContent = txt.slice(0, ti); ti++; setTimeout(typeIt, 80); }
        }
        // Start when page 2 becomes active
        const obs2 = new MutationObserver(() => {
            if (pages[2].classList.contains('active')) { setTimeout(typeIt, 800); obs2.disconnect(); }
        });
        obs2.observe(pages[2], { attributes: true, attributeFilter: ['class'] });
    }

    // ═══════ WHY BUTTON (Page 3) ═══════
    const whyBtn = document.getElementById('why-btn');
    const whyMsg = document.getElementById('why-msg');
    if (whyBtn) {
        whyBtn.addEventListener('click', () => {
            whyBtn.style.display = 'none';
            whyMsg.classList.add('show');
            spawnConf(innerWidth/2, innerHeight/2, 20);
        });
    }

    // ═══════ GIFT BOXES (Page 4) ═══════
    document.querySelectorAll('.gift-box').forEach(box => {
        box.addEventListener('click', () => {
            if (box.classList.contains('opened')) return;
            box.classList.add('opened');
            const content = box.querySelector('.gift-content');
            content.innerHTML = `<div class="gc-emoji">${box.dataset.emoji}</div><div class="gc-title">${box.dataset.title}</div><div class="gc-msg">${box.dataset.msg}</div>`;
            const r = box.getBoundingClientRect();
            spawnConf(r.left + r.width/2, r.top + r.height/2, 15);
        });
    });

    // ═══════ MYSTERY BOXES (Page 7) ═══════
    const unlockCount = document.getElementById('unlock-count');
    let unlocked = 0;
    document.querySelectorAll('.mbox').forEach(box => {
        box.addEventListener('click', () => {
            if (box.classList.contains('unlocked')) return;
            box.classList.add('unlocked');
            unlocked++;
            unlockCount.textContent = unlocked;
            const r = box.getBoundingClientRect();
            spawnConf(r.left + r.width/2, r.top + r.height/2, 8);
            // All unlocked celebration
            if (unlocked === 8) {
                setTimeout(() => spawnConf(innerWidth/2, innerHeight/3, 40), 300);
            }
        });
    });

    // ═══════ HUG BUTTON (Page 8) ═══════
    const hugBtn=document.getElementById('hug-btn'),hugSub=document.getElementById('hug-sub');
    const hugMsgs=["Hug sent! 🤍 I hope you felt that.","A million more where that came from. 🤍","Squeezing you through the screen. 🤍","This is me not letting go. 🤍","Can you feel it? Because I mean it. 🤍","One more, just because. 🤍"];
    let hugC=0;
    hugBtn.addEventListener('click',()=>{hugBtn.classList.add('hugged');hugSub.textContent=hugMsgs[hugC%hugMsgs.length];hugSub.classList.add('show');hugC++;const r=hugBtn.getBoundingClientRect();spawnConf(r.left+r.width/2,r.top+r.height/2,25);setTimeout(()=>hugBtn.classList.remove('hugged'),1200)});

    // ═══════ AUDIO ═══════
    const songCards = document.querySelectorAll('.song-card');
    let curA = null;
    const fmt = s => isNaN(s) || !isFinite(s) ? '0:00' : Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');

    // (Ambient variables defined globally at top)

    songCards.forEach(card => {
        const au = card.querySelector('audio');
        const pb = card.querySelector('.s-play');
        const ip = card.querySelector('.ic-play');
        const ipa = card.querySelector('.ic-pause');
        const bar = card.querySelector('.s-bar');
        const fill = card.querySelector('.s-fill');
        const cur = card.querySelector('.s-cur');
        const dur = card.querySelector('.s-dur');

        function setDuration() {
            if (au.duration && !isNaN(au.duration)) {
                dur.textContent = fmt(au.duration);
            }
        }
        setDuration();
        au.addEventListener('loadedmetadata', setDuration);
        au.addEventListener('durationchange', setDuration);
        au.addEventListener('canplay', setDuration);

        async function togglePlay(e) {
            if (e) e.stopPropagation();
            if (ambP && ambAu) {
                ambAu.pause();
                ambP = false;
                if (icOn && icOff) { icOn.style.display = ''; icOff.style.display = 'none'; }
            }

            if (curA && curA !== au) {
                curA.pause();
                const p = curA.closest('.song-card');
                if (p) {
                    p.classList.remove('playing');
                    p.querySelector('.ic-play').style.display = '';
                    p.querySelector('.ic-pause').style.display = 'none';
                }
            }

            if (au.paused) {
                try {
                    await au.play();
                    card.classList.add('playing');
                    ip.style.display = 'none';
                    ipa.style.display = '';
                    curA = au;
                } catch (err) {
                    console.error('Audio play failed:', err);
                }
            } else {
                au.pause();
                card.classList.remove('playing');
                ip.style.display = '';
                ipa.style.display = 'none';
                curA = null;
            }
        }

        pb.addEventListener('click', togglePlay);
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.s-bar') && !e.target.closest('.s-play')) {
                togglePlay(e);
            }
        });

        au.addEventListener('timeupdate', () => {
            if (au.duration) {
                fill.style.width = (au.currentTime / au.duration * 100) + '%';
                cur.textContent = fmt(au.currentTime);
            }
        });

        bar.addEventListener('click', e => {
            e.stopPropagation();
            const r = bar.getBoundingClientRect();
            if (au.duration) au.currentTime = ((e.clientX - r.left) / r.width) * au.duration;
        });

        au.addEventListener('ended', () => {
            card.classList.remove('playing');
            ip.style.display = '';
            ipa.style.display = 'none';
            fill.style.width = '0';
            cur.textContent = '0:00';
            curA = null;
        });
    });

    // ═══════ AMBIENT ═══════
    ambientBtn.addEventListener('click', () => {
        if (ambP) {
            stopAmbientAudio();
        } else {
            startAmbientAudio();
        }
    });

    // ═══════ ENVELOPE ═══════
    const envM=document.getElementById('env-modal'),envX=envM.querySelector('.modal-x'),envBg=envM.querySelector('.modal-bg');
    envBtn.addEventListener('click',()=>envM.classList.add('open'));
    function cEnv(){envM.classList.remove('open')}envX.addEventListener('click',cEnv);envBg.addEventListener('click',cEnv);

    // ═══════ RESPONSE MODAL ═══════
    const rM=document.getElementById('resp-modal'),rT=document.getElementById('resp-text'),rOk=rM.querySelector('.resp-ok'),rBg=rM.querySelector('.modal-bg');
    function sResp(m){rT.textContent=m;rM.classList.add('open')}function cResp(){rM.classList.remove('open')}
    document.getElementById('btn-heard').addEventListener('click',()=>{sResp("Thank you for hearing me out. That means everything to me. I promise I'll do better. 🤍");spawnConf(innerWidth/2,innerHeight/2,50)});
    document.getElementById('btn-time').addEventListener('click',()=>sResp("I understand. Take all the time you need. I'll still be here. Always. 🤍"));
    rOk.addEventListener('click',cResp);rBg.addEventListener('click',cResp);
    document.addEventListener('keydown',e=>{if(e.key==='Escape'){cEnv();cResp()}});
});
