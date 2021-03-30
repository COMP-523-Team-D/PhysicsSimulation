const SimulationContainerComponent = ({
  simVariables,
  simName,
  simSrcPath,
}) => {
  return (
    <iframe
      className="phet-sim"
      src={simSrcPath}
      scrolling="no"
      allowFullScreen
      title={simName}
    ></iframe>
  );
};

export default SimulationContainerComponent;
