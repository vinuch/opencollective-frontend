import React from 'react';
import PropTypes from 'prop-types';
import { Formik, Field, Form } from 'formik';
import { Flex, Box } from '@rebass/grid';
import { assign, get } from 'lodash';
import StyledCheckbox from '../../StyledCheckbox';
import StyledInput from '../../StyledInput';
import StyledInputField from '../../StyledInputField';
import StyledInputGroup from '../../StyledInputGroup';
import StyledButton from '../../StyledButton';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';
import { defaultBackgroundImage } from '../../../lib/constants/collectives';

class CreateCollectiveForm extends React.Component {
  static propTypes = {
    host: PropTypes.object,
    collective: PropTypes.object,
    loading: PropTypes.bool,
    onSubmit: PropTypes.func,
    intl: PropTypes.object.isRequired,
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

    this.categories = get(props.host, 'settings.apply.categories') || [];

    if (this.categories.length === 1) {
      this.state.collective.category = this.categories[0];
    }

    this.messages = defineMessages({
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
    const collective = {};

    collective[fieldname] = value;

    this.setState({
      collective: assign(this.state.collective, collective),
    });
  }

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
                      label="What's the name of your collective?"
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
                      label="What URL would you like?"
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
                      label="What does your collective do?"
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
                        <FormattedMessage id="collective.create.button" defaultMessage="Create Collective" />
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
