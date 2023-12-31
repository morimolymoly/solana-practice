import { LAMPORTS_PER_SOL, Keypair, Transaction, SystemProgram, Connection, sendAndConfirmTransaction } from "@solana/web3.js";

const connection = new Connection("http://127.0.0.1:8899", "confirmed");

const alice = Keypair.generate();

// airdrop to alice
const airdropSignature = await connection.requestAirdrop(alice.publicKey, LAMPORTS_PER_SOL * 100);
const adblockhash = await connection.getLatestBlockhash();
await connection.confirmTransaction({
    abortSignal: undefined,
    signature: airdropSignature,
    blockhash: adblockhash.blockhash,
    lastValidBlockHeight: adblockhash.lastValidBlockHeight
});

const balance_alice = await connection.getBalance(alice.publicKey);
console.log(`alice: ${alice.publicKey.toBase58()}, balance: ${balance_alice}`);

const bob = Keypair.generate();
console.log(`bob: ${bob.publicKey.toBase58()}`);

// send transaction for alice to bob trasfering sol
const tx = new Transaction().add(SystemProgram.transfer({
    fromPubkey: alice.publicKey,
    toPubkey: bob.publicKey,
    lamports: LAMPORTS_PER_SOL * 50,
}));
await sendAndConfirmTransaction(connection, tx, [alice]);


const balance_alice2 = await connection.getBalance(alice.publicKey);
const balance_bob = await connection.getBalance(alice.publicKey);

console.log(`alice: ${alice.publicKey.toBase58()}, balance: ${balance_alice2}`);
console.log(`bob: ${alice.publicKey.toBase58()}, balance: ${balance_bob}`);