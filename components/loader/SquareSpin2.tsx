import Style from "./SquareSpin2.module.css";
import type { ILoader } from "./types";

export function SquareSpin2({ color, size }: ILoader) {
  return (
    <div
      className={Style["square-spin-2"]}
      style={{
        color: color,
        width: size,
        height: size,
      }}
    ></div>
  );
}
