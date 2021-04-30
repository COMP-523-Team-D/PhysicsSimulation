import { FormLabel, InputGroup, FormControl } from "react-bootstrap";

const QandA = ({question}) => {
  return (
    <>
      <FormLabel className="question-sub-header">
        {question}
      </FormLabel>
      <InputGroup>
        <FormControl as="textarea" className="frqTextArea" />
      </InputGroup>
    </>
  );
};

export default QandA;
