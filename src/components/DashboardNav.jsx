import { useState } from 'react';

import { close, menu } from '../assets';
import { DnavLinks } from '../constants';
import { ethers } from 'ethers'

function truncate(text, startChars, endChars, maxLength) {
    if (text.length > maxLength) {
        var start = text.substring(0, startChars);
        var end = text.substring(text.length - endChars, text.length);
        while ((start.length + end.length) < maxLength) {
            start = start + '.';
        }
        return start + end;
    }
    return text;
}

function parseBigNumberToFloat(num) {
    const pb = ethers.utils.formatEther(num);
    const pf = parseFloat(pb);
    return pf.toFixed(2);
}

const Navbar = (props) => {

    const sendAddressToParent = (address) => {
        props.passedCallback(address)
    }
    
    async function getAddress() {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const addr = await signer.getAddress();
        const ethButton = document.getElementById("connect-wallet");
        ethButton.textContent = truncate(addr, 6, 6, 15);
        sendAddressToParent(addr);
    }
    
    async function connectSite() {
        await window.ethereum.request({ method: 'eth_requestAccounts' })
            .then(() => {
                getAddress();
                console.log("here");
            })
    }

    const [toggle, setToggle] = useState(false);

  return (
    <nav className="w-full flex py-6 justify-between itmes-center navbar">
      {/* <img src={logo} alt="" className="w-[124px] h-[32px]"/> */}
      <h1 className='text-[30-px] font-poppins text-white '>Yield Dashboard</h1>
      <ul className="list-none sm:flex hidden justify-end items-center flex-1">
        {DnavLinks.map((nav, index) => (
          <li
            key={nav.id}
            className={`font-poppins
             font-normal 
             cursor-pointer 
             text-[16px]
             ${index === DnavLinks.length - 1 ? 'mr-10' : 'mr-10'} 
             text-white`}
          >
            <a href={`${nav.id}`}>
              {nav.title}
            </a>
          </li>
        ))}
        <li className={`text-white`}>
            <button id="connect-wallet" className={`py-1 px-2 font-poppins font-medium text-[16px] text-primary bg-blue-gradient rounded-[10px] outline-none`} onClick={connectSite}>Connect</button>
        </li>
      </ul>

      <div className="sm:hidden flex flex-1 justify-end items-center">
        <img 
        src={toggle ? close : menu}
        alt="menu"
        className="w-[28px] h-[28px] object-contain"
        onClick={() => setToggle((prev => !prev))}
        />

        <div
          className={`${toggle ? 'flex' : 'hidden'}
          p-6 bg-black-gradient
          absolute absolute top-20 right-0 mx-4 my-2 min-w-[140px]
          rounded-xl
          sidebar
          `}
        >
          <ul className="list-none flex flex-col justify-end items-center flex-1">
              {DnavLinks.map((nav, index) => (
                <li
                  key={nav.id}
                  className={`font-poppins
                  font-normal 
                  cursor-pointer 
                  text-[16px]
                  ${index === DnavLinks.length - 1 ? 'mr-0' : 'mb-4'} 
                  text-white`}
                >
                  <a href={`${nav.id}`}>
                    {nav.title}
                  </a>
                </li>
              ))}
            <li className='mt-[10px]'>
                <button id="connect-wallet" className={`py-1 px-2 font-poppins font-medium text-[16px] text-primary bg-blue-gradient rounded-[10px] outline-none`} onClick={connectSite}>Connect</button>
            </li>
            </ul>
        </div>

      </div>
    </nav>
  )
}

export default Navbar