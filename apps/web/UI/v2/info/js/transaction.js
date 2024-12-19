import { renderTable } from "./table.js";

const FAKE_DATA = [
  {
    type: "Payment",
    transfer: {
      sender: {
        avt: "asda",
        name: "MinaStake.com",
        address: "B62gm•••hYLszT",
      },
      recipient: {
        address: "B62gm•••hYLszT",
      },
    },
    status: "Pending",
    age: "12s",
    amount: { value: "0.000085", memo: "Paribu" },
    currency: "MINA",
    fee: { value: "0.0001" },
    block: {
      nonce: "787479",
    },
    details: {
      transactionType: "Payment",
      transactionHash: "5Ju...vDfnQx",
      block: "408,904",
      confirmations: "7 blocks after",
      created: "30.11.2024 UTC 09:15",
      nonce: "236776",
      blockStateHash: "5Ju...vDfnQx",
      transfer: {
        sender: {
          name: "DexHeim",
          address: "5Ju...vDfnQx",
          memo: "ukr svin, oink oink",
          fee: "0.007003",
          feeCurrency: "MINA",
        },
        recipient: {
          address: "5Ju...vDfnQx",
        },
      },
      balanceChange: [
        {
          account: "MinaStake.com",
          change: "0.000085",
          balanceBefore: "777.572171893",
          balanceAfter: "777.572171893",
          currency: "MINA",
        },
        {
          account: "MinaStake.com",
          change: "0.000085",
          balanceBefore: "3,878.038079566",
          balanceAfter: "3,878.038079566",
          currency: "MINA",
        },
      ],
    },
  },
  {
    type: "Payment",
    transfer: {
      sender: {
        avt: "asda",
        name: "MinaStake.com",
        address: "B62gm•••hYLszT",
      },
      recipient: {
        address: "B62gm•••hYLszT",
      },
    },
    status: "Pending",
    age: "12s",
    amount: { value: "0.000085", memo: "Paribu" },
    currency: "MINA",
    fee: { value: "0.0001" },
    block: {
      nonce: "787479",
    },
    details: {
      transactionType: "Payment",
      transactionHash: "5Ju...vDfnQx",
      block: "408,904",
      confirmations: "7 blocks after",
      created: "30.11.2024 UTC 09:15",
      nonce: "236776",
      blockStateHash: "5Ju...vDfnQx",
      transfer: {
        sender: {
          name: "DexHeim",
          address: "5Ju...vDfnQx",
          memo: "ukr svin, oink oink",
          fee: "0.007003",
          feeCurrency: "MINA",
        },
        recipient: {
          address: "5Ju...vDfnQx",
        },
      },
      balanceChange: [
        {
          account: "MinaStake.com",
          change: "0.000085",
          balanceBefore: "777.572171893",
          balanceAfter: "777.572171893",
          currency: "MINA",
        },
        {
          account: "MinaStake.com",
          change: "0.000085",
          balanceBefore: "3,878.038079566",
          balanceAfter: "3,878.038079566",
          currency: "MINA",
        },
      ],
    },
  },
  {
    type: "Payment",
    transfer: {
      sender: {
        name: "MinaStake.com",
        address: "B62gm•••hYLszT",
      },
      recipient: {
        address: "B62gm•••hYLszT",
      },
    },
    status: "Pending",
    age: "12s",
    amount: { value: "0.000085", memo: "Paribu" },
    currency: "MINA",
    fee: { value: "0.0001" },
    block: {
      nonce: "787479",
    },
    details: {
      transactionType: "Payment",
      transactionHash: "5Ju...vDfnQx",
      block: "408,904",
      confirmations: "7 blocks after",
      created: "30.11.2024 UTC 09:15",
      nonce: "236776",
      blockStateHash: "5Ju...vDfnQx",
      transfer: {
        sender: {
          name: "DexHeim",
          address: "5Ju...vDfnQx",
          memo: "ukr svin, oink oink",
          fee: "0.007003",
          feeCurrency: "MINA",
        },
        recipient: {
          address: "5Ju...vDfnQx",
        },
      },
      balanceChange: [
        {
          account: "MinaStake.com",
          change: "0.000085",
          balanceBefore: "777.572171893",
          balanceAfter: "777.572171893",
          currency: "MINA",
        },
        {
          account: "MinaStake.com",
          change: "0.000085",
          balanceBefore: "3,878.038079566",
          balanceAfter: "3,878.038079566",
          currency: "MINA",
        },
      ],
    },
  },
  {
    type: "Payment",
    transfer: {
      sender: {
        name: "MinaStake.com",
        address: "B62gm•••hYLszT",
      },
      recipient: {
        address: "B62gm•••hYLszT",
      },
    },
    status: "Pending",
    age: "12s",
    amount: { value: "0.000085", memo: "Paribu" },
    currency: "MINA",
    fee: { value: "0.0001" },
    block: {
      nonce: "787479",
    },
    details: {
      transactionType: "Payment",
      transactionHash: "5Ju...vDfnQx",
      block: "408,904",
      confirmations: "7 blocks after",
      created: "30.11.2024 UTC 09:15",
      nonce: "236776",
      blockStateHash: "5Ju...vDfnQx",
      transfer: {
        sender: {
          name: "DexHeim",
          address: "5Ju...vDfnQx",
          memo: "ukr svin, oink oink",
          fee: "0.007003",
          feeCurrency: "MINA",
        },
        recipient: {
          address: "5Ju...vDfnQx",
        },
      },
      balanceChange: [
        {
          account: "MinaStake.com",
          change: "0.000085",
          balanceBefore: "777.572171893",
          balanceAfter: "777.572171893",
          currency: "MINA",
        },
        {
          account: "MinaStake.com",
          change: "0.000085",
          balanceBefore: "3,878.038079566",
          balanceAfter: "3,878.038079566",
          currency: "MINA",
        },
      ],
    },
  },
  {
    type: "Payment",
    transfer: {
      sender: {
        name: "MinaStake.com",
        address: "B62gm•••hYLszT",
      },
      recipient: {
        address: "B62gm•••hYLszT",
      },
    },
    status: "Pending",
    age: "12s",
    amount: { value: "0.000085", memo: "Paribu" },
    currency: "MINA",
    fee: { value: "0.0001" },
    block: {
      nonce: "787479",
    },
    details: {
      transactionType: "Payment",
      transactionHash: "5Ju...vDfnQx",
      block: "408,904",
      confirmations: "7 blocks after",
      created: "30.11.2024 UTC 09:15",
      nonce: "236776",
      blockStateHash: "5Ju...vDfnQx",
      transfer: {
        sender: {
          name: "DexHeim",
          address: "5Ju...vDfnQx",
          memo: "ukr svin, oink oink",
          fee: "0.007003",
          feeCurrency: "MINA",
        },
        recipient: {
          address: "5Ju...vDfnQx",
        },
      },
      balanceChange: [
        {
          account: "MinaStake.com",
          change: "0.000085",
          balanceBefore: "777.572171893",
          balanceAfter: "777.572171893",
          currency: "MINA",
        },
        {
          account: "MinaStake.com",
          change: "0.000085",
          balanceBefore: "3,878.038079566",
          balanceAfter: "3,878.038079566",
          currency: "MINA",
        },
      ],
    },
  },
];

