import { Keypair, Connection, Commitment, PublicKey, TransactionSignature } from "@solana/web3.js";
import { AuthorityType, createMint, setAuthority } from '@solana/spl-token';
import wallet from "../wba-wallet.json";

// Import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);
const token_decimals = 1_000_000n;

(async () => {
    try {
        // Start here
        // Create a new mint
        const mint = await createMint(connection, keypair, keypair.publicKey, null, 6);
        console.log(`Token Mint: https://explorer.solana.com/address/${mint}?cluster=devnet`);
        console.log(mint.toBase58());
    } catch(error) {
        console.log(`Oops, something went wrong: ${error}`)
    }
})()

// Output:
// Token Mint: https://explorer.solana.com/address/7VuA969pmH8nHypWqF9Dpyzt8Fsj5U6PSKdZbcQoDP6J?cluster=devnet
// 7VuA969pmH8nHypWqF9Dpyzt8Fsj5U6PSKdZbcQoDP6J