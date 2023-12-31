import {
    TransactionInstruction,
    TransactionInstructionCtorFields,
    Connection,
    Keypair,
    PublicKey,
    Transaction,
    sendAndConfirmTransaction,
    LAMPORTS_PER_SOL,
    clusterApiUrl
} from "@solana/web3.js"

async function callProgram(
    connection: Connection,
    payer: Keypair,
    programId: PublicKey,
    programDataAccount: PublicKey) {
    const inst = new TransactionInstruction({
        keys: [
            {
                pubkey: programDataAccount,
                isSigner: false,
                isWritable: true,
            }
        ],
        programId
    });

    const tx = new Transaction().add(inst);
    const sig = await sendAndConfirmTransaction(connection, tx, [payer]);

    console.log(`Tx Completed! Signature is ${sig}`);
}

async function pingTransaction(con: Connection, payer: Keypair) {
    const PING_PROGRAM_ADDRESS = new PublicKey('ChT1B39WKLS8qUrkLvFDXMhEJ4F1XZzwUNHUt4AU9aVa')
    const PING_PROGRAM_DATA_ADDRESS = new PublicKey('Ah9K7dQ8EHaZqcAsgBW8w37yN2eAy3koFmUn4x3CJtod')

    const tx = new Transaction();
    const programId = new PublicKey(PING_PROGRAM_ADDRESS);
    const pingProgramDataId = new PublicKey(PING_PROGRAM_DATA_ADDRESS);

    const inst = new TransactionInstruction({
        keys: [
            {
                pubkey: pingProgramDataId,
                isSigner: false,
                isWritable: true,
            }
        ],
        programId
    });
    tx.add(inst);

    const sig = await sendAndConfirmTransaction(con, tx, [payer]);
    console.log(`Tx Completed! Signature is ${sig}`);
    console.log(`You can view your transaction on the Solana Explorer at:\nhttps://explorer.solana.com/tx/${airdropSignature}?cluster=devnet`)
}

const con = new Connection(clusterApiUrl("devnet"));
const alice = Keypair.generate();

// airdrop to alice
const airdropSignature = await con.requestAirdrop(alice.publicKey, LAMPORTS_PER_SOL * 1);
const adblockhash = await con.getLatestBlockhash();
await con.confirmTransaction({
    abortSignal: undefined,
    signature: airdropSignature,
    blockhash: adblockhash.blockhash,
    lastValidBlockHeight: adblockhash.lastValidBlockHeight
});
const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));
console.log("sleep 10 sec");
await sleep(10000);

const balance_alice = await con.getBalance(alice.publicKey);
console.log(`alice: ${alice.publicKey.toBase58()}, balance: ${balance_alice}`);

// call on chain program
await pingTransaction(con, alice);