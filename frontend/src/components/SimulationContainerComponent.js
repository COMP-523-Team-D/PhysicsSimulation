/*
 * Simple wrapper for a simulation iframe provided from PhET
 *
 * Date: 5/9/21
 * @author: Gabe Foster
 * */

const SimulationContainerComponent = ({ reloadFlag, simName, simSrcPath }) => {
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
