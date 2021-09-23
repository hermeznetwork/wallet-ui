import React from "react";
import PropTypes from "prop-types";
import { BigNumber } from "ethers";
import { useLocation } from "react-router-dom";

import useSwapFormStyles from "./swap-form.style";
import { ReactComponent as ArrowDown } from "../../../../images/icons/arrow-down-circle.svg";
import AmountBox, { AmountBoxPosition } from "../amount-box/amount-box.view";
import SelectedQuote from "../selected-quote/selected-quote.view";
import SwapButton from "../swap-button/swap-button.view";
import { getFixedTokenAmount } from "../../../../utils/currencies";

function SwapForm({
  accounts,
  quotes,
  preferredCurrency,
  fiatExchangeRates,
  amountFrom,
  amountTo,
  selectedTokens,
  selectedQuote,
  bestQuote,
  onAmountFromChange,
  onAmountToChange,
  onSelectedTokensChange,
  onGoToQuotes,
  onOpenQuoteSidenav,
  onLoadAccounts,
  onLoadQuotes,
}) {
  const classes = useSwapFormStyles();
  const { search } = useLocation();
  const delayQuotes = 1000;
  const urlSearchParams = new URLSearchParams(search);
  const fromQuery = urlSearchParams.get(AmountBoxPosition.FROM);
  const toQuery = urlSearchParams.get(AmountBoxPosition.TO);
  const amountPositions = {
    [AmountBoxPosition.FROM]: { amount: amountFrom },
    [AmountBoxPosition.TO]: { amount: amountTo },
  };

  const [activeDropdown, setActiveDropdown] = React.useState();
  const [defaultValues, setDefaultValues] = React.useState(amountPositions);
  const [positionUpdated, handlePositionUpdated] = React.useState();
  const [areLoadingQuotes, setAreLoadingQuotes] = React.useState(false);
  const [timer, setTimer] = React.useState(0);

  const handleTokenChange = (tokenPosition) => {
    onSelectedTokensChange({ ...selectedTokens, ...tokenPosition });
    handlePositionUpdated(AmountBoxPosition.FROM);
    handleAmountChange({ amount: { tokens: amountFrom } }, AmountBoxPosition.FROM);
  };

  React.useEffect(() => {
    if (accounts.status === "pending") {
      onLoadAccounts(undefined);
    }
  }, [accounts]);

  React.useEffect(() => {
    const from = accounts.data?.accounts.find((a) => a.accountIndex === fromQuery);
    const to = accounts.data?.accounts.find((a) => a.accountIndex === toQuery);

    if (from && to) {
      onSelectedTokensChange({
        [AmountBoxPosition.FROM]: from,
        [AmountBoxPosition.TO]: to,
      });
    }
  }, [accounts]);

  React.useEffect(() => {
    if (quotes.status !== "successful") return;
    setAreLoadingQuotes(false);

    if (!selectedQuote) return;

    const from = BigNumber.from(selectedQuote.amountFromToken);
    const to = BigNumber.from(selectedQuote.amountToToken);

    onAmountFromChange(from);
    onAmountToChange(to);

    if (positionUpdated === AmountBoxPosition.TO) {
      setDefaultValues({
        ...defaultValues,
        [AmountBoxPosition.FROM]: { amount: from },
      });
    } else {
      setDefaultValues({
        ...defaultValues,
        [AmountBoxPosition.TO]: { amount: to },
      });
    }
  }, [selectedQuote]);

  const handleAmountChange = (value, position) => {
    clearTimeout(timer);

    if (selectedTokens.from && selectedTokens.to && positionUpdated === position) {
      if (value.amount.tokens.eq(0)) {
        return;
      }

      setAreLoadingQuotes(true);

      const initData = {
        fromToken: selectedTokens.from.token.ethereumAddress,
        toToken: selectedTokens.from.token.ethereumAddress,
        fromHezAddr: selectedTokens.from.accountIndex,
      };
      const data =
        position === AmountBoxPosition.TO
          ? { ...initData, amountToToken: value.amount.tokens.toString() }
          : { ...initData, amountFromToken: value.amount.tokens.toString() };

      const tempTimer = setTimeout(() => onLoadQuotes(data), delayQuotes);
      setTimer(tempTimer);
    }
  };

  const handleTokensSwitch = () => {
    if (amountFrom && amountTo) {
      handlePositionUpdated(AmountBoxPosition.FROM);
      onAmountFromChange(amountTo);
      onAmountToChange(amountFrom);
      setDefaultValues({
        [AmountBoxPosition.FROM]: { amount: amountTo },
        [AmountBoxPosition.TO]: { amount: amountFrom },
      });
    }
    onSelectedTokensChange({
      [AmountBoxPosition.FROM]: selectedTokens.to,
      [AmountBoxPosition.TO]: selectedTokens.from,
    });
  };

  const renderBox = (position) => {
    const { amount } = defaultValues[position];
    const value = getFixedTokenAmount(amount, selectedTokens[position]?.token.decimals);
    return (
      <AmountBox
        account={selectedTokens[position]}
        transactionType="Transfer" // TODO we need to check this with the new api
        fiatExchangeRates={fiatExchangeRates}
        preferredCurrency={preferredCurrency}
        l2Fee={0}
        onChange={(value) => handleAmountChange(value, position)}
        position={position}
        accounts={accounts.data?.accounts}
        onTokenChange={handleTokenChange}
        onActiveDropdownChange={setActiveDropdown}
        isDropdownActive={activeDropdown === position}
        onPositionUpdate={handlePositionUpdated}
        defaultValue={value}
      />
    );
  };

  return (
    <div className={classes.root}>
      {renderBox(AmountBoxPosition.FROM)}
      <div className={classes.circleBox}>
        <div className={classes.circle} onClick={handleTokensSwitch}>
          <ArrowDown />
        </div>
      </div>
      {renderBox(AmountBoxPosition.TO)}
      <SelectedQuote
        selectedTokens={selectedTokens}
        selectedQuote={selectedQuote}
        bestQuote={bestQuote}
        isLoading={areLoadingQuotes}
        preferredCurrency={preferredCurrency}
        fiatExchangeRates={fiatExchangeRates}
        onGoToQuotes={onGoToQuotes}
        onOpenQuoteSidenav={onOpenQuoteSidenav}
      />
      {areLoadingQuotes || <SwapButton quotes={quotes} selectedQuote={selectedQuote} />}
    </div>
  );
}

SwapForm.propTypes = {
  accounts: PropTypes.object,
  quotes: PropTypes.object,
  preferredCurrency: PropTypes.string,
  fiatExchangeRatesTask: PropTypes.object,
  amountFrom: PropTypes.object,
  amountTo: PropTypes.object,
  selectedTokens: PropTypes.object,
  selectedLpId: PropTypes.string,
  onAmountFromChange: PropTypes.func,
  onAmountToChange: PropTypes.func,
  onSelectedTokensChange: PropTypes.func,
  onGoToQuotes: PropTypes.func,
  onOpenQuoteSidenav: PropTypes.func,
  onLoadAccounts: PropTypes.func,
  onLoadQuotes: PropTypes.func,
};

export default SwapForm;
