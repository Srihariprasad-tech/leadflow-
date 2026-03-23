import { ethers } from 'ethers'

export const CONTRACT_ADDRESS = '0xfd8E28e05a9f156eE20F242133Be8F7822dDDA8c'

export const CONTRACT_ABI = [
  "function logLead(string memory _name, string memory _email, string memory _tier, uint8 _score, string memory _hash) public",
  "function getTotalLogs() public view returns (uint256)",
  "function getLog(uint256 _index) public view returns (tuple(string leadName, string email, string tier, uint8 score, string decisionHash, uint256 timestamp, address loggedBy))",
  "function getStats() public view returns (uint256 total, uint256 hotCount, uint256 warmCount, uint256 coldCount)"
]

export async function logLeadOnChain(name, email, tier, score, decisionHash) {
  if (!window.ethereum) {
    throw new Error('MetaMask not found')
  }

  await window.ethereum.request({ method: 'eth_requestAccounts' })
  const provider = new ethers.BrowserProvider(window.ethereum)

  // Switch to Shardeum network
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x1FB7' }],
    })
  } catch (e) {
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [{
        chainId: '0x1FB7',
        chainName: 'Shardeum EVM Testnet',
        rpcUrls: ['https://api-mezame.shardeum.org'],
        nativeCurrency: { name: 'SHM', symbol: 'SHM', decimals: 18 },
        blockExplorerUrls: ['https://explorer-mezame.shardeum.org'],
      }]
    })
  }

  const signer = await provider.getSigner()
  const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
  const tx = await contract.logLead(name, email, tier, score, decisionHash)
  const receipt = await tx.wait()

  return {
    txHash: receipt.hash,
    blockNum: receipt.blockNumber,
  }
}

// Fallback helpers (used when MetaMask not connected)
export function genTxHash() {
  return '0x' + Array.from({ length: 64 }, () =>
    '0123456789abcdef'[Math.floor(Math.random() * 16)]
  ).join('')
}

export function genBlockNumber() {
  return Math.floor(3000000 + Math.random() * 500000)
}

export function genDecisionHash(name, tier, score) {
  const str = name + tier + score + Date.now()
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0
  }
  return '0x' + Math.abs(h).toString(16).padStart(8, '0') + Date.now().toString(16)
}

export function truncateHash(hash, start = 18) {
  return hash.slice(0, start) + '...'
}
