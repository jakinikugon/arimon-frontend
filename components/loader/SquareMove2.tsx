import Style from "./SquareMove2.module.css";
import type { ILoader } from "./types";

export function SquareMove2({ color, size }: ILoader) {
  return (
    <div
      className={Style["square-move-2"]}
      style={{
        color: color,
        width: size,
        height: size,
      }}
    ></div>
  );
}
