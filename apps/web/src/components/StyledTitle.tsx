interface StyledTitleProps {
  text: string
  firstLetterMargin?: string
}

export function StyledTitle({ text, firstLetterMargin = "0.07em" }: StyledTitleProps) {
  return (
    <>
      {(text ?? "").split(" ").map((word, i, arr) =>
        word === "~" ? (
          <span key={i}> ~ </span>
        ) : (
          <span key={i} className="whitespace-nowrap">
            <span className="italic uppercase inline-block" style={{ marginRight: i === 0 ? firstLetterMargin : "0.02em" }}>
              {word[0] ?? ""}
            </span>
            <span className="lowercase">{word.slice(1)}</span>
          </span>
          {i < arr.length - 1 && " "}
        )
      )}
    </>
  )
}
