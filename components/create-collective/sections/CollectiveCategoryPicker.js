import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Flex, Box } from '@rebass/grid';
import { H1 } from '../../Text';
import themeGet from '@styled-system/theme-get';
import StyledButton from '../../StyledButton';
import Container from '../../Container';
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

    const ExamplesLink = styled.a`
      color: ${themeGet('colors.blue.500')};
      font-size: ${themeGet('fontSizes.Caption')}px;

      &:hover {
        color: #dc5f7d;
      }
    `;

    return (
      <div className="CollectiveCategoryPicker">
        <style jsx global>
          {`
            .categoryImage {
              height: 256px;
              width: 256px;
            }
            @media screen and (max-width: 40em) {
              .categoryImage {
                height: 192px;
                width: 192px;
              }
            }
          `}
        </style>
        <Box my={4}>
          <H1 fontSize={['H5', 'H3']} lineHeight={['H5', 'H3']} fontWeight="bold" textAlign="center">
            {intl.formatMessage(this.messages.header)}{' '}
          </H1>
        </Box>
        <Flex flexDirection="column" justifyContent="center" alignItems="center" mb={[5, 6]}>
          <Box alignItems="center">
            <Flex justifyContent="center" alignItems="center" flexDirection={['column', 'row']}>
              <Fragment>
                <Container alignItems="center" width={['312px']} mb={[4, null, null, 0]}>
                  <Flex flexDirection="column" justifyContent="center" alignItems="center">
                    <img
                      className="categoryImage"
                      src="/static/images/createcollective-opensource.png"
                      alt={intl.formatMessage(this.messages.opensource)}
                    />
                    <StyledButton
                      buttonSize="small"
                      height="35px"
                      buttonStyle="primary"
                      mt={[2, 3]}
                      mb={2}
                      px={3}
                      onClick={() => {
                        this.handleChange('category', 'opensource');
                        this.changeRoute({ verb: 'create', category: 'openSource' });
                      }}
                    >
                      {intl.formatMessage(this.messages.opensource)}
                    </StyledButton>
                    <ExamplesLink href="#">{intl.formatMessage(this.messages.examples)}</ExamplesLink>
                  </Flex>
                </Container>
                <Container
                  borderLeft={['none', null, null, `1px solid #E6E8EB`]}
                  borderTop={['1px solid #E6E8EB', null, null, 'none']}
                  alignItems="center"
                  width={['312px']}
                  mb={[4, null, null, 0]}
                >
                  <Flex flexDirection="column" justifyContent="center" alignItems="center">
                    <img
                      className="categoryImage"
                      src="/static/images/createcollective-anycommunity.png"
                      alt={intl.formatMessage(this.messages.community)}
                    />
                    <StyledButton
                      buttonSize="small"
                      height="35px"
                      buttonStyle="primary"
                      mt={[2, 3]}
                      mb={2}
                      px={3}
                      onClick={() => {
                        this.handleChange('category', 'community');
                        this.changeRoute({ verb: 'create', category: 'community' });
                      }}
                    >
                      {intl.formatMessage(this.messages.community)}
                    </StyledButton>
                    <ExamplesLink href="#">{intl.formatMessage(this.messages.examples)}</ExamplesLink>
                  </Flex>
                </Container>
                <Container
                  borderLeft={['none', null, null, '1px solid #E6E8EB']}
                  borderTop={['1px solid #E6E8EB', null, null, 'none']}
                  alignItems="center"
                  width={['312px']}
                >
                  <Flex flexDirection="column" justifyContent="center" alignItems="center">
                    <img
                      className="categoryImage"
                      src="/static/images/createcollective-climateinitiative.png"
                      alt={intl.formatMessage(this.messages.climate)}
                    />
                    <StyledButton
                      buttonSize="small"
                      height="35px"
                      buttonStyle="primary"
                      mt={[2, 3]}
                      mb={2}
                      px={3}
                      onClick={() => {
                        this.handleChange('category', 'climate');
                        this.changeRoute({ verb: 'create', category: 'climate' });
                      }}
                    >
                      {intl.formatMessage(this.messages.climate)}
                    </StyledButton>
                    <ExamplesLink href="#">{intl.formatMessage(this.messages.examples)}</ExamplesLink>
                  </Flex>
                </Container>
              </Fragment>
            </Flex>
          </Box>
        </Flex>
      </div>
    );
  }
}

export default injectIntl(CollectiveCategoryPicker);
