import { get, groupBy } from 'lodash';
import memoizeOne from 'memoize-one';
import PropTypes from 'prop-types';
import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import { PayoutMethodType } from '../../lib/constants/payout-method';
import i18nPayoutMethodType from '../../lib/i18n-payout-method-type';
import StyledSelect from '../StyledSelect';
import { Span } from '../Text';

const newPayoutMethodMsg = defineMessages({
  [PayoutMethodType.PAYPAL]: {
    id: 'PayoutMethod.New.PayPal',
    defaultMessage: 'New PayPal account',
  },
  [PayoutMethodType.BANK_ACCOUNT]: {
    id: 'PayoutMethod.New.BankAccount',
    defaultMessage: 'New bank account',
  },
  [PayoutMethodType.OTHER]: {
    id: 'PayoutMethod.New.Other',
    defaultMessage: 'New custom payout method',
  },
  _default: {
    id: 'PayoutMethod.New.default',
    defaultMessage: 'New {pmType}',
  },
});

/**
 * An overset of `StyledSelect` specialized for payout methods. Accepts all the props
 * from `StyledSelect`.
 */
class PayoutMethodSelect extends React.Component {
  static propTypes = {
    /** @ignore from injectIntl */
    intl: PropTypes.object,
    /** The payout methods */
    payoutMethods: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.oneOf(Object.values(PayoutMethodType)),
      }),
    ),
  };

  getPayoutMethodLabel = payoutMethod => {
    if (payoutMethod.name) {
      return payoutMethod.name;
    } else if (payoutMethod.type === PayoutMethodType.PAYPAL) {
      return get(payoutMethod, 'data.email');
    } else {
      return payoutMethod.type;
    }
  };

  getDefaultData(payoutMethodType) {
    switch (payoutMethodType) {
      case PayoutMethodType.PAYPAL:
        return { email: '' };
      case PayoutMethodType.OTHER:
        return { content: '' };
      default:
        return {};
    }
  }

  getOptions = memoizeOne(payoutMethods => {
    const { formatMessage } = this.props.intl;
    const groupedPms = groupBy(payoutMethods, 'type');
    return Object.values(PayoutMethodType).map(pmType => ({
      label: i18nPayoutMethodType(formatMessage, pmType),
      options: [
        // Add existing payout methods for this type
        ...get(groupedPms, pmType, []).map(pm => ({
          value: pm,
          label: this.getPayoutMethodLabel(pm),
        })),
        // Add "+ Create new ..." for this payment type
        {
          value: {
            type: pmType,
            isSaved: true,
            data: this.getDefaultData(pmType),
          },
          label: (
            <React.Fragment>
              <Span fontWeight="bold" color="green.600" mr={1}>
                +
              </Span>
              &nbsp;
              {newPayoutMethodMsg[pmType]
                ? formatMessage(newPayoutMethodMsg[pmType])
                : formatMessage(newPayoutMethodMsg._default, { pmType })}
            </React.Fragment>
          ),
        },
      ],
    }));
  });

  render() {
    const { payoutMethods, ...props } = this.props;
    return <StyledSelect data-cy="payout-method-select" {...props} options={this.getOptions(payoutMethods)} />;
  }
}

export default injectIntl(PayoutMethodSelect);
