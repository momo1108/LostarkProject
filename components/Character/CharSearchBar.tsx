import { useRef } from "react";

const CharSearchBar: React.FC<{ search: (name: string) => void }> = ({
  search,
}) => {
  const nameRef = useRef<HTMLInputElement>(null);
  return (
    <div>
      SearchBar :
      <input type="text" ref={nameRef} />
      <input
        type="button"
        className="text-white"
        value="검색"
        onClick={click}
      />
    </div>
  );

  function click() {
    const name = nameRef.current!.value;
    if (!name) {
      alert("닉네임을 입력하세요!");
      return;
    }
    search(name);
  }
};

export default CharSearchBar;
