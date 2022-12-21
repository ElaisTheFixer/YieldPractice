import React from 'react'
import styles from '../style'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import abi from '../abi/YieldABI.json'
import factoryABI from '../abi/factoryABI.json'
import pairABI from '../abi/pair.json'

function parseBigNumberToFloat(num) {
    const pb = ethers.utils.formatEther(num);
    const pf = parseFloat(pb);
    return pf.toFixed(2);
}

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

function parseDate(num) {
    const date = new Date(num * 1000);
    return date.toDateString();
}

const DashboardStats = (props) => {

    const YieldCA = "";
    const factoryCA = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"; //uniswapfactory
    const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"; //weth on eth mainnet
    const USD = "0xdAC17F958D2ee523a2206206994597C13D831ec7"; //usdt on eth mainnet
    const YIELDABI = abi;
    const factABI = factoryABI;
    const pABI = pairABI;
    const secondsInDay = 86400;

    const [tokenPrice, setTokenPrice] = useState('');
    const [userBal, setUserBal] = useState('');
    const [apy, setAPY] = useState('');
    const [amount, setAmount] = useState('');
    const [vestedAmount, setVestedAmount] = useState('');
    const [lockup, setLockup] = useState('');
    const [stakeEnd, setStakeEnd] = useState('');
    const [address, setAddress] = useState('');
    const [tRewards, setTRewards] = useState('');

    async function getTokenPrice() {
        try {
            const provider = new ethers.providers.Web3Provider(ethereum, "any");
            const signer = provider.getSigner();
            const FACTORY = new ethers.Contract(factoryCA, factABI, signer);
            const pair = await FACTORY.getPair(WETH, YieldCA);
            const PAIR = new ethers.Contract(pair, pABI, signer);
            const xDSReserves = await PAIR.getReserves();
            const marketPrice = xDSReserves[1].div(xDSReserves[0])
            const formatMarketPrice = ethers.utils.formatEther(marketPrice);
            //get usd price of bnb
            const usdPair = await FACTORY.getPair(WETH, USD);
            const USDPAIR = new ethers.Contract(usdPair, pABI, signer);
            const usdReserves = await USDPAIR.getReserves();
            const bnbMarketPrice = usdReserves[1].div(usdReserves[0]);
            const formatUSDPrice = ethers.utils.formatEther(bnbMarketPrice);
            setTokenPrice(parseFloat(formatMarketPrice) * parseFloat(formatUSDPrice));
            console.log(tokenPrice);
        }catch(err) {
            console.log(err);
        }
    }

    async function getUserData() {
        try {
            const { ethereum } = window;
            if(ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum, "any");
                await window.ethereum.request({ method: 'eth_requestAccounts' })
                const signer = provider.getSigner();
                const userAddress = await signer.getAddress();
                const YIELD = new ethers.Contract(YieldCA, YIELDABI, signer);
                const xDSBal = await YIELD.balanceOf(userAddress);
                const hasPlan = await YIELD.hasStake(userAddress);
                const hasVest = await YIELD.hasVest(userAddress);
                setAddress(userAddress);
                if(hasPlan) {
                    const currentStakeInfo = await YIELD.stakers(userAddress);
                    const userAPY = currentStakeInfo.apy.toNumber();
                    const stakedAmount = parseBigNumberToFloat(currentStakeInfo.amount);
                    const stakedSince = currentStakeInfo.since.toNumber();
                    const planDuration = currentStakeInfo.duration.toNumber();
                    const stakeEnd = stakedSince + (secondsInDay * planDuration);
                    const totalRewards = await YIELD._calculateReward(userAddress);

                    const currentVestInfo = await YIELD.vesting(userAddress);
                    const vestedAmount = parseBigNumberToFloat(currentVestInfo.amount);
                    setLockup(planDuration);
                    setAmount(stakedAmount);
                    setVestedAmount(vestedAmount);
                    setAPY(userAPY/100);
                    setStakeEnd(parseDate(stakeEnd));
                    setTRewards(parseBigNumberToFloat(totalRewards));
                }
                const displayBal = parseBigNumberToFloat(xDSBal);
                setUserBal(displayBal);
            }
        }catch(err) {
            console.log(err);
        }
    }

    async function vestRewards() {
        try{
            const { ethereum } = window;
            if(ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum, "any");
                await window.ethereum.request({ method: 'eth_requestAccounts' })
                const signer = provider.getSigner();
                const userAddress = await signer.getAddress();
                const YIELD = new ethers.Contract(YieldCA, YIELDABI, signer);

                const tx = await YIELD.vestRewards(userAddress);
                await tx.wait();
            }
        }catch(err){
            console.log(err)
        }
    }

    async function claimRewards(){
        try{
            const { ethereum } = window;
            if(ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum, "any");
                await window.ethereum.request({ method: 'eth_requestAccounts' })
                const signer = provider.getSigner();
                const userAddress = await signer.getAddress();
                const YIELD = new ethers.Contract(YieldCA, YIELDABI, signer);

                const tx = await YIELD.withdrawRewards(userAddress);
                await tx.wait();
            }
        }catch(err){
            console.log(err)
        }
    }

    async function unstake(){
        try{
            const { ethereum } = window;
            if(ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum, "any");
                await window.ethereum.request({ method: 'eth_requestAccounts' })
                const signer = provider.getSigner();
                const YIELD = new ethers.Contract(YieldCA, YIELDABI, signer);

                const tx = await YIELD.unstake();
                await tx.wait();
            }
        }catch(err){
            console.log(err)
        }
    }

    // async function upgradeAPY() {
    //     try{
    //         const { ethereum } = window;
    //         if(ethereum) {
    //             const provider = new ethers.providers.Web3Provider(ethereum, "any");
    //             await window.ethereum.request({ method: 'eth_requestAccounts' })
    //             const signer = provider.getSigner();
    //             const userAddress = await signer.getAddress();
    //             const YIELD = new ethers.Contract(YieldCA, YIELDABI, signer);
    //             const hasPlan = await YIELD.hasStake(userAddress);
    //             if(hasPlan){
    //                 const options = {value: ethers.utils.parseEther('0.25')}
    //                 console.log(options);
    //                 console.log(parseBigNumberToFloat(ethers.utils.parseEther('0.25')));
    //                 const tx = await YIELD.upgradeStakeAPY(userAddress, options);
    //                 await tx.wait();
    //             }
    //         }
    //     }catch(err) {
    //         console.log(err)
    //     }
    // }

    const sendBalToParent = (bal) => {
        props.passedCallback(bal)
    }

    useEffect(() => {
        getUserData();
        getTokenPrice();
        sendBalToParent(userBal);
    }, [])

