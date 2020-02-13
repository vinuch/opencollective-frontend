import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Flex, Box } from '@rebass/grid';
import themeGet from '@styled-system/theme-get';
import StyledButton from '../../StyledButton';
import StyledCheckbox from '../../StyledCheckbox';
import StyledCard from '../../StyledCard';
import { H3, P, H2 } from '../../Text';
import Illustration from '../../home/HomeIllustration';
import styled from 'styled-components';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';

class ConnectGithub extends React.Component {
  constructor(props) {
    super(props);
    this.messages = defineMessages({
      guidelines: { id: 'openSourceApply.guidelines', defaultMessage: 'guidelines' },
    });
    this.state = {
      result: {},
      loadingRepos: false,
      repositories: [],
      creatingCollective: false,
    };
  }

  render() {
    const { intl } = this.props;
    return (
      <Flex alignItems="center" justifyContent="center">
        <Box mt={2} mb={4} minWidth={['400px']} maxWidth={['600px']} border="none" minHeight={['350px']}>
          <P mb={4}>
            <FormattedMessage
              id="createcollective.opensource.p1"
              defaultMessage="You're creating software. You don't want to worry about creating a legal entity or seperate bank account, paying taxes, or providing invoices to sponsors. Let us take care of all that, so you can stay focused on your project."
            />
          </P>
          <P mb={4}>
            <FormattedMessage
              id="createcollective.opensource.p2"
              defaultMessage="We have created the {osclink}, a non-profit umbrella organization, to serve the open source community. To join, you need at least 100 stars on Github or meet our alternative acceptance criteria."
              values={{
                osclink: <a href="https://opencollective.com/opensource">Open Source Collective 501c6</a>,
              }}
            />
          </P>
          <P mb={4}>
            <FormattedMessage id="createcollective.opensource.p3" defaultMessage="Fees: 10% of funds raised." />
          </P>
          <P mb={4}>
            <FormattedMessage
              id="createcollective.opensource.p4"
              defaultMessage="Our fees cover operating costs like accounting, payments, tax reporting, invoices, legal liability, use of the Open Collcetive Platform, and providing support. We also run a range of initiatives for our mission of supporting a sustainable and healthy open source ecosystem. Learn more on our website. Join us!"
            />
          </P>

          <Box mb={4}>
            <StyledCheckbox required onChange={({ checked }) => this.setState({ checked })} />
            <span>
              I agree with the{' '}
              <a href="#" target="_blank" rel="noopener noreferrer">
                terms of fiscal sponsorship
              </a>{' '}
            </span>
          </Box>
          <Flex justifyContent="center">
            <StyledButton
              mx={2}
              px={4}
              textAlign="center"
              buttonSize="large"
              buttonStyle="primary"
              onClick={() => {
                window.location.replace(this.getGithubConnectUrl());
              }}
              loading={this.state.loadingRepos}
              disabled={this.state.loadingRepos}
            >
              <FormattedMessage
                id="createcollective.opensource.VerifyStars"
                defaultMessage="Verify using GitHub stars"
              />
            </StyledButton>
            <StyledButton textAlign="center" buttonSize="large" buttonStyle="secondary" mx={2} px={4}>
              <FormattedMessage
                id="createcollective.opensource.ManualVerification"
                defaultMessage="Request manual verification"
              />
            </StyledButton>
          </Flex>
        </Box>
      </Flex>
    );
  }
}

export default injectIntl(ConnectGithub);
