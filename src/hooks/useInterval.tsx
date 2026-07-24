import React from "react";

// https://overreacted.io/making-setinterval-declarative-with-react-hooks/

export default function useInterval(
  callback: () => void,
  delay: number | null,
) {
  const savedCallback = React.useRef<() => void>(callback);

  // Remember the latest callback.
  React.useEffect(
    (...args: Any[]) => {
      void args;
      savedCallback.current = callback;
    },
    [callback],
  );

  // Set up the interval.
  React.useEffect(
    (...args: Any[]) => {
      void args;
      function tick() {
        savedCallback.current();
      }

      if (delay !== null) {
        const id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    },
    [delay],
  );
}
