import { Keypair, PublicKey, Connection, Commitment } from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token';
import wallet from "../wba-wallet.json"

// Import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

const token_decimals = 1_000_00;

// Mint address
const mint = new PublicKey("7VuA969pmH8nHypWqF9Dpyzt8Fsj5U6PSKdZbcQoDP6J"); // This is the mint address for the token we created in the previous step

(async () => {
    try {
        // Create an ATA
        const ata = await getOrCreateAssociatedTokenAccount(connection, keypair, mint, keypair.publicKey);
        console.log(`Your ata is: ${ata.address.toBase58()}`);

        // Mint to ATA
        const mintTx = await mintTo(connection, keypair, mint, ata.address, keypair, 2*token_decimals, undefined);
        console.log(`Your mint txid: ${mintTx}`);
    } catch(error) {
        console.log(`Oops, something went wrong: ${error}`)
    }
})()

// Output:
// Your ata is: 9QWHR5MthPxqNNTmPfKUuTMRgwvkxMs12RFxAWNsPC7p
// Your mint txid: 5A1Yi2Z5BUCWP8EP7hBQzCiWG4583AhoJue3aDim9NjRGxiVdJoLvyjdAaYwp6GVGinJxCntMELJJew7pmeC9yxc