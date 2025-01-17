export interface PortalComponentProps {}
import styles from "./portal.module.css";
import HeaderV2 from "../headerv2";
import { Footer } from "../footerv2";

const dummyDataApi = [
  {
    title: "Total API",
    description:
      "Lorem ipsum dolor sit amet consectetur. Libero ipsum at posuere molestie. Volutpat pharetra aliquet facilisi euismod duis bibendum viverra facilisi.",
  },
  {
    title: "Sport Price API",
    description:
      "Lorem ipsum dolor sit amet consectetur. Urna ultricies nibh morbi laoreet ullamcorper.",
  },
  {
    title: "Swap API",
    description:
      "Lorem ipsum dolor sit amet consectetur. Aliquet maecenas amet et sit.",
  },
  {
    title: "History API",
    description:
      "Lorem ipsum dolor sit amet consectetur. Aliquet maecenas amet et sit.",
  },
  {
    title: "Transaction Gateway API",
    description:
      "Lorem ipsum dolor sit amet consectetur. Aliquet maecenas amet et sit. Enim sagittis orci arcu nec tristique id purus adipiscing.",
  },
  {
    title: "Balance API",
    description:
      "Lorem ipsum dolor sit amet consectetur. Aliquet maecenas amet et sit.",
  },
];
export function PortalComponent({}: PortalComponentProps) {
  return (
    <div className={styles.containerPagePortal}>
      <HeaderV2/>

      <div className={styles.containerBodyPortal}>
        <div className={styles.containerContentTop}>
          <div className={styles.boxTitlePage}>
            <span className={styles.textBoxTitle}>Developer Portal</span>
            <span className={styles.titlePage}>Explore our APIs</span>
          </div>
          <span className={styles.decriptionPortal}>
            Lorem ipsum dolor sit amet consectetur. Gravida egestas egestas eu
            urna. Aenean neque consectetur urna et dignissim. Volutpat etiam
            lectus dui tincidunt urna sodales. In volutpat velit ridiculus dui
            orci.
          </span>
        </div>
        <div className={styles.containerContentBot}>
          <div className={styles.boxContentBot}>
            {dummyDataApi.map((api, index) => (
              <div
                key={index}
                className={styles[`box${api.title.replace(/ /g, "")}`]}
              >
                <div className={styles.boxTitleItemInfo}>
                  <span className={styles.titleItemInfo}>{api.title}</span>
                  <span className={styles.decriptionItemInfo}>
                    {api.description}
                  </span>
                </div>
                <div className={styles.boxBtnBoxInfo}>
                  <div className={styles.btnLearn}>
                    <span className={styles.textBtnLearn}>Learn More</span>
                    <img
                      className={styles.iconArrowDefault}
                      //   src="images/navbar_footer/arrow_right.svg"
                      src="/images/navbar_footer/arrow_right.svg"
                      alt="Arrow Right"
                    />
                    <img
                      className={styles.iconArrowHover}
                      src="/images/navbar_footer/arrow_right_hover.svg"
                      alt="Arrow Right Hover"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* <footer className={styles.containerFooter}>
        <div className={styles.contentFooterTop}>
          <div className={styles.boxTitleFooter}>
            <img
              className={styles.imageDino}
              src="images/navbar_footer/dino_image.svg"
              alt=""
            />
            <span className={styles.titleFooter}> DinoDEX</span>
          </div>
          <div className={styles.containerTagFooter}>
            {[
              {
                title: "DinoDex",
                tags: ["About", "Developer Portal", "Help Center"],
              },
              { title: "Bridge", tags: ["Eligned", "Lamdba"] },
              { title: "Trade", tags: ["Swap", "Add Pool", "Create Pool"] },
              { title: "Info", tags: ["Token", "Pool", "Transaction"] },
              {
                title: "Earn",
                tags: ["Farm / Liquidity", "Staking", "Airdrop"],
              },
            ].map((section, index) => (
              <div key={index} className={styles.boxTag}>
                <span className={styles.titleBoxTag}>{section.title}</span>
                {section.tags.map((tag, tagIndex) => (
                  <span key={tagIndex} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className={styles.contentFooterBot}>
          <img
            width="100%"
            src="images/navbar_footer/line_footer.svg"
            alt="Footer Line"
          />
          <div className={styles.boxContact}>
            <span className={styles.textBoxContact}>
              © 2024, All Rights Reserved
            </span>
            <div className={styles.boxInfoContact}>
              {[
                {
                  href: "https://example.com/logoX",
                  src: "images/navbar_footer/logoX.svg",
                  alt: "Logo X",
                },
                {
                  href: "https://example.com/logo_tele",
                  src: "images/navbar_footer/logo_tele.svg",
                  alt: "Logo Telegram",
                },
                {
                  href: "https://example.com/logo_insta",
                  src: "images/navbar_footer/logo_insta.svg",
                  alt: "Logo Instagram",
                },
                {
                  href: "https://example.com/logo_github",
                  src: "images/navbar_footer/logo_github.svg",
                  alt: "Logo GitHub",
                },
                {
                  href: "https://example.com/logo_discord",
                  src: "images/navbar_footer/logo_discord.svg",
                  alt: "Logo Discord",
                },
              ].map((logo, index) => (
                <a
                  key={index}
                  href={logo.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    className={styles.logoFooter}
                    src={logo.src}
                    alt={logo.alt}
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer> */}
      <Footer/>
    </div>
  );
}
