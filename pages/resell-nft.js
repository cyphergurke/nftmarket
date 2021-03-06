import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import axios from 'axios'
import Web3Modal from 'web3modal'

import {
    marketplaceAddress
} from '../config'

import NFTMarketplace from '../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json'

export default function ResellNFT() {
    const [formInput, updateFormInput] = useState({ price: '', image: '' })
    const router = useRouter()
    const { id, tokenURI } = router.query
    const { image, price } = formInput



    async function fetchNFT() {
        if (!tokenURI) return
        const meta = await axios.get(tokenURI)
        updateFormInput(state => ({ ...state, image: meta.data.image }))
    }
    useEffect(() => {
        fetchNFT()
    }, [id])
    async function listNFTForSale() {
        if (!price) return
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()

        const priceFormatted = ethers.utils.parseUnits(formInput.price, 'ether')
        let contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)
        let listingPrice = await contract.getListingPrice()

        listingPrice = listingPrice.toString()
        let transaction = await contract.resellToken(id, priceFormatted, { value: listingPrice })
        await transaction.wait()

        router.push('/')
    }

    return (
        <div className="flex justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">

            <div className="w-1/2 flex pt-40 pb-40  flex-col   mt-10">
                <div className='justify-center flex mt-7'>
                    <h1 className='text-4xl text-pink-500 font-bold mb-5'>Sell your NFT!</h1>
                </div>
                <input
                    placeholder="Asset Price in Eth"
                    className="mt-2 border rounded p-4"
                    onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
                />
                {
                    image && (
                        <img className="rounded mt-4" width="350" src={image} />
                    )
                }
                <button onClick={listNFTForSale} className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg">
                    List NFT
                </button>
            </div>
        </div>
    )
}