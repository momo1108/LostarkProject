import styles from "@/styles/info/Page.module.scss";
import { nanumNeo } from "@/types/GlobalType";
import Page from "@/components/Page";
import { GetStaticPaths, GetStaticProps } from "next";

const InfoPage: React.FC<{ name: string }> = ({ name }) => {
  return (
    <Page className={`${styles.container} ${nanumNeo.className}`}>
      this is info page
      {name}
    </Page>
  );
};

export default InfoPage;

// export const getStaticProps: GetStaticProps = ({ params }) => {
//   console.log(params);
//   return {
//     props: { name: "test" },
//   };
// };

// export const getStaticPaths: GetStaticPaths = async () => {
//   return {
//     paths: [
//       {
//         params: {
//           slug: "apikey",
//         },
//       },
//     ],
//     fallback: false,
//   };
// };
