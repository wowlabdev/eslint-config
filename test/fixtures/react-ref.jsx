import { useRef } from "react";

export function Component() {
  const viewRef = useRef(null);
  const ref = useRef(null);

  return (
    <div ref={viewRef}>
      <span ref={ref} />
    </div>
  );
}
