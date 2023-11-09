export default function Card({
  place_num,
  name,
  address,
  category,
  onClick,
}: {
  place_num: number;
  name: string;
  address: string;
  category: string;
  onClick?: (place_num: number) => void;
}) {
  return (
    <div
      className="relative col-span-1 my-3 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md"
      onClick={() => onClick && onClick(place_num)}
    >
      <div className="mx-auto mb-3 mt-3 max-w-md">
        <div className="flex">
          {category === "restaurant" ? (
            <span className="mx-3">🍽 </span>
          ) : category === "study" ? (
            <span className="mx-3">✏ </span>
          ) : category === "activity" ? (
            <span className="mx-3">💪 </span>
          ) : category === "culture" ? (
            <span className="mx-3">🎟 </span>
          ) : null}
          <h2
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            className="mr-3 bg-gradient-to-br from-black to-stone-500 bg-clip-text font-display text-xl font-bold text-transparent [text-wrap:balance] md:text-3xl md:font-normal"
          >
            {name}
          </h2>
        </div>
        <div className="flex">
          <img
            className="mx-3"
            src="/card-mark-logo.svg"
            style={{ width: "21px", height: "29px" }}
            alt="card-mark-logo"
          />

          <h4
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              paddingTop: "3px",
            }}
            className="mr-3 bg-gradient-to-br from-black to-stone-500 bg-clip-text align-middle font-display text-base text-transparent [text-wrap:balance] md:text-3xl md:font-normal"
          >
            {address}
          </h4>
        </div>
      </div>
    </div>
  );
}