const columns = [
  {
    title: "Type",
    dataIndex: "type",
    width: 112,
    render: (value) => `<span class="bodyCell typeValue">${value}</span>`,
  },

  {
    title: "",
    dataIndex: "",
    width: 112,
    render: () => `
    <div class="bodyCell"> 
    <div class="detailsBtn">
      Details
    </div>
    </div>
    `,
  },
  {
    title: "Transfer",
    dataIndex: "transfer",
    width: 374,
    hasInfo: true,
    render: (value) => `
    <div class="transferInfo">
      <div class="tranferSender">
      <div class="sender">
      ${
        value.sender.avt
          ? `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
<circle cx="9" cy="9" r="9" fill="#D9D9D9"/>
</svg>`
          : ``
      }
      <div class="senderName"> ${value.sender.name}</div> </div> 
      <div class="transactionAddress">
      <span class="transactionValue">${value.sender.address} </span>
    
    <span style="cursor: pointer">  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clip-path="url(#clip0_113_292)">
    <path d="M3.33301 9.99999H2.66634C2.31272 9.99999 1.97358 9.85952 1.72353 9.60947C1.47348 9.35942 1.33301 9.02028 1.33301 8.66666V2.66666C1.33301 2.31304 1.47348 1.9739 1.72353 1.72385C1.97358 1.4738 2.31272 1.33333 2.66634 1.33333H8.66634C9.01996 1.33333 9.3591 1.4738 9.60915 1.72385C9.8592 1.9739 9.99967 2.31304 9.99967 2.66666V3.33333M7.33301 5.99999H13.333C14.0694 5.99999 14.6663 6.59695 14.6663 7.33333V13.3333C14.6663 14.0697 14.0694 14.6667 13.333 14.6667H7.33301C6.59663 14.6667 5.99967 14.0697 5.99967 13.3333V7.33333C5.99967 6.59695 6.59663 5.99999 7.33301 5.99999Z" stroke="#FF8366" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
      <defs>
      <clipPath id="clip0_113_292">
    <rect width="16" height="16" fill="white"/>
    </clipPath>
    </defs>
    </svg>
    </span>
      </div>
      </div>

      <div class="arrowIcon">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4.16699 10H15.8337M15.8337 10L10.0003 4.16667M15.8337 10L10.0003 15.8333" stroke="#828A99" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          
      </div>

      <div class="transactionAddress">
        <span class="transactionValue">${value.recipient.address} </span>
     <span style="cursor: pointer"> <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_113_292)">
      <path d="M3.33301 9.99999H2.66634C2.31272 9.99999 1.97358 9.85952 1.72353 9.60947C1.47348 9.35942 1.33301 9.02028 1.33301 8.66666V2.66666C1.33301 2.31304 1.47348 1.9739 1.72353 1.72385C1.97358 1.4738 2.31272 1.33333 2.66634 1.33333H8.66634C9.01996 1.33333 9.3591 1.4738 9.60915 1.72385C9.8592 1.9739 9.99967 2.31304 9.99967 2.66666V3.33333M7.33301 5.99999H13.333C14.0694 5.99999 14.6663 6.59695 14.6663 7.33333V13.3333C14.6663 14.0697 14.0694 14.6667 13.333 14.6667H7.33301C6.59663 14.6667 5.99967 14.0697 5.99967 13.3333V7.33333C5.99967 6.59695 6.59663 5.99999 7.33301 5.99999Z" stroke="#FF8366" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
        </g>
        <defs>
        <clipPath id="clip0_113_292">
      <rect width="16" height="16" fill="white"/>
      </clipPath>
      </defs>
      </svg>
      </span>
        </div>


    </div>
    `,
  },
  {
    title: "Status",
    dataIndex: "status",
    width: 112,
    render: () => `
        <div class="pendingCell">
      <div class="pendingTag">
        <div class="pendingIcon">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 3V6L8 7M11 6C11 8.76142 8.76142 11 6 11C3.23858 11 1 8.76142 1 6C1 3.23858 3.23858 1 6 1C8.76142 1 11 3.23858 11 6Z" stroke="#D1923F" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        Pending
      </div>
    </div>
    `,
  },
  {
    title: "Age",
    dataIndex: "age",
    width: 112,
    render: (value) => `
    <div class="bodyCell ageCell">
     ${value}
    </div>
    `,
  },
  {
    title: "Amount",
    dataIndex: "amount",
    width: 192,
    render: (value, record) => `
   <div class="bodyCell amountCell">
      <div style="display: flex; align-items: center; gap: 8px">
        <div class="amountValue">
          <span style="font-size: 14px"
            >${value.value.toString().split(".")[0]}</span
          >.
          <span class="tableDecimalText"
            >${value.value.toString().split(".")[1]}</span
          >
        </div>

        <span class="currencyName">${record.currency}</span>
      </div>
      <div class="memoText" style="display: flex;align-items: center;gap: 2px; ">
        MEMO :
        <span class="memoName">${value.memo}</span>
      </div>
    </div>
    `,
  },
  {
    title: "Fee",
    dataIndex: "fee",
    width: 152,
    render: (value, record) => `
     <div class="bodyCell amountCell">
      <div style="display: flex; align-items: center; gap: 8px">
        <div class="amountValue">
          <span style="font-size: 14px"
            >${value.value.toString().split(".")[0]}</span
          >.
          <span class="tableDecimalText"
            >${value.value.toString().split(".")[1]}</span
          >
        </div>

        <span class="currencyName">${record.currency}</span>
      </div>
    </div>
   `,
  },
  {
    title: "Block",
    dataIndex: "block",
    width: 192,
    render: () => `
    <div class="bodyCell blockCell">
    NONCE:<span>787479</span>
    </div>
    `,
  },
];

renderTable(columns, FAKE_DATA);

document.addEventListener("DOMContentLoaded", function () {
  const transactionTableTab = document.querySelectorAll(".transactionTableTab");
  console.log("transactionTableTab", transactionTableTab);
  transactionTableTab.forEach((item, index) => {
    item.addEventListener("click", function () {
      transactionTableTab.forEach((item, index) => {
        item.classList.remove("activeTab");
      });
      item.classList.add("activeTab");
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const detailsBtn = document.querySelectorAll(".detailsBtn");

  detailsBtn.forEach((item, index) => {
    item.addEventListener("click", function () {
      window.location.href = "./transaction-detail.html";
    });
  });
});
