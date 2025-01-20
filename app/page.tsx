"use client";

import { useState, useEffect } from "react";
import { LLMResponse } from "@/app/types/llm";
import { ResponseCard } from "./components/ResponseCard";
import { LLM_MODELS } from "./utils/llm";
import Link from "next/link";
import {
  Cog6ToothIcon,
  KeyIcon,
  ChatBubbleBottomCenterTextIcon,
  ArrowPathIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { FaRegCopy } from "react-icons/fa";

function AllResponsesJson({
  responses,
  prompt,
}: {
  responses: LLMResponse[];
  prompt: string;
}) {
  const [copySuccess, setCopySuccess] = useState(false);

  const allResponsesJson = {
    question: prompt,
    responses: responses.map((r) => ({
      llm: r.model,
      output: r.response,
    })),
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        JSON.stringify(allResponsesJson, null, 2)
      );
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        全レスポンスのJSON
      </h3>
      <div className="relative">
        <textarea
          readOnly
          value={JSON.stringify(allResponsesJson, null, 2)}
          className="w-full h-48 p-2 text-sm font-mono bg-gray-50 dark:bg-gray-700 border dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-300"
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
  );
}

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [responses, setResponses] = useState<LLMResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasKeys, setHasKeys] = useState(false);

  useEffect(() => {
    const keys = {
      openai: localStorage.getItem("openai_key") || "",
      deepseek: localStorage.getItem("deepseek_key") || "",
      gemini: localStorage.getItem("gemini_key") || "",
      anthropic: localStorage.getItem("anthropic_key") || "",
    };
    setHasKeys(Object.values(keys).every((key) => key !== ""));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const apiKeys = {
      openai: localStorage.getItem("openai_key") || "",
      deepseek: localStorage.getItem("deepseek_key") || "",
      gemini: localStorage.getItem("gemini_key") || "",
      anthropic: localStorage.getItem("anthropic_key") || "",
    };

    if (
      !apiKeys.openai ||
      !apiKeys.deepseek ||
      !apiKeys.gemini ||
      !apiKeys.anthropic
    ) {
      alert("Please set your API keys in the settings page");
      return;
    }

    setIsLoading(true);
    setResponses(
      Object.keys(LLM_MODELS).map((model) => ({
        model,
        response: "",
        loading: true,
        question: prompt,
      }))
    );

    try {
      const response = await fetch("/api/llm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          apiKeys,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get responses");
      }

      setResponses(data.responses);
    } catch (error: any) {
      setResponses(
        Object.keys(LLM_MODELS).map((model) => ({
          model,
          response: "",
          error: error.message || "Failed to get response",
          loading: false,
          question: prompt,
        }))
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            LLM比較さん
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            複数のLLMの回答を比較するツール
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col space-y-2">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="質問を入力してください..."
              className="w-full h-32 p-4 text-gray-900 dark:text-gray-300 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="flex justify-between items-center w-full">
            <button
              type="submit"
              disabled={isLoading}
              className={
                isLoading
                  ? "px-4 py-2 text-white rounded-lg shadow-sm bg-gray-400 dark:bg-gray-600 cursor-not-allowed w-full"
                  : "px-4 py-2 text-white rounded-lg shadow-sm bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 w-full"
              }
            >
              {isLoading ? (
                <ArrowPathIcon className="h-5 w-5 animate-spin" />
              ) : (
                "送信"
              )}
            </button>
          </div>
        </form>

        {!hasKeys && (
          <div className="bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 p-4 mb-4">
            <div className="flex">
              <KeyIcon className="h-5 w-5 text-yellow-400" />
              <div className="ml-3">
                <p className="text-sm text-yellow-700 dark:text-yellow-200">
                  APIキーが設定されていません。
                  <Link
                    href="/settings"
                    className="font-medium underline hover:text-yellow-600 dark:hover:text-yellow-100"
                  >
                    設定ページ
                  </Link>
                  でAPIキーを設定してください。
                </p>
              </div>
            </div>
          </div>
        )}

        {responses.length === 0 ? (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Available LLM Models
              </h2>
              <div className="space-y-4">
                {Object.entries(LLM_MODELS).map(([key, model]) => (
                  <div
                    key={key}
                    className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-md"
                  >
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-gray-200">
                        {model.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {model.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
                使い方ガイド
              </h2>
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                      <KeyIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1 text-gray-900 dark:text-gray-200">
                      1. API キーの設定
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      各LLMのAPIキーを設定画面で登録してください。キーは安全にローカルストレージに保存され、
                      ブラウザ外には送信されません。
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                      <ChatBubbleBottomCenterTextIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1 text-gray-900 dark:text-gray-200">
                      2. プロンプトの入力
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      質問や指示を入力フィールドに記入してください。同じプロンプトが全てのLLMに送信されます。
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full animate-pulse">
                      <ArrowPathIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1 text-gray-900 dark:text-gray-200">
                      3. 一括比較
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      全てのLLMからの回答が同時に表示され、簡単に比較できます。
                      各回答は展開/折りたたみ可能です。
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                      <ShieldCheckIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1 text-gray-900 dark:text-gray-200">
                      4. プライバシーと安全性
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      APIキーはお使いのブラウザにのみ保存され、外部に送信されることはありません。
                      安心してご利用いただけます。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {isLoading ? (
              <div className="flex justify-center items-center min-h-[200px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {responses.map((response) => (
                    <ResponseCard
                      key={response.model}
                      {...response}
                      question={prompt}
                    />
                  ))}
                </div>
                {responses.length > 0 && (
                  <AllResponsesJson responses={responses} prompt={prompt} />
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
