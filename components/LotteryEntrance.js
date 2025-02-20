import { contractAddresses, abi } from "../constants"
// dont export from moralis when using react
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useEffect, useState } from "react"
import { useNotification } from "web3uikit"
import { ethers } from "ethers"

export default function LotteryEntrance() {
    const { Moralis, isWeb3Enabled, chainId: chainIdHex } = useMoralis()
    // These get re-rendered every time due to our connect button!
    const chainId = parseInt(chainIdHex)
    // console.log(`ChainId is ${chainId}`)
    const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null

    // State hooks
    // https://stackoverflow.com/questions/58252454/react-hooks-using-usestate-vs-just-variables
    const [entranceFee, setEntranceFee] = useState("0")
    const [numberOfPlayers, setNumberOfPlayers] = useState("0")
    const [recentWinner, setRecentWinner] = useState("0")
    const [ethValue, setEthValue] = useState("0") // State to store input value
    const [balance, setBalance] = useState("0")

    const dispatch = useNotification()

    const {
        runContractFunction: enterLottery,
        data: enterTxResponse,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "enterLottery",
        msgValue: ethers.utils.parseEther(ethValue || "0"),
        params: {},
    })

    /* View Functions */

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress, // specify the networkId
        functionName: "getEntranceFee",
        params: {},
    })

    const { runContractFunction: getPlayersNumber } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getNumberOfPlayers",
        params: {},
    })

    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getRecentWinner",
        params: {},
    })

    const { runContractFunction: getBalance } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getBalance",
        params: {},
    })

    async function updateUIValues() {
        // Another way we could make a contract call:
        // const options = { abi, contractAddress: raffleAddress }
        // const fee = await Moralis.executeFunction({
        //     functionName: "getEntranceFee",
        //     ...options,
        // })
        const entranceFeeFromCall = (await getEntranceFee()).toString()
        const numPlayersFromCall = (await getPlayersNumber()).toString()
        const recentWinnerFromCall = await getRecentWinner()
        const balanceFromCall = (await getBalance()).toString()
        setEntranceFee(entranceFeeFromCall)
        setNumberOfPlayers(numPlayersFromCall)
        setRecentWinner(recentWinnerFromCall)
        setBalance(balanceFromCall)
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUIValues()
        }
    }, [isWeb3Enabled])
    // no list means it'll update everytime anything changes or happens
    // empty list means it'll run once after the initial rendering
    // and dependencies mean it'll run whenever those things in the list change

    // An example filter for listening for events, we will learn more on this next Front end lesson
    // const filter = {
    //     address: raffleAddress,
    //     topics: [
    //         // the name of the event, parnetheses containing the data type of each event, no spaces
    //         utils.id("RaffleEnter(address)"),
    //     ],
    // }

    const handleNewNotification = () => {
        dispatch({
            type: "info",
            message: "Transaction Complete!",
            title: "Transaction Notification",
            position: "topR",
            icon: "bell",
        })
    }
    const handleNotification = () => {
        dispatch({
            type: "info",
            message: "Transaction Failed send more ETH!",
            title: "Transaction Notification",
            position: "topR",
            icon: "bell",
        })
    }

    const handleSuccess = async (tx) => {
        try {
            await tx.wait(1)
            updateUIValues()
            handleNewNotification(tx)
        } catch (error) {
            console.log(error)
        }
    }

    const handleEnterLottery = async () => {
        const minEthValue = 0.01
        if (parseFloat(ethValue) < minEthValue) {
            handleNotification(
                "error",
                `The minimum ETH value is ${minEthValue} ETH`,
                "Transaction Error"
            )
            return
        }
        await enterLottery({
            onSuccess: handleSuccess,
            onError: (error) => {
                console.error("Transaction Error:", error)
                handleNotification(
                    "error",
                    "Transaction failed: " + error.message,
                    "Transaction Error"
                )
            },
        })
    }

    return (
        <div className="p-5">
            <div className="inline-block">
                <img
                    src="/0x0.webp"
                    alt="Decentralized Lottery"
                    style={{ maxWidth: "50%", height: "auto" }}
                />
                {/* <h1 className="py-4 px-4 font-bold text-3xl">Lottery</h1> */}
                <div className="inline-block align-middle">
                    {raffleAddress ? (
                        <>
                            <input
                                id="ethValue"
                                placeholder="Enter value in ETH"
                                type="number"
                                step="0.01"
                                onChange={(e) => setEthValue(e.target.value)} // Update ethValue state on input change
                            />
                            <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto "
                                // onClick={async () =>
                                //     await enterLottery({
                                //         // onComplete:
                                //         // onError:
                                //         onSuccess: handleSuccess,
                                //         onError: (error) => console.log(error),
                                //     })
                                // }
                                onClick={handleEnterLottery}
                                disabled={isLoading || isFetching}
                            >
                                {isLoading || isFetching ? (
                                    <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                                ) : (
                                    "Enter Lottery"
                                )}
                            </button>
                            <div className="font-bold">
                                Entrance Fee: {ethers.utils.formatUnits(entranceFee, "ether")} ETH
                            </div>
                            <div className="font-bold">
                                The current number of players is: {numberOfPlayers}
                            </div>
                            <div className="font-bold">
                                The most previous winner was: {recentWinner}
                            </div>
                            <div className="font-bold">Total fund in lottery is: {balance}</div>
                        </>
                    ) : (
                        <div>Please connect to a supported chain </div>
                    )}
                </div>
            </div>
        </div>
    )
}
