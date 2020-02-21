import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Flex, Box } from '@rebass/grid';
import StyledButton from '../../StyledButton';
import StyledCheckbox from '../../StyledCheckbox';
import { P, H1, Span } from '../../Text';
import GithubRepositories from '../../GithubRepositories';
import StyledInputField from '../../StyledInputField';
import Loading from '../../Loading';
import GithubRepositoriesFAQ from '../../faqs/GithubRepositoriesFAQ';
import { withUser } from '../../UserProvider';
import { URLSearchParams } from 'universal-url';
import { Router } from '../../../server/pages';
import { getGithubRepos } from '../../../lib/api';
import { addCreateCollectiveFromGithubMutation } from '../../../lib/graphql/mutations';
import { getWebsiteUrl, getErrorFromGraphqlException } from '../../../lib/utils';
import { LOCAL_STORAGE_KEYS, getFromLocalStorage } from '../../../lib/local-storage';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';

class ConnectGithub extends React.Component {
  static propTypes = {
    token: PropTypes.string,
    loadingLoggedInUser: PropTypes.bool,
    LoggedInUser: PropTypes.object,
    refetchLoggedInUser: PropTypes.func,
    createCollectiveFromGithub: PropTypes.func,
    intl: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    subtitle: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.messages = defineMessages({
      guidelines: { id: 'openSourceApply.guidelines', defaultMessage: 'guidelines' },
      'tos.label': {
        id: 'createcollective.tosos.label',
        defaultMessage: 'I agree with the {tososlink}',
        values: {
          tososlink: (
            <a href="#" target="_blank" rel="noopener noreferrer">
              terms of fiscal sponsorship
            </a>
          ),
        },
      },
      openSourceSubtitle: {
        id: 'collective.subtitle.opensource',
        defaultMessage: 'Open source projects are invited to join the Open Source Collective fiscal host.',
      },
      repoSubtitleP1: {
        id: 'collective.subtitle.seeRepo',
        defaultMessage: "Don't see the repository you're looking for? Get help.",
      },
      repoSubtitleP2: {
        id: 'collective.subtitle.altVerification',
        defaultMessage: 'Want to apply using alternative verification criteria? Click here.',
      },
      repoHeader: {
        id: 'collective.header.pickarepo',
        defaultMessage: 'Pick a repo',
      },
      back: {
        id: 'createCollective.link.back',
        defaultMessage: 'Back',
      },
    });
    this.state = {
      result: {},
      loadingRepos: false,
      repositories: [],
      creatingCollective: false,
      checked: false,
    };
  }

  async componentDidMount() {
    const { token } = this.props;
    if (!token) {
      return;
    }
    this.setState({ loadingRepos: true });

    try {
      const repositories = await getGithubRepos(token);
      if (repositories.length !== 0) {
        const filteredRepos = repositories.filter(repo => repo.stargazers_count >= 100);
        this.setState({ repositories: filteredRepos, loadingRepos: false, result: {} });
      } else {
        this.setState({
          loadingRepos: false,
          result: {
            type: 'info',
            mesg: "We couldn't find any repositories (with >= 100 stars) linked to this account",
          },
        });
      }
    } catch (error) {
      this.setState({
        loadingRepos: false,
        result: { type: 'error', mesg: error.toString() },
      });
    }
  }

  handleChange(fieldname, value) {
    this.props.onChange(fieldname, value);
  }

  changeRoute = async params => {
    await Router.pushRoute('new-create-collective', params);
    window.scrollTo(0, 0);
  };

  async createCollectives(collectiveInputType) {
    collectiveInputType.type = 'COLLECTIVE';
    try {
      const res = await this.props.createCollectiveFromGithub(collectiveInputType);
      const collective = res.data.createCollectiveFromGithub;
      await this.props.refetchLoggedInUser();
      Router.pushRoute('collective', {
        slug: collective.slug,
        status: 'collectiveCreated',
      });
    } catch (err) {
      const errorMsg = getErrorFromGraphqlException(err).message;
      this.setState({
        creatingCollective: false,
        result: { type: 'error', mesg: errorMsg },
      });
    }
  }

  getGithubConnectUrl() {
    const urlParams = new URLSearchParams({ redirect: `${getWebsiteUrl()}/create/v2/openSource` });
    const accessToken = getFromLocalStorage(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);

    if (accessToken) {
      urlParams.set('access_token', accessToken);
    }

    return `/api/connected-accounts/github?${urlParams.toString()}`;
  }

