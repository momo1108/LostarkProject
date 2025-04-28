import styles from "@/styles/accessory/Body.module.scss";
import { useCallback, useState } from "react";

const GradeSettingList: React.FC<React.HTMLAttributes<HTMLOListElement>> = ({
  className,
}) => {
  const [selectedGrade, setSelectedGrade] = useState<string>("고대");
  const handleClick = useCallback((grade: string) => {
    setSelectedGrade(grade);
  }, []);

  return (
    <ol className={styles.gradeList}>
      {["유물", "고대"].map((grade) => (
        <li key={`tier_${grade}`} onClick={() => {}}>
          <button
            className={grade === selectedGrade ? "bg-white text-[#333]" : ""}
            onClick={() => handleClick(grade)}
          >
            {grade}
          </button>
        </li>
      ))}
    </ol>
  );
};

export default GradeSettingList;
