import { RegisterForm } from "@/components/register-form"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="container flex h-16 items-center">
          <MainNav />
        </div>
      </header>
      <main className="flex-1 container max-w-md mx-auto py-12">
        <h1 className="text-2xl font-bold mb-6 text-center">Create an Account</h1>
        <RegisterForm />
      </main>
      <Footer />
    </div>
  )
}
