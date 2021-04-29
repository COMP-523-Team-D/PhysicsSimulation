import { Line } from "react-chartjs-2";
import { useEffect, useRef, useState } from "react";

const GraphComponent = ({ ind, dep, ...rest }) => {
  // reference to pass to Line graph
  const ref = useRef();

  const [dataArr, setDataArr] = useState([]);
  const [graphAnswers, setGraphAnswers] = useState([]);

  // Create x,y pairs from independent and dependent data arrays
  // and then add each pair/object to dataArr
  const initializeData = () => {
    let tempArr = [];
    for (let i = 0; i <= ind?.length; i++) {
      tempArr.push({ x: ind[i], y: dep[i] });
    }
    setDataArr(tempArr);
    //maybe add in the other graph?
  };

  // Set up the initial x and y scales on page load before cannon is fired
  useEffect(() => {
    ind && dep && initializeData();
  }, [ind, dep]);

  // Pulls chart from the event and
  // inserts a new x,y pair into the guess line
  // that corresponds to where the click was on the graph
  function handleClick(e) {
    console.log(e);
    // // Pull in x and y values of click and account for the
    // // graph does not start at 0,0
    let x = e.x;
    let y = e.y;

    // Repeat for the width and height of the graph
    let w = e.chart.width;
    let h = e.chart.height;

    // Grab array of all x-axis labels and then just the final one
    const xAxisLabels = e.chart.config.data.labels;

    const finalXAxisLabel = xAxisLabels[xAxisLabels.length - 1];
    const parsedLabel = parseFloat(finalXAxisLabel);

    let xPoint = (x / w) * parsedLabel;
    xPoint = xPoint.toFixed(2);
    console.log(xPoint);

    e.chart.config.data.datasets[1].data.push({ x: xPoint, y: 15 });

    e.chart.update();
  }

  const data = {
    datasets: [
      {
        label: "Simulation",
        data: dataArr,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
      {
        borderColor: "rgb(247, 166, 243)",
        label: "Prediction",
        data: [{ x: 0, y: 0 }],
        tension: 0.1,
      },
    ],
  };

  return (
    <Line
      className="graph"
      ref={ref}
      data={data}
      width={200}
      height={200}
      options={{
        maintainAspectRatio: false,
        onClick: handleClick,
      }}
    />
  );
};

export default GraphComponent;
