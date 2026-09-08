import Image from "next/image";
import WorkTag from "@/app/components/WorkTag";

interface WorkCardProps {
  title: string;
  description: string;
  tags: string[];
  date: string;
  image?: { src: string; alt: string };
}

export default function WorkCard({
  title,
  description,
  tags,
  date,
  image,
}: WorkCardProps) {
  return (
    <div className="flex gap-8 h-96">
      <div className="min-w-2xs w-3/5 flex flex-col h-full justify-between">
        <div className="flex flex-col gap-4">
          <h5 className="text-h5">{title}</h5>
          <p className="text-body-sans text-text-body">{description}</p>
          <div className="flex gap-1 flex-wrap">
            {tags.map((tag) => (
              <WorkTag key={tag} tagName={tag} />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <p className="text-subtitle text-text-muted">{date}</p>
          <hr className="border-line" />
        </div>
      </div>
      <div className="w-full h-full bg-green-200 rounded-lg relative overflow-hidden">
        {image && (
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="object-cover"
          />
        )}
      </div>
    </div>
  );
}
