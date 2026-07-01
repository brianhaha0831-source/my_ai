"use client";

import { useEffect, useMemo, useState } from "react";
import "./landing.css";

const godStages = [
  ["0", "빛의 구체", "/asset/god/god_stage0_light_orb.png"],
  ["1", "작은 석상", "/asset/god/god_stage1_small_statue.png"],
  ["2", "천사", "/asset/god/god_stage2_angel.png"],
  ["3", "후광의 신", "/asset/god/god_stage3_halo_god.png"],
  ["4", "거대한 신", "/asset/god/god_stage4_great_god.png"],
  ["5", "우주 존재", "/asset/god/god_stage5_cosmic_being.png"],
  ["6", "형태 없는 빛", "/asset/god/god_stage6_formless_light.png"],
  ["7", "유일신", "/asset/god/god_stage7_one_true_god.png"],
];

const upgrades = [
  ["기적 공격력", "한 번의 손길을 더 강하게", "/asset/icons/upgrades/attack_power_sword.png"],
  ["천벌", "화면을 번쩍이는 광역 기적", "/asset/icons/upgrades/smite_lightning.png"],
  ["연쇄 축복", "주변 신도에게 믿음 전파", "/asset/icons/upgrades/chain_blessing.png"],
  ["자동 믿음", "방치 중에도 차오르는 신앙", "/asset/icons/upgrades/auto_faith_prayer.png"],
  ["인연", "희귀 신도 등장 확률 상승", "/asset/icons/upgrades/rare_bonus_clover.png"],
  ["계시", "운 좋으면 즉시 포섭", "/asset/icons/upgrades/revelation_eye.png"],
];

const followers = [
  ["일반", "가볍게 모이는 동네 사람", "/asset/npc/student.png", "#c0c0c0"],
  ["희귀", "조금 더 오래 설득할 신도", "/asset/npc/office_male.png", "#4a9eff"],
  ["영웅", "믿음을 크게 남기는 핵심 신도", "/asset/npc/office_female.png", "#aa44ff"],
  ["전설", "한 번 잡으면 성장판이 열린다", "/asset/npc/delivery.png", "#ffaa00"],
  ["신화", "보이면 모든 기적을 쏟아부을 대상", "/asset/npc/grandma.png", "#ff4444"],
];

