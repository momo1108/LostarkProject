import styles from "@/styles/accessory/Body.module.scss";
import { useCallback, useState } from "react";

const TierSettingList: React.FC<React.HTMLAttributes<HTMLOListElement>> = ({
  className,
}) => {
  const [selectedTier, setSelectedTier] = useState<number>(4);
  const handleClick = useCallback((tier: number) => {
    setSelectedTier(tier);
  }, []);

  return (
    <ol className={styles.tierList}>
      {[3, 4].map((tier) => (
        <li key={`tier_${tier}`} onClick={() => {}}>
          <button
            className={tier === selectedTier ? "bg-white text-[#333]" : ""}
            onClick={() => handleClick(tier)}
          >
            {tier}
          </button>
        </li>
      ))}
    </ol>
  );
};

export default TierSettingList;
