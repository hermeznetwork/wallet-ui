export enum MyAccountActionTypes {
  CHANGE_PREFERRED_CURRENCY = "[MY ACCOUNT] CHANGE PREFERRED CURRENCY",
}

export interface ChangePreferredCurrency {
  type: MyAccountActionTypes.CHANGE_PREFERRED_CURRENCY;
  preferredCurrency: string;
}

export type MyAccountAction = ChangePreferredCurrency;

function changePreferredCurrency(preferredCurrency: string): ChangePreferredCurrency {
  return {
    type: MyAccountActionTypes.CHANGE_PREFERRED_CURRENCY,
    preferredCurrency,
  };
}

export { changePreferredCurrency };
