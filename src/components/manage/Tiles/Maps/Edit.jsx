/**
 * Edit map tile.
 * @module components/manage/Tiles/Maps/Edit
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Input, Message } from 'semantic-ui-react';
import {
  defineMessages,
  FormattedMessage,
  injectIntl,
  intlShape,
} from 'react-intl';
import cx from 'classnames';

import { Icon } from '../../../../components';
import clearSVG from '../../../../icons/clear.svg';
import imageLeftSVG from '../../../../icons/image-left.svg';
import imageRightSVG from '../../../../icons/image-right.svg';
import imageFitSVG from '../../../../icons/image-fit.svg';
import imageFullSVG from '../../../../icons/image-full.svg';
import globeSVG from '../../../../icons/globe.svg';

const messages = defineMessages({
  ImageTileInputPlaceholder: {
    id: 'Enter Map URL',
    defaultMessage: 'Enter Map URL',
  },
});

/**
 * Edit image tile class.
 * @class Edit
 * @extends Component
 */
class Edit extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    selected: PropTypes.bool.isRequired,
    tile: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    data: PropTypes.objectOf(PropTypes.any).isRequired,
    pathname: PropTypes.string.isRequired,
    onChangeTile: PropTypes.func.isRequired,
    onSelectTile: PropTypes.func.isRequired,
    onDeleteTile: PropTypes.func.isRequired,
    onFocusPreviousTile: PropTypes.func.isRequired,
    onFocusNextTile: PropTypes.func.isRequired,
    handleKeyDown: PropTypes.func.isRequired,
    intl: intlShape.isRequired,
  };

  /**
   * Constructor
   * @method constructor
   * @param {Object} props Component properties
   * @constructs WysiwygEditor
   */
  constructor(props) {
    super(props);
    this.getSrc = this.getSrc.bind(this);
    this.state = {
      uploading: false,
      url: '',
      error: null,
    };
    this.onSubmitUrl = this.onSubmitUrl.bind(this);
    this.onKeyDownVariantMenuForm = this.onKeyDownVariantMenuForm.bind(this);
  }

  /**
   * Align tile handler
   * @method onAlignTile
   * @param {string} align Alignment option
   * @returns {undefined}
   */
  onAlignTile(align) {
    this.props.onChangeTile(this.props.tile, {
      ...this.props.data,
      align,
    });
  }

  /**
   * Change url handler
   * @method onChangeUrl
   * @param {Object} target Target object
   * @returns {undefined}
   */
  onChangeUrl = ({ target }) => {
    this.setState({
      url: this.getSrc(target.value),
    });
  };

  /**
   * Submit url handler
   * @method onSubmitUrl
   * @param {string} e event
   * @returns {undefined}
   */
  onSubmitUrl() {
    this.props.onChangeTile(this.props.tile, {
      ...this.props.data,
      url: this.state.url,
    });
  }

  /**
   * Keydown handler on Variant Menu Form
   * This is required since the ENTER key is already mapped to a onKeyDown
   * event and needs to be overriden with a child onKeyDown.
   * @method onKeyDownVariantMenuForm
   * @param {Object} e Event object
   * @returns {undefined}
   */
  onKeyDownVariantMenuForm(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      this.onSubmitUrl();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      // TODO: Do something on ESC key
    }
  }

  /**
   * get getSrc handler
   * @method getSrc
   * @param {string} embed Embed HTML code from Google Maps share option
   * @returns {string} Source URL
   */
  getSrc(embed) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(embed, 'text/html');
    const iframe = doc.getElementsByTagName('iframe');
    if (iframe.length === 0) {
      this.setState({ error: true });
      return '';
    }
    this.setState({ error: false });
    return iframe[0].src;
  }

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    return (
      <div
        className={cx(
          'tile maps align',
          {
            selected: this.props.selected,
            center: !Boolean(this.props.data.align),
          },
          this.props.data.align,
        )}
      >
        {this.props.selected && !!this.props.data.url && (
          <div className="toolbar">
            <Button.Group>
              <Button
                icon
                basic
                aria-label="Left"
                onClick={() => this.onAlignTile('left')}
                active={this.props.data.align === 'left'}
              >
                <Icon name={imageLeftSVG} size="24px" />
              </Button>
            </Button.Group>
            <Button.Group>
              <Button
                icon
                basic
                aria-label="Right"
                onClick={() => this.onAlignTile('right')}
                active={this.props.data.align === 'right'}
              >
                <Icon name={imageRightSVG} size="24px" />
              </Button>
            </Button.Group>
            <Button.Group>
              <Button
                icon
                basic
                aria-label="Center"
                onClick={() => this.onAlignTile('center')}
                active={
                  this.props.data.align === 'center' || !this.props.data.align
                }
              >
                <Icon name={imageFitSVG} size="24px" />
              </Button>
            </Button.Group>
            <Button.Group>
              <Button
                icon
                basic
                aria-label="Full"
                onClick={() => this.onAlignTile('full')}
                active={this.props.data.align === 'full'}
              >
                <Icon name={imageFullSVG} size="24px" />
              </Button>
            </Button.Group>
            <div className="separator" />
            <Button.Group>
              <Button
                icon
                basic
                onClick={() =>
                  this.props.onChangeTile(this.props.tile, {
                    ...this.props.data,
                    url: '',
                  })
                }
              >
                <Icon name={clearSVG} size="24px" color="#e40166" />
              </Button>
            </Button.Group>
          </div>
        )}
        {this.props.selected && !this.props.data.url && (
          <div className="toolbar">
            <Icon name={globeSVG} size="24px" />
            <Input
              onKeyDown={this.onKeyDownVariantMenuForm}
              onChange={this.onChangeUrl}
              placeholder={this.props.intl.formatMessage(
                messages.ImageTileInputPlaceholder,
              )}
            />
          </div>
        )}
        {this.props.data.url ? (
          <div>
            <iframe
              title="Google Maps Embedded Tile"
              src={this.props.data.url}
              className="google-map"
              frameBorder="0"
              allowFullScreen
            />
          </div>
        ) : (
          <div>
            <Message>
              <Icon name={globeSVG} size="100px" color="#b8c6c8" />
              <FormattedMessage
                id="Maps instructions"
                defaultMessage="Please enter the Embed Code provided by Google Maps -> Share -> Embed map. It should contain the <iframe> code on it."
              />
              {this.state.error && (
                <span style={{ color: 'red' }}>
                  <FormattedMessage
                    id="Maps data error"
                    defaultMessage="Embed code error, please follow the instructions and try again."
                  />
                </span>
              )}
            </Message>
          </div>
        )}
      </div>
    );
  }
}

export default injectIntl(Edit);
