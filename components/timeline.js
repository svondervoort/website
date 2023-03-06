export default function Timeline({item}) {
    const simpleView = ['Skill', 'Client'];

    return (
        <div className={"relative pl-16 before:absolute before:bottom-0 before:top-0 before:left-4 before:w-0.5 before:bg-primary pb-8"}>
            <div className={`absolute left-0 top-0 w-8 h-8 rounded-full border ${!simpleView.includes(item.type) ? "border-solid" : "border-dashed"} flex align-center justify-center border-primary bg-black`}></div>
            <div className={`font-mono flex justify-between items-center`}>
                <h2 className={`leading-8 ${!simpleView.includes(item.type) ? "text-white text-3xl" : "text-grey"}`}>{item.title}</h2>

                {item.rating != null &&
                    <span className={`text-grey`}>{item.rating}%</span>
                }

                {(item.from != null && !simpleView.includes(item.type)) &&
                    <div className={`flex border border-solid border-primary rounded`}>
                        <span className={`text-primary px-4 py-2`}>{ formatDate(item.from) }</span>
                        {item.till != null &&
                            <span className={`text-black bg-primary px-4 py-2`}>{ formatDate(item.till) }</span>
                        }
                    </div>
                }
            </div>

            {item.badge != null &&
                <span className={'text-sm font-mono text-primary border border-solid border-primary rounded inline-block px-2 py-1 mt-4'}>{item.badge}</span>
            }

            {item.rating != null && <div className="w-full border border-solid border-grey rounded-full mt-4">
                <div className="bg-grey h-2.5 rounded-full" style={{width: item.rating + '%'}}></div>
            </div>}

        </div>
    );
}

function formatDate(date, options){
    return new Date(date).toLocaleDateString([], { year: 'numeric'});
}
