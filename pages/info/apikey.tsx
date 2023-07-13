import styles from "@/styles/info/Page.module.scss";
import { InfoPage, nanumNeo } from "@/types/GlobalType";
import Page from "@/components/Page";
import { GetStaticPaths, GetStaticProps } from "next";
import InfoHeader from "@/components/InfoHeader";
import DataService from "@/service/DataService";
import Link from "next/link";
import Edit from "@/components/icons/Edit";
import Check from "@/components/icons/Check";
import { NextSeo } from "next-seo";

const ApiPage: React.FC<{ pages: InfoPage[]; pageInfo: InfoPage }> = ({
  pages,
  pageInfo,
}) => {
  return (
    <>
      <NextSeo
        title="로아플 APIKey 안내페이지"
        description="로아플에서 사용할 API Key를 발급받는 방법을 안내하는 페이지입니다."
      />
      <Page className={`${styles.container} ${nanumNeo.className}`}>
        <InfoHeader pages={pages} />
        <div className={styles.infoBody}>
          <h2 className={styles.infoBodyTitle}>{pageInfo.title}</h2>
          <hr />
          <div className={styles.infoContent}>
            <p className={styles.p1}>
              1. 로스트아크 공식 OpenAPI 홈페이지 접속
            </p>
            <p className={styles.p2}>
              아래의 링크를 통해 로스트아크 공식 OpenAPI 홈페이지에 접속합니다.{" "}
              <br />
              <Link
                href="https://developer-lostark.game.onstove.com/"
                target="_blank"
              >
                https://developer-lostark.game.onstove.com/
              </Link>
            </p>
            <div className={styles.sep} />
            <p className={styles.p1}>2. 로그인 및 API Key 발급 신청</p>
            <img
              className={styles.infoImage}
              src="/images/info_1_1.png"
              alt=""
            />
            <p className={styles.p2}>
              2-1. 우측 상단의 <span className={styles.infoButton}>LOGIN</span>{" "}
              버튼을 클릭하여 Stove 아이디로 로그인을 먼저 진행합니다.
            </p>
            <p className={styles.p2}>
              2-2. 로그인이 완료됐으면 중앙의{" "}
              <span className={styles.infoButton}>
                GET ACCESS TO LOSTARK API
              </span>{" "}
              버튼을 클릭하여 발급 신청 페이지로 이동합니다.
            </p>
            <div className={styles.sep} />
            <p className={styles.p1}>
              3. 페이지 이동 후 중앙의{" "}
              <span className={styles.infoButton2}>CREATE NEW CLIENT</span>{" "}
              버튼을 클릭하여 정보 입력 페이지로 이동
            </p>
            <img
              className={styles.infoImage}
              src="/images/info_1_2.png"
              alt=""
            />
            <div className={styles.sep} />
            <p className={styles.p1}>4. 정보 입력 페이지 작성</p>
            <img
              className={styles.infoImage}
              src="/images/info_1_3.png"
              alt=""
            />
            <p className={styles.p2}>
              4-1. 입력란 중 <span style={{ color: "#f00" }}>*</span> 표시가
              되어있는{" "}
              <span className={styles.infoInputTitle}>CLIENT NAME</span> 항목만
              작성합니다.
              <br />
              (API Key의 이름을 지정하는 항목이므로 내용은 마음대로 입력하셔도
              됩니다.)
            </p>
            <p className={styles.p2}>
              4-2. 체크박스들을 모두 체크해줍니다.(이용 약관과 개인정보 보호정책
              동의)
            </p>
            <p className={styles.p2}>
              4-3. 위 과정(입력과 체크)을 완료한 후{" "}
              <span className={styles.infoButton3}>CREATE</span> 버튼을 클릭한
              후 팝업창을 닫아서 생성을 완료합니다.
            </p>
            <div className={styles.sep} />
            <p className={styles.p1}>5. 발급받은 API Key 등록</p>
            <img
              className={styles.infoImage}
              src="/images/info_1_4.png"
              alt=""
            />
            <p className={styles.p2}>
              5-1. 생성 된 API Key 값을{" "}
              <span className={styles.infoButton4}>COPY</span> 버튼을 눌러서
              복사합니다. <br />
              만약 위 페이지가 보이지 않으면, 아래 링크를 통해 접속하세요.{" "}
              <br />
              <Link
                href="https://developer-lostark.game.onstove.com/clients"
                target="_blank"
              >
                https://developer-lostark.game.onstove.com/clients
              </Link>
            </p>
            <div className={styles.sep2} />
            <img
              className={styles.infoImage}
              src="/images/info_1_5.png"
              alt=""
            />
            <p className={styles.p2}>
              5-2. 기존 로아플 페이지로 돌아와서, 상단의{" "}
              <span className={styles.infoButton5}>
                {" "}
                <Edit className="inline" size={16} /> 등록
              </span>{" "}
              버튼을 눌러 입력창을 활성화시킵니다.
            </p>
            <div className={styles.sep2} />
            <img
              className={styles.infoImage}
              src="/images/info_1_6.png"
              alt=""
            />
            <p className={styles.p2}>
              5-3. 활성화된 입력창에 API Key 값을 붙여넣기 한 후, 완료버튼 ({" "}
              <span className={styles.infoButton6}>
                <Check className="inline" color="#eee" size={16} />
              </span>{" "}
              )을 눌러서 등록합니다.
            </p>
          </div>
        </div>
      </Page>
    </>
  );
};

export default ApiPage;

export const getStaticProps: GetStaticProps = async (context) => {
  console.log(context);
  try {
    const pages = await DataService.getInfoPageList();
    return {
      props: {
        pages,
        pageInfo: pages[0],
      },
    };
  } catch (error: any) {
    return {
      props: {
        pages: [],
      },
    };
  }
};
