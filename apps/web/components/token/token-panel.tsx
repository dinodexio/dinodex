import { Table } from "../table/table";
import Image from "next/image";
import { formatLargeNumber, formatterInteger } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { LIST_TOKENS } from "@/tokens";
import { EMPTY_DATA } from "@/constants";

export interface TokenPanelProps {
}

let columTableToken = [
    {
        id: 1,
        title: '#',
        key: 'numberic',
        width: 57,
        render: (data: any) => {
            return (<span>{data?.index}</span>)
        }
    },
    {

        id: 2,
        title: 'Token Name',
        key: 'token-name',
        width: 230,
        render: (data: any) => {
            return (<div className="token-info">
                <Image src={data?.logo} alt={data?.name} width={24} height={24} />
                <span className="token-name-text">{data?.name?.length > 8 ? data?.name?.slice(0, 8) + "..." : data?.name}</span>
                <span className="token-symbol-text">{data?.symbol}</span>
            </div>)
        }

    },
    {

        id: 3,
        title: 'Price',
        key: 'price',
        width: 150,
        render: (data: any) => {
            return <span className="price-text">${formatterInteger(data?.price)}</span>
        }
    },
    {

        id: 4,
        title: '1 hour',
        key: 'change1h',
        width: 150,
        render: (data: any) => {
            return !data?.change1h ? <span>-</span> : Number(data?.change1h) > 0 ?
                <span className="text-change text-green">
                    <Image src="images/token/change-up.svg" alt="arrow-up" width={12} height={12} />
                    {data?.change1h}%
                </span> :
                <span className="text-change text-red">
                    <Image src="images/token/change-down.svg" alt="arrow-down" width={12} height={12} />
                    {data?.change1h}%
                </span>
        }

    },
    {
        id: 5,
        title: '1 day',
        key: 'change1d',
        width: 150,
        render: (data: any) => {
            return !data?.change1d ? <span>-</span> : Number(data?.change1d) > 0 ?
                <span className="text-change text-green">
                    <Image src="images/token/change-up.svg" alt="arrow-up" width={12} height={12} />
                    {data?.change1d}%
                </span> :
                <span className="text-change text-red">
                    <Image src="images/token/change-down.svg" alt="arrow-down" width={12} height={12} />
                    {data?.change1d}%
                </span>
        }
    },
    {

        id: 6,
        title: 'FDV',
        key: 'fdv',
        width: 150,
        render: (data: any) => {
            return <span>${formatLargeNumber(data?.fdv)}</span>
        }
    },
    {

        id: 7,
        title: <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'end' }}><Image src="/icon/header-time-transaction-icon.svg" alt='' width={24} height={24} />Volume</div>,
        key: 'volume',
        width: 150,
        render: (data: any) => {
            return <span>${formatLargeNumber(data?.volume)}</span>
        }
    },
    {
        id: 8,
        title: '',
        key: 'chart',
        width: 100,
        render: (data: any) => {
            const randomImage = Math.random() < 0.5 ? 'chart-price-dummy-1.svg' : 'chart-price-dummy-2.svg';
            return <span style={{ display: 'block', width: 100, height: 24 }}><Image src={`images/token/${randomImage}`} alt="chart" width={100} height={24} /></span>
        }
    },

]

const DATA_TOKENS = Object.entries(LIST_TOKENS).map(([tokenId, infoToken], index) => ({
    index: index + 1,
    id: tokenId,
    logo: infoToken?.logo,
    name: infoToken?.name,
    slug: `${infoToken?.ticker}${tokenId}`, // TODO change slug after tokens contract
    symbol: infoToken?.ticker,
    price: EMPTY_DATA, // TODO change slug after tokens contract
    change1h: EMPTY_DATA, // TODO change slug after tokens contract
    change1d: EMPTY_DATA, // TODO change slug after tokens contract
    fdv: EMPTY_DATA, // TODO change slug after tokens contract
    volume: EMPTY_DATA, // TODO change slug after tokens contract
}))

export function TokenPanel({ }: TokenPanelProps) {
    const router = useRouter();
    return (
        <>
            <Table
                data={DATA_TOKENS}
                column={columTableToken}
                onClickTr={(dataToken) => { router.push(`/tokens/${dataToken?.slug}`) }}
            />
        </>
    );
}
