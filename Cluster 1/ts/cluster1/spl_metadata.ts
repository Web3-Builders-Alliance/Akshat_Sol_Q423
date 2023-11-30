import { Keypair, PublicKey, Transaction } from "@solana/web3.js";
import wallet from "../wba-wallet.json";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { createMetadataAccountV3 } from "@metaplex-foundation/mpl-token-metadata";
import {
  createSignerFromKeypair,
  publicKey,
  signerIdentity,
} from "@metaplex-foundation/umi";
import base58 from "bs58";

//Create a Solana devnet connection
const umi = createUmi("https://api.devnet.solana.com");
const bs = base58.decode(wallet.toString());
let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(bs));
const myKeypairSigner = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(myKeypairSigner));

// Define our Mint address
const mint = new PublicKey("7VuA969pmH8nHypWqF9Dpyzt8Fsj5U6PSKdZbcQoDP6J")

// Add the Token Metadata Program
const token_metadata_program_id = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s')

// Create PDA for token metadata
const metadata_seeds = [
    Buffer.from('metadata'),
    token_metadata_program_id.toBuffer(),
    mint.toBuffer(),
];
const [metadata_pda, _bump] = PublicKey.findProgramAddressSync(metadata_seeds, token_metadata_program_id);

 (async () => {
  try {
    let myTransaction = createMetadataAccountV3(umi, {
      //accounts
      metadata: publicKey(metadata_pda.toString()),
      mint: publicKey(mint.toString()),
      mintAuthority: myKeypairSigner,
      payer: myKeypairSigner,
      updateAuthority: keypair.publicKey,
      data: {
        name: "TokenName",
        symbol: "TokenSymbol",
        uri: "example_uri.com",
        sellerFeeBasisPoints: 0,
        creators: null,
        collection: null,
        uses: null,
      },
      isMutable: true,
      collectionDetails: null,
    });

    let result = await myTransaction.sendAndConfirm(umi);

    console.log(result.signature);
  } catch (e) {
    console.error(`Oops, something went wrong: ${e}`);
  }
})();
