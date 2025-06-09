export default function Footer() {
  return (
    <footer className="bg-white border-t-4 border-black py-6 mt-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col md:flex-row items-center justify-between text-black font-bold">
          <div className="mb-4 md:mb-0">
            <span className="mr-6 uppercase">
              <a href="#" className="hover:text-[#ff3f3f] transition-colors duration-300">
                PRIVACY POLICY
              </a>
            </span>
            <span className="uppercase">
              <a href="#" className="hover:text-[#ff3f3f] transition-colors duration-300">
                TERMS OF SERVICE
              </a>
            </span>
          </div>
          <div className="flex items-center space-x-6 text-sm uppercase">
            <span className="font-mono">V0.1 (MVP)</span>
            <span>BUILT WITH TRAE IDE, NOVITA.AI, ZILLIZ</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
