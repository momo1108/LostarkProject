import styles from "@/styles/accessory/Body.module.scss";
import MySelect from "@/components/custom/MySelect";
import Earring from "@/components/icons/Earring";
import Necklace from "@/components/icons/Necklace";
import Ring2 from "@/components/icons/Ring2";
import { useAccessorySearchStaticContext } from "@/contexts/accessory/AccessorySearchContext";
import {
  ACCESSORY_CATEGORY_CODES,
  AccessoryCategory,
} from "@/types/EngraveType";
import { useState } from "react";

const AccessoryCategorySettingDiv: React.FC<{ index: number }> = ({
  index,
}) => {
  const { accessorySearchOptionArrayRef } = useAccessorySearchStaticContext();
  const [selectedAccessoryCategory, setSelectedAccessoryCategory] =
    useState<AccessoryCategory>(
      accessorySearchOptionArrayRef.current[index].accessoryCategory
    );

  const options = ["목걸이", "귀걸이", "반지"].map((category) => ({
    label: category,
    value: ACCESSORY_CATEGORY_CODES[category as AccessoryCategory],
  }));
  const onSelect = (option: { label: string; value: number }) => {
    setSelectedAccessoryCategory(option.label as AccessoryCategory);
  };
  const defaultOptionIndex = {
    목걸이: 0,
    귀걸이: 1,
    반지: 2,
  };

  return (
    <div className={styles.accessoryCategorySettingDiv}>
      {selectedAccessoryCategory === "목걸이" ? (
        <Necklace fill="#fff" />
      ) : selectedAccessoryCategory === "귀걸이" ? (
        <Earring fill="#fff" fill2="#fff" />
      ) : (
        <Ring2 fill="#fff" fill2="#fff" />
      )}
      <MySelect
        className={styles.accessoryCategorySelect}
        defaultSelectedIndex={defaultOptionIndex[selectedAccessoryCategory]}
        width={80}
        height={40}
        options={options}
        onSelect={onSelect}
      />
    </div>
  );
};

export default AccessoryCategorySettingDiv;
