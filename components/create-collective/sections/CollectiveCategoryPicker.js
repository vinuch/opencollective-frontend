import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Flex, Box } from '@rebass/grid';
import { H1 } from '../../Text';
import themeGet from '@styled-system/theme-get';
import StyledButton from '../../StyledButton';
import Illustration from '../../home/HomeIllustration';
import styled from 'styled-components';
import { defineMessages, injectIntl } from 'react-intl';
import { Router } from '../../../server/pages';

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
        id: 'createCollective.category.community',
        defaultMessage: 'For any community',
      },
      opensource: {
        id: 'createCollective.category.newOpenSource',
        defaultMessage: 'For open source projects',
      },
      climate: { id: 'createCollective.category.climate', defaultMessage: 'For climate initiatives' },
      header: { id: 'createCollective.header.create', defaultMessage: 'Create a Collective' },
      examples: { id: 'createCollective.examples', defaultMessage: 'See examples' },
    });
  }

  handleChange(fieldname, value) {
    this.props.onChange(fieldname, value);
  }

  changeRoute = async params => {
    await Router.pushRoute('new-create-collective', params);
    window.scrollTo(0, 0);
  };

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
        <Flex flexDirection="column" p={4} mt={2}>
          <Box mt={4} mb={3}>
            <H1 fontSize={['H3', null, 'H1']} lineHeight={['H3', null, 'H1']} fontWeight="bold" textAlign="center">
              {intl.formatMessage(this.messages.header)}{' '}
            </H1>
          </Box>
        </Flex>
        <Flex flexDirection="column" justifyContent="center" alignItems="center" p={2}>
          <Box alignItems="center" p={3}>
            <Flex justifyContent="center" alignItems="center" p={4}>
              <Fragment>
                <Box alignItems="center" width={['400px']} p={3}>
                  <Flex flexDirection="column" justifyContent="center" alignItems="center" p={1}>
                    <Illustration
                      src="/static/images/createcollective-opensource.png"
                      display={['none', null, null, 'block']}
                      alt={intl.formatMessage(this.messages.opensource)}
                    />
                    <StyledButton
                      buttonSize="large"
                      buttonStyle="primary"
                      mb={4}
                      px={4}
                      onClick={() => {
                        this.handleChange('category', 'opensource');
                        this.changeRoute({ verb: 'create', category: 'openSource' });
                      }}
                    >
                      {intl.formatMessage(this.messages.opensource)}
                    </StyledButton>
                    <ExamplesLink href="#">{intl.formatMessage(this.messages.examples)}</ExamplesLink>
                  </Flex>
                </Box>
                <Box alignItems="center" width={['400px']} p={3} style={boxStyle}>
                  <Flex flexDirection="column" justifyContent="center" alignItems="center" p={1}>
                    <Illustration
                      src="/static/images/createcollective-anycommunity.png"
                      display={['none', null, null, 'block']}
                      alt={intl.formatMessage(this.messages.community)}
                    />
                    <StyledButton
                      buttonSize="large"
                      buttonStyle="primary"
                      mb={4}
                      px={4}
                      onClick={() => {
                        this.handleChange('category', 'community');
                        this.changeRoute({ verb: 'create', category: 'community' });
                      }}
                    >
                      {intl.formatMessage(this.messages.community)}
                    </StyledButton>
                    <ExamplesLink href="#">{intl.formatMessage(this.messages.examples)}</ExamplesLink>
                  </Flex>
                </Box>
                <Box alignItems="center" width={['400px']} p={3} style={boxStyle}>
                  <Flex flexDirection="column" justifyContent="center" alignItems="center" p={1}>
                    <Illustration
                      src="/static/images/createcollective-climateinitiative.png"
                      display={['none', null, null, 'block']}
                      alt={intl.formatMessage(this.messages.climate)}
                    />
                    <StyledButton
                      buttonSize="large"
                      buttonStyle="primary"
                      mb={4}
                      px={4}
                      onClick={() => {
                        this.handleChange('category', 'climate');
                        this.changeRoute({ verb: 'create', category: 'climate' });
                      }}
                    >
                      {intl.formatMessage(this.messages.climate)}
                    </StyledButton>
                    <ExamplesLink href="#">{intl.formatMessage(this.messages.examples)}</ExamplesLink>
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
