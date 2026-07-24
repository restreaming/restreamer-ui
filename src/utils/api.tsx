class API {
  base: string;
  address: string;
  token: any;
  cache: Map<any, any>;
  constructor(address: any) {
    this.base = "/api";
    this.address = address;
    this.token = "";

    this.cache = new Map();
  }

  _debug(_message: any) {
    //console.log(`[CoreAPI] ${message}`);
  }

  _error(message: any) {
    console.error(`[CoreAPI] Error: ${message}`);
  }

  async _GET(path: any, options : any = {}) {
    const key = path + JSON.stringify(options);

    const data = this.cache.get(key);
    if (data !== undefined) {
      const millis = Date.now() - data.ts;

      if (millis < 950) {
        return JSON.parse(JSON.stringify(data.payload));
      }
    }

    const ts = Date.now();

    const res = await this._call("GET", path, options);

    this.cache.set(key, {
      payload: JSON.parse(JSON.stringify(res)),
      ts: ts,
    });

    return res;
  }

  async _HEAD(path: any, options : any = {}) {
    return await this._call("HEAD", path, options);
  }

  async _POST(path: any, options : any = {}) {
    return await this._call("POST", path, options);
  }

  async _PUT(path: any, options : any = {}) {
    return await this._call("PUT", path, options);
  }

  async _DELETE(path: any, options : any = {}) {
    return await this._call("DELETE", path, options);
  }

  async _PATCH(path: any, options : any = {}) {
    return await this._call("PATCH", path, options);
  }

  async _call(method: any, path: any, options: any = {}) {
    options = {
      method: method.toUpperCase(),
      expect: "any",
      headers: {},
      token: "",
      ...options,
    };

    path = this.base + path;
    if (path !== "/") {
      // remove slash at the end of the path
      if (path[path.length - 1] === "/") {
        path = path.substring(0, path.length - 1);
      }
    }

    let token = "";

    if (options.token.length !== 0) {
      token = options.token;
    } else {
      if (typeof this.token === "function") {
        token = await this.token();
      } else {
        token = this.token;
      }
    }

    if (token.length !== 0) {
      options.headers.Authorization = "Bearer " + token;
    }

    this._debug(`calling ${options.method} ${this.address + path}`);

    const res: DynamicObject = {
      err: null,
      val: null,
    };

    let response = null;

    try {
      response = await fetch(this.address + path, options);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      res.err = {
        code: -1,
        message: error.message,
      };

      this._error(res.err.message);

      return res;
    }

    const contentType = response.headers.get("Content-Type");
    let isJSON = false;

    if (contentType != null) {
      isJSON = contentType.indexOf("application/json") !== -1;
    }

    if (response.ok === false) {
      res.err = {
        code: response.status,
        message: response.statusText,
      };

      if (isJSON === true) {
        const body = await response.json();

        if ("code" in body && "message" in body) {
          res.err.message = body.message;
        } else {
          res.err.message = body;
        }
      } else {
        const body = await response.text();
        if (body.length > 0) {
          res.err.message = body;
        }
      }

      this._error(res.err.message);

      return res;
    }

    if (isJSON === true) {
      res.val = await response.json();
    } else {
      res.val = await response.text();
    }

    if (options.expect === "json") {
      if (isJSON === false) {
        res.val = null;
        res.err = {
          code: -2,
          message: `The response is not JSON as expected (${contentType})`,
        };

        this._error(res.err.message);
      }
    }

    return res;
  }

  SetAddress(address: any) {
    this.address = address;
  }

  SetToken(token: any) {
    this.token = token;
    this.cache = new Map();
  }

  async Login(username: any, password: any) {
    return await this._POST("/login", {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
      expect: "json",
    });
  }

  async LoginWithToken(token: any) {
    return await this._POST("/login", {
      headers: {
        "Content-Type": "application/json",
      },
      expect: "json",
      token: token,
    });
  }

  async RefreshToken(refresh_token: any) {
    return await this._GET("/login/refresh", {
      expect: "json",
      token: refresh_token,
    });
  }

  async About() {
    return await this._GET("/", {
      expect: "json",
    });
  }

  async Skills() {
    return await this._GET("/v3/skills", {
      expect: "json",
    });
  }

  async SkillsReload() {
    return await this._GET("/v3/skills/reload", {
      expect: "json",
    });
  }

  async Config(type: any) {
    return await this._GET("/v3/config", {
      expect: "json",
    });
  }

  async ConfigSet(config: any) {
    return await this._PUT("/v3/config", {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(config),
      expect: "json",
    });
  }

  async ConfigReload(type: any) {
    return await this._GET("/v3/config/reload");
  }

  async Log() {
    return await this._GET("/v3/log", {
      expect: "json",
    });
  }

  async ActiveSessions(collectors: any) {
    return await this._GET(
      "/v3/session/active?collectors=" +
        encodeURIComponent(collectors.join(",")),
      {
        expect: "json",
      },
    );
  }

  async SetMetadata(key: any, data: any) {
    return await this._PUT("/v3/metadata/" + encodeURIComponent(key), {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      expect: "json",
    });
  }

  async GetMetadata(key: any) {
    return await this._GET("/v3/metadata/" + encodeURIComponent(key), {
      expect: "json",
    });
  }

  async DataHasFile(path: any) {
    return await this._HEAD("/v3/fs/disk" + path);
  }

  async DataPutFile(path: any, data: any) {
    return await this._PUT("/v3/fs/disk" + path, {
      headers: {
        "Content-Type": "application/data",
      },
      body: data,
    });
  }

  async DataGetFile(path: any) {
    return await this._GET("/v3/fs/disk" + path);
  }

  async DataListFiles(pathPattern: any) {
    return await this._GET(
      "/v3/fs/disk?glob=" + encodeURIComponent(pathPattern),
      {
        expect: "json",
      },
    );
  }

  async DataDeleteFile(path: any) {
    return await this._DELETE("/v3/fs/disk" + path);
  }

  async MemFSListFiles(pathPattern: any) {
    return await this._GET(
      "/v3/fs/mem?glob=" + encodeURIComponent(pathPattern),
      {
        expect: "json",
      },
    );
  }

  async MemFSHasFile(path: any) {
    return await this._HEAD("/v3/fs/mem" + path);
  }

  async MemFSDeleteFile(path: any) {
    return await this._DELETE("/v3/fs/mem" + path);
  }

  async MemFSLinkFile(path: any, linkto: any) {
    return await this._PATCH("/v3/fs/mem/" + path, {
      headers: {
        "Content-Type": "application/data",
      },
      body: linkto,
    });
  }

  async Processes(reference: any = "", ids: any[] = [], filter: any[] = []) {
    let url = "/v3/process";
    const params = [];

    if (reference.length !== 0) {
      params.push("reference=" + encodeURIComponent(reference));
    }

    if (ids.length !== 0) {
      params.push("id=" + encodeURIComponent(ids.join(",")));
    }

    if (filter.length !== 0) {
      params.push("filter=" + encodeURIComponent(filter.join(",")));
    }

    if (params.length !== 0) {
      url = url + "?" + params.join("&");
    }

    return await this._GET(url, {
      expect: "json",
    });
  }

  async Process(name: any, filter: any[] = []) {
    let url = "/v3/process/" + name;
    if (filter.length !== 0) {
      url = url + "?filter=" + encodeURIComponent(filter.join(","));
    }

    return await this._GET(url, {
      expect: "json",
    });
  }

  async ProcessConfig(name: any) {
    return await this._GET(
      "/v3/process/" + encodeURIComponent(name) + "/config",
      {
        expect: "json",
      },
    );
  }

  async ProcessState(name: any) {
    return await this._GET(
      "/v3/process/" + encodeURIComponent(name) + "/state",
      {
        expect: "json",
      },
    );
  }

  async ProcessReport(name: any) {
    return await this._GET(
      "/v3/process/" + encodeURIComponent(name) + "/report",
      {
        expect: "json",
      },
    );
  }

  async ProcessCommand(name: any, command: any) {
    return await this._PUT(
      "/v3/process/" + encodeURIComponent(name) + "/command",
      {
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          command: command,
        }),
        expect: "json",
      },
    );
  }

  async ProcessDelete(name: any) {
    return await this._DELETE("/v3/process/" + encodeURIComponent(name));
  }

  async ProcessUpdate(name: any, config: any) {
    return await this._PUT("/v3/process/" + encodeURIComponent(name), {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(config),
    });
  }

  async ProcessSetMetadata(name: any, key: any, data: any) {
    return await this._PUT(
      "/v3/process/" +
        encodeURIComponent(name) +
        "/metadata/" +
        encodeURIComponent(key),
      {
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        expect: "json",
      },
    );
  }

  async ProcessGetMetadata(name: any, key: any) {
    return await this._GET(
      "/v3/process/" +
        encodeURIComponent(name) +
        "/metadata/" +
        encodeURIComponent(key),
      {
        expect: "json",
      },
    );
  }

  async ProcessAdd(config: any) {
    return await this._POST("/v3/process", {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(config),
      expect: "json",
    });
  }

  async ProcessProbe(name: any) {
    return await this._GET(
      "/v3/process/" + encodeURIComponent(name) + "/probe",
      {
        expect: "json",
      },
    );
  }

  async Metrics(query: any) {
    return await this._POST("/v3/metrics", {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(query),
      expect: "json",
    });
  }

  async RTMPChannels() {
    const res = await this._GET("/v3/rtmp", {
      expect: "json",
    });

    if (res.err !== null) {
      return res;
    }

    res.val = res.val.map((f: any) => f.name);

    return res;
  }

  async SRTChannels() {
    const res = await this._GET("/v3/srt", {
      expect: "json",
    });

    if (res.err !== null) {
      return res;
    }

    const val = res.val;
    res.val = [];

    for (const path in val.publisher) {
      res.val.push(path);
    }

    return res;
  }
}

export default API;
