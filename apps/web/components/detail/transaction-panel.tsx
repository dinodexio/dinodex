import { formatLargeNumber, formatterInteger } from "@/lib/utils";
import { Table } from "../table/table";
import Image from "next/image";

export interface TransactionPanelProps {
    token: object | undefined
}

let dataTokenTransaction = [
    {
        id: 1,
        timeStamp: '2024-02-01 10:00:00',
        token: {
            logo: 'images/swap/logo-token-default.svg',
            name: 'ethereum',
            symbol: 'ETH',
            value: 0.021,
        },
        value: 1000.02,
        action: 'buy',
        address: '0x1234567890123456789012345678901234567890',
    },
    {
        id: 2,
        timeStamp: '2024-02-01 10:00:00',
        token: {
            logo: 'images/swap/logo-token-default.svg',
            name: 'ethereum',
            symbol: 'ETH',
            value: 1,
        },
        value: 320.10,
        action: 'sell',
        address: '0x1234567890123456789012345678901234567890',
    },
    {
        id: 3,
        timeStamp: '2024-02-01 10:00:00',
        token: {
            logo: 'images/swap/logo-token-default.svg',
            name: 'ethereum',
            symbol: 'ETH',
            value: 1.88,
        },
        value: 1000.02,
        action: 'buy',
        address: '0x1234567890123456789012345678901234567890',
    },
    {
        id: 4,
        timeStamp: '2024-02-01 10:00:00',
        token: {
            logo: 'images/swap/logo-token-default.svg',
            name: 'ethereum',
            symbol: 'ETH',
            value: 1.02,
        },
        value: 2907.01,
        action: 'sell',
        address: '0x1234567890123456789012345678901234567890',
    },
]


export function TransactionPanel({ token }: TransactionPanelProps) {
    let columnTableTransactionTokenInfo = [
        {
            id: 1,
            title: 'Time',
            key: 'time-transaction',
            width: 100,
            render: (_: any) => {
                return <span>19m ago</span>
            }
        },
        {
            id: 2,
            title: 'Type',
            key: 'Type-transaction',
            width: 90,
            render: (data: any) => {
                return <span className={`${data?.action === 'sell' ? 'text-red' : 'text-green'} text-action`}>{data?.action} </span>
            }
        },
        {
            id: 3,
            title: '$USDT',
            key: 'usdt-transaction',
            width: 120,
            render: (data: any) => {
                return <span>{formatterInteger(data?.value)}</span>
            }
        },
        {
            id: 4,
            title: 'For',
            key: 'for-transaction',
            width: 145,
            render: (data: any) => {
                return (
                    <div className="token-item">
                        <span>{formatterInteger(data?.token?.value)}</span>
                        <Image src={'/' + data?.token?.logo} alt="token" width={20} height={20} />
                        <span>{data?.token?.symbol}</span>
                    </div>
                )
            }
        },
        {
            id: 5,
            title: 'USD',
            key: 'usd-transaction',
            width: 120,
            render: (data: any) => {
                return <span>{formatterInteger(Number((Number(data?.value) * 1.01).toFixed(2)))}</span>
            }
        },
        {
            id: 6,
            title: 'Wallet',
            key: 'wallet-transaction',
            width: 150,
            render: (data: any) => {
                return <span>{data?.address.slice(0, 6)}...${data?.address.slice(-4)}</span>
            }
        },
    ]
    return (
        <>
            <Table
                data={dataTokenTransaction}
                column={columnTableTransactionTokenInfo}
                onClickTr={() => { }}
                classTable="table-layout"
            />
        </>
    );
}
