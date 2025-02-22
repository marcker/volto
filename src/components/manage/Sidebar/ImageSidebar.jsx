import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import { Accordion, Grid, Segment } from 'semantic-ui-react';
import {
  defineMessages,
  FormattedMessage,
  injectIntl,
  intlShape,
} from 'react-intl';
import { CheckboxWidget, Icon, TextWidget } from '@plone/volto/components';
import { AlignTile, flattenToAppURL } from '@plone/volto/helpers';
import { settings } from '~/config';

import imageSVG from '@plone/volto/icons/image.svg';
import clearSVG from '@plone/volto/icons/clear.svg';
import upSVG from '@plone/volto/icons/up-key.svg';
import downSVG from '@plone/volto/icons/down-key.svg';
import navTreeSVG from '@plone/volto/icons/nav.svg';

const messages = defineMessages({
  Image: {
    id: 'Image',
    defaultMessage: 'Image',
  },
  Origin: {
    id: 'Origin',
    defaultMessage: 'Origin',
  },
  AltText: {
    id: 'Alt text',
    defaultMessage: 'Alt text',
  },
  Align: {
    id: 'Alignment',
    defaultMessage: 'Alignment',
  },
  LinkTo: {
    id: 'Link to',
    defaultMessage: 'Link to',
  },
  openLinkInNewTab: {
    id: 'Open in a new tab',
    defaultMessage: 'Open in a new tab',
  },
  NoImageSelected: {
    id: 'No image selected',
    defaultMessage: 'No image selected',
  },
  externalURL: {
    id: 'External URL',
    defaultMessage: 'External URL',
  },
});

const ImageSidebar = ({
  data,
  tile,
  onChangeTile,
  openObjectBrowser,
  required = false,
  intl,
}) => {
  const [alt, setAlt] = useState(data.alt || '');
  const [activeAccIndex, setActiveAccIndex] = useState(0);

  function handleAccClick(e, titleProps) {
    const { index } = titleProps;
    const newIndex = activeAccIndex === index ? -1 : index;

    setActiveAccIndex(newIndex);
  }

  return (
    <Segment.Group raised>
      <header className="header pulled">
        <h2>
          <FormattedMessage id="Image" defaultMessage="Image" />
        </h2>
      </header>

      {!data.url && (
        <>
          <Segment className="sidebar-metadata-container" secondary>
            <FormattedMessage
              id="No image selected"
              defaultMessage="No image selected"
            />
            <Icon name={imageSVG} size="100px" color="#b8c6c8" />
          </Segment>
        </>
      )}
      {data.url && (
        <>
          <Segment className="sidebar-metadata-container" secondary>
            {data.url.split('/').slice(-1)[0]}
            {data.url.includes(settings.apiPath) && (
              <img
                src={`${flattenToAppURL(data.url)}/@@images/image/mini`}
                alt={alt}
              />
            )}
            {!data.url.includes(settings.apiPath) && (
              <img src={data.url} alt={alt} style={{ width: '50%' }} />
            )}
          </Segment>
          <Segment className="form sidebar-image-data">
            {data.url.includes(settings.apiPath) && (
              <TextWidget
                id="Origin"
                title={intl.formatMessage(messages.Origin)}
                required={false}
                value={data.url.split('/').slice(-1)[0]}
                icon={navTreeSVG}
                iconAction={() => openObjectBrowser()}
                onChange={() => {}}
              />
            )}
            {!data.url.includes(settings.apiPath) && (
              <TextWidget
                id="external"
                title={intl.formatMessage(messages.externalURL)}
                required={false}
                value={data.url}
                icon={clearSVG}
                iconAction={() =>
                  onChangeTile(tile, {
                    ...data,
                    url: '',
                  })
                }
                onChange={() => {}}
              />
            )}
            <TextWidget
              id="alt"
              title={intl.formatMessage(messages.AltText)}
              required={false}
              value={alt}
              onChange={(name, value) => {
                onChangeTile(tile, {
                  ...data,
                  alt: value,
                });
                setAlt(value);
              }}
            />
            <Form.Field inline required={required}>
              <Grid>
                <Grid.Row>
                  <Grid.Column width="4">
                    <div className="wrapper">
                      <label htmlFor="field-align">
                        <FormattedMessage
                          id="Alignment"
                          defaultMessage="Alignment"
                        />
                      </label>
                    </div>
                  </Grid.Column>
                  <Grid.Column width="8" className="align-tools">
                    <AlignTile
                      align={data.align}
                      onChangeTile={onChangeTile}
                      data={data}
                      tile={tile}
                    />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Form.Field>
          </Segment>
          <Accordion fluid styled className="form">
            <Accordion.Title
              active={activeAccIndex === 0}
              index={0}
              onClick={handleAccClick}
            >
              Link Settings
              {activeAccIndex === 0 ? (
                <Icon name={upSVG} size="20px" />
              ) : (
                <Icon name={downSVG} size="20px" />
              )}
            </Accordion.Title>
            <Accordion.Content active={activeAccIndex === 0}>
              <TextWidget
                id="link"
                title={intl.formatMessage(messages.LinkTo)}
                required={false}
                value={data.href}
                icon={data.href ? clearSVG : navTreeSVG}
                iconAction={
                  data.href
                    ? () => {
                        onChangeTile(tile, {
                          ...data,
                          href: '',
                        });
                      }
                    : () => openObjectBrowser('link')
                }
                onChange={(name, value) => {
                  onChangeTile(tile, {
                    ...data,
                    href: value,
                  });
                }}
              />
              <CheckboxWidget
                id="openLinkInNewTab"
                title={intl.formatMessage(messages.openLinkInNewTab)}
                value={data.openLinkInNewTab ? data.openLinkInNewTab : false}
                onChange={(name, value) => {
                  onChangeTile(tile, {
                    ...data,
                    openLinkInNewTab: value,
                  });
                }}
              />
            </Accordion.Content>
          </Accordion>
        </>
      )}
    </Segment.Group>
  );
};

ImageSidebar.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
  tile: PropTypes.string.isRequired,
  onChangeTile: PropTypes.func.isRequired,
  openObjectBrowser: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
};

export default injectIntl(ImageSidebar);
