import { TableTransaction, ValueCellType } from "../tableTransaction/tableTransaction";
import styles from "./dd_table.module.css"
export interface DDTableComponentProps { }

const dummyData = [
    {
        criteria: "Privacy",
        zkSNARK: "Very high (hides all transaction data)",
        "Traditional Blockchain (BTC, ETH)": "None",
        "Optimistic Rollups": "Low",
        Sharding: "Low",
        zkSTARK: "High",
    },
    {
        criteria: "Processing Performance",
        zkSNARK: "High (fast, compact proofs)",
        "Traditional Blockchain (BTC, ETH)": "Low",
        "Optimistic Rollups": "Medium (depends on fraud proof time)",
        Sharding: "Medium (data fragmentation)",
        zkSTARK: "High (but larger than zkSNARK)",
    },
    {
        criteria: "Proof Size",
        zkSNARK: "Small (a few hundred bytes)",
        "Traditional Blockchain (BTC, ETH)": "N/A",
        "Optimistic Rollups": "N/A",
        Sharding: "N/A",
        zkSTARK: "Larger than zkSNARK",
    },
    {
        criteria: "Transaction Costs",
        zkSNARK: "Low (aggregates transactions)",
        "Traditional Blockchain (BTC, ETH)": "High",
        "Optimistic Rollups": "Low",
        Sharding: "Medium",
        zkSTARK: "Low",
    },
    {
        criteria: "Scalability",
        zkSNARK: "Low (aggregates transactions)",
        "Traditional Blockchain (BTC, ETH)": "Low",
        "Optimistic Rollups": "Good",
        Sharding: "Good",
        zkSTARK: "Very high",
    },
    {
        criteria: "Security",
        zkSNARK: "High (Zero-Knowledge)",
        "Traditional Blockchain (BTC, ETH)": "High (but no anonymity)",
        "Optimistic Rollups": "High",
        Sharding: "High",
        zkSTARK: "High",
    },
    {
        criteria: "Computation Requirements",
        zkSNARK: "High (complex setup)",
        "Traditional Blockchain (BTC, ETH)": "Low",
        "Optimistic Rollups": "Medium",
        Sharding: "Medium",
        zkSTARK: "Higher than zkSNARK",
    },
    {
        criteria: "Popular Use Cases",
        zkSNARK: "Zcash, Mina, zkSync, StarkNet",
        "Traditional Blockchain (BTC, ETH)": "Bitcoin, Ethereum L1",
        "Optimistic Rollups": "Arbitrum, Optimism",
        Sharding: "Ethereum 2.0",
        zkSTARK: "StarkNet",
    },
];

const columnTable = [
    {
        title: "Criteria",
        dataIndex: "criteria",
        key: "criteria",
        width: 208,
    },
    {
        title: "zkSNARK",
        dataIndex: "zkSNARK",
        key: "zkSNARK",
        width: 238,

        render: (value: ValueCellType) =>
            (<span style={{ opacity: value === "N/A" ? "0.6" : "1" }}>{`${value}`}</span>)
        ,
    },
    {
        title: "Traditional Blockchain (BTC, ETH)",
        dataIndex: "Traditional Blockchain (BTC, ETH)",
        key: "traditional",
        width: 238,

        render: (value: ValueCellType) =>
            (<span style={{ opacity: value === "N/A" ? "0.6" : "1" }}>{`${value}`}</span>)
        ,
    },
    {
        title: "Optimistic Rollups",
        dataIndex: "Optimistic Rollups",
        key: "optimisticRollups",
        width: 238,

        render: (value: ValueCellType) =>
            (<span style={{ opacity: value === "N/A" ? "0.6" : "1" }}>{`${value}`}</span>)
        ,
    },
    {
        title: "Sharding",
        dataIndex: "Sharding",
        key: "sharding",
        width: 238,

        render: (value: ValueCellType) =>
            (<span style={{ opacity: value === "N/A" ? "0.6" : "1" }}>{`${value}`}</span>)
        ,
    },
    {
        title: "zkSTARK",
        dataIndex: "zkSTARK",
        key: "zkSTARK",
        width: 238,

        render: (value: ValueCellType) =>
            (<span style={{ opacity: value === "N/A" ? "0.6" : "1" }}>{`${value}`}</span>)
        ,
    },
];

export function DDTableComponent({ }: DDTableComponentProps) {
    return (
    <div className={styles.containerPage}>
        <img className={styles.image_dino} src="/images/navbar_footer/image_Dino.png" alt="" />
        <TableTransaction 
        column={columnTable}
         data={dummyData} 
         tableClassName={styles.table} 
         wrapperClassName={styles.tableWrapper} 
         rowClassName={styles.tableHeadRow}
         bodyRowClassname={styles.bodyRow}
         />
    </div>
        
    );
}
