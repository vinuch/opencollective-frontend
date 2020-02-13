import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Flex, Box } from '@rebass/grid';
import themeGet from '@styled-system/theme-get';
import StyledButton from '../../StyledButton';
import Illustration from '../../home/HomeIllustration';
import styled from 'styled-components';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';

class CollectiveCategoryPicker extends React.Component {
  static propTypes = {
    defaultValue: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    subtitle: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = { category: null };
    this.handleChange = this.handleChange.bind(this);

    this.messages = defineMessages({
      community: {
        id: 'collective.category.community',
        defaultMessage: 'For any community',
      },
      opensource: {
        id: 'collective.category.newopensource',
        defaultMessage: 'For open source projects',
      },
      climate: { id: 'collective.category.climate', defaultMessage: 'For climate initiatives' },
      introduceSubtitle: {
        id: 'collective.subtitle.introduce',
        defaultMessage: 'Introduce your Collective to the community.',
      },
      openSourceSubtitle: {
        id: 'collective.subtitle.opensource',
        defaultMessage: 'Open source projects are invited to join the Open Source Collective fiscal host.',
      },
    });
  }

  handleChange(fieldname, value) {
    this.props.onChange(fieldname, value);
  }

  render() {
    const { intl } = this.props;

    const boxStyle = {
      borderLeft: '1px solid lightgray',
    };

    const ExamplesLink = styled.a`
      color: ${themeGet('colors.blue.500')};

      &:hover {
        color: #dc5f7d;
      }
    `;

    return (
      <div className="CollectiveCategoryPicker">
        <Flex flexDirection="column" justifyContent="center" alignItems="center" p={2}>
          <Box alignItems="center" p={3}>
            <Flex justifyContent="center" alignItems="center" p={4}>
              <Fragment>
                <Box alignItems="center" width={['400px']} p={3}>
                  <Flex flexDirection="column" justifyContent="center" alignItems="center" p={1}>
                    <Illustration
                      src="/static/images/createcollective-opensource.png"
                      display={['none', null, null, 'block']}
                      alt="For open source projects"
                    />
                    <StyledButton
                      buttonSize="large"
                      buttonStyle="primary"
                      mb={4}
                      px={4}
                      onClick={() => {
                        this.handleChange('category', 'opensource');
                        this.handleChange('subtitle', intl.formatMessage(this.messages.openSourceSubtitle));
                      }}
                    >
                      {intl.formatMessage(this.messages.opensource)}
                    </StyledButton>
                    <ExamplesLink href="#">
                      <FormattedMessage id="createCollective.examples" defaultMessage="See examples" />
                    </ExamplesLink>
                  </Flex>
                </Box>
                <Box alignItems="center" width={['400px']} p={3} style={boxStyle}>
                  <Flex flexDirection="column" justifyContent="center" alignItems="center" p={1}>
                    <Illustration
                      src="/static/images/createcollective-anycommunity.png"
                      display={['none', null, null, 'block']}
                      alt="For any community"
                    />
                    <StyledButton
                      buttonSize="large"
                      buttonStyle="primary"
                      mb={4}
                      px={4}
                      onClick={() => {
                        this.handleChange('category', 'community');
                        this.handleChange('subtitle', intl.formatMessage(this.messages.introduceSubtitle));
                      }}
                    >
                      {intl.formatMessage(this.messages.community)}{' '}
                    </StyledButton>
                    <ExamplesLink href="#">
                      <FormattedMessage id="createCollective.examples" defaultMessage="See examples" />
                    </ExamplesLink>
                  </Flex>
                </Box>
                <Box alignItems="center" width={['400px']} p={3} style={boxStyle}>
                  <Flex flexDirection="column" justifyContent="center" alignItems="center" p={1}>
                    <Illustration
                      src="/static/images/createcollective-climateinitiative.png"
                      display={['none', null, null, 'block']}
                      alt="For climate initiatives"
                    />
                    <StyledButton
                      buttonSize="large"
                      buttonStyle="primary"
                      mb={4}
                      px={4}
                      onClick={() => {
                        this.handleChange('category', 'climate');
                        this.handleChange('subtitle', intl.formatMessage(this.messages.introduceSubtitle));
                      }}
                    >
                      {intl.formatMessage(this.messages.climate)}{' '}
                    </StyledButton>
                    <ExamplesLink href="#">
                      <FormattedMessage id="createCollective.examples" defaultMessage="See examples" />
                    </ExamplesLink>
                  </Flex>
                </Box>
              </Fragment>
            </Flex>
          </Box>
        </Flex>
      </div>
    );
  }
}

export default injectIntl(CollectiveCategoryPicker);
