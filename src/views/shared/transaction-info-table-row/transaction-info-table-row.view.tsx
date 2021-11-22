import React from "react";
import PropTypes from "prop-types";

import useTransactionInfoRowStyles from "src/views/shared/transaction-info-table-row/transaction-info-table-row.styles";
import { ReactComponent as CopyIcon } from "src/images/icons/copy.svg";

interface TransactionInfoTableRowProps {
  title: string;
  subtitle: string | JSX.Element;
  hint?: string;
  value?: string;
  showCopyButton?: boolean;
  onCopySubtitle?: () => void;
}

function TransactionInfoTableRow({
  title,
  subtitle,
  hint,
  value,
  showCopyButton,
  onCopySubtitle,
}: TransactionInfoTableRowProps): JSX.Element {
  const classes = useTransactionInfoRowStyles();

  return (
    <div className={classes.root}>
      <div className={`${classes.row} ${classes.topRow}`}>
        <p className={classes.title}>{title}</p>
        <div className={classes.subtitle}>
          {showCopyButton && (
            <button className={classes.copyButton} onClick={onCopySubtitle}>
              <CopyIcon className={classes.copyIcon} />
            </button>
          )}
          <p>{subtitle}</p>
        </div>
      </div>
      <div className={classes.row}>
        {hint ? <p className={classes.hint}>{hint}</p> : <p className={classes.hint}>&nbsp;</p>}
        {value ? <p className={classes.value}>{value}</p> : <p className={classes.value}>&nbsp;</p>}
      </div>
    </div>
  );
}

TransactionInfoTableRow.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  value: PropTypes.string,
};

export default TransactionInfoTableRow;
