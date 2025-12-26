import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Instagram, MessageSquare } from "lucide-react";

export function Integrations() {
  return (
    <section className="container mx-auto px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
          Connect Your Platforms
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Seamlessly integrate with Instagram and WhatsApp Business
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Card className="shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white/95 to-slate-50/90 backdrop-blur-md border border-slate-200/50 hover:border-blue-300/50 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/0 to-slate-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardHeader>
              <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center mb-4 shadow-lg">
                <Instagram className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Instagram</CardTitle>
              <CardDescription className="text-base">
                Auto-respond to comments and DMs. Turn engagement into sales with smart automation.
              </CardDescription>
            </CardHeader>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Card className="shadow-xl hover:shadow-2xl transition-all bg-white/80 backdrop-blur-sm border-2 border-green-200 hover:border-green-400">
            <CardHeader>
              <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-green-500 via-green-600 to-emerald-500 flex items-center justify-center mb-4 shadow-lg">
                <MessageSquare className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl">WhatsApp Business</CardTitle>
              <CardDescription className="text-base">
                Automate customer support and send product catalogs directly through WhatsApp.
              </CardDescription>
            </CardHeader>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
