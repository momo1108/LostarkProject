import styles from "@/styles/accessory/Body.module.scss";
import { useState } from "react";

const StatTradeCountFilter: React.FC = () => {
  const [statFilterValue, setStatFilterValue] = useState<{
    [key: string]: number;
  }>({
    "힘/민/지": 0,
    "구매 후 거래 가능 횟수": 0,
  });

  return (
    <div className="flex flex-wrap gap-x-1 gap-y-3">
      <div className="grid gap-2 grid-cols-3 xs:flex xs:grid-cols-none">
        {Object.keys(statFilterValue).map((e) => {
          return (
            <div className={styles.filterDiv} key={`filter_${e}`}>
              <label>
                <input
                  type="number"
                  value={statFilterValue[e]}
                  max={99999}
                  min={0}
                  onFocus={(event) => {
                    event.target.select();
                  }}
                  onChange={(event) => {
                    let stat_tmp = parseInt(event.target.value);
                    stat_tmp = stat_tmp
                      ? stat_tmp > 99999
                        ? 99999
                        : stat_tmp < 0
                        ? 0
                        : stat_tmp
                      : 0;
                    setStatFilterValue({
                      ...statFilterValue,
                      [e]: stat_tmp,
                    });
                  }}
                />
                <div className={styles.borderDiv}>
                  <p className={styles.filterTitle}>{e}</p>{" "}
                </div>
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatTradeCountFilter;
