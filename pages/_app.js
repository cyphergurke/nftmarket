import { useState } from 'react';
import '../styles/globals.css'
import Link from 'next/link'
import { RiMenu3Line, RiCloseLine } from 'react-icons/ri';
import Image from 'next/image';

const Menu = () => (
  <>

    <div>
      <Link href="/">
        <a className="p-6 active:text-violet-700 hover:text-pink-400 ">
          Buy NFT
        </a>
      </Link>
    </div>
    <div>
      <Link href="/create-nft">
        <a className="p-6 active:text-violet-700 hover:text-pink-400 ">
          Create NFT
        </a>
      </Link>
    </div>
    <div>
      <Link href="/my-nfts">
        <a className="p-6 active:text-violet-700 hover:text-pink-400 ">
          My NFTs
        </a>
      </Link>
    </div >
    <div>
      <Link href="/dashboard">
        <a className="p-6 active:text-violet-700 hover:text-pink-400 ">
          All Nfts
        </a>
      </Link>
    </div >

  </>
)



function MyApp({ Component, pageProps }) {


  const [toggleMenu, setToggleMenu] = useState(false);

  return (

    <div>

      <nav className="  p-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">

        <div className='  flex'>

          <div>
            <img src="https://bitcoin-uni.de/assets/images/kompl.-b-day-mode-14x-8-192x151.png" className='h-14 w-16 p-1' />
          </div>




          <div className=" text-2xl pt-4 text-white    lg:flex   max-w-xl:hidden sm:hidden  hidden  ">
            <div className='  flex ml-40 '>
              <Menu />
            </div>
          </div>
          <div className='text-2xl flex pt-4  lg:hidden    absolute right-5 '>
            {toggleMenu
              ? <RiCloseLine color='#fff' size={37} onClick={() => setToggleMenu(false)} />
              : <RiMenu3Line color='#fff' size={37} onClick={() => setToggleMenu(true)} />
            }
          </div>
        </div>

        <div className=' lg:hidden  flex justify-center'>
          {toggleMenu && (
            <div className=' flex-col text-xl text-white font-semibold   flex justify-center '>
              <Menu />
            </div>
          )}
        </div>
      </nav>
      <Component {...pageProps} />
      <div className=' bg-black    h-70 '>


        <div className='grid grid-rows-1 grid-flow-col gap-3   text-white    justify-center '>
          <div className='mt-5 p-10  '>
            <h3 className='pb-5 text-lg'>Legal</h3>
            <p className=' mb-2  mr-6 '>Terms of use</p>
            <p className=' mb-2  mr-1   '>Privacy policy</p>
            <p className=' mb-2  mr-1  '>Contact</p>
          </div>

          <div className='mt-5 p-10 '>
            <h3 className='pb-5 text-lg'>Links</h3>
            <a href="https://bitcoin-uni.de"> <p className=' mb-2  mr-6 '>Guide</p> </a>


          </div>
        </div>



      </div>


    </div >

  )
}

export default MyApp