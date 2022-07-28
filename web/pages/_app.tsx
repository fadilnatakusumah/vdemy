import "antd/dist/antd.css";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";

import { Provider } from "../context/store";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider>
      <Component {...pageProps} />
      <Toaster />
    </Provider>
  );
}

export default MyApp;
