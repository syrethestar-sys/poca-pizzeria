import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function AuthLayout({ children }) {
  return (
    <div className="grid min-h-svh md:grid-cols-2">
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12">
        <Link href="/" className="mb-10 inline-flex w-fit">
          <Logo square height={56} />
        </Link>
        <div className="w-full max-w-sm">{children}</div>
      </div>

      {/* The oven, as on the home page — the one image we can draw ourselves. */}
      <div className="relative hidden overflow-hidden bg-carbone md:block">
        <div
          className="absolute top-1/2 left-1/2 h-[46%] w-[38%] -translate-x-1/2 -translate-y-1/2"
          style={{
            borderRadius: "50% 50% 4px 4px / 74% 74% 4px 4px",
            background:
              "radial-gradient(120% 90% at 50% 96%, var(--forno) 0%, var(--ember) 34%, #7b1f0c 66%, #25100a 100%)",
            boxShadow: "0 0 120px -10px color-mix(in srgb, var(--ember) 70%, transparent)",
          }}
        />
        <p className="absolute right-8 bottom-8 left-8 font-display text-[22px] leading-snug text-[#f3ebdb]/85">
          A dough that takes two days and an oven that takes ninety seconds.
        </p>
      </div>
    </div>
  );
}
