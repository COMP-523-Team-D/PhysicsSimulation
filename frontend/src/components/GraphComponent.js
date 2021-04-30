import { Scatter } from "react-chartjs-2";
import { useEffect, useRef, useState } from "react";

const GraphComponent = ({
  ind,
  dep,
  xMax,
  xMin,
  yMax,
  yMin,
  width,
  height,
  ...rest
}) => {
  // reference to pass to Line graph
  const ref = useRef();

  // Array of values for x axis
  const [label, setLabel] = useState([]);
  // Values that
  const [dataArr, setDataArr] = useState([]);
  // Array to store student response points
  const [graphAnswers, setGraphAnswers] = useState([]);

  // Create x,y pairs from independent and dependent data arrays
  // and then add each pair/object to dataArr
  const initializeData = () => {
    let tempArr = [];
    for (let i = 0; i <= ind?.length; i++) {
      tempArr.push({ x: ind[i], y: dep[i] });
    }
    setDataArr(tempArr);
  };

  // Set up the initial x and y scales on page load before cannon is fired
  useEffect(() => {
    ind && dep && initializeData();
  }, [ind, dep]);

  // function to set up initial scale with given params for
  // max x and y values passed as props
  const setUpInitScale = (min1, min2, max1, max2) => {
    let yScale = [];
    let xScale = [];
    let tXScale = [];
    for (let i = min1; i <= max1; i += 0.2) {
      xScale.push(i.toFixed(2));
    }
    xScale.map((x) => parseFloat(x).toFixed(2));
    for (let j = min2; j <= max2; j += 0.2) {
      yScale.push(j);
    }
    setLabel([xScale, yScale]);
  };

  // set up initial scale when page loads
  useEffect(() => {
    setUpInitScale(xMin, yMin, xMax, yMax);
  }, []);

  // Pulls chart from the event and
  // inserts a new x,y pair into the guess line
  // that corresponds to where the click was on the graph
  function handleClick(e) {
    const yAxisPixelPos = e.chart.chartArea.left;
    const xAxisPixelPos = e.chart.chartArea.bottom;
    const xAxisPixelScale = e.chart.chartArea.right - e.chart.chartArea.left;
    const yAxisPixelScale = e.chart.chartArea.bottom - e.chart.chartArea.top;
    const xAxisScale = xMax - xMin;
    const yAxisScale  = yMax - yMin;

    // // Pull in x and y values of click and account for the
    // // graph does not start at 0,0
    const xChartPixelLength = e.x - yAxisPixelPos;
    const yChartPixelLength = xAxisPixelPos - e.y;
    
    const xChartRatio = xChartPixelLength/xAxisPixelScale;
    const yChartRatio = yChartPixelLength/yAxisPixelScale;

    const xDataPoint = xChartRatio*xAxisScale;
    const yDataPoint = yChartRatio*yAxisScale;



    // Repeat for the width and height of the graph
    //const w = e.chart.width;
    //const h = e.chart.height;
    const newPoint = {x: xDataPoint, y: yDataPoint};
    console.log(newPoint);

    setGraphAnswers( oldAnswers => [ ...oldAnswers, newPoint] )

    e.chart.update();
  }

  const data = {
    labels: label[0],
    datasets: [
      {
        label: "Simulation",
        data: dataArr,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
      {
        label: "Prediction",
        data: graphAnswers,
        fill: false,
        borderColor: "rgb(247, 166, 243)",
        tension: 0.1,
      },
    ],
  };

  return (
    <Scatter
      className="graph"
      ref={ref}
      data={data}
      width={200}
      height={200}
      options={{
        maintainAspectRatio: false,
        onClick: handleClick,
        scale: {
          y: {
            min: yMin,
            max: yMax,
          },
          x: {
            min: xMin,
            max: xMax,
          },
        },
      }}
    />
  );
};

export default GraphComponent;
