import WorkTag from "@/app/components/WorkTag";

interface SmallProjectItemProps {
  title: string;
  date: string;
  tags: string[];
}

export default function SmallProjectItem({
  title,
  date,
  tags,
}: SmallProjectItemProps) {
  return (
    <div className="flex gap-4 w-full items-center">
      <h6 className="text-h6 w-fit shrink-0 text-nowrap">{title}</h6>
      {tags.map((tag) => (
        <WorkTag key={tag} tagName={tag} />
      ))}
      <hr className="border-line w-full" />
      <p className="text-subtitle text-text-muted">{date}</p>
    </div>
  );
}
