import React, { Fragment } from "react";
import {
  Container, Message
} from "semantic-ui-react"

class ErrorPage extends React.Component {
  render() {
    return (
      <Container>
        <Message error>
          <Message.Header>Произошла ошибка инициализации приложения. Обратитесь в службу поддержки.</Message.Header>
          <p>{this.props.error.toString()}</p>
        </Message>
      </Container>
    );
  }
}

export default ErrorPage;
