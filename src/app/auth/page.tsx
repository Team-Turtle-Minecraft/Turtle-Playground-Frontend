// app/auth/page.tsx
"use client";

import { getGoogleLoginUrl, getKakaoLoginUrl } from "@/apis/api/auth";

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-center text-gray-900">
            Welcome to 거북이 놀이터
          </h1>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => (window.location.href = getGoogleLoginUrl())}
            className="flex items-center justify-center w-full px-4 py-3 font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Google로 계속하기
          </button>

          <button
            onClick={() => (window.location.href = getKakaoLoginUrl())}
            className="w-full px-4 py-3 rounded-lg text-gray-900 bg-[#FEE500] hover:bg-[#ebd500] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FEE500] flex items-center justify-center font-medium"
          >
            카카오로 계속하기
          </button>
        </div>
      </div>
    </div>
  );
}
