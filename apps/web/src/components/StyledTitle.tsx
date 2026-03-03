import { Fragment } from "react"

interface StyledTitleProps {
  text: string
  firstLetterMargin?: string
}

export function StyledTitle({ text, firstLetterMargin = "0.07em" }: StyledTitleProps) {
  return (
    <>
      {(text ?? "").split(" ").map((word, i, arr) =>
        word === "~" ? (
          <Fragment key={i}> ~ </Fragment>
        ) : (
          <Fragment key={i}>
            <span className="whitespace-nowrap">
              <span className="italic uppercase inline-block" style={{ marginRight: i === 0 ? firstLetterMargin : "0.02em" }}>
                {word[0] ?? ""}
              </span>
              <span className="lowercase">{word.slice(1)}</span>
            </span>
            {i < arr.length - 1 && " "}
          </Fragment>
        )
      )}
    </>
  )
}
