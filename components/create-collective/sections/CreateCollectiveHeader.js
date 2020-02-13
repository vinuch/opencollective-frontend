import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { H1, Span } from '../../Text';
import { Flex, Box } from '@rebass/grid';
import { FormattedMessage } from 'react-intl';

class CreateCollectiveHeader extends React.Component {
  static propTypes = {
    subtitle: PropTypes.string,
    onChange: PropTypes.func.isRequired,
  };

  handleChange(fieldname, value) {
    this.props.onChange(fieldname, value);
  }

  render() {
    return (
      <Fragment>
        <Flex flexDirection="column" p={4} mt={2}>
          <Box textAlign="left">
            <a
              onClick={() => {
                this.handleChange('category', null);
                this.handleChange('subtitle', '');
              }}
            >
              Back
            </a>
          </Box>
          <Box>
            <H1
              fontSize={['H3', null, 'H1']}
              lineHeight={['H3', null, 'H1']}
              fontWeight="bold"
              textAlign="center"
              mb={3}
            >
              <FormattedMessage id="home.create" defaultMessage="Create a Collective" />
            </H1>
          </Box>
          <Box textAlign="center">
            <Span mb={2}>{this.props.subtitle}</Span>
          </Box>
        </Flex>
      </Fragment>
    );
  }
}

export default CreateCollectiveHeader;
