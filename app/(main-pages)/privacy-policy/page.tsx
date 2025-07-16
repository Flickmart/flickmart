import { getMarkdownData } from "@/lib/markdown";

const PrivacyPolicy = async () => {
  const contentHtml = await getMarkdownData("public/privacy-policy.md");

  return (
    <main className="px-[2.5%]">
      <div
        className="prose-lg max-[767px]:prose"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      ></div>
    </main>
  );
};
export default PrivacyPolicy;
