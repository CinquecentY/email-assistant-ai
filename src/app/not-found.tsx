import HomeLayout from '@/components/layout/home-layout'
import { Frown } from 'lucide-react'
import Link from 'next/link'
 
export default function NotFound() {
  return (
    <HomeLayout>
      <section className="flex flex-1 rounded-lg mx-2 flex-col items-center justify-center bg-background">
      <h2 className="text-2xl font-bold">Not Found</h2>
      <Frown size={40} className="mt-4 text-muted-foreground" />
      <p className="text-muted-foreground">Could not find requested resource</p>
      <Link href="/" className="text-blue-500 hover:underline">
        Return Home
      </Link>
      </section>
    </HomeLayout>
  )
}