export default function Footer() {
    return (
        <footer className="bg-blue-600 text-white py-4">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                <div className="text-center md:text-left">
                    <p>&copy; 2024 Decentralized Lottery. All rights reserved.</p>
                </div>
                <div className="flex space-x-4 mt-4 md:mt-0">
                    <a href="#" className="hover:text-gray-300">Privacy Policy</a>
                    <a href="#" className="hover:text-gray-300">Terms of Service</a>
                    <a href="#" className="hover:text-gray-300">Contact Us</a>
                </div>
            </div>
        </footer>
    );
}
