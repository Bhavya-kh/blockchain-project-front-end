import { ConnectButton } from "web3uikit"
import { useState } from "react"

export default function Header() {
    const [isOpen, setIsOpen] = useState(false)

    const toggleMenu = () => {
        setIsOpen(!isOpen)
    }

    return (
        <nav className="p-5 border-b-2 flex flex-col md:flex-row items-center bg-blue-600 shadow-md w-full mx-0">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex justify-between w-full md:w-auto">
                    {/* <h1 className="py-4 px-4 font-bold text-3xl text-white">Decentralized Lottery</h1> */}
                    <button
                        className="md:hidden block text-xl px-4 py-2 text-white"
                        onClick={toggleMenu}
                    >
                        ☰
                    </button>
                </div>
                <ul
                    className={`md:flex md:items-center md:space-x-6 ${
                        isOpen ? "block" : "hidden"
                    } w-full md:w-auto`}
                >
                    <img
                        src="/Decentralized.png"
                        alt="Decentralized Lottery"
                        style={{ maxWidth: "10%", height: "auto" , borderRadius:"20%"}}
                    />
                    <li className="py-2 md:py-0">
                        <a
                            href="#"
                            className="px-4 py-2 hover:bg-blue-700 rounded text-white text-lg"
                        >
                            Home
                        </a>
                    </li>
                    <li className="py-2 md:py-0">
                        <a
                            href="#"
                            className="px-4 py-2 hover:bg-blue-700 rounded text-white text-lg"
                        >
                            About
                        </a>
                    </li>
                    <li className="py-2 md:py-0">
                        <a
                            href="#"
                            className="px-4 py-2 hover:bg-blue-700 rounded text-white text-lg"
                        >
                            Lottery
                        </a>
                    </li>
                    <li className="py-2 md:py-0">
                        <a
                            href="#"
                            className="px-4 py-2 hover:bg-blue-700 rounded text-white text-lg"
                        >
                            Contact
                        </a>
                    </li>
                </ul>
                <div className="ml-auto py-2 px-4">
                    <ConnectButton moralisAuth={false} />
                </div>
            </div>
        </nav>
    )
}
