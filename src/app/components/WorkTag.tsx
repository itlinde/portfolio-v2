interface WorkTagProps {
  tagName: string;
}

export default function WorkTag({ tagName }: WorkTagProps) {
  return (
    <p
      className="text-subtitle text-text-muted bg-bg-muted px-2 py-1
     rounded-sm h-fit"
    >
      {tagName}
    </p>
  );
}
