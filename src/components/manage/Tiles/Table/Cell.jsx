/**
 * Edit text cell tile.
 * @module components/manage/Tiles/Title/Cell
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Editor from 'draft-js-plugins-editor';
import { convertFromRaw, EditorState } from 'draft-js';
import createInlineToolbarPlugin from 'draft-js-inline-toolbar-plugin';

import { settings } from '~/config';

/**
 * Edit text cell class.
 * @class Cell
 * @extends Component
 */
class Cell extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    onSelectCell: PropTypes.func.isRequired,
    row: PropTypes.number,
    cell: PropTypes.number,
    value: PropTypes.object,
    selected: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    isTableTileSelected: PropTypes.bool,
  };

  /**
   * Default properties
   * @property {Object} defaultProps Default properties.
   * @static
   */
  static defaultProps = {
    detached: false,
  };

  /**
   * Constructor
   * @method constructor
   * @param {Object} props Component properties
   * @constructs Cell
   */
  constructor(props) {
    super(props);

    if (!__SERVER__) {
      let editorState;
      editorState = EditorState.createWithContent(convertFromRaw(props.value));

      const inlineToolbarPlugin = createInlineToolbarPlugin({
        structure: settings.richTextEditorInlineToolbarButtons,
      });

      this.state = {
        editorState,
        inlineToolbarPlugin,
      };
    }

    this.onChange = this.onChange.bind(this);
  }

  /**
   * Component did mount lifecycle method
   * @method componentDidMount
   * @returns {undefined}
   */
  componentDidMount() {
    if (this.node) {
      const onFocus = this.node.editor._onFocus;
      this.node.editor._onFocus = event => {
        onFocus(event);
        this.props.onSelectCell(this.props.row, this.props.cell);
      };
    }
  }

  /**
   * Component will receive props
   * @method componentWillReceiveProps
   * @param {Object} nextProps Next properties
   * @returns {undefined}
   */
  componentWillReceiveProps(nextProps) {
    if (
      nextProps.isTableTileSelected !== this.props.isTableTileSelected &&
      this.props.cell === 0 &&
      this.props.row === 0
    ) {
      this.node.focus();
    }
  }

  /**
   * Change handler
   * @method onChange
   * @param {object} editorState Editor state.
   * @returns {undefined}
   */
  onChange(editorState) {
    this.setState({ editorState }, () => {
      this.props.onChange(this.props.row, this.props.cell, editorState);
    });
  }

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    if (__SERVER__) {
      return <div />;
    }

    const { InlineToolbar } = this.state.inlineToolbarPlugin;

    return (
      <div>
        <Editor
          onChange={this.onChange}
          editorState={this.state.editorState}
          plugins={[
            this.state.inlineToolbarPlugin,
            ...settings.richTextEditorPlugins,
          ]}
          blockRenderMap={settings.extendedBlockRenderMap}
          blockStyleFn={settings.blockStyleFn}
          ref={node => {
            this.node = node;
          }}
        />
        <InlineToolbar />
      </div>
    );
  }
}

export default Cell;
