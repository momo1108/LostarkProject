import styles from "@/styles/character/Page.module.scss";

export default function CharFooter() {
  return (
    <div className={styles.footer}>
      <p>
        <a href="https://www.freepik.com/free-vector/luxury-dark-seamless-pattern_4585477.htm#query=dark%20pattern&position=43&from_view=search&track=ais">
          Background Image by kjpargeter on Freepik
        </a>{" "}
        <br />
        <a href="https://pixabay.com/users/gdj-1086657/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=7558594">
          Image by Gordon Johnson
        </a>{" "}
        <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=7558594">
          from Pixabay
        </a>
      </p>
    </div>
  );
}
