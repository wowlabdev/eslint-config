export function LeakedRender({ count }: { count: number }) {
  return <>{count && <span />}</>;
}
