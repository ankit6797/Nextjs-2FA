"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { TOTP } from "otpauth";
import OTPInput from "react-otp-input";
import { useRouter } from "next/navigation";

// Verify2FA Component
type Verify2FAProps = {
  secret: string;
  email: string;
};

const Verify2FA = ({ secret, email }: Verify2FAProps) => {
  const [token, setToken] = useState<string>("");
  const [verified, setVerified] = useState<boolean | null>(null);
  const router = useRouter();

  const verifyToken = () => {
    // Create an instance of the OTPAuth object for verification
    const totp = new TOTP({
      secret: secret, // Use decoded secret
      algorithm: "SHA1",
      digits: 6,
      period: 30,
    });

    // Verify the token
    const isVerified = totp.validate({ token: token, window: 1 }) !== null;

    setVerified(isVerified);
    router.push("/home");
    localStorage.setItem("user", email);
  };

  return (
    <div className="w-full">
      <p className="text-gray-700 text-xl text-center my-3">Verify 2FA Token</p>
      <OTPInput
        value={token}
        onChange={setToken}
        numInputs={6}
        renderSeparator={<span>-</span>}
        renderInput={(props) => <input {...props} />}
        inputStyle={{
          width: "100%",
          maxWidth: "50px",
          height: "50px",
          margin: "0 5px",
          fontSize: "24px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          textAlign: "center",
          color: "#333",
        }}
      />
      <button
        className="py-2 px-5 mt-3 text-white bg-orange-500 border w-full rounded-lg hover:bg-white hover:text-orange-500 hover:border-orange-500"
        onClick={verifyToken}
      >
        Verify
      </button>

      {verified === true && <p className="text-green-600">Token Verified!</p>}
      {verified === false && <p className="text-red-600">Invalid Token</p>}
    </div>
  );
};

// Setup2FA Component
const Setup2FA = ({ email }: { email: string }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [secret, setSecret] = useState<string>("");

  // Function to generate secret and QR code
  const generateSecret = () => {
    const totp = new TOTP({
      issuer: "apdev",
    });

    setSecret(totp.secret.base32); // Save secret in Base32 encoding

    const otpauthUrl = totp.toString();

    // Generate QR Code
    QRCode.toDataURL(otpauthUrl, (err, url) => {
      if (err) {
        console.error("Error generating QR code:", err);
        return;
      }
      setQrCodeUrl(url);
    });
  };

  useEffect(() => {
    generateSecret();
  }, []);

  return (
    <div className="flex justify-center items-center flex-col">
      <h1 className="text-2xl text-slate-800 mb-3">
        Scan QR in your app to get code
      </h1>
      {qrCodeUrl && (
        <>
          <div className="w-[300px]">
            <img src={qrCodeUrl} alt="QR Code" className="w-full" />
          </div>
          <Verify2FA secret={secret} email={email} />
        </>
      )}
    </div>
  );
};

export default Setup2FA;
