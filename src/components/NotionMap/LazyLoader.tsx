"use client";

import dynamic from "next/dynamic";

import { NotionMapProps } from "./types";
import Loading from "./Loading";

const LazyMap = dynamic(() => import("@/components/NotionMap/NotionMap"), {
  ssr: false,
  loading: () => <Loading />,
});

function NotionMap(props: NotionMapProps) {
  return <LazyMap {...props} />;
}

export default NotionMap;
