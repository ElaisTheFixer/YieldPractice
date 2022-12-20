import React from 'react'
import { useEffect, useState } from 'react'
import styles from '../style'
import { Business, Footer, Navbar, Stats, Testimonials, Hero } from "../components";
import { ethers } from 'ethers'
import abi from '../abi/YieldABI.json'
import { Routes, Route, useNavigate } from 'react-router-dom'



const Homepage = () => {

    const[totalStaked, setTotalStaked] = useState(() => {
        const saved = localStorage.getItem("totalStaked");
        const initialValue = JSON.parse(saved);
        return initialValue || 0;
      })

      async function fetchBlockchainData() {
        const exodusCA = "";
        const web3Provider = new ethers.providers.JsonRpcProvider("") //replace with RPC end point
        const signer = web3Provider.getSigner();
    
        const exodusContractInstance = new ethers.Contract(exodusCA, abi, web3Provider);
        const { ethereum } = window;
        if(ethereum) {
          try {
            let totalStaked = await exodusContractInstance.hasStake.length();
            console.log(totalStaked);
            let totalStakedValue = ethers.utils.formatEther(totalStaked);
            setTotalStaked(totalStakedValue)
            localStorage.setItem("totalStaked", JSON.stringify(totalStakedValue));
          }catch(err) {
            console.log(err)
          }
        }

      }
    
      useEffect(() => {
        fetchBlockchainData()
      }, [totalStaked]);
    
      return(
        <div className="bg-primary w-full overflow-hidden">
          <div className={`${styles.paddingX} ${styles.flexCenter}`}>
              <div className={`${styles.boxWidth}`}>
                <Navbar />
              </div>
          </div>
    
    
          <div className={`bg-primary ${styles.flexStart}`}>  
            <div className={`${styles.boxWidth}`}>
              <Hero />
            </div>
          </div>
    
          <div className={`bg-primary ${styles.paddingX} ${styles.flexStart}`}>  
            <div className={`${styles.boxWidth}`}>
              <Stats totalS={totalStaked}/>
              <Business />
              <Testimonials />
              <Footer />
            </div>
          </div>
        </div>
      )
}

export default Homepage