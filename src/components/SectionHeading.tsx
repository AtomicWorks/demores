type SectionHeadingProps = {
  kicker: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export function SectionHeading({
  kicker,
  title,
  description,
  align = "left"
}: SectionHeadingProps) {
  return (
    <div className={align === "center" ? "text-center" : "text-left"}>
      <p className="section-kicker">{kicker}</p>
      <h2 className="section-title mt-3">{title}</h2>
      {description ? (
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-textSecondary">
          {description}
        </p>
      ) : null}
    </div>
  );
}
