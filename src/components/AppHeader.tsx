import Image from "next/image";
import { Bell01, Menu02, Plane, SearchLg, Settings01 } from "@untitledui/icons";
import { cn, iconStroke } from "@/components/ui";

/*
 * App header 108:9270 (component 64:1497) — 72 px, white, 1 px border-secondary bottom, px 32, gap 24.
 * Left: logo mark (32 px brand square, 18 px plane) + "Istanbul Regional / Ops Center".
 * Centre: nav items Text md/Semibold (active = brand solid, white text; others text-secondary), gap 4.
 * Right: 40 px icon buttons (search, settings, bell — 20 px, nav-item-button-icon-fg) + 40 px avatar.
 * Mobile (56:1207): logo + menu button.
 * The nav destinations and actions were not designed in the case study, so they are inert.
 */
const NAV = ["Overview", "Flights", "Gates", "Alerts"];

function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-bg-brand-solid">
        <Plane size={18} strokeWidth={iconStroke(18)} className="text-on-brand" />
      </div>
      <div className="flex flex-col whitespace-nowrap">
        <span className="text-sm font-semibold text-primary">Istanbul Regional</span>
        <span className="text-xs font-normal text-tertiary">Ops Center</span>
      </div>
    </div>
  );
}

function NavIconButton({ icon: Icon, label }: { icon: typeof SearchLg; label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={`${label} (not designed in this case study)`}
      className="flex size-10 items-center justify-center rounded-sm text-quaternary transition-colors hover:bg-bg-secondary hover:text-tertiary"
    >
      <Icon size={20} strokeWidth={iconStroke(20)} />
    </button>
  );
}

export function AppHeader() {
  // Bottom line is drawn inside the 72 / 64 px bar (Figma inside stroke), so it adds no height.
  return (
    <header className="w-full bg-bg-primary shadow-[inset_0_-1px_0_var(--color-border-secondary)]">
      {/* Desktop */}
      <div className="mx-auto hidden h-[72px] max-w-[1440px] items-center gap-6 px-8 lg:flex">
        <div className="flex min-w-0 flex-1 items-center">
          <Logo />
        </div>
        <nav aria-label="Main" className="flex shrink-0 items-center gap-1">
          {NAV.map((item) => {
            const active = item === "Overview";
            return (
              <a
                key={item}
                href={active ? "#" : undefined}
                aria-current={active ? "page" : undefined}
                aria-disabled={active ? undefined : true}
                title={active ? undefined : `${item} page (not designed in this case study)`}
                onClick={(e) => e.preventDefault()}
                className={cn(
                  "rounded-sm px-3 py-2 text-md font-semibold transition-colors",
                  active ? "bg-bg-brand-solid text-on-brand" : "cursor-default bg-bg-primary text-secondary hover:bg-bg-secondary",
                )}
              >
                {item}
              </a>
            );
          })}
        </nav>
        <div className="flex min-w-0 flex-1 items-center justify-end gap-3">
          <div className="flex items-center gap-1">
            <NavIconButton icon={SearchLg} label="Search" />
            <NavIconButton icon={Settings01} label="Settings" />
            <NavIconButton icon={Bell01} label="Notifications" />
          </div>
          <button type="button" aria-label="Account: Selin Kaya" title="Account (not designed in this case study)" className="relative size-10 shrink-0 rounded-full">
            <Image src="/avatar.jpg" alt="" width={40} height={40} className="size-10 rounded-full object-cover" priority />
            <span aria-hidden="true" className="absolute inset-0 rounded-full border-[0.75px] border-black/[0.08]" />
          </button>
        </div>
      </div>

      {/* Mobile */}
      <div className="flex h-16 items-center justify-between pl-4 pr-2 lg:hidden">
        <Logo />
        <button
          type="button"
          aria-label="Open menu"
          title="Menu (not designed in this case study)"
          className="flex size-10 items-center justify-center rounded-md text-secondary hover:bg-bg-secondary"
        >
          <Menu02 size={24} strokeWidth={2} />
        </button>
      </div>
    </header>
  );
}
