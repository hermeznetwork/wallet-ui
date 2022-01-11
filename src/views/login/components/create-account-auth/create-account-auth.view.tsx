import React from "react";

import useCreateAccountAuthStyles from "src/views/login/components/create-account-auth/create-account-auth.styles";
import Spinner from "src/views/shared/spinner/spinner.view";
// domain
import { HermezWallet } from "src/domain";

interface CreateAccountAuthProps {
  hermezAddressAuthSignature?: string;
  wallet: HermezWallet.HermezWallet;
  onCreateAccountAuthorization: (wallet: HermezWallet.HermezWallet) => void;
}

function CreateAccountAuth({
  hermezAddressAuthSignature,
  wallet,
  onCreateAccountAuthorization,
}: CreateAccountAuthProps): JSX.Element {
  const classes = useCreateAccountAuthStyles();
  React.useEffect(() => {
    onCreateAccountAuthorization(wallet);
  }, [wallet, onCreateAccountAuthorization]);

  if (!hermezAddressAuthSignature) {
    return (
      <div className={classes.accountAuth}>
        <h2 className={classes.accountAuthTitle}>Create accounts for new tokens</h2>
        <p className={classes.accountAuthText}>
          Confirm with your signature in your connected wallet that Hermez will automatically create
          accounts for your new tokens.
        </p>
        <Spinner />
      </div>
    );
  } else {
    return <Spinner />;
  }
}

export default CreateAccountAuth;
