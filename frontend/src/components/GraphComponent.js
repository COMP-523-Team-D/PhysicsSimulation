import { Line } from "react-chartjs-2";
import { useEffect, useRef, useState } from "react";

const GraphComponent = ({ ind, dep, ...rest }) => {
  const [p1, setP1] = useState(null);
  const [p2, setP2] = useState(null);

  const width = 200;
  const height = 200;

  const ref = useRef();

  function handleClick(e, element) {
    // /console.log(e.chart.config.data.datasets);
    let dataSet = e.chart.config.data.datasets;

    // Add y value
    dataSet[1].data.push(e.y.toFixed(2).toString());
    e.chart.update();
  }

  const data = {
    labels: ind,
    datasets: [
      {
        label: "Simulation",
        data: dep,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
      {
        borderColor: "rgb(247, 166, 243)",
        label: "My best guess",
        data: [],
        tension: 0.1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        suggestedMax: 30,
      },
      x: { type: "linear", suggestedMax: 6, suggestedMin: 3 },
    },
    maintainAspectRatio: false,
    onClick: { handleClick },
  };

  return (
    <Line
      className="graph"
      ref={ref}
      data={data}
      width={200}
      height={200}
      options={{ maintainAspectRatio: false, onClick: handleClick }}
    />
  );
};

export default GraphComponent;
