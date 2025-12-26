import { Logo } from "@/components/Logo";

export function Footer() {
  return (
    <footer className="border-t border-slate-200/50 bg-gradient-to-br from-white/90 via-slate-50/80 to-blue-50/70 backdrop-blur-md py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 to-slate-400/5" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="flex items-center gap-3">
              <Logo size="sm" />
              <span className="font-semibold">ChatFlow AI</span>
            </div>
            <p className="text-sm text-muted-foreground text-center md:text-left">
              Automate your social commerce with intelligent AI-powered flows
            </p>
          </div>

          {/* About Section */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <h3 className="font-semibold text-sm">About Us</h3>
            <p className="text-sm text-muted-foreground text-center md:text-left">
              We are THE Π LAB, building innovative automation solutions for modern businesses.
            </p>
          </div>

          {/* Contact Section */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <h3 className="font-semibold text-sm">Get in Touch</h3>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <a 
                href="https://www.linkedin.com/company/the-%CF%80-lab/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors flex items-center gap-2"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                LinkedIn
              </a>
              <a 
                href="mailto:thepilab77@gmail.com" 
                className="hover:text-primary transition-colors flex items-center gap-2"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                thepilab77@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-slate-200 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 ChatFlow AI by THE Π LAB. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
