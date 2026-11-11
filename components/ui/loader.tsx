import { cn } from "@/lib/utils";
import { useState } from "react";

export const Component = ({ className }: { className?: string }) => {
  const [count, setCount] = useState(0);

  return (
    <div className={cn("wrapper-grid", className)}>
      <div className="cube">
        <div className="face face-front">S</div>
        <div className="face face-back"></div>
        <div className="face face-right"></div>
        <div className="face face-left"></div>
        <div className="face face-top"></div>
        <div className="face face-bottom"></div>
      </div>

      <div className="cube">
        <div className="face face-front">P</div>
        <div className="face face-back"></div>
        <div className="face face-right"></div>
        <div className="face face-left"></div>
        <div className="face face-top"></div>
        <div className="face face-bottom"></div>
      </div>

      <div className="cube">
        <div className="face face-front">E</div>
        <div className="face face-back"></div>
        <div className="face face-right"></div>
        <div className="face face-left"></div>
        <div className="face face-top"></div>
        <div className="face face-bottom"></div>
      </div>

      <div className="cube">
        <div className="face face-front">A</div>
        <div className="face face-back"></div>
        <div className="face face-right"></div>
        <div className="face face-left"></div>
        <div className="face face-top"></div>
        <div className="face face-bottom"></div>
      </div>

      <div className="cube">
        <div className="face face-front">K</div>
        <div className="face face-back"></div>
        <div className="face face-right"></div>
        <div className="face face-left"></div>
        <div className="face face-top"></div>
        <div className="face face-bottom"></div>
      </div>
    </div>
  );
};

export default Component;
