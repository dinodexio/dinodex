import { renderTable } from "./table.js";

const FAKE_BALANCE_DATA = [
  {
    account: { name: "MinaStake.com", address: "B62qqJ1Aq••kduFE2uLU" },
    change: { value: "0.000085", type: "plus" },
    balanceBefore: "777.572171893",
    balanceAfter: "777.572171893",
    currency: "MINA",
  },
  {
    account: { name: "MinaStake.com", address: "B62gm•••hYLszT" },
    change: { value: "0.000085", type: "minus" },
    balanceBefore: { value: "3,878.038079566" },
    balanceAfter: { value: "3,878.038079566" },
    currency: "MINA",
  },
];

const columns = [
  {
    title: "Account",
    dataIndex: "account",
    width: 218,
    render: (data) => ` <div class="bodyCell">
  <div style="display: flex; flex-direction: column;gap: 4px; align-items: flex-start;">
    <div style="display: flex;gap: 4px; align-items: flex-start;">
      <div class="acountAvt">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none">
          <circle cx="9" cy="9.5" r="9" fill="#D9D9D9"/>
        </svg>
      </div>
      ${data.name}
    </div>
    <div style="display: flex;align-items: center;gap: 8px;">
      <span style="color: var(--primary-red-c);">${data.address}</span>
      <span style="cursor: pointer"> 
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
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
 </div>`,
  },
  {
    title: "Change",
    dataIndex: "change",
    width: 218,
    render: (data, record) => ` <div class="bodyCell">
      <div style="display: flex;align-items: center;gap: 6px;">
        ${
          data.type === "plus"
            ? `<div class="iconWrapper iconChangePlus" >
          <svg xmlns="http://www.w3.org/2000/svg" width="11" height="10" viewBox="0 0 11 10" fill="none">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M4.7 5.8V10H6.3V5.8H10.5V4.2H6.3V0H4.7V4.2H0.5V5.8H4.7Z" fill="#FAFAFA"/>
            </svg>
        </div>`
            : `<div class="iconWrapper iconChangeMinus" >
          <svg xmlns="http://www.w3.org/2000/svg" width="11" height="2" viewBox="0 0 11 2" fill="none">
         <path fill-rule="evenodd" clip-rule="evenodd" d="M10.5 0.2L0.5 0.199999V1.8L10.5 1.8V0.2Z" fill="#FAFAFA"/>
        </svg>
        </div>`
        } 
       
        <div style="display: flex;gap: 8px;">
          <div style="display: flex; align-items: center;">
            <span >
              0</span
          >.
          <span style="color: var(--p-text);font-size: 12px;font-weight: 400;">
           000085</span>
            
          </div>
          <span style="font-size: 14px;line-height: 18px;color: var(--t-text)" >${record.currency}</span>
        </div>
      </div>`,
  },
  {
    title: "Balance Before",
    dataIndex: "balanceBefore",
    width: 218,
    render: (data, record) => ` <div class="bodyCell">
      <div style="display: flex;align-items: center;gap: 6px;">
      <div class="iconWrapper iconChangePlus" >
          <svg xmlns="http://www.w3.org/2000/svg" width="11" height="10" viewBox="0 0 11 10" fill="none">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M4.7 5.8V10H6.3V5.8H10.5V4.2H6.3V0H4.7V4.2H0.5V5.8H4.7Z" fill="#FAFAFA"/>
            </svg>
        </div>      
        <div style="display: flex;gap: 8px;">
          <div style="display: flex; align-items: center;">
            <span >
              0</span
          >.
          <span style="color: var(--p-text);font-size: 12px;font-weight: 400;">
           000085</span>
            
          </div>
          <span style="font-size: 14px;line-height: 18px;color: var(--t-text)" >${record.currency}</span>
        </div>
      </div>`,
  },
  {
    title: "Balance After",
    dataIndex: "balanceAfter",
    width: 218,
    render: (data, record) => ` <div class="bodyCell">
      <div style="display: flex;align-items: center;gap: 6px;">
      <div class="iconWrapper iconChangePlus" >
          <svg xmlns="http://www.w3.org/2000/svg" width="11" height="10" viewBox="0 0 11 10" fill="none">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M4.7 5.8V10H6.3V5.8H10.5V4.2H6.3V0H4.7V4.2H0.5V5.8H4.7Z" fill="#FAFAFA"/>
            </svg>
        </div>      
        <div style="display: flex;gap: 8px;">    
          <div style="display: flex; align-items: center;">
            <span >
              0</span
          >.
          <span style="color: var(--p-text);font-size: 12px;font-weight: 400;">
           000085</span>
            
          </div>
          <span style="font-size: 14px;line-height: 18px;color: var(--t-text)" >${record.currency}</span>
        </div>
      </div>`,
  },
];

renderTable(columns, FAKE_BALANCE_DATA);

document.addEventListener('DOMContentLoaded', function () {
    const transactionTableTab = document.querySelectorAll('.detailTag')

    transactionTableTab.forEach((item, index) => {
       item.addEventListener('click', function () {
          transactionTableTab.forEach((item, index) => {
             item.classList.remove('activeTag')
          })
          item.classList.add('activeTag')
       })
    })
 })