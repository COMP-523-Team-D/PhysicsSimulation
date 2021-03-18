import { Card, Container, Row } from "react-bootstrap";

const QuestionSet = (props) => {
  return (
    <Card className="d-flex align-self-center questions-card">
      <Card.Header>
        <Container className="d-flex align-content-center">
          <span className="mr-auto">
            <button
              type="button"
              className={
                "btn btn-outline scroll-btn" +
                (qIndex == 1 ? " disabled" : " not-disabled")
              }
              onClick={() => {
                qIndex - 1 > 0 && setqIndex(qIndex - 1);
              }}
            >
              <i className="fas fa-angle-left"></i>
            </button>
          </span>
          <span className="align-self-center">
            Question {qIndex} of {questions.length}
          </span>
          <span className="ml-auto">
            <button
              type="button"
              className={
                "btn btn-outline scroll-btn" +
                (qIndex == questions.length ? " disabled" : " not-disabled")
              }
              onClick={() => {
                qIndex + 1 < questions.length + 1 && setqIndex(qIndex + 1);
              }}
            >
              <i className="fas fa-angle-right"></i>
            </button>
          </span>
        </Container>
      </Card.Header>
      <Card.Body className="questions-card-body">
        <Card.Title className="question-header my-4">
          Answer These Questions
        </Card.Title>

        <Row className="d-flex justify-content-center">
          <h2 className="question-sub-header">PUT TEXT HERE</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci
            commodi delectus deleniti dolor dolorem est facilis hic impedit, in
            laboriosam magnam nisi nulla possimus, quaerat quibusdam rem saepe
            tenetur velit?
          </p>
        </Row>
        <Row className="d-flex justify-content-center">
          <h2 className="question-sub-header">PUT TEXT HERE</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci
            commodi delectus deleniti dolor dolorem est facilis hic impedit, in
            laboriosam magnam nisi nulla possimus, quaerat quibusdam rem saepe
            tenetur velit?
          </p>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default QuestionSet;
