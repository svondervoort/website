export default function Skill({item}) {
    return (
        <div>
            <div className="flex justify-between mb-1">
                <span className="text-base font-medium">{item.name}</span>
                <span className="text-sm font-medium">{item.rating}%</span>
            </div>
            <div className="w-full border border-solid border-primary rounded-full">
                <div className="bg-primary h-2.5 rounded-full" style={{width: item.rating + '%'}}></div>
            </div>
        </div>
    );
}
