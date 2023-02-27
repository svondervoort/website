export default function Experience({item}) {
    const dateOptions = { month: '2-digit', year: '2-digit'};

    return (
        <div className="py-4 border-b border-dashed border-primary group-hover:opacity-50 hover:!opacity-100 group">
            <strong className="block text-2xl text-primary mb-2">{item.title}</strong>
            <div className={'flex justify-between items-center'}>
                <span className={'text-sm text-primary border border-solid border-primary rounded inline-block px-2 mr-8'}>{item.type}</span>
                <div>
                    <span className={'text-sm text-primary'}>{item.location}</span>
                    <span className={'text-sm text-primary ml-8'}>{ formatDate(item.dateFrom, dateOptions) } - { formatDate(item.dateFrom, dateOptions) }</span>
                </div>
            </div>
            {'' != item.description && <div className={'text-sm mt-2 border-t border-dashed border-primary pt-4 hidden group-hover:block'}>{item.description}</div>}        </div>
    );
}

function formatDate(date, options){
    return new Date(date).toLocaleDateString([], options);
}
