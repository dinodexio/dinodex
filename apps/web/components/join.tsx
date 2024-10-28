// "use client";
// import { useRouter, usePathname } from "next/navigation";
// import { Header } from "./header";
// import { Toaster } from "@/components/ui/toaster";

// export interface PoolJoinProps {}

// export function PoolJoin({}: PoolJoinProps) {
//   const router = useRouter();
//   const pathname = usePathname();
//   return (
//     <div className="flex items-center justify-center">
//       <Toaster />
//       <div className="flex basis-11/12 flex-col 2xl:basis-10/12">
//         <Header />

//         <span>Join Pool</span>
//       </div>
//     </div>
//   );
// }

"use client";
import { Header } from "./header";
import { Toaster } from "@/components/ui/toaster";
import Image from "next/image";
import { useState } from "react";
import './style.css'
import { LIST_FEE_TIER } from "@/constants";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ModalListToken } from "./modalListToken/modalListToken";
import { ModalPreviewPool } from "./modalPreviewPool/modalPreviewPool";
export interface PoolJoinProps { }

export function PoolJoin({ }: PoolJoinProps) {

  // state dummy join pool
  const [dataPoolCreate, setDataPoolCreate] = useState<any>({
    tokenPool: {
      first: {
        id: 1,
        logo: "images/swap/logo-token-default.svg",
        name: "ethereum",
        slug: "ethereum",
        symbol: "ETH",
        price: 1000,
        change1h: "0.1",
        fdv: 7100000000,
        volume: 300000000
      },
      second: null
    },
    feeTier: 1,
    valueMinPrice: {
      first: 0,
      second: 0
    },
    deposit_amount: {
      first: 1,
      second: 1
    }
  })

  const [typeOpenModal, setTypeOpenModal] = useState<string>('first')

  const [showFeeTier, setShowFeeTier] = useState<boolean>(false)

  const [approve, setApprove] = useState<any>({
    active: false,
    loading: false
  })

  // func change value input deposit amounts
  const handleChangeDepositAmount = (type: string, event: any) => {
    event.target.value = event.target.value.replace(/[^0-9.]/g, '');
    setDataPoolCreate({
      ...dataPoolCreate,
      deposit_amount: {
        ...dataPoolCreate.deposit_amount,
        [type]: event.target.value
      }
    })
  }

  // func change value input deposit amounts
  const handleChangeValueMinPrice = (type: string, value: any) => {
    if (value < 0) return;
    setDataPoolCreate({
      ...dataPoolCreate,
      valueMinPrice: {
        ...dataPoolCreate.valueMinPrice,
        [type]: value
      }
    })
  }

  const ClickApprove = () => {
    if (approve.loading || approve.active) return;
    setApprove({
      ...approve,
      loading: true
    })
    setTimeout(() => {
      setApprove({
        ...approve,
        active: true,
        loading: false
      })
    }, 1000);
  }


  return (
    <div className="flex flex-col w-full px-[16px] pt-8 xl:px-[41px] lg:px-[32px] sm:px-[16px] pb-[8px]">
      <Toaster />
      <div className="flex basis-11/12 flex-col 2xl:basis-10/12">
        <Header />
        <div className="w-full max-w-[1065px] flex flex-col items-center gap-[25px] mt-[40px] mx-auto xl:items-start xl:flex-row xl:mt[113.74px] lg:flex-row lg:items-start lg:mt-[100px] sm:mt-[40px]">
          <div className="w-full max-w-[520px] flex flex-col gap-[20px]">
            <div>
              <span className="text-[20px] font-[600] leading-none text-black">Select Pair</span>
              <Dialog>
                <div className="mt-[20px] flex gap-[20px]">
                  <DialogTrigger
                    className={`w-[48%] max-w-[250px] rounded-[18.118px] py-[15px] px-[12px] border-[1px] 
                    text-[20px] font-[400] leading-none text-black border-black flex items-center justify-between 
                    bg-white hover:bg-[#EBEBEB] cursor-pointer ${dataPoolCreate.tokenPool.first ? 'content-left-select-token-item-have-token' : ''}
                    `}
                    style={{ transition: 'all 0.3s ease' }}
                    onClick={() => setTypeOpenModal('first')}
                  >
                    {dataPoolCreate.tokenPool.first ? (
                      <div className="flex items-center gap-[8px]">
                        <Image src={'/' + dataPoolCreate.tokenPool.first.logo} alt="logo" width={24} height={24} />
                        <span>{dataPoolCreate?.tokenPool?.first?.symbol}</span>
                      </div>
                    ) : (
                      <span>Select Token</span>
                    )}
                    <Image src={'/icon/drop-down-icon.svg'} alt="drop-down-icon" width={20} height={20} />
                  </DialogTrigger>
                  <DialogTrigger
                    className={`w-[48%] max-w-[250px] rounded-[18.118px] py-[15px] px-[12px] border-[1px] 
                    text-[20px] font-[400] leading-none text-black border-black flex items-center justify-between 
                    bg-white hover:bg-[#EBEBEB] cursor-pointer
                    ${dataPoolCreate.tokenPool.second ? 'content-left-select-token-item-have-token' : ''}
                    `}
                    style={{ transition: 'all 0.3s ease' }}
                    onClick={() => setTypeOpenModal('second')}
                  >
                    {dataPoolCreate.tokenPool.second ? (
                      <div className="flex items-center gap-[8px]">
                        <Image src={'/' + dataPoolCreate.tokenPool.second.logo} alt="logo" width={24} height={24} />
                        <span>{dataPoolCreate?.tokenPool?.second?.symbol}</span>
                      </div>
                    ) : (
                      <span>Select Token</span>
                    )}
                    <Image src={'/icon/drop-down-icon.svg'} alt="drop-down-icon" width={20} height={20} />
                  </DialogTrigger>
                </div>
                <DialogOverlay className="bg-overlay" />
                <DialogContent className="px-[19.83px] pt-[21.49px] pb-[33.88px] bg-white modal-container">
                  <ModalListToken
                    tokenSelected={dataPoolCreate.tokenPool[typeOpenModal]}
                    onClickToken={(token) => setDataPoolCreate({
                      ...dataPoolCreate,
                      tokenPool: {
                        ...dataPoolCreate.tokenPool,
                        [typeOpenModal]: token
                      }
                    })}
                    dialogClose={true}
                  />
                </DialogContent>
              </Dialog>
              <div className={`mt-[15px] h-[92px] w-full flex items-center justify-between py-[12px] pl-[20px] pr-[10px] rounded-[21px] border-[1px] border-black bg-white ${(!dataPoolCreate.tokenPool.first || !dataPoolCreate.tokenPool.second) ? 'content-pool-hide' : ''}`}>
                <div className="flex flex-col gap-[10px]">
                  <span className="text-[24px] font-[400] leading-none text-black">{dataPoolCreate.feeTier}% fee Tier</span>
                  <span className="fee-tier-desc" style={{ width: 'max-content' }}>Not created</span>
                </div>
                <span className="btn-edit-fee-tier" onClick={() => {
                  if (dataPoolCreate.tokenPool.first && dataPoolCreate.tokenPool.second) {
                    setShowFeeTier(!showFeeTier)
                  }
                }}>{showFeeTier ? 'Hide' : 'Edit'}</span>
              </div>
            </div>
            <div className={`choose-fee-tier-content ${showFeeTier ? 'choose-fee-tier-content-show' : ''}`}>
              {LIST_FEE_TIER.map((item, index) => (
                <div
                  className={`choose-fee-tier-item ${Number(dataPoolCreate.feeTier) === item.value ? 'choose-fee-tier-active' : ''}`}
                  key={index}
                  onClick={() => {
                    setDataPoolCreate({ ...dataPoolCreate, feeTier: item.value })
                  }}
                  data-fee-tier={item.value}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <span className="choose-fee-tier-item-text">{item.label}</span>
                    <Image src="/icon/icon-tick-white.svg" width={18} height={18} style={{ display: dataPoolCreate.feeTier === item.value ? 'block' : 'none' }} alt="circle" />
                  </div>
                  <span className="choose-fee-tier-item-desc">Best for stable pairs</span>
                  <span className="fee-tier-desc">Not created</span>
                </div>
              ))}
            </div>
            <div className={`${(!dataPoolCreate.tokenPool.first || !dataPoolCreate.tokenPool.second) ? 'content-pool-hide' : ''}`}>
              <span className="content-left-header">Deposit Amounts</span>
              <div className="content-deposit-amounts">
                <div className="deposit-amounts-item">
                  <div className="deposit-amounts-item-left">
                    <input className="input-price-deposit-amount" data-type-deposit="first" value={dataPoolCreate.deposit_amount.first} onChange={(e) => handleChangeDepositAmount('first', e)} />
                    <span className="value-price-desc">$1,823.80</span>
                  </div>
                  <div className="deposit-amounts-item-right">
                    <div className="token-select-deposit-amount" data-type="first">
                      <Image src={'/' + dataPoolCreate.tokenPool.first.logo} width={24} height={24} alt="circle" />
                      <span className="token-symbol-deposit-amount">{dataPoolCreate?.tokenPool?.first?.symbol}</span>
                    </div>
                    <div className="deposit-amount-balance">
                      <span className="balance-deposit-amount">Balance: 0</span>
                      <div className="btn-max-deposit-amount">Max</div>
                    </div>
                  </div>
                </div>
                <div className="deposit-amounts-item">
                  <div className="deposit-amounts-item-left">
                    <input className="input-price-deposit-amount" data-type-deposit="second" value={dataPoolCreate.deposit_amount.second} onChange={(e) => handleChangeDepositAmount('second', e)} />
                    <span className="value-price-desc">$1,823.80</span>
                  </div>
                  <div className="deposit-amounts-item-right">
                    <div className="token-select-deposit-amount" data-type="second">
                      <Image src={'/' + dataPoolCreate?.tokenPool?.second?.logo} width={24} height={24} alt="circle" />
                      <span className="token-symbol-deposit-amount">{dataPoolCreate?.tokenPool?.second?.symbol}</span>
                    </div>
                    <div className="deposit-amount-balance">
                      <span className="balance-deposit-amount">Balance: 0</span>
                      <div className="btn-max-deposit-amount">Max</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={`content-right ${(!dataPoolCreate.tokenPool.first || !dataPoolCreate.tokenPool.second) ? 'content-pool-hide' : ''}`}>
            <div className="header-content-right">
              <span className="content-left-header">
                Set Starting Price
              </span>
            </div>
            <div className="w-full h-[325px] text-textBlack">Chart</div>
            <div className="content-min-price-join-pool">
              <div className="min-price-join-pool-item">
                <span className="min-price-join-pool-item-title">Min Price</span>
                <div className="min-price-join-pool-item-content">
                  <div className="btn-min-price-join-pool-item" data-type="remove-first" onClick={() => handleChangeValueMinPrice('first', Number(dataPoolCreate?.valueMinPrice?.first) - 0.0001)}>
                    <Image src="/icon/btn-remove.svg" width={26} height={26} alt="btn-add" />
                  </div>
                  <input className="input-min-join-pool-item" data-type-input="first" value={dataPoolCreate?.valueMinPrice?.first} onChange={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9.]/g, '');
                    handleChangeValueMinPrice('first', e.target.value)
                  }} />
                  <div className="btn-min-price-join-pool-item" data-type="add-first" onClick={() => handleChangeValueMinPrice('first', Number(dataPoolCreate?.valueMinPrice?.first) + 0.0001)}>
                    <Image src="/icon/btn-add.svg" width={26} height={26} alt="btn-add" />
                  </div>
                </div>
                <span className="min-price-join-pool-item-text">{dataPoolCreate?.tokenPool?.first?.symbol} per {dataPoolCreate?.tokenPool?.second?.symbol}</span>
              </div>
              <div className="min-price-join-pool-item">
                <span className="min-price-join-pool-item-text">Min Price</span>
                <div className="min-price-join-pool-item-content">
                  <div className="btn-min-price-join-pool-item" data-type="remove-second" onClick={() => handleChangeValueMinPrice('second', Number(dataPoolCreate?.valueMinPrice?.second) - 0.0001)}>
                    <Image src="/icon/btn-remove.svg" width={26} height={26} alt="btn-add" />
                  </div>
                  <input className="input-min-join-pool-item" data-type-input="second" value={dataPoolCreate?.valueMinPrice?.second} onChange={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9.]/g, '');
                    handleChangeValueMinPrice('second', e.target.value)
                  }} />
                  <div className="btn-min-price-join-pool-item" data-type="add-second" onClick={() => handleChangeValueMinPrice('second', Number(dataPoolCreate?.valueMinPrice?.second) + 0.0001)}>
                    <Image src="/icon/btn-add.svg" width={26} height={26} alt="btn-add" />
                  </div>
                </div>
                <span className="min-price-join-pool-item-text">{dataPoolCreate?.tokenPool?.second?.symbol} per {dataPoolCreate?.tokenPool?.first?.symbol}</span>
              </div>
            </div>
            <div className={`btn-approve ${approve.active ? 'btn-approve-active' : ''}`} onClick={() => ClickApprove()}>
              {approve.active ? 'Approved' : 'Approve'} {dataPoolCreate?.tokenPool?.second?.symbol} {approve.loading ? <div className="loader"></div> : null}
            </div>
            <Dialog>
              {!approve.active ? (
                <div className={`button-swap btn-prview ${approve.active ? '' : 'button-swap-disabled'}`}>
                  <span>Preview</span>
                </div>
              ) : (
                <DialogTrigger asChild>
                  <div className={`button-swap btn-prview ${approve.active ? '' : 'button-swap-disabled'}`}>
                    <span>Preview</span>
                  </div>
                </DialogTrigger>
              )}
              <DialogOverlay className="overlayPreview" />
              <DialogContent className="px-[24px] pt-[28px] pb-[36px] w-[95%] max-w-[533px] bg-white modal-container rounded-[27px]">
                <ModalPreviewPool dataPool={dataPoolCreate} onClickAddPool={() => {}}/>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div >
      {(!dataPoolCreate.tokenPool.first || !dataPoolCreate.tokenPool.second) ? (
        <div className="popup-hide"><Image src="/icon/icon-hide-pool.svg" width={30} height={30} alt="icon-hide-pool" /> <span className="text-black text-[16px]">Your Position will appear here</span></div>
      ) : null
      }
    </div >
  );
}
