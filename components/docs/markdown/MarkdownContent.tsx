import markdown from "@/lib/markdown";

export interface Props {
  content: string;
}

export default async function MarkdownContent({content}: Props) {
  const htmlContent = await markdown.renderMarkdown(content);

  return (
    <article className="docsContentArticle prose !max-w-3xl prose-h2:mt-8 dark:prose-invert">
      <div className="[&>_:first-child]:!mt-0" dangerouslySetInnerHTML={({__html: htmlContent})} />
    </article>
  );
}