export function FloatingOrbs() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden motion-reduce:hidden"
    >
      <div className="orb orb-1 absolute -left-20 top-20 h-72 w-72 rounded-full bg-rose-500/20 blur-3xl" />
      <div className="orb orb-2 absolute -right-16 top-1/3 h-96 w-96 rounded-full bg-lilac-500/15 blur-3xl" />
      <div className="orb orb-3 absolute bottom-20 left-1/4 h-64 w-64 rounded-full bg-rose-400/10 blur-3xl" />
    </div>
  );
}
