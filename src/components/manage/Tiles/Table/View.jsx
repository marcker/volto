/**
 * View table tile.
 * @module components/manage/Tiles/Table/View
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';
import { map } from 'lodash';
import redraft from 'redraft';

import { settings } from '~/config';

/**
 * View table tile class.
 * @class View
 * @extends Component
 */
const View = ({ data }) => (
  <p className="documentDescription">
    {data && data.table && (
      <Table
        fixed={data.table.fixed}
        compact={data.table.compact}
        basic={data.table.basic ? 'very' : false}
        celled={data.table.celled}
        inverted={data.table.inverted}
        striped={data.table.striped}
      >
        <Table.Body>
          {map(data.table.rows, row => (
            <Table.Row key={row.key}>
              {map(row.cells, cell => (
                <Table.Cell
                  key={cell.key}
                  as={cell.type === 'header' ? 'th' : 'td'}
                >
                  {cell.value && cell.value.blocks && cell.value.blocks[0].text
                    ? redraft(
                        cell.value,
                        settings.ToHTMLRenderers,
                        settings.ToHTMLOptions,
                      )
                    : '\u00A0'}
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    )}
  </p>
);

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
View.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default View;
