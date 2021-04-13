import useCanvas from "../utils/useCanvas";

const GraphCanvasComponent = ({ points, ...rest }) => {
  const width = 200;
  const height = 200;

  // Calculate the 'scale factor'
  // floor(w/x) = x_fac, floor(h/y) = y_fac
  // scale = min(x_fac, y_fac);
  const x_final = points[-2];
  const y_final = points[-1];

  const scale = 10;
  const step = 20;

  // Adapted from:
  // https://codereview.stackexchange.com/questions/114702/drawing-a-grid-on-canvas
  // Function to draw the gridlines on the graph
  const drawGrid = function (ctx, w, h, step) {
    ctx.beginPath();
    for (let x = 0; x <= w; x += step) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
    }
    ctx.strokeStyle = "rgb(0,0,0)";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.beginPath();
    for (let y = 0; y <= h; y += step) {
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
    }

    ctx.strokeStyle = "rgb(0,0,0)";
    ctx.lineWidth = 1;
    ctx.stroke();
  };

  // draw function for drawing curves
  const draw = (ctx) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = "#000000";

    drawGrid(ctx, width, height, 20);

    ctx.beginPath();
    for (let i = 0; i < points.length; i += 2) {
      ctx.lineTo(points[i] * scale, height - scale * points[i + 1]);
    }
    ctx.stroke();
  };

  // Set up reference to graph
  const canvasRef = useCanvas(draw);

  return (
    <canvas
      className="graph-canvas"
      ref={canvasRef}
      width={width}
      height={height}
      {...rest}
    />
  );
};

export default GraphCanvasComponent;
