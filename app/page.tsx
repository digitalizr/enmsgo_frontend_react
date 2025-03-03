import { redirect } from "next/navigation"

export default function Home() {
  // Redirect to the operations dashboard by default
  redirect("/operations/dashboard")
}

