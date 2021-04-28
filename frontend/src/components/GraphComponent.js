import { Line } from "react-chartjs-2";
import { useEffect, useRef, useState } from "react";

const GraphComponent = ({ ind, dep, ...rest }) => {
  const ref = useRef();

  const [dataArr, setDataArr] = useState([]);

  const initializeData = () => {
    let tempArr = [];
    for (let i = 0; i <= ind?.length; i++) {
      tempArr.push({ x: ind[i], y: dep[i] });
    }
    setDataArr(tempArr);
  };

  useEffect(() => {
    ind && dep && initializeData();
  }, [ind, dep]);

  function handleClick(e, element) {
    let dataSet = e.chart.config.data.datasets;
    // Add y value
    dataSet[1].data.push({ x: e.x.toFixed(2).toString(), y: e.y.toFixed(2) });
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
        label: "My best guess",
        data: [],
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
      options={{ maintainAspectRatio: false, onClick: handleClick }}
    />
  );
};

export default GraphComponent;
