import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, Target, TrendingUp, BarChart3, ArrowRight } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-gray-950 to-purple-900/20"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

      {/* Header */}
      <header className="relative z-10 border-b border-gray-800/50 backdrop-blur-xl bg-gray-950/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg">
              <Wallet className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Budgetin
            </span>
          </div>
          <div className="space-x-4">
            <Link href="/login">
              <Button
                variant="ghost"
                className="text-white hover:text-blue-400 hover:bg-white/5 transition-all duration-300"
              >
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-blue-500/25 transition-all duration-300">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">
                Take Control of Your
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Finances</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
              Budgetin helps you manage your budget, track expenses, and achieve your financial goals with an elegant,
              modern interface.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link href="/register">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-xl hover:shadow-blue-500/25 transition-all duration-300 group text-lg px-8 py-4"
                >
                  Start Managing Your Budget
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-gray-600 text-white hover:bg-white/5 backdrop-blur-sm transition-all duration-300 text-lg px-8 py-4"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 py-16 px-4 bg-gray-900/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Why Choose Budgetin?
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Experience the future of personal finance management with our cutting-edge features
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="bg-gray-900 border-gray-700 hover:bg-gray-800 transition-all duration-300 group">
              <CardHeader>
                <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500/20 to-blue-600/20 w-fit mb-4 group-hover:scale-110 transition-transform">
                  <Target className="h-8 w-8 text-blue-400" />
                </div>
                <CardTitle className="text-white">Budget Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300">
                  Create custom categories and set monthly budgets to stay on track with your financial goals.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700 hover:bg-gray-800 transition-all duration-300 group">
              <CardHeader>
                <div className="p-3 rounded-xl bg-gradient-to-r from-green-500/20 to-green-600/20 w-fit mb-4 group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-8 w-8 text-green-400" />
                </div>
                <CardTitle className="text-white">Track Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300">
                  Monitor your spending patterns and see how much budget remains in real-time with beautiful charts.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700 hover:bg-gray-800 transition-all duration-300 group">
              <CardHeader>
                <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500/20 to-purple-600/20 w-fit mb-4 group-hover:scale-110 transition-transform">
                  <Wallet className="h-8 w-8 text-purple-400" />
                </div>
                <CardTitle className="text-white">Simple Interface</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300">
                  Clean, minimalist design with glassmorphism effects that makes budget management effortless and
                  enjoyable.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700 hover:bg-gray-800 transition-all duration-300 group">
              <CardHeader>
                <div className="p-3 rounded-xl bg-gradient-to-r from-orange-500/20 to-orange-600/20 w-fit mb-4 group-hover:scale-110 transition-transform">
                  <BarChart3 className="h-8 w-8 text-orange-400" />
                </div>
                <CardTitle className="text-white">Real-time Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300">
                  Get instant insights into your spending habits and budget performance with real-time updates.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-16 px-4">
        <div className="container mx-auto">
          <Card className="backdrop-blur-xl bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-white/10 shadow-2xl">
            <CardContent className="text-center py-16 px-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Ready to Start Your Financial Journey?
              </h2>
              <p className="text-gray-300 mb-8 max-w-xl mx-auto text-lg">
                Join thousands of users who have taken control of their finances with Budgetin's modern approach.
              </p>
              <Link href="/register">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-xl hover:shadow-blue-500/25 transition-all duration-300 group"
                >
                  Create Your Account
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800/50 backdrop-blur-xl bg-gray-950/80 py-8 px-4">
        <div className="container mx-auto text-center text-gray-400">
          <p>&copy; 2025 Budgetin. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