const loops = [
  ["1", "이름 생성", "지역, 대상, 담당 기적이 섞인 이상하게 그럴듯한 신으로 시작"],
  ["2", "클릭 포섭", "마우스를 꾹 누르며 신도에게 기적을 때려 넣는 즉각적인 손맛"],
  ["3", "믿음 투자", "공격, 특수 능력, 자동 수급 3갈래 업그레이드 트리 확장"],
  ["4", "단계 진화", "동네신에서 유일신까지 화면과 초상이 함께 커지는 성장감"],
];

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [modalImg, setModalImg] = useState(null);

  const gallery = useMemo(
    () => [
      "/landing-assets/hero-key-art.png",
      "/landing-assets/world-strip.png",
      "/landing-assets/blessing-badge.png",
      "/screenshots/screenshot-5.png",
      "/screenshots/screenshot-14.png",
      "/screenshots/screenshot-10.png",
    ],
    []
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-visible");
        });
      },
      { threshold: 0.16 }
    );

    document.querySelectorAll(".lp-reveal").forEach((el) => observer.observe(el));

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <main className="lp">
      <nav className={`lp-nav ${scrolled ? "is-scrolled" : ""}`}>
        <a href="#top" className="lp-brand" aria-label="우리 동네 신 키우기 홈">
          <img src="/asset/god/god_stage0_light_orb.png" alt="" />
          <span>우리 동네 신 키우기</span>
        </a>
        <div className="lp-nav-links">
          <a href="#loop">성장 루프</a>
          <a href="#evolution">진화</a>
          <a href="#upgrades">업그레이드</a>
          <a href="/play" className="lp-nav-cta">플레이</a>
        </div>
      </nav>

      <section className="lp-hero" id="top">
        <img className="lp-hero-art" src="/landing-assets/hero-key-art.png" alt="" />
        <div className="lp-cloud lp-cloud-a" />
        <div className="lp-cloud lp-cloud-b" />
        <div className="lp-hero-inner">
          <div className="lp-hero-copy lp-reveal is-visible">
            <p className="lp-kicker">클릭으로 시작하는 동네급 신앙 확장 게임</p>
            <h1>
              <span>작은 동네</span>
              <span>소원에서</span>
              <span>유일신까지</span>
              <span>키워보세요</span>
            </h1>
            <p className="lp-hero-desc">
              랜덤으로 탄생한 당신의 신을 키우고, 신도를 포섭하고, 믿음을 업그레이드에
              투자해 세계 전체를 담당하는 존재로 진화시키는 브라우저 클릭커입니다.
            </p>
            <div className="lp-actions">
              <a href="/play" className="lp-button lp-button-primary">지금 플레이</a>
              <a href="#loop" className="lp-button lp-button-secondary">게임 보기</a>
            </div>
            <div className="lp-hero-stats" aria-label="게임 핵심 특징">
              <span><strong>8</strong> 단계 진화</span>
              <span><strong>16</strong>개 스킬</span>
              <span><strong>5</strong>등급 신도</span>
            </div>
          </div>

          <aside className="lp-hero-card lp-reveal is-visible">
            <div className="lp-card-top">오늘의 신</div>
            <img src="/asset/god/god_stage3_halo_god.png" alt="후광을 가진 신" />
            <strong>구로구 발표 공포증 방지 담당 신</strong>
            <p>믿음 +0.1/초에서 시작해 우주급 권능으로 커집니다.</p>
          </aside>
        </div>
        <div className="lp-next-peek" />
      </section>

      <section className="lp-section lp-strip-section" id="loop">
        <img className="lp-strip-art" src="/landing-assets/world-strip.png" alt="" />
        <div className="lp-section-head lp-reveal">
          <p className="lp-kicker">왜 계속 누르게 되나</p>
          <h2>클릭 한 번마다 신앙 경제가 굴러갑니다</h2>
          <p>
            손맛은 단순하지만, 보상은 빠르게 쌓입니다. 신도 등급, 자동 믿음,
            광역 기적, 진화 연출이 짧은 세션에도 계속 목표를 만들어 줍니다.
          </p>
        </div>
        <div className="lp-loop-grid">
          {loops.map(([num, title, desc]) => (
            <article className="lp-loop-card lp-reveal" key={title}>
              <span>{num}</span>
              <h3>{title}</h3>
              <p>{desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="lp-section lp-evolution" id="evolution">
        <div className="lp-section-head lp-reveal">
          <p className="lp-kicker">성장의 얼굴</p>
          <h2>빛의 구체가 유일신이 되는 8단계 진화</h2>
        </div>
        <div className="lp-evo-rail lp-reveal">
          {godStages.map(([stage, name, src]) => (
            <article className="lp-evo-card" key={name}>
              <span>STAGE {stage}</span>
              <img src={src} alt={name} />
              <strong>{name}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="lp-section lp-split" id="upgrades">
        <div className="lp-section-head lp-reveal">
          <p className="lp-kicker">믿음 사용처</p>
          <h2>공격, 특수 능력, 자원 수급으로 갈라지는 신전 트리</h2>
          <p>
            공격력을 밀어 빠르게 포섭하거나, 천벌과 연쇄 축복으로 화면을 쓸거나,
            자동 믿음을 키워 방치 보상을 노릴 수 있습니다.
          </p>
        </div>
        <div className="lp-upgrade-grid">
          {upgrades.map(([title, desc, src]) => (
            <article className="lp-upgrade-card lp-reveal" key={title}>
              <img src={src} alt="" />
              <div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="lp-section lp-followers">
        <div className="lp-section-head lp-reveal">
          <p className="lp-kicker">신도 사냥감</p>
          <h2>등급이 올라갈수록 포섭의 맛도 커집니다</h2>
        </div>
        <div className="lp-follower-grid">
          {followers.map(([grade, desc, src, color]) => (
            <article className="lp-follower-card lp-reveal" style={{ "--grade": color }} key={grade}>
              <img src={src} alt={grade} />
              <strong>{grade}</strong>
              <p>{desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="lp-section lp-gallery-section">
        <div className="lp-section-head lp-reveal">
          <p className="lp-kicker">무드 보드</p>
          <h2>밝고 귀엽고, 누르면 바로 반응하는 화면감</h2>
        </div>
        <div className="lp-gallery lp-reveal">
          {gallery.map((src, index) => (
            <button className="lp-gallery-item" type="button" key={src} onClick={() => setModalImg(src)}>
              <img src={src} alt={`게임 랜딩 이미지 ${index + 1}`} />
            </button>
          ))}
        </div>
      </section>

      <section className="lp-final">
        <img src="/landing-assets/blessing-badge.png" alt="" />
        <div className="lp-reveal">
          <p className="lp-kicker">설치 없이 바로 시작</p>
          <h2>오늘 당신은 어떤 이상한 신으로 태어날까요?</h2>
          <a href="/play" className="lp-button lp-button-primary">신 이름 뽑으러 가기</a>
        </div>
      </section>

      <footer className="lp-footer">
        <span>우리 동네 신 키우기</span>
        <a href="/play">플레이하기</a>
      </footer>

      {modalImg && (
        <div className="lp-modal" role="dialog" aria-modal="true" onClick={() => setModalImg(null)}>
          <button type="button" aria-label="닫기" onClick={() => setModalImg(null)}>×</button>
          <img src={modalImg} alt="확대 이미지" />
        </div>
      )}
    </main>
  );
}
