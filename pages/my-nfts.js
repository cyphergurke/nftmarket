import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'
import { useRouter } from 'next/router'

import {
    marketplaceAddress
} from '../config'

import NFTMarketplace from '../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json'

export default function MyAssets() {
    const [nfts, setNfts] = useState([])
    const [loadingState, setLoadingState] = useState('not-loaded')
    const router = useRouter()
    useEffect(() => {
        loadNFTs()
    }, [])
    async function loadNFTs() {
        const web3Modal = new Web3Modal({
            network: "mainnet",
            cacheProvider: true,
        })
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()

        const marketplaceContract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)
        const data = await marketplaceContract.fetchMyNFTs()

        const items = await Promise.all(data.map(async i => {
            const tokenURI = await marketplaceContract.tokenURI(i.tokenId)
            const meta = await axios.get(tokenURI)
            let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
            let item = {
                price,
                tokenId: i.tokenId.toNumber(),
                seller: i.seller,
                owner: i.owner,
                image: meta.data.image,
                name: meta.data.name,
                description: meta.data.description,
                tokenURI
            }
            return item
        }))
        setNfts(items)
        setLoadingState('loaded')
    }
    function listNFT(nft) {
        router.push(`/resell-nft?id=${nft.tokenId}&tokenURI=${nft.tokenURI}`)
    }
    if (loadingState === 'loaded' && !nfts.length) return (
        <div className="flex justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            <h1 className="py-10 px-20 text-3xl pt-96 pb-96">No NFTs owned</h1>
        </div>
    )
    return (
        <div className="flex justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 ">


            <div className="p-10 pt-40 pb-40">



                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 ">




                    {
                        nfts.map((nft, i) => (
                            <div key={i} className=" shadow rounded-xl overflow-hidden bg-white">
                                <img src={nft.image} className="h-60" />
                                <p  > Name: {nft.name}</p>

                                <div style={{ height: '70px', overflow: 'hidden' }}>
                                    <p className="mt-1">Description: {nft.description}</p>
                                </div>
                                <div className="p-4 bg-black">


                                    <p className="text-2xl font-bold text-white">Price - {nft.price} Eth</p>
                                    <button className="mt-4 w-full bg-pink-500 text-white font-bold py-2 px-12 rounded" onClick={() => listNFT(nft)}>List</button>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div >
    )
}