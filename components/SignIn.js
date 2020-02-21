import React from 'react';
import PropTypes from 'prop-types';

import { Box, Flex } from '@rebass/grid';
import Container from './Container';
import StyledButton from './StyledButton';
import StyledCard from './StyledCard';
import StyledInput from './StyledInput';
import { H5, P, Span } from './Text';
import { FormattedMessage } from 'react-intl';
import StyledLink from './StyledLink';
import { Link } from '../server/pages';

/**
 * Component for handing user sign-in or redirecting to sign-up.
 */
export default class SignIn extends React.Component {
  static propTypes = {
    /** handles the email input submission, a.k.a Sign In */
    onSubmit: PropTypes.func.isRequired,
    /** handles the redirect from sign-in, a.k.a Join Free. Accepts URLs (string) or custom action func */
    onSecondaryAction: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
    /** When set to true, will show a spinner in Sign In button and will disable all actions */
    loading: PropTypes.bool,
    /** Set this to true to display the unknown email message */
    unknownEmail: PropTypes.bool,
    /** Set the value of email input */
    email: PropTypes.string.isRequired,
    /** handles changes in the email input */
    onEmailChange: PropTypes.func.isRequired,
  };

  state = { error: null, showError: false };

  renderSecondaryAction(message) {
    const { loading, onSecondaryAction } = this.props;
    return typeof onSecondaryAction === 'string' ? (
      <Link route={onSecondaryAction} passHref>
        <StyledLink disabled={loading} fontSize="Paragraph">
          {message}&nbsp;→
        </StyledLink>
      </Link>
    ) : (
      <StyledButton asLink fontSize="Paragraph" onClick={onSecondaryAction} disabled={loading}>
        {message}&nbsp;→
      </StyledButton>
    );
  }

  render() {
    const { onSubmit, loading, unknownEmail, email, onEmailChange } = this.props;
    const { error, showError } = this.state;
    return (
      <StyledCard maxWidth={480} width={1}>
        <Box py={4} px={[3, 4]}>
          <H5 as="label" fontWeight="bold" htmlFor="email" mb={3} textAlign="left" display="block">
            <FormattedMessage id="signin.usingEmail" defaultMessage="Sign in using your email address:" />
          </H5>
          <Flex
            as="form"
            method="POST"
            noValidate
            data-cy="signIn-form"
            onSubmit={event => {
              event.preventDefault();
              onSubmit(email);
            }}
          >
            <StyledInput
              error={!!error}
              fontSize="Paragraph"
              id="email"
              name="email"
              minWidth={120}
              onChange={({ target }) => {
                onEmailChange(target.value);
                // Feel free to remove the setTimeout when that issue is fixed
                // https://bugzilla.mozilla.org/show_bug.cgi?id=1524212
                setTimeout(() => {
                  this.setState({ error: target.validationMessage, showError: false });
                }, 0);
              }}
              onKeyDown={e => {
                // See https://github.com/facebook/react/issues/6368
                if (e.key === ' ') {
                  e.preventDefault();
                }
              }}
              onBlur={() => this.setState({ showError: true })}
              onInvalid={event => {
                event.preventDefault();
                this.setState({ error: event.target.validationMessage });
              }}
              placeholder="i.e. yourname@yourhost.com"
              required
              value={email}
              type="email"
              width={1}
            />
            <StyledButton
              data-cy="signin-btn"
              buttonStyle="primary"
              fontWeight="600"
              disabled={!email || error}
              loading={loading}
              minWidth={100}
              ml={3}
              type="submit"
            >
              Sign In
            </StyledButton>
          </Flex>
          {error && showError && (
            <Span display="block" color="red.500" pt={2} fontSize="Tiny" lineHeight="Tiny" aria-live="assertive">
              {error}
            </Span>
          )}
          {unknownEmail && (
            <Span display="block" color="black.600" pt={2} fontSize="Tiny" lineHeight="Tiny" aria-live="assertive">
              <FormattedMessage id="signin.unknownEmail" defaultMessage="There is no user with this email address." />{' '}
              {this.renderSecondaryAction(<FormattedMessage id="signin.joinForFree" defaultMessage="Join for free!" />)}
            </Span>
          )}
        </Box>

        <Container alignItems="center" bg="black.50" px={[3, 4]} py={3} display="flex" justifyContent="center">
          <P color="black.700" mr={2}>
            <FormattedMessage id="signin.noAccount" defaultMessage="Don't have an account?" />
          </P>
          {this.renderSecondaryAction(<FormattedMessage id="signin.joinFree" defaultMessage="Join Free" />)}
        </Container>
      </StyledCard>
    );
  }
}