return (
    <section id="dSats" className={`flex md:flex-row flex-col ${styles.paddingY}`}>
        <div className={`flex flex-col justify-between w-full`}>
            <div className={`${styles.divStyled} w-[382px] items-center justify-center lg:w-[675px] h-[265px] z-[3] m-1 ss:ml-[0] text-white`}>
                <div className={`pr-[10px] pl-[10px]`}>
                    <h1 className='font-poppins font-semibold ss:text-[20px] text-[11px] text-white leading-[30px] ss:leading-[50px] border-b-2 border-slate-500/40'>Welcome, <span className='text-gradient'>{address}</span></h1>
                    <div className='flex flex-row justify-between w-ful'>
                        <div className='border-r-2 pr-[35px] ss:pr-[140px] ss:pl-[40px] border-slate-500/40'>
                            <p className='font-poppins font-semibold ss:text-[20px] text-[20px] text-center ss:text-center text-white leading-[40px] ss:leading-[60px] ss:mt-[0] mt-[5px] ml-[5px]'>Your Portfolio: </p>
                            <p className='font-poppins font-semibold ss:text-[30px] text-[30px] text-center ss:text-center text-white leading-[40px] ss:leading-[10px] ss:mt-[0] mt-[5px] ml-[5px]'>$0</p>
                            <p className='font-poppins font-semibold ss:text-[18px] text-[15px] text-center ss:text-center text-white leading-[40px] ss:leading-[60px] ss:mt-[0] mt-[5px] ml-[5px]'>{userBal} xDS</p>
                        </div>
                        <div className='ss:pr-[40px]'>
                            <p className='font-poppins font-semibold ss:text-[20px] text-[20px] ss:text-center text-center text-white leading-[40px] ss:leading-[60px] ss:mt-[0] mt-[5px] ml-[5px]'>Current Plan: </p>
                            <p className='font-poppins font-semibold ss:text-[30px] ss:text-center text-center text-[30px] text-white leading-[40px] ss:leading-[10px] ss:mt-[0] mt-[5px] ml-[5px]'><span>{apy}% </span>APY</p>
                            <p className='font-poppins font-semibold ss:text-[18px] text-[15px] text-center ss:text-center text-white leading-[40px] ss:leading-[60px] ss:mt-[0] mt-[5px] ml-[5px]'><span>{lockup} </span>Days lockup period</p>
                        </div>
                    </div>
                    <div className='flex justify-between'>
                        <button type="button" className={`py-2 px-5 font-poppins font-medium text-[16px] text-primary bg-blue-gradient rounded-[10px] outline-none mt-[18px] w-5/12 ss:mt-[25px]`}>Buy now on Pancakeswap</button>
                        <button type="button" className={`py-2 px-5 font-poppins font-medium text-[16px] text-primary bg-blue-gradient rounded-[10px] outline-none mt-[20px] w-5/12 ss:mt-[25px]`} onClick={() => unstake()}>Unstake</button>
                    </div>
                </div>

                <div className='absolute z-[0] w-[50%] h-[50%] left-20 bottom-20 blue__gradient' />
            </div>

                    
            <div className='flex pl-[8px] pt-[11px]'>
                <h1 className='font-poppins  ss:text-[16px] text-[15px] text-white leading-[30px] ss:leading-[50px]'>Token rewards can be claimed every 3 days from the date of vesting.</h1>
            </div>

            <div className='absolute z-[0] w-[40%] h-[35%] top-0 pink__gradient' />
            {/* <div className='absolute z-[1] w-[80%] h-[80%] rounded-full bottom-40 white__gradient' /> */}
            <div className='absolute z-[0] w-[50%] h-[50%] right-20 bottom-20 blue__gradient' />
        </div>

        <div className={`flex-1 flex-col ${styles.flexCenter} md:my-0 my-1`}>
            <div className={`${styles.divStyled} w-[380px] h-[130px] z-[3] ss:w-[470px]  m-1 pl-[10px] pr-[10px]`}>
                <h1 className='font-poppins font-semibold ss:text-[15px] text-[15px] text-white leading-[30px] border-b-2 border-slate-500/40'>Stake Info:</h1>
                <p className='font-poppins text-white ss:text-[15px] text-[15px] pl-[5px] pt-[2px]'>Staked Amount: {amount}</p>
                <p className='font-poppins text-white text-[15px] pl-[5px]'>Stake unlock: {stakeEnd}</p>
                <p className='font-poppins text-white text-[15px] pl-[5px]'>Availiable Rewards: {(tRewards - vestedAmount).toFixed(2)}</p>
                <p className='font-poppins text-white text-[15px] pl-[5px]'>Total Rewards: {tRewards}</p>
            </div>
            <div className={`${styles.divStyled} w-[380px] h-[130px] z-[3] ss:w-[470px]  m-1 pl-[10px] pr-[10px]`}>
                <h1 className='font-poppins font-semibold ss:text-[15px] text-[15px] text-white leading-[30px] border-b-2 border-slate-500/40'>Vest Info:</h1>
                <p className='font-poppins text-white ss:text-[15px] text-[15px] pl-[5px] pt-[2px]'>Vested Amount: {vestedAmount}</p>
                <p className='font-poppins text-white text-[15px] pl-[5px]'>Vest End Date:</p>
                <p className='font-poppins text-white text-[15px] pl-[5px]'>Claimable Rewards:</p>
                <p className='font-poppins text-white text-[15px] pl-[5px]'>Next Claim Date:</p>
            </div>
            <div className={`flex flex-col ss:flex-row justify-between w-full text-white mt-[20px]`}>
                <button type="button" className={`py-2 px-5 font-poppins font-medium text-[16px] text-primary bg-blue-gradient rounded-[10px] outline-none mr-[15px] ml-[10px] drop-shadow-lg`} onClick={() => vestRewards()}>Vest Rewards</button>
                <button type="button" className={`py-2 px-5 font-poppins font-medium text-[16px] text-primary bg-blue-gradient rounded-[10px] outline-none mt-[20px] ml-[10px] mr-[13px] ss:mt-[0] drop-shadow-lg`}>Claim Rewards</button>
            </div>
        </div>
    </section>
  )
}

export default DashboardStats