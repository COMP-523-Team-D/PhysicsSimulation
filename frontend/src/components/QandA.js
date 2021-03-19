import {
  FormLabel,
  Row,
  InputGroup,
  FormControl,
  Container,
} from "react-bootstrap";

const QandA = (props) => {
  return (
    <>
      <FormLabel className="question-sub-header">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci
        commodi delectus deleniti dolor dolorem est facilis hic impedit?
      </FormLabel>
      <InputGroup>
        <FormControl as="textarea" className="frqTextArea" />
      </InputGroup>
    </>
  );
};

export default QandA;
