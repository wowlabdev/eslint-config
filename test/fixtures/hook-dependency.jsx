import { useEffect } from "react";

export function HookDependency({ value }) {
  useEffect(() => console.log(value), []);

  return null;
}
