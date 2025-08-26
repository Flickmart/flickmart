import { getMarkdownData } from '@/lib/markdown';

const PrivacyPolicy = async () => {
  const contentHtml = await getMarkdownData(
    'public/markdown/privacy-policy.md'
  );

  return (
    <main className="px-[2.5%] pt-10">
      <div
        className="prose-lg max-[767px]:prose"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </main>
  );
};
export default PrivacyPolicy;
