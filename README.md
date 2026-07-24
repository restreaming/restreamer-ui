# Restreamer-UI

The user interface of the Restreamer for the connection to the [datarhei Core](https://github.com/datarhei/core)application.

- React
- Material-UI (MUI)

## Development

### For the Restreamer interface

```bash
git clone github.com/datarhei/restreamer-ui
cd restreamer-ui
pnpm install
npm run start
```

Connect the UI with a [datarhei Core](https://github.com/datarhei/core):
Create a `.env.local` file in the project root before starting the UI:

```env
NEXT_PUBLIC_CORE_ADDRESS=http://core-ip:core-port
```

Then open <http://localhost:3000>. If the variable is not set, the UI connects
to the same origin it was loaded from. Restart the development or production
server after changing environment variables.

### To add/fix translations

Locales are located in `src/locals`

```bash
npm run i18n-extract:clean
npm run i18n-compile
```

## License

See the [LICENSE](./LICENSE) file for licensing information.
