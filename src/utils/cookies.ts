import Cookies from "js-cookie";

export const setCookies = (
  access_token: string,
  refresh_token: string,
  user_id: string
): void => {
  Cookies.set("access_token", access_token, { expires: 7 });
  Cookies.set("refresh_token", refresh_token, { expires: 7 });
  Cookies.set("user_id", user_id, { expires: 7 });
};

export const getCookies = (): {
  access_token: string | undefined;
  refresh_token: string | undefined;
  user_id: string | undefined;
} => {
  return {
    access_token: Cookies.get("access_token"),
    refresh_token: Cookies.get("refresh_token"),
    user_id: Cookies.get("user_id"),
  };
};

export const removeCookies = (): void => {
  Cookies.remove("access_token");
  Cookies.remove("refresh_token");
  Cookies.remove("user_id");
};
