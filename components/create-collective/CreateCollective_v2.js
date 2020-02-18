import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Page from '../Page';
import CreateCollectiveHeader from './sections/CreateCollectiveHeader';
import { addCreateCollectiveMutation } from '../../lib/graphql/mutations';
import CreateCollectiveForm from './sections/CreateCollectiveForm';
import CollectiveCategoryPicker from './sections/CollectiveCategoryPicker';
import ConnectGithub from './sections/ConnectGithub';
import ErrorPage from '../ErrorPage';
import SignInOrJoinFree from '../SignInOrJoinFree';
import { get } from 'lodash';
import { defineMessages, injectIntl } from 'react-intl';
import { Router } from '../../server/pages';
import { withUser } from '../UserProvider';
import { getErrorFromGraphqlException } from '../../lib/utils';

class CreateCollective extends Component {
  static propTypes = {
    token: PropTypes.string,
    host: PropTypes.object,
    query: PropTypes.object,
    LoggedInUser: PropTypes.object, // from withUser
    refetchLoggedInUser: PropTypes.func.isRequired, // from withUser
    intl: PropTypes.object.isRequired,
    createCollective: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = { collective: { type: 'COLLECTIVE' }, result: {}, category: null, subtitle: '' };
    this.createCollective = this.createCollective.bind(this);
    this.error = this.error.bind(this);
    this.resetError = this.resetError.bind(this);
    this.messages = defineMessages({
      'host.apply.title': {
        id: 'host.apply.title',
        defaultMessage: 'Apply to create a new {hostname} collective',
      },
      'collective.create.title': {
        id: 'collective.create.title',
        defaultMessage: 'Create an Open Collective',
      },
      'collective.create.description': {
        id: 'collective.create.description',
        defaultMessage: 'The place for your community to collect money and share your finance in full transparency.',
      },
    });

    this.host = props.host || {
      type: 'COLLECTIVE',
      settings: {
        apply: {
          title: this.props.intl.formatMessage(this.messages['collective.create.title']),
          description: this.props.intl.formatMessage(this.messages['collective.create.description']),
        },
      },
    };

    this.next = props.host ? `/${props.host.slug}/apply` : '/create';
  }

  async componentDidMount() {
    const { token } = this.props;
    if (token) {
      this.setState({ category: 'opensource' });
    }
    return;
  }

  error(msg) {
    this.setState({ result: { error: msg } });
  }

  resetError() {
    this.error();
  }

  handleChange(key, value) {
    this.setState({
      [key]: value,
    });
  }

  async createCollective(CollectiveInputType) {
    if (!CollectiveInputType.tos) {
      this.setState({
        result: { error: 'Please accept the terms of service' },
      });
      return;
    }
    if (get(this.host, 'settings.tos') && !CollectiveInputType.hostTos) {
      this.setState({
        result: { error: 'Please accept the terms of fiscal sponsorship' },
      });
      return;
    }
    this.setState({ status: 'loading' });
    CollectiveInputType.type = 'COLLECTIVE';
    CollectiveInputType.HostCollectiveId = this.host.id;
    if (CollectiveInputType.tags) {
      // Meetup returns an array of tags, while the regular input stores a string
      if (typeof CollectiveInputType.tags === 'string') {
        CollectiveInputType.tags.split(',');
      }

      CollectiveInputType.tags =
        Array.isArray(CollectiveInputType.tags) && CollectiveInputType.tags.length > 0
          ? CollectiveInputType.tags.map(t => t.trim())
          : null;
    }
    CollectiveInputType.tags = [...(CollectiveInputType.tags || []), ...(this.host.tags || [])] || [];
    if (CollectiveInputType.category) {
      CollectiveInputType.tags.push(CollectiveInputType.category);
    }
    CollectiveInputType.data = CollectiveInputType.data || {};
    CollectiveInputType.data.members = CollectiveInputType.members;
    CollectiveInputType.data.meetupSlug = CollectiveInputType.meetup;
    delete CollectiveInputType.category;
    delete CollectiveInputType.tos;
    delete CollectiveInputType.hostTos;
    try {
      const res = await this.props.createCollective(CollectiveInputType);
      const collective = res.data.createCollective;
      const successParams = {
        slug: collective.slug,
      };
      this.setState({
        status: 'idle',
        result: { success: 'Collective created successfully' },
      });

      await this.props.refetchLoggedInUser();
      if (CollectiveInputType.HostCollectiveId) {
        successParams.status = 'collectiveCreated';
        successParams.CollectiveId = collective.id;
        successParams.collectiveSlug = collective.slug;
        Router.pushRoute('collective', {
          slug: collective.slug,
          status: 'collectiveCreated',
          CollectiveId: collective.id,
          CollectiveSlug: collective.slug,
        });
      } else {
        Router.pushRoute('collective', { slug: collective.slug });
      }
    } catch (err) {
      const errorMsg = getErrorFromGraphqlException(err).message;
      this.setState({ status: 'idle', result: { error: errorMsg } });
      throw new Error(errorMsg);
    }
  }

  render() {
    const { LoggedInUser, token } = this.props;
    const { category } = this.state;

    const canApply = get(this.host, 'settings.apply');

    if (!this.host) {
      return <ErrorPage loading />;
    }

    return (
      <Page>
        <div className="CreateCollective">
          <CreateCollectiveHeader
            subtitle={this.state.subtitle}
            onChange={(key, value) => this.handleChange(key, value)}
          />
          {canApply && !LoggedInUser && <SignInOrJoinFree />}
          {canApply && LoggedInUser && !category && (
            <CollectiveCategoryPicker onChange={(key, value) => this.handleChange(key, value)} />
          )}
          {canApply && LoggedInUser && category && category !== 'opensource' && (
            <CreateCollectiveForm
              host={this.host}
              subtitle={this.state.subtitle}
              collective={this.state.collective}
              onSubmit={this.createCollective}
              onChange={this.resetError}
            />
          )}
          {canApply && LoggedInUser && category === 'opensource' && (
            <ConnectGithub
              token={token}
              subtitle={this.state.subtitle}
              onChange={(key, value) => this.handleChange(key, value)}
            />
          )}
        </div>
      </Page>
    );
  }
}

export default injectIntl(withUser(addCreateCollectiveMutation(CreateCollective)));
