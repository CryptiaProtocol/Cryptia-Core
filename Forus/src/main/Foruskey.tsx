import { Crc } from "../helper/Crc";
import base58 from "bs58";
import { useState, useEffect } from "react";
import EllipticCurve from "elliptic";
import { AiOutlineCopy } from "react-icons/ai";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import { downloadTxt } from "../helper/downloadTxt";
import { RxDownload } from "react-icons/rx";
import bg from "../assets/bg.png";
import ToolTip from "../helper/ToopTip";

const ec = new EllipticCurve.ec("secp256k1");

type Props = {};

const ForusKey = (props: Props) => {
  const notyf = new Notyf();
  const [ForusKey, setForusKey] = useState<string | any>("");
  const [, setstoredsignatureKey] = useState<string | any>("");


  //generating the cp address and secret key
  const Generate = () => {
    try {

      //generating a random number 
      let key = ec.genKeyPair();


      //conveting that random number in "32 bytes hex private key" (ie : signature key)
      const signature: void = sessionStorage.setItem(
        "signature",
        key.getPrivate().toString(16)
      );
      setstoredsignatureKey(signature);


      //here we making public key (i.e forus key) from our private key (i.e signature key)
      const signatureKey = ec.keyFromPrivate(
        key.getPrivate().toString(16),
        "hex"
      );

      const publicKey = Uint8Array.from(
        signatureKey.getPublic().encodeCompressed("array")
      );

      //adding 1 bytes suffix to the public key (i.e forus key)
      const crc = Crc(publicKey);
      const enc: Uint8Array = new Uint8Array(publicKey.length + 2);
      enc.set(publicKey);
      enc.set(crc, publicKey.length);

      //adding a single byte prefix "fk" to the public key (i.e forus key)
      const fk: string = "Fk" + base58.encode(enc);
      sessionStorage.setItem("fk", fk);
      setForusKey(fk);

    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    Generate();
  }, []);


  const copyForusKey = () => {
    navigator.clipboard.writeText(ForusKey);
    notyf.success("Copied");
  };


  const saveSignature = () => {
    navigator.clipboard.writeText(ForusKey);
    downloadTxt('#ForusSignature-'+sessionStorage.getItem("signature") + '\n' + "#ForusKey-" + ForusKey, "Forus-signature.txt");

  };

  return (
    <>
      <div
        style={{ backgroundImage: `url(${bg})` }}
        className="bg-[#e9e9f3] object-scale-down border border-gray rounded-md backdrop-blur-lg bg-no-repeat flex flex-col items-center p-8 rounded-t-md"
      >
        <div className="pb-6 flex flex-col space-y-4 items-center border-black  w-full">
          <h1
            className="mx-auto montserrat-heading font-[1000]
             sm:text-[2.1rem] xl:text-[2.7rem] bg-clip-text text-gray-700
              text-3xl"
          >
            {" "}
         Share the
            <span
              className="hightlightText
            text-transparent sm:text-[2.2rem] xl:text-[2.8rem] bg-clip-text 
            bg-gradient-to-r from-highlight to-cyan-600
            "
            >
              {" "}
              Forus key 
            </span>{" "}
            &  get funds privately !
          </h1>
          <p className="text-gray-400 text-[0.8rem] sm:text-[1.1rem] montserrat-small font-semibold">
           Warning : Never reveal the signature. Only Share your forus key to receive funds.
          </p>

        </div>
        {/* Forus */}
        <div className="flex space-x-4">
          <div
            className="my-2 flex sm:gap-4 items-center p-2 sm:px-3 sm:mx-0 mx-3 bg-gray-400 bg-opacity-60
           rounded-md hover:shadow-sm shadow-gray-300 px-2   "
          >
            <p
              className="sm:text-[1rem] text-[0.8rem] montserrat-small font-extrabold 
            text-gray-700 "
            >
              <span className="sm:text-[1.1rem] text-[0.9rem] text-gray-800 text-md font-extrabold">
                #Foruskey
              </span>{" "}
              - {ForusKey}
            </p>
          </div>
          <div className="flex items-center text-white space-x-3">
            <ToolTip tooltip="Copy Forus Key">
              <AiOutlineCopy
                className="cursor-pointer font-bold text-2xl text-gray-700 hover:text-highlight"
                onClick={copyForusKey}
              />
            </ToolTip>
          </div>
        </div>
        <div className="flex space-x-4">



          <button
            className="mb-4 my-2 montserrat-subtitle border-1 p-1 montserrat-subtitle border border-black
         bg-highlight  px-6 text-center  
        text-black rounded-md font-semibold transition-all ease-linear"
            onClick={Generate}
          >
            Generate Key
          </button>



          <div onClick={saveSignature}
            className="flex cursor-pointer space-x-2 mb-4 my-2 montserrat-subtitle p-1 
            montserrat-subtitle border border-black  px-6 text-center  
           text-black rounded-md font-semibold bg-highlight
      
            "
          >
            <RxDownload
              className="font-bold text-xl text-[181b1f]"

            />
            <ToolTip tooltip="Save Signature Key">
              <span>Signature</span>
            </ToolTip>
          </div>

        </div>
      </div>
    </>
  );
};

export default ForusKey;
