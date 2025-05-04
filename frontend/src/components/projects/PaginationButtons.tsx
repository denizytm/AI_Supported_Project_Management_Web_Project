import { useEffect } from "react";

interface PaginationButtonsProps {
  selectedPage: number;
  setSelectedPage: React.Dispatch<React.SetStateAction<number>>;
}

export default function PaginationButtons({
  selectedPage,
  setSelectedPage,
}: PaginationButtonsProps) {

  return (
    <div className="flex justify-center mt-6">
      <button className="px-3 py-2 border rounded-l-md">{"<"}</button>
      {selectedPage != 1 && (
        <button
          className={`px-3 py-2 border`}
          onClick={() => setSelectedPage(selectedPage - 1)}
        >
          {selectedPage - 1}
        </button>
      )}
      <button
        className={`px-3 py-2 border bg-gray-500`}
        onClick={() => setSelectedPage(selectedPage)}
      >
        {selectedPage}
      </button>
      <button
        className={`px-3 py-2 border`}
        onClick={() => setSelectedPage(selectedPage + 1)}
      >
        {selectedPage + 1}
      </button>
      <button className="px-3 py-2 border rounded-r-md">{">"}</button>
    </div>
  );
}
