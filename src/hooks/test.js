import ABI from '../abis/test.json'
import { ethers } from "ethers";

let nftIds = []
let apeLinks = []
let nfts = []
let count;

const getNFTBal = async (contract, addr) => {
  const bal = await contract.balanceOf(addr)
  let num = (ethers.BigNumber.from(bal._hex).toNumber())
  count = num
  await getIds(num, contract, addr)
  console.log("Balance of NFTs: ", num)
}

const getIds = async (num, contract, addr) => {
  for(let i = 0; i < num; i++) {
    let id = await contract.tokenOfOwnerByIndex(addr, i)
    let newId = ethers.BigNumber.from(id._hex).toNumber()
    if(!nftIds.includes(newId)) {
      nftIds.push(newId)
    }
    console.log("Getting ID for index: ", i)
    console.log("ID: ", newId)
  }
}

const getLinks = async (contract) => {
  let links = []
  nftIds.forEach(async (n) => {
    await contract.tokenURI(n)
      .then((link) => {
        if(!apeLinks.includes(link)) {
          links.push(link)
          fetchImages(links)
        }
        console.log("Link: ", link)
        return link
      })
  })
}

const fetchImages = async (links) => {
  console.log(links)
  links.forEach(async (link) => {
    fetch(link, {
      method: 'GET',
      
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        let trueLink = data.image
        if(!nfts.includes(trueLink)) {
          nfts.push(trueLink)
        }
        return trueLink
    })
  })
}

export const getNFT = async (provider, addr) => {
  const contract = new ethers.Contract('0x59b39f40D272E5c227D2613A253650927751a88e', ABI, provider)

  return await getNFTBal(contract, addr).then(async () => {
    return await getLinks(contract).then(() => {
        return (count > 0) ? nfts : []
    })
  })

}