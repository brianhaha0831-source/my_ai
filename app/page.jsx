"use client";

import { useEffect, useState } from "react";
import "./landing.css";

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [modalImg, setModalImg] = useState(null);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });

    // 스크롤 리빌 IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.15 }
    );
    document.querySelectorAll(".lp-reveal").forEach((el) => observer.observe(el));

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  if (!mounted) return null;

  const screenshots = [
    "/screenshots/screenshot-1.png",
    "/screenshots/screenshot-3.png",
    "/screenshots/screenshot-5.png",
    "/screenshots/screenshot-7.png",
    "/screenshots/screenshot-9.png",
    "/screenshots/screenshot-11.png",
  ];

  return (
    <div className="lp-body">
      {/* 네비게이션 */}
      <nav className={`lp-nav ${scrolled ? "scrolled" : ""}`}>
        <a href="/" className="lp-nav-logo">
          <img src="/asset/god/god_stage0_light_orb.png" alt="신 키우기" />
          <span>신 키우기</span>
        </a>
        <div className="lp-nav-links">
          <a href="#features">특징</a>
          <a href="#flow">플레이</a>
          <a href="#gallery">스크린샷</a>
          <a href="/play" className="lp-nav-play">플레이</a>
        </div>
      </nav>

      {/* 히어로 */}
      <section className="lp-hero">
        <div className="lp-hero-glow" />
        <div className="lp-hero-content">
          <h1 className="lp-hero-title">신 키우기</h1>
          <p className="lp-hero-subtitle">
            작은 빛에서 시작해 세상을 다스리는 신으로 성장하세요.
          </p>
          <a href="/play" className="lp-play-btn">지금 플레이</a>
        </div>
        <div className="lp-hero-scroll">스크롤하여 더 보기 ▼</div>
      </section>

      {/* 메인 스크린샷 */}
      <div className="lp-main-screenshot lp-reveal">
        <img
          src="/screenshots/screenshot-1.png"
          alt="신 키우기 게임 화면"
          loading="lazy"
          width={900}
          height={562}
        />
      </div>

      {/* 핵심 특징 */}
      <section className="lp-section" id="features">
        <h2 className="lp-section-title lp-reveal">핵심 특징</h2>
        <div className="lp-features">
          <div className="lp-feature-card lp-reveal">
            <div className="lp-feature-icon">⚡</div>
            <h3 className="lp-feature-title">클릭하여 믿음을 모으세요</h3>
            <p className="lp-feature-desc">마우스를 꾹 눌러 기적을 발동시키세요</p>
          </div>
          <div className="lp-feature-card lp-reveal">
            <div className="lp-feature-icon">👥</div>
            <h3 className="lp-feature-title">신도를 늘리며 세력을 확장하세요</h3>
            <p className="lp-feature-desc">동네신에서 유일신으로 성장하세요</p>
          </div>
          <div className="lp-feature-card lp-reveal">
            <div className="lp-feature-icon">✨</div>
            <h3 className="lp-feature-title">신의 힘을 강화하세요</h3>
            <p className="lp-feature-desc">16가지 업그레이드로 신을 키우세요</p>
          </div>
          <div className="lp-feature-card lp-reveal">
            <div className="lp-feature-icon">🌍</div>
            <h3 className="lp-feature-title">웹에서 바로 플레이</h3>
            <p className="lp-feature-desc">설치 없이 브라우저에서 즉시 시작</p>
          </div>
        </div>
      </section>

      {/* 플레이 흐름 */}
      <section className="lp-section" id="flow">
        <h2 className="lp-section-title lp-reveal">플레이 흐름</h2>
        <div className="lp-flow lp-reveal">
          <div className="lp-flow-step">
            <div className="lp-flow-icon">🖱️</div>
            <span className="lp-flow-label">클릭</span>
          </div>
          <span className="lp-flow-arrow">→</span>
          <div className="lp-flow-step">
            <div className="lp-flow-icon">✨</div>
            <span className="lp-flow-label">믿음 획득</span>
          </div>
          <span className="lp-flow-arrow">→</span>
          <div className="lp-flow-step">
            <div className="lp-flow-icon">🏯</div>
            <span className="lp-flow-label">업그레이드</span>
          </div>
          <span className="lp-flow-arrow">→</span>
          <div className="lp-flow-step">
            <div className="lp-flow-icon">👥</div>
            <span className="lp-flow-label">신도 증가</span>
          </div>
          <span className="lp-flow-arrow">→</span>
          <div className="lp-flow-step">
            <div className="lp-flow-icon">🌟</div>
            <span className="lp-flow-label">더 강한 신</span>
          </div>
        </div>
      </section>

      {/* 스크린샷 갤러리 */}
      <section className="lp-section" id="gallery">
        <h2 className="lp-section-title lp-reveal">스크린샷</h2>
        <div className="lp-gallery lp-reveal">
          {screenshots.map((src, i) => (
            <div
              key={i}
              className="lp-gallery-item"
              onClick={() => setModalImg(src)}
            >
              <img
                src={src}
                alt={`신 키우기 스크린샷 ${i + 1}`}
                loading="lazy"
                width={320}
                height={200}
              />
            </div>
          ))}
        </div>
      </section>

      {/* 왜 플레이해야 하나 */}
      <section className="lp-section">
        <h2 className="lp-section-title lp-reveal">왜 플레이해야 하나?</h2>
        <div className="lp-reasons lp-reveal">
          <div className="lp-reason-item">
            <span className="lp-reason-icon">⚡</span>
            <span className="lp-reason-text">설치 없이 바로 플레이</span>
          </div>
          <div className="lp-reason-item">
            <span className="lp-reason-icon">🎮</span>
            <span className="lp-reason-text">누구나 쉽게 즐기는 클릭커</span>
          </div>
          <div className="lp-reason-item">
            <span className="lp-reason-icon">📈</span>
            <span className="lp-reason-text">꾸준히 성장하는 재미</span>
          </div>
          <div className="lp-reason-item">
            <span className="lp-reason-icon">🎨</span>
            <span className="lp-reason-text">귀여운 픽셀 스타일 비주얼</span>
          </div>
        </div>
      </section>

      {/* 최종 CTA */}
      <section className="lp-final-cta">
        <h2 className="lp-final-cta-title lp-reveal">
          당신만의 신화를 시작하세요.
        </h2>
        <p className="lp-final-cta-desc lp-reveal">
          작은 빛에서 유일신까지, 지금 바로 시작하세요.
        </p>
        <a href="/play" className="lp-play-btn lp-reveal">지금 플레이</a>
      </section>

      {/* 푸터 */}
      <footer className="lp-footer">
        <p>신 키우기 · 클릭커 게임</p>
        <p>© 2026 신 키우기. All rights reserved.</p>
      </footer>

      {/* 스크린샷 모달 */}
      {modalImg && (
        <div className="lp-modal active" onClick={() => setModalImg(null)}>
          <button className="lp-modal-close" onClick={() => setModalImg(null)}>✕</button>
          <img src={modalImg} alt="스크린샷 확대" />
        </div>
      )}
    </div>
  );
}