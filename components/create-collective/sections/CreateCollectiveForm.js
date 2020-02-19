import React from 'react';
import PropTypes from 'prop-types';
import { Formik, Field, Form } from 'formik';
import { Flex, Box } from '@rebass/grid';
import { H1, Span } from '../../Text';
import { assign, get } from 'lodash';
import StyledCheckbox from '../../StyledCheckbox';
import StyledInput from '../../StyledInput';
import StyledInputField from '../../StyledInputField';
import StyledInputGroup from '../../StyledInputGroup';
import StyledButton from '../../StyledButton';
import { defineMessages, injectIntl } from 'react-intl';
import { defaultBackgroundImage } from '../../../lib/constants/collectives';
import { Router } from '../../../server/pages';

class CreateCollectiveForm extends React.Component {
  static propTypes = {
    host: PropTypes.object,
    collective: PropTypes.object,
    loading: PropTypes.bool,
    onSubmit: PropTypes.func,
    intl: PropTypes.object.isRequired,
    onChange: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);

    const collective = { ...(props.collective || {}) };
    collective.slug = collective.slug ? collective.slug.replace(/.*\//, '') : '';

    collective.backgroundImage = collective.backgroundImage || defaultBackgroundImage[collective.type];

    this.state = {
      collective,
      checked: false,
    };

    this.messages = defineMessages({
      introduceSubtitle: {
        id: 'createCollective.subtitle.introduce',
        defaultMessage: 'Introduce your Collective to the community.',
      },
      back: {
        id: 'createCollective.link.back',
        defaultMessage: 'Back',
      },
      header: { id: 'createCollective.header.create', defaultMessage: 'Create a Collective' },
      nameLabel: { id: 'createCollective.form.nameLabel', defaultMessage: "What's the name of your collective?" },
      urlLabel: { id: 'createCollective.form.urlLabel', defaultMessage: 'What URL would you like?' },
      descLabel: { id: 'createCollective.form.descLabel', defaultMessage: 'What does your collective do?' },
      createButton: {
        id: 'createCollective.button.create',
        defaultMessage: 'Create Collective',
      },
      'tos.label': {
        id: 'createcollective.tos.label',
        defaultMessage: `I agree with the toslink`,
        // values: {
        //   toslink: (
        //     <a href="/tos" target="_blank" rel="noopener noreferrer">
        //       terms of service of Open Collective
        //     </a>
        //   ),
        // },
      },
    });
  }

  handleChange(fieldname, value) {
    if (value === null) {
      this.props.onChange(fieldname, value);
      return;
    }

    const collective = {};

    collective[fieldname] = value;

    this.setState({
      collective: assign(this.state.collective, collective),
    });
  }

  changeRoute = async params => {
    await Router.pushRoute('new-create-collective', params);
    window.scrollTo(0, 0);
  };

  render() {
    const { host, intl } = this.props;

    const initialValues = {
      name: '',
      desc: '',
      url: '',
    };

    const validate = values => {
      const errors = {};

      if (values.name.length > 10) {
        errors.name = 'Please use fewer than 10 characters';
      }

      if (values.url.length < 5) {
        errors.url = 'Please use more than 5 characters';
      }

      if (!values.desc) {
        errors.desc = 'You need a description.';
      }

      return errors;
    };

    const submit = values => {
      const { desc, name, url } = values;
      const collective = {
        name,
        description: desc,
        website: url,
      };
      assign(collective, this.state.collective);
      this.props.onSubmit(collective);
    };

    return (
      <div className="CreateCollectiveForm">
        <Flex flexDirection="column" p={4} mt={2}>
          <Box textAlign="left" minHeight={['32px']}>
            <StyledButton
              asLink
              fontSize="Paragraph"
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
              {intl.formatMessage(this.messages.header)}
            </H1>
          </Box>
          <Box textAlign="center" minHeight={['24px']}>
            <Span mb={2}>{intl.formatMessage(this.messages.introduceSubtitle)}</Span>
          </Box>
        </Flex>
        <Flex alignItems="center" justifyContent="center">
          <Box
            p={4}
            m={4}
            minWidth={['700px']}
            maxWidth={['900px']}
            style={{ border: '1px solid lightgrey', borderRadius: 8 }}
          >
            <Formik
              validateOnChange={true}
              validateOnBlur={true}
              validate={validate}
              initialValues={initialValues}
              onSubmit={submit}
            >
              {formik => {
                const { values, handleSubmit, errors } = formik;

                return (
                  <Form>
                    <StyledInputField
                      name="name"
                      htmlFor="name"
                      error={errors.name}
                      label={intl.formatMessage(this.messages.nameLabel)}
                      value={values.name}
                      required
                      m={4}
                      p={2}
                    >
                      {inputProps => <Field as={StyledInput} {...inputProps} placeholder="Guinea Pigs United" />}
                    </StyledInputField>
                    <StyledInputField
                      name="url"
                      htmlFor="url"
                      error={errors.url}
                      label={intl.formatMessage(this.messages.urlLabel)}
                      value={values.url}
                      required
                      m={4}
                      p={2}
                    >
                      {inputProps => (
                        <Field
                          as={StyledInputGroup}
                          {...inputProps}
                          prepend="opencollective.com"
                          placeholder="guineapigs"
                        />
                      )}
                    </StyledInputField>
                    <StyledInputField
                      name="desc"
                      htmlFor="desc"
                      error={errors.desc}
                      label={intl.formatMessage(this.messages.descLabel)}
                      value={values.desc}
                      required
                      m={4}
                      p={2}
                    >
                      {inputProps => (
                        <Field
                          as={StyledInput}
                          {...inputProps}
                          placeholder="We advocate for tiny piggies everywhere!"
                        />
                      )}
                    </StyledInputField>

                    <Box className="tos" m={4} p={2}>
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
                      {get(host, 'settings.tos') && (
                        <div>
                          <StyledCheckbox
                            name="tos"
                            required
                            checked={this.state.checked}
                            onChange={({ checked }) => {
                              this.handleChange('tos', checked);
                              this.setState({ checked });
                            }}
                          />
                          <span>
                            I agree with the{' '}
                            <a href={get(host, 'settings.tos')} target="_blank" rel="noopener noreferrer">
                              the terms of fiscal sponsorship of the host
                            </a>{' '}
                            (
                            <a href={`/${host.slug}`} target="_blank" rel="noopener noreferrer">
                              {host.name}
                            </a>
                            ) that will collect money on behalf of our collective
                          </span>
                        </div>
                      )}
                    </Box>

                    <Box className="actions" m={4} p={2}>
                      <StyledButton
                        buttonSize="large"
                        buttonStyle="primary"
                        type="submit"
                        onSubmit={handleSubmit}
                        mb={4}
                      >
                        {intl.formatMessage(this.messages.createButton)}
                      </StyledButton>
                    </Box>
                  </Form>
                );
              }}
            </Formik>
          </Box>
        </Flex>
      </div>
    );
  }
}

export default injectIntl(CreateCollectiveForm);
