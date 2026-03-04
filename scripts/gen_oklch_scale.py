"""
Generates a 50..900 OKLCH scale around a base color (treated as ~500).
Usage:
    python3 gen_oklch_scale.py --name brand-main --oklch "0.62 0.18 250"
    python3 gen_oklch_scale.py --name brand-accent --oklch "oklch(0.68 0.16 40)"
    python3 gen_oklch_scale.py --name brand-base --oklch "0.92 0.03 285"
"""
import re
import argparse

STEPS: list[int] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]

def parse_oklch(s: str) -> tuple[float, float, float]:
    """
    Accepts:
      - "0.62 0.18 250"
      - "oklch(0.62 0.18 250)"
      - "oklch(0.62 0.18 250 / 1)"  -> alpha ignored
    Returns (L, C, H)
    """
    s = s.strip()
    m = re.search(r"oklch\(\s*([0-9]*\.?[0-9]+)\s+([0-9]*\.?[0-9]+)\s+([0-9]*\.?[0-9]+)", s)
    if m:
        return float(m.group(1)), float(m.group(2)), float(m.group(3))

    parts = re.split(r"\s+", s)
    if len(parts) < 3:
        raise ValueError("OKLCH must be like '0.62 0.18 250' or 'oklch(0.62 0.18 250)'")
    return float(parts[0]), float(parts[1]), float(parts[2])

def clamp(x: float, lo: float, hi: float) -> float:
    return max(lo, min(hi, x))

def ease_in_out(t: float) -> float:
    # smoothstep
    return t * t * (3 - 2 * t)

def generate_oklch_scale(
    L: float,
    C: float,
    H: float,
    *,
    light_spread: float = 0.32,
    dark_spread: float = 0.32,
    L_min: float = 0.12,
    L_max: float = 0.98,
    C_light_factor: float = 0.25,
    C_dark_factor: float = 0.45,
    C_mid_boost: float = 1.00,
) -> dict[int, tuple[float, float, float]]:
    """
    Generates a 50..900 scale around the input color (treated as ~500).
    - Hue fixed.
    - Lightness interpolates from L_hi to L_lo with easing.
    - Chroma forms a 'bell': lower at ends, higher near middle.

    You can tweak spreads/factors if the output feels too pale/dark/saturated.
    """
    L_hi = clamp(L + light_spread, L_min, L_max)
    L_lo = clamp(L - dark_spread, L_min, L_max)

    scale: dict[int, tuple[float, float, float]] = {}

    for i, step in enumerate(STEPS):
        t = i / (len(STEPS) - 1)  # 0..1 (50 -> 900)
        tt = ease_in_out(t)

        # Lightness: 50 is light, 900 is dark
        Li = (1 - tt) * L_hi + tt * L_lo

        # Chroma: bell curve peak at center (around 500)
        # bell = 1 - (2t-1)^2  -> 0 at ends, 1 at center
        bell = 1.0 - (2.0 * t - 1.0) ** 2
        bell = clamp(bell, 0.0, 1.0)

        # End factors define how much chroma remains at ends
        end_factor = (1 - t) * C_light_factor + t * C_dark_factor
        Ci = C * (end_factor + (C_mid_boost - end_factor) * bell)

        # Guard: keep Ci >= 0
        Ci = max(0.0, Ci)

        scale[step] = (Li, Ci, H)

    return scale

def fmt_oklch(L: float, C: float, H: float, decimals: int = 3) -> str:
    return f"oklch({L:.{decimals}f} {C:.{decimals}f} {H:.3f})"

def emit_css_vars(prefix: str, scale: dict[int, tuple[float, float, float]]) -> str:
    """
    prefix example: "--brand-main"
    outputs:
      --brand-main-50: oklch(...);
      ...
      --brand-main-900: oklch(...);
      --brand-main: var(--brand-main-500);
    """
    lines = []
    for step in STEPS:
        L, C, H = scale[step]
        lines.append(f"  {prefix}-{step}: {fmt_oklch(L, C, H)};")
    lines.append(f"  {prefix}: var({prefix}-500);")
    return "\n".join(lines)

def main():
    parser = argparse.ArgumentParser(description="Generate OKLCH 50..900 CSS variables from a base OKLCH color.")
    parser.add_argument("--name", required=True, help="Variable base name without leading dashes. e.g. brand-main")
    parser.add_argument("--oklch", required=True, help="OKLCH like '0.62 0.18 250' or 'oklch(0.62 0.18 250)'")
    parser.add_argument("--light-spread", type=float, default=0.32)
    parser.add_argument("--dark-spread", type=float, default=0.32)
    parser.add_argument("--c-light", type=float, default=0.25, help="chroma factor at step 50")
    parser.add_argument("--c-dark", type=float, default=0.45, help="chroma factor at step 900")
    parser.add_argument("--c-mid", type=float, default=1.00, help="chroma factor near step 500")
    args = parser.parse_args()

    L, C, H = parse_oklch(args.oklch)
    scale = generate_oklch_scale(
        L, C, H,
        light_spread=args.light_spread,
        dark_spread=args.dark_spread,
        C_light_factor=args.c_light,
        C_dark_factor=args.c_dark,
        C_mid_boost=args.c_mid,
    )

    prefix = f"--{args.name}"
    print(":root {")
    print(emit_css_vars(prefix, scale))
    print("}")

if __name__ == "__main__":
    main()