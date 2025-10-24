import Link from "next/link"
import { Briefcase, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function ModernFooter() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container px-4 py-12 md:px-6 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white">
                <Briefcase className="h-5 w-5 text-brand-blue" />
              </div>
              <span className="text-xl font-bold text-white">InteliHire</span>
            </Link>
            <p className="text-sm">
              AI-powered job matching platform for the Public Employment Service Office (PESO) under the City Government
              of Sto. Tomas.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="hover:text-white">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="hover:text-white">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="hover:text-white">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="hover:text-white">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/jobs" className="hover:text-white">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link href="/companies" className="hover:text-white">
                  Companies
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white">
                  About Us
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">About InteliHire</h3>
            <p className="text-sm">
              InteliHire is an AI-powered job matching platform designed to connect job seekers with their ideal opportunities in Sto. Tomas, Batangas. Our mission is to make job hunting smarter and more efficient.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Newsletter</h3>
            <p className="text-sm">Subscribe to our newsletter for the latest job opportunities</p>
            <div className="flex flex-col gap-2">
              <Input
                type="email"
                placeholder="Your email address"
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
              />
              <Button className="w-full">Subscribe</Button>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-800 pt-6 text-center text-sm">
          <p>© 2025 InteliHire. All rights reserved. A service of the City Government of Sto. Tomas.</p>
        </div>
      </div>
    </footer>
  )
}
