import "./globals.css";

export const metadata = {
  title: "우리 동네 신 키우기 - 클릭으로 키우는 동네신 성장 게임",
  description:
    "랜덤으로 탄생한 동네신을 클릭, 신도 포섭, 믿음 수급, 업그레이드 트리, 8단계 진화로 유일신까지 키우는 브라우저 클릭커 게임입니다.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
