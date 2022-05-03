import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'
import { useRouter } from "next/router";


import {
    marketplaceAddress
} from '../config'

import NFTMarketplace from '../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json'




export default function NftDetails() {
    const [nfts, setNfts] = useState([])

    const router = useRouter()
    const { addr } = router.query

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

    if (loadingState === 'loaded' && !nfts.length) return (<h1 className="py-10 px-20 text-3xl">No NFTs listed</h1>)



    return (
        <div className='bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'>
            <div className="p-4  text-center ">
                <h2 className="text-2xl py-2">NFT Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-4 pt-4 content-center">

                    {
                        nfts.map((nft, i) => (
                            nft.token === addr ?
                                <div className="">
                                    <div className="">
                                        <p style={{ height: '64px' }} className="text-2xl font-semibold">{nft.name}</p>

                                    </div>
                                    <img src={nft.image} className="rounded" />

                                    <div className="p-4 bg-black">
                                        <p className="text-2xl font-bold text-white">Price - {nft.price} Eth</p>
                                    </div>






                                </div>

                                : null
                        ))


                    }

                </div>
            </div>
        </div >

    )



}
