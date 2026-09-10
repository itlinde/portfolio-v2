import Image from "next/image";
import Link from "next/link";
import WorkTag from "@/components/WorkTag";
import CursorTooltip from "@/components/CursorTooltip";

interface WorkCardProps {
  title: string;
  description: string;
  tags: string[];
  date: string;
  image?: { src: string; alt: string };
  link: string;
}

export default function WorkCard({
  title,
  description,
  tags,
  date,
  image,
  link,
}: WorkCardProps) {
  return (
    <div className="">
      <CursorTooltip content="view project" duration={0.3}>
        <Link href={link} className="group flex gap-8 h-96">
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
          <div className="w-full h-full rounded-lg relative overflow-hidden bg-bg-muted">
            {image && (
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
              />
            )}
            { /* getting rid of this for now bc it's not mobile friendly at all lol */ }
            {/* <a href="#" className="hidden group-hover:flex absolute inset-y-0 left-0 z-10 w-1/2 p-6 items-center justify-start hover:bg-accent-hover">
              <p className="text-h6 text-text-inverse">
                Github
              </p>
            </a>
            <a href="#" className="hidden group-hover:flex absolute inset-y-0 right-0 z-10 w-1/2 p-6 items-center justify-end hover:bg-accent-hover">
              <p className="text-h6 text-text-inverse">
                Case Study
              </p>
            </a> */}
          </div>
        </Link>
      </CursorTooltip>
    </div>
  );
}
