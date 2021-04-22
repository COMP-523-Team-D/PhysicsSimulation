const SimulationContainerComponent = ({
  reloadFlag,
  simName,
  simSrcPath,
}) => {
  return (
    <iframe
      key={reloadFlag}
      className="phet-sim"
      src={simSrcPath}
      scrolling="no"
      allowFullScreen
      title={simName}
    ></iframe>
  );
};

export default SimulationContainerComponent;
