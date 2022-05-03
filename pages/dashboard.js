import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'
import Link from 'next/link'

import {
    marketplaceAddress
} from '../config'

import NFTMarketplace from '../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json'

export default function CreatorDashboard() {
    const [nfts, setNfts] = useState([])

    const [loadingState, setLoadingState] = useState('not-loaded')
    useEffect(() => {
        loadNFTs()
    }, [])
    async function loadNFTs() {
        const web3Modal = new Web3Modal({
            network: 'mainnet',
            cacheProvider: true,
        })
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()

        const contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)
        const data = await contract.fetchItemsListed()

        const items = await Promise.all(data.map(async i => {
            const tokenUri = await contract.tokenURI(i.tokenId)


            const meta = await axios.get(tokenUri)
            let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
            let item = {
                price,
                tokenId: i.tokenId.toNumber(),
                seller: i.seller,
                owner: i.owner,
                image: meta.data.image,
                name: meta.data.name,
                description: meta.data.description,
                token: tokenUri.slice(28),
            }

            return item


        }))

        setNfts(items)
        setLoadingState('loaded')
    }




    if (loadingState === 'loaded' && !nfts.length) return (


        <div className="flex justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            <h1 className="py-10 px-20 text-3xl pt-96 pb-96">No NFTs listed</h1>
        </div>
    )
    return (
        <div className='bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'>
            <div className="p-10 pt-40 pb-40 text-center ">

                <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-4 gap-4 pt-4 content-center">
                    {
                        nfts.map((nft, i) => (

                            <div key={i} className="  shadow rounded-xl overflow-hidden bg-white">
                                <img src={nft.image} className="h-60" />
                                <div className="p-4">
                                    <p className="text-2xl font-semibold">Name: {nft.name}</p>
                                    <p className="text-2xl font-semibold">Description: {nft.description}</p>
                                </div>


                                <Link href={`/details/?addr=${nft.token}`}>
                                    <div className=" w-13 rounded bg-amber-400 text-center">
                                        <button className="text-center" >Details</button>
                                    </div>
                                </Link>

                                <div className="p-4 bg-black">
                                    <p className="text-2xl font-bold text-white">Price - {nft.price} Eth</p>
                                </div>
                            </div>


                        ))
                    }
                </div>
            </div>
        </div >
    )
}