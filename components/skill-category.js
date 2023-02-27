import Skill from "./skill";

export default function SkillCategory({item}) {
    return (
        <div className={'my-16'}>
            <h3 className={'text-primary'}>{item.title}</h3>
            <div className="grid md:grid-cols-2 gap-8">
                {item.skillCollection?.items.map((item) => (
                    <Skill key="{item.sys.id}" item={item}></Skill>
                ))}
            </div>
        </div>
    );
}
