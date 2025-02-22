/**
 * Contact Form container.
 * @module components/theme/ContactForm/ContactForm
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Portal } from 'react-portal';
import { Container, Message, Icon } from 'semantic-ui-react';
import { defineMessages, injectIntl, intlShape } from 'react-intl';
import { Link, withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';

import { Form, Toolbar, Toast } from '../../';
import { emailNotification } from '../../../actions';
import { getBaseUrl } from '../../../helpers';

const messages = defineMessages({
  send: {
    id: 'Send',
    defaultMessage: 'Send',
  },
  contactForm: {
    id: 'Contact form',
    defaultMessage: 'Contact form',
  },
  default: {
    id: 'Default',
    defaultMessage: 'Default',
  },
  name: {
    id: 'Name',
    defaultMessage: 'Name',
  },
  from: {
    id: 'From',
    defaultMessage: 'From',
  },
  subject: {
    id: 'Subject',
    defaultMessage: 'Subject',
  },
  message: {
    id: 'Message',
    defaultMessage: 'Message',
  },
  error: {
    id: 'Error',
    defaultMessage: 'Error',
  },
  messageSent: {
    id: 'Email sent',
    defaultMessage: 'Email sent',
  },
  back: {
    id: 'Back',
    defaultMessage: 'Back',
  },
  success: {
    id: 'Success',
    defaultMessage: 'Success',
  },
});

/**
 * ContactForm class.
 * @class ContactForm
 * @extends Component
 */
class ContactForm extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    emailNotification: PropTypes.func.isRequired,
    intl: intlShape.isRequired,
    error: PropTypes.shape({
      message: PropTypes.string,
    }),
    loading: PropTypes.bool,
    loaded: PropTypes.bool,
    pathname: PropTypes.string.isRequired,
  };

  /**
   * Default properties.
   * @property {Object} defaultProps Default properties.
   * @static
   */
  static defaultProps = {
    error: null,
    loading: null,
    loaded: null,
  };

  /**
   * Constructor
   * @method constructor
   * @param {Object} props Component properties
   * @constructs WysiwygEditor
   */
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }

  /**
   * Component will receive props
   * @method componentWillReceiveProps
   * @param {Object} nextProps Next properties
   * @returns {undefined}
   */
  componentWillReceiveProps(nextProps) {
    if (this.props.loading && nextProps.loaded) {
      toast.success(
        <Toast
          success
          title={this.props.intl.formatMessage(messages.success)}
          content={this.props.intl.formatMessage(messages.saved)}
        />,
      );
    }
  }

  /**
   * On submit handler
   * @method onSubmit
   * @param {Object} data Data object.
   * @returns {undefined}
   */
  onSubmit(data) {
    this.props.emailNotification(
      data.from,
      data.message,
      data.name,
      data.subject,
    );
  }

  /**
   * Cancel handler
   * @method onCancel
   * @returns {undefined}
   */
  onCancel() {
    this.props.history.goBack();
  }
  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    return (
      <div id="contact-form">
        <Container>
          <Helmet title="Contact form" />
          {this.props.error && (
            <Message
              icon="warning"
              negative
              attached
              header={this.props.intl.formatMessage(messages.error)}
              content={this.props.error.message}
            />
          )}
          <Form
            onSubmit={this.onSubmit}
            onCancel={this.onCancel}
            formData={{ tilesLayoutFieldname: {} }}
            submitLabel={this.props.intl.formatMessage(messages.send)}
            resetAfterSubmit
            title={this.props.intl.formatMessage(messages.contactForm)}
            loading={this.props.loading}
            schema={{
              fieldsets: [
                {
                  fields: ['name', 'from', 'subject', 'message'],
                  id: 'default',
                  title: this.props.intl.formatMessage(messages.default),
                },
              ],
              properties: {
                name: {
                  title: this.props.intl.formatMessage(messages.name),
                  type: 'string',
                },
                from: {
                  title: this.props.intl.formatMessage(messages.from),
                  type: 'string',
                },
                subject: {
                  title: this.props.intl.formatMessage(messages.subject),
                  type: 'string',
                },
                message: {
                  title: this.props.intl.formatMessage(messages.message),
                  type: 'string',
                  widget: 'textarea',
                },
              },
              required: ['from', 'message'],
            }}
          />
          <Portal node={__CLIENT__ && document.getElementById('toolbar')}>
            <Toolbar
              pathname={this.props.pathname}
              inner={
                <Link
                  to={`${getBaseUrl(this.props.pathname)}`}
                  className="item"
                >
                  <Icon
                    name="arrow left"
                    size="big"
                    color="blue"
                    title={this.props.intl.formatMessage(messages.back)}
                  />
                </Link>
              }
            />
          </Portal>
        </Container>
      </div>
    );
  }
}

export default compose(
  withRouter,
  injectIntl,
  connect(
    (state, props) => ({
      loading: state.emailNotification.loading,
      loaded: state.emailNotification.loaded,
      error: state.emailNotification.error,
      pathname: props.location.pathname,
    }),
    { emailNotification },
  ),
)(ContactForm);
