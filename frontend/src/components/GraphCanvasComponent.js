import useCanvas from "../utils/useCanvas";

const GraphCanvasComponent = ({ points, ...rest }) => {
  const width = 200;
  const height = 200;

  const findXMax = () => {
    let max = points[0];
    for (let i = 0; i < points.length; i += 2) {
      if (max < points[i]) {
        max = points[i];
      }
    }
    return max;
  };

  const findYMax = () => {
    let max = points[1];
    for (let i = 1; i <= points.length; i += 2) {
      if (max < points[i]) {
        max = points[i];
      }
    }
    return max;
  };

  const x_max = findXMax();
  const y_max = findYMax();

  const scale = 10;
  const x_scale = (width / x_max) * 0.9;
  const y_scale = (height / y_max) * 0.9;
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
      ctx.lineTo(points[i] * x_scale, height - y_scale * points[i + 1]);
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
