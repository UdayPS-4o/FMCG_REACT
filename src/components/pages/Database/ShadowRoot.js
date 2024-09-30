// ShadowRoot.jsx
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

class ShadowRoot extends React.Component {
  constructor(props) {
    super(props);
    this.containerRef = React.createRef();
  }

  componentDidMount() {
    this.shadowRoot = this.containerRef.current.attachShadow({ mode: 'open' });
    this.renderContent();
  }

  componentDidUpdate() {
    this.renderContent();
  }

  componentWillUnmount() {
    ReactDOM.unmountComponentAtNode(this.shadowRoot);
  }

  renderContent() {
    ReactDOM.render(
      <>
        <style>{this.props.styles}</style>
        {this.props.children}
      </>,
      this.shadowRoot
    );
  }

  render() {
    return <div ref={this.containerRef} />;
  }
}

ShadowRoot.propTypes = {
  styles: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default ShadowRoot;
