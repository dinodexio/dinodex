-- CreateTable
CREATE TABLE "Block" (
    "height" INTEGER NOT NULL,

    CONSTRAINT "Block_pkey" PRIMARY KEY ("height")
);

-- CreateTable
CREATE TABLE "Balance" (
    "address" TEXT NOT NULL,
    "tokenId" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "waitForUpdate" BOOLEAN NOT NULL,

    CONSTRAINT "Balance_pkey" PRIMARY KEY ("address", "tokenId")
);

-- CreateTable
CREATE TABLE "Pool" (
    "poolKey" TEXT NOT NULL,
    "tokenAId" TEXT NOT NULL,
    "tokenBId" TEXT NOT NULL,
    "tokenAAmount" TEXT NOT NULL,
    "tokenBAmount" TEXT NOT NULL,
    "path" JSONB NOT NULL,
    "blockHeight" INTEGER NOT NULL,
    "updateBlockHeight" INTEGER NOT NULL,
    "createAt" TIMESTAMP with time zone DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP with time zone DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pool_pkey" PRIMARY KEY ("poolKey")
);

-- CreateTable
CREATE TABLE "PoolAction" (
    "hash" TEXT NOT NULL,
    "blockHeight" INTEGER NOT NULL,
    "creator" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL,
    "eventIndex" INTEGER NOT NULL,
    "poolKey" TEXT NOT NULL,
    "directionAB" BOOLEAN NOT NULL,
    "tokenAId" TEXT NOT NULL,
    "tokenBId" TEXT NOT NULL,
    "tokenAAmount" TEXT NOT NULL,
    "tokenBAmount" TEXT NOT NULL,
    "tokenAPrice" FLOAT,
    "tokenBPrice" FLOAT,
    "type" TEXT NOT NULL,
    "createAt" TIMESTAMP with time zone DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PoolAction_pkey" PRIMARY KEY ("hash", "eventIndex")
);

-- CreateTable
CREATE TABLE "HistoryPool" (
    "id" SERIAL,
    "hash" TEXT NOT NULL,
    "blockHeight" INTEGER NOT NULL,
    "poolKey" TEXT NOT NULL,
    "tokenAId" TEXT NOT NULL,
    "tokenBId" TEXT NOT NULL,
    "tokenAAmount" TEXT NOT NULL,
    "tokenBAmount" TEXT NOT NULL,
    "tokenAPrice" FLOAT,
    "tokenBPrice" FLOAT,
    "createAt" TIMESTAMP with time zone DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HistoryPool_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RouteStable" (
    "tokenId" TEXT NOT NULL,
    "tokenStableId" TEXT NOT NULL,
    "vector" JSONB NOT NULL,

    CONSTRAINT "RouteStable_pkey" PRIMARY KEY ("tokenId", "tokenStableId")
);

-- CreateTable
CREATE TABLE "Token" (
    "tokenId" TEXT NOT NULL,
    "price" FLOAT NOT NULL,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("tokenId")
);

-- CreateTable
CREATE TABLE "HistoryToken" (
    "id" SERIAL,
    "blockHeight" INTEGER NOT NULL,
    "tokenId" TEXT NOT NULL,
    "tokenStableId" TEXT NOT NULL,
    "price" FLOAT NOT NULL,
    "createAt" TIMESTAMP with time zone DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HistoryToken_pkey" PRIMARY KEY ("id")
);