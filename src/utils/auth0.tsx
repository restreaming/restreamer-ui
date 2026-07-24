import { Auth0Client } from "@auth0/auth0-spa-js";
import * as Storage from "./storage";

let client: Auth0Client | null = null;

let isAvailable = false;

try {
  new Auth0Client({
    domain: "example.eu.auth0.com",
    clientId: "some_client_id",
    authorizationParams: { audience: "https://example.com/" },
    cacheLocation: "memory",
  });

  isAvailable = true;
} catch {
  isAvailable = false;
}

const canUseAuth0 = (...args: Any[]) => {
  void args;
  return isAvailable;
};

const setConfig = (config: Any) => {
  Storage.Set(
    "auth0",
    JSON.stringify({
      domain: "",
      client_id: "",
      audience: "",
      redirect_uri: window.location.origin,
      ...config,
    }),
  );
};

const getConfig = (...args: Any[]) => {
  void args;
  let config = {
    domain: "",
    client_id: "",
    audience: "",
    redirect_uri: window.location.origin,
  };

  const data = Storage.Get("auth0");
  if (data === null) {
    return config;
  }

  try {
    const parsedConfig = JSON.parse(data);

    config = {
      ...config,
      ...parsedConfig,
    };
  } catch {}

  return config;
};

const init = (...args: Any[]) => {
  void args;
  if (canUseAuth0() === false) {
    return false;
  }

  const config = getConfig();

  if (
    config.domain.length === 0 ||
    config.client_id.length === 0 ||
    config.audience.length === 0
  ) {
    return false;
  }

  try {
    client = new Auth0Client({
      domain: config.domain,
      clientId: config.client_id,
      authorizationParams: { audience: config.audience },
      cacheLocation: "localstorage",
    });
  } catch {
    return false;
  }

  return true;
};

const handleRedirectCallback = async (...args: Any[]) => {
  void args;
  if (client === null) {
    return {
      initialized: false,
    };
  }

  const urlParams = new URLSearchParams(window.location.search.substring(1));
  if (urlParams.has("error")) {
    return {
      initialized: true,
      error: true,
      description: urlParams.has("error_description")
        ? urlParams.get("error_description")
        : "unknown error",
    };
  }

  if (urlParams.has("code") && urlParams.has("state")) {
    try {
      await client.handleRedirectCallback();
    } catch (e) {
      return {
        initialized: true,
        error: true,
        description: e instanceof Error ? e.message : String(e),
      };
    }

    urlParams.delete("code");
    urlParams.delete("state");

    const hash = urlParams.get("hash");
    urlParams.delete("hash");

    let href =
      window.location.origin +
      window.location.pathname +
      "?" +
      urlParams.toString();
    if (hash !== null) {
      href += "#" + hash;
    }

    window.location.href = href;
  }

  return {
    initialized: true,
    error: false,
  };
};

const login = async (queryParams: Any) => {
  if (client === null) {
    return false;
  }

  const config = getConfig();

  const queryString: Any[] = [];
  for (const n in queryParams) {
    queryString.push(n + "=" + encodeURIComponent(queryParams[n]));
  }

  if (queryString.length !== 0) {
    try {
      const url = new URL(config.redirect_uri);
      if (url.search.length > 1) {
        url.search = url.search + "&" + queryString.join("&");
      } else {
        url.search = "?" + queryString.join("&");
      }

      config.redirect_uri = url.href;
    } catch {}
  }

  const options: DynamicObject = {};

  try {
    await client.loginWithRedirect(options);
  } catch {
    return false;
  }

  return true;
};

const logout = async (...args: Any[]) => {
  void args;
  if (client === null) {
    return;
  }

  await client.logout({
    logoutParams: {
      returnTo: window.location.href,
    },
  });
};

const getToken = async (...args: Any[]) => {
  void args;
  let token = "";

  if (client === null) {
    return token;
  }

  try {
    token = await client.getTokenSilently();
  } catch (error) {
    console.error(error);
  }

  return token;
};

const isAuthenticated = async (...args: Any[]) => {
  void args;
  if (client === null) {
    return false;
  }

  return await client.isAuthenticated();
};

export {
  canUseAuth0,
  setConfig,
  getConfig,
  init,
  login,
  logout,
  isAuthenticated,
  getToken,
  handleRedirectCallback,
};
