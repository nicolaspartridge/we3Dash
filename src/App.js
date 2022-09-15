import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import ERC20ABI from "./abis/ERC20.json";
import "./cf.css";
import Lottie from "react-lottie";
import loadingAnimation from "./assets/loading.json";
import { getBAYC } from "./hooks/bayc/getBayc";

function App() {
  const [account, setAccount] = useState();
  const [balance, setBalance] = useState();
  const [network, setNetwork] = useState();
  const [connected, setConnected] = useState();
  const [usdt, setUsdt] = useState();
  const [usdc, setUsdc] = useState();
  const [dai, setDai] = useState();
  const [apes, setApes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [searching, setSearching] = useState(false);

  let provider = new ethers.providers.Web3Provider(window.ethereum);
  let signer;

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loadingAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const networks = [
    { id: 1, name: "Ethereum Mainnet" },
    { id: 3, name: "Rposten Testnet" },
    { id: 4, name: "Rinkeby Testnet" },
    { id: 5, name: "Goerli Testnet" },
  ];

  const contractAddresses = [
    { name: "USDT", addr: "0xdac17f958d2ee523a2206206994597c13d831ec7" },
    { name: "USDC", addr: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48" },
    { name: "DAI", addr: "0x6b175474e89094c44da98b954eedeac495271d0f" },
  ];

  const callApe = async (acc) => {
    return new Promise(async function (resolve, reject) {
      const links = await getBAYC(provider, acc);
      resolve(links);
      console.log(apes, links);
      setSearching(false);
    });
  };

  const connectMetamask = async () => {
    await provider.send("eth_requestAccounts", []);

    signer = provider.getSigner();
    setLoading(true);
    let acc = await signer.getAddress();
    setAccount(acc);
    setConnected(true);
    getNetwork();
    getBalance();

    await callApe(acc);
    setUsdt(await getERC20Bal(contractAddresses[0].addr, acc));
    setUsdc(await getERC20Bal(contractAddresses[1].addr, acc));
    setDai(await getERC20Bal(contractAddresses[2].addr, acc));

    setSearching(false);
    setLoading(false);
  };

  const getBalance = async () => {
    signer = provider.getSigner();
    const bal = await signer.getBalance();
    const readableBal = ethers.BigNumber.from(bal._hex) / 1e18;
    setBalance(readableBal.toLocaleString("fullwide", { useGrouping: false }));
  };

  const getERC20Bal = async (addr, acc) => {
    const contract = new ethers.Contract(addr, ERC20ABI, provider);
    const bal = await contract.balanceOf(acc);
    const readableBal =
      ethers.BigNumber.from(bal._hex).toNumber() /
      10 ** (await contract.decimals());
    return readableBal.toLocaleString("fullwide", { useGrouping: false });
  };

  const getNetwork = async () => {
    setNetwork(provider.network.chainId);
  };

  useEffect(() => {
    callApe(searchVal).then(setApes);
  }, [searchVal]);

  return (
    <div
      className={`flex flex-col items-center min-h-screen w-screen bg-dark p-8 ${
        connected ? null : "justify-center"
      }`}
    >
      {connected ? (
        loading ? (
          <div className="flex items-center justify-center h-screen w-screen">
            <Lottie options={defaultOptions} height={200} width={200} />
          </div>
        ) : (
          <div className="w-full max-w-5xl flex flex-col text-white">
            <h3 className="font-bold text-lg my-2">Overview</h3>
            <div className="flex flex-col md:flex-row">
              <div className="w-full border border-accent rounded-lg md:p-8 md:mr-2">
                <span className="text-secondary text-xs">
                  <i className="cfu-block mr-2"></i>CONNECTION DETAILS
                </span>
                <div className="flex flex-row items-center mt-4 text-offWhite">
                  <i className="cfu-user md:text-xl"></i>
                  <span className="text-xs md:text-sm ml-2">{account}</span>
                </div>

                <div className="flex flex-row items-center mt-4 text-offWhite">
                  <i className="cfu-network md:text-xl"></i>
                  <span className="text-xs md:text-sm ml-2">
                    {network &&
                      networks.filter((n) => n.id === network)[0].name}
                  </span>
                </div>

                <div className="flex flex-row items-center mt-4 text-offWhite">
                  <i className="cfu-finance-chart md:text-xl"></i>
                  <span className="text-xs md:text-sm ml-2">{balance} ETH</span>
                </div>
              </div>

              <div className="w-full border border-accent rounded-lg pt-4 md:p-8 md:ml-2">
                <span className="text-secondary text-xs">
                  <i className="cfu-wallet mr-2"></i>WALLET DETAILS
                </span>

                {network === 1 ? (
                  <>
                    <div className="flex flex-row items-center mt-4 text-offWhite">
                      <i className="cf cf-usdt md:text-2xl font-[cryptofont]"></i>
                      <span className="text-xs md:text-sm ml-2">
                        {usdt} USDT
                      </span>
                    </div>

                    <div className="flex flex-row items-center mt-4 text-offWhite">
                      <i className="cf cf-usdc md:text-2xl font-[cryptofont]"></i>
                      <span className="text-xs md:text-sm ml-2">
                        {usdc} USDC
                      </span>
                    </div>

                    <div className="flex flex-row items-center mt-4 text-offWhite">
                      <i className="cf cf-dai md:text-2xl font-[cryptofont]"></i>
                      <span className="text-xs md:text-sm ml-2">{dai} DAI</span>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center w-full h-full">
                    <span className="text-secondary text-xs">
                      ERC20 balances only available on Mainnet.
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="w-full border border-accent rounded-lg md:p-8 my-4">
              <span className="text-secondary text-xs">
                <i className="cfu-nft mr-2"></i>NFTs
              </span>
              <div className="flex flex-row flex-wrap items-center">
                {apes.length > 0 ? (
                  apes.map((ape, indx) => (
                    <img
                      src={ape}
                      alt="ape"
                      key={indx}
                      className="md:w-64 md:m-4 my-4"
                    />
                  ))
                ) : !searching ? (
                  <div className="flex flex-col w-full items-center justify-center">
                    <span className="text-secondary text-xs my-4">
                      You have no NFTs ( BAYC's )
                    </span>
                    <span>Search another address for BAYC's</span>
                    <input
                      type="text"
                      value={searchVal}
                      placeholder={account}
                      className="text-xs my-4 rounded-md h-12 w-1/3 max-w-sm outline-none text-black px-4"
                      onChange={(e) => {
                        setSearchVal(e.target.value);
                      }}
                    />
                    <button
                      onClick={async () => {
                        setSearching(true);
                        callApe(searchVal).then(setApes);
                      }}
                    >
                      Search
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-full h-full">
                    <Lottie options={defaultOptions} height={100} width={100} />
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      ) : (
        <button className="text-white" onClick={connectMetamask}>
          Connect wallet
        </button>
      )}
    </div>
  );
}

export default App;
