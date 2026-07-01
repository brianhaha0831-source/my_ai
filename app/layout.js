import "./globals.css";

export const metadata = {
  title: "우리 동네 신 키우기 - 동네신에서 유일신으로",
  description: "지엽적이고 하찮은 동네신으로 시작해 유일신이 되어보세요. 8단계 진화, 16가지 신전 스킬, 5등급 신도 시스템을 가진 클리커 게임",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
