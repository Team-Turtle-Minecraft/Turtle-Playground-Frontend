// app/page.tsx
export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4">
        <div className="text-xl font-bold">거북이 놀이터</div>

        <div className="flex space-x-8">
          <a href="/shop" className="hover:text-gray-600">
            상점
          </a>
          <a href="/community" className="hover:text-gray-600">
            커뮤니티
          </a>
          <a href="/shop" className="hover:text-gray-600">
            채팅
          </a>
          <a href="/support" className="hover:text-gray-600">
            후원패스
          </a>
        </div>

        <div className="flex space-x-4">
          <button className="px-4 py-2 rounded hover:bg-gray-100">
            로그인
          </button>
          <button className="px-4 py-2 text-white bg-gray-800 rounded hover:bg-gray-700">
            회원가입
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="py-20 text-center">
        <h1 className="mb-4 text-5xl font-bold">
          Sustainable Living,
          <br />
          Personalized
        </h1>
        <p className="mb-8 text-xl text-gray-600">Subtitle</p>
        <div className="space-x-4">
          <button className="px-6 py-3 text-white bg-black rounded hover:bg-gray-800">
            Shop Now
          </button>
          <button className="px-6 py-3 border border-black rounded hover:bg-gray-50">
            Learn More
          </button>
        </div>
      </div>

      {/* Grid Section */}
      <div className="container px-6 py-12 mx-auto">
        <div className="grid grid-cols-2 gap-8">
          {/* Area 1 */}
          <div className="flex items-center justify-center text-2xl bg-gray-200 aspect-square">
            구역 1
          </div>

          {/* Area 2 */}
          <div className="flex items-center justify-center text-2xl bg-gray-200 aspect-square">
            구역 2
          </div>

          {/* Area 3 */}
          <div className="flex items-center justify-center text-2xl bg-gray-200 aspect-square">
            구역 3
          </div>

          {/* Area 4 */}
          <div className="flex items-center justify-center text-2xl bg-gray-200 aspect-square">
            구역 4
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 mt-12 text-white bg-gray-800">
        <div className="container px-6 mx-auto">
          <div className="text-sm">
            <p>번호: | 511-3389 |</p>
            <p>
              개발자: 호치 | 경남남도 창원시 마산회원구 충호로 27 | 연락:
              010-6209-6155 | 디스코드 ID : hochi__0905
            </p>
            <p>Email: 2000biglight@naver.com</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
