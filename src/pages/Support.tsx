import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  Mail, 
  MessageSquare, 
  Search,
  HelpCircle,
  FileText,
  Zap,
  Loader2
} from "lucide-react";
import { useNavigate } from "react-router";
import { Logo } from "@/components/Logo";

export default function Support() {
  const { isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const faqs = [
    {
      question: "How do I connect my Instagram account?",
      answer: "Go to the Integrations page, click 'Connect' on the Instagram card, and follow the Facebook login prompts. Make sure you have an Instagram Business account linked to a Facebook Page."
    },
    {
      question: "Why aren't my auto-replies working?",
      answer: "Check if your integration is active in the Dashboard. Ensure your Instagram account is a Business account and that you've granted all necessary permissions during the connection process."
    },
    {
      question: "Can I use this with a personal Instagram account?",
      answer: "No, Instagram Automation is only available for Business and Creator accounts due to Meta's API limitations."
    },
    {
      question: "What happens if I reach my message limit?",
      answer: "If you're on a plan with limits, automation will pause until the next day or until you upgrade your plan. We'll notify you when you're close to the limit."
    },
    {
      question: "How do I cancel my subscription?",
      answer: "You can manage your subscription in the Settings page under the Billing tab. You can cancel at any time."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-3xl opacity-30"
          style={{ background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 70%)' }}
          animate={{
            y: [0, 50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-3xl opacity-30"
          style={{ background: 'radial-gradient(circle, rgba(147, 51, 234, 0.3) 0%, transparent 70%)' }}
          animate={{
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-xl shadow-lg sticky top-0 z-50 border-slate-200/50 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-white/60 via-blue-50/40 to-white/60 backdrop-blur-xl" />
        <div className="container mx-auto px-4 py-4 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <Logo size="md" />
            <span className="text-xl font-bold tracking-tight text-slate-900">ChatFlow AI</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/pricing")}>Pricing</Button>
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : isAuthenticated ? (
              <Button onClick={() => navigate("/dashboard")} className="shadow-md">
                Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={() => navigate("/auth")} className="shadow-md">
                Sign In
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6 shadow-sm">
            <HelpCircle className="h-4 w-4" />
            Help Center
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-slate-900">
            How can we help you?
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Find answers, read documentation, or get in touch with our support team.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
            <Input 
              type="text" 
              placeholder="Search for answers..." 
              className="pl-10 h-12 text-lg shadow-lg border-slate-200 focus:ring-2 focus:ring-blue-500 bg-white/80 backdrop-blur-sm"
            />
          </div>
        </motion.div>
      </section>

      {/* Support Options */}
      <section className="container mx-auto px-4 pb-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="h-full shadow-xl hover:shadow-2xl transition-all duration-300 bg-white/80 backdrop-blur-md border-slate-200/50 hover:border-blue-300/50 group cursor-pointer">
              <CardHeader>
                <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                  <FileText className="h-6 w-6" />
                </div>
                <CardTitle>Documentation</CardTitle>
                <CardDescription>Detailed guides and API references</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Learn how to set up integrations, create flows, and use advanced features.
                </p>
                <Button variant="link" className="p-0 h-auto text-blue-600">
                  Browse Docs <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="h-full shadow-xl hover:shadow-2xl transition-all duration-300 bg-white/80 backdrop-blur-md border-slate-200/50 hover:border-purple-300/50 group cursor-pointer">
              <CardHeader>
                <div className="h-12 w-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 mb-4 group-hover:scale-110 transition-transform">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <CardTitle>Community</CardTitle>
                <CardDescription>Join the conversation</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Connect with other users, share tips, and get help from the community.
                </p>
                <Button variant="link" className="p-0 h-auto text-purple-600">
                  Join Discord <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="h-full shadow-xl hover:shadow-2xl transition-all duration-300 bg-white/80 backdrop-blur-md border-slate-200/50 hover:border-green-300/50 group cursor-pointer">
              <CardHeader>
                <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center text-green-600 mb-4 group-hover:scale-110 transition-transform">
                  <Mail className="h-6 w-6" />
                </div>
                <CardTitle>Email Support</CardTitle>
                <CardDescription>Get direct assistance</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Our team typically responds within 24 hours for all inquiries.
                </p>
                <a href="mailto:thepilab77@gmail.com" className="text-sm font-medium text-green-600 hover:underline flex items-center">
                  thepilab77@gmail.com <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
            <Card className="shadow-lg border-slate-200/50 bg-white/90 backdrop-blur-sm">
              <CardContent className="pt-6">
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left text-lg font-medium hover:text-blue-600 transition-colors">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Contact Form */}
        <div className="max-w-2xl mx-auto mt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="shadow-2xl border-slate-200/50 bg-gradient-to-br from-white/95 to-blue-50/90 backdrop-blur-md overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Still need help?</CardTitle>
                <CardDescription>Send us a message and we'll get back to you shortly.</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" placeholder="Your name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="your@email.com" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" placeholder="How can we help?" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" placeholder="Describe your issue..." rows={4} />
                  </div>
                  <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200/50 bg-white/80 backdrop-blur-md py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 ChatFlow AI by THE Π LAB. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
