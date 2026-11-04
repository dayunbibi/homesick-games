type Props = { labels: string[]; current: number };

// progress tabs above the game
export default function Steps({ labels, current }: Props) {
  return (
    <ol className="m-0 flex list-none gap-1.5 p-0 font-ui text-[13px]">
      {labels.map((label, i) => (
        <li
          key={label}
          className={`flex-1 border-b-[3px] py-1 text-center ${
            i < current ? "border-ink-dim text-ink" : i === current ? "border-lamp text-lamp" : "border-line text-ink-dim"
          }`}
        >
          {label}
        </li>
      ))}
    </ol>
  );
}
