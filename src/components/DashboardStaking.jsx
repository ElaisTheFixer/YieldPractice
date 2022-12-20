import React from 'react'
import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import styles from '../style';
import abi from '../abi/YieldABI.json'
import stakePNG from '../assets/stake.png';

const DashboardStaking = () => {

    const exodusCA = "";
    const exodusABI = abi;

    const [plan, setPlan] = useState('');
    const [userBalance, setUserBalance] = useState('');
    const [stakeAmount, setStakeAmount] = useState('');
    const [apy, setAPY] = useState('');

    const apy0 = 1500;
    const apy1 = 2500;
    const apy2 = 7000;
    const apy3 = 15000;   

    function getRwd(apy, duration) {
        return (amount * apy * duration) / 100000 / 365;
    }

    async function stake() {
        try{
            const { ethereum } = window;
            if(ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum, "any");
                const signer = provider.getSigner();
                const EXODUS = new ethers.Contract(exodusCA, exodusABI, signer);
                const stakeWei = ethers.utils.parseUnits(stakeAmount.toString(), 'ether');

                const tx = await EXODUS.stake(plan, stakeWei);
                await tx.wait();
            }
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
                const EXODUS = new ethers.Contract(exodusCA, exodusABI, signer);

                const xDSBal = await EXODUS.balanceOf(userAddress);
                console.log("xds bal")
                const displayBal = parseBigNumberToFloat(xDSBal);
                setUserBalance(displayBal);
                console.log(displayBal)
            }
        }catch(err) {
            console.log(err);
        }
    }

    function parseBigNumberToFloat(num) {
        const pb = ethers.utils.formatEther(num);
        const pf = parseFloat(pb);
        return pf.toFixed(2);
    }

    function handleClickMaxBtn() {
        setStakeAmount(userBalance);
    }


    useEffect(() => {
        let btn1 = document.getElementById("btn-1");
        let btn2 = document.getElementById("btn-2");
        let btn3 = document.getElementById("btn-3");
        let btn4 = document.getElementById("btn-4");
        document.getElementById("btn-1").addEventListener('click', function() {
            setPlan(0)
            setAPY(apy0)
            btn1.style.backgroundColor = "#60F0FA"
            btn2.style.backgroundColor = "white"
            btn3.style.backgroundColor = "white"
            btn4.style.backgroundColor = "white"
        });
        document.getElementById("btn-2").addEventListener('click', function() {
            setPlan(1)
            setAPY(apy1)
            btn1.style.backgroundColor = "white"
            btn2.style.backgroundColor = "#60F0FA"
            btn3.style.backgroundColor = "white"
            btn4.style.backgroundColor = "white"
        });
        document.getElementById("btn-3").addEventListener('click', function() {
            setPlan(2)
            setAPY(apy2)
            btn1.style.backgroundColor = "white"
            btn2.style.backgroundColor = "white"
            btn3.style.backgroundColor = "#60F0FA"
            btn4.style.backgroundColor = "white"
        });
        document.getElementById("btn-4").addEventListener('click', function() {
            setPlan(3)
            setAPY(apy3)
            btn1.style.backgroundColor = "white"
            btn2.style.backgroundColor = "white"
            btn3.style.backgroundColor = "white"
            btn4.style.backgroundColor = "#60F0FA"
        });
        getUserData();
    }, [])



    console.log(plan.id);
    
    return (
        <section className={`flex md:flex-row flex-col ${styles.paddingY}`}>
            <div className={`md:w-7/12 ${styles.divStyled} pt-[10px] md:ml-[0px] ml-[10px] md:mr-[0px] mr-[10px]`}>
                <h1 className='font-poppins pl-[10px] pb-[10px] text-white'>Lockup Period</h1>
                <div className={`flex flex-col md:flex-row text-white ml-[5px] w-full justify-center z-[10]`}>
                    <div className='flex md:flex-row justify-center items-center'>
                        <div className='ml-[-12px] md:ml-[0px] mr-[50px] md:mr-[0px]'>
                            <button id="btn-1" className={`${styles.buttonPlan} px-[36px] md:mr-[20px]`}>
                                <h1 className='font-semibold'>0 Days</h1>
                                <p className='text-[12px]'>15% APY</p>
                            </button>
                        </div>
                        <div>
                            <button id="btn-2" className={`${styles.buttonPlan} px-[38px] md:mr-[20px]`}>
                                <h1 className='font-semibold'>7 Days</h1>
                                <p className='text-[12px]'>25% APY</p>
                            </button>
                        </div>
                    </div>

                    <div className='flex md:flex-row justify-center py-[20px]'>
                        <div className='md:ml-[0px] ml-[-12px] md:mr-[0px] mr-[50px]'>
                            <button id="btn-3" className={`${styles.buttonPlan} px-[30px] md:mr-[20px]`}>
                                <h1 className='font-semibold'>30 Days</h1>
                                <p className='text-[12px]'>70% APY</p>
                            </button>
                        </div>
                        <div>
                            <button id="btn-4" className={`${styles.buttonPlan} px-[30px] md:mr-[20px]`}>
                                <h1 className='font-semibold'>120 Days</h1>
                                <p className='text-[12px]'>150% APY</p>
                            </button>
                        </div>
                    </div>
                </div>

                <h1 className='font-poppins pl-[10px] pb-[10px] text-white'>Staking Amount</h1>
                <div className='flex flex-col z-[15]'>
                    <div className='flex flex-row w-full justify-center'>
                        <input value={stakeAmount} type="text" className="w-8/12 py-1 px-1  md:ml-[-10px] md:mr-[20px] focus:outline-none focus:border-black-500 focus:ring-1 focus:ring-black-600 rounded-[5px] disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200" placeholder='0' onChange={e => setStakeAmount(e.target.value)}></input>
                        <button className='font-poppins bg-blue-gradient py-1 px-3 rounded-[10px]' onClick={() => setStakeAmount(userBalance)}>Max</button>
                    </div>
                    <div className='pt-[20px]'>
                        <p className='font-poppins pl-[10px] pb-[10px] text-white'>xDS Balance: {userBalance} ($0.00)</p>
                    </div>
                    <div className='flex flex-row w-11/12 justify-center pb-[10px]'>
                        <button className='font-poppins bg-blue-gradient py-1 px-3 rounded-[10px] w-full ml-[35px] md:w-10/12 md:ml-[50px]' onClick={() => stake()}>Stake</button>
                    </div>
                </div>
            </div>
            <div className={`md:w-[485px] ${styles.divStyled} pt-[10px] md:ml-[60px] ml-[10px] md:mr-[0px] mr-[10px] pl-[10px] pr-[10px] mt-[20px] md:mt-[0px] z-[100]`}>
                <h1 className='font-poppins pl-[10px] pb-[10px] text-white border-b-2 border-slate-500/40'>Stake Amount: {stakeAmount}</h1>
                <p className='font-poppins pl-[10px] pb-[10px] text-white mt-[10px]'>You will recieve: <span className='text-gradient'>{((stakeAmount * apy * 365) / 100000 / 365).toFixed()} xDS</span> After Staking 365 Days</p>
                <div className='md:ml-[135px] ml-[85px] md:mt-[10px]'>
                    <img src={stakePNG} alt='stake'/>
                </div>
            </div>
        </section>
    )
}

export default DashboardStaking