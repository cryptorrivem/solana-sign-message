import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";
import { useCallback, useState } from "react";
import "./App.css";
import { WalletStore } from "./wallet/wallet.store";
import base58 from "bs58";
import { useEffect } from "react";
import tweetnacl from "tweetnacl";

function Stores({ children }) {
  return <WalletStore>{children}</WalletStore>;
}

function Sign() {
  const wallet = useWallet();
  const [message, setMessage] = useState("");
  const onMessageChange = useCallback(
    (event) => setMessage(event.target.value),
    [setMessage]
  );

  const [signature, setSignature] = useState("");
  const sign = useCallback(async () => {
    const encodedMessage = new TextEncoder().encode(message);

    const encodedSignature = await wallet.signMessage(encodedMessage);
    const signature = base58.encode(encodedSignature);
    setSignature(signature);
  }, [wallet, message, setSignature]);

  return (
    <div className="sign">
      <WalletMultiButton />

      <h1>Sign</h1>
      <label>Message:</label>
      <input type="text" value={message} onChange={onMessageChange} />

      <button onClick={sign}>Sign Message</button>

      <label>Signature:</label>
      <textarea readOnly value={signature} />
    </div>
  );
}

function Validate() {
  const [message, setMessage] = useState("");
  const [signature, setSignature] = useState("");
  const [pubkey, setPubkey] = useState("");
  const [result, setResult] = useState("");

  useEffect(() => {
    if (message && signature && pubkey) {
      setResult(
        tweetnacl.sign.detached.verify(
          new TextEncoder().encode(message),
          base58.decode(signature),
          base58.decode(pubkey)
        )
      );
    }
  }, [message, signature, pubkey, setResult]);

  return (
    <div className="sign">
      <h1>Validate</h1>
      <label>Message:</label>
      <input
        type="text"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
      />
      <label>Address:</label>
      <input
        type="text"
        value={pubkey}
        onChange={(event) => setPubkey(event.target.value)}
      />
      <label>Signature:</label>
      <input
        type="text"
        value={signature}
        onChange={(event) => setSignature(event.target.value)}
      />
      <label>Result:</label>
      <div>{result.toString()}</div>
    </div>
  );
}

function App() {
  return (
    <Stores>
      <div className="App">
        <Sign />
        <Validate />
      </div>
    </Stores>
  );
}

export default App;
