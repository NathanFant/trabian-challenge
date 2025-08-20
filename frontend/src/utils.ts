export const maskAccount = (id: string, show = false) =>
  show ? id : `••••••${id.slice(-4)}`;

export const fmtMoney = (n: number) =>
  n.toLocaleString(undefined, { style: "currency", currency: "USD" });

export const cls = (...xs: Array<string | false | undefined>) =>
  xs.filter(Boolean).join(" ");
