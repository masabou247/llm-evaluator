import { FaXTwitter } from "react-icons/fa6";

export function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t dark:border-gray-700">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-1.5">
          <a
            href="https://x.com/ai_masaou"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 text-sm"
          >
            開発者:
            <FaXTwitter className="w-4 h-4 mx-1" />
            まさお@AI開発者(@ai_masaou)
          </a>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {new Date().getFullYear()} LLM比較さん - 複数のLLMの回答を比較するツール
          </p>
        </div>
      </div>
    </footer>
  );
}
