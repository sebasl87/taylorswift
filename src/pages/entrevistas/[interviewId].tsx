import { GetStaticProps, GetStaticPaths } from 'next';
import Head from 'next/head';
import { useLocale } from "next-intl";
import InterviewDetailPage from "@/components/InterviewDetailPage";
import interviewsData from "@/constants/interviews.json";
import {
  Interview,
  generateInterviewSlug,
  getInterviewTitle,
  getInterviewDescription,
} from "@/types/interview";

interface InterviewPageProps {
  interview: Interview;
}

export default function InterviewPage({ interview }: InterviewPageProps) {
  const locale = useLocale();

  const title = getInterviewTitle(interview, locale);
  const description = getInterviewDescription(interview, locale);
  const mediaName = interview.media.name;
  const date = new Date(interview.date);
  const year = date.getFullYear();

  const fullTitle = `${title} | ${mediaName} ${year} | Taylor Swift`;

  return (
    <>
      <Head>
        <title>{fullTitle}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={`${title}, ${mediaName}, ${year}, Taylor Swift, entrevista, interview, pop, music`} />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content={interview.content?.cover_image || "/images/entrevistas/taylor-default.jpg"} />
        <meta property="article:published_time" content={interview.date} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={fullTitle} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={interview.content?.cover_image || "/images/entrevistas/taylor-default.jpg"} />
      </Head>
      <InterviewDetailPage interview={interview} />
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const interviews = interviewsData as Interview[];
  const locales = ['en', 'es'];
  const paths: { params: { interviewId: string }, locale: string }[] = [];

  interviews.forEach((interview) => {
    locales.forEach((locale) => {
      paths.push({ params: { interviewId: generateInterviewSlug(interview.id) }, locale });
    });
  });

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const interviewId = params?.interviewId as string;
  const interviews = interviewsData as Interview[];
  const interview = interviews.find((i) => generateInterviewSlug(i.id) === interviewId);

  if (!interview) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      interview,
      messages: (await import(`../../../messages/${locale}.json`)).default
    }
  };
};
