import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react';
import styles from '../style'
import { ethers } from 'ethers'


const Stats = ({ totalS }) => {

  const stats = [{
    id: "stats-1",
    title: "Users Staked",
    value: "",
  },
  {
    id: "stats-2",
    title: "Holders",
    value: "",
  },
  {
    id: "stats-3",
    title: "TVL",
    value: totalS,
  },
  ];

  return(
    <section className={`${styles.flexCenter} flex-row flex-wrap sm:mb-20 mb-6`}>
      {stats.map((stat) => (
        <div key={stat.id} className={`flex-1 flex justify-start items-center flex-row m-3`}>
          <h4 className='font-poppins font-semibold xm:text-[40px] text-[30px] xm:leading-[53px] leading-[43px] text-white'>{stat.value}</h4>
          <p className='font-poppins font-normal xm:text-[20px] text-[15px] xm:leading-[26px] leading-[21px] text-gradient uppercase ml-3'>{stat.title}</p>
        </div>
      ))}
    </section>
  )
}


export default Stats