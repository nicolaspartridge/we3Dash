import BAYCABI from '../../abis/bayc.json'
import { ethers } from "ethers";

let nftIds = []
let apeLinks = []
let baycs = []
let count;

const getBAYCBal = async (contract, addr) => {
  const bal = await contract.balanceOf(addr)
  let num = (ethers.BigNumber.from(bal._hex).toNumber())
  count = num
  await getIds(num, contract, addr)
}

const getIds = async (num, contract, addr) => {
  for(let i = 0; i < num; i++) {
    let id = await contract.tokenOfOwnerByIndex(addr, i)
    let newId = ethers.BigNumber.from(id._hex).toNumber()
    if(!nftIds.includes(newId)) {
      nftIds.push(newId)
    }
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
        return link
      })
  })
}

const fetchImages = async (links) => {
  links.forEach(async (link) => {
    fetch(`https://ipfs.io/ipfs${link.slice(6)}`, {
      method: 'GET'
    })
      .then((response) => response.json())
      .then((data) => {
        let trueLink = `https://ipfs.io/ipfs${data.image.slice(6)}`
        if(!baycs.includes(trueLink)) {
          baycs.push(trueLink)
        }
        return trueLink
    })
  })
}

export const getBAYC = async (provider, addr) => {
  const contract = new ethers.Contract('0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D', BAYCABI, provider)

  return await getBAYCBal(contract, addr).then(async () => {
    return await getLinks(contract).then(() => {
        return (count > 0) ? baycs : []
    })
  })

}