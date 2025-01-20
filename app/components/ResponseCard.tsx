import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { FaRegCopy } from "react-icons/fa";
import clsx from "clsx";
import { LLMResponse } from "@/app/types/llm";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Avatar from "boring-avatars";

export function ResponseCard({
  model,
  response,
  error,
  loading,
  question,
}: LLMResponse) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const responseJson = {
    question,
    responses: [
      {
        llm: model,
        output: response,
      },
    ],
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        JSON.stringify(responseJson, null, 2)
      );
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-4">
      <div
        className="flex items-center p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex-shrink-0">
          <div className="w-12 h-12">
            <Avatar
              size={48}
              name={model}
              variant="pixel"
              colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
            />
          </div>
        </div>
        <div className="ml-4 flex-grow">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200">
            {model}
          </h3>
          <div
            className={clsx(
              "prose prose-sm max-w-none dark:prose-invert",
              error
                ? "text-red-600 dark:text-red-400"
                : "text-gray-600 dark:text-gray-400",
              !isExpanded && "line-clamp-2"
            )}
          >
            {loading ? (
              <span className="animate-pulse">Loading...</span>
            ) : error ? (
              error
            ) : (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {response}
              </ReactMarkdown>
            )}
          </div>
        </div>
        <div className="ml-4">
          {isExpanded ? (
            <ChevronUpIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          ) : (
            <ChevronDownIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          )}
        </div>
      </div>
      {isExpanded && (
        <div className="px-4 pb-4">
          <div className="mt-4">
            <div className="relative">
              <textarea
                readOnly
                value={JSON.stringify(responseJson, null, 2)}
                className="w-full h-32 p-2 text-sm font-mono bg-gray-50 dark:bg-gray-700 border dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-300"
              />
              <button
                onClick={handleCopy}
                className="absolute top-2 right-2 p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 bg-white dark:bg-gray-800 rounded-md shadow-sm border dark:border-gray-600"
              >
                <FaRegCopy className="w-4 h-4" />
                <span className="sr-only">Copy to clipboard</span>
              </button>
              {copySuccess && (
                <div className="absolute top-2 right-12 px-2 py-1 text-xs text-green-600 dark:text-green-400 bg-white dark:bg-gray-800 rounded-md shadow-sm border dark:border-gray-600">
                  Copied!
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
