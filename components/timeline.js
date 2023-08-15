export default function Timeline({ item, last }) {
  const simpleView = [`Skill`, `Client`];

  return (
    <div
      className={`relative pl-16 lg:pl-24 text-sm before:absolute before:bottom-0 before:top-8 before:left-4 before:w-0.5 before:bg-white/50 md:text-base ${
        last ? `pb-40` : `pb-12`
      }`}
    >
      <div
        className={`absolute left-0 top-0 h-8 w-8 rounded-full border ${
          !simpleView.includes(item.type) ? `border-solid` : `border-dashed`
        } align-center flex justify-center border-primary bg-black`}
      ></div>
      <div className={` ${
          simpleView.includes(item.type) ? "opacity-50 lg:pr-48" : ""
      }`}>
        <div className="flex flex-col items-start justify-between font-mono md:flex-row md:items-center">
          <h2
            className={`leading-8 ${
              !simpleView.includes(item.type)
                ? `mb-2 text-xl text-white md:mb-0 md:text-3xl`
                : `text-white`
            }`}
          >
            {item.title}
          </h2>

          {item.rating != null && (
            <span className="text-white">{item.rating}%</span>
          )}

          {item.from != null && !simpleView.includes(item.type) && (
            <div className="flex rounded border border-solid border-white">
              <span className="px-4 py-2">
                {formatDate(item.from)}
              </span>

              <span className="bg-white px-4 py-2 text-green-500">
                {item.till != null ? formatDate(item.till) : `Today`}
              </span>
            </div>
          )}
        </div>

        {item.badges != null && (
          <div className="mt-4 flex flex-wrap gap-4">
            {item.badges != null &&
              item.badges.map((badge, i) => (
                <span
                  key={`badge${i}`}
                  className={`inline-block rounded border border-solid px-2 py-1 font-mono text-sm  ${
                    i === 0 ? "border-white text-white" : "border-white text-white"
                  }`}
                >
                  {badge}
                </span>
              ))}
          </div>
        )}

        {item.rating != null && (
          <div className="mt-2 w-full rounded-full border border-solid border-white md:mt-4">
            <div
              className="h-2.5 rounded-full bg-white"
              style={{ width: item.rating + `%` }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
}

function formatDate(date, options) {
  return new Date(date).toLocaleDateString([], { year: `numeric` });
}
