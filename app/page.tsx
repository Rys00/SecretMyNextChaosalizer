import dynamic from "next/dynamic";
import styles from "./page.module.scss";

const ThreeScene = dynamic(() => import("@/components/three_scene"), {
  ssr: false,
});

export default function Home() {
  return (
    <div className={styles.page}>
      <div className={styles.thsc}>
        <ThreeScene/>
      </div>
    </div>
  );
}
