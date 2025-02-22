/**
 * Add link form.
 * @module components/manage/AnchorPlugin/components/LinkButton/AddLinkForm
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import unionClassNames from 'union-class-names';
import EditorUtils from 'draft-js-plugins-utils';
import { connect } from 'react-redux';
import { map } from 'lodash';
import { doesNodeContainClick } from 'semantic-ui-react/dist/commonjs/lib';
import { defineMessages, injectIntl, intlShape } from 'react-intl';

import { resetSearchContent, searchContent } from '../../../../../actions';
import URLUtils from '../../utils/URLUtils';

const messages = defineMessages({
  placeholder: {
    id: 'Enter URL or title',
    defaultMessage: 'Enter URL or title',
  },
});

/**
 * Add link form class.
 * @class AddLinkForm
 * @extends Component
 */
class AddLinkForm extends Component {
  static propTypes = {
    getEditorState: PropTypes.func.isRequired,
    setEditorState: PropTypes.func.isRequired,
    onOverrideContent: PropTypes.func.isRequired,
    theme: PropTypes.objectOf(PropTypes.any).isRequired,
    resetSearchContent: PropTypes.func.isRequired,
    searchContent: PropTypes.func.isRequired,
    search: PropTypes.arrayOf(
      PropTypes.shape({
        '@id': PropTypes.string,
        '@type': PropTypes.string,
        title: PropTypes.string,
        description: PropTypes.string,
      }),
    ),
    intl: intlShape.isRequired,
  };

  static defaultProps = {
    placeholder: 'Enter URL or search for content',
    search: [],
  };

