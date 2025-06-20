import { SignIn } from "@clerk/clerk-react"

export default function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold">Nexus Flow</h1>
          <p className="mt-2 text-muted-foreground">
            Sign in to access your workspace
          </p>
        </div>
        <SignIn
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "bg-background border border-border shadow-lg",
            },
          }}
        />
      </div>
    </div>
  )
} 