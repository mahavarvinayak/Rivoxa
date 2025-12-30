import { Logo } from "@/components/Logo";
import { Github, Linkedin, Mail, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <Logo size="sm" />
              <span className="font-bold text-xl text-slate-900">ChatFlow AI</span>
            </div>
            <p className="text-slate-600 mb-6 max-w-sm">
              The complete automation platform for Instagram and WhatsApp. Scale your business with intelligent conversational AI.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-slate-400 hover:text-slate-900 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://www.linkedin.com/company/the-%CF%80-lab/" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-900 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-slate-900 transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="mailto:thepilab77@gmail.com" className="text-slate-400 hover:text-slate-900 transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Product</h3>
            <ul className="space-y-3 text-sm text-slate-600">
              <li><a href="/features" className="hover:text-blue-600 transition-colors">Features</a></li>
              <li><a href="/pricing" className="hover:text-blue-600 transition-colors">Pricing</a></li>
              <li><a href="/integrations" className="hover:text-blue-600 transition-colors">Integrations</a></li>
              <li><a href="/changelog" className="hover:text-blue-600 transition-colors">Changelog</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Company</h3>
            <ul className="space-y-3 text-sm text-slate-600">
              <li><a href="/about" className="hover:text-blue-600 transition-colors">About Us</a></li>
              <li><a href="/careers" className="hover:text-blue-600 transition-colors">Careers</a></li>
              <li><a href="/support" className="hover:text-blue-600 transition-colors">Support</a></li>
              <li><a href="/privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-200 text-center text-sm text-slate-500">
          <p>© 2024 ChatFlow AI by THE Π LAB. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}