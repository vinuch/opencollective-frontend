import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Flex, Box } from '@rebass/grid';
import StyledButton from '../../StyledButton';
import StyledCheckbox from '../../StyledCheckbox';
import StyledCard from '../../StyledCard';
import { P, H2 } from '../../Text';
import Container from '../../Container';
import GithubRepositories from '../../GithubRepositories';
import StyledInputField from '../../StyledInputField';
import Loading from '../../Loading';
import GithubRepositoriesFAQ from '../../faqs/GithubRepositoriesFAQ';
import { URLSearchParams } from 'universal-url';
import { getGithubRepos } from '../../../lib/api';
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
    });
    this.state = {
      result: {},
      loadingRepos: false,
      repositories: [],
      creatingCollective: false,
    };
  }

  async componentDidMount() {
    const { token } = this.props;
    if (!token) {
      return;
    }
    this.setState({ loadingRepos: true });
    this.handleChange('subtitle', 'Pick a repo');

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

  //   async createCollectives(collectiveInputType) {
  //     collectiveInputType.type = 'COLLECTIVE';
  //     try {
  //       const res = await this.props.createCollectiveFromGithub(collectiveInputType);
  //       const collective = res.data.createCollectiveFromGithub;
  //       await this.props.refetchLoggedInUser();
  //       Router.pushRoute('collective', {
  //         slug: collective.slug,
  //         status: 'collectiveCreated',
  //       });
  //     } catch (err) {
  //       const errorMsg = getErrorFromGraphqlException(err).message;
  //       this.setState({
  //         creatingCollective: false,
  //         result: { type: 'error', mesg: errorMsg },
  //       });
  //     }
  //   }

  getGithubConnectUrl() {
    const urlParams = new URLSearchParams({ redirect: `${getWebsiteUrl()}/create/v2` });
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
      <Fragment>
        {token && loadingRepos && <Loading />}
        {token && repositories.length !== 0 && (
          <Container maxWidth={500} mb={4} mr={4}>
            <H2 textAlign="center" mb={3} fontSize="3.2rem">
              <FormattedMessage id="openSourceApply.GithubRepositories.title" defaultMessage="Pick a repository" />
            </H2>
            <P textAlign="center" fontSize="1.6rem" mb={4} color="black.400">
              <FormattedMessage
                id="openSourceApply.GithubRepositories.description"
                defaultMessage="Select the project you wish to create a Collective for. Only repositories with at least 100 stars are eligible."
              />
            </P>
            <Container display="flex">
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
              <Container ml={4}>
                <GithubRepositoriesFAQ mt={4} display={['none', null, 'block']} width={1 / 5} minWidth="335px" />
              </Container>
            </Container>
          </Container>
        )}
        {!token && (
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
        )}
      </Fragment>
    );
  }
}

export default injectIntl(ConnectGithub);
