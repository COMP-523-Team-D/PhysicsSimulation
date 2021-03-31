import useCanvas from "../utils/useCanvas";

const GraphCanvasComponent = ({ points, ...rest }) => {
  // draw function for drawing curves
  const draw = (ctx) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.moveTo(points[0], points[1]);
    ctx.quadraticCurveTo(points[2], points[3], points[4], points[5]);
    ctx.stroke();
  };

  const canvasRef = useCanvas(draw);

  return (
    <canvas
      className="graph-canvas"
      ref={canvasRef}
      width="200"
      height="175"
      {...rest}
    />
  );
};

export default GraphCanvasComponent;
