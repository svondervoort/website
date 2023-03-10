export default function Timeline({ item, last }) {
  const simpleView = ["Skill", "Client"];

  return (
    <div
      className={`relative pl-16 text-sm before:absolute before:bottom-0 before:top-0 before:left-4 before:w-0.5 before:bg-primary md:text-base ${
        last ? "pb-40" : "pb-12"
      }`}
    >
      <div
        className={`absolute left-0 top-0 h-8 w-8 rounded-full border ${
          !simpleView.includes(item.type) ? "border-solid" : "border-dashed"
        } align-center flex justify-center border-primary bg-black`}
      ></div>
      <div
        className={`flex flex-col items-start justify-between font-mono md:flex-row md:items-center`}
      >
        <h2
          className={`leading-8 ${
            !simpleView.includes(item.type)
              ? "mb-2 text-xl text-white md:mb-0 md:text-3xl"
              : "text-grey"
          }`}
        >
          {item.title}
        </h2>

        {item.rating != null && (
          <span className={`text-grey`}>{item.rating}%</span>
        )}

        {item.from != null && !simpleView.includes(item.type) && (
          <div className={`flex rounded border border-solid border-primary`}>
            <span className={`px-4 py-2 text-primary`}>
              {formatDate(item.from)}
            </span>
            {item.till != null && (
              <span className={`bg-primary px-4 py-2 text-black`}>
                {formatDate(item.till)}
              </span>
            )}
          </div>
        )}
      </div>

      {item.badge != null && (
        <span
          className={
            "mt-4 inline-block rounded border border-solid border-primary px-2 py-1 font-mono text-sm text-primary"
          }
        >
          {item.badge}
        </span>
      )}

      {item.rating != null && (
        <div className="mt-2 w-full rounded-full border border-solid border-grey md:mt-4">
          <div
            className="h-2.5 rounded-full bg-grey"
            style={{ width: item.rating + "%" }}
          ></div>
        </div>
      )}
    </div>
  );
}

function formatDate(date, options) {
  return new Date(date).toLocaleDateString([], { year: "numeric" });
}
