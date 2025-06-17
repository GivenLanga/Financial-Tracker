import Spline from "@splinetool/react-spline";

const SplineMoon = () => {
  return (
    <main
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
        background:
          "radial-gradient(circle at 60% 40%, rgba(255,140,0,0.25) 0%, rgba(255,140,0,0.10) 40%, transparent 80%)",
      }}
    >
      {/* Orange glow overlay */}
      <div
        style={{
          position: "absolute",
          top: "0",
          left: "0",
          width: "100vw",
          height: "100vh",
          pointerEvents: "none",
          zIndex: 1,
          boxShadow: "0 0 300px 120px rgba(255,140,0,0.45)",
          borderRadius: "50%",
          filter: "blur(40px)",
          opacity: 0.7,
        }}
      />
      <div
        style={{
          position: "relative",
          zIndex: 2,
          width: "100vw",
          height: "100vh",
        }}
      >
        <Spline scene="https://prod.spline.design/XHn5KQ42xYQJ6Olk/scene.splinecode" />
      </div>
    </main>
  );
};

export default SplineMoon;
