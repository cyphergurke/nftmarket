import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { useRouter } from 'next/router'
import Web3Modal from 'web3modal'
import { SkynetClient } from "skynet-js"
//import axios from 'axios'
import { marketplaceAddress } from '../config'
import NFTMarketplace from '../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json'


const skyclient = new SkynetClient('https://siasky.net');
const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')


export default function CreateItem() {
    const [fileUrl, setFileUrl] = useState(null)
    const [formInput, updateFormInput] = useState({ price: '', name: '', description: '', tags: '', creator: '' })
    const router = useRouter()

    //get
    //   const [jsondata, setJSON] = useState('');
    //const [jsonlink, setJSONlink] = useState([]);
    //  const [metalink, setMetalink] = useState([{}]);

    //  https://www.youtube.com/watch?v=GgzWFxIiwK4&list=PLC3y8-rFHvwgC9mj0qv972IO5DmD-H0ZH&index=44


    /*
            const fetchjson = async () => {
                const response = await fetch('/api')
                const data = await response.json()
                setJSONlink(data)
                console.log('Success!')
            }
            const link = jsonlink.skylink
            console.log(link)
        
    
    
        const submitjson = async () => {
            const response = await fetch('/api', {
                method: 'POST',
                body: JSON.stringify({ postitem }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const data = await response.json()
            setJSONlink(data)
    
            console.log(data.name, data.tags)
        }
    */


    /**
        useEffect(() => {
            fetch("/api")
                .then((res) => res.json())
                .then((jsondata) => setJSON(jsondata.message));
        }, []);
    
        if (!jsondata) {
            console.log("Loading")
        } else {
            console.log(jsondata)
        }
        //console.log(jsondata)
    
     


    async function upskynet(e) { //upskynet
        /* upload image to skynet  
        const file = e.target.files[0]
        try {
            const { skylink } = await client.uploadFile(file)

            const link = skylink.slice(6)
            const url = `https://siasky.net/${link}`
            //  console.log(url)
            setFileUrl(url)
            return url
        } catch (error) {
            console.log('Error uploading file: ', error)
        }
    }

    const postitem = { name: 'peter', description: 'asdaw', tags: 'Asd', creator: 'aasd', price: 123 }




    useEffect(() => {
        fetch("/api").then(
            response => response.json()
        ).then(
            data => {
                setMetalink(data)
            }
        )
    }, [])
    */
    /*
    fetch("http://localhost:3001/api", {
        method: 'POST',
        body: postitem,
        headers: {
            'Content-Type': 'applications/json'
        }
    })
        .then(res => res.json())
        .then(
            (result) => {

                //callback for the response
            }
        );
   */

    /**
        useEffect(() => {
            // POST request using axios inside useEffect React hook
    
            axios.post('/api', data)
                .then(response => setJSON(response.data.jsondata));
        }, []);
    
    
    
        useEffect(() => {
            axios.get('/api')
                .then(res => {
                    setJSONlink(res.data.skylink)
                    console.log('success!')
                })
                .catch(err => {
                    console.log(err)
                })
        }, [])
        const linksky = jsonlink.skylink
    
    
     */


    /*
        async function uploadToSkynet() { //uploadToSkynet
            const { name, description, tags, creator, price } = formInput
            if (!name || !description || !tags || !creator || !price || !fileUrl) return
            /*     metadata    
            fs.writeFileSync('./jsonlink.json', formInput)
    
            try {
                const { skylink } = await client.uploadFile(file)
    
                const link = skylink.slice(6)
                const url = `https://siasky.net/${link}`
                /* after metadata is uploaded to Skynet, return the URL to use it in the transaction     
                return url
            } catch (error) {
                console.log('Error uploading file: ', error)
            }
        }
     */


    async function onChange(e) { //upskynet
        // upload image to skynet  
        const file = e.target.files[0]
        try {
            const { skylink } = await skyclient.uploadFile(file)

            const link = skylink.slice(6)
            const url = `https://siasky.net/${link}`
            //  console.log(url)
            setFileUrl(url)

        } catch (error) {
            console.log('Error uploading file: ', error)
        }
    }

    /**   async function onChange(e) {
           //upload image to IPFS  
           const file = e.target.files[0]
           try {
               const added = await client.add(
                   file,
                   {
                       progress: (prog) => console.log(`received: ${prog}`)
                   }
               )
               const url = `https://ipfs.infura.io/ipfs/${added.path}`
               setFileUrl(url)
           } catch (error) {
               console.log('Error uploading file: ', error)
           }
       } */
    console.log(fileUrl)
    async function uploadToIPFS() {
        const { name, description, tags, creator, price } = formInput
        if (!name || !description || !tags || !creator || !price || !fileUrl) return
        //first, upload metadata to IPFS  
        const data = JSON.stringify({
            name, description, tags, creator, image: fileUrl
        })
        try {
            const added = await client.add(data)
            const url = `https://ipfs.infura.io/ipfs/${added.path}`
            // after metadata is uploaded to IPFS, return the URL to use it in the transaction  
            console.log("Ssuccess")
            return url
        } catch (error) {
            console.log('Error uploading file: ', error)
        }
    }




    async function listNFTForSale() {
        const url = await uploadToIPFS()
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()

        /* create the NFT */

        const price = ethers.utils.parseUnits(formInput.price, 'ether')
        let contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)
        let listingPrice = await contract.getListingPrice()
        listingPrice = listingPrice.toString()
        let transaction = await contract.createToken(url, price, { value: listingPrice })
        await transaction.wait()


        router.push('/')

    }

    return (
        <div className="flex justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">

            <div className="lg:w-1/2 md:w-1/2 flex flex-col pb-12">


                <div className='justify-center flex mt-10'>
                    <h1 className='text-4xl text-white font-bold'>Create your NFT!</h1>
                </div>


                <input
                    placeholder="Asset Name"
                    className="mt-8 border rounded p-4"
                    onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
                />

                <textarea
                    placeholder="Asset Description"
                    className="mt-2 border rounded p-4"
                    onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
                />
                <input
                    placeholder="Asset tags"
                    className="mt-2 border rounded p-4"

                    name="tags"
                    onChange={e => updateFormInput({ ...formInput, tags: e.target.value })}
                />

                <input
                    placeholder="Asset Creator"
                    className="mt-2 border rounded p-4"
                    onChange={e => updateFormInput({ ...formInput, creator: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Asset Price in Eth"
                    className="mt-8 border rounded p-4"

                    onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
                />
                <div className='justify-center flex'>
                    <input
                        type="file"
                        name="Asset"
                        className=" mt-4 block w-full text-sm text-black-700
                          file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-violet-50 file:text-violet-700
                        hover:file:bg-violet-100"
                        onChange={onChange} //onChange upskynet
                    />
                </div>
                {
                    fileUrl && (
                        <img className="rounded mt-4" width="350" src={fileUrl} />
                    )
                }
                <button onClick={listNFTForSale} className=" bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500  font-bold mt-4  text-white rounded p-4 shadow-lg    ">
                    Create NFT
                </button>

            </div>

        </div>
    )
}