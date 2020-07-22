import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Container, Header, Divider, Button,
} from 'semantic-ui-react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import ethers from 'ethers';

import {
  handleLoadOperator, handleLoadMetamask
} from '../../../state/general/actions';
import { handleInitStateTx } from '../../../state/tx/actions';

const config = require('../../../utils/config.json');

class InitView extends Component {
  static propTypes = {
    isAuthed: PropTypes.bool.isRequired,
    handleInitStateTx: PropTypes.func.isRequired,
    handleLoadOperator: PropTypes.func.isRequired,
    handleLoadMetamask: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.passwordRef = React.createRef();
    this.fileNameRef = React.createRef();
  }

  componentDidMount = () => {
    window.ethers = ethers;
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('node')) {
      const tokenInfura = urlParams.get('node');
      const node = `https://goerli.infura.io/v3/${tokenInfura}`;
      config.nodeEth = node;
    }
  }

  checkMetamask = () => {
    const { ethereum } = window;
    return Boolean(ethereum && ethereum.isMetaMask);
  }

  signInMetamask = async () => {
    if (this.checkMetamask()) {
      try {
        await this.props.handleInitStateTx();
        await this.props.handleLoadOperator(config);
        await this.props.handleLoadMetamask();
      } catch (error) {
        console.error(error);
      }
    }
  }

  renderRedirect = () => {
    console.log(this.props.isAuthed)
    if (this.props.isAuthed === true) {
      return <Redirect to="/actions" />;
    }
  }

  render() {
    return (
      <Container textAlign="center">
        <Header
          as="h1"
          style={{
            fontSize: '4em',
            fontWeight: 'normal',
            marginBottom: 0,
            marginTop: '3em',
          }}>
          Rollup
        </Header>
        <Divider />
        <Button.Group vertical>
          <Button
            content="Sign In Metamask"
            icon="plus"
            size="massive"
            color="blue"
            onClick={this.signInMetamask} />
        </Button.Group>
        {this.renderRedirect()}
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthed: state.general.isAuthed,
});

export default connect(mapStateToProps, {
  handleLoadOperator,
  handleLoadMetamask,
  handleInitStateTx,
})(InitView);
