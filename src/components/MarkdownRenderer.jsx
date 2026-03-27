import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github-dark.css'

export default function MarkdownRenderer({ content }) {
  if (!content) return null

  return (
    <div className="prose prose-sm dark:prose-invert max-w-none
      prose-headings:text-slate-800 dark:prose-headings:text-slate-200
      prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-p:leading-relaxed
      prose-strong:text-slate-800 dark:prose-strong:text-slate-200
      prose-code:text-indigo-600 dark:prose-code:text-indigo-400 prose-code:bg-slate-100 dark:prose-code:bg-slate-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
      prose-pre:bg-slate-900 prose-pre:rounded-lg prose-pre:overflow-x-auto
      prose-li:text-slate-600 dark:prose-li:text-slate-300
      prose-a:text-indigo-600 dark:prose-a:text-indigo-400
      prose-table:text-sm
      prose-th:text-slate-700 dark:prose-th:text-slate-300
      prose-td:text-slate-600 dark:prose-td:text-slate-300
      [&_pre_code]:text-sm [&_pre_code]:leading-relaxed
    ">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
        {content}
      </ReactMarkdown>
    </div>
  )
}
