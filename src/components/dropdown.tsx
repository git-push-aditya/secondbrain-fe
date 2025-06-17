import { useState, type Dispatch, type SetStateAction } from "react";
import { ButtonEl } from "./button";
import { DropdownIcon, DropUpIcon } from "../icons/commonIcons";

const Dropdown = ({ list, title, selected, setState }: { list: string[], selected: string, title: string, setState: Dispatch<SetStateAction<string>> }) => {
  const [open, setOpen] = useState(false);
  const funSetOpen = () => setOpen((open) => !open);

  const handleClick = (item: string) => {
    console.log(item)
    setState(item);
    funSetOpen();
  }

  const heightClass = (list.length * 10) >= 30 ? 'h-30' : `h-${list.length * 10 + 15}`;

  return (
    <div className="relative cursor-pointer w-[100%]  ">
      <ButtonEl endIcon={!open ? <DropdownIcon dim="30" /> : <DropUpIcon dim="30" />} particularStyle=" w-[100%] font-head text-[1.65rem]  font-[580] h-10 px-6 " placeholder={selected === "blank" ? title : selected} onClickHandler={funSetOpen} buttonType={"dropdown"} />

      {open && (
        <div className={`absolute mt-2 w-[100%] ${heightClass} overflow-y-auto scrollbarSB rounded-md shadow-lg bg-white ring-1 ring-black/5 z-100 `}>
          <div className="py-1">
            {list.filter((element) => (element != "blank")).map((element) => (<button onClick={() => handleClick(element)} className="block cursor-pointer w-full text-center text-lg px-4 py-2 font-[500] hover:bg-gray-100 h-10 ">{element}</button>))}
          </div>
        </div>
      )}
    </div>
  );
};


export default Dropdown;