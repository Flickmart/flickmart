import { getMarkdownData } from "@/lib/markdown";

const TermsOfService = async () => {
  const contentHtml = await getMarkdownData(
    "public/markdown/terms-of-service.md"
  );

  return (
    <main className="px-[2.5%] pt-10">
      <div
        className="prose-lg max-[767px]:prose"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      ></div>
    </main>
  );
};
export default TermsOfService;
