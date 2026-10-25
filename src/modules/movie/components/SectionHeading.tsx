import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface SectionHeadingProps {
  index: string;
  eyebrow: string;
  title: string;
  description: string;
  href?: string;
  linkLabel?: string;
  inverse?: boolean;
}

export function SectionHeading({
  index,
  eyebrow,
  title,
  description,
  href,
  linkLabel = "查看全部",
  inverse = false,
}: SectionHeadingProps) {
  const mainText = inverse ? "text-white" : "text-[#f2efe9]";
  const mutedText = inverse ? "text-white/65" : "text-[#8f908d]";

  return (
    <header className={`grid gap-4 border-t pt-5 sm:grid-cols-[88px_1fr_auto] sm:items-end ${inverse ? "border-white/20" : "border-white/12"}`}>
      <span className={`editorial-index hidden text-6xl font-black leading-none sm:block ${inverse ? "opacity-70" : ""}`}>
        {index}
      </span>
      <div>
        <p className={`text-[10px] font-black uppercase tracking-[0.24em] ${inverse ? "text-white/70" : "text-[#ef4b43]"}`}>
          {eyebrow}
        </p>
        <h2 className={`mt-2 text-2xl font-black tracking-[-0.035em] sm:text-3xl ${mainText}`}>{title}</h2>
        <p className={`mt-2 max-w-2xl text-xs leading-5 sm:text-sm ${mutedText}`}>{description}</p>
      </div>
      {href && (
        <Link href={href} className={`flex items-center gap-1 text-xs font-bold transition hover:text-[#ef4b43] ${mainText}`}>
          {linkLabel}
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </header>
  );
}
