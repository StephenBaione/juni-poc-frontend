import React from 'react'
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';

import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function MarkDown(props) {
    const {
        content
    } = props;

    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex]}
            components={{
                code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    console.log(inline, match);
                    return !inline && match ? (
                        <SyntaxHighlighter
                            children={String(children).replace(/\n$/, "")}
                            style={atomDark}
                            language={match[1]}
                            {...props}
                        />
                    ) : (
                        <code className={className} {...props}>
                            {children}
                        </code>
                    );
                },
            }}
        >
            {content}
        </ReactMarkdown>
    )
}


