import React from 'react'
import { useState } from 'react'
import DashboardNav from '../components/DashboardNav.jsx'
import DashboardStats from '../components/DashboardStats.jsx'
import DashboardStaking from '../components/DashboardStaking.jsx'
import abi from '../abi/exodusABI.json'
import styles from '../style'

import { ethers } from 'ethers'
import { useEffect } from 'react'

function parseBigNumberToFloat(num) {
  const pb = ethers.utils.formatEther(num);
  const pf = parseFloat(pb);
  return pf.toFixed(2);
}
const exodusCA = "0x5373ceBe357686F36A9Da8f93B4FeF96e8319017";
const web3Provider = new ethers.providers.JsonRpcProvider("https://data-seed-prebsc-1-s1.binance.org:8545/")
const signer = web3Provider.getSigner();

const exodusContractInstance = new ethers.Contract(exodusCA, abi, web3Provider);
const { ethereum } = window;


const Dashboard = () => {

  const [userAddress, setUserAddress] = useState('');
  const [userBalance, setUserBalance] = useState('');
  const [userPlan, setUserPlan] = useState('');

  const callBackFunction = (dataFromChild) => {
    setUserAddress(dataFromChild);
  }

  const userBalanceCallback = (balance) => {
    setUserBalance(balance);
  }

  return (
    <div className="bg-primary w-full overflow-hidden">

      <div className={`${styles.paddingX} ${styles.flexCenter}`}>
        <div className={`${styles.boxWidth} z-[20]`}>
            <DashboardNav passedCallback={callBackFunction}/>
         </div>
      </div>

      <div className={`bg-primary ${styles.flexStart}`}>  
        <div className={`${styles.boxWidth}`}>
          {userBalance}
          <DashboardStats passedCallback={userBalanceCallback}/>
          <DashboardStaking/>
        </div>
      </div>

    </div>
  )
}

export default Dashboard