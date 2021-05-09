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
  name,
  handleAnswers,
  answersToSet,
  ...rest
}) => {
  // reference to pass to Line graph
  const ref = useRef();

  // Size of Predicted Answer Array
  const predictionArraySize = 50;

  // Array of values for x axis
  const [label, setLabel] = useState([]);
  // Values that
  const [dataArr, setDataArr] = useState([]);
  // Array to store student response points
  const [pointsClicked, setPointsClicked] = useState([]);
  const [predictedAnswer, setPredictedAnswer] = useState([]);
  const [acceptingAnswers, setAcceptingAnswers] = useState(true);

  // Create x,y pairs from independent and dependent data arrays
  // and then add each pair/object to dataArr
  const initializeData = () => {
    let tempArr = [];
    for (let i = 0; i < ind?.length; i++) {
      tempArr.push({ x: ind[i], y: dep[i] });
    }
    setDataArr(tempArr);
  };

  // Set up the initial x and y scales on page load before cannon is fired
  useEffect(() => {
    ind && dep && initializeData();
  }, [ind, dep]);

  // Perform answer prediction and return points clicked to parent when a new point is added by the user
  useEffect(() => {
    predictAnswer();
    if(acceptingAnswers) {
      handleAnswers(pointsClicked, name);
    }
    
  }, [pointsClicked]);

  // function to set up initial scale with given params for
  // max x and y values passed as props
  const setUpInitScale = (min1, min2, max1, max2) => {
    let yScale = [];
    let xScale = [];
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

    if(answersToSet.length !== 0) {
      setAcceptingAnswers(false);
      setPointsClicked(answersToSet);
    }

  }, []);

  const predictAnswer = () => {
    switch(pointsClicked.length) {
      case 1:
        computeConstant();
        break;

      case 2:
        computeLine();
        break;

      case 3:
        computeParabola();
        break;

      default:
        break;
    }
  }

  const computeConstant = () => {
    const newPrediction = [];
    const scale = (xMax-xMin)/predictionArraySize;
    for(let i=0; i<predictionArraySize; i++) {
      newPrediction.push({x: i*scale, y: pointsClicked[0].y });
    }

    setPredictedAnswer( newPrediction );
  }

  const computeLine = () => {
    const slope = (pointsClicked[0].y - pointsClicked[1].y) / (pointsClicked[0].x - pointsClicked[1].x);

    const getY = x => {
      return pointsClicked[0].y + slope*(x - pointsClicked[0].x);
    }

    const getX = y => {
      return pointsClicked[0].x + (y - pointsClicked[0].y)/slope;
    }
    
    const scale = ( slope <= (yMax-yMin) / (xMax-xMin) && slope >= (yMin-yMax) / (xMax-xMin) )
      ? (xMax-xMin)/predictionArraySize
      : Math.abs(getX(yMax) - getX(yMin))/predictionArraySize;

    const initialX = ( slope <= (yMax-yMin) / (xMax-xMin) && slope >= (yMin-yMax) / (xMax-xMin) )
      ? xMin
      : Math.min(getX(yMin), getX(yMax));

    const newPrediction = [];
    for(let i=0; i<predictionArraySize; i++) {
      newPrediction.push({x: i*scale + initialX, y: getY(i*scale + initialX) });
    }

    setPredictedAnswer(newPrediction);
  }

  const computeParabola = () => {
    const x0 = pointsClicked[0].x;
    const x1 = pointsClicked[1].x;
    const x2 = pointsClicked[2].x;
    const y0 = pointsClicked[0].y;
    const y1 = pointsClicked[1].y;
    const y2 = pointsClicked[2].y;

    // Closed form expression for a parabola interpolated from 3 points
    const a = -( x0*y1 - x1*y0 - x0*y2 + x2*y0 + x1*y2 - x2*y1 ) / ( (x0 - x1)*(x0 - x2)*(x1 - x2) );
    const b =  ( (x0**2)*y1 - (x1**2)*y0 - (x0**2)*y2 + (x2**2)*y0 + (x1**2)*y2 - (x2**2)*y1 ) / ( (x0 - x1)*(x0 - x2)*(x1 - x2) );
    const c =  -( -y2*(x0**2)*x1 + y1*(x0**2)*x2 + y2*x0*(x1**2) - y1*x0*(x2**2) - y0*(x1**2)*x2 + y0*x1*(x2**2)) / ( (x0 - x1)*(x0 - x2)*(x1 - x2) );
    
    const newPrediction = [];
    const scale = (xMax-xMin)/predictionArraySize;
    for(let i=0; i<predictionArraySize; i++) {
      newPrediction.push({x: i*scale, y: a*((i*scale)**2) + b*(i*scale) + c });
    }

    setPredictedAnswer(newPrediction);
  }


  // Pulls chart from the event and
  // inserts a new x,y pair into the guess line
  // that corresponds to where the click was on the graph
  function handleClick(e) {
    if(acceptingAnswers && pointsClicked.length < 3) {
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

      const xDataPoint = xMin + xChartRatio*xAxisScale;
      const yDataPoint = yMin + yChartRatio*yAxisScale;


      // Repeat for the width and height of the graph
      const newPoint = {x: xDataPoint, y: yDataPoint};

      setPointsClicked( oldPoints => [ ...oldPoints, newPoint]);

      // Chart updated in setPointsClicked callback function
      e.chart.update();
    }else if(acceptingAnswers) {
      setPointsClicked([]);
      setPredictedAnswer([]);
    }
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
        data: predictedAnswer,
        fill: false,
        borderColor: "rgb(247, 166, 243)",
        tension: 0.1,
      },
      {
        label: "User Clicks",
        data: pointsClicked,
        fill: false,
        borderColor: "rgb(0, 0, 0)",
        tension: 0.1
      }
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
