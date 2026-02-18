import { getLocale } from "next-intl/server";
import { Metadata } from "next";
import InterviewDetailPage from "@/components/InterviewDetailPage";
import interviewsData from "@/constants/interviews.json";
import {
  Interview,
  generateInterviewSlug,
  getInterviewTitle,
  getInterviewDescription,
} from "@/types/interview";

export async function generateStaticParams() {
  const interviews = interviewsData as Interview[];
  return interviews.map((interview) => ({
    interviewId: generateInterviewSlug(interview.id),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ interviewId: string }>;
}): Promise<Metadata> {
  const { interviewId } = await params;
  const locale = await getLocale();
  const interviews = interviewsData as Interview[];
  const interview = interviews.find(
    (i) => generateInterviewSlug(i.id) === interviewId,
  );

  if (!interview) return { title: "Interview Not Found" };

  const title = getInterviewTitle(interview, locale);
  const description = getInterviewDescription(interview, locale);
  const mediaName = interview.media.name;
  const date = new Date(interview.date);
  const year = date.getFullYear();
  const fullTitle = `${title} | ${mediaName} ${year} | Taylor Swift`;

  return {
    title: fullTitle,
    description: description,
    keywords: `${title}, ${mediaName}, ${year}, Taylor Swift, entrevista, interview, pop, music`,
    openGraph: {
      title: fullTitle,
      description: description,
      type: "article",
      images: [
        interview.content?.cover_image ||
          "/images/entrevistas/taylor-default.jpg",
      ],
      publishedTime: interview.date,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: description,
      images: [
        interview.content?.cover_image ||
          "/images/entrevistas/taylor-default.jpg",
      ],
    },
  };
}

export default async function InterviewPage({
  params,
}: {
  params: Promise<{ interviewId: string }>;
}) {
  const { interviewId } = await params;
  const interviews = interviewsData as Interview[];
  const interview = interviews.find(
    (i) => generateInterviewSlug(i.id) === interviewId,
  );

  if (!interview) {
    return <div>Interview not found</div>;
  }

  return <InterviewDetailPage interview={interview} />;
}
