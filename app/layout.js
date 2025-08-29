export const metadata = { title: "Memely", description: "Meme + short video sharing MVP" };
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header style={{padding:'10px',borderBottom:'1px solid #eee',display:'flex',gap:'12px'}}>
          <a href="/">Home</a>
          <a href="/upload">Upload</a>
          <a href="/login" style={{marginLeft:'auto'}}>Login</a>
        </header>
        <main style={{maxWidth: 720, margin: '0 auto', padding: 16}}>{children}</main>
      </body>
    </html>
  );
}
