import React from "react";

import Container from "src/views/shared/container/container.view";
import useFormContainerStyles from "./form.container.styles";

const FormContainer: React.FC = ({ children }) => {
  const classes = useFormContainerStyles();

  return (
    <div className={classes.root}>
      <Container disableTopGutter>
        <section className={classes.section}>{children}</section>
      </Container>
    </div>
  );
};

export default FormContainer;
