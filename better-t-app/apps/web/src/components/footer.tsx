interface FooterProps {
  className?: string;
}

export function Footer({ className = "" }: FooterProps) {
  return (
    <footer
      className={`border-t border-[#c9a84c]/10 bg-[#0e0d0c] px-6 py-8 ${className}`}
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-2">
          <span
            className="font-serif text-xl italic text-[#c9a84c]"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            𝄞 Teoria
          </span>
        </div>

        <p className="text-xs text-[#6b6356]">© 2026 Teoria</p>

        <nav className="flex gap-4 text-xs text-[#6b6356]">
          <a href="#" className="transition-colors hover:text-[#c9a84c]">
            プライバシー
          </a>
          <span>·</span>
          <a href="#" className="transition-colors hover:text-[#c9a84c]">
            利用規約
          </a>
        </nav>
      </div>
    </footer>
  );
}
