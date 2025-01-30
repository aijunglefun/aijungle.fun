import { useState } from 'react';
import monkeyLogo from "../assets/images/monkey.png";
import { WalletConnect } from './WalletConnect';
import {
    WalletMultiButton,
  } from "@solana/wallet-adapter-react-ui";
import HowItWorksModal from './HowItWorksModal';
import MyDebatesModal from './MyDebatesModal';

const Header = ({ ownedDebates }: { ownedDebates: Array<any> }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [isMyDebatesOpen, setIsMyDebatesOpen] = useState(false);

  const ca = import.meta.env.VITE_CA;
  return (
    <header className="bg-gray-900 border-b border-yellowgreen-500/20 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <a href="/" className="flex items-center space-x-2">
              <img src={monkeyLogo} alt="AI Debates Logo" className="h-10 w-10" />
              <span className="text-yellowgreen-100 text-2xl font-bold courier">{"AI{jungle}"}</span>
            </a>       
            <div className="hidden md:flex items-center space-x-3">
              <span 
                className="text-gray-300 hover:text-yellowgreen-400 cursor-pointer"
                onClick={() => setIsHowItWorksOpen(true)}
              >
                {"{ how it works }" }
              </span>
              <span 
                className="text-gray-300 hover:text-yellowgreen-400 cursor-pointer"
                onClick={() => setIsMyDebatesOpen(true)}
              >
                {"{ my debates }"}
              </span>
            </div>
          </div>
          
          {/* Mobile buttons */}
          <div className="md:hidden flex items-center space-x-4">
            <WalletConnect />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-yellowgreen-400"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a 
              href="https://x.com/aijunglefun" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-300 hover:text-yellowgreen-400"
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a 
              href="https://github.com/aijunglefun/aijungle.fun" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-300 hover:text-yellowgreen-400"
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
            </a>
            <a 
              href="https://solscan.io/address/Fze3wnbnZSTPbGSHXTt4J7gvzTJNjH4J2Uq6HRiHbTBo" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-300 hover:text-yellowgreen-400"
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </a>
            <WalletMultiButton />
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="absolute left-0 right-0 bg-gray-900 px-4 py-8 md:hidden mt-4 space-y-8 border-b border-yellowgreen-500/20 border-t border-yellowgreen-500/20">
              <p className="text-gray-300 hover:text-yellowgreen-400 cursor-pointer" onClick={() => {
                setIsMenuOpen(false);
                setIsHowItWorksOpen(true);
              }}>
                {"{ how it works }"}
              </p>
              <p className="text-gray-300 hover:text-yellowgreen-400 cursor-pointer" onClick={() => {
                setIsMenuOpen(false);
                setIsMyDebatesOpen(true);
              }}>
                {"{ my debates }"}
              </p>
            {ca && <p className="text-gray-300 hover:text-yellowgreen-400 cursor-pointer break-all">
              {"{ ca: " + ca + " }"}
            </p> } 
            <a 
              href="https://x.com/aijunglefun" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center text-gray-300 hover:text-yellowgreen-400"
            >
              <svg className="h-6 w-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              Twitter
            </a>
            <a 
              href="https://github.com/aijunglefun/aijungle.fun" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center text-gray-300 hover:text-yellowgreen-400"
            >
              <svg className="h-6 w-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              GitHub
            </a>
            <a 
              href="https://solscan.io/address/Fze3wnbnZSTPbGSHXTt4J7gvzTJNjH4J2Uq6HRiHbTBo" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center text-gray-300 hover:text-yellowgreen-400"
            >
              <svg className="h-6 w-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
              Contract
            </a>
          </div>
        )}
      </nav>

      <HowItWorksModal 
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
      />

      <MyDebatesModal 
        isOpen={isMyDebatesOpen}
        onClose={() => setIsMyDebatesOpen(false)}
        ownedDebates={ownedDebates}
      />
    </header>
  );
};

export default Header; 


