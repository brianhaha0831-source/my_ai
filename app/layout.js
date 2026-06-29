import "./globals.css";

export const metadata = {
  title: "우리 동네 신 키우기",
  description: "지엽적이고 하찮은 동네신으로 시작해 유일신이 되어보세요",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
