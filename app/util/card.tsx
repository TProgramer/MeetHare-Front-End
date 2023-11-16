import { ReactNode } from "react";
import ReactMarkdown from "react-markdown";

export default function Card({
  title,
  description,
  demo,
  large,
  link,
}: {
  title: string;
  description: string;
  demo: ReactNode;
  large?: boolean;
  link: string;
}) {
  return (
    <div
      className={`relative col-span-1 h-32 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md ${
        large ? "md:col-span-2" : ""
      }`}
    >
      <a href={link} className="flex p-3">
        <div className="flex h-24 items-center justify-center">{demo}</div>
        <div className="mx-auto flex w-60 max-w-md flex-col justify-center text-center">
          <h2 className="bg-gradient-to-br from-black to-stone-500 bg-clip-text font-display text-xl font-extrabold text-transparent [text-wrap:balance] md:text-3xl md:font-normal">
            {title}
          </h2>
          <div className="prose-sm mt-3 leading-normal text-gray-500 [text-wrap:balance] md:prose">
            <ReactMarkdown
              components={{
                a: ({ node, ...props }) => (
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    {...props}
                    className="font-medium text-gray-800 underline transition-colors"
                  />
                ),
                code: ({ node, ...props }) => (
                  <code
                    {...props}
                    // @ts-ignore (to fix "Received `true` for a non-boolean attribute `inline`." warning)
                    inline="true"
                    className="rounded-sm bg-gray-100 px-1 py-0.5 font-mono font-medium text-gray-800"
                  />
                ),
              }}
            >
              {description}
            </ReactMarkdown>
          </div>
        </div>
      </a>
    </div>
  );
}
