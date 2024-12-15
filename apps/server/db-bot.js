import { MongoClient, Decimal128 } from 'mongodb';

const USERNAME = process.env.MONGO_DB_USERNAME;
const PASSWORD = encodeURIComponent(process.env.MONGO_DB_PASSWORD);
const HOST = process.env.MONGO_DATABASE_URL;
const PORT = process.env.MONGO_DB_PORT;
const DB = process.env.MONGO_DB_NAME;
const AUTH_DB = process.env.MONGO_DB_NAME;

// Connection URL
const MONGO_URL = `mongodb://${USERNAME}:${PASSWORD}@${HOST}:${PORT}/${DB}?authSource=${AUTH_DB}`;
const MONGO_CLIENT = new MongoClient(MONGO_URL);

await MONGO_CLIENT.connect();

const MONGO_DB = MONGO_CLIENT.db(DB);

const MAX_MONGO_DOCUMENTS_REQUEST = 1000

function convertDecimal128Fields(doc, skip = ['_id']) {
    const convertedDoc = {};

    for (const [key, value] of Object.entries(doc)) {
        if (skip.includes(key)) {
            convertedDoc[key] = value;
            continue;
        }

        if (value instanceof Decimal128) {
            convertedDoc[key] = value.toString();
        } else if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
            convertedDoc[key] = convertDecimal128Fields(value);
        } else {
            convertedDoc[key] = value;
        }
    }

    return convertedDoc;
}

export const setup = async () => {
    if (
        !(await bot_user_faucet.haveIndexs() && 1)
    ) {
        await bot_user_faucet.collection().createIndexes([
            { key: { blockHeight: 1 }, name: "blockHeight_1" },
            { key: { isDrip: 1 }, name: "isDrip_1" },
            { key: { wallet: 1 }, name: "wallet_1" },
            { key: { timestamp: 1 }, name: "timestamp_1" },
        ]);
    }
}
export const clear = async () => {
    await bot_user_faucet.collection().deleteMany({});

    await MONGO_DB.dropCollection(bot_user_faucet.collectionName);
}

export const bot_user_faucet = {
    collectionName: "user_faucet",
    collection: function () {
        return MONGO_DB.collection(this.collectionName);
    },
    haveIndexs: async function () {
        try {
            return (await this.collection().listIndexes().toArray()).length > 0;
        } catch (error) {
            return false;
        }
    },
    insert: async function ({ blockHeight, isDrip = true, wallet }) {
        await this.collection().insertOne({
            blockHeight,
            isDrip,
            wallet,
            timestamp: new Date().valueOf()
        });
    },
    checkAddressDrip: async function (addressWallet) {
        const documents = await this.collection().find({
            wallet: addressWallet,
            isDrip: true
        }).limit(MAX_MONGO_DOCUMENTS_REQUEST).toArray();
        return documents.length > 0
    }
}