  /**
   * Constructor
   * @method constructor
   * @param {Object} props Component properties
   * @constructs WysiwygEditor
   */
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      isInvalid: false,
    };
    this.onRef = this.onRef.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  /**
   * Component did mount
   * @method componentDidMount
   * @returns {undefined}
   */
  componentDidMount() {
    this.input.focus();
    this.props.resetSearchContent();
    document.addEventListener('mousedown', this.handleClickOutside, false);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside, false);
  }

  handleClickOutside = e => {
    if (
      this.linkFormContainer.current &&
      doesNodeContainClick(this.linkFormContainer.current, e)
    )
      return;
    this.onClose();
  };

  /**
   * Ref handler
   * @method onRef
   * @param {Object} node Node
   * @returns {undefined}
   */
  onRef(node) {
    this.input = node;
  }

  linkFormContainer = React.createRef();

  /**
   * Change handler
   * @method onChange
   * @param {Object} value Value
   * @returns {undefined}
   */
  onChange({ target: { value } }) {
    const nextState = { value };
    if (this.state.isInvalid && URLUtils.isUrl(URLUtils.normalizeUrl(value))) {
      nextState.isInvalid = false;
    }
    this.setState(nextState);
    if (value && value !== '') {
      this.props.searchContent('', {
        Title: `*${value}*`,
      });
    } else {
      this.props.resetSearchContent();
    }
  }

  /**
   * Select item handler
   * @method onSelectItem
   * @param {string} e event
   * @param {string} url Url
   * @returns {undefined}
   */
  onSelectItem = (e, url) => {
    e.preventDefault();
    this.setState({
      value: url,
      isInvalid: false,
    });
    this.props.resetSearchContent();
    this.props.setEditorState(
      EditorUtils.createLinkAtSelection(this.props.getEditorState(), url),
    );
    this.input.blur();
    this.onClose();
  };

  /**
   * Close handler
   * @method onClose
   * @returns {undefined}
   */
  onClose = () => this.props.onOverrideContent(undefined);

  /**
   * Keydown handler
   * @method onKeyDown
   * @param {Object} e Event object
   * @returns {undefined}
   */
  onKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.onSubmit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      this.onClose();
    }
  }

  /**
   * Submit handler
   * @method onSubmit
   * @returns {undefined}
   */
  onSubmit() {
    const { getEditorState, setEditorState } = this.props;
    let { value: url } = this.state;
    if (!URLUtils.isMail(URLUtils.normaliseMail(url))) {
      url = URLUtils.normalizeUrl(url);
      if (!URLUtils.isUrl(url)) {
        this.setState({ isInvalid: true });
        return;
      }
    } else {
      url = URLUtils.normaliseMail(url);
    }
    setEditorState(EditorUtils.createLinkAtSelection(getEditorState(), url));
    this.input.blur();
    this.onClose();
  }

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    const { theme } = this.props;
    const { value, isInvalid } = this.state;
    const className = isInvalid
      ? unionClassNames('ui input editor-link', theme.input, theme.inputInvalid)
      : unionClassNames('ui input editor-link', theme.input);

    return (
      <div className="link-form-container" ref={this.linkFormContainer}>
        <div
          style={{ marginLeft: '5px', display: 'flex', alignItems: 'center' }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 36 36"
            fill="#B8B2C8"
          >
            <g fillRule="evenodd">
              <path d="M27.1318,7.333 C24.4028,4.604 19.9618,4.604 17.2328,7.333 L12.9898,11.576 C11.8428,12.723 11.1288,14.248 10.9778,15.871 C10.8228,17.541 11.2708,19.211 12.2378,20.576 C12.4818,20.919 12.7278,21.213 12.9888,21.475 C13.7848,22.271 14.7778,22.868 15.8608,23.202 C16.5498,23.415 17.2548,23.519 17.9518,23.518 C19.7808,23.518 21.5598,22.804 22.8888,21.475 L23.9498,20.414 L22.5358,19 L21.4748,20.061 C20.1648,21.371 18.2388,21.842 16.4498,21.291 C15.6668,21.049 14.9778,20.635 14.4038,20.061 C14.2218,19.879 14.0478,19.668 13.8698,19.418 C13.1778,18.443 12.8588,17.249 12.9688,16.056 C13.0768,14.896 13.5868,13.808 14.4038,12.99 L18.6468,8.747 C20.5958,6.798 23.7688,6.798 25.7178,8.747 C26.6568,9.687 27.1748,10.942 27.1748,12.283 C27.1748,13.623 26.6568,14.878 25.7178,15.818 L27.1318,17.232 C28.4488,15.915 29.1748,14.157 29.1748,12.283 C29.1748,10.408 28.4488,8.65 27.1318,7.333" />
              <path d="M25.0107,16.5254 C24.2147,15.7294 23.2217,15.1324 22.1387,14.7984 C19.6417,14.0284 16.9477,14.6894 15.1107,16.5254 L14.0507,17.5864 L15.4647,19.0004 L16.5247,17.9394 C17.8357,16.6294 19.7587,16.1554 21.5497,16.7094 C22.3337,16.9514 23.0217,17.3644 23.5957,17.9394 C23.7777,18.1214 23.9527,18.3314 24.1307,18.5824 C24.8217,19.5564 25.1417,20.7514 25.0317,21.9444 C24.9237,23.1034 24.4137,24.1924 23.5957,25.0104 L19.3537,29.2534 C17.4047,31.2024 14.2317,31.2024 12.2817,29.2534 C11.3427,28.3134 10.8247,27.0574 10.8247,25.7174 C10.8247,24.3774 11.3427,23.1214 12.2817,22.1824 L10.8677,20.7684 C9.5507,22.0854 8.8247,23.8424 8.8247,25.7174 C8.8247,27.5924 9.5507,29.3504 10.8677,30.6674 C12.2327,32.0314 14.0257,32.7134 15.8177,32.7134 C17.6107,32.7134 19.4027,32.0314 20.7677,30.6674 L25.0107,26.4244 C26.1567,25.2774 26.8717,23.7524 27.0227,22.1294 C27.1777,20.4594 26.7297,18.7894 25.7617,17.4244 C25.5177,17.0814 25.2717,16.7874 25.0107,16.5254" />
            </g>
          </svg>
          <input
            className={className}
            onChange={this.onChange}
            onKeyDown={this.onKeyDown}
            ref={this.onRef}
            type="text"
            value={value}
            placeholder={this.props.intl.formatMessage(messages.placeholder)}
          />
        </div>
        <ul style={{ margin: 0, paddingLeft: '35px' }}>
          {map(this.props.search, item => (
            <li style={{ padding: '5px' }}>
              <button
                style={{ cursor: 'pointer' }}
                onClick={e => this.onSelectItem(e, item['@id'])}
                title={item['@id']}
                role="link"
              >
                {item.title}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default compose(
  injectIntl,
  connect(
    state => ({
      search: state.search.items,
    }),
    { resetSearchContent, searchContent },
  ),
)(AddLinkForm);
