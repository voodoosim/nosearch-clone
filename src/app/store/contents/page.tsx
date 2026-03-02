import type { Metadata } from "next";
import contents from "@/data/contents.json";
import ContentsClient from "./ContentsClient";

export const metadata: Metadata = {
  title: "콘텐츠 - 스마트홈딜 가이드",
  description: "전문가가 알려주는 가전제품 구매 가이드, 비교분석, 사용팁, 트렌드",
};

export interface ContentItem {
  id: string;
  category: string;
  title: string;
  summary: string;
  thumbnail: string;
  date: string;
  views: number;
  readTime: string;
}

export default function ContentsPage() {
  return <ContentsClient contents={contents as ContentItem[]} />;
}
