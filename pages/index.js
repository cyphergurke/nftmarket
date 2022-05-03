import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'

import {
  marketplaceAddress
} from '../config'

import NFTMarketplace from '../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json'

export default function Home() {
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  useEffect(() => {
    loadNFTs()
  }, [])
  async function loadNFTs() {
    /* create a generic provider and query for unsold market items */
    const provider = new ethers.providers.JsonRpcProvider()
    const contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, provider)
    const data = await contract.fetchMarketItems()

    /*
    *  map over items returned from smart contract and format 
    *  them as well as fetch their token metadata
    */
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
        tags: meta.data.tags,
        creator: meta.data.creator,
      }
      return item
    }))
    setNfts(items)
    setLoadingState('loaded')
  }
  async function buyNft(nft) {
    /* needs the user to sign the transaction, so will use Web3Provider and sign it */
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)

    /* user will be prompted to pay the asking proces to complete the transaction */
    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')
    const transaction = await contract.createMarketSale(nft.tokenId, {
      value: price
    })
    await transaction.wait()
    loadNFTs()
  }




  if (loadingState === 'loaded' && !nfts.length) return (
    <div className="flex justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <h1 className="py-10 px-20 text-3xl pt-96 pb-96">No NFTs in Marketplace</h1>
    </div>
  )
  return (
    <div className="flex justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500  ">
      <div className="p-10 pt-40 pb-40" style={{ maxWidth: '1600px' }}>
        <div className=" grid  flex-row h-min sm:grid-cols-2 lg:grid-cols-4 gap-4  ">
          {
            nfts.map((nft, i) => (
              <div key={i} className="bg-white shadow rounded-xl overflow-hidden ">
                <img src={nft.image} className="h-60" />
                <div className="p-4">
                  <p id="name" style={{ height: '44px' }} className="text-2xl font-semibold">{nft.name}</p>
                  <div style={{ height: '70px', overflow: 'hidden' }}>
                    <p className="text-gray-400">Description:  {nft.description}</p>
                    <p className="text-gray-400">Tags: {nft.tags}</p>
                    <p className="text-gray-400">Creator: {nft.creator}</p>
                  </div>
                </div>
                <div className="p-4 bg-black">
                  <p className="text-2xl font-bold text-white">{nft.price} ETH</p>
                  <button className="mt-4 w-full bg-pink-500 text-white font-bold py-2 px-12 rounded" onClick={() => buyNft(nft)}>Buy</button>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div >
  )
}