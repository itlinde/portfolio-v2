export default function Footer() {
  return (
    <div
      id="footer"
      className="bg-bg-inverse min-h-[70vh] w-full text-text-inverse flex flex-col p-6 pt-14 justify-between"
    >
      <div id="contact" className="flex flex-col gap-4">
        <hr className="border-line-inverse" />
        <p className="text-subtitle text-text-inverse">connect</p>
        <a
          href="mailto:isabellalinde1770@gmail.com"
          className="text-h3 text-text-inverse"
        >
          isabellalinde1770@gmail.com
        </a>
        <a
          href="https://www.linkedin.com/in/isabellalinde/"
          className="text-h3 text-text-inverse"
        >
          LinkedIn
        </a>
        <a
          href="https://github.com/itlinde"
          className="text-h3 text-text-inverse"
        >
          Github
        </a>
      </div>
      <div id="footer-bottom" className="flex flex-col gap-4">
        <p className="text-subtitle text-text-inverse">
          made with next.js, figma, claude and lots of love :)
        </p>
        <hr className="border-line-inverse" />
        <div className="flex justify-between">
          <p className="text-subtitle">
            last updated:{" "}
            {
              /* TO DO: make this last updated string actually update */ 
              "september 07 2026"
            }
          </p>
          <a href="#top" className="flex items-center gap-1">
            <p className="text-subtitle">top</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="12" y1="19" x2="12" y2="5" />
              <polyline points="5 12 12 5 19 12" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