  render() {
    const { token, intl } = this.props;
    const { repositories, creatingCollective, loadingRepos } = this.state;

    return (
      <div className="openSourceApply">
        {token && loadingRepos && (
          <Fragment>
            <Flex flexDirection="column" p={4} mt={2}>
              <Box textAlign="left" minHeight={['32px']}>
                <StyledButton
                  asLink
                  fontSize="Paragraph"
                  color="black.600"
                  onClick={() => {
                    this.changeRoute({ verb: 'create', category: undefined });
                    this.handleChange('category', null);
                  }}
                >
                  ←&nbsp;{intl.formatMessage(this.messages.back)}
                </StyledButton>
              </Box>
              <Box mb={3}>
                <H1 fontSize={['H3', null, 'H1']} lineHeight={['H3', null, 'H1']} fontWeight="bold" textAlign="center">
                  {intl.formatMessage(this.messages.repoHeader)}
                </H1>
              </Box>
              <Box textAlign="center" minHeight={['24px']}>
                <P>{intl.formatMessage(this.messages.repoSubtitleP1)}</P>
                <P mb={2}>{intl.formatMessage(this.messages.repoSubtitleP2)}</P>
              </Box>
            </Flex>
            <Loading />
          </Fragment>
        )}
        {token && repositories.length !== 0 && (
          <Fragment>
            <Flex flexDirection="column" p={4} mt={2}>
              <Box textAlign="left" minHeight={['32px']}>
                <StyledButton
                  asLink
                  fontSize="Paragraph"
                  color="black.600"
                  onClick={() => {
                    this.changeRoute({ verb: 'create', category: undefined });
                    this.handleChange('category', null);
                  }}
                >
                  ←&nbsp;{intl.formatMessage(this.messages.back)}
                </StyledButton>
              </Box>
              <Box mb={3}>
                <H1 fontSize={['H3', null, 'H1']} lineHeight={['H3', null, 'H1']} fontWeight="bold" textAlign="center">
                  {intl.formatMessage(this.messages.repoHeader)}
                </H1>
              </Box>
              <Box textAlign="center" minHeight={['24px']}>
                <P>{intl.formatMessage(this.messages.repoSubtitleP1)}</P>
                <P mb={2}>{intl.formatMessage(this.messages.repoSubtitleP2)}</P>
              </Box>
            </Flex>
            <Flex justifyContent="center" width={1} mb={4}>
              <Box width={[0, null, null, '24em']} />
              <Box maxWidth={500} minWidth={400}>
                <StyledInputField htmlFor="collective">
                  {fieldProps => (
                    <GithubRepositories
                      {...fieldProps}
                      repositories={repositories}
                      creatingCollective={creatingCollective}
                      onCreateCollective={data => {
                        this.setState({ creatingCollective: true });
                        this.createCollectives(data);
                      }}
                    />
                  )}
                </StyledInputField>
              </Box>
              <GithubRepositoriesFAQ mt={4} ml={4} display={['none', null, 'block']} width={1 / 5} minWidth="335px" />
            </Flex>
          </Fragment>
        )}
        {!token && (
          <Fragment>
            <Flex flexDirection="column" p={4} mt={2}>
              <Box textAlign="left" minHeight={['32px']}>
                <StyledButton
                  asLink
                  fontSize="Paragraph"
                  color="black.600"
                  onClick={() => {
                    this.changeRoute({ verb: 'create', category: undefined });
                    this.handleChange('category', null);
                  }}
                >
                  ←&nbsp;{intl.formatMessage(this.messages.back)}
                </StyledButton>
              </Box>
              <Box mb={3}>
                <H1 fontSize={['H3', null, 'H1']} lineHeight={['H3', null, 'H1']} fontWeight="bold" textAlign="center">
                  <FormattedMessage id="home.create" defaultMessage="Create a Collective" />
                </H1>
              </Box>
              <Box textAlign="center" minHeight={['24px']}>
                <Span mb={2}>{intl.formatMessage(this.messages.openSourceSubtitle)}</Span>
              </Box>
            </Flex>
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

                <Box className="tos" mx={1} my={4}>
                  <StyledCheckbox
                    name="tos"
                    label={intl.formatMessage(this.messages['tos.label'])}
                    required
                    checked={this.state.checked}
                    onChange={({ checked }) => {
                      this.handleChange('tos', checked);
                      this.setState({ checked });
                    }}
                  />
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
                  <StyledButton
                    textAlign="center"
                    buttonSize="large"
                    buttonStyle="secondary"
                    onClick={() => {
                      this.handleChange('category', 'opensourcemanual');
                      this.changeRoute({ verb: 'create', category: 'opensourcemanual' });
                    }}
                    mx={2}
                    px={4}
                  >
                    <FormattedMessage
                      id="createcollective.opensource.ManualVerification"
                      defaultMessage="Request manual verification"
                    />
                  </StyledButton>
                </Flex>
              </Box>
            </Flex>
          </Fragment>
        )}
      </div>
    );
  }
}

export default injectIntl(withUser(addCreateCollectiveFromGithubMutation(ConnectGithub)));
