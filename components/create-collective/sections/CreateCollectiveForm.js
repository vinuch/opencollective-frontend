import React from 'react';
import PropTypes from 'prop-types';
import { Formik, Field, Form } from 'formik';
import { Flex, Box } from '@rebass/grid';
import { H1, P } from '../../Text';
import Container from '../../Container';
import Illustration from '../../home/HomeIllustration';
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
        defaultMessage: 'I agree with the {toslink} of Open Collective',
        values: {
          toslink: (
            <a href="/tos" target="_blank" rel="noopener noreferrer">
              terms of service
            </a>
          ),
        },
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
      name: null,
      desc: null,
      url: null,
    };

    const validate = values => {
      const errors = {};

      if (values.name.length > 10) {
        errors.name = 'Please use fewer than 10 characters';
      }

      if (values.url.length < 5) {
        errors.url = 'Please use more than 5 characters';
      }

      if (values.desc.length > 50) {
        errors.desc = 'Please limit your description to 50 characters.';
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
      <div className="CreateCollectiveForm" maxWidth={'992px'}>
        <Flex flexDirection="column" my={4}>
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
            <H1
              fontSize={['H5', 'H3']}
              lineHeight={['H5', 'H3']}
              fontWeight="bold"
              textAlign="center"
              color="black.900"
            >
              {intl.formatMessage(this.messages.header)}
            </H1>
          </Box>
          <Box textAlign="center" minHeight={['24px']}>
            <P fontSize="Paragraph" color="black.600" mb={2}>
              {intl.formatMessage(this.messages.introduceSubtitle)}
            </P>
          </Box>
        </Flex>
        <Flex alignItems="center" justifyContent="center">
          <Container
            m={[1, 4]}
            mb={[1, 5]}
            minWidth={['300px', '576px']}
            maxWidth={['500px', '576px']}
            border={['none', null, null, `1px solid #E6E8EB`]}
            borderRadius={['none', null, null, '8px']}
            px={[1, 4]}
          >
            <Formik validate={validate} initialValues={initialValues} onSubmit={submit} validateOnChange={true}>
              {formik => {
                const { values, handleSubmit, errors, touched } = formik;

                return (
                  <Form>
                    <StyledInputField
                      name="name"
                      htmlFor="name"
                      error={touched.name && errors.name}
                      label={intl.formatMessage(this.messages.nameLabel)}
                      value={values.name}
                      required
                      my={4}
                    >
                      {inputProps => <Field as={StyledInput} {...inputProps} placeholder="Guinea Pigs United" />}
                    </StyledInputField>
                    <StyledInputField
                      name="url"
                      htmlFor="url"
                      error={touched.url && errors.url}
                      label={intl.formatMessage(this.messages.urlLabel)}
                      value={values.url}
                      required
                      my={4}
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
                      error={touched.desc && errors.desc}
                      label={intl.formatMessage(this.messages.descLabel)}
                      value={values.desc}
                      required
                      my={4}
                    >
                      {inputProps => (
                        <Field
                          as={StyledInput}
                          {...inputProps}
                          placeholder="We advocate for tiny piggies everywhere!"
                        />
                      )}
                    </StyledInputField>

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
                    <Flex justifyContent={['center', 'left']} mb={4}>
                      <StyledButton
                        buttonSize="small"
                        bg="linear-gradient(180deg, #1869F5 0%, #1659E1 100%)"
                        height="36px"
                        width="148px"
                        buttonStyle="primary"
                        type="submit"
                        onSubmit={handleSubmit}
                      >
                        {intl.formatMessage(this.messages.createButton)}
                      </StyledButton>
                    </Flex>
                  </Form>
                );
              }}
            </Formik>
            <Flex justifyContent="center" mb={4} display={['flex', 'none']}>
              <Illustration
                display={['block', 'none']}
                className="formImage"
                src="/static/images/createcollective-mobile-form.png"
                width="320px"
                height="200px"
              />
            </Flex>
          </Container>
        </Flex>
      </div>
    );
  }
}

export default injectIntl(CreateCollectiveForm);
