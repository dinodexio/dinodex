import HeaderV2 from "../headerv2";
import { Footer } from "../footerv2";
import styles from '../css/about.module.css'
import { title } from "process";
export interface AboutComponentProps { }

const KEY_MATRIX = [
    {
        title: 'Total Trading Volume',
        value: '$24.74M'
    },
    {
        title: '24h Transaction',
        value : '$130.29M'
    }, 
    {
        title : 'Total App Downloads',
        value: '125.000 +'
    },
    {
        title: 'Monthly Users',
        value: '15.000 +'
    }
]

const PARTNERS = [
    {
        alt: 'AVALANCHE',
        src: '/images/about/avalanche.png'
    },
    {
        alt: 'BinanceSmartchain',
        src: '/images/about/BinanceSmartchain.png'
    },
    {
        alt: 'ROLEX P',
        src: '/images/about/ROLEX P.png' 
    },
    {
        alt: 'Linea',
        src: '/images/about/Linea.png'
    },
    {
        alt: 'Kyber Network',
        src: '/images/about/Kyber Network.png'
    },
    {
        alt: 'zkSync',
        src: '/images/about/zkSync.png'
    },
    {
        alt: 'zkSync',
        src: '/images/about/zkSync.png'
    },
    {
        alt: 'zkSync',
        src: '/images/about/zkSync.png'
    }
]
export function AboutComponent({ }: AboutComponentProps) {
    return (
        <>
            <div className="containerFluid">
                <HeaderV2 />
                <div className="aboutBody">

                    <div className={styles.statsHeaderWrapper}>
                        <div className={styles.statsHeader}>
                            <div className={styles.statsHeaderImg}>
                                <img src="/images/about/cactus_icon.svg" alt="cactus_icon" width="19.81px" height="24px" />
                            </div>

                            <div className={styles.statsHeaderDivider}></div>

                            <div className={styles.statsHeaderTextWrapper}>
                                <span className={styles.statsHeaderTitle}>
                                    24h Fee:
                                </span>
                                <div className={styles.statsHeaderValue}>
                                    $24,22.24
                                    <span>+120.45%</span>
                                </div>
                            </div>

                            <div className={styles.statsHeaderDivider}></div>

                            <div className={styles.statsHeaderTextWrapper}>
                                <span className={styles.statsHeaderTitle}>
                                    Total Pools:
                                </span>
                                <div className={styles.statsHeaderValue}>
                                    $240,230
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.heroSection}>
                        <div className={styles.heroSectionContent}>
                            <div className={styles.heroSectionImage}>
                                <img src="/images/about/hero_img.png" alt="Put Catchy Title ‘bout DinoDex here" className={styles.heroImage} />
                            </div>

                            <div className={styles.heroSectionTitle}>
                                Put Catchy Title ‘bout DinoDex here
                            </div>

                            <div className={styles.heroSectionSubtitle}>
                                KyberSwap is a decentralized exchange (DEX) aggregator. We provide our traders with superior token prices by
                                analyzing rates across thousands of exchanges instantly!
                            </div>
                        </div>

                        <div className={styles.btnLaunch}>
                            <span className={styles.btnLaunchText}>Launch App</span>
                            <div className={styles.btnLaunchArrow}>
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4.1665 10H15.8332M15.8332 10L9.99984 4.16666M15.8332 10L9.99984 15.8333" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className={styles.keyMetricsContainer}>
                        <div className={styles.keyMetrics}>
                            {KEY_MATRIX.map((item, index) => (
                                <div className={styles.keyMetricsItem} key={index}>
                                    <div className={styles.keyMetricsItemTitle}>{item.title}</div>
                                    <div className={styles.keyMetricsItemValue}>{item.value}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.featureSection}>
                        <div className={styles.sectionImage}>
                            <img src="/images/about/feature_img.png" alt="Introduction to Features Sections" />
                        </div>

                        <div className={styles.sectionContent}>
                            <div className={styles.sectionTitle}>
                                Introduction to Features Sections
                            </div>

                            <div className={styles.sectionsMain}>
                                <div className={styles.sectionDescription}>
                                    Lorem ipsum dolor sit amet consectetur. Egestas maecenas elementum nibh ut gravida :
                                </div>

                                <div className={styles.sectionsItemList}>
                                    <div className={styles.sectionsItem}>
                                        <div className={styles.sectionsItemIcon}>
                                            <img src="/images/about/addRemoveLidquidity.svg" alt="Add/Remove Liquidity" className={styles.icon} />
                                        </div>
                                        <span>Add/Remove Liquidity</span>
                                    </div>

                                    <div className={styles.sectionsItem}>
                                        <div className={styles.sectionsItemIcon}>
                                            <img src="/images/about/swapToken.svg" alt="Swap Token" className={styles.icon} />
                                        </div>
                                        <span>Swap Token</span>
                                    </div>

                                    <div className={styles.sectionsItem}>
                                        <div className={styles.sectionsItemIcon}>
                                            <img src="/images/about/trackingIcon.svg" alt="Tracking transactions and data" className={styles.icon} />
                                        </div>
                                        <span>Tracking transactions and data</span>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.learnMoreBtn}>
                                <span>Learn More</span>
                                <div>
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M4.1665 10H15.8332M15.8332 10L9.99984 4.16666M15.8332 10L9.99984 15.8333" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.securitySection}>
                        <div className={styles.sectionContent}>
                            <div className={styles.sectionTitle}>Security & Speed</div>
                            <div className={styles.sectionsMain}>
                                <div style={{ fontWeight: 400 }}>
                                    Lorem ipsum dolor sit amet consectetur. Egestas maecenas elementum nibh ut gravida :
                                </div>

                                <div className={styles.sectionsItemList}>
                                    <div className={styles.sectionsItem}>
                                        <div className={styles.sectionsItemIcon} style={{ width: '28px', height: '28px' }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="29" viewBox="0 0 22 29" fill="#909D45">
                                                <path d="M21.4554 14.0525C21.4433 14.3952 21.0207 14.7747 20.6342 15.0548C19.9881 15.5191 19.0884 15.8691 18.5269 16.3629C17.8687 16.9378 17.0656 17.0631 16.0512 17.0152C15.6466 17.0004 15.2421 17.0188 14.8315 17.0225C13.962 17.0336 13.5453 17.321 13.5453 17.8406C13.5393 18.456 13.5333 19.0751 13.5333 19.6904C13.5333 21.9751 13.5393 24.2598 13.5272 26.5408C13.5272 27.0788 13.5091 27.5873 14.4813 27.8895C14.6624 27.9447 14.6141 28.2801 14.6745 28.4827C14.3605 28.4791 13.8171 28.5343 13.7688 28.4643C13.1589 27.5762 11.9029 27.7715 10.7798 27.7605C8.78721 27.7458 8.51549 27.5947 8.50945 26.3565C8.49134 24.0129 8.50945 21.6693 8.49737 19.3183C8.49737 18.1759 8.41888 18.1243 6.6376 17.9548C5.29711 17.8295 4.80198 17.0557 3.89021 16.6024C3.03882 16.1787 2.41687 15.5817 1.55341 15.169C0.786552 14.8005 0.520871 14.4025 0.526909 13.8314C0.563139 11.7309 0.64164 9.6342 0.502761 7.53746C0.430302 6.46145 1.80097 6.08558 2.64633 5.44072C2.74294 5.36702 3.23808 5.36333 3.32865 5.42966C4.11966 6.05242 5.52053 6.36564 5.46014 7.41216C5.3273 9.57155 5.42392 11.7346 5.42392 13.8903C5.42392 14.421 5.56884 14.8779 6.64364 14.97C7.98413 15.0806 8.49134 14.8042 8.50342 13.8572C8.51549 10.2459 8.61814 6.63096 8.44303 3.02707C8.38869 1.82946 9.57822 1.25829 10.6047 0.54341C10.7315 0.454971 11.3897 0.510245 11.6071 0.631849C12.8932 1.3541 13.7446 2.14268 13.5936 3.34398C13.3763 4.96904 13.5393 6.61253 13.5393 8.24865C13.5393 10.1611 13.5212 12.0736 13.5514 13.9898C13.5635 14.8374 14.3122 15.1616 15.6165 14.9516C16.5765 14.7931 16.6188 14.3325 16.6188 13.8535C16.6248 11.9115 16.7698 9.95847 16.5645 8.02387C16.4497 6.92207 17.2287 6.2293 18.394 5.57338C18.5873 5.46651 18.9435 5.38913 19.1911 5.41124C19.8613 5.47757 21.4856 6.75993 21.4856 7.20213C21.4977 9.48311 21.5218 11.7678 21.4554 14.0488V14.0525Z" fill="#909D45" />
                                            </svg>
                                        </div>
                                        <span>Lorem ipsum dolor sit</span>
                                    </div>

                                    <div className={styles.sectionsItem}>
                                        <div className={styles.sectionsItemIcon} style={{ width: '28px', height: '28px' }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="29" viewBox="0 0 22 29" fill="#909D45">
                                                <path d="M21.4554 14.0525C21.4433 14.3952 21.0207 14.7747 20.6342 15.0548C19.9881 15.5191 19.0884 15.8691 18.5269 16.3629C17.8687 16.9378 17.0656 17.0631 16.0512 17.0152C15.6466 17.0004 15.2421 17.0188 14.8315 17.0225C13.962 17.0336 13.5453 17.321 13.5453 17.8406C13.5393 18.456 13.5333 19.0751 13.5333 19.6904C13.5333 21.9751 13.5393 24.2598 13.5272 26.5408C13.5272 27.0788 13.5091 27.5873 14.4813 27.8895C14.6624 27.9447 14.6141 28.2801 14.6745 28.4827C14.3605 28.4791 13.8171 28.5343 13.7688 28.4643C13.1589 27.5762 11.9029 27.7715 10.7798 27.7605C8.78721 27.7458 8.51549 27.5947 8.50945 26.3565C8.49134 24.0129 8.50945 21.6693 8.49737 19.3183C8.49737 18.1759 8.41888 18.1243 6.6376 17.9548C5.29711 17.8295 4.80198 17.0557 3.89021 16.6024C3.03882 16.1787 2.41687 15.5817 1.55341 15.169C0.786552 14.8005 0.520871 14.4025 0.526909 13.8314C0.563139 11.7309 0.64164 9.6342 0.502761 7.53746C0.430302 6.46145 1.80097 6.08558 2.64633 5.44072C2.74294 5.36702 3.23808 5.36333 3.32865 5.42966C4.11966 6.05242 5.52053 6.36564 5.46014 7.41216C5.3273 9.57155 5.42392 11.7346 5.42392 13.8903C5.42392 14.421 5.56884 14.8779 6.64364 14.97C7.98413 15.0806 8.49134 14.8042 8.50342 13.8572C8.51549 10.2459 8.61814 6.63096 8.44303 3.02707C8.38869 1.82946 9.57822 1.25829 10.6047 0.54341C10.7315 0.454971 11.3897 0.510245 11.6071 0.631849C12.8932 1.3541 13.7446 2.14268 13.5936 3.34398C13.3763 4.96904 13.5393 6.61253 13.5393 8.24865C13.5393 10.1611 13.5212 12.0736 13.5514 13.9898C13.5635 14.8374 14.3122 15.1616 15.6165 14.9516C16.5765 14.7931 16.6188 14.3325 16.6188 13.8535C16.6248 11.9115 16.7698 9.95847 16.5645 8.02387C16.4497 6.92207 17.2287 6.2293 18.394 5.57338C18.5873 5.46651 18.9435 5.38913 19.1911 5.41124C19.8613 5.47757 21.4856 6.75993 21.4856 7.20213C21.4977 9.48311 21.5218 11.7678 21.4554 14.0488V14.0525Z" fill="#909D45" />
                                            </svg>
                                        </div>
                                        <span>Lorem ipsum dolor sit</span>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.learnMoreBtn}>
                                <span>Learn More</span>
                                <div>
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M4.1665 10H15.8332M15.8332 10L9.99984 4.16666M15.8332 10L9.99984 15.8333" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <img src="/images/about/securitySpeedImg.png" alt="security Speed" className={styles.sectionImage} />
                    </div>

                    <div className={styles.partnersSection}>
                        <div className={styles.sectionContent + ' ' + styles.partnerContent}>
                            <div className={styles.sectionTitle} style={{ textAlign: 'center' }}>
                                powered by.
                            </div>

                            <div className={styles.partnersList}>
                                {
                                    PARTNERS.map((partner, index) => (
                                        <div className={styles.partnerItem} key={index}>
                                            <img src={partner.src} alt={partner.alt} />
                                        </div>
                                ))}
                            </div>

                            <div className={styles.partnersList}>
                            </div>
                        </div>
                    </div>
                </div>

                <Footer />

            </div>
        </>
    );
}